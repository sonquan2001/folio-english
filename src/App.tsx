import { useEffect, useMemo, useState } from 'react';
import { TOPICS, type Topic } from './data/topics';
import { dayNum, emptyDay, load, newId, plan, save, type DayLog, type Rating, type Saved, type Word } from './lib/store';
import { BookOpen, ChartLine, Compass, House, Layers } from './icons';
import { Home } from './screens/Home';
import { Topics, TopicDetail } from './screens/Topics';
import { Review } from './screens/Review';
import { Book } from './screens/Book';
import { Stats } from './screens/Stats';
import { AddWordSheet } from './screens/AddWordSheet';

/** Settings that were tweakable props in the design. */
export const SETTINGS = {
  dailyGoal: 20,
  cardDirection: 'en-vi' as 'en-vi' | 'vi-en',
  showIPA: true,
};

export type Tab = 'home' | 'topics' | 'topic' | 'review' | 'book' | 'stats';

export interface Ctx {
  words: Word[];
  log: Record<number, DayLog>;
  today: number;
  todayLog: DayLog;
  dueCount: number;
  queue: string[] | null;
  total: number;
  go: (t: Tab) => void;
  goReview: () => void;
  openTopic: (id: string) => void;
  topic: Topic | null;
  openAdd: () => void;
  rate: (kind: Rating) => void;
  addTopicWords: (t: Topic) => void;
  deleteWord: (id: string) => void;
  markListened: () => void;
  inBook: (w: string) => boolean;
}

export default function App() {
  const [saved, setSaved] = useState<Saved>(load);
  const [tab, setTab] = useState<Tab>('home');
  const [topicId, setTopicId] = useState<string | null>(null);
  const [queue, setQueue] = useState<string[] | null>(null);
  const [total, setTotal] = useState(0);
  const [adding, setAdding] = useState(false);
  const [today, setToday] = useState(dayNum);

  // Keep "today" correct if the app stays open past midnight / is resumed the next day.
  useEffect(() => {
    const tick = () => setToday(dayNum());
    const id = window.setInterval(tick, 60_000);
    document.addEventListener('visibilitychange', tick);
    return () => { window.clearInterval(id); document.removeEventListener('visibilitychange', tick); };
  }, []);

  useEffect(() => save(saved), [saved]);

  const { words, log } = saved;
  const todayLog = log[today] ?? emptyDay();

  const patchDay = (s: Saved, patch: (d: DayLog) => Partial<DayLog>): Saved => {
    const d = s.log[today] ?? emptyDay();
    return { ...s, log: { ...s.log, [today]: { ...d, ...patch(d) } } };
  };

  const buildQueue = () =>
    words.filter((w) => w.dueDay <= today).sort((a, b) => a.box - b.box).map((w) => w.id);

  const dueCount = queue ? queue.length : words.filter((w) => w.dueDay <= today).length;

  const bookIndex = useMemo(() => new Set(words.map((w) => w.w.trim().toLowerCase())), [words]);

  const ctx: Ctx = {
    words, log, today, todayLog, dueCount, queue, total,
    go: (t) => setTab(t),
    goReview: () => {
      if (!queue || !queue.length) {
        const q = buildQueue();
        setQueue(q);
        setTotal(q.length);
      }
      setTab('review');
    },
    openTopic: (id) => { setTopicId(id); setTab('topic'); },
    topic: TOPICS.find((t) => t.id === topicId) ?? null,
    openAdd: () => setAdding(true),
    rate: (kind) => {
      if (!queue || !queue.length) return;
      const id = queue[0];
      const next = queue.slice(1);
      if (kind === 'again') next.push(id);
      setQueue(next);
      setSaved((s) => patchDay({
        ...s,
        words: s.words.map((w) => {
          if (w.id !== id) return w;
          const p = plan(w.box, kind);
          return { ...w, box: p.box, dueDay: today + p.due };
        }),
      }, (d) => ({ reviewed: d.reviewed + 1 })));
    },
    addTopicWords: (t) => {
      const fresh: Word[] = t.words
        .filter((tw) => !bookIndex.has(tw.w.toLowerCase()))
        .map((tw) => ({ ...tw, id: newId(), box: 0, dueDay: today }));
      if (!fresh.length) return;
      setSaved((s) => ({ ...s, words: s.words.concat(fresh) }));
      if (queue) { setQueue(queue.concat(fresh.map((w) => w.id))); setTotal(total + fresh.length); }
    },
    deleteWord: (id) => {
      setSaved((s) => ({ ...s, words: s.words.filter((w) => w.id !== id) }));
      if (queue) setQueue(queue.filter((q) => q !== id));
    },
    markListened: () => setSaved((s) => patchDay(s, () => ({ listened: true }))),
    inBook: (w) => bookIndex.has(w.trim().toLowerCase()),
  };

  const saveWord = (d: { w: string; vi: string; ex: string }) => {
    const word: Word = { id: newId(), w: d.w.trim(), ipa: '', pos: 'mới', vi: d.vi.trim(), ex: d.ex.trim(), box: 0, dueDay: today };
    setSaved((s) => patchDay({ ...s, words: [word].concat(s.words) }, (x) => ({ added: x.added + 1 })));
    if (queue) { setQueue(queue.concat([word.id])); setTotal(total + 1); }
    setAdding(false);
    if (tab === 'review') setTab('book');
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode; on: boolean; onClick: () => void }[] = [
    { id: 'home', label: 'Hôm nay', icon: <House size={22} sw={1.5} />, on: tab === 'home', onClick: () => setTab('home') },
    { id: 'topics', label: 'Chủ đề', icon: <Compass size={22} sw={1.5} />, on: tab === 'topics' || tab === 'topic', onClick: () => setTab('topics') },
    { id: 'review', label: 'Ôn tập', icon: <Layers size={22} sw={1.5} />, on: tab === 'review', onClick: ctx.goReview },
    { id: 'book', label: 'Sổ từ', icon: <BookOpen size={22} sw={1.5} />, on: tab === 'book', onClick: () => setTab('book') },
    { id: 'stats', label: 'Tiến độ', icon: <ChartLine size={22} sw={1.5} />, on: tab === 'stats', onClick: () => setTab('stats') },
  ];

  return (
    <div className="stage">
      <div className="frame">
        <div className="statusbar"><span className="brand">Folio</span></div>

        <div className="scroll" key={tab === 'topic' ? `topic-${topicId}` : tab}>
          {tab === 'home' && <Home ctx={ctx} />}
          {tab === 'topics' && <Topics ctx={ctx} />}
          {tab === 'topic' && ctx.topic && <TopicDetail ctx={ctx} topic={ctx.topic} />}
          {tab === 'review' && <Review ctx={ctx} />}
          {tab === 'book' && <Book ctx={ctx} />}
          {tab === 'stats' && <Stats ctx={ctx} />}
        </div>

        <nav className="tabbar">
          {tabs.map((t) => (
            <button key={t.id} className={'tab' + (t.on ? ' on' : '')} onClick={t.onClick} aria-current={t.on ? 'page' : undefined}>
              {t.icon}{t.label}
              {t.id === 'review' && dueCount > 0 && <span className="badge">{dueCount}</span>}
            </button>
          ))}
        </nav>

        {adding && <AddWordSheet onClose={() => setAdding(false)} onSave={saveWord} exists={ctx.inBook} />}
      </div>
    </div>
  );
}

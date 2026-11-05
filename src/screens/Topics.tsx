import type { Ctx } from '../App';
import { TOPICS, type Topic } from '../data/topics';
import { speak, speakAll } from '../lib/speech';
import { Check, ChevronLeft, Volume1 } from '../icons';

const num = (i: number) => String(i + 1).padStart(2, '0');

function progressOf(ctx: Ctx, t: Topic) {
  const n = t.words.filter((w) => ctx.inBook(w.w)).length;
  return { n, total: t.words.length, pct: (n / t.words.length) * 100 + '%' };
}

export function Topics({ ctx }: { ctx: Ctx }) {
  return (
    <div className="col" style={{ gap: 18 }}>
      <div>
        <div className="kicker">Topics · Chủ đề</div>
        <h1 className="title">Học theo chủ đề</h1>
        <p className="muted" style={{ margin: '8px 0 0', fontSize: 13.5, lineHeight: 1.5, textWrap: 'pretty' }}>
          Mỗi chủ đề khoảng 15 phút: từ vựng, mẫu câu và một đoạn hội thoại ngắn.
        </p>
      </div>
      <div className="ruled">
        {TOPICS.map((t, i) => {
          const p = progressOf(ctx, t);
          return (
            <button key={t.id} className="row-btn hoverable topic-row" onClick={() => ctx.openTopic(t.id)}>
              <span className="topic-num">{num(i)}</span>
              <span className="col" style={{ gap: 2, minWidth: 0 }}>
                <span className="topic-en">{t.en}</span>
                <span className="muted" style={{ fontSize: 13 }}>{t.vi} · {t.words.length} từ · {t.mins} phút</span>
              </span>
              <span className="col" style={{ alignItems: 'flex-end', gap: 5 }}>
                <span className="tnum" style={{ fontSize: 12, color: 'var(--color-neutral-800)' }}>{p.n}/{p.total}</span>
                <span className="bar" style={{ width: 44 }}><span style={{ width: p.pct }} /></span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TopicDetail({ ctx, topic }: { ctx: Ctx; topic: Topic }) {
  const idx = TOPICS.indexOf(topic);
  const p = progressOf(ctx, topic);
  const missing = p.total - p.n;
  const allIn = missing === 0;

  return (
    <div className="col" style={{ gap: 22 }}>
      <button className="btn btn-ghost" onClick={() => ctx.go('topics')} style={{ alignSelf: 'flex-start', marginLeft: -6, fontSize: 13 }}>
        <ChevronLeft size={16} />Chủ đề
      </button>
      <div style={{ marginTop: -10 }}>
        <div className="kicker tnum">Chủ đề {num(idx)} · {topic.mins} phút</div>
        <h1 className="title title-lg">{topic.en}</h1>
        <div style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontSize: 20, color: 'var(--color-neutral-700)', marginTop: 2 }}>{topic.vi}</div>
      </div>

      <div className="col">
        <div className="section-head">
          <span className="section-title">I. Words <em>· Từ vựng</em></span>
          <span className="muted tnum" style={{ fontSize: 12 }}>{p.n}/{p.total} trong sổ</span>
        </div>
        {topic.words.map((w) => (
          <div key={w.w} className="line" style={{ padding: '11px 0' }}>
            <span className="col" style={{ flex: 1, minWidth: 0, gap: 1 }}>
              <span style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <span className="word-w">{w.w}</span>
                <span style={{ fontSize: 12, color: 'var(--color-neutral-600)' }}>{w.ipa}</span>
              </span>
              <span style={{ fontSize: 13.5, color: 'var(--color-neutral-800)' }}>
                <span style={{ fontStyle: 'italic', color: 'var(--color-neutral-600)' }}>{w.pos}</span> {w.vi}
              </span>
            </span>
            {ctx.inBook(w.w) && (
              <span title="Đã có trong sổ" style={{ color: 'var(--color-accent-700)', display: 'flex' }}><Check size={16} sw={1.8} /></span>
            )}
            <button className="btn btn-ghost btn-icon" onClick={() => speak(w.w)} aria-label={`Nghe “${w.w}”`} style={{ width: 40, height: 40 }}>
              <Volume1 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="col">
        <div className="section-head"><span className="section-title">II. Phrases <em>· Mẫu câu</em></span></div>
        {topic.phrases.map(([en, vi]) => (
          <div key={en} className="line" style={{ padding: '12px 0' }}>
            <span className="col" style={{ flex: 1, gap: 3 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontSize: 20, lineHeight: 1.2 }}>{en}</span>
              <span className="muted" style={{ fontSize: 13.5 }}>{vi}</span>
            </span>
            <button className="btn btn-ghost btn-icon" onClick={() => speak(en)} aria-label="Nghe" style={{ width: 40, height: 40 }}>
              <Volume1 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="col" style={{ gap: 12 }}>
        <div className="section-head" style={{ alignItems: 'center' }}>
          <span className="section-title">III. Dialogue <em>· Hội thoại</em></span>
          <button className="btn btn-ghost" onClick={() => speakAll(topic.dialog.map((d) => d[0]))} style={{ fontSize: 13, paddingBlock: 4 }}>
            Nghe cả đoạn
          </button>
        </div>
        {topic.dialog.map(([en, vi], i) => (
          <button key={i} className="dialog-line" onClick={() => speak(en)}>
            <span className="dialog-who">{i % 2 === 0 ? 'A' : 'B'}</span>
            <span className="col" style={{ gap: 2 }}>
              <span style={{ fontSize: 15, lineHeight: 1.45 }}>{en}</span>
              <span className="muted" style={{ fontSize: 13, lineHeight: 1.4 }}>{vi}</span>
            </span>
          </button>
        ))}
      </div>

      <button className="btn btn-primary" onClick={() => ctx.addTopicWords(topic)} disabled={allIn} style={{ minHeight: 48, fontSize: 15 }}>
        {allIn ? 'Đã thêm tất cả từ vào sổ' : `Thêm ${missing} từ vào sổ để ôn`}
      </button>
    </div>
  );
}

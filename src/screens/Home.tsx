import { useState } from 'react';
import type { Ctx } from '../App';
import { SETTINGS } from '../App';
import { DAILY_SENTENCES } from '../data/topics';
import { speak } from '../lib/speech';
import { Check, ChevronRight, Volume2 } from '../icons';

const DAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

export function Home({ ctx }: { ctx: Ctx }) {
  const [showVi, setShowVi] = useState(false);
  const { todayLog, dueCount, words } = ctx;
  const goal = SETTINGS.dailyGoal;
  const now = new Date();
  const [sentence, sentenceVi] = DAILY_SENTENCES[ctx.today % DAILY_SENTENCES.length];

  const doneReview = todayLog.reviewed > 0 && dueCount === 0;
  const tasks = [
    {
      title: 'Ôn thẻ đến hạn',
      sub: doneReview ? `Đã ôn ${todayLog.reviewed} thẻ` : `${dueCount} thẻ · khoảng ${Math.max(1, Math.round(dueCount * 0.4))} phút`,
      done: doneReview, onClick: ctx.goReview,
    },
    { title: 'Ghi 3 từ mới vào sổ', sub: `${Math.min(3, todayLog.added)} / 3 từ bạn gặp hôm nay`, done: todayLog.added >= 3, onClick: ctx.openAdd },
    {
      title: 'Nghe & nhắc lại câu của ngày',
      sub: todayLog.listened ? 'Đã nghe' : 'Bấm để nghe, rồi đọc to theo',
      done: todayLog.listened, onClick: () => { speak(sentence); ctx.markListened(); },
    },
  ];

  const hardWord = words.slice().sort((a, b) => a.box - b.box)[0];

  return (
    <div className="col" style={{ gap: 22 }}>
      <div>
        <div className="kicker">{DAYS[now.getDay()]} · {now.getDate()} tháng {now.getMonth() + 1}</div>
        <h1 className="title title-xl">Hôm nay</h1>
      </div>

      <div className="col" style={{ gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 13 }}>
          <span className="muted">Mục tiêu ôn thẻ</span>
          <span className="tnum"><span style={{ fontFamily: 'var(--font-heading)', fontSize: 22 }}>{todayLog.reviewed}</span> / {goal}</span>
        </div>
        <div className="bar"><span style={{ width: Math.min(100, (todayLog.reviewed / goal) * 100) + '%' }} /></div>
      </div>

      <div className="ruled">
        {tasks.map((t) => (
          <button key={t.title} className="row-btn hoverable task" onClick={t.onClick}>
            <span className={'task-ring' + (t.done ? ' done' : '')}>{t.done && <Check size={14} sw={2} />}</span>
            <span className="col" style={{ flex: 1, gap: 2 }}>
              <span className="task-title" style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</span>
              <span className="task-sub">{t.sub}</span>
            </span>
            <ChevronRight size={16} stroke="var(--color-neutral-500)" />
          </button>
        ))}
      </div>

      <div className="quote-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="kicker-sm">Câu của ngày</span>
          <button className="btn btn-ghost btn-icon" onClick={() => speak(sentence)} aria-label="Nghe" style={{ width: 36, height: 36 }}>
            <Volume2 size={18} />
          </button>
        </div>
        <p className="quote">“{sentence}”</p>
        {showVi && <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--color-neutral-800)' }}>{sentenceVi}</p>}
        <button className="btn btn-ghost" onClick={() => setShowVi(!showVi)} style={{ alignSelf: 'flex-start', fontSize: 13 }}>
          {showVi ? 'Ẩn nghĩa' : 'Xem nghĩa tiếng Việt'}
        </button>
      </div>

      {hardWord && (
        <div className="col" style={{ gap: 6, paddingTop: 4 }}>
          <span className="kicker-sm">Từ đang khó nhớ</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 30, lineHeight: 1.1 }}>{hardWord.w}</span>
            <span className="muted" style={{ fontSize: 13 }}>{hardWord.ipa}</span>
          </div>
          <span style={{ fontSize: 14, color: 'var(--color-neutral-800)' }}>{hardWord.vi}</span>
        </div>
      )}
    </div>
  );
}

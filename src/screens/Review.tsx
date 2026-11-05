import { useState } from 'react';
import type { Ctx } from '../App';
import { SETTINGS } from '../App';
import { fmtDue, plan, type Rating } from '../lib/store';
import { speak } from '../lib/speech';
import { Volume2 } from '../icons';

const LABELS: Record<Rating, string> = { again: 'Quên', hard: 'Khó', good: 'Nhớ', easy: 'Dễ' };

export function Review({ ctx }: { ctx: Ctx }) {
  const [flipped, setFlipped] = useState(false);
  const { queue, words, total } = ctx;
  const remaining = queue ? queue.length : ctx.dueCount;
  const cw = queue && queue.length ? words.find((w) => w.id === queue[0]) ?? null : null;
  const dir = SETTINGS.cardDirection;

  const rate = (k: Rating) => { setFlipped(false); ctx.rate(k); };

  return (
    <div className="col" style={{ gap: 18, minHeight: '100%' }}>
      <div className="head-row">
        <div>
          <div className="kicker">Ôn tập</div>
          <h1 className="title">Thẻ đến hạn</h1>
        </div>
        <span className="muted tnum" style={{ fontSize: 13 }}>còn {remaining}</span>
      </div>
      <div className="bar" style={{ height: 2 }}>
        <span style={{ width: (total ? (1 - remaining / Math.max(total, 1)) * 100 : 100) + '%' }} />
      </div>

      {cw ? (() => {
        const front = dir === 'en-vi' ? cw.w : cw.vi;
        const back = dir === 'en-vi' ? cw.vi : cw.w;
        const showSub = SETTINGS.showIPA && !!cw.ipa && (dir === 'en-vi' || flipped);
        return (
          <div className="col" style={{ gap: 16 }}>
            <div
              className="flashcard" role="button" tabIndex={0} aria-label={flipped ? 'Mặt sau thẻ' : 'Chạm để lật thẻ'}
              onClick={() => setFlipped(!flipped)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped(!flipped); } }}
            >
              <span className="tag tag-accent">{cw.pos}</span>
              <div className="card-front" style={{ fontSize: front.length > 14 ? 34 : 46 }}>{front}</div>
              {showSub && <div className="muted" style={{ fontSize: 14 }}>{cw.ipa}</div>}
              <button className="btn btn-ghost btn-icon" aria-label="Phát âm" onClick={(e) => { e.stopPropagation(); speak(cw.w); }}>
                <Volume2 size={20} />
              </button>
              {flipped ? (
                <div className="col" style={{ alignItems: 'center', gap: 10, width: '100%' }}>
                  <div style={{ width: 48, height: 1, background: 'var(--color-accent)' }} />
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 22, lineHeight: 1.2 }}>{back}</div>
                  {cw.ex && (
                    <div style={{ fontSize: 14, lineHeight: 1.5, fontStyle: 'italic', color: 'var(--color-neutral-800)', textWrap: 'pretty' }}>{cw.ex}</div>
                  )}
                </div>
              ) : (
                <div style={{ fontSize: 12, color: 'var(--color-neutral-600)' }}>Chạm để lật thẻ</div>
              )}
            </div>
            {flipped ? (
              <div className="ratings">
                {(['again', 'hard', 'good', 'easy'] as Rating[]).map((k) => (
                  <button key={k} className={k === 'good' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => rate(k)}>
                    <span style={{ fontSize: 14 }}>{LABELS[k]}</span>
                    <span className="tnum" style={{ fontSize: 11, opacity: 0.75 }}>{fmtDue(plan(cw.box, k).due)}</span>
                  </button>
                ))}
              </div>
            ) : (
              <button className="btn btn-primary" onClick={() => setFlipped(true)} style={{ minHeight: 48, fontSize: 15 }}>Lật thẻ</button>
            )}
          </div>
        );
      })() : (
        <div className="col" style={{ flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 14, padding: '40px 8px' }}>
          <div className="tnum" style={{ fontFamily: 'var(--font-heading)', fontSize: 72, lineHeight: 1, color: 'var(--color-accent)' }}>{ctx.todayLog.reviewed}</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 26, lineHeight: 1.2 }}>Xong phần ôn hôm nay</div>
          <p className="muted" style={{ margin: 0, fontSize: 14, lineHeight: 1.55, maxWidth: 270 }}>
            Không còn thẻ nào đến hạn. Thẻ tiếp theo sẽ xuất hiện vào ngày mai.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-secondary" onClick={() => ctx.go('home')} style={{ minHeight: 44 }}>Trang chủ</button>
            <button className="btn btn-primary" onClick={ctx.openAdd} style={{ minHeight: 44 }}>Thêm từ mới</button>
          </div>
        </div>
      )}
    </div>
  );
}

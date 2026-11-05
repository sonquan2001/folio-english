import { useState } from 'react';
import type { Ctx } from '../App';
import { fmtDue, levelOf, type Word } from '../lib/store';
import { speak } from '../lib/speech';
import { Plus, Search } from '../icons';

type Filter = 'all' | 'learning' | 'known' | 'mastered';
const FILTERS: [Filter, string][] = [['all', 'Tất cả'], ['learning', 'Đang học'], ['known', 'Quen'], ['mastered', 'Đã thuộc']];

const matches = (f: Filter, w: Word) =>
  f === 'learning' ? w.box <= 2 : f === 'known' ? w.box >= 3 && w.box < 5 : f === 'mastered' ? w.box === 5 : true;

export function Book({ ctx }: { ctx: Ctx }) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const ql = q.trim().toLowerCase();
  const rows = ctx.words.filter((w) =>
    (!ql || w.w.toLowerCase().includes(ql) || w.vi.toLowerCase().includes(ql)) && matches(filter, w));

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="head-row">
        <div>
          <div className="kicker tnum">{ctx.words.length} từ</div>
          <h1 className="title">Sổ từ vựng</h1>
        </div>
        <button className="btn btn-primary btn-icon" onClick={ctx.openAdd} aria-label="Thêm từ" style={{ width: 44, height: 44 }}>
          <Plus size={20} />
        </button>
      </div>

      <div style={{ position: 'relative' }}>
        <Search size={16} stroke="var(--color-neutral-600)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input className="input" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm từ hoặc nghĩa…"
          style={{ paddingLeft: 36, minHeight: 44, fontSize: 15 }} />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {FILTERS.map(([k, l]) => (
          <button key={k} className={'chip' + (filter === k ? ' on' : '')} onClick={() => setFilter(k)} aria-pressed={filter === k}>{l}</button>
        ))}
      </div>

      <div className="ruled">
        {rows.map((w) => {
          const open = openId === w.id;
          const due = w.dueDay - ctx.today;
          return (
            <div key={w.id} style={{ borderBottom: '1px solid var(--color-divider)' }}>
              <button className="row-btn" onClick={() => setOpenId(open ? null : w.id)} aria-expanded={open}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: 0 }}>
                <span className="col" style={{ flex: 1, minWidth: 0, gap: 2 }}>
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span className="word-w">{w.w}</span>
                    <span style={{ fontSize: 11.5, fontStyle: 'italic', color: 'var(--color-neutral-600)' }}>{w.pos}</span>
                  </span>
                  <span style={{ fontSize: 13.5, color: 'var(--color-neutral-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.vi}</span>
                </span>
                <span className="dots" title={levelOf(w.box)}>
                  {[1, 2, 3, 4, 5].map((n) => <span key={n} className={n <= w.box ? 'on' : ''} />)}
                </span>
              </button>
              {open && (
                <div className="col" style={{ gap: 10, padding: '0 0 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {w.ipa && <span className="muted" style={{ fontSize: 13 }}>{w.ipa}</span>}
                    <span className="tag tag-accent">{levelOf(w.box)}</span>
                    <span className="tag tag-neutral">{due <= 0 ? 'Đến hạn hôm nay' : `Ôn sau ${fmtDue(due)}`}</span>
                  </div>
                  {w.ex && <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, fontStyle: 'italic', color: 'var(--color-neutral-800)' }}>{w.ex}</p>}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary" onClick={() => speak(w.w)} style={{ minHeight: 40 }}>Nghe</button>
                    <button className="btn btn-ghost" style={{ minHeight: 40, color: 'var(--color-neutral-700)' }}
                      onClick={() => { if (confirm(`Xoá “${w.w}” khỏi sổ?`)) { ctx.deleteWord(w.id); setOpenId(null); } }}>
                      Xoá
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {rows.length === 0 && <p className="muted" style={{ margin: 0, padding: '24px 0', textAlign: 'center', fontSize: 14 }}>Không tìm thấy từ nào.</p>}
    </div>
  );
}

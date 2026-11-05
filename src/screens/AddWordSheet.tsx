import { useEffect, useRef, useState } from 'react';
import { X } from '../icons';

interface Draft { w: string; vi: string; ex: string }

export function AddWordSheet({ onClose, onSave, exists }: {
  onClose: () => void;
  onSave: (d: Draft) => void;
  exists: (w: string) => boolean;
}) {
  const [d, setD] = useState<Draft>({ w: '', vi: '', ex: '' });
  const first = useRef<HTMLInputElement>(null);
  const set = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement>) => setD({ ...d, [k]: e.target.value });
  const canSave = !!(d.w.trim() && d.vi.trim());
  const dup = !!d.w.trim() && exists(d.w);

  useEffect(() => {
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="sheet-backdrop">
      <div onClick={onClose} style={{ flex: 1 }} />
      <form className="sheet" role="dialog" aria-modal="true" aria-labelledby="add-title"
        onSubmit={(e) => { e.preventDefault(); if (canSave) onSave(d); }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 id="add-title" style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 24 }}>Thêm từ mới</h2>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Đóng" style={{ color: 'var(--color-neutral-700)' }}>
            <X size={20} />
          </button>
        </div>
        <label className="col" style={{ gap: 6 }}>
          <span className="field-label">Từ / cụm từ tiếng Anh</span>
          <input ref={first} className="input" value={d.w} onChange={set('w')} placeholder="vd. take for granted" autoCapitalize="none" autoCorrect="off" />
          {dup && <span style={{ fontSize: 12, color: 'var(--color-accent-700)' }}>Từ này đã có trong sổ.</span>}
        </label>
        <label className="col" style={{ gap: 6 }}>
          <span className="field-label">Nghĩa tiếng Việt</span>
          <input className="input" value={d.vi} onChange={set('vi')} placeholder="vd. coi là điều hiển nhiên" />
        </label>
        <label className="col" style={{ gap: 6 }}>
          <span className="field-label">Câu ví dụ (tuỳ chọn)</span>
          <input className="input" value={d.ex} onChange={set('ex')} placeholder="Câu bạn gặp từ này" />
        </label>
        <button type="submit" className="btn btn-primary" disabled={!canSave} style={{ minHeight: 48, fontSize: 15, marginTop: 4 }}>Lưu vào sổ</button>
      </form>
    </div>
  );
}

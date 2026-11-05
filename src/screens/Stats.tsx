import type { Ctx } from '../App';
import { SETTINGS } from '../App';
import { streakOf, type Word } from '../lib/store';

const DOWS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const HEAT_BG = ['transparent', 'var(--color-accent-200)', 'var(--color-accent-400)', 'var(--color-accent-600)'];
const GROUPS: [string, (w: Word) => boolean][] = [
  ['Mới', (w) => w.box === 0],
  ['Đang học', (w) => w.box > 0 && w.box <= 2],
  ['Quen', (w) => w.box >= 3 && w.box <= 4],
  ['Đã thuộc', (w) => w.box === 5],
];

export function Stats({ ctx }: { ctx: Ctx }) {
  const { words, log, today, todayLog } = ctx;
  const goal = SETTINGS.dailyGoal;
  const level = (n: number) => (n === 0 ? 0 : n < goal / 2 ? 1 : n < goal ? 2 : 3);

  // 5 Monday-first weeks ending with the current week.
  const mondayOffset = (new Date().getDay() + 6) % 7;
  const start = today - mondayOffset - 28;
  const heat = Array.from({ length: 35 }, (_, i) => {
    const d = start + i;
    if (d > today) return { bg: 'transparent', border: 'transparent' };
    const v = level(log[d]?.reviewed ?? 0);
    return { bg: HEAT_BG[v], border: d === today ? 'var(--color-text)' : v ? 'transparent' : 'var(--color-divider)' };
  });

  const kpis = [
    { v: words.length, l: 'từ trong sổ' },
    { v: words.filter((w) => w.box === 5).length, l: 'đã thuộc' },
    { v: todayLog.reviewed, l: 'thẻ hôm nay' },
  ];

  return (
    <div className="col" style={{ gap: 24 }}>
      <div>
        <div className="kicker">Tiến độ</div>
        <h1 className="title">Nhật ký học</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, paddingBottom: 18, borderBottom: '1px solid var(--color-divider)' }}>
        <span className="streak">{streakOf(log, today)}</span>
        <span style={{ fontSize: 14, lineHeight: 1.4, color: 'var(--color-neutral-800)', paddingBottom: 6 }}>ngày học<br />liên tiếp</span>
      </div>

      <div className="kpis">
        {kpis.map((k) => (
          <div key={k.l} className="kpi">
            <span className="tnum" style={{ fontFamily: 'var(--font-heading)', fontSize: 30, lineHeight: 1.1 }}>{k.v}</span>
            <span className="muted" style={{ fontSize: 12 }}>{k.l}</span>
          </div>
        ))}
      </div>

      <div className="col" style={{ gap: 10 }}>
        <span className="kicker-sm">5 tuần gần đây</span>
        <div className="heat">
          {DOWS.map((d) => <span key={d} className="dow">{d}</span>)}
          {heat.map((h, i) => <span key={i} className="cell" style={{ background: h.bg, borderColor: h.border }} />)}
        </div>
      </div>

      <div className="col" style={{ gap: 12 }}>
        <span className="kicker-sm">Mức độ ghi nhớ</span>
        {GROUPS.map(([label, f]) => {
          const n = words.filter(f).length;
          return (
            <div key={label} className="mastery">
              <span>{label}</span>
              <span className="mastery-bar"><span style={{ width: (words.length ? (n / words.length) * 100 : 0) + '%' }} /></span>
              <span className="tnum" style={{ textAlign: 'right' }}>{n}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

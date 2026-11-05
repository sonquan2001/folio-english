import { TOPICS } from '../data/topics';

export interface Word {
  id: string;
  w: string;
  ipa: string;
  pos: string;
  vi: string;
  ex: string;
  topic?: string;
  /** Leitner box 0–5 (0 = new, 5 = mastered). */
  box: number;
  /** Local day number (see `dayNum`) on which the card is next due. */
  dueDay: number;
}

export interface DayLog {
  reviewed: number;
  added: number;
  listened: boolean;
}

export interface Saved {
  words: Word[];
  log: Record<number, DayLog>;
}

const KEY = 'folio-english-v1';

/** Days since epoch for the *local* calendar date. */
export function dayNum(d = new Date()): number {
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
}

export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export const emptyDay = (): DayLog => ({ reviewed: 0, added: 0, listened: false });

/** First run: the "Greetings" topic words, all new and due today. */
function seed(): Saved {
  const today = dayNum();
  return {
    words: TOPICS[0].words.map((w) => ({ ...w, id: newId(), box: 0, dueDay: today })),
    log: {},
  };
}

export function load(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as Saved;
      if (Array.isArray(s.words) && s.log && typeof s.log === 'object') return s;
    }
  } catch { /* storage unavailable or corrupt — start fresh */ }
  return seed();
}

export function save(s: Saved): void {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

// ── Spaced repetition (from the design) ──────────────────────────────────────

export type Rating = 'again' | 'hard' | 'good' | 'easy';
const IV = [0, 1, 3, 7, 14, 30];

export function plan(box: number, kind: Rating): { box: number; due: number } {
  if (kind === 'again') return { box: 0, due: 0 };
  if (kind === 'hard') return { box: Math.max(1, box), due: 1 };
  if (kind === 'good') { const b = Math.min(5, box + 1); return { box: b, due: IV[b] }; }
  const b = Math.min(5, box + 2); return { box: b, due: IV[b] * 2 };
}

export const fmtDue = (d: number) => (d === 0 ? '< 10 phút' : d < 30 ? d + ' ngày' : Math.round(d / 30) + ' tháng');

export const levelOf = (box: number) => (box === 0 ? 'Mới' : box <= 2 ? 'Đang học' : box <= 4 ? 'Quen' : 'Đã thuộc');

export const sameWord = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** Consecutive days with at least one reviewed card, ending today (or yesterday if today is still empty). */
export function streakOf(log: Record<number, DayLog>, today: number): number {
  let d = (log[today]?.reviewed ?? 0) > 0 ? today : today - 1;
  let n = 0;
  while ((log[d]?.reviewed ?? 0) > 0) { n++; d--; }
  return n;
}

// Lucide icons, inlined exactly as the design draws them.
import type { ReactNode } from 'react';

function Svg({ size = 24, sw = 1.6, stroke = 'currentColor', children, style }: {
  size?: number; sw?: number; stroke?: string; children: ReactNode; style?: React.CSSProperties;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw}
      strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      {children}
    </svg>
  );
}

type P = { size?: number; sw?: number; stroke?: string; style?: React.CSSProperties };

const speakerBody = 'M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z';

export const Check = (p: P) => <Svg {...p}><path d="M20 6 9 17l-5-5" /></Svg>;
export const ChevronRight = (p: P) => <Svg {...p}><path d="m9 18 6-6-6-6" /></Svg>;
export const ChevronLeft = (p: P) => <Svg {...p}><path d="m15 18-6-6 6-6" /></Svg>;
export const Volume1 = (p: P) => <Svg {...p}><path d={speakerBody} /><path d="M16 9a5 5 0 0 1 0 6" /></Svg>;
export const Volume2 = (p: P) => (
  <Svg {...p}><path d={speakerBody} /><path d="M16 9a5 5 0 0 1 0 6" /><path d="M19.364 18.364a9 9 0 0 0 0-12.728" /></Svg>
);
export const Plus = (p: P) => <Svg {...p}><path d="M5 12h14" /><path d="M12 5v14" /></Svg>;
export const Search = (p: P) => <Svg {...p}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Svg>;
export const X = (p: P) => <Svg {...p}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Svg>;
export const House = (p: P) => (
  <Svg {...p}><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></Svg>
);
export const Compass = (p: P) => (
  <Svg {...p}><circle cx="12" cy="12" r="10" /><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" /></Svg>
);
export const Layers = (p: P) => (
  <Svg {...p}><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" /><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" /><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" /></Svg>
);
export const BookOpen = (p: P) => (
  <Svg {...p}><path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" /></Svg>
);
export const ChartLine = (p: P) => <Svg {...p}><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="m19 9-5 5-4-4-3 3" /></Svg>;

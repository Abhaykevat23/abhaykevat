const DOWN = [
  { line: 1, dur: 11, delay: -2 },
  { line: 3, dur: 8, delay: -6 },
  { line: 5, dur: 13, delay: -9 },
  { line: 9, dur: 9, delay: -1 },
  { line: 13, dur: 12, delay: -7 },
  { line: 17, dur: 10, delay: -4 },
  { line: 21, dur: 14, delay: -11 },
  { line: 25, dur: 9, delay: -3 },
  { line: 30, dur: 12, delay: -8 },
];

const ACROSS = [
  { line: 3, dur: 16, delay: -5 },
  { line: 8, dur: 21, delay: -13 },
  { line: 13, dur: 18, delay: -9 },
];

const vars = (s: { line: number; dur: number; delay: number }) =>
  ({ "--line": s.line, "--dur": `${s.dur}s`, "--delay": `${s.delay}s` }) as React.CSSProperties;

/** Fixed page background: colour glows, grid, and data streams travelling along grid lines. */
export function Backdrop() {
  return (
    <div aria-hidden className="backdrop">
      <span className="backdrop-glow g1" />
      <span className="backdrop-glow g2" />
      <span className="backdrop-glow g3" />
      <div className="backdrop-grid" />
      {DOWN.map((s) => (
        <span key={`d${s.line}`} className="backdrop-stream" style={vars(s)} />
      ))}
      {ACROSS.map((s) => (
        <span key={`a${s.line}`} className="backdrop-stream across" style={vars(s)} />
      ))}
    </div>
  );
}

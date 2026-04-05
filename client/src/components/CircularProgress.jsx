const R = 45;
const C = 2 * Math.PI * R;

export function CircularProgress({ progress }) {
  const p = Math.min(1, Math.max(0, progress));
  const offset = C * (1 - p);

  return (
    <svg className="circ-timer__svg" viewBox="0 0 100 100" aria-hidden>
      <defs>
        <linearGradient id="timerRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <circle className="circ-timer__track" cx="50" cy="50" r={R} />
      <circle
        className="circ-timer__fill"
        cx="50"
        cy="50"
        r={R}
        fill="none"
        stroke="url(#timerRingGrad)"
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={C}
        strokeDashoffset={offset}
        transform="rotate(-90 50 50)"
      />
    </svg>
  );
}

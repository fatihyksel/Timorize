import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const R = 45;
const C = 2 * Math.PI * R;

export function CircularProgress({ progress, size = 180 }) {
  const p = Math.min(1, Math.max(0, progress));
  const offset = C * (1 - p);

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="timerRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#93c5fd" />
          <Stop offset="100%" stopColor="#3b82f6" />
        </LinearGradient>
      </Defs>
      <Circle
        cx="50"
        cy="50"
        r={R}
        fill="none"
        stroke="rgba(255, 255, 255, 0.06)"
        strokeWidth={6}
      />
      <Circle
        cx="50"
        cy="50"
        r={R}
        fill="none"
        stroke="url(#timerRingGrad)"
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={`${C}`}
        strokeDashoffset={offset}
        transform="rotate(-90 50 50)"
      />
    </Svg>
  );
}

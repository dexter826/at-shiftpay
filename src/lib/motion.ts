const parseDuration = (name: string, fallback: number) => {
  if (typeof document === 'undefined') return fallback;
  const ms = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isFinite(ms) ? ms / 1000 : fallback;
};

const parseCubicBezier = (name: string, fallback: [number, number, number, number]) => {
  if (typeof document === 'undefined') return fallback;
  const match = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .match(/cubic-bezier\(([^)]+)\)/);
  if (!match) return fallback;
  const values = match[1].split(',').map(Number);
  return values.length === 4 && values.every(Number.isFinite)
    ? (values as [number, number, number, number])
    : fallback;
};

// Read from the CSS motion tokens so Framer and CSS transitions stay aligned.
export const DURATION_FAST = parseDuration('--duration-fast', 0.14);
export const DURATION_BASE = parseDuration('--duration-base', 0.2);
export const DURATION_SLOW = parseDuration('--duration-slow', 2);
export const EASE_STANDARD = parseCubicBezier('--ease-standard', [0.2, 0.8, 0.2, 1]);

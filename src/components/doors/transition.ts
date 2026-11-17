/** Pure timing function, shared by the camera and transition veil. */
export const ENTER_DURATION = 1.1;
export const REDUCED_ENTER_DURATION = 0.1;
const clamp = (n: number) => Math.min(1, Math.max(0, n));
const ease = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };
export function entryFrame(progress: number, reduced: boolean) {
  const p = clamp(progress);
  return {
    travel: reduced ? 0 : ease((p - 0.16) / 0.78),
    veil: reduced ? ease(p) : ease((p - 0.66) / 0.30),
    labels: reduced ? 1 - p : 1 - ease(p / 0.25),
  };
}

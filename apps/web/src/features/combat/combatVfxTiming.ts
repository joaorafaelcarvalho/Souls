export const combatVfxTiming = {
  charge: 600,
  lightningTravel: 850,
  impact: 350,
  destructionFeedback: 1_500,
  resourceFeedback: 500,
  columnTransition: 150
} as const;

export function scaledVfxDuration(duration: number, speed: 1 | 2): number {
  return duration / speed;
}
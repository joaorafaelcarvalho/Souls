import type { CSSProperties } from 'react';
import type { CombatAnimationSpeed } from '../../combat/application/CombatAnimationSequencer';
import { combatVfxTiming } from '../../combat/presentation/combatVfxTiming';
import styles from './CombatResourceFeedback.module.css';

interface FeedbackStyle extends CSSProperties {
  '--vfx-feedback-duration': string;
}

export interface PlayerDamageEffectProps {
  readonly amount: number;
  readonly speed: CombatAnimationSpeed;
}

export function PlayerDamageEffect({ amount, speed }: PlayerDamageEffectProps) {
  const style: FeedbackStyle = {
    '--vfx-feedback-duration': `${combatVfxTiming.resourceFeedback / speed}ms`
  };

  return (
    <span className={styles.damage} style={style} aria-label={`${amount} HP perdidos`}>
      −{amount} HP
    </span>
  );
}

export interface SoulEffectProps {
  readonly delta: number;
  readonly speed: CombatAnimationSpeed;
}

export function SoulEffect({ delta, speed }: SoulEffectProps) {
  const style: FeedbackStyle = {
    '--vfx-feedback-duration': `${combatVfxTiming.resourceFeedback / speed}ms`
  };
  const positive = delta > 0;
  const amount = Math.abs(delta);

  return (
    <span className={`${styles.soul} ${positive ? styles.gained : styles.spent}`} style={style} aria-label={`${positive ? 'ganhou' : 'gastou'} ${amount} Soul`}>
      {positive ? '+' : '−'}{amount} Soul
    </span>
  );
}
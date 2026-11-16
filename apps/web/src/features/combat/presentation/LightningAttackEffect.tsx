import type { CardDefinition, CardInstance, CardInstanceId } from '@souls/game-core';
import type { CSSProperties, RefObject } from 'react';
import { useEffect, useState } from 'react';
import type { CombatPlaybackState } from '../application/CombatAnimationSequencer';
import { combatVfxTiming, scaledVfxDuration } from '../combatVfxTiming';
import styles from './LightningAttackEffect.module.css';

type AttackKind = CardDefinition['type'];
type AssetVariant = 'primary' | 'alternate';

interface Point {
  readonly x: number;
  readonly y: number;
}

interface SourcePoint {
  readonly point: Point;
  readonly kind: AttackKind | undefined;
  readonly index: number;
}

interface BeamSegment {
  readonly start: Point;
  readonly end: Point;
  readonly seed: number;
  readonly kind: AttackKind | undefined;
}

interface AttackAssetGeometry {
  readonly target: Point;
  readonly angle: number;
  readonly kind: AttackKind;
  readonly index: number;
}

interface LightningGeometry {
  readonly width: number;
  readonly height: number;
  readonly segments: readonly BeamSegment[];
  readonly assets: readonly AttackAssetGeometry[];
}

type LightningStyle = CSSProperties & {
  '--vfx-lightning-delay': string;
  '--vfx-lightning-duration': string;
};

type AttackAssetStyle = CSSProperties & {
  '--vfx-asset-delay': string;
  '--vfx-asset-duration': string;
  '--vfx-asset-angle': string;
};

interface LightningAttackEffectProps {
  readonly containerRef: RefObject<HTMLElement | null>;
  readonly playback: CombatPlaybackState | null | undefined;
  readonly cardInstances: Readonly<Record<CardInstanceId, CardInstance>> | undefined;
  readonly cardDefinitions: Readonly<Record<string, CardDefinition>> | undefined;
}

function findOccupant(container: HTMLElement, instanceId: CardInstanceId): HTMLElement | undefined {
  return Array.from(container.querySelectorAll<HTMLElement>('[data-occupant-id]'))
    .find((element) => element.dataset.occupantId === instanceId);
}

function centerOf(element: HTMLElement, containerRect: DOMRect): Point {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left - containerRect.left + rect.width / 2,
    y: rect.top - containerRect.top + rect.height / 2
  };
}

function interpolate(start: Point, end: Point, progress: number): Point {
  return {
    x: start.x + (end.x - start.x) * progress,
    y: start.y + (end.y - start.y) * progress
  };
}

function offsetPoint(start: Point, end: Point, offset: number): { start: Point; end: Point } {
  const distance = Math.hypot(end.x - start.x, end.y - start.y);
  const perpendicular = {
    x: -(end.y - start.y) / Math.max(distance, 1),
    y: (end.x - start.x) / Math.max(distance, 1)
  };

  return {
    start: { x: start.x + perpendicular.x * offset * 0.22, y: start.y + perpendicular.y * offset * 0.22 },
    end: { x: end.x + perpendicular.x * offset, y: end.y + perpendicular.y * offset }
  };
}

function makeJaggedPath(start: Point, end: Point, seed: number, amplitude = 1): string {
  const distance = Math.hypot(end.x - start.x, end.y - start.y);
  const perpendicular = {
    x: -(end.y - start.y) / Math.max(distance, 1),
    y: (end.x - start.x) / Math.max(distance, 1)
  };
  const points: Point[] = [start];
  const segmentCount = 7;

  for (let index = 1; index < segmentCount; index += 1) {
    const progress = index / segmentCount;
    const wave = Math.sin((index + 1) * 2.17 + seed) * Math.min(10, distance * 0.045) * amplitude;
    const point = interpolate(start, end, progress);
    points.push({
      x: point.x + perpendicular.x * wave,
      y: point.y + perpendicular.y * wave
    });
  }

  points.push(end);
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
}

function directTarget(width: number, height: number, source: Point, direction: 'up' | 'down'): Point {
  return {
    x: source.x,
    y: direction === 'up' ? 0 : height
  };
}

function cardKindFor(
  instanceId: CardInstanceId,
  cardInstances: Readonly<Record<CardInstanceId, CardInstance>> | undefined,
  cardDefinitions: Readonly<Record<string, CardDefinition>> | undefined
): AttackKind | undefined {
  const instance = cardInstances?.[instanceId];
  return instance === undefined ? undefined : cardDefinitions?.[instance.cardDefinitionId]?.type;
}

function assetVariantFor(playback: CombatPlaybackState): AssetVariant {
  return (playback.columnIndex + playback.exchangeIndex) % 2 === 0 ? 'primary' : 'alternate';
}

function assetPathFor(kind: AttackKind, variant: AssetVariant): string {
  if (variant === 'alternate') {
    return kind === 'melee'
      ? '/images/effects/souls_melee_impact.webp'
      : '/images/effects/souls_ranged_impact.webp';
  }

  return kind === 'melee'
    ? '/images/effects/souls_melee_attack_alt.webp'
    : '/images/effects/souls_ranged_golden_lightning.webp';
}
export function LightningAttackEffect({
  containerRef,
  playback,
  cardInstances,
  cardDefinitions
}: LightningAttackEffectProps) {
  const [geometry, setGeometry] = useState<LightningGeometry | null>(null);
  const visible = playback !== null
    && playback !== undefined
    && (playback.stage === 'attack' || playback.stage === 'impact');

  useEffect(() => {
    const container = containerRef.current;

    if (container === null || playback === null || playback === undefined || !visible) {
      setGeometry(null);
      return;
    }

    const firstAttacker = playback.attackerIds[0];
    const ownerId = firstAttacker === undefined ? undefined : cardInstances?.[firstAttacker]?.ownerId;
    const direction: 'up' | 'down' = ownerId === 2 ? 'down' : 'up';

    const updateGeometry = () => {
      const containerRect = container.getBoundingClientRect();
      const width = container.clientWidth;
      const height = container.clientHeight;
      const sources = playback.attackerIds
        .map((instanceId, index): SourcePoint | undefined => {
          const element = findOccupant(container, instanceId);
          if (element === undefined) {
            return undefined;
          }

          return {
            point: centerOf(element, containerRect),
            kind: cardKindFor(instanceId, cardInstances, cardDefinitions),
            index
          };
        })
        .filter((source): source is SourcePoint => source !== undefined);

      if (sources.length === 0 || width === 0 || height === 0) {
        setGeometry(null);
        return;
      }

      const targetId = playback.stage === 'impact'
        ? playback.targetIds[0]
        : playback.pathTargetIds[0];
      const targetElement = targetId === undefined ? undefined : findOccupant(container, targetId);
      const sourceAverage = sources.reduce(
        (total, source) => ({ x: total.x + source.point.x / sources.length, y: total.y + source.point.y / sources.length }),
        { x: 0, y: 0 }
      );
      const target = targetElement === undefined
        ? directTarget(width, height, sourceAverage, direction)
        : centerOf(targetElement, containerRect);
      const convergence = sources.length > 1 ? interpolate(sourceAverage, target, 0.34) : undefined;
      const hasRangedSource = sources.some((source) => source.kind === 'ranged');
      const segments = convergence === undefined
        ? sources.map((source) => ({ start: source.point, end: target, seed: source.index + 1, kind: source.kind }))
        : [
            ...sources.map((source) => ({ start: source.point, end: convergence, seed: source.index + 1, kind: source.kind })),
            { start: convergence, end: target, seed: 11, kind: hasRangedSource ? 'ranged' as const : undefined }
          ];
      const assets = sources.flatMap((source) => {
        if (source.kind === undefined) {
          return [];
        }

        const offset = sources.length > 1
          ? (source.index - (sources.length - 1) / 2) * Math.min(28, Math.max(12, width * 0.02))
          : 0;
        const impactPoint = offsetPoint(source.point, target, offset).end;

        return [{
          target: impactPoint,
          angle: Math.atan2(target.y - source.point.y, target.x - source.point.x) * 180 / Math.PI,
          kind: source.kind,
          index: source.index
        }];
      });

      setGeometry({ width, height, segments, assets });
    };

    updateGeometry();
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(updateGeometry);
    observer?.observe(container);
    window.addEventListener('resize', updateGeometry);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateGeometry);
    };
  }, [cardDefinitions, cardInstances, containerRef, playback, visible]);

  if (!visible || geometry === null || playback === null || playback === undefined) {
    return null;
  }

  const duration = scaledVfxDuration(combatVfxTiming.lightningTravel, playback.speed);
  const assetDuration = scaledVfxDuration(combatVfxTiming.lightningTravel + combatVfxTiming.impact, playback.speed);
  const threadOffsets = [-10, -5, 5, 10];
  const rangedSegments = geometry.segments.filter((segment) => segment.kind !== 'melee');
  const assetVariant = assetVariantFor(playback);

  return (
    <div className={styles.layer} data-testid="lightning-attack-effect" aria-hidden="true">
      {geometry.assets.length === 0 ? (
      <svg
        className={styles.svg}
        width={geometry.width}
        height={geometry.height}
        viewBox={`0 0 ${geometry.width} ${geometry.height}`}
        preserveAspectRatio="none"
      >
        {rangedSegments.map((segment, segmentIndex) => {
          const style: LightningStyle = {
            '--vfx-lightning-delay': `${segmentIndex * 65}ms`,
            '--vfx-lightning-duration': `${duration}ms`
          };
          return (
            <g key={`${segment.start.x}-${segment.end.x}-${segmentIndex}`}>
              <path
                className={styles.path}
                d={makeJaggedPath(segment.start, segment.end, segment.seed)}
                pathLength={1}
                style={style}
              />
              {threadOffsets.map((offset, threadIndex) => {
                const thread = offsetPoint(segment.start, segment.end, offset);
                const threadStyle: LightningStyle = {
                  ...style,
                  '--vfx-lightning-delay': `${segmentIndex * 65 + threadIndex * 24 + 35}ms`
                };
                return (
                  <path
                    key={`${segmentIndex}-${threadIndex}`}
                    className={styles.thread}
                    d={makeJaggedPath(thread.start, thread.end, segment.seed + threadIndex * 4.3, 0.72)}
                    pathLength={1}
                    style={threadStyle}
                  />
                );
              })}
              <path
                className={styles.arc}
                d={makeJaggedPath(
                  interpolate(segment.start, segment.end, 0.16),
                  interpolate(segment.start, segment.end, 0.76),
                  segment.seed + 29,
                  0.65
                )}
                pathLength={1}
                style={{ ...style, '--vfx-lightning-delay': `${segmentIndex * 65 + 90}ms` } as LightningStyle}
              />
            </g>
          );
        })}
      </svg>
      ) : null}

      {geometry.assets.map((asset) => {
        const style: AttackAssetStyle = {
          left: `${asset.target.x}px`,
          top: `${asset.target.y}px`,
          '--vfx-asset-delay': `${asset.index * 95}ms`,
          '--vfx-asset-duration': `${assetDuration}ms`,
          '--vfx-asset-angle': `${asset.angle}deg`
        };
        return (
          <img
            key={`${playback.column}-${playback.exchangeIndex}-${assetVariant}-${asset.kind}-${asset.index}`}
            className={`${styles.asset} ${asset.kind === 'melee' ? styles.meleeAsset : styles.rangedAsset} ${assetVariant === 'alternate' ? styles.alternateAsset : ''}`}
            src={assetPathFor(asset.kind, assetVariant)}
            alt=""
            aria-hidden="true"
            style={style}
          />
        );
      })}
    </div>
  );
}
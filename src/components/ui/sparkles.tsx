import React, { useMemo } from 'react';
import { cn } from '@/src/lib/utils';

export interface SparklesProps {
  className?: string;
  density?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  color?: string;
}

interface StarParticle {
  id: number;
  leftPct: number;
  topPct: number;
  sizePx: number;
  durationSec: number;
  delaySec: number;
  minOpacity: number;
  maxOpacity: number;
  driftX: number;
}

function seededUnit(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export const Sparkles: React.FC<SparklesProps> = ({
  className,
  density = 1200,
  minSize = 0.6,
  maxSize = 1.8,
  speed = 0.35,
  color = '#ffffff',
}) => {
  const particles = useMemo<StarParticle[]>(() => {
    const count = Math.min(Math.max(Math.round(density / 60), 14), 20);
    const speedFactor = Math.max(0.2, speed);

    return Array.from({ length: count }, (_, idx) => {
      const s1 = seededUnit(idx + 1);
      const s2 = seededUnit(idx + 101);
      const s3 = seededUnit(idx + 201);
      const s4 = seededUnit(idx + 301);
      const s5 = seededUnit(idx + 401);

      return {
        id: idx,
        leftPct: 6 + s1 * 88,
        topPct: 8 + s2 * 82,
        sizePx: Math.max(1.5, (minSize + s3 * (maxSize - minSize)) * 1.45),
        durationSec: (3.2 + s4 * 3.4) / (0.65 + speedFactor),
        delaySec: -(s5 * 4.5),
        minOpacity: 0.18 + s3 * 0.2,
        maxOpacity: 0.65 + s4 * 0.35,
        driftX: (s5 - 0.5) * 10,
      };
    });
  }, [density, minSize, maxSize, speed]);

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none relative block w-full h-full overflow-hidden', className)}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="sparkle-dot absolute rounded-full"
          style={
            {
              left: `${p.leftPct.toFixed(2)}%`,
              top: `${p.topPct.toFixed(2)}%`,
              width: `${p.sizePx.toFixed(2)}px`,
              height: `${p.sizePx.toFixed(2)}px`,
              backgroundColor: color,
              '--sp-min': p.minOpacity.toFixed(2),
              '--sp-max': p.maxOpacity.toFixed(2),
              '--sp-dur': `${p.durationSec.toFixed(2)}s`,
              '--sp-delay': `${p.delaySec.toFixed(2)}s`,
              '--sp-dx': `${p.driftX.toFixed(1)}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

export const SparklesGlobe = Sparkles;

export default Sparkles;

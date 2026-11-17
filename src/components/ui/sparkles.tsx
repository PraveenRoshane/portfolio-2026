import React, { useEffect, useRef } from 'react';
import { cn } from '@/src/lib/utils';
import { usePrefersReducedMotion } from '@/src/lib/usePrefersReducedMotion';

export interface SparklesProps {
  className?: string;
  density?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  color?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  alpha: number;
  twinkleSpeed: number;
  phase: number;
}

export const Sparkles: React.FC<SparklesProps> = ({
  className,
  density = 1200,
  minSize = 0.6,
  maxSize = 1.8,
  speed = 0.35,
  color = '#ffffff',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;

    const count = Math.min(Math.max(Math.round(density / 8), 50), 220);

    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * (canvas.offsetWidth || 600),
      y: Math.random() * (canvas.offsetHeight || 320),
      size: minSize + Math.random() * (maxSize - minSize),
      speedY: -(0.1 + Math.random() * speed),
      speedX: (Math.random() - 0.5) * 0.25,
      alpha: 0.25 + Math.random() * 0.75,
      twinkleSpeed: 0.015 + Math.random() * 0.03,
      phase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        if (!reducedMotion) {
          p.x += p.speedX;
          p.y += p.speedY;
          p.phase += p.twinkleSpeed;

          if (p.y < -4) p.y = h + 4;
          if (p.x < -4) p.x = w + 4;
          if (p.x > w + 4) p.x = -4;
        }

        const currentAlpha = p.alpha * (0.5 + 0.5 * Math.sin(p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.max(0.05, Math.min(1, currentAlpha));
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      if (!reducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const handleResize = () => {
      resizeCanvas();
      if (reducedMotion) {
        render();
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    render();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [reducedMotion, density, minSize, maxSize, speed, color]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none block w-full h-full', className)}
    />
  );
};

export const SparklesGlobe = Sparkles;

export default Sparkles;

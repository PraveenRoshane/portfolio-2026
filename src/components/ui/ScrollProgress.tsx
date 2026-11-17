import React, { useEffect, useRef } from 'react';
import { gsap } from '@/src/animations/gsap';
import { usePrefersReducedMotion } from '@/src/lib/usePrefersReducedMotion';

export const ScrollProgress: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let setScaleX: (value: number) => void = (value: number) => {
      gsap.set(bar, { scaleX: value });
    };

    const ctx = gsap.context(() => {
      gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });

      if (!reducedMotion) {
        const quickScaleX = gsap.quickTo(bar, 'scaleX', {
          duration: 0.16,
          ease: 'power2.out',
        });
        setScaleX = (value: number) => quickScaleX(value);
      }
    }, bar);

    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        maxScroll > 0 ? Math.min(Math.max(scrollTop / maxScroll, 0), 1) : 0;
      setScaleX(progress);
    };

    updateProgress();

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(updateProgress)
        : null;
    resizeObserver?.observe(document.documentElement);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      resizeObserver?.disconnect();
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-50 h-[2px] bg-slate-900/10 dark:bg-white/[0.04]"
    >
      <div
        ref={barRef}
        className="h-full w-full scale-x-0 bg-cyan-700 dark:bg-cyan-400 dark:shadow-[0_0_10px_rgba(0,240,255,0.55)] origin-left will-change-transform"
      />
    </div>
  );
};

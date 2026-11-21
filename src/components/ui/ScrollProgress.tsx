import React, { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/src/lib/usePrefersReducedMotion';

export const ScrollProgress: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let cancelled = false;
    let quickScaleX: ((value: number) => void) | null = null;
    let gsapPromise: Promise<void> | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const ensureQuickScaleX = () => {
      if (quickScaleX || gsapPromise || reducedMotion) return;
      gsapPromise = import('@/src/animations/gsap').then(({ gsap }) => {
        if (cancelled || !barRef.current) return;
        const qt = gsap.quickTo(barRef.current, 'scaleX', {
          duration: 0.16,
          ease: 'power2.out',
        });
        quickScaleX = (v: number) => qt(v);
      });
    };

    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(Math.max(scrollTop / maxScroll, 0), 1) : 0;

      if (reducedMotion) {
        bar.style.transform = `scaleX(${progress})`;
        return;
      }

      if (!quickScaleX) {
        ensureQuickScaleX();
        bar.style.transform = `scaleX(${progress})`;
        return;
      }

      quickScaleX(progress);
    };

    const startTracking = () => {
      updateProgress();
      if (typeof ResizeObserver !== 'undefined' && !resizeObserver) {
        resizeObserver = new ResizeObserver(updateProgress);
        resizeObserver.observe(document.documentElement);
      }
    };

    const onFirstScroll = () => {
      startTracking();
    };

    if (window.scrollY > 0) {
      startTracking();
    } else {
      window.addEventListener('scroll', onFirstScroll, { passive: true, once: true });
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });

    return () => {
      cancelled = true;
      window.removeEventListener('scroll', onFirstScroll);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      resizeObserver?.disconnect();
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

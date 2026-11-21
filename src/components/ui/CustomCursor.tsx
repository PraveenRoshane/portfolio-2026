import React, { useEffect, useRef, useState } from 'react';
import { isTouchDevice } from '@/src/lib/utils';
import { usePrefersReducedMotion } from '@/src/lib/usePrefersReducedMotion';
import { useTheme } from '@/src/lib/ThemeContext';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { theme } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (reducedMotion || isTouchDevice() || window.innerWidth < 1024) {
      setEnabled(false);
      return;
    }

    const onFirstMove = () => setEnabled(true);
    window.addEventListener('mousemove', onFirstMove, { passive: true, once: true });
    return () => window.removeEventListener('mousemove', onFirstMove);
  }, [reducedMotion]);

  useEffect(() => {
    if (!enabled || !dotRef.current || !ringRef.current) return;

    let cancelled = false;
    let onMouseMove: ((e: MouseEvent) => void) | null = null;

    void import('@/src/animations/gsap').then(({ gsap }) => {
      if (cancelled || !dotRef.current || !ringRef.current) return;

      const dot = dotRef.current;
      const ring = ringRef.current;

      const xDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' });
      const yDot = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' });
      const xRing = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
      const yRing = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

      onMouseMove = (e: MouseEvent) => {
        xDot(e.clientX);
        yDot(e.clientY);
        xRing(e.clientX);
        yRing(e.clientY);

        const target = e.target as HTMLElement | null;
        const interactive = target?.closest('a, button, [data-cursor]');
        setIsHovered(Boolean(interactive));
      };

      window.addEventListener('mousemove', onMouseMove, { passive: true });
    });

    return () => {
      cancelled = true;
      if (onMouseMove) {
        window.removeEventListener('mousemove', onMouseMove);
      }
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !ringRef.current || !dotRef.current) return;
    const isDark = theme === 'dark';
    void import('@/src/animations/gsap').then(({ gsap }) => {
      if (!ringRef.current || !dotRef.current) return;
      gsap.to(ringRef.current, {
        scale: isHovered ? 1.65 : 1,
        borderColor: isHovered
          ? isDark
            ? 'rgba(0, 240, 255, 0.7)'
            : 'rgba(14, 116, 144, 0.75)'
          : isDark
            ? 'rgba(255, 255, 255, 0.25)'
            : 'rgba(15, 23, 42, 0.3)',
        backgroundColor: isHovered
          ? isDark
            ? 'rgba(0, 240, 255, 0.08)'
            : 'rgba(14, 116, 144, 0.08)'
          : 'rgba(0, 0, 0, 0)',
        duration: 0.2,
        ease: 'power2.out',
      });
      gsap.to(dotRef.current, {
        scale: isHovered ? 0.5 : 1,
        duration: 0.2,
        ease: 'power2.out',
      });
    });
  }, [isHovered, enabled, theme]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden lg:block" aria-hidden="true">
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-cyan-700 dark:bg-cyan-400 will-change-transform"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -ml-4 -mt-4 w-8 h-8 rounded-full border border-slate-900/30 dark:border-white/25 will-change-transform"
      />
    </div>
  );
};

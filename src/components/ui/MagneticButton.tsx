import React, { useRef, useEffect } from 'react';
import { cn, isTouchDevice } from '@/src/lib/utils';
import { usePrefersReducedMotion } from '@/src/lib/usePrefersReducedMotion';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  ariaLabel?: string;
  cursorLabel?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  href,
  target,
  rel,
  variant = 'primary',
  className,
  ariaLabel,
  cursorLabel,
}) => {
  const elRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = elRef.current;
    if (!el || reducedMotion || isTouchDevice()) return;

    let cancelled = false;
    let xTo: ((value: number) => void) | null = null;
    let yTo: ((value: number) => void) | null = null;
    let loadingGsap = false;
    let hasMoved = false;

    const ensureQuickTo = async () => {
      if (xTo && yTo) return true;
      if (loadingGsap) return false;
      loadingGsap = true;
      const { gsap } = await import('@/src/animations/gsap');
      if (cancelled || !elRef.current) return false;
      xTo = gsap.quickTo(elRef.current, 'x', { duration: 0.4, ease: 'power3.out' });
      yTo = gsap.quickTo(elRef.current, 'y', { duration: 0.4, ease: 'power3.out' });
      return true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!xTo || !yTo) {
        void ensureQuickTo();
        return;
      }
      hasMoved = true;
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(relX * 0.22);
      yTo(relY * 0.22);
    };

    const handleMouseLeave = () => {
      if (!hasMoved) return;
      xTo?.(0);
      yTo?.(0);
    };

    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelled = true;
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      if (hasMoved) {
        el.style.transform = '';
      }
    };
  }, [reducedMotion]);

  const baseStyles =
    'inline-flex items-center justify-center gap-2.5 px-5 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC] dark:focus-visible:ring-offset-[#050507] cursor-pointer';

  const variantStyles = {
    primary:
      'bg-cyan-700 text-white font-semibold hover:bg-cyan-800 shadow-sm dark:bg-cyan-400 dark:text-[#050507] dark:hover:bg-cyan-300 dark:shadow-[0_0_24px_rgba(0,240,255,0.2)]',
    secondary:
      'bg-white text-slate-900 border border-slate-300 hover:border-cyan-700 hover:text-cyan-800 shadow-xs dark:shadow-none dark:bg-[#111118] dark:text-zinc-100 dark:border-white/15 dark:hover:border-cyan-400/50 dark:hover:text-cyan-300',
    ghost:
      'text-slate-800 hover:text-cyan-800 hover:bg-slate-200/60 dark:text-zinc-300 dark:hover:text-cyan-300 dark:hover:bg-white/5 border border-transparent',
  };

  if (href) {
    return (
      <a
        ref={(node) => {
          elRef.current = node;
        }}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        aria-label={ariaLabel}
        data-cursor={cursorLabel || 'link'}
        className={cn(baseStyles, variantStyles[variant], className)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={(node) => {
        elRef.current = node;
      }}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      data-cursor={cursorLabel || 'button'}
      className={cn(baseStyles, variantStyles[variant], className)}
    >
      {children}
    </button>
  );
};

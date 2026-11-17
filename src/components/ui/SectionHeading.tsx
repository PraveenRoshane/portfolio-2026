import React, { useRef, useEffect } from 'react';
import { gsap } from '@/src/animations/gsap';
import { cn, REDUCED_MOTION_QUERY } from '@/src/lib/utils';

interface SectionHeadingProps {
  index: string;
  kicker: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  index,
  kicker,
  title,
  subtitle,
  align = 'left',
  className,
}) => {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        reduceMotion: REDUCED_MOTION_QUERY,
        allowMotion: '(prefers-reduced-motion: no-preference)',
      },
      (context) => {
        const { reduceMotion } = context.conditions ?? {};
        if (reduceMotion) {
          gsap.set('.sh-item', { opacity: 1, y: 0, clearProps: 'transform' });
          return;
        }

        gsap.fromTo(
          '.sh-item',
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      },
      el
    );

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={headingRef}
      className={cn(
        'mb-12 md:mb-16',
        align === 'center' ? 'text-center mx-auto max-w-3xl' : 'max-w-3xl',
        className
      )}
    >
      <div
        className={cn(
          'sh-item flex items-center gap-3 text-xs font-mono-tech tracking-wider text-slate-600 dark:text-zinc-400 mb-3',
          align === 'center' && 'justify-center'
        )}
      >
        <span className="text-cyan-700 dark:text-cyan-400 font-semibold">{index}.</span>
        <span aria-hidden="true" className="text-slate-400 dark:text-zinc-700">
          /
        </span>
        <span>{kicker}</span>
      </div>

      <h2 className="sh-item font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 dark:text-zinc-100 leading-[1.1] [text-wrap:balance]">
        {title}
      </h2>

      {subtitle && (
        <p className="sh-item mt-4 text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};

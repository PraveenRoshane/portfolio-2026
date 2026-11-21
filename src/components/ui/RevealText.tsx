import React, { useRef, useEffect } from 'react';
import { cn, REDUCED_MOTION_QUERY } from '@/src/lib/utils';
import { observeWhenNearViewport } from '@/src/animations/scrollAnimations';

interface RevealTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div' | 'span';
  className?: string;
  delay?: number;
}

export const RevealText: React.FC<RevealTextProps> = ({
  text,
  as: Component = 'div',
  className,
  delay = 0,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia(REDUCED_MOTION_QUERY).matches
    ) {
      return;
    }

    let cancelled = false;
    let tween: { kill: () => void } | null = null;
    const stopObserve = observeWhenNearViewport(
      el,
      () => {
        const wordEls = el.querySelectorAll<HTMLElement>('.reveal-word');
        if (!wordEls.length) return;
        void import('@/src/animations/gsap').then(({ gsap }) => {
          if (cancelled) return;
          tween = gsap.fromTo(
            wordEls,
            { opacity: 0, y: '100%' },
            {
              opacity: 1,
              y: '0%',
              duration: 0.7,
              delay,
              stagger: 0.028,
              ease: 'power3.out',
              force3D: true,
              clearProps: 'transform,opacity,willChange',
            }
          );
        });
      },
      '0px 0px -40px 0px'
    );

    return () => {
      cancelled = true;
      stopObserve();
      tween?.kill();
    };
  }, [delay, text]);

  const words = text.split(' ');

  return (
    <Component
      ref={(node: HTMLElement | null) => {
        containerRef.current = node;
      }}
      className={cn('leading-snug', className)}
    >
      {words.map((word, idx) => (
        <span key={idx} className="inline-block overflow-hidden align-bottom mr-[0.26em]">
          <span className="reveal-word inline-block">{word}</span>
        </span>
      ))}
    </Component>
  );
};

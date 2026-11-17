import React, { useRef, useEffect } from 'react';
import { gsap } from '@/src/animations/gsap';
import { cn, REDUCED_MOTION_QUERY } from '@/src/lib/utils';

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

    const mm = gsap.matchMedia();

    mm.add(
      {
        reduceMotion: REDUCED_MOTION_QUERY,
        allowMotion: '(prefers-reduced-motion: no-preference)',
      },
      (context) => {
        const { reduceMotion } = context.conditions ?? {};
        if (reduceMotion) {
          gsap.set('.reveal-word', { opacity: 1, y: 0, clearProps: 'transform' });
          return;
        }

        gsap.fromTo(
          '.reveal-word',
          { opacity: 0, y: '100%' },
          {
            opacity: 1,
            y: '0%',
            duration: 0.75,
            delay,
            stagger: 0.03,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      },
      el
    );

    return () => mm.revert();
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
          <span className="reveal-word inline-block will-change-transform">{word}</span>
        </span>
      ))}
    </Component>
  );
};

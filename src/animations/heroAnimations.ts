import { gsap } from './gsap';
import { REDUCED_MOTION_QUERY } from '@/src/lib/utils';

export function initHeroEntrance(container: HTMLElement | null) {
  if (!container) return () => {};

  const mm = gsap.matchMedia();

  mm.add(
    {
      reduceMotion: REDUCED_MOTION_QUERY,
      allowMotion: '(prefers-reduced-motion: no-preference)',
    },
    (context) => {
      const { reduceMotion } = context.conditions ?? {};

      if (reduceMotion) {
        gsap.set('.hero-reveal-item, .hero-headline-line, .hero-cta-item, .hero-sphere-container', {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotateX: 0,
          clearProps: 'transform',
        });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      tl.fromTo(
        '.hero-sphere-container',
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out' },
        0.1
      )
        .fromTo(
          '.hero-reveal-item',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
          0.2
        )
        .fromTo(
          '.hero-headline-line',
          { opacity: 0, y: 48, rotateX: -15 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            stagger: 0.12,
            ease: 'power4.out',
          },
          0.35
        )
        .fromTo(
          '.hero-cta-item',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
          0.75
        );
    },
    container
  );

  return () => mm.revert();
}

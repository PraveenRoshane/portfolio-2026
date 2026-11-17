import { gsap } from './gsap';
import { REDUCED_MOTION_QUERY } from '@/src/lib/utils';

export function animateSectionReveal(container: HTMLElement | null, selector = '.reveal-up') {
  if (!container) return () => {};

  const mm = gsap.matchMedia();

  mm.add(
    {
      reduceMotion: REDUCED_MOTION_QUERY,
      allowMotion: '(prefers-reduced-motion: no-preference)',
    },
    (context) => {
      const elements = gsap.utils.toArray<HTMLElement>(selector);
      if (!elements.length) return;

      const { reduceMotion } = context.conditions ?? {};
      if (reduceMotion) {
        gsap.set(elements, { opacity: 1, y: 0, clearProps: 'transform' });
        return;
      }

      gsap.fromTo(
        elements,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'transform,willChange',
          scrollTrigger: {
            trigger: container,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );
    },
    container
  );

  return () => mm.revert();
}

export function animateMainSectionsEntrance(
  container: HTMLElement | null,
  selector = '.section-entrance'
) {
  if (!container) return () => {};

  const mm = gsap.matchMedia();

  mm.add(
    {
      reduceMotion: REDUCED_MOTION_QUERY,
      allowMotion: '(prefers-reduced-motion: no-preference)',
    },
    (context) => {
      const sections = gsap.utils.toArray<HTMLElement>(selector);
      if (!sections.length) return;

      const { reduceMotion } = context.conditions ?? {};
      if (reduceMotion) {
        gsap.set(sections, {
          opacity: 1,
          y: 0,
          clearProps: 'transform,opacity,willChange',
        });
        return;
      }

      sections.forEach((sectionEl) => {
        const landmark = sectionEl.closest<HTMLElement>('section, footer') ?? sectionEl;
        const rect = landmark.getBoundingClientRect();

        // Ensure sections already scrolled past on hash/deep-link load remain visible if scrolling back up
        if (rect.bottom < 0) {
          gsap.set(sectionEl, {
            opacity: 1,
            y: 0,
            clearProps: 'transform,opacity,willChange',
          });
          return;
        }

        const isFooter = landmark.tagName.toLowerCase() === 'footer';

        gsap.fromTo(
          sectionEl,
          { opacity: 0, y: isFooter ? 18 : 24 },
          {
            opacity: 1,
            y: 0,
            duration: isFooter ? 0.68 : 0.78,
            ease: 'power3.out',
            force3D: true,
            clearProps: 'transform,willChange',
            scrollTrigger: {
              trigger: landmark,
              start: isFooter ? 'top 96%' : 'top 89%',
              toggleActions: 'play none none none',
              fastScrollEnd: true,
            },
          }
        );
      });
    },
    container
  );

  return () => mm.revert();
}


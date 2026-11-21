import React, { useRef, useEffect } from 'react';
import { observeWhenNearViewport } from '@/src/animations/scrollAnimations';
import { REDUCED_MOTION_QUERY } from '@/src/lib/utils';

const TRANSITION_WORDS = [
  { word: 'ENGINEERING', sub: 'Scalable .NET Core & Enterprise Architecture', dir: -1 },
  { word: 'SYSTEMS', sub: 'High-Throughput MS SQL, Oracle & Cloud Pipelines', dir: 1 },
  { word: 'INTERFACES', sub: 'Modern React, Next.js & Precision Design Systems', dir: -1 },
  { word: 'EXPERIENCES', sub: 'Interactive WebGL, Fluid Motion & Digital Craft', dir: 1 },
];

export const ScrollTransition: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let cancelled = false;
    let mm: { revert: () => void } | null = null;
    let stopObserve: (() => void) | null = null;

    const armTransition = () => {
      if (cancelled || stopObserve) return;
      stopObserve = observeWhenNearViewport(
        el,
        () => {
          void import('@/src/animations/gsap').then(({ gsap }) => {
            if (cancelled) return;
            const localMm = gsap.matchMedia();
            mm = localMm;
            localMm.add(
              {
                reduceMotion: REDUCED_MOTION_QUERY,
                allowMotion: '(prefers-reduced-motion: no-preference)',
              },
              (context) => {
                const rows = gsap.utils.toArray<HTMLElement>('.transition-word-row');
                const { reduceMotion } = context.conditions ?? {};

                if (reduceMotion) {
                  gsap.set(rows, { opacity: 1, x: 0, scale: 1, clearProps: 'transform' });
                  return;
                }

                rows.forEach((row, index) => {
                  const dir = index % 2 === 0 ? -1 : 1;
                  gsap.fromTo(
                    row,
                    {
                      opacity: 0.2,
                      x: dir * 60,
                      scale: 0.96,
                    },
                    {
                      opacity: 1,
                      x: 0,
                      scale: 1,
                      ease: 'power2.out',
                      scrollTrigger: {
                        trigger: row,
                        start: 'top 90%',
                        end: 'top 45%',
                        scrub: 0.6,
                      },
                    }
                  );
                });
              },
              el
            );
          });
        },
        '320px 0px'
      );
    };

    const onFirstScroll = () => {
      armTransition();
    };

    if (window.scrollY > 0) {
      armTransition();
    } else {
      window.addEventListener('scroll', onFirstScroll, { passive: true, once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('scroll', onFirstScroll);
      stopObserve?.();
      mm?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Engineering pillars"
      className="cv-section relative py-20 sm:py-28 border-y border-slate-200 dark:border-white/10 bg-[#F1F5F9] dark:bg-[#07070B] overflow-hidden transition-colors duration-200"
    >
      <div className="section-entrance max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="divide-y divide-slate-300/80 dark:divide-white/10">
          {TRANSITION_WORDS.map((item, idx) => (
            <div
              key={item.word}
              className="transition-word-row py-6 sm:py-8 flex flex-col md:flex-row md:items-baseline justify-between gap-2 md:gap-8 will-change-transform"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono-tech text-xs sm:text-sm text-cyan-700 dark:text-cyan-400 font-semibold">
                  0{idx + 1}.
                </span>
                <span className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-zinc-100">
                  {item.word}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-mono-tech text-slate-600 dark:text-zinc-400 md:text-right">
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

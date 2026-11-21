import React, { useRef, useEffect } from 'react';
import { EXPERIENCE_DATA } from '@/src/data/portfolio';
import { SectionHeading } from '@/src/components/ui/SectionHeading';
import { animateSectionReveal, observeWhenNearViewport } from '@/src/animations/scrollAnimations';
import { REDUCED_MOTION_QUERY } from '@/src/lib/utils';

export const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const cleanupCards = animateSectionReveal(el, '.exp-achievement-card');

    let cancelled = false;
    let mm: { revert: () => void } | null = null;
    let stopObserve: (() => void) | null = null;

    const armTimeline = () => {
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
                const { reduceMotion } = context.conditions ?? {};
                if (reduceMotion) {
                  if (progressLineRef.current) {
                    gsap.set(progressLineRef.current, { scaleY: 1 });
                  }
                  return;
                }

                if (progressLineRef.current) {
                  gsap.fromTo(
                    progressLineRef.current,
                    { scaleY: 0 },
                    {
                      scaleY: 1,
                      ease: 'none',
                      scrollTrigger: {
                        trigger: '.exp-timeline-wrapper',
                        start: 'top 70%',
                        end: 'bottom 75%',
                        scrub: 0.4,
                      },
                    }
                  );
                }
              },
              el
            );
          });
        },
        '320px 0px'
      );
    };

    const onFirstScroll = () => {
      armTimeline();
    };

    if (window.scrollY > 0) {
      armTimeline();
    } else {
      window.addEventListener('scroll', onFirstScroll, { passive: true, once: true });
    }

    return () => {
      cancelled = true;
      cleanupCards();
      window.removeEventListener('scroll', onFirstScroll);
      stopObserve?.();
      mm?.revert();
    };
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="cv-section relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/10"
    >
      <div className="section-entrance">
        <SectionHeading
        index="02"
        kicker="Enterprise Track Record"
        title="Production engineering at scale."
        subtitle="Over five years of continuous enterprise software delivery, database performance tuning, and full-stack modernization."
      />

      {EXPERIENCE_DATA.map((exp) => (
        <div key={exp.company} className="exp-timeline-wrapper relative">
          {/* Role Header Banner */}
          <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0B0B10] border border-slate-300/90 dark:border-white/10 shadow-xs dark:shadow-none flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tech text-cyan-700 dark:text-cyan-400 font-medium mb-2">
                <span>{exp.period}</span>
                <span aria-hidden="true">·</span>
                <span>{exp.location}</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
                {exp.role}
              </h3>
              <p className="text-base sm:text-lg text-slate-700 dark:text-zinc-300 font-medium mt-1">
                {exp.company}
              </p>
            </div>

            <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-xl leading-relaxed lg:text-right">
              {exp.summary}
            </p>
          </div>

          {/* Vertical Timeline & Interactive Achievement Cards */}
          <div className="relative pl-6 sm:pl-10">
            {/* Background Track Line */}
            <div
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-1.5 sm:left-3 w-[1px] bg-slate-300 dark:bg-white/10"
            />
            {/* Animated GSAP Scroll Progress Line */}
            <div
              ref={progressLineRef}
              aria-hidden="true"
              className="Show-progress absolute top-2 bottom-2 left-1.5 sm:left-3 w-[2px] -ml-[0.5px] bg-cyan-700 dark:bg-cyan-400 origin-top will-change-transform"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exp.achievements.map((ach) => (
                <article
                  key={ach.id}
                  className="exp-achievement-card group relative p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#0B0B10] border border-slate-300/90 dark:border-white/10 hover:border-cyan-700 dark:hover:border-cyan-400/45 shadow-xs dark:shadow-none transition-colors duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Clean unboxed metadata */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tech text-slate-600 dark:text-zinc-400 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-700 dark:text-cyan-400 font-semibold">
                          {ach.index}.
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{ach.category}</span>
                      </div>
                      {ach.metricHighlight && (
                        <span className="text-cyan-800 dark:text-cyan-300 font-semibold">
                          {ach.metricHighlight}
                        </span>
                      )}
                    </div>

                    <h4 className="font-display text-lg sm:text-xl font-bold text-slate-950 dark:text-zinc-100 group-hover:text-cyan-900 dark:group-hover:text-white transition-colors mb-3">
                      {ach.title}
                    </h4>

                    <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed mb-6">
                      {ach.description}
                    </p>
                  </div>

                  {/* Unboxed technology list with typographic separators */}
                  <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono-tech text-slate-600 dark:text-zinc-400">
                    {ach.technologies.map((tech, idx) => (
                      <React.Fragment key={tech}>
                        <span className="text-slate-800 dark:text-zinc-300">{tech}</span>
                        {idx < ach.technologies.length - 1 && (
                          <span aria-hidden="true" className="text-slate-400 dark:text-zinc-600">
                            ·
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      ))}
      </div>
    </section>
  );
};

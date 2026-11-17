import React, { useRef, useEffect } from 'react';
import { PUBLICATION_DATA } from '@/src/data/portfolio';
import { SectionHeading } from '@/src/components/ui/SectionHeading';
import { animateSectionReveal } from '@/src/animations/scrollAnimations';

export const Publication: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    return animateSectionReveal(sectionRef.current, '.pub-reveal');
  }, []);

  return (
    <section
      id="publication"
      ref={sectionRef}
      className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/10"
    >
      <div className="section-entrance">
        <SectionHeading
        index="05"
        kicker="Research & Technical Curiosity"
        title="Peer-reviewed engineering research."
      />

      <div className="pub-reveal relative p-7 sm:p-10 rounded-2xl bg-white dark:bg-[#0B0B10] border border-slate-300/90 dark:border-white/10 shadow-xs dark:shadow-none overflow-hidden">
        {/* Subtle decorative corner accent line */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 w-32 h-[2px] bg-gradient-to-r from-cyan-700 dark:from-cyan-400 to-transparent"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-2 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/10 pb-6 lg:pb-0 lg:pr-8">
            <div className="text-xs font-mono-tech text-cyan-700 dark:text-cyan-400 font-medium">
              Published · {PUBLICATION_DATA.date}
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-zinc-200 leading-snug">
              {PUBLICATION_DATA.journal}
            </div>
            <div className="text-xs font-mono-tech text-slate-600 dark:text-zinc-500 pt-2">
              {PUBLICATION_DATA.subtitle}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white leading-tight [text-wrap:balance]">
              {PUBLICATION_DATA.title}
            </h3>

            <p className="text-sm sm:text-base text-slate-700 dark:text-zinc-300 leading-relaxed">
              {PUBLICATION_DATA.summary}
            </p>

            {/* Unboxed domain metadata with typographic separators */}
            <div className="pt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono-tech text-slate-600 dark:text-zinc-400">
              {PUBLICATION_DATA.domains.map((domain, idx) => (
                <React.Fragment key={domain}>
                  <span className="text-slate-800 dark:text-zinc-300">{domain}</span>
                  {idx < PUBLICATION_DATA.domains.length - 1 && (
                    <span aria-hidden="true" className="text-slate-400 dark:text-zinc-600">
                      ·
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

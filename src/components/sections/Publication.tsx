import React, { useRef, useEffect } from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
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
      className="cv-section relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/10"
    >
      <div className="section-entrance">
        <SectionHeading
          index="05"
          kicker="Research & Technical Curiosity"
          title="Peer-reviewed engineering research."
        />

        <div className="pub-reveal relative p-7 sm:p-10 rounded-2xl bg-white dark:bg-[#0B0B10] border border-slate-300/90 dark:border-white/10 shadow-xs dark:shadow-none overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-2 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/10 pb-6 lg:pb-0 lg:pr-8">
              <div className="text-xs font-mono-tech text-cyan-700 dark:text-cyan-400 font-medium">
                Published · {PUBLICATION_DATA.date}
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-zinc-200 leading-snug">
                {PUBLICATION_DATA.journal}
              </div>
              <div className="text-xs font-mono-tech text-slate-600 dark:text-zinc-400 pt-2">
                {PUBLICATION_DATA.subtitle}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4 min-w-0">
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white leading-tight [text-wrap:balance]">
                {PUBLICATION_DATA.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-700 dark:text-zinc-300 leading-relaxed">
                {PUBLICATION_DATA.summary}
              </p>

              {/* Unboxed domain metadata with typographic separators */}
              <div className="pt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono-tech text-slate-600 dark:text-zinc-400">
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

              {/* Official Publication URL & Primary CTA */}
              <div className="pt-5 mt-3 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-mono-tech uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">
                    Official Publication URL
                  </div>
                  <a
                    href={PUBLICATION_DATA.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={PUBLICATION_DATA.url}
                    data-cursor="external"
                    className="group/url inline-flex items-center gap-1.5 max-w-full min-h-[44px] sm:min-h-0 py-1 sm:py-0 text-xs font-mono-tech text-cyan-700 dark:text-cyan-400 hover:text-cyan-900 dark:hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0B0B10] rounded"
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate underline decoration-cyan-700/35 dark:decoration-cyan-400/35 underline-offset-4 group-hover/url:decoration-current">
                      {PUBLICATION_DATA.url}
                    </span>
                  </a>
                </div>

                <a
                  href={PUBLICATION_DATA.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="external"
                  aria-label={`Read official publication ${PUBLICATION_DATA.title} on IRJIET (opens in new tab)`}
                  className="inline-flex items-center justify-center gap-2 shrink-0 min-h-[44px] sm:min-h-[40px] px-5 py-2.5 rounded-xl text-sm font-semibold bg-cyan-700 text-white hover:bg-cyan-800 dark:bg-cyan-400 dark:text-[#050507] dark:hover:bg-cyan-300 shadow-sm dark:shadow-[0_0_24px_rgba(0,240,255,0.2)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0B0B10]"
                >
                  <span>Read Official Paper</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

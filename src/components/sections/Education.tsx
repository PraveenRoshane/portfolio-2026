import React, { useRef, useEffect } from 'react';
import { EDUCATION_DATA } from '@/src/data/portfolio';
import { animateSectionReveal } from '@/src/animations/scrollAnimations';

export const Education: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return animateSectionReveal(containerRef.current, '.edu-reveal');
  }, []);

  return (
    <div ref={containerRef} className="h-full flex flex-col justify-between">
      <div>
        <div className="edu-reveal flex items-center gap-3 text-xs font-mono-tech tracking-wider text-slate-600 dark:text-zinc-400 mb-3">
          <span className="text-cyan-700 dark:text-cyan-400 font-semibold">06.</span>
          <span aria-hidden="true" className="text-slate-400 dark:text-zinc-700">
            /
          </span>
          <span>Academic Foundation</span>
        </div>

        <h2 className="edu-reveal font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mb-6">
          Education
        </h2>
      </div>

      <div className="edu-reveal p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0B0B10] border border-slate-300/90 dark:border-white/10 shadow-xs dark:shadow-none flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tech text-slate-600 dark:text-zinc-400 mb-3">
            <span className="text-cyan-700 dark:text-cyan-400 font-medium">
              {EDUCATION_DATA.period}
            </span>
            <span>GPA: {EDUCATION_DATA.gpa}</span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-950 dark:text-white mb-1">
            {EDUCATION_DATA.degree}
          </h3>

          <p className="text-sm sm:text-base text-slate-700 dark:text-zinc-300 font-medium mb-6">
            {EDUCATION_DATA.institution} ({EDUCATION_DATA.abbreviation})
          </p>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono-tech text-slate-600 dark:text-zinc-400">
          {EDUCATION_DATA.focusAreas.map((area, idx) => (
            <React.Fragment key={area}>
              <span className="text-slate-800 dark:text-zinc-300">{area}</span>
              {idx < EDUCATION_DATA.focusAreas.length - 1 && (
                <span aria-hidden="true" className="text-slate-400 dark:text-zinc-600">
                  ·
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

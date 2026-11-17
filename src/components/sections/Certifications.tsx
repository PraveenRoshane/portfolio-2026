import React, { useRef, useEffect } from 'react';
import { CERTIFICATIONS_DATA } from '@/src/data/portfolio';
import { animateSectionReveal } from '@/src/animations/scrollAnimations';

export const Certifications: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return animateSectionReveal(containerRef.current, '.cert-reveal');
  }, []);

  return (
    <div ref={containerRef} className="h-full flex flex-col justify-between">
      <div>
        <div className="cert-reveal flex items-center gap-3 text-xs font-mono-tech tracking-wider text-slate-600 dark:text-zinc-400 mb-3">
          <span className="text-cyan-700 dark:text-cyan-400 font-semibold">07.</span>
          <span aria-hidden="true" className="text-slate-400 dark:text-zinc-700">
            /
          </span>
          <span>Continuous Specialization</span>
        </div>

        <h2 className="cert-reveal font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mb-6">
          Certifications
        </h2>
      </div>

      <div className="space-y-4 flex-1 flex flex-col justify-between">
        {CERTIFICATIONS_DATA.map((cert, idx) => (
          <div
            key={cert.id}
            className="cert-reveal p-6 rounded-2xl bg-white dark:bg-[#0B0B10] border border-slate-300/90 dark:border-white/10 hover:border-cyan-700 dark:hover:border-cyan-400/35 shadow-xs dark:shadow-none transition-colors flex flex-col justify-between flex-1"
          >
            <div className="flex items-center justify-between text-xs font-mono-tech text-slate-600 dark:text-zinc-400 mb-2">
              <span className="text-cyan-700 dark:text-cyan-400 font-semibold">0{idx + 1}.</span>
              <span>{cert.issuer}</span>
            </div>

            <h3 className="font-display text-lg sm:text-xl font-bold text-slate-950 dark:text-white mb-1.5">
              {cert.title}
            </h3>

            <p className="text-xs font-mono-tech text-slate-600 dark:text-zinc-400">
              {cert.domain}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

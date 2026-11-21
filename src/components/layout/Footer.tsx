import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PERSONAL_INFO } from '@/src/data/portfolio';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="cv-section border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#050507] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="section-entrance max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="font-display text-lg font-bold text-slate-950 dark:text-white tracking-tight">
            {PERSONAL_INFO.fullName}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1">
            {PERSONAL_INFO.role} · {PERSONAL_INFO.location}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-medium text-slate-700 dark:text-zinc-300">
          <a
            href={PERSONAL_INFO.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-cyan-700 dark:hover:text-cyan-300 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#050507] transition-colors"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <a
            href={PERSONAL_INFO.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-cyan-700 dark:hover:text-cyan-300 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#050507] transition-colors"
          >
            <span>LinkedIn</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="inline-flex items-center gap-1 hover:text-cyan-700 dark:hover:text-cyan-300 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#050507] transition-colors"
          >
            <span>{PERSONAL_INFO.email}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="text-xs text-slate-600 dark:text-zinc-400 font-mono-tech">
          <div>Designed &amp; engineered by Praveen.</div>
          <div className="mt-0.5">© {currentYear} All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};

import React, { useRef, useEffect, useState } from 'react';
import { ArrowUpRight, Copy, Check, FileText } from 'lucide-react';
import { PERSONAL_INFO } from '@/src/data/portfolio';
import { MagneticButton } from '@/src/components/ui/MagneticButton';
import { animateSectionReveal } from '@/src/animations/scrollAnimations';

interface ContactProps {
  onOpenResume: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onOpenResume }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    return animateSectionReveal(sectionRef.current, '.contact-reveal');
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="cv-section relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/10"
    >
      <div className="section-entrance relative p-8 sm:p-12 lg:p-16 rounded-2xl bg-white dark:bg-[#0B0B10] border border-slate-300/90 dark:border-white/10 shadow-xs dark:shadow-none overflow-hidden">
        {/* Subtle Radial Gradient Accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-600/10 dark:bg-cyan-500/10 blur-[100px]"
        />

        <div className="relative z-10 max-w-3xl">
          <div className="contact-reveal flex items-center gap-3 text-xs font-mono-tech text-slate-600 dark:text-zinc-400 mb-4">
            <span className="text-cyan-700 dark:text-cyan-400 font-semibold">08.</span>
            <span aria-hidden="true">/</span>
            <span>Initiate Collaboration</span>
            <span aria-hidden="true">·</span>
            <span>{PERSONAL_INFO.location}</span>
          </div>

          <h2 className="contact-reveal font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.06] mb-6 [text-wrap:balance]">
            Have an idea worth{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 via-cyan-700 to-indigo-700 dark:from-cyan-300 dark:via-cyan-400 dark:to-violet-400">
              building?
            </span>
          </h2>

          <p className="contact-reveal text-base sm:text-lg text-slate-700 dark:text-zinc-300 leading-relaxed mb-10 max-w-2xl">
            Available for senior full-stack software engineering roles, frontend architecture
            leadership, enterprise .NET + React modernization, and high-impact digital product
            collaborations.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="contact-reveal flex flex-wrap items-center gap-4 mb-12">
            <MagneticButton
              href={`mailto:${PERSONAL_INFO.email}?subject=Engineering%20Opportunity%20%E2%80%94%20Praveen%20De%20Silva`}
              variant="primary"
            >
              <span>Let&apos;s Build Something</span>
              <ArrowUpRight className="w-4 h-4" />
            </MagneticButton>

            <MagneticButton onClick={onOpenResume} variant="secondary">
              <FileText className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
              <span>View Executive Resume</span>
            </MagneticButton>
          </div>

          {/* Direct Contact Channels Grid */}
          <div className="contact-reveal pt-8 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div>
              <div className="text-xs font-mono-tech text-slate-600 dark:text-zinc-400 mb-1">
                Email
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="font-mono-tech text-xs sm:text-sm text-slate-900 hover:text-cyan-800 dark:text-zinc-200 dark:hover:text-cyan-300 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 transition-colors truncate"
                >
                  {PERSONAL_INFO.email}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                  className="p-1.5 rounded-md bg-slate-100 text-slate-700 hover:text-cyan-800 hover:bg-slate-200 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 transition-colors cursor-pointer shrink-0"
                >
                  {copiedEmail ? (
                    <Check className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <div className="text-xs font-mono-tech text-slate-600 dark:text-zinc-400 mb-1">
                Phone
              </div>
              <a
                href={`tel:${PERSONAL_INFO.phone}`}
                className="font-mono-tech text-xs sm:text-sm text-slate-900 hover:text-cyan-800 dark:text-zinc-200 dark:hover:text-cyan-300 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 transition-colors"
              >
                {PERSONAL_INFO.phone}
              </a>
            </div>

            <div>
              <div className="text-xs font-mono-tech text-slate-600 dark:text-zinc-400 mb-1">
                Location
              </div>
              <div className="font-mono-tech text-xs sm:text-sm text-slate-900 dark:text-zinc-200">
                {PERSONAL_INFO.location}
              </div>
            </div>

            <div>
              <div className="text-xs font-mono-tech text-slate-600 dark:text-zinc-400 mb-1">
                Profiles
              </div>
              <div className="flex items-center gap-4 font-mono-tech text-xs sm:text-sm">
                <a
                  href={PERSONAL_INFO.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-900 hover:text-cyan-800 dark:text-zinc-200 dark:hover:text-cyan-300 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 transition-colors"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href={PERSONAL_INFO.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-900 hover:text-cyan-800 dark:text-zinc-200 dark:hover:text-cyan-300 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 transition-colors"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

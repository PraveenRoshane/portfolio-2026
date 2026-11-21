import React from 'react';
import { ArrowDownRight, FileText, ArrowUpRight } from 'lucide-react';
import { PERSONAL_INFO } from '@/src/data/portfolio';
import Earth from '@/src/components/ui/globe';
import { Sparkles } from '@/src/components/ui/sparkles';
import { MagneticButton } from '@/src/components/ui/MagneticButton';
import { useTheme } from '@/src/lib/ThemeContext';

interface HeroProps {
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section
      id="home"
      className="relative min-h-screen pt-24 pb-16 lg:pt-28 lg:pb-20 flex items-center overflow-hidden bg-[#F8FAFC] text-slate-950 dark:bg-black dark:text-white bg-engineering-grid transition-colors duration-200"
    >
      {/* Radial Vignette Overlay */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-radial-vignette" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Editorial Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Clean unboxed technical introduction */}
            <div className="hero-reveal-item flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-mono-tech text-slate-600 dark:text-zinc-400 mb-5">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-700 dark:bg-cyan-400" />
              <span className="text-cyan-800 dark:text-cyan-400 font-semibold">
                {PERSONAL_INFO.role}
              </span>
              <span aria-hidden="true" className="text-slate-400 dark:text-zinc-600">
                ·
              </span>
              <span>{PERSONAL_INFO.location}</span>
            </div>

            {/* Large Editorial Headline */}
            <h1 className="font-display text-4xl sm:text-6xl xl:text-[4.25rem] font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.05] mb-6 [text-wrap:balance]">
              <span className="hero-headline-line block">Building digital</span>
              <span className="hero-headline-line block">
                experiences where{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-b from-slate-950 via-cyan-800 to-cyan-700 dark:from-[#edeffd] dark:to-[#7b9cda]">
                  engineering
                </span>
              </span>
              <span className="hero-headline-line block">meets creativity.</span>
            </h1>

            {/* Supporting Factual Copy */}
            <p className="hero-reveal-item text-base sm:text-lg text-slate-700 dark:text-zinc-300 leading-relaxed max-w-2xl mb-8">
              I&apos;m{' '}
              <strong className="text-slate-950 dark:text-white font-semibold">
                {PERSONAL_INFO.fullName}
              </strong>{' '}
              — {PERSONAL_INFO.heroSubcopy}
            </p>

            {/* Primary & Secondary Action Row */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10">
              <div className="hero-cta-item">
                <MagneticButton href="#projects" variant="primary">
                  <span>View Projects</span>
                  <ArrowDownRight className="w-4 h-4" />
                </MagneticButton>
              </div>

              <div className="hero-cta-item">
                <MagneticButton href="#experience" variant="secondary">
                  <span>Explore Experience</span>
                </MagneticButton>
              </div>

              <div className="hero-cta-item">
                <MagneticButton
                  onClick={onOpenResume}
                  variant="ghost"
                  ariaLabel="View or download resume"
                >
                  <FileText className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
                  <span>Download Resume</span>
                </MagneticButton>
              </div>
            </div>

            {/* Social Links & Core Stack Strip */}
            <div className="hero-reveal-item w-full pt-6 border-t border-slate-300/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono-tech text-slate-600 dark:text-zinc-400">
              <div className="flex items-center gap-5">
                <a
                  href={PERSONAL_INFO.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-800 hover:text-cyan-800 dark:text-zinc-300 dark:hover:text-cyan-300 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC] dark:focus-visible:ring-offset-[#050507] transition-colors"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <span aria-hidden="true" className="text-slate-400 dark:text-zinc-700">
                  /
                </span>
                <a
                  href={PERSONAL_INFO.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-800 hover:text-cyan-800 dark:text-zinc-300 dark:hover:text-cyan-300 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC] dark:focus-visible:ring-offset-[#050507] transition-colors"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-slate-700 dark:text-zinc-400">
                <span>React.js</span>
                <span aria-hidden="true">·</span>
                <span>.NET Core</span>
                <span aria-hidden="true">·</span>
                <span>Microsoft Azure</span>
                <span aria-hidden="true">·</span>
                <span>MS SQL &amp; Oracle</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Cobe Earth Globe wrapped in Sparkles Horizon */}
          <div className="lg:col-span-5 hero-sphere-container relative flex flex-col items-center justify-center overflow-hidden rounded-2xl">
            <article className="grid gap-3 text-center relative z-10 w-full pt-2">
              <div className="flex items-center justify-center gap-2 text-xs font-mono-tech text-cyan-800 dark:text-[#7b9cda] font-medium">
                <span>Global Engineering Reach</span>
                <span aria-hidden="true">·</span>
                <span>6.93° N, 79.86° E</span>
              </div>
              <Earth
                dark={isDark ? 1 : 0}
                diffuse={isDark ? 1.2 : 1.65}
                mapBrightness={isDark ? 6 : 2.8}
                baseColor={isDark ? [0.4, 0.6509, 1] : [0.94, 0.96, 1]}
                markerColor={isDark ? [0, 0.94, 1] : [0.05, 0.45, 0.56]}
                glowColor={isDark ? [0.2745, 0.5765, 0.898] : [0.85, 0.91, 0.98]}
              />
            </article>

            <div
              aria-hidden="true"
              className="relative -mt-28 sm:-mt-32 h-64 sm:h-72 w-full overflow-hidden mask-[radial-gradient(50%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#0284c7,transparent_90%)] dark:before:bg-[radial-gradient(circle_at_bottom_center,#3273ff,transparent_90%)] before:opacity-20 dark:before:opacity-40 after:absolute after:-left-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[10%] after:border-t after:border-slate-300 dark:after:border-[#163474] after:bg-slate-100 dark:after:bg-[#08132b]"
            >
              <Sparkles
                density={1200}
                color={isDark ? '#ffffff' : '#0369a1'}
                className="absolute inset-x-0 bottom-0 h-full w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

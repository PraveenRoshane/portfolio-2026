import React, { useRef, useEffect } from 'react';
import { ABOUT_DATA, PERSONAL_INFO } from '@/src/data/portfolio';
import { SectionHeading } from '@/src/components/ui/SectionHeading';
import { MetricCard } from '@/src/components/ui/MetricCard';
import { RevealText } from '@/src/components/ui/RevealText';
import { animateSectionReveal } from '@/src/animations/scrollAnimations';

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    return animateSectionReveal(sectionRef.current, '.about-reveal');
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="section-entrance">
        <SectionHeading
          index="01"
          kicker="Architecture & Profile"
          title="Engineering resilient systems with visual precision."
        />

        {/* Top Split: Left Statement, Right Biography & Specializations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-16 sm:mb-20 items-start">
          <div className="lg:col-span-6">
            <div className="about-reveal text-xs font-mono-tech text-cyan-700 dark:text-cyan-400 font-medium mb-3">
              {PERSONAL_INFO.fullName} · {PERSONAL_INFO.location}
            </div>
            <RevealText
              as="h3"
              text={ABOUT_DATA.statement}
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-950 dark:text-white leading-tight [text-wrap:balance]"
            />
          </div>

          <div className="lg:col-span-6 space-y-5">
            {ABOUT_DATA.biography.map((paragraph, idx) => (
              <p
                key={idx}
                className="about-reveal text-base sm:text-lg text-slate-700 dark:text-zinc-300 leading-relaxed"
              >
                {paragraph}
              </p>
            ))}

            {/* Core Focus Areas */}
            <div className="about-reveal pt-4 border-t border-slate-200 dark:border-white/10">
              <div className="text-xs font-mono-tech text-slate-600 dark:text-zinc-400 mb-3">
                Core Engineering Domains
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-slate-800 dark:text-zinc-200">
                {ABOUT_DATA.specializations.map((spec) => (
                  <div key={spec} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-700 dark:bg-cyan-400 shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Animated Engineering Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-fr items-stretch">
          {ABOUT_DATA.metrics.map((metric, idx) => (
            <MetricCard key={metric.id} metric={metric} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

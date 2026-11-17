/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useLayoutEffect } from 'react';
import { Navbar } from '@/src/components/layout/Navbar';
import { Footer } from '@/src/components/layout/Footer';
import { Hero } from '@/src/components/hero/Hero';
import { ScrollTransition } from '@/src/components/sections/ScrollTransition';
import { About } from '@/src/components/sections/About';
import { Experience } from '@/src/components/sections/Experience';
import { Skills } from '@/src/components/sections/Skills';
import { Projects } from '@/src/components/sections/Projects';
import { Publication } from '@/src/components/sections/Publication';
import { Education } from '@/src/components/sections/Education';
import { Certifications } from '@/src/components/sections/Certifications';
import { Contact } from '@/src/components/sections/Contact';
import { CustomCursor } from '@/src/components/ui/CustomCursor';
import { ResumeModal } from '@/src/components/ui/ResumeModal';
import { ScrollProgress } from '@/src/components/ui/ScrollProgress';
import { ThemeProvider } from '@/src/lib/ThemeContext';
import { animateMainSectionsEntrance } from '@/src/animations/scrollAnimations';

export default function App() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const appRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    return animateMainSectionsEntrance(appRef.current);
  }, []);

  return (
    <ThemeProvider>
      <div
        ref={appRef}
        className="min-h-screen bg-[#F8FAFC] text-slate-950 dark:bg-[#050507] dark:text-[#F4F4F6] relative selection:bg-cyan-700/15 selection:text-cyan-900 dark:selection:bg-cyan-400/20 dark:selection:text-cyan-300 transition-colors duration-200"
      >
        <ScrollProgress />
        <CustomCursor />
        <Navbar onOpenResume={() => setResumeOpen(true)} />

        <main id="main-content" tabIndex={-1} className="focus:outline-none">
          <Hero onOpenResume={() => setResumeOpen(true)} />
          <ScrollTransition />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Publication />

          {/* Combined Academic & Credentials Row */}
          <section
            aria-label="Education and Certifications"
            className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/10"
          >
            <div className="section-entrance grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              <div className="lg:col-span-6">
                <Education />
              </div>
              <div className="lg:col-span-6">
                <Certifications />
              </div>
            </div>
          </section>

          <Contact onOpenResume={() => setResumeOpen(true)} />
        </main>

        <Footer />

        <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
      </div>
    </ThemeProvider>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, lazy, Suspense, startTransition } from 'react';
import { Navbar } from '@/src/components/layout/Navbar';
import { Footer } from '@/src/components/layout/Footer';
import { Hero } from '@/src/components/hero/Hero';
import { CustomCursor } from '@/src/components/ui/CustomCursor';
import { ScrollProgress } from '@/src/components/ui/ScrollProgress';
import { ThemeProvider } from '@/src/lib/ThemeContext';
import { animateMainSectionsEntrance } from '@/src/animations/scrollAnimations';

const loadScrollTransition = () =>
  import('@/src/components/sections/ScrollTransition').then((m) => ({ default: m.ScrollTransition }));
const loadAbout = () =>
  import('@/src/components/sections/About').then((m) => ({ default: m.About }));
const loadExperience = () =>
  import('@/src/components/sections/Experience').then((m) => ({ default: m.Experience }));
const loadSkills = () =>
  import('@/src/components/sections/Skills').then((m) => ({ default: m.Skills }));
const loadProjects = () =>
  import('@/src/components/sections/Projects').then((m) => ({ default: m.Projects }));
const loadPublication = () =>
  import('@/src/components/sections/Publication').then((m) => ({ default: m.Publication }));
const loadEducation = () =>
  import('@/src/components/sections/Education').then((m) => ({ default: m.Education }));
const loadCertifications = () =>
  import('@/src/components/sections/Certifications').then((m) => ({ default: m.Certifications }));
const loadContact = () =>
  import('@/src/components/sections/Contact').then((m) => ({ default: m.Contact }));

const ScrollTransition = lazy(loadScrollTransition);
const About = lazy(loadAbout);
const Experience = lazy(loadExperience);
const Skills = lazy(loadSkills);
const Projects = lazy(loadProjects);
const Publication = lazy(loadPublication);
const Education = lazy(loadEducation);
const Certifications = lazy(loadCertifications);
const Contact = lazy(loadContact);
const ResumeModal = lazy(() =>
  import('@/src/components/ui/ResumeModal').then((m) => ({ default: m.ResumeModal }))
);

const DeepSectionReady: React.FC<{ onMounted: () => void }> = ({ onMounted }) => {
  useEffect(() => {
    onMounted();
  }, [onMounted]);
  return null;
};

export default function App() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [deepSectionsActive, setDeepSectionsActive] = useState(() => {
    if (typeof window !== 'undefined' && (window.scrollY > 0 || window.location.hash.length > 1)) {
      return true;
    }
    return false;
  });
  const appRef = useRef<HTMLDivElement>(null);
  const aboutPlaceholderRef = useRef<HTMLElement | null>(null);
  const entranceCleanupsRef = useRef<Array<() => void>>([]);

  useEffect(() => {
    const cleanup = animateMainSectionsEntrance(appRef.current);
    entranceCleanupsRef.current.push(cleanup);
  }, [deepSectionsActive]);

  useEffect(() => {
    return () => {
      entranceCleanupsRef.current.forEach((fn) => fn());
      entranceCleanupsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (deepSectionsActive) return;

    let triggered = false;
    const activate = () => {
      if (triggered) return;
      triggered = true;
      void Promise.all([
        loadScrollTransition(),
        loadAbout(),
        loadExperience(),
        loadSkills(),
        loadProjects(),
        loadPublication(),
        loadEducation(),
        loadCertifications(),
        loadContact(),
      ]).then(() => {
        startTransition(() => {
          setDeepSectionsActive(true);
        });
      });
    };

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined' && aboutPlaceholderRef.current) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            io?.disconnect();
            activate();
          }
        },
        { rootMargin: '250px 0px' }
      );
      io.observe(aboutPlaceholderRef.current);
    }

    const onInteract = () => activate();
    window.addEventListener('scroll', onInteract, { passive: true, once: true });
    window.addEventListener('wheel', onInteract, { passive: true, once: true });
    window.addEventListener('touchstart', onInteract, { passive: true, once: true });
    window.addEventListener('pointerdown', onInteract, { passive: true, once: true });
    window.addEventListener('keydown', onInteract, { passive: true, once: true });
    window.addEventListener('hashchange', onInteract, { once: true });

    return () => {
      io?.disconnect();
      window.removeEventListener('scroll', onInteract);
      window.removeEventListener('wheel', onInteract);
      window.removeEventListener('touchstart', onInteract);
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
      window.removeEventListener('hashchange', onInteract);
    };
  }, [deepSectionsActive]);

  const handleDeepMounted = React.useCallback(() => {
    const cleanup = animateMainSectionsEntrance(appRef.current);
    entranceCleanupsRef.current.push(cleanup);
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

          {deepSectionsActive ? (
            <Suspense
              fallback={
                <>
                  <section id="about" aria-label="Architecture and Profile" className="cv-section min-h-[720px]" />
                  <section id="experience" aria-label="Experience" className="cv-section min-h-[720px]" />
                  <section id="skills" aria-label="Technical Ecosystem" className="cv-section min-h-[760px]" />
                  <section id="projects" aria-label="Selected Works" className="cv-section min-h-[720px]" />
                  <section id="publication" aria-label="Research Publication" className="cv-section min-h-[420px]" />
                  <section id="contact" aria-label="Contact" className="cv-section min-h-[420px]" />
                </>
              }
            >
              <ScrollTransition />
              <About />
              <Experience />
              <Skills />
              <Projects />
              <Publication />

              {/* Combined Academic & Credentials Row */}
              <section
                aria-label="Education and Certifications"
                className="cv-section relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/10"
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
              <DeepSectionReady onMounted={handleDeepMounted} />
            </Suspense>
          ) : (
            <>
              <section
                id="about"
                aria-label="Architecture and Profile"
                className="cv-section relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[720px]"
              />
              <section
                id="experience"
                ref={aboutPlaceholderRef}
                aria-label="Experience"
                className="cv-section relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/10 min-h-[720px]"
              />
              <section
                id="skills"
                aria-label="Technical Ecosystem"
                className="cv-section relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/10 min-h-[760px]"
              />
              <section
                id="projects"
                aria-label="Selected Works"
                className="cv-section relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/10 min-h-[720px]"
              />
              <section
                id="publication"
                aria-label="Research Publication"
                className="cv-section relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/10 min-h-[420px]"
              />
              <section
                id="contact"
                aria-label="Contact"
                className="cv-section relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/10 min-h-[420px]"
              />
            </>
          )}
        </main>

        <Footer />

        {resumeOpen && (
          <Suspense fallback={null}>
            <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
          </Suspense>
        )}
      </div>
    </ThemeProvider>
  );
}

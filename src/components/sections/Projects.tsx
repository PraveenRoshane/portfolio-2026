import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ArrowUpRight, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import { PROJECTS_DATA, ProjectItem } from '@/src/data/portfolio';
import { SectionHeading } from '@/src/components/ui/SectionHeading';
import { ProjectCard } from '@/src/components/ui/ProjectCard';
import { gsap } from '@/src/animations/gsap';
import { REDUCED_MOTION_QUERY } from '@/src/lib/utils';
import { useFocusTrap } from '@/src/lib/useFocusTrap';

export const Projects: React.FC = () => {
  const [inspectedProject, setInspectedProject] = useState<ProjectItem | null>(null);
  const [modalImgError, setModalImgError] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const closeModal = useCallback(() => {
    setInspectedProject(null);
  }, []);

  const modalDialogRef = useFocusTrap<HTMLDivElement>(Boolean(inspectedProject), closeModal);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        reduceMotion: REDUCED_MOTION_QUERY,
        allowMotion: '(prefers-reduced-motion: no-preference)',
      },
      (context) => {
        const cards = gsap.utils.toArray<HTMLElement>('.project-card-item');
        const { reduceMotion } = context.conditions ?? {};

        if (reduceMotion) {
          cards.forEach((card) => {
            const mediaInner = card.querySelector<HTMLElement>('.project-card-media-inner');
            const staggerItems = card.querySelectorAll<HTMLElement>('.project-card-stagger');
            gsap.set(card, { opacity: 1, y: 0, scale: 1, clearProps: 'transform' });
            if (mediaInner) {
              gsap.set(mediaInner, { opacity: 1, scale: 1, clearProps: 'transform' });
            }
            if (staggerItems.length) {
              gsap.set(staggerItems, { opacity: 1, y: 0, clearProps: 'transform' });
            }
          });
          return;
        }

        cards.forEach((card) => {
          const mediaInner = card.querySelector<HTMLElement>('.project-card-media-inner');
          const staggerItems = card.querySelectorAll<HTMLElement>('.project-card-stagger');

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 84%',
              toggleActions: 'play none none none',
            },
          });

          tl.fromTo(
            card,
            { opacity: 0, y: 28, scale: 0.985 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.72,
              ease: 'power3.out',
              clearProps: 'transform',
            },
            0
          );

          if (mediaInner) {
            tl.fromTo(
              mediaInner,
              { opacity: 0.55, scale: 1.06 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.85,
                ease: 'power3.out',
                clearProps: 'transform',
              },
              0.06
            );
          }

          if (staggerItems.length) {
            tl.fromTo(
              staggerItems,
              { opacity: 0, y: 14 },
              {
                opacity: 1,
                y: 0,
                duration: 0.54,
                stagger: 0.055,
                ease: 'power2.out',
                clearProps: 'transform',
              },
              0.12
            );
          }
        });
      },
      el
    );

    return () => mm.revert();
  }, []);

  useEffect(() => {
    if (!inspectedProject) return;
    setModalImgError(false);
    document.body.style.overflow = 'hidden';

    const handleModalArrowKeys = (e: KeyboardEvent) => {
      const currentIdx = PROJECTS_DATA.findIndex((p) => p.id === inspectedProject.id);
      if (currentIdx === -1) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIdx = (currentIdx + 1) % PROJECTS_DATA.length;
        setInspectedProject(PROJECTS_DATA[nextIdx]);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIdx = (currentIdx - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length;
        setInspectedProject(PROJECTS_DATA[prevIdx]);
      }
    };

    window.addEventListener('keydown', handleModalArrowKeys);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleModalArrowKeys);
    };
  }, [inspectedProject]);

  const handleCardNavigation = (
    currentIndex: number,
    direction: 'prev' | 'next' | 'first' | 'last'
  ) => {
    const total = PROJECTS_DATA.length;
    let targetIndex = currentIndex;
    if (direction === 'next') targetIndex = (currentIndex + 1) % total;
    if (direction === 'prev') targetIndex = (currentIndex - 1 + total) % total;
    if (direction === 'first') targetIndex = 0;
    if (direction === 'last') targetIndex = total - 1;

    cardRefs.current[targetIndex]?.focus();
  };

  const switchModalProject = (dir: -1 | 1) => {
    if (!inspectedProject) return;
    const currentIdx = PROJECTS_DATA.findIndex((p) => p.id === inspectedProject.id);
    const nextIdx = (currentIdx + dir + PROJECTS_DATA.length) % PROJECTS_DATA.length;
    setInspectedProject(PROJECTS_DATA[nextIdx]);
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/10"
    >
      <div className="section-entrance">
        <SectionHeading
        index="04"
        kicker="Selected Works & Case Studies"
        title="Engineered web platforms & interactive experiences."
        subtitle="Production deployments demonstrating community collaboration architectures, modern UI/UX systems, and real-time media discovery."
      />

      <div className="space-y-10 sm:space-y-14">
        {PROJECTS_DATA.map((project, idx) => (
          <ProjectCard
            key={project.id}
            project={project}
            onInspect={(proj) => setInspectedProject(proj)}
            onNavigateCard={(dir) => handleCardNavigation(idx, dir)}
            cardRefCallback={(el) => {
              cardRefs.current[idx] = el;
            }}
          />
        ))}
      </div>
      </div>

      {/* Fullscreen Lightbox / Case Study Inspection Modal with Focus Trap */}
      {inspectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          aria-describedby="project-modal-description"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/65 dark:bg-black/85 backdrop-blur-md overflow-y-auto"
        >
          <div
            ref={modalDialogRef}
            tabIndex={-1}
            className="relative w-full max-w-4xl rounded-2xl bg-white dark:bg-[#0B0B10] border border-slate-300 dark:border-white/15 shadow-2xl overflow-hidden my-8 focus:outline-none"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-600 dark:text-zinc-400">
                <span className="text-cyan-700 dark:text-cyan-400 font-semibold">
                  {inspectedProject.index}.
                </span>
                <span aria-hidden="true">·</span>
                <span>{inspectedProject.subtitle}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => switchModalProject(-1)}
                  aria-label="Previous project case study"
                  className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => switchModalProject(1)}
                  aria-label="Next project case study"
                  className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  data-autofocus="true"
                  onClick={closeModal}
                  aria-label="Close case study viewer"
                  className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="aspect-video w-full bg-slate-100 dark:bg-[#12121A] overflow-hidden relative">
              {!modalImgError ? (
                <img
                  src={inspectedProject.image}
                  alt={inspectedProject.title}
                  referrerPolicy="no-referrer"
                  onError={() => setModalImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-100 to-cyan-50 dark:from-[#0F172A] dark:to-[#0B0B10]">
                  <Layers className="w-12 h-12 text-cyan-700 dark:text-cyan-400 mb-2" />
                  <span className="font-display text-2xl font-bold text-slate-950 dark:text-white">
                    {inspectedProject.title}
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3
                  id="project-modal-title"
                  className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white"
                >
                  {inspectedProject.title}
                </h3>

                <a
                  href={inspectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-700 text-white hover:bg-cyan-800 dark:bg-cyan-400 dark:text-[#050507] dark:hover:bg-cyan-300 text-xs sm:text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0B0B10] transition-colors whitespace-nowrap self-start sm:self-auto"
                >
                  <span>Launch Live Application</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              <p
                id="project-modal-description"
                className="text-sm sm:text-base text-slate-700 dark:text-zinc-300 leading-relaxed"
              >
                {inspectedProject.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-white/10">
                <div>
                  <div className="text-xs font-mono-tech text-cyan-700 dark:text-cyan-400 font-medium mb-2">
                    Core Features &amp; Architecture
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-zinc-300">
                    {inspectedProject.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span className="text-cyan-700 dark:text-cyan-400">·</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-mono-tech text-cyan-700 dark:text-cyan-400 font-medium mb-2">
                    Technology Stack
                  </div>
                  <div className="text-xs sm:text-sm font-mono-tech text-slate-700 dark:text-zinc-300 leading-relaxed">
                    {inspectedProject.technologies.join(' · ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { X, ArrowUpRight, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import { PROJECTS_DATA, ProjectItem } from '@/src/data/portfolio';
import { SectionHeading } from '@/src/components/ui/SectionHeading';
import { ProjectCard } from '@/src/components/ui/ProjectCard';
import { animateSectionReveal } from '@/src/animations/scrollAnimations';
import { usePrefersReducedMotion } from '@/src/lib/usePrefersReducedMotion';
import { useFocusTrap } from '@/src/lib/useFocusTrap';

const DRAG_THRESHOLD_PX = 6;

export const Projects: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<string>('All');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(PROJECTS_DATA.length > 1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [inspectedProject, setInspectedProject] = useState<ProjectItem | null>(null);
  const [modalImgError, setModalImgError] = useState<boolean>(false);

  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const prevTechRef = useRef<string>('All');
  const rafScrollRef = useRef<number | null>(null);
  const dragStateRef = useRef<{
    isDown: boolean;
    startX: number;
    startScrollLeft: number;
    hasDragged: boolean;
    suppressNextClick: boolean;
  }>({
    isDown: false,
    startX: 0,
    startScrollLeft: 0,
    hasDragged: false,
    suppressNextClick: false,
  });

  // Dynamically derive available technologies + counts from PROJECTS_DATA so adding projects scales automatically
  const techFilters = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of PROJECTS_DATA) {
      for (const tech of project.technologies) {
        counts.set(tech, (counts.get(tech) ?? 0) + 1);
      }
    }
    return [
      { label: 'All', count: PROJECTS_DATA.length },
      ...Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([label, count]) => ({ label, count })),
    ];
  }, []);

  const filteredProjects = useMemo(
    () =>
      selectedTech === 'All'
        ? PROJECTS_DATA
        : PROJECTS_DATA.filter((p) => p.technologies.includes(selectedTech)),
    [selectedTech]
  );

  // Trim stale card refs when filtered count shrinks
  cardRefs.current.length = filteredProjects.length;

  const closeModal = useCallback(() => {
    setInspectedProject(null);
  }, []);

  const modalDialogRef = useFocusTrap<HTMLDivElement>(Boolean(inspectedProject), closeModal);

  // Compute live horizontal scroll progress, active slide index, and edge overflow indicators
  const syncScrollMetrics = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const currentScroll = track.scrollLeft;

    setCanScrollLeft(currentScroll > 8);
    setCanScrollRight(maxScroll - currentScroll > 8);
    setScrollProgress(maxScroll > 0 ? Math.min(1, Math.max(0, currentScroll / maxScroll)) : 1);

    const cards = cardRefs.current.slice(0, filteredProjects.length);
    if (cards.length <= 1) {
      setActiveIndex(0);
      return;
    }

    if (currentScroll <= 12) {
      setActiveIndex(0);
      return;
    }

    if (maxScroll - currentScroll <= 12) {
      setActiveIndex(cards.length - 1);
      return;
    }

    const viewportCenter = currentScroll + track.clientWidth / 2;
    let closestIdx = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, idx) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - viewportCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = idx;
      }
    });

    setActiveIndex(closestIdx);
  }, [filteredProjects.length]);

  const handleTrackScroll = useCallback(() => {
    if (rafScrollRef.current !== null) return;
    rafScrollRef.current = requestAnimationFrame(() => {
      rafScrollRef.current = null;
      syncScrollMetrics();
    });
  }, [syncScrollMetrics]);

  // Keep metrics synced on mount, window/container resize, and filter changes
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const initRafId = requestAnimationFrame(() => {
      syncScrollMetrics();
    });

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', syncScrollMetrics);
      return () => {
        cancelAnimationFrame(initRafId);
        window.removeEventListener('resize', syncScrollMetrics);
      };
    }

    const observer = new ResizeObserver(() => {
      handleTrackScroll();
    });
    observer.observe(track);

    return () => {
      cancelAnimationFrame(initRafId);
      observer.disconnect();
      if (rafScrollRef.current !== null) {
        cancelAnimationFrame(rafScrollRef.current);
        rafScrollRef.current = null;
      }
    };
  }, [syncScrollMetrics, handleTrackScroll]);

  // Scroll smoothly (or instantly under reduced-motion) to a target slide index
  const scrollToProject = useCallback(
    (index: number, behaviorOverride?: ScrollBehavior) => {
      const track = trackRef.current;
      const card = cardRefs.current[index];
      if (!track || !card) return;

      const total = filteredProjects.length;
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);

      let targetLeft = card.offsetLeft;
      if (index === 0) targetLeft = 0;
      if (index >= total - 1) targetLeft = maxScroll;

      setActiveIndex(index);
      track.scrollTo({
        left: Math.min(maxScroll, Math.max(0, targetLeft)),
        behavior: behaviorOverride ?? (reducedMotion ? 'auto' : 'smooth'),
      });
    },
    [filteredProjects.length, reducedMotion]
  );

  // Initial viewport entrance without eager ScrollTrigger measurement on boot
  useEffect(() => {
    return animateSectionReveal(trackRef.current, '.project-card-item');
  }, []);

  // Fluid horizontal glide whenever technology filter changes
  useLayoutEffect(() => {
    if (prevTechRef.current === selectedTech) return;
    prevTechRef.current = selectedTech;

    const track = trackRef.current;
    if (!track) return;

    track.scrollTo({ left: 0, behavior: 'auto' });
    setActiveIndex(0);
    syncScrollMetrics();

    if (reducedMotion) return;

    let cancelled = false;
    let ctx: { revert: () => void } | null = null;

    void import('@/src/animations/gsap').then(({ gsap }) => {
      if (cancelled || !trackRef.current) return;
      ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>('.project-card-item');
        if (!cards.length) return;

        gsap.killTweensOf(cards);
        gsap.fromTo(
          cards,
          { opacity: 0, x: 18, scale: 0.988 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.34,
            stagger: { amount: 0.12, from: 'start' },
            ease: 'power3.out',
            overwrite: 'auto',
            force3D: true,
            clearProps: 'transform,opacity,willChange',
          }
        );
      }, track);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [selectedTech, reducedMotion, syncScrollMetrics]);

  // Modal keyboard cycling & body scroll lock
  useEffect(() => {
    if (!inspectedProject) return;
    setModalImgError(false);
    document.body.style.overflow = 'hidden';

    const list = filteredProjects.length > 0 ? filteredProjects : PROJECTS_DATA;

    const handleModalArrowKeys = (e: KeyboardEvent) => {
      const currentIdx = list.findIndex((p) => p.id === inspectedProject.id);
      if (currentIdx === -1) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIdx = (currentIdx + 1) % list.length;
        setInspectedProject(list[nextIdx]);
        scrollToProject(nextIdx);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIdx = (currentIdx - 1 + list.length) % list.length;
        setInspectedProject(list[prevIdx]);
        scrollToProject(prevIdx);
      }
    };

    window.addEventListener('keydown', handleModalArrowKeys);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleModalArrowKeys);
    };
  }, [inspectedProject, filteredProjects, scrollToProject]);

  const handleCardNavigation = (
    currentIndex: number,
    direction: 'prev' | 'next' | 'first' | 'last'
  ) => {
    const total = filteredProjects.length;
    if (total === 0) return;

    let targetIndex = currentIndex;
    if (direction === 'next') targetIndex = (currentIndex + 1) % total;
    if (direction === 'prev') targetIndex = (currentIndex - 1 + total) % total;
    if (direction === 'first') targetIndex = 0;
    if (direction === 'last') targetIndex = total - 1;

    scrollToProject(targetIndex);
    cardRefs.current[targetIndex]?.focus({ preventScroll: true });
  };

  const switchModalProject = (dir: -1 | 1) => {
    if (!inspectedProject) return;
    const list = filteredProjects.length > 0 ? filteredProjects : PROJECTS_DATA;
    const currentIdx = list.findIndex((p) => p.id === inspectedProject.id);
    if (currentIdx === -1) return;
    const nextIdx = (currentIdx + dir + list.length) % list.length;
    setInspectedProject(list[nextIdx]);
    scrollToProject(nextIdx);
  };

  // Mouse drag-to-scroll on track (leaves touch devices on 100% pure native swipe physics)
  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || filteredProjects.length <= 1) return;
    if ((e.target as HTMLElement).closest('a, button, input, select, textarea')) return;

    const track = trackRef.current;
    if (!track) return;

    dragStateRef.current = {
      isDown: true,
      startX: e.clientX,
      startScrollLeft: track.scrollLeft,
      hasDragged: false,
      suppressNextClick: false,
    };
  };

  const handleTrackPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.isDown || e.pointerType !== 'mouse') return;
    const track = trackRef.current;
    if (!track) return;

    const dx = e.clientX - dragStateRef.current.startX;
    if (!dragStateRef.current.hasDragged && Math.abs(dx) > DRAG_THRESHOLD_PX) {
      dragStateRef.current.hasDragged = true;
      track.style.scrollSnapType = 'none';
      setIsDragging(true);
    }

    if (dragStateRef.current.hasDragged) {
      track.scrollLeft = dragStateRef.current.startScrollLeft - dx;
    }
  };

  const endMouseDrag = () => {
    if (!dragStateRef.current.isDown) return;
    const track = trackRef.current;
    const wasDragged = dragStateRef.current.hasDragged;

    dragStateRef.current.isDown = false;
    dragStateRef.current.hasDragged = false;
    dragStateRef.current.suppressNextClick = wasDragged;

    if (track) {
      track.style.scrollSnapType = '';
    }
    setIsDragging(false);

    if (wasDragged) {
      requestAnimationFrame(() => {
        dragStateRef.current.suppressNextClick = false;
      });
    }
  };

  const handleTrackClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragStateRef.current.suppressNextClick) {
      e.preventDefault();
      e.stopPropagation();
      dragStateRef.current.suppressNextClick = false;
    }
  };

  const activeModalList = filteredProjects.length > 0 ? filteredProjects : PROJECTS_DATA;
  const activeModalPosition = inspectedProject
    ? activeModalList.findIndex((p) => p.id === inspectedProject.id) + 1
    : 0;

  const progressScale =
    filteredProjects.length <= 1
      ? 1
      : Math.max(
          1 / filteredProjects.length,
          Math.min(
            1,
            1 / filteredProjects.length +
              scrollProgress * (1 - 1 / filteredProjects.length)
          )
        );

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="cv-section relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/10"
    >
      <div className="section-entrance">
        {/* Parallel 12-Column Header + Horizontal Navigation Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 lg:items-end mb-7">
          <div className="lg:col-span-7">
            <SectionHeading
              index="04"
              kicker="Selected Works & Case Studies"
              title="Engineered web platforms & interactive experiences."
              subtitle="Production deployments demonstrating community collaboration architectures, modern UI/UX systems, and real-time media discovery."
              className="!mb-0 !max-w-none"
            />
          </div>

          {/* Right Header Control Deck: Position Counter + Prev / Next Buttons */}
          <div className="lg:col-span-5 flex flex-wrap items-center justify-between lg:justify-end gap-4">
            <div className="flex items-center gap-2.5 text-xs font-mono-tech text-slate-600 dark:text-zinc-400">
              <span>Showcase</span>
              <span aria-hidden="true" className="text-slate-400 dark:text-zinc-600">
                /
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-semibold tabular-nums">
                {String(Math.min(activeIndex + 1, filteredProjects.length)).padStart(2, '0')} /{' '}
                {String(filteredProjects.length).padStart(2, '0')}
              </span>
            </div>

            {filteredProjects.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollToProject(Math.max(0, activeIndex - 1))}
                  disabled={!canScrollLeft && activeIndex === 0}
                  aria-label="Scroll to previous project"
                  className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px] rounded-xl bg-white dark:bg-[#0B0B10] border border-slate-300/90 dark:border-white/15 text-slate-800 dark:text-zinc-200 hover:border-cyan-700 hover:text-cyan-800 dark:hover:border-cyan-400/50 dark:hover:text-cyan-300 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 shadow-xs dark:shadow-none touch-manipulation"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    scrollToProject(Math.min(filteredProjects.length - 1, activeIndex + 1))
                  }
                  disabled={!canScrollRight && activeIndex >= filteredProjects.length - 1}
                  aria-label="Scroll to next project"
                  className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px] rounded-xl bg-white dark:bg-[#0B0B10] border border-slate-300/90 dark:border-white/15 text-slate-800 dark:text-zinc-200 hover:border-cyan-700 hover:text-cyan-800 dark:hover:border-cyan-400/50 dark:hover:text-cyan-300 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 shadow-xs dark:shadow-none touch-manipulation"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Scalable Technology Filter Strip */}
        <div
          role="tablist"
          aria-label="Filter projects by technology"
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 mb-6"
        >
          {techFilters.map((filter) => {
            const isActive = selectedTech === filter.label;
            return (
              <button
                key={filter.label}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedTech(filter.label)}
                className={`inline-flex items-center gap-2 min-h-[44px] sm:min-h-[36px] px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 touch-manipulation ${
                  isActive
                    ? 'bg-cyan-700 text-white border-cyan-700 dark:bg-cyan-400 dark:text-[#050507] dark:border-cyan-400 font-semibold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300/90 hover:border-cyan-700/45 hover:text-slate-950 dark:bg-[#0B0B10] dark:text-zinc-300 dark:border-white/10 dark:hover:border-cyan-400/40 dark:hover:text-white'
                }`}
              >
                <span>{filter.label}</span>
                <span
                  className={`font-mono-tech text-[11px] tabular-nums ${
                    isActive
                      ? 'text-cyan-50 dark:text-[#050507]/80'
                      : 'text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  {String(filter.count).padStart(2, '0')}
                </span>
              </button>
            );
          })}
        </div>

        {/* Horizontal Scrollable Showcase Rail with Directional Overflow Cues */}
        <div className="relative">
          {/* Left Edge Fade Cue */}
          <div
            aria-hidden="true"
            className={`pointer-events-none hidden sm:block absolute inset-y-0 left-0 w-10 z-20 bg-gradient-to-r from-[#F8FAFC] dark:from-[#050507] to-transparent transition-opacity duration-200 ${
              canScrollLeft ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Right Edge Fade Cue */}
          <div
            aria-hidden="true"
            className={`pointer-events-none hidden sm:block absolute inset-y-0 right-0 w-12 z-20 bg-gradient-to-l from-[#F8FAFC] dark:from-[#050507] to-transparent transition-opacity duration-200 ${
              canScrollRight ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div
            ref={trackRef}
            role="region"
            aria-label="Project showcase carousel"
            onScroll={handleTrackScroll}
            onPointerDown={handleTrackPointerDown}
            onPointerMove={handleTrackPointerMove}
            onPointerUp={endMouseDrag}
            onPointerCancel={endMouseDrag}
            onPointerLeave={endMouseDrag}
            onClickCapture={handleTrackClickCapture}
            className={`relative flex items-stretch gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar [touch-action:pan-x_pan-y] py-2 -my-2 px-1 -mx-1 ${
              filteredProjects.length > 1
                ? isDragging
                  ? 'cursor-grabbing select-none'
                  : 'lg:cursor-grab'
                : ''
            }`}
          >
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                onInspect={(proj) => setInspectedProject(proj)}
                onNavigateCard={(dir) => handleCardNavigation(idx, dir)}
                cardRefCallback={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className={
                  filteredProjects.length === 1
                    ? 'w-full shrink-0 snap-start'
                    : 'w-[88vw] sm:w-[82vw] md:w-[78vw] lg:w-[860px] xl:w-[960px] max-w-[calc(100vw-2.25rem)] shrink-0 snap-start'
                }
              />
            ))}
          </div>
        </div>

        {/* Bottom Progress Rail & Quick-Jump Project Index */}
        {filteredProjects.length > 1 && (
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10">
            {/* GPU-Composited Scroll Progress Bar */}
            <div
              aria-hidden="true"
              className="w-full h-1 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden mb-3.5"
            >
              <div
                style={{ transform: `scaleX(${progressScale})` }}
                className="h-full w-full origin-left rounded-full bg-cyan-700 dark:bg-cyan-400 transition-transform duration-150 ease-out will-change-transform"
              />
            </div>

            {/* Direct Quick-Jump Project Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                {filteredProjects.map((project, idx) => {
                  const isCurrent = activeIndex === idx;
                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => scrollToProject(idx)}
                      aria-current={isCurrent ? 'true' : undefined}
                      className={`inline-flex items-center gap-2 min-h-[44px] sm:min-h-[38px] px-3 py-1.5 rounded-lg border text-xs whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 touch-manipulation ${
                        isCurrent
                          ? 'bg-cyan-700/10 border-cyan-700/40 text-cyan-800 dark:bg-cyan-400/12 dark:border-cyan-400/45 dark:text-cyan-300 font-semibold'
                          : 'bg-transparent border-transparent text-slate-600 hover:text-slate-950 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <span className="font-mono-tech text-[11px] text-cyan-700 dark:text-cyan-400 font-semibold">
                        {project.index}.
                      </span>
                      <span>{project.title}</span>
                    </button>
                  );
                })}
              </div>

              <span className="hidden md:inline-block text-[11px] font-mono-tech text-slate-600 dark:text-zinc-400 shrink-0">
                Drag, swipe, or use arrows to browse
              </span>
            </div>
          </div>
        )}
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
              <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-600 dark:text-zinc-400 min-w-0">
                <span className="text-cyan-700 dark:text-cyan-400 font-semibold shrink-0">
                  {inspectedProject.index}.
                </span>
                <span aria-hidden="true" className="shrink-0">
                  ·
                </span>
                <span className="truncate">{inspectedProject.subtitle}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {activeModalList.length > 1 && (
                  <span className="hidden sm:inline-block text-xs font-mono-tech text-slate-500 dark:text-zinc-400 mr-1 tabular-nums">
                    {String(activeModalPosition).padStart(2, '0')} /{' '}
                    {String(activeModalList.length).padStart(2, '0')}
                  </span>
                )}
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
                  width={1200}
                  height={670}
                  decoding="async"
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

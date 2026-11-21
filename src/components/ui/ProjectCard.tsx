import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Maximize2, Layers } from 'lucide-react';
import { ProjectItem } from '@/src/data/portfolio';
import type gsapNamespace from 'gsap';
import { usePrefersReducedMotion } from '@/src/lib/usePrefersReducedMotion';

let gsapModulePromise: Promise<typeof gsapNamespace> | null = null;
const getGsap = () => {
  if (!gsapModulePromise) {
    gsapModulePromise = import('@/src/animations/gsap').then((m) => m.gsap);
  }
  return gsapModulePromise;
};

interface ProjectCardProps {
  project: ProjectItem;
  onInspect: (project: ProjectItem) => void;
  onNavigateCard?: (direction: 'prev' | 'next' | 'first' | 'last') => void;
  cardRefCallback?: (el: HTMLElement | null) => void;
  className?: string;
}

const TAP_SCROLL_THRESHOLD_PX = 8;

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onInspect,
  onNavigateCard,
  cardRefCallback,
  className = '',
}) => {
  const cardRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const touchTapRef = useRef<{ x: number; y: number; active: boolean; pointerType: string }>({
    x: 0,
    y: 0,
    active: false,
    pointerType: 'mouse',
  });
  const [imgError, setImgError] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion && imageRef.current) {
      if (gsapModulePromise) {
        void getGsap().then((gsap) => {
          if (!imageRef.current) return;
          gsap.killTweensOf(imageRef.current);
          gsap.set(imageRef.current, { scale: 1, x: 0, y: 0, clearProps: 'transform' });
        });
      } else {
        imageRef.current.style.transform = '';
      }
    }
  }, [reducedMotion]);

  const animateImageZoomIn = () => {
    if (reducedMotion || !imageRef.current) return;
    void getGsap().then((gsap) => {
      if (!imageRef.current) return;
      gsap.to(imageRef.current, {
        scale: 1.04,
        duration: 0.5,
        ease: 'power3.out',
      });
    });
  };

  const animateImageReset = () => {
    if (reducedMotion || !imageRef.current) return;
    void getGsap().then((gsap) => {
      if (!imageRef.current) return;
      gsap.to(imageRef.current, {
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
      });
    });
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    animateImageZoomIn();
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    animateImageReset();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || reducedMotion || !cardRef.current || !imageRef.current) {
      return;
    }
    const rect = cardRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    void getGsap().then((gsap) => {
      if (!imageRef.current) return;
      gsap.to(imageRef.current, {
        x: relX * -14,
        y: relY * -14,
        duration: 0.4,
        ease: 'power2.out',
      });
    });
  };

  const handleMediaPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || e.pointerType === 'pen') {
      touchTapRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
        pointerType: e.pointerType,
      };
    } else {
      touchTapRef.current = {
        x: 0,
        y: 0,
        active: false,
        pointerType: e.pointerType || 'mouse',
      };
    }
  };

  const handleMediaPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!touchTapRef.current.active) return;
    const dx = Math.abs(e.clientX - touchTapRef.current.x);
    const dy = Math.abs(e.clientY - touchTapRef.current.y);
    if (dx > TAP_SCROLL_THRESHOLD_PX || dy > TAP_SCROLL_THRESHOLD_PX) {
      // Cancel tap intent when user is swiping/scrolling
      touchTapRef.current.active = false;
    }
  };

  const handleMediaPointerCancel = () => {
    touchTapRef.current.active = false;
  };

  const handleMediaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Avoid double-triggering when user clicked the dedicated Inspect button inside media frame
    if ((e.target as HTMLElement).closest('button')) return;

    // On touch/pen pointers, enforce clean tap without scroll drift
    if (touchTapRef.current.pointerType !== 'mouse' && !touchTapRef.current.active) {
      return;
    }
    touchTapRef.current.active = false;
    onInspect(project);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    // Only handle card-level activation when the article itself is the focused target
    if (e.target === e.currentTarget) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onInspect(project);
        return;
      }
    }

    if (onNavigateCard) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        onNavigateCard('next');
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        onNavigateCard('prev');
      } else if (e.key === 'Home') {
        e.preventDefault();
        onNavigateCard('first');
      } else if (e.key === 'End') {
        e.preventDefault();
        onNavigateCard('last');
      }
    }
  };

  return (
    <article
      ref={(node) => {
        cardRef.current = node;
        cardRefCallback?.(node);
      }}
      tabIndex={0}
      aria-labelledby={`project-heading-${project.id}`}
      onKeyDown={handleCardKeyDown}
      onFocus={(e) => {
        if (e.currentTarget.matches(':focus-visible')) {
          animateImageZoomIn();
        }
      }}
      onBlur={animateImageReset}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      className={`project-card-item group relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-9 items-stretch p-5 sm:p-7 lg:p-8 rounded-2xl bg-white dark:bg-[#0B0B10] border border-slate-300/90 dark:border-white/10 hover:border-cyan-700 dark:hover:border-cyan-400/40 focus-within:border-cyan-700 dark:focus-within:border-cyan-400/50 shadow-xs dark:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC] dark:focus-visible:ring-offset-[#050507] transition-colors duration-200 [touch-action:pan-x_pan-y] [-webkit-tap-highlight-color:transparent] ${className}`}
    >
      {/* Left / Top Media Container with Touch-Safe Tap-to-Inspect */}
      <div
        onPointerDown={handleMediaPointerDown}
        onPointerMove={handleMediaPointerMove}
        onPointerCancel={handleMediaPointerCancel}
        onClick={handleMediaClick}
        className="lg:col-span-6 relative overflow-hidden rounded-xl bg-slate-100 dark:bg-[#12121A] border border-slate-200 dark:border-white/10 aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[320px] cursor-pointer [touch-action:pan-x_pan-y] select-none"
      >
        <div className="project-card-media-inner w-full h-full will-change-transform">
          {!imgError ? (
            <img
              ref={imageRef}
              src={project.image}
              alt={`${project.title} — ${project.subtitle}`}
              width={1200}
              height={670}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              draggable={false}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center will-change-transform"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-100 via-white to-cyan-50 dark:from-[#0F172A] dark:via-[#0B0B10] dark:to-[#1E1B4B] text-center">
              <Layers className="w-10 h-10 text-cyan-700 dark:text-cyan-400 mb-3 opacity-80" />
              <span className="font-display text-xl font-bold text-slate-950 dark:text-zinc-100">
                {project.title}
              </span>
              <span className="text-xs text-slate-600 dark:text-zinc-400 mt-1">
                {project.subtitle}
              </span>
            </div>
          )}
        </div>

        {/* Measured contrast scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/75 via-[#050507]/15 to-transparent pointer-events-none" />

        {/* Quick Inspect Overlay Button (>=44px mobile touch target) */}
        <button
          type="button"
          onClick={() => onInspect(project)}
          data-cursor="inspect"
          aria-label={`Inspect architecture and preview for ${project.title}`}
          className="absolute bottom-3.5 right-3.5 sm:bottom-4 sm:right-4 z-10 inline-flex items-center gap-2 min-h-[44px] sm:min-h-0 px-4 py-2.5 sm:px-3.5 sm:py-2 rounded-lg bg-white/95 dark:bg-[#050507]/85 backdrop-blur-md border border-slate-300 dark:border-white/15 text-xs font-semibold text-slate-900 dark:text-zinc-200 hover:text-cyan-800 hover:border-cyan-700 dark:hover:text-cyan-300 dark:hover:border-cyan-400/50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 transition-[color,border-color,transform] cursor-pointer whitespace-nowrap shadow-sm touch-manipulation"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Inspect Case Study</span>
        </button>
      </div>

      {/* Right / Content Column */}
      <div className="lg:col-span-6 flex flex-col justify-between">
        <div>
          {/* Clean unboxed metadata with typographic separators */}
          <div className="project-card-stagger flex flex-wrap items-center gap-2 text-xs font-mono-tech text-slate-600 dark:text-zinc-400 mb-2.5">
            <span className="text-cyan-700 dark:text-cyan-400 font-semibold">{project.index}.</span>
            <span aria-hidden="true">·</span>
            <span>{project.subtitle}</span>
          </div>

          <h3
            id={`project-heading-${project.id}`}
            className="project-card-stagger font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-zinc-100 tracking-tight mb-3"
          >
            {project.title}
          </h3>

          <p className="project-card-stagger text-sm sm:text-[15px] text-slate-700 dark:text-zinc-300 leading-relaxed mb-5">
            {project.description}
          </p>

          {/* Engineering Highlights */}
          <div className="project-card-stagger mb-5">
            <div className="text-xs font-mono-tech text-slate-600 dark:text-zinc-400 mb-2">
              Key Capabilities &amp; Architecture
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:text-[13px] text-slate-700 dark:text-zinc-300">
              {project.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-700 dark:text-cyan-400 mt-0.5 select-none" aria-hidden="true">
                    ·
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="project-card-stagger pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Unboxed tech stack with middle-dot separators */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono-tech text-slate-600 dark:text-zinc-400">
            {project.technologies.map((tech, idx) => (
              <React.Fragment key={tech}>
                <span className="text-slate-800 dark:text-zinc-300">{tech}</span>
                {idx < project.technologies.length - 1 && (
                  <span aria-hidden="true" className="text-slate-400 dark:text-zinc-600">
                    ·
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="external"
              className="inline-flex items-center gap-2 min-h-[44px] sm:min-h-0 px-4 py-2.5 sm:py-2 rounded-lg bg-cyan-700 text-white hover:bg-cyan-800 dark:bg-cyan-400 dark:text-[#050507] dark:hover:bg-cyan-300 active:scale-[0.98] text-xs sm:text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0B0B10] transition-[background-color,transform] whitespace-nowrap shrink-0 touch-manipulation"
            >
              <span>Live Deployment</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

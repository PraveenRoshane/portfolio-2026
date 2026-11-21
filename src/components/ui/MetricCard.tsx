import React, { useRef, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { observeWhenNearViewport } from '@/src/animations/scrollAnimations';
import { MetricItem } from '@/src/data/portfolio';
import { usePrefersReducedMotion } from '@/src/lib/usePrefersReducedMotion';

interface MetricCardProps {
  metric: MetricItem;
  index: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const detailWrapperRef = useRef<HTMLDivElement>(null);
  const detailContentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [count, setCount] = useState<number>(reducedMotion ? metric.value : 0);
  const [hasCompleted, setHasCompleted] = useState<boolean>(reducedMotion);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const isExpanded = isHovered || isFocused || isPinned;
  const detailId = `metric-detail-${metric.id}`;

  // Trigger entrance and number counter cleanly when MetricCard approaches the viewport
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (reducedMotion) {
      setCount(metric.value);
      setHasCompleted(true);
      return;
    }

    let cancelled = false;
    let entryTween: { kill: () => void } | null = null;
    let counterTween: { kill: () => void } | null = null;

    const stopObserve = observeWhenNearViewport(
      el,
      () => {
        void import('@/src/animations/gsap').then(({ gsap }) => {
          if (cancelled) return;
          const counterObj = { val: 0 };
          entryTween = gsap.fromTo(
            el,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              delay: index * 0.08,
              ease: 'power3.out',
              force3D: true,
              clearProps: 'transform,opacity',
            }
          );
          counterTween = gsap.to(counterObj, {
            val: metric.value,
            duration: 1.4,
            delay: index * 0.08,
            ease: 'power2.out',
            onUpdate: () => {
              setCount(Math.round(counterObj.val));
            },
            onComplete: () => {
              setHasCompleted(true);
            },
          });
        });
      },
      '0px 0px -30px 0px'
    );

    return () => {
      cancelled = true;
      stopObserve();
      entryTween?.kill();
      counterTween?.kill();
    };
  }, [metric.value, index, reducedMotion]);

  const hasInteractedRef = useRef(false);

  // Smooth GSAP height: 'auto' reveal without shifting sibling cards or the Experience section below
  useEffect(() => {
    const card = cardRef.current;
    const wrapper = detailWrapperRef.current;
    const content = detailContentRef.current;
    if (!card || !wrapper || !content) return;

    if (!hasInteractedRef.current && !isExpanded) {
      return;
    }
    hasInteractedRef.current = true;

    let cancelled = false;
    void import('@/src/animations/gsap').then(({ gsap }) => {
      if (cancelled) return;
      gsap.killTweensOf([wrapper, content]);

      if (reducedMotion) {
        gsap.set(card, { zIndex: isExpanded ? 30 : 10 });
        gsap.set(wrapper, { height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 });
        gsap.set(content, { opacity: isExpanded ? 1 : 0, y: 0 });
        return;
      }

      if (isExpanded) {
        gsap.set(card, { zIndex: 30 });
        gsap.to(wrapper, {
          height: 'auto',
          opacity: 1,
          duration: 0.48,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        gsap.to(content, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: 0.08,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      } else {
        gsap.set(card, { zIndex: 20 });
        gsap.to(content, {
          opacity: 0,
          y: 8,
          duration: 0.22,
          ease: 'power2.in',
          overwrite: 'auto',
        });
        gsap.to(wrapper, {
          height: 0,
          opacity: 0,
          duration: 0.38,
          delay: 0.04,
          ease: 'power2.inOut',
          overwrite: 'auto',
          onComplete: () => {
            gsap.set(card, { zIndex: 10 });
          },
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isExpanded, reducedMotion]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Escape' && isExpanded) {
      e.preventDefault();
      setIsPinned(false);
      setIsHovered(false);
      setIsFocused(false);
    }
  };

  return (
    <div ref={cardRef} className="relative h-full z-10">
      {/* In-flow invisible sizer guarantees uniform card height across the grid and prevents layout shifts */}
      <div
        aria-hidden="true"
        className="invisible pointer-events-none select-none h-full flex flex-col p-6 sm:p-7"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono-tech text-xs">0{index + 1}</span>
          <span className="w-6 h-6" />
        </div>
        <div>
          <div className="font-display text-3xl sm:text-4xl font-bold font-mono-tech tracking-tight mb-2 whitespace-nowrap">
            {metric.displayValue}
          </div>
          <h3 className="text-base font-semibold mb-1.5">{metric.label}</h3>
          <p className="text-xs sm:text-sm leading-relaxed">{metric.context}</p>
        </div>
      </div>

      {/* Interactive card matches cell height at rest and expands cleanly on hover/focus/tap */}
      <article
        onPointerEnter={(e) => {
          if (e.pointerType !== 'touch') {
            setIsHovered(true);
          }
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== 'touch') {
            setIsHovered(false);
          }
        }}
        className={`group absolute inset-x-0 top-0 min-h-full flex flex-col p-6 sm:p-7 rounded-2xl border ${
          isExpanded
            ? 'bg-white dark:bg-[#0E0E15] border-cyan-700 dark:border-cyan-400/50 shadow-xl shadow-slate-900/10 dark:shadow-[0_20px_44px_-12px_rgba(0,0,0,0.85)] -translate-y-0.5'
            : 'bg-white dark:bg-[#0B0B10] border-slate-300/90 dark:border-white/10 shadow-xs dark:shadow-none'
        } focus-within:ring-2 focus-within:ring-cyan-700 dark:focus-within:ring-cyan-400 focus-within:ring-offset-2 focus-within:ring-offset-[#F8FAFC] dark:focus-within:ring-offset-[#050507] ${
          reducedMotion
            ? ''
            : 'transition-[background-color,border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono-tech text-xs text-slate-600 dark:text-zinc-400">
            0{index + 1}
          </span>

          <button
            type="button"
            aria-expanded={isExpanded}
            aria-controls={detailId}
            aria-label={`${metric.label}: ${metric.displayValue}. ${
              isExpanded ? 'Hide achievement details' : 'Show achievement details'
            }`}
            onClick={() => setIsPinned((prev) => !prev)}
            onFocus={(e) => {
              if (e.currentTarget.matches(':focus-visible')) {
                setIsFocused(true);
              }
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            className="after:absolute after:inset-0 after:rounded-2xl after:content-[''] inline-flex items-center justify-center w-6 h-6 rounded-md text-slate-600 dark:text-zinc-400 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 focus:outline-none cursor-pointer"
          >
            <ChevronDown
              aria-hidden="true"
              className={`w-4 h-4 ${
                reducedMotion
                  ? ''
                  : 'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]'
              } ${isExpanded ? 'rotate-180 text-cyan-700 dark:text-cyan-400' : ''}`}
            />
          </button>
        </div>

        <div>
          <div className="font-display text-3xl sm:text-4xl font-bold text-slate-950 dark:text-zinc-100 font-mono-tech tracking-tight mb-2 whitespace-nowrap">
            {hasCompleted ? (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-slate-800 to-cyan-700 dark:from-white dark:via-zinc-100 dark:to-cyan-300">
                {metric.displayValue}
              </span>
            ) : (
              <span>
                {count}
                {metric.suffix}
              </span>
            )}
          </div>

          <h3 className="text-base font-semibold text-slate-900 dark:text-zinc-200 mb-1.5">
            {metric.label}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            {metric.context}
          </p>
        </div>

        {/* GSAP height: 'auto' Hover / Focus / Tap-Triggered Expansion */}
        <div
          id={detailId}
          ref={detailWrapperRef}
          aria-hidden={!isExpanded}
          style={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div ref={detailContentRef} className="pt-4">
            <div className="pt-4 border-t border-slate-200 dark:border-white/10">
              <p className="text-xs sm:text-[13px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                {metric.detail}
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

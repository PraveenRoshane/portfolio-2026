import React, { useState, useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import {
  SKILLS_DATA,
  SKILL_CATEGORIES,
  SkillCategoryFilter,
  SkillNode,
} from '@/src/data/portfolio';
import { SectionHeading } from '@/src/components/ui/SectionHeading';
import { TechIcon } from '@/src/components/ui/TechIcon';
import { usePrefersReducedMotion } from '@/src/lib/usePrefersReducedMotion';
import { useTheme } from '@/src/lib/ThemeContext';

const TOP_MATRIX_COUNT = 10;

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  if (Number.isNaN(num)) return `rgba(0, 240, 255, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<SkillCategoryFilter>('All');
  const [selectedSkill, setSelectedSkill] = useState<SkillNode>(SKILLS_DATA[0]);
  const [hoveredSkillName, setHoveredSkillName] = useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const categoryReadoutRef = useRef<HTMLDivElement>(null);
  const prevCategoryRef = useRef<SkillCategoryFilter>(activeCategory);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const skillCardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const filteredSkills = useMemo(
    () =>
      activeCategory === 'All'
        ? SKILLS_DATA
        : SKILLS_DATA.filter((s) => s.category === activeCategory),
    [activeCategory]
  );

  const topSkills = useMemo(
    () => filteredSkills.slice(0, TOP_MATRIX_COUNT),
    [filteredSkills]
  );
  const overflowSkills = useMemo(
    () => filteredSkills.slice(TOP_MATRIX_COUNT),
    [filteredSkills]
  );

  // Trim stale DOM refs when filtered list length shrinks
  skillCardRefs.current.length = filteredSkills.length;

  const categoryCounts = useMemo(() => {
    const counts: Record<SkillCategoryFilter, number> = {
      All: SKILLS_DATA.length,
      Frontend: 0,
      Backend: 0,
      Databases: 0,
      'Cloud & DevOps': 0,
      'UI / Styling': 0,
      'Tools & Practices': 0,
    };
    for (const skill of SKILLS_DATA) {
      counts[skill.category] += 1;
    }
    return counts;
  }, []);

  // Pre-compute radial coordinates on a 400x400 coordinate space (center 200, 200)
  const nodePositions = useMemo(() => {
    const radii = { 1: 68, 2: 122, 3: 174 };
    const map = new Map<
      string,
      { x: number; y: number; leftPercent: number; topPercent: number }
    >();
    for (const node of SKILLS_DATA) {
      const r = radii[node.orbitRing];
      const rad = (node.angle * Math.PI) / 180;
      const x = 200 + r * Math.cos(rad);
      const y = 200 + r * Math.sin(rad);
      map.set(node.name, {
        x,
        y,
        leftPercent: (x / 400) * 100,
        topPercent: (y / 400) * 100,
      });
    }
    return map;
  }, []);

  const handleCategoryChange = useCallback(
    (category: SkillCategoryFilter) => {
      if (category === activeCategory) return;

      setHoveredSkillName(null);
      setActiveCategory(category);

      if (category !== 'All') {
        const firstInCategory = SKILLS_DATA.find((s) => s.category === category);
        if (firstInCategory) {
          setSelectedSkill((current) =>
            current.category === category ? current : firstInCategory
          );
        }
      }
    },
    [activeCategory]
  );

  // Fluid GPU-composited tab-switch transition on wrapper containers
  useLayoutEffect(() => {
    if (prevCategoryRef.current === activeCategory) {
      return;
    }
    prevCategoryRef.current = activeCategory;

    const grid = gridRef.current;
    if (!grid) return;

    let cancelled = false;
    let ctx: { revert: () => void } | null = null;

    void import('@/src/animations/gsap').then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !gridRef.current) return;
      ctx = gsap.context(() => {
        const items = gsap.utils.toArray<HTMLElement>('.skill-matrix-item');
        const readout = categoryReadoutRef.current;
        if (!items.length) return;

        gsap.killTweensOf(items);
        if (readout) gsap.killTweensOf(readout);

        if (reducedMotion) {
          gsap.set(items, { opacity: 1, y: 0, scale: 1, clearProps: 'transform,opacity,willChange' });
          if (readout) {
            gsap.set(readout, { opacity: 1, y: 0, clearProps: 'transform,opacity' });
          }
          ScrollTrigger.refresh();
          return;
        }

        if (readout) {
          gsap.fromTo(
            readout,
            { opacity: 0.35, y: 4 },
            {
              opacity: 1,
              y: 0,
              duration: 0.24,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
            }
          );
        }

        gsap.fromTo(
          items,
          {
            opacity: 0,
            y: 10,
            scale: 0.985,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.28,
            stagger: {
              amount: 0.14,
              from: 'start',
            },
            ease: 'power3.out',
            overwrite: 'auto',
            force3D: true,
            clearProps: 'transform,opacity,willChange',
            onComplete: () => {
              ScrollTrigger.refresh();
            },
          }
        );
      }, grid);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [activeCategory, reducedMotion]);

  // WAI-ARIA Tablist keyboard interaction (ArrowLeft, ArrowRight, Home, End)
  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const total = SKILL_CATEGORIES.length;
    let nextIdx = idx;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIdx = (idx + 1) % total;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIdx = (idx - 1 + total) % total;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIdx = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIdx = total - 1;
    } else {
      return;
    }

    handleCategoryChange(SKILL_CATEGORIES[nextIdx]);
    tabRefs.current[nextIdx]?.focus();
  };

  // Keyboard grid traversal across skill cards
  const handleSkillCardKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const total = filteredSkills.length;
    if (total === 0) return;

    let targetIdx = idx;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      targetIdx = (idx + 1) % total;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      targetIdx = (idx - 1 + total) % total;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIdx = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIdx = total - 1;
    } else {
      return;
    }

    setSelectedSkill(filteredSkills[targetIdx]);
    skillCardRefs.current[targetIdx]?.focus();
  };

  const renderSkillCard = (skill: SkillNode, idx: number) => {
    const isSelected = selectedSkill.name === skill.name;
    const isHovered = hoveredSkillName === skill.name;
    const isGlowActive = isHovered || isSelected;

    const cardGlowShadow = isHovered
      ? `0 6px 24px -2px ${hexToRgba(skill.brandColor, isDark ? 0.34 : 0.28)}, 0 0 28px 2px ${hexToRgba(skill.brandColor, isDark ? 0.22 : 0.16)}`
      : isSelected
        ? `0 4px 18px -2px ${hexToRgba(skill.brandColor, isDark ? 0.22 : 0.18)}, 0 0 20px 1px ${hexToRgba(skill.brandColor, isDark ? 0.14 : 0.11)}`
        : undefined;

    return (
      <div key={skill.name} className="skill-matrix-item h-full">
        <button
          ref={(el) => {
            skillCardRefs.current[idx] = el;
          }}
          type="button"
          aria-pressed={isSelected}
          onClick={() => setSelectedSkill(skill)}
          onFocus={() => setSelectedSkill(skill)}
          onPointerEnter={(e) => {
            if (e.pointerType !== 'touch') {
              setHoveredSkillName(skill.name);
            }
            setSelectedSkill(skill);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType !== 'touch') {
              setHoveredSkillName((prev) => (prev === skill.name ? null : prev));
            }
          }}
          onKeyDown={(e) => handleSkillCardKeyDown(e, idx)}
          style={{
            boxShadow: cardGlowShadow,
            borderColor: isGlowActive
              ? hexToRgba(skill.brandColor, isHovered ? 0.85 : 0.58)
              : undefined,
          }}
          className={`group relative overflow-hidden text-left w-full h-full flex flex-col justify-between p-4 rounded-xl border ${
            reducedMotion
              ? ''
              : 'transition-[transform,background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]'
          } cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC] dark:focus-visible:ring-offset-[#050507] ${
            isHovered
              ? `bg-white dark:bg-[#11131C] ${reducedMotion ? '' : 'scale-[1.015]'}`
              : isSelected
                ? 'bg-white shadow-xs dark:bg-[#11131C]'
                : 'bg-white border-slate-300/90 hover:border-slate-400 shadow-xs dark:shadow-none dark:bg-[#0B0B10] dark:border-white/10 dark:hover:border-white/25'
          }`}
        >
          {/* Soft radial brand aura emitted across card surface on hover/active */}
          <span
            aria-hidden="true"
            style={{
              background: `radial-gradient(circle at 20% 24%, ${hexToRgba(
                skill.brandColor,
                isDark ? (isHovered ? 0.18 : 0.11) : isHovered ? 0.13 : 0.08
              )} 0%, transparent 68%)`,
            }}
            className={`pointer-events-none absolute inset-0 ${
              reducedMotion ? '' : 'transition-opacity duration-200'
            } ${isGlowActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          />

          <div className="relative z-10 w-full flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                style={{
                  borderColor: isGlowActive ? skill.brandColor : undefined,
                }}
                className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${
                  reducedMotion
                    ? ''
                    : 'transition-[background-color,border-color,color] duration-200'
                } ${
                  isGlowActive
                    ? 'bg-white text-slate-950 dark:bg-[#0E1628] dark:text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-700 dark:bg-white/5 dark:border-white/10 dark:text-zinc-300'
                }`}
              >
                <TechIcon name={skill.name} className="w-3.5 h-3.5" />
              </span>
              <span className="font-display text-base font-bold text-slate-950 dark:text-zinc-100 truncate">
                {skill.name}
              </span>
            </div>
            <span className="text-[11px] font-mono-tech text-slate-600 dark:text-zinc-400 shrink-0">
              {skill.category}
            </span>
          </div>
          <p className="relative z-10 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
            {skill.context}
          </p>
        </button>
      </div>
    );
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="cv-section relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/10"
    >
      <div className="section-entrance">
        {/* Parallel 12-column Header + Structured Domain Filter Rail (mirrors 5/7 split below) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 lg:items-stretch mb-10">
          <div className="lg:col-span-5 flex flex-col justify-center">
            <SectionHeading
              index="03"
              kicker="Technical Ecosystem"
              title="Full-stack architecture stack."
              subtitle="Interactive visualization of technologies deployed across banking, IAM, e-commerce, and modern web applications."
              className="!mb-0 !max-w-none"
            />
          </div>

          {/* Structured Modern Tab Selection Control */}
          <div className="lg:col-span-7 w-full flex items-center">
            <div className="w-full p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0B0B10] border border-slate-300/90 dark:border-white/10 shadow-xs dark:shadow-none">
              {/* Top Metadata Strip */}
              <div className="flex items-center justify-between gap-4 pb-3 mb-3 border-b border-slate-200 dark:border-white/10 text-xs font-mono-tech">
                <span className="text-slate-600 dark:text-zinc-400">Domain Filter</span>
                <div
                  ref={categoryReadoutRef}
                  aria-live="polite"
                  className="flex items-center gap-2 text-slate-600 dark:text-zinc-400 tabular-nums"
                >
                  <span className="text-cyan-700 dark:text-cyan-400 font-semibold truncate max-w-[140px] sm:max-w-none">
                    {activeCategory}
                  </span>
                  <span aria-hidden="true" className="text-slate-400 dark:text-zinc-600">
                    ·
                  </span>
                  <span>
                    {String(filteredSkills.length).padStart(2, '0')} / {SKILLS_DATA.length}
                  </span>
                </div>
              </div>

              {/* Flat Semantic Tablist Grid: All Stack + Symmetrical Domain Cells */}
              <div
                role="tablist"
                aria-label="Filter technologies by category"
                className="grid grid-cols-2 sm:grid-cols-[116px_repeat(2,minmax(0,1fr))] xl:grid-cols-[118px_repeat(3,minmax(0,1fr))] gap-2 items-stretch"
              >
                {SKILL_CATEGORIES.map((category, idx) => {
                  const isAll = idx === 0;
                  const isActive = activeCategory === category;
                  const count = categoryCounts[category];

                  return (
                    <button
                      key={category}
                      ref={(el) => {
                        tabRefs.current[idx] = el;
                      }}
                      role="tab"
                      id={`skill-tab-${idx}`}
                      aria-selected={isActive}
                      aria-controls="skills-tabpanel"
                      tabIndex={isActive ? 0 : -1}
                      type="button"
                      onClick={() => handleCategoryChange(category)}
                      onKeyDown={(e) => handleTabKeyDown(e, idx)}
                      className={`group min-h-[44px] rounded-xl border text-left flex cursor-pointer whitespace-nowrap min-w-0 ${
                        isAll
                          ? 'col-span-2 sm:col-span-1 sm:row-span-3 xl:row-span-2 px-3.5 py-2.5 sm:flex-col items-center sm:items-start justify-between gap-1.5'
                          : 'px-3 py-2 items-center justify-between gap-2'
                      } ${
                        reducedMotion
                          ? ''
                          : 'transition-[background-color,border-color,color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]'
                      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 ${
                        isActive
                          ? 'bg-cyan-700 text-white border-cyan-700 dark:bg-cyan-400 dark:text-[#050507] dark:border-cyan-400 font-semibold shadow-xs'
                          : 'bg-slate-50/90 text-slate-700 border-slate-200 hover:border-cyan-700/45 hover:text-slate-950 hover:bg-slate-100/80 dark:bg-white/[0.03] dark:text-zinc-300 dark:border-white/[0.08] dark:hover:border-cyan-400/40 dark:hover:text-white dark:hover:bg-white/[0.06]'
                      }`}
                    >
                      <span className={isAll ? 'text-xs font-medium tracking-tight' : 'text-xs truncate'}>
                        {isAll ? 'All Stack' : category}
                      </span>
                      <span
                        className={`font-mono-tech tabular-nums shrink-0 ${
                          isAll
                            ? `text-xs sm:text-lg font-display font-bold leading-none ${
                                isActive
                                  ? 'text-cyan-50 dark:text-[#050507]'
                                  : 'text-slate-600 group-hover:text-cyan-700 dark:text-zinc-400 dark:group-hover:text-cyan-300'
                              }`
                            : `text-[11px] ${
                                isActive
                                  ? 'text-cyan-50 dark:text-[#050507]/85 font-semibold'
                                  : 'text-slate-600 group-hover:text-cyan-700 dark:text-zinc-400 dark:group-hover:text-cyan-300'
                              }`
                        }`}
                      >
                        {String(count).padStart(2, '0')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      {/* Main Constellation + Balanced L-Wrap Matrix */}
      <div
        id="skills-tabpanel"
        ref={gridRef}
        role="tabpanel"
        aria-label={`${activeCategory} technologies`}
      >
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 ${
            overflowSkills.length > 0 ? 'lg:items-stretch' : 'items-start'
          }`}
        >
          {/* Left: Interactive Radial Skill Constellation + Inspector Panel */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B0B10] border border-slate-300/90 dark:border-white/10 shadow-xs dark:shadow-none flex flex-col items-center justify-between">
            <div className="w-full flex items-center justify-between text-xs font-mono-tech text-slate-600 dark:text-zinc-400 mb-3">
              <span>Architecture Constellation</span>
              <span>{SKILLS_DATA.length} Nodes Active</span>
            </div>

            {/* Interactive Radial Orbit System with Technology Logo Badges */}
            <div
              role="group"
              aria-label="Interactive technology constellation map"
              className="relative w-full max-w-[332px] aspect-square my-2 select-none"
            >
            {/* Background SVG Orbit Rings & Active Vector Line */}
            <svg
              viewBox="0 0 400 400"
              className="pointer-events-none absolute inset-0 w-full h-full overflow-visible"
              aria-hidden="true"
            >
              {/* Concentric Orbit Rings */}
              <circle
                cx="200"
                cy="200"
                r="68"
                fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.14)'}
                strokeDasharray="3 3"
              />
              <circle
                cx="200"
                cy="200"
                r="122"
                fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.12)'}
              />
              <circle
                cx="200"
                cy="200"
                r="174"
                fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.10)'}
                strokeDasharray="4 4"
              />

              {/* Connection vector to currently selected node */}
              {selectedSkill &&
                (() => {
                  const pos = nodePositions.get(selectedSkill.name);
                  if (!pos) return null;
                  return (
                    <line
                      x1="200"
                      y1="200"
                      x2={pos.x}
                      y2={pos.y}
                      stroke={isDark ? '#00F0FF' : '#0E7490'}
                      strokeWidth="1.5"
                      strokeOpacity={isDark ? '0.65' : '0.8'}
                    />
                  );
                })()}
            </svg>

            {/* Central Core Hub */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-cyan-700 text-white border border-cyan-800 shadow-md dark:bg-[#0F172A] dark:text-cyan-300 dark:border-cyan-400 dark:shadow-[0_0_24px_rgba(0,240,255,0.25)] flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path
                  d="M12 3L19.8 7.5V16.5L12 21L4.2 16.5V7.5L12 3Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="2.4" fill="currentColor" />
                <path
                  d="M12 3V9.6M19.8 16.5L14.1 13.2M4.2 16.5L9.9 13.2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Technology SVG Icon Nodes with Brand Glow-on-Hover */}
            {SKILLS_DATA.map((node) => {
              const pos = nodePositions.get(node.name) ?? { leftPercent: 50, topPercent: 50 };
              const { leftPercent, topPercent } = pos;
              const isSelected = selectedSkill.name === node.name;
              const isHovered = hoveredSkillName === node.name;
              const isGlowActive = isHovered || isSelected;
              const isCategoryMatch =
                activeCategory === 'All' || node.category === activeCategory;

              const brandShadow = isHovered
                ? `0 0 20px 3px ${hexToRgba(node.brandColor, isDark ? 0.55 : 0.42)}, 0 0 38px 8px ${hexToRgba(node.brandColor, isDark ? 0.28 : 0.2)}`
                : isSelected
                  ? `0 0 16px 2px ${hexToRgba(node.brandColor, isDark ? 0.42 : 0.32)}, 0 0 28px 4px ${hexToRgba(node.brandColor, isDark ? 0.18 : 0.14)}`
                  : undefined;

              return (
                <button
                  key={node.name}
                  type="button"
                  tabIndex={isCategoryMatch ? 0 : -1}
                  title={`${node.name} · ${node.category}`}
                  aria-label={`${node.name} (${node.category})`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedSkill(node)}
                  onFocus={() => setSelectedSkill(node)}
                  onPointerEnter={(e) => {
                    if (e.pointerType !== 'touch') {
                      setHoveredSkillName(node.name);
                    }
                    setSelectedSkill(node);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType !== 'touch') {
                      setHoveredSkillName((prev) => (prev === node.name ? null : prev));
                    }
                  }}
                  style={{
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                    opacity: isCategoryMatch ? 1 : 0.25,
                    boxShadow: brandShadow,
                    borderColor: isGlowActive ? node.brandColor : undefined,
                  }}
                  className={`group absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center ${
                    reducedMotion
                      ? ''
                      : 'transition-[transform,opacity,background-color,border-color,color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]'
                  } will-change-[transform,opacity] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 ${
                    isHovered
                      ? `z-40 w-10 h-10 bg-white text-slate-950 border-2 dark:bg-[#0E1628] dark:text-white ${
                          reducedMotion ? '' : 'scale-125'
                        }`
                      : isSelected
                        ? `z-30 w-10 h-10 bg-white text-slate-950 border-2 dark:bg-[#0E1628] dark:text-white ${
                            reducedMotion ? '' : 'scale-110'
                          }`
                        : `z-20 w-8 h-8 bg-slate-100 text-slate-800 border border-slate-300 dark:bg-[#12121C] dark:text-zinc-300 dark:border-white/15 ${
                            reducedMotion ? '' : 'hover:scale-125'
                          }`
                  }`}
                >
                  {/* Soft internal radial brand aura on hover/active */}
                  <span
                    aria-hidden="true"
                    style={{
                      background: `radial-gradient(circle, ${hexToRgba(
                        node.brandColor,
                        isDark ? 0.28 : 0.2
                      )} 0%, transparent 72%)`,
                    }}
                    className={`pointer-events-none absolute inset-0 rounded-full ${
                      reducedMotion ? '' : 'transition-opacity duration-200'
                    } ${isGlowActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  />
                  <TechIcon
                    name={node.name}
                    className={`relative z-10 ${isGlowActive ? 'w-5 h-5' : 'w-4 h-4'}`}
                  />
                </button>
              );
            })}
          </div>

          {/* Selected Node Telemetry Readout with aria-live for screen readers */}
          <div
            aria-live="polite"
            className="w-full mt-3 pt-4 border-t border-slate-200 dark:border-white/10"
          >
            <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-700 dark:text-cyan-400 font-medium mb-1.5">
              <span>{selectedSkill.category}</span>
              <span>Ring 0{selectedSkill.orbitRing}</span>
            </div>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-700/10 border border-cyan-700/25 text-cyan-800 dark:bg-cyan-400/10 dark:border-cyan-400/30 dark:text-cyan-300 flex items-center justify-center shrink-0">
                <TechIcon name={selectedSkill.name} className="w-4 h-4" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-slate-950 dark:text-white">
                {selectedSkill.name}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              {selectedSkill.context}
            </p>
          </div>
        </div>

        {/* Right: Top Skill Matrix Tier (matches Constellation height cleanly) */}
        <div
          className={`lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 ${
            overflowSkills.length > 0 ? 'lg:auto-rows-fr' : 'content-start'
          }`}
        >
          {topSkills.map((skill, idx) => renderSkillCard(skill, idx))}
        </div>
        </div>

        {/* Bottom: Full-Width 3-Column Overflow Row filling beneath Constellation */}
        {overflowSkills.length > 0 && (
          <div className="mt-3.5 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {overflowSkills.map((skill, offsetIdx) =>
              renderSkillCard(skill, TOP_MATRIX_COUNT + offsetIdx)
            )}
          </div>
        )}
      </div>
      </div>
    </section>
  );
};

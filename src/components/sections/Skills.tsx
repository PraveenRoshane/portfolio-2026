import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import {
  SKILLS_DATA,
  SKILL_CATEGORIES,
  SkillCategoryFilter,
  SkillNode,
} from '@/src/data/portfolio';
import { SectionHeading } from '@/src/components/ui/SectionHeading';
import { TechIcon } from '@/src/components/ui/TechIcon';
import { gsap } from '@/src/animations/gsap';
import { usePrefersReducedMotion } from '@/src/lib/usePrefersReducedMotion';
import { useTheme } from '@/src/lib/ThemeContext';

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
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const skillCardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const filteredSkills =
    activeCategory === 'All'
      ? SKILLS_DATA
      : SKILLS_DATA.filter((s) => s.category === activeCategory);

  const handleCategoryChange = useCallback((category: SkillCategoryFilter) => {
    setActiveCategory((prev) => {
      if (prev === category) return prev;
      return category;
    });
    if (category !== 'All') {
      const firstInCategory = SKILLS_DATA.find((s) => s.category === category);
      if (firstInCategory) {
        setSelectedSkill((current) =>
          current.category === category ? current : firstInCategory
        );
      }
    }
  }, []);

  // Run before browser paint to prevent initial flash and ensure 60fps GPU-accelerated entrance
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.skill-matrix-item');
      if (!items.length) return;

      gsap.killTweensOf(items);

      if (reducedMotion) {
        gsap.set(items, { opacity: 1, y: 0, scale: 1, clearProps: 'transform' });
        return;
      }

      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: 12,
          scale: 0.985,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.32,
          stagger: {
            each: 0.014,
            from: 'start',
          },
          ease: 'expo.out',
          overwrite: 'auto',
          force3D: true,
          clearProps: 'transform',
        }
      );
    }, grid);

    return () => ctx.revert();
  }, [activeCategory, reducedMotion]);

  // Compute radial coordinates on a 400x400 coordinate space (center 200, 200)
  const getCoordinates = (node: SkillNode) => {
    const radii = { 1: 68, 2: 122, 3: 174 };
    const r = radii[node.orbitRing];
    const rad = (node.angle * Math.PI) / 180;
    const x = 200 + r * Math.cos(rad);
    const y = 200 + r * Math.sin(rad);
    return { x, y };
  };

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

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/10"
    >
      <div className="section-entrance">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <SectionHeading
          index="03"
          kicker="Technical Ecosystem"
          title="Full-stack constellation & architecture stack."
          subtitle="Interactive visualization of technologies deployed across banking, IAM, e-commerce, and modern web applications."
          className="mb-0"
        />

        {/* Interactive Filter Segmented Control with Roving Tabindex */}
        <div
          role="tablist"
          aria-label="Filter technologies by category"
          className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-white dark:bg-[#0B0B10] border border-slate-300/90 dark:border-white/10 shadow-xs dark:shadow-none self-start lg:self-auto"
        >
          {SKILL_CATEGORIES.map((category, idx) => {
            const isActive = activeCategory === category;
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
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 ${
                  isActive
                    ? 'bg-cyan-700 text-white dark:bg-cyan-400 dark:text-[#050507] font-semibold'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-white/5'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Constellation + Matrix Split */}
      <div
        id="skills-tabpanel"
        role="tabpanel"
        aria-label={`${activeCategory} technologies`}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
      >
        {/* Left: Interactive Radial Skill Constellation + Inspector Panel */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0B0B10] border border-slate-300/90 dark:border-white/10 shadow-xs dark:shadow-none flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs font-mono-tech text-slate-600 dark:text-zinc-400 mb-4">
            <span>Architecture Constellation</span>
            <span>{SKILLS_DATA.length} Nodes Active</span>
          </div>

          {/* Interactive Radial Orbit System with Technology Logo Badges */}
          <div
            role="group"
            aria-label="Interactive technology constellation map"
            className="relative w-full max-w-[370px] aspect-square my-3 select-none"
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
                  const { x, y } = getCoordinates(selectedSkill);
                  return (
                    <line
                      x1="200"
                      y1="200"
                      x2={x}
                      y2={y}
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
              const { x, y } = getCoordinates(node);
              const leftPercent = (x / 400) * 100;
              const topPercent = (y / 400) * 100;
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
            className="w-full mt-4 pt-5 border-t border-slate-200 dark:border-white/10"
          >
            <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-700 dark:text-cyan-400 font-medium mb-2">
              <span>{selectedSkill.category}</span>
              <span>Ring 0{selectedSkill.orbitRing}</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-700/10 border border-cyan-700/25 text-cyan-800 dark:bg-cyan-400/10 dark:border-cyan-400/30 dark:text-cyan-300 flex items-center justify-center shrink-0">
                <TechIcon name={selectedSkill.name} className="w-4 h-4" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                {selectedSkill.name}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              {selectedSkill.context}
            </p>
          </div>
        </div>

        {/* Right: Accessible Categorized Interactive Skill Matrix */}
        <div
          ref={gridRef}
          className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start"
        >
          {filteredSkills.map((skill, idx) => {
            const isSelected = selectedSkill.name === skill.name;
            const isHovered = hoveredSkillName === skill.name;
            const isGlowActive = isHovered || isSelected;

            const cardGlowShadow = isHovered
              ? `0 6px 24px -2px ${hexToRgba(skill.brandColor, isDark ? 0.34 : 0.28)}, 0 0 28px 2px ${hexToRgba(skill.brandColor, isDark ? 0.22 : 0.16)}`
              : isSelected
                ? `0 4px 18px -2px ${hexToRgba(skill.brandColor, isDark ? 0.22 : 0.18)}, 0 0 20px 1px ${hexToRgba(skill.brandColor, isDark ? 0.14 : 0.11)}`
                : undefined;

            return (
              <button
                key={skill.name}
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
                className={`skill-matrix-item group relative overflow-hidden text-left p-5 rounded-xl border ${
                  reducedMotion
                    ? ''
                    : 'transition-[transform,background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]'
                } will-change-[transform,opacity] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC] dark:focus-visible:ring-offset-[#050507] ${
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

                <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      style={{
                        borderColor: isGlowActive ? skill.brandColor : undefined,
                      }}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
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
                    <span className="font-display text-base sm:text-lg font-bold text-slate-950 dark:text-zinc-100">
                      {skill.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono-tech text-slate-600 dark:text-zinc-500">
                    {skill.category}
                  </span>
                </div>
                <p className="relative z-10 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                  {skill.context}
                </p>
              </button>
            );
          })}
        </div>
      </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, FileText, Sun, Moon } from 'lucide-react';
import { PERSONAL_INFO } from '@/src/data/portfolio';
import { gsap, ScrollTrigger } from '@/src/animations/gsap';
import { REDUCED_MOTION_QUERY } from '@/src/lib/utils';
import { usePrefersReducedMotion } from '@/src/lib/usePrefersReducedMotion';
import { useFocusTrap } from '@/src/lib/useFocusTrap';
import { useTheme } from '@/src/lib/ThemeContext';

interface NavbarProps {
  onOpenResume: () => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Experience', href: '#experience', id: 'experience' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const reducedMotion = usePrefersReducedMotion();
  const { theme, toggleTheme } = useTheme();
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const indicatorTrackRef = useRef<HTMLSpanElement>(null);
  const indicatorFillRef = useRef<HTMLSpanElement>(null);
  const desktopNavRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const activeSectionRef = useRef('home');
  const sectionProgressRef = useRef(0);
  const isHoveringNavRef = useRef(false);
  const activeMetricsRef = useRef<{
    left: number;
    width: number;
    navWidth: number;
    visible: boolean;
  }>({ left: 0, width: 0, navWidth: 1, visible: false });

  const mobileOverlayRef = useFocusTrap<HTMLDivElement>(mobileMenuOpen, () =>
    setMobileMenuOpen(false)
  );

  // Update the continuous progress fill inside the active nav link without React re-renders
  const syncProgressFill = useCallback((progress: number) => {
    if (isHoveringNavRef.current) return;
    const fillEl = indicatorFillRef.current;
    const { left, width, navWidth, visible } = activeMetricsRef.current;
    if (!fillEl || !visible || navWidth <= 0) return;

    const clamped = Math.max(0.12, Math.min(1, progress));
    gsap.set(fillEl, {
      x: left,
      scaleX: (width * clamped) / navWidth,
      opacity: 1,
    });
  }, []);

  // Glide the active nav track & fill to match the active (or hovered) link bounds
  const positionNavIndicator = useCallback(
    (targetSectionId: string, progress: number, immediate = false) => {
      const navEl = navRef.current;
      const trackEl = indicatorTrackRef.current;
      const fillEl = indicatorFillRef.current;
      if (!navEl || !trackEl || !fillEl) return;

      const idx = NAV_LINKS.findIndex((item) => item.id === targetSectionId);
      const linkEl = idx >= 0 ? desktopNavRefs.current[idx] : null;
      const navWidth = navEl.offsetWidth || 1;

      if (!linkEl || linkEl.offsetParent === null) {
        activeMetricsRef.current = { left: 0, width: 0, navWidth, visible: false };
        gsap.to([trackEl, fillEl], {
          opacity: 0,
          duration: immediate || reducedMotion ? 0 : 0.18,
          overwrite: 'auto',
        });
        return;
      }

      const left = linkEl.offsetLeft;
      const width = linkEl.offsetWidth;
      const clamped = Math.max(0.12, Math.min(1, progress));
      activeMetricsRef.current = { left, width, navWidth, visible: true };

      if (immediate || reducedMotion) {
        gsap.set(trackEl, {
          x: left,
          scaleX: width / navWidth,
          opacity: 1,
        });
        gsap.set(fillEl, {
          x: left,
          scaleX: (width * clamped) / navWidth,
          opacity: 1,
        });
        return;
      }

      gsap.to(trackEl, {
        x: left,
        scaleX: width / navWidth,
        opacity: 1,
        duration: 0.34,
        ease: 'power3.out',
        overwrite: 'auto',
      });
      gsap.to(fillEl, {
        x: left,
        scaleX: (width * clamped) / navWidth,
        opacity: 1,
        duration: 0.34,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    },
    [reducedMotion]
  );

  // Sync sliding indicator whenever activeSection changes or on resize
  useEffect(() => {
    activeSectionRef.current = activeSection;
    positionNavIndicator(activeSection, sectionProgressRef.current);
  }, [activeSection, positionNavIndicator]);

  useEffect(() => {
    const handleResize = () => {
      positionNavIndicator(activeSectionRef.current, sectionProgressRef.current, true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [positionNavIndicator]);

  // Dynamic ScrollTrigger section tracking + header elevation state
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    const headerTrigger = ScrollTrigger.create({
      start: 24,
      end: 'max',
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });
    triggers.push(headerTrigger);
    setScrolled(window.scrollY > 24);

    const sections = NAV_LINKS.map((item) => ({
      id: item.id,
      el: document.getElementById(item.id),
    })).filter((s): s is { id: string; el: HTMLElement } => s.el !== null);

    sections.forEach((section, idx) => {
      const isFirst = idx === 0;
      const isLast = idx === sections.length - 1;
      const nextSection = !isLast ? sections[idx + 1] : null;
      const nextStartOffset = idx + 1 === sections.length - 1 ? 'top 62%' : 'top 38%';

      const st = ScrollTrigger.create({
        trigger: section.el,
        start: isFirst ? 'top top' : isLast ? 'top 62%' : 'top 38%',
        endTrigger: nextSection ? nextSection.el : document.documentElement,
        end: nextSection ? nextStartOffset : 'bottom bottom',
        onEnter: () => {
          sectionProgressRef.current = 0;
          setActiveSection(section.id);
        },
        onEnterBack: () => {
          sectionProgressRef.current = 1;
          setActiveSection(section.id);
        },
        onUpdate: (self) => {
          if (self.isActive) {
            if (activeSectionRef.current !== section.id) {
              setActiveSection(section.id);
            }
            sectionProgressRef.current = self.progress;
            syncProgressFill(self.progress);
          }
        },
      });

      triggers.push(st);
    });

    // Ensure bottom of page always resolves to the final section on tall screens
    if (sections.length > 0) {
      const lastId = sections[sections.length - 1].id;
      const bottomTrigger = ScrollTrigger.create({
        trigger: document.documentElement,
        start: 'bottom-=40 bottom',
        onEnter: () => {
          sectionProgressRef.current = 1;
          setActiveSection(lastId);
          syncProgressFill(1);
        },
      });
      triggers.push(bottomTrigger);
    }

    // Refresh bounds after initial layout/fonts settle
    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      positionNavIndicator(activeSectionRef.current, sectionProgressRef.current, true);
    });

    return () => {
      cancelAnimationFrame(rafId);
      triggers.forEach((t) => t.kill());
    };
  }, [positionNavIndicator, syncProgressFill]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        reduceMotion: REDUCED_MOTION_QUERY,
        allowMotion: '(prefers-reduced-motion: no-preference)',
      },
      (context) => {
        const { reduceMotion } = context.conditions ?? {};
        if (reduceMotion) {
          gsap.set(header, { opacity: 1, y: 0, clearProps: 'transform' });
          return;
        }
        gsap.fromTo(
          header,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 }
        );
      },
      header
    );

    return () => mm.revert();
  }, []);

  useEffect(() => {
    const overlay = mobileOverlayRef.current;
    if (!overlay) return;

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      if (reducedMotion) {
        gsap.set(overlay, { autoAlpha: 1, y: 0 });
        gsap.set('.mobile-nav-item', { opacity: 1, y: 0, clearProps: 'transform' });
      } else {
        gsap.to(overlay, {
          autoAlpha: 1,
          y: 0,
          duration: 0.35,
          ease: 'power3.out',
        });
        gsap.fromTo(
          '.mobile-nav-item',
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.05,
            ease: 'power3.out',
          }
        );
      }
    } else {
      document.body.style.overflow = '';
      if (reducedMotion) {
        gsap.set(overlay, { autoAlpha: 0, y: 0 });
      } else {
        gsap.to(overlay, {
          autoAlpha: 0,
          y: -12,
          duration: 0.25,
          ease: 'power2.in',
        });
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, mobileOverlayRef, reducedMotion]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: (typeof NAV_LINKS)[number],
    fromMobile = false
  ) => {
    const targetEl = document.getElementById(item.id);
    if (!targetEl) return;

    e.preventDefault();
    if (fromMobile) {
      setMobileMenuOpen(false);
    }

    setActiveSection(item.id);
    targetEl.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });

    if (window.history?.replaceState) {
      window.history.replaceState(null, '', item.href);
    }
  };

  // Keyboard navigation across desktop nav items (Left/Right/Home/End)
  const handleDesktopNavKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    const visibleLinks = desktopNavRefs.current.filter(
      (el): el is HTMLAnchorElement => el !== null && el.offsetParent !== null
    );
    const currentVisibleIdx = visibleLinks.indexOf(e.currentTarget);
    if (currentVisibleIdx === -1) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = visibleLinks[(currentVisibleIdx + 1) % visibleLinks.length];
      next?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev =
        visibleLinks[(currentVisibleIdx - 1 + visibleLinks.length) % visibleLinks.length];
      prev?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      visibleLinks[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      visibleLinks[visibleLinks.length - 1]?.focus();
    }
  };

  return (
    <>
      {/* Skip to Main Content Link for Keyboard Users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:rounded-lg focus:bg-cyan-700 focus:text-white dark:focus:bg-cyan-400 dark:focus:text-[#050507] focus:font-semibold focus:text-xs focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
          scrolled
            ? 'bg-white/90 dark:bg-[#050507]/85 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-xs dark:shadow-none'
            : 'bg-transparent border-b border-slate-200/70 dark:border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 lg:gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, NAV_LINKS[0])}
            className="font-display text-lg font-bold tracking-tight text-slate-950 hover:text-cyan-800 dark:text-white dark:hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC] dark:focus-visible:ring-offset-[#050507]"
          >
            {PERSONAL_INFO.brandMark}
          </a>

          {/* Zone 2: Clean text navigation links with ScrollTrigger gliding progress indicator */}
          <nav
            ref={navRef}
            aria-label="Primary Navigation"
            onMouseLeave={() => {
              isHoveringNavRef.current = false;
              positionNavIndicator(activeSectionRef.current, sectionProgressRef.current);
            }}
            className="hidden md:flex relative items-center gap-6 lg:gap-7 text-sm font-medium text-slate-600 dark:text-zinc-400"
          >
            {NAV_LINKS.map((item, idx) => {
              const isCurrent = activeSection === item.id;
              return (
                <a
                  key={item.href}
                  ref={(el) => {
                    desktopNavRefs.current[idx] = el;
                  }}
                  href={item.href}
                  aria-current={isCurrent ? 'location' : undefined}
                  onClick={(e) => {
                    isHoveringNavRef.current = false;
                    handleNavClick(e, item);
                  }}
                  onMouseEnter={() => {
                    isHoveringNavRef.current = true;
                    positionNavIndicator(
                      item.id,
                      isCurrent ? sectionProgressRef.current : 1
                    );
                  }}
                  onKeyDown={handleDesktopNavKeyDown}
                  className={`${
                    idx >= 5 ? 'hidden xl:inline-block' : ''
                  } relative py-1.5 px-1 rounded-sm transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC] dark:focus-visible:ring-offset-[#050507] ${
                    isCurrent
                      ? 'text-cyan-800 dark:text-cyan-300 font-semibold'
                      : 'text-slate-700 hover:text-cyan-800 dark:text-zinc-300 dark:hover:text-cyan-300'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}

            {/* Interactive ScrollTrigger Progress Track & Fill */}
            <span
              ref={indicatorTrackRef}
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left rounded-full bg-cyan-700/20 dark:bg-cyan-400/20 opacity-0 will-change-transform"
            />
            <span
              ref={indicatorFillRef}
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left rounded-full bg-cyan-700 dark:bg-cyan-400 opacity-0 will-change-transform"
            />
          </nav>

          {/* Zone 3: Theme Toggle & Primary Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={theme === 'light'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex items-center justify-center gap-1.5 h-9 px-2.5 sm:px-3 text-xs font-medium rounded-lg bg-white text-slate-800 border border-slate-300 hover:border-cyan-700 hover:text-cyan-800 dark:bg-[#111118] dark:text-zinc-200 dark:border-white/15 dark:hover:border-cyan-400/50 dark:hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC] dark:focus-visible:ring-offset-[#050507]"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                  <span className="hidden lg:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-cyan-800" aria-hidden="true" />
                  <span className="hidden lg:inline">Dark</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenResume}
              className="inline-flex items-center gap-2 h-9 px-3 sm:px-3.5 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg hover:border-cyan-700 hover:text-cyan-800 dark:text-zinc-200 dark:bg-[#111118] dark:border-white/15 dark:hover:border-cyan-400/50 dark:hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC] dark:focus-visible:ring-offset-[#050507]"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
              <span>Resume</span>
            </button>

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, NAV_LINKS[5])}
              className="hidden sm:inline-flex items-center justify-center h-9 px-4 text-xs font-semibold text-white bg-cyan-700 rounded-lg hover:bg-cyan-800 dark:text-[#050507] dark:bg-cyan-400 dark:hover:bg-cyan-300 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC] dark:focus-visible:ring-offset-[#050507]"
            >
              Let&apos;s Talk
            </a>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-200/70 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC] dark:focus-visible:ring-offset-[#050507]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer with Focus Trap & Escape Handling */}
      <div
        id="mobile-navigation-drawer"
        ref={mobileOverlayRef}
        role="dialog"
        aria-modal={mobileMenuOpen ? 'true' : undefined}
        aria-label="Mobile Navigation Menu"
        aria-hidden={!mobileMenuOpen}
        style={{ visibility: 'hidden', opacity: 0 }}
        className="fixed inset-0 z-30 md:hidden bg-white/95 dark:bg-[#050507]/95 backdrop-blur-xl pt-24 px-6 pb-10 flex flex-col justify-between"
      >
        <nav aria-label="Mobile Navigation" className="flex flex-col space-y-5">
          {NAV_LINKS.map((item, idx) => {
            const isCurrent = activeSection === item.id;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isCurrent ? 'location' : undefined}
                data-autofocus={idx === 0 ? 'true' : undefined}
                tabIndex={mobileMenuOpen ? 0 : -1}
                onClick={(e) => handleNavClick(e, item, true)}
                className={`mobile-nav-item flex items-center justify-between font-display text-2xl font-bold rounded-lg px-2 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 ${
                  isCurrent
                    ? 'text-cyan-800 dark:text-cyan-300'
                    : 'text-slate-900 hover:text-cyan-700 dark:text-zinc-100 dark:hover:text-cyan-400'
                }`}
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-mono-tech text-xs text-cyan-700 dark:text-cyan-400">
                    0{idx + 1}.
                  </span>
                  <span>{item.label}</span>
                </span>
                {isCurrent && (
                  <span className="text-xs font-mono-tech font-medium text-cyan-700 dark:text-cyan-400">
                    Active
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        <div className="mobile-nav-item pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col gap-3">
          <button
            type="button"
            tabIndex={mobileMenuOpen ? 0 : -1}
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenResume();
            }}
            className="w-full py-3 rounded-xl bg-slate-100 border border-slate-300 text-sm font-medium text-slate-900 hover:border-cyan-700 dark:bg-[#111118] dark:border-white/15 dark:text-zinc-100 dark:hover:border-cyan-400/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400"
          >
            View &amp; Download Resume
          </button>
          <a
            href="#contact"
            tabIndex={mobileMenuOpen ? 0 : -1}
            onClick={(e) => handleNavClick(e, NAV_LINKS[5], true)}
            className="w-full py-3 rounded-xl bg-cyan-700 text-white dark:bg-cyan-400 dark:text-[#050507] text-center text-sm font-semibold hover:bg-cyan-800 dark:hover:bg-cyan-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400"
          >
            Start a Conversation
          </a>
        </div>
      </div>
    </>
  );
};

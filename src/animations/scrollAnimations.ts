import type gsapNamespace from 'gsap';

type GsapCore = typeof gsapNamespace;

let cachedGsapPromise: Promise<GsapCore> | null = null;
function loadGsap(): Promise<GsapCore> {
  if (!cachedGsapPromise) {
    cachedGsapPromise = import('./gsap').then((m) => m.gsap);
  }
  return cachedGsapPromise;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

// Batch initial opacity=0 DOM writes in a single animation frame after all IntersectionObserver reads settle
const pendingHideElements = new Set<HTMLElement>();
let hideFlushRafId: number | null = null;

function scheduleHide(el: HTMLElement) {
  pendingHideElements.add(el);
  if (hideFlushRafId !== null) return;
  hideFlushRafId = requestAnimationFrame(() => {
    hideFlushRafId = null;
    pendingHideElements.forEach((node) => {
      node.style.opacity = '0';
    });
    pendingHideElements.clear();
  });
}

function cancelScheduledHide(el: HTMLElement) {
  pendingHideElements.delete(el);
}

/**
 * Observe a trigger element via native IntersectionObserver with zero synchronous layout
 * reads/getComputedStyle thrash during initial page boot.
 */
export function observeWhenNearViewport(
  target: HTMLElement | null,
  onVisible: () => void,
  rootMargin = '240px 0px'
): () => void {
  if (!target || typeof IntersectionObserver === 'undefined') {
    onVisible();
    return () => {};
  }

  let triggered = false;
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry || triggered) return;
      const hasBox = entry.boundingClientRect.height > 0 || entry.boundingClientRect.width > 0;
      const inOrAbove =
        entry.isIntersecting ||
        (hasBox && entry.boundingClientRect.top < window.innerHeight);
      if (inOrAbove) {
        triggered = true;
        observer.disconnect();
        onVisible();
      }
    },
    { rootMargin, threshold: 0.01 }
  );

  observer.observe(target);
  return () => observer.disconnect();
}

export function animateSectionReveal(container: HTMLElement | null, selector = '.reveal-up') {
  if (!container) return () => {};

  const elements = Array.from(container.querySelectorAll<HTMLElement>(selector));
  if (!elements.length) return () => {};

  if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
    return () => {};
  }

  let cancelled = false;
  let hasAnimated = false;
  let hiddenScheduled = false;
  let tween: ReturnType<GsapCore['fromTo']> | null = null;

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry || hasAnimated) return;

      const vh = window.innerHeight || 900;
      const hasBox = entry.boundingClientRect.height > 0 || entry.boundingClientRect.width > 0;
      const inOrAboveView =
        entry.isIntersecting || (hasBox && entry.boundingClientRect.top < vh * 0.92);

      if (!inOrAboveView) {
        if (!hiddenScheduled && (window.scrollY === 0 || (hasBox && entry.boundingClientRect.top >= vh * 0.92))) {
          hiddenScheduled = true;
          for (const el of elements) {
            scheduleHide(el);
          }
        }
        return;
      }

      hasAnimated = true;
      observer.disconnect();

      for (const el of elements) {
        cancelScheduledHide(el);
      }

      void loadGsap().then((gsap) => {
        if (cancelled) return;
        if (!hiddenScheduled) {
          tween = gsap.fromTo(
            elements,
            { y: 14 },
            {
              y: 0,
              duration: 0.55,
              stagger: 0.06,
              ease: 'power3.out',
              clearProps: 'transform,opacity,willChange',
            }
          );
        } else {
          tween = gsap.fromTo(
            elements,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.72,
              stagger: 0.08,
              ease: 'power3.out',
              force3D: true,
              clearProps: 'transform,opacity,willChange',
            }
          );
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
  );

  observer.observe(container);

  return () => {
    cancelled = true;
    observer.disconnect();
    for (const el of elements) {
      cancelScheduledHide(el);
    }
    tween?.kill();
  };
}

const observedSectionEntrances = new WeakSet<HTMLElement>();

export function animateMainSectionsEntrance(
  container: HTMLElement | null,
  selector = '.section-entrance'
) {
  if (!container) return () => {};

  const sectionEls = Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !observedSectionEntrances.has(el)
  );
  if (!sectionEls.length) return () => {};

  if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
    return () => {};
  }

  const cleanupFns: Array<() => void> = [];

  sectionEls.forEach((sectionEl) => {
    observedSectionEntrances.add(sectionEl);
    const landmark = sectionEl.closest<HTMLElement>('section, footer') ?? sectionEl;
    const isFooter = landmark.tagName.toLowerCase() === 'footer';
    let cancelled = false;
    let hasAnimated = false;
    let hiddenScheduled = false;
    let tween: ReturnType<GsapCore['fromTo']> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || hasAnimated) return;

        const vh = window.innerHeight || 900;
        const hasBox = entry.boundingClientRect.height > 0 || entry.boundingClientRect.width > 0;
        const inOrAboveView =
          entry.isIntersecting || (hasBox && entry.boundingClientRect.top < vh * 0.94);

        if (!inOrAboveView) {
          if (!hiddenScheduled && (window.scrollY === 0 || (hasBox && entry.boundingClientRect.top >= vh * 0.94))) {
            hiddenScheduled = true;
            scheduleHide(sectionEl);
          }
          return;
        }

        hasAnimated = true;
        observer.disconnect();
        cancelScheduledHide(sectionEl);

        if (!hiddenScheduled) {
          sectionEl.style.opacity = '1';
          return;
        }

        void loadGsap().then((gsap) => {
          if (cancelled) return;
          tween = gsap.fromTo(
            sectionEl,
            { opacity: 0, y: isFooter ? 16 : 22 },
            {
              opacity: 1,
              y: 0,
              duration: isFooter ? 0.6 : 0.72,
              ease: 'power3.out',
              force3D: true,
              clearProps: 'transform,opacity,willChange',
            }
          );
        });
      },
      { threshold: 0.02, rootMargin: isFooter ? '0px 0px 20px 0px' : '0px 0px -50px 0px' }
    );

    observer.observe(landmark);
    cleanupFns.push(() => {
      cancelled = true;
      observedSectionEntrances.delete(sectionEl);
      observer.disconnect();
      cancelScheduledHide(sectionEl);
      tween?.kill();
    });
  });

  return () => {
    cleanupFns.forEach((fn) => fn());
  };
}

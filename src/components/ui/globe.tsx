import React, { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/src/lib/utils';
import { usePrefersReducedMotion } from '@/src/lib/usePrefersReducedMotion';

export interface EarthProps {
  className?: string;
  theta?: number;
  dark?: number;
  scale?: number;
  diffuse?: number;
  mapSamples?: number;
  mapBrightness?: number;
  baseColor?: [number, number, number];
  markerColor?: [number, number, number];
  glowColor?: [number, number, number];
  markers?: Array<{ location: [number, number]; size: number }>;
}

const DEFAULT_MARKERS: Array<{ location: [number, number]; size: number }> = [
  { location: [6.9271, 79.8612], size: 0.09 }, // Colombo / Gampaha, Sri Lanka
  { location: [51.5074, -0.1278], size: 0.05 }, // London
  { location: [40.7128, -74.006], size: 0.05 }, // New York
  { location: [37.7749, -122.4194], size: 0.05 }, // San Francisco
  { location: [1.3521, 103.8198], size: 0.06 }, // Singapore
  { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
  { location: [50.1109, 8.6821], size: 0.05 }, // Frankfurt
  { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney
  { location: [25.2048, 55.2708], size: 0.05 }, // Dubai
];

// Deterministic dot-matrix continental clusters across a 2:1 equirectangular tile for zero-blocking Frame 1 globe visual
const CONTINENT_DOTS: Array<[number, number]> = [
  // North America
  [48, 62], [62, 54], [76, 54], [60, 72], [74, 70], [88, 72], [72, 86], [86, 90], [80, 102],
  // South America
  [100, 132], [114, 132], [108, 146], [120, 152], [114, 166], [116, 182],
  // Europe
  [174, 54], [190, 54], [204, 58], [182, 68], [198, 68],
  // Africa
  [178, 96], [194, 96], [208, 102], [184, 112], [200, 114], [192, 128], [204, 140], [198, 158],
  // Middle East & Asia
  [226, 88], [244, 82], [262, 76], [280, 78], [238, 64], [258, 60], [278, 64], [296, 68],
  [258, 98], [278, 98], [296, 96], [288, 118],
  // Oceania
  [308, 154], [324, 156], [318, 168], [340, 174],
];

// Visible global engineering hub pins synced on initial sphere (Sri Lanka highlighted)
const HERO_PINS = [
  { x: 186, y: 122, primary: true, label: 'Colombo, Sri Lanka' },
  { x: 118, y: 66, primary: false, label: 'London' },
  { x: 158, y: 98, primary: false, label: 'Dubai' },
  { x: 214, y: 132, primary: false, label: 'Singapore' },
  { x: 248, y: 84, primary: false, label: 'Tokyo' },
  { x: 74, y: 78, primary: false, label: 'New York' },
  { x: 130, y: 70, primary: false, label: 'Frankfurt' },
];

export const Earth: React.FC<EarthProps> = ({
  className,
  theta = 0.25,
  dark = 1,
  scale = 1.1,
  diffuse = 1.2,
  mapSamples = 6000,
  mapBrightness = 6,
  baseColor = [0.4, 0.6509, 1],
  markerColor = [1, 0, 0],
  glowColor = [0.2745, 0.5765, 0.898],
  markers = DEFAULT_MARKERS,
}) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasHostRef = useRef<HTMLDivElement | null>(null);
  const [webglRequested, setWebglRequested] = useState(false);
  const [webglReady, setWebglReady] = useState(false);
  const pointerStateRef = useRef<{
    active: boolean;
    pointerId: number | null;
    pointerType: string;
    startX: number;
    startY: number;
    anchorX: number;
    gestureLock: 'none' | 'horizontal' | 'vertical';
  }>({
    active: false,
    pointerId: null,
    pointerType: '',
    startX: 0,
    startY: 0,
    anchorX: 0,
    gestureLock: 'none',
  });
  const interactionOffsetRef = useRef<number>(0);
  const rTargetRef = useRef<number>(0);
  const rCurrentRef = useRef<number>(0);
  const reducedMotion = usePrefersReducedMotion();
  const sphereClipId = useId();
  const isDarkTheme = dark >= 0.5;

  // Hydrate full interactive 3D WebGL cobe globe cleanly on first user engagement
  useEffect(() => {
    if (!webglRequested) return;
    const host = hostRef.current;
    const canvasHost = canvasHostRef.current;
    if (!host || !canvasHost) return;

    let cancelled = false;
    let animationFrameId = 0;
    let yieldTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let observer: IntersectionObserver | null = null;
    let globeInstance: { update: (state: Record<string, unknown>) => void; destroy: () => void } | null = null;
    let onResizeHandler: (() => void) | null = null;
    let onVisibilityHandler: (() => void) | null = null;

    if (reducedMotion) {
      pointerStateRef.current.active = false;
      pointerStateRef.current.gestureLock = 'none';
      interactionOffsetRef.current = 0;
      rTargetRef.current = 0;
      rCurrentRef.current = 0;
    }

    const mountGlobe = async () => {
      const { default: createGlobe } = await import('cobe');
      if (cancelled || !canvasHostRef.current) return;

      const currentCanvasHost = canvasHostRef.current;
      const canvas = document.createElement('canvas');
      canvas.setAttribute(
        'aria-label',
        reducedMotion ? 'Static 3D Earth Globe' : 'Interactive 3D Earth Globe'
      );
      canvas.className = cn(
        'w-full h-full select-none',
        reducedMotion ? 'cursor-default' : 'cursor-grab'
      );
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.contain = 'layout paint size';
      currentCanvasHost.replaceChildren(canvas);

      const getRenderSize = () => Math.min(Math.max(host.offsetWidth || 340, 260), 360);
      let renderSize = getRenderSize();
      let phi = 4.2;

      const globe = createGlobe(canvas, {
        devicePixelRatio: 1,
        width: renderSize,
        height: renderSize,
        phi,
        theta,
        dark,
        scale,
        diffuse,
        mapSamples,
        mapBrightness,
        baseColor,
        markerColor,
        glowColor,
        opacity: 1,
        offset: [0, 0],
        markers,
      });
      globeInstance = globe;
      setWebglReady(true);

      let inViewport = true;
      let pageVisible = !document.hidden;

      const scheduleNextFrame = (frameCostMs: number) => {
        if (cancelled || reducedMotion || !inViewport || !pageVisible) return;
        if (frameCostMs > 18 && !pointerStateRef.current.active) {
          yieldTimeoutId = setTimeout(() => {
            yieldTimeoutId = null;
            if (!cancelled && inViewport && pageVisible) {
              animationFrameId = requestAnimationFrame(animate);
            }
          }, Math.min(200, Math.round(frameCostMs * 2)));
        } else {
          animationFrameId = requestAnimationFrame(animate);
        }
      };

      const animate = () => {
        animationFrameId = 0;
        if (cancelled || !inViewport || !pageVisible) return;

        const t0 = performance.now();
        const isDraggingGlobe =
          pointerStateRef.current.active &&
          pointerStateRef.current.gestureLock === 'horizontal';

        if (!isDraggingGlobe) {
          phi += 0.004;
        }

        rCurrentRef.current += (rTargetRef.current - rCurrentRef.current) * 0.14;

        globe.update({
          phi: phi + rCurrentRef.current,
          width: renderSize,
          height: renderSize,
        });

        const frameCost = performance.now() - t0;
        scheduleNextFrame(frameCost);
      };

      const startLoop = () => {
        if (reducedMotion || animationFrameId || yieldTimeoutId !== null || !inViewport || !pageVisible || cancelled) {
          return;
        }
        animationFrameId = requestAnimationFrame(animate);
      };

      const stopLoop = () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = 0;
        }
        if (yieldTimeoutId !== null) {
          clearTimeout(yieldTimeoutId);
          yieldTimeoutId = null;
        }
      };

      onResizeHandler = () => {
        if (!hostRef.current) return;
        renderSize = getRenderSize();
        if (reducedMotion) {
          globe.update({
            phi,
            width: renderSize,
            height: renderSize,
          });
        }
      };
      window.addEventListener('resize', onResizeHandler, { passive: true });

      onVisibilityHandler = () => {
        pageVisible = !document.hidden;
        if (pageVisible && inViewport) {
          startLoop();
        } else {
          stopLoop();
        }
      };
      document.addEventListener('visibilitychange', onVisibilityHandler);

      if (typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver(
          (entries) => {
            inViewport = entries[0]?.isIntersecting ?? true;
            if (inViewport && pageVisible) {
              startLoop();
            } else {
              stopLoop();
            }
          },
          { threshold: 0.01 }
        );
        observer.observe(host);
      }

      if (reducedMotion) {
        globe.update({
          phi,
          width: renderSize,
          height: renderSize,
        });
      } else {
        startLoop();
      }
    };

    void mountGlobe();

    return () => {
      cancelled = true;
      setWebglReady(false);
      if (yieldTimeoutId !== null) clearTimeout(yieldTimeoutId);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      observer?.disconnect();
      if (onResizeHandler) window.removeEventListener('resize', onResizeHandler);
      if (onVisibilityHandler) document.removeEventListener('visibilitychange', onVisibilityHandler);
      globeInstance?.destroy();
      canvasHost.replaceChildren();
    };
  }, [
    webglRequested,
    reducedMotion,
    theta,
    dark,
    scale,
    diffuse,
    mapSamples,
    mapBrightness,
    baseColor,
    markerColor,
    glowColor,
    markers,
  ]);

  const requestInteractiveGlobe = () => {
    if (!webglRequested) {
      setWebglRequested(true);
    }
  };

  const resetPointerState = () => {
    pointerStateRef.current.active = false;
    pointerStateRef.current.pointerId = null;
    pointerStateRef.current.gestureLock = 'none';
    if (hostRef.current) {
      hostRef.current.style.cursor = reducedMotion ? 'default' : 'grab';
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    requestInteractiveGlobe();
    if (reducedMotion) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    const isTouchLike = e.pointerType === 'touch' || e.pointerType === 'pen';

    pointerStateRef.current = {
      active: true,
      pointerId: e.pointerId,
      pointerType: e.pointerType,
      startX: e.clientX,
      startY: e.clientY,
      anchorX: e.clientX - interactionOffsetRef.current,
      gestureLock: isTouchLike ? 'none' : 'horizontal',
    };

    if (!isTouchLike && hostRef.current) {
      hostRef.current.style.cursor = 'grabbing';
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Ignore capture errors on unsupported targets
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const state = pointerStateRef.current;
    if (!state.active || state.pointerId !== e.pointerId) return;

    if (state.gestureLock === 'vertical') return;

    const dxFromStart = e.clientX - state.startX;
    const dyFromStart = e.clientY - state.startY;

    if (state.gestureLock === 'none') {
      const absDx = Math.abs(dxFromStart);
      const absDy = Math.abs(dyFromStart);
      const TOUCH_DRAG_DEADZONE = 10;

      if (absDx < TOUCH_DRAG_DEADZONE && absDy < TOUCH_DRAG_DEADZONE) {
        return;
      }

      if (absDy > absDx * 1.15) {
        state.gestureLock = 'vertical';
        return;
      }

      state.gestureLock = 'horizontal';
      state.anchorX = e.clientX - interactionOffsetRef.current;
    }

    const delta = e.clientX - state.anchorX;
    interactionOffsetRef.current = delta;
    const sensitivityDivisor = state.pointerType === 'mouse' ? 180 : 165;
    rTargetRef.current = delta / sensitivityDivisor;
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    if (pointerStateRef.current.pointerId === e.pointerId) {
      if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
          // Ignore release errors
        }
      }
      resetPointerState();
    }
  };

  return (
    <div
      ref={hostRef}
      tabIndex={0}
      role="img"
      aria-label={
        reducedMotion
          ? '3D Earth Globe centered on Colombo, Sri Lanka and global engineering hubs'
          : 'Interactive 3D Earth Globe — hover or drag to rotate'
      }
      onPointerEnter={requestInteractiveGlobe}
      onFocus={requestInteractiveGlobe}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      onLostPointerCapture={resetPointerState}
      className={cn(
        'relative flex items-center justify-center w-full max-w-[420px] sm:max-w-[480px] mx-auto aspect-square touch-pan-y select-none [-webkit-tap-highlight-color:transparent] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 rounded-full',
        reducedMotion ? 'cursor-default' : 'cursor-grab',
        className
      )}
    >
      {/* Instant Zero-Blocking Atmospheric 3D Globe Visual (Fades out smoothly when live WebGL canvas mounts) */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-[9%] rounded-full transition-opacity duration-500 flex items-center justify-center',
          webglReady ? 'opacity-0' : 'opacity-100'
        )}
      >
        {/* Outer atmospheric halo (zero gaussian blur filter) */}
        <div
          className={cn(
            'absolute -inset-6 rounded-full',
            isDarkTheme
              ? 'bg-[radial-gradient(circle,rgba(56,189,248,0.18)_35%,rgba(37,99,235,0.06)_58%,transparent_72%)]'
              : 'bg-[radial-gradient(circle,rgba(14,116,144,0.13)_35%,rgba(59,130,246,0.04)_58%,transparent_72%)]'
          )}
        />

        {/* Sphere Body with Graticule & Rotating Continent Dot-Matrix */}
        <svg
          viewBox="0 0 280 280"
          className="relative w-full h-full overflow-visible"
        >
          <defs>
            <clipPath id={sphereClipId}>
              <circle cx="140" cy="140" r="128" />
            </clipPath>
            <radialGradient id={`${sphereClipId}-ocean`} cx="36%" cy="32%" r="72%">
              {isDarkTheme ? (
                <>
                  <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.45" />
                  <stop offset="52%" stopColor="#0f254f" stopOpacity="0.88" />
                  <stop offset="100%" stopColor="#060c1a" stopOpacity="0.98" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
                  <stop offset="58%" stopColor="#e0f2fe" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.95" />
                </>
              )}
            </radialGradient>
            <radialGradient id={`${sphereClipId}-rim`} cx="50%" cy="50%" r="50%">
              <stop offset="76%" stopColor="transparent" />
              <stop
                offset="100%"
                stopColor={isDarkTheme ? 'rgba(56,189,248,0.34)' : 'rgba(14,116,144,0.2)'}
              />
            </radialGradient>
          </defs>

          {/* Base Sphere */}
          <circle
            cx="140"
            cy="140"
            r="128"
            fill={`url(#${sphereClipId}-ocean)`}
            stroke={isDarkTheme ? 'rgba(56,189,248,0.35)' : 'rgba(14,116,144,0.32)'}
            strokeWidth="1.25"
          />

          {/* Latitude / Longitude Wireframe Graticule */}
          <g
            clipPath={`url(#${sphereClipId})`}
            fill="none"
            stroke={isDarkTheme ? 'rgba(125,211,252,0.14)' : 'rgba(14,116,144,0.14)'}
            strokeWidth="0.9"
          >
            <ellipse cx="140" cy="140" rx="128" ry="38" />
            <ellipse cx="140" cy="140" rx="128" ry="82" />
            <ellipse cx="140" cy="140" rx="54" ry="128" />
            <ellipse cx="140" cy="140" rx="98" ry="128" />
            <line x1="12" y1="140" x2="268" y2="140" strokeDasharray="3 4" />
          </g>

          {/* Continuously Drifting Continents & Global Hubs */}
          <g clipPath={`url(#${sphereClipId})`}>
            <g className={reducedMotion ? undefined : 'globe-land-drift'}>
              {[0, 360].map((offsetX) => (
                <g key={offsetX} transform={`translate(${offsetX}, 22)`}>
                  {CONTINENT_DOTS.map(([cx, cy], idx) => (
                    <circle
                      key={`${offsetX}-${idx}`}
                      cx={cx}
                      cy={cy}
                      r="1.95"
                      fill={isDarkTheme ? 'rgba(147,197,253,0.72)' : 'rgba(14,116,144,0.52)'}
                    />
                  ))}
                </g>
              ))}
            </g>

            {/* Engineering Hub Network Arcs + Beacons */}
            <g>
              <path
                d="M186,122 Q152,82 118,66 M186,122 Q172,102 158,98 M186,122 Q200,118 214,132 M214,132 Q232,106 248,84"
                fill="none"
                stroke={isDarkTheme ? 'rgba(0,240,255,0.42)' : 'rgba(14,116,144,0.38)'}
                strokeWidth="1.15"
                strokeDasharray="3 3"
              />
              {HERO_PINS.map((pin) => (
                <g key={pin.label}>
                  {pin.primary && (
                    <circle
                      cx={pin.x}
                      cy={pin.y}
                      r="7"
                      fill={isDarkTheme ? 'rgba(0,240,255,0.24)' : 'rgba(14,116,144,0.22)'}
                    />
                  )}
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r={pin.primary ? 3.2 : 2.1}
                    fill={isDarkTheme ? '#00F0FF' : '#0E7490'}
                  />
                </g>
              ))}
            </g>
          </g>

          {/* Fresnel Inner Rim Lighting Overlay */}
          <circle cx="140" cy="140" r="128" fill={`url(#${sphereClipId}-rim)`} />
        </svg>
      </div>

      {/* Live WebGL Cobe Host */}
      <div
        ref={canvasHostRef}
        className={cn(
          'relative z-10 w-full h-full transition-opacity duration-500',
          webglReady ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  );
};

export default Earth;

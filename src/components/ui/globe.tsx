import React, { useEffect, useRef } from 'react';
import createGlobe from 'cobe';
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

export const Earth: React.FC<EarthProps> = ({
  className,
  theta = 0.25,
  dark = 1,
  scale = 1.1,
  diffuse = 1.2,
  mapSamples = 40000,
  mapBrightness = 6,
  baseColor = [0.4, 0.6509, 1],
  markerColor = [1, 0, 0],
  glowColor = [0.2745, 0.5765, 0.898],
  markers = DEFAULT_MARKERS,
}) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const canvas = document.createElement('canvas');
    canvas.setAttribute(
      'aria-label',
      reducedMotion ? 'Static 3D Earth Globe' : 'Interactive 3D Earth Globe'
    );
    canvas.className = cn(
      'w-full h-full select-none',
      reducedMotion ? 'cursor-default' : 'cursor-grab transition-opacity duration-500'
    );
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.contain = 'layout paint size';
    host.appendChild(canvas);

    let width = host.offsetWidth || 450;
    let phi = 4.2;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (reducedMotion) {
      pointerStateRef.current.active = false;
      pointerStateRef.current.gestureLock = 'none';
      interactionOffsetRef.current = 0;
      rTargetRef.current = 0;
      rCurrentRef.current = 0;
    }

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: width * dpr,
      height: width * dpr,
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

    let animationFrameId = 0;

    const onResize = () => {
      if (!host) return;
      width = host.offsetWidth || 450;
      if (reducedMotion) {
        globe.update({
          phi,
          width: width * dpr,
          height: width * dpr,
        });
      }
    };

    window.addEventListener('resize', onResize, { passive: true });

    if (reducedMotion) {
      // Render a single static frame without continuous animation
      globe.update({
        phi,
        width: width * dpr,
        height: width * dpr,
      });
    } else {
      const animate = () => {
        const isDraggingGlobe =
          pointerStateRef.current.active &&
          pointerStateRef.current.gestureLock === 'horizontal';

        if (!isDraggingGlobe) {
          phi += 0.004;
        }

        // Exponential damping keeps touch & mouse rotation fluid without jitter
        rCurrentRef.current += (rTargetRef.current - rCurrentRef.current) * 0.14;

        globe.update({
          phi: phi + rCurrentRef.current,
          width: width * dpr,
          height: width * dpr,
        });
        animationFrameId = requestAnimationFrame(animate);
      };

      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      globe.destroy();
      window.removeEventListener('resize', onResize);
      host.replaceChildren();
    };
  }, [
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

  const resetPointerState = () => {
    pointerStateRef.current.active = false;
    pointerStateRef.current.pointerId = null;
    pointerStateRef.current.gestureLock = 'none';
    if (hostRef.current) {
      hostRef.current.style.cursor = reducedMotion ? 'default' : 'grab';
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
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
        // User is scrolling vertically; release globe gesture immediately
        state.gestureLock = 'vertical';
        return;
      }

      // Intentional horizontal touch drag confirmed: anchor smoothly without initial jump
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
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      onLostPointerCapture={resetPointerState}
      className={cn(
        'relative flex items-center justify-center w-full max-w-[420px] sm:max-w-[480px] mx-auto aspect-square touch-pan-y select-none [-webkit-tap-highlight-color:transparent]',
        reducedMotion ? 'cursor-default' : 'cursor-grab',
        className
      )}
    />
  );
};

export default Earth;

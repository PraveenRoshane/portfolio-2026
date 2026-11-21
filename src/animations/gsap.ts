import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins safely once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({
    autoRefreshEvents: 'DOMContentLoaded,load',
    ignoreMobileResize: true,
  });
}

export { gsap, ScrollTrigger };

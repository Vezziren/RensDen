import { useEffect, useRef } from 'react';

const VantaBackground = () => {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    // Check if Vanta and Three are available
    if (typeof window === 'undefined' || !window.VANTA || !window.THREE) {
      console.warn('Vanta.js or Three.js not loaded');
      return;
    }

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    try {
      vantaEffect.current = window.VANTA.NET({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x00f0ff,
        backgroundColor: 0x0a0a0f,
        points: 12.00,
        maxDistance: 25.00,
        spacing: 18.00,
        showDots: true
      });
    } catch (error) {
      console.error('Failed to initialize Vanta:', error);
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  return (
    <div 
      ref={vantaRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}
      aria-hidden="true"
    />
  );
};

export default VantaBackground;

import { useEffect, useRef } from 'react';

export const useSmoothScroll = () => {
  const rafRef = useRef(null);
  const scrollRef = useRef({
    current: window.scrollY || 0,
    target: window.scrollY || 0,
    ease: 0.08
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Disable native smooth scroll
    document.documentElement.style.scrollBehavior = 'auto';

    const handleWheel = (e) => {
      e.preventDefault();
      scrollRef.current.target += e.deltaY;
      scrollRef.current.target = Math.max(0, Math.min(
        scrollRef.current.target,
        document.body.scrollHeight - window.innerHeight
      ));
    };

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollRef.current.target += window.innerHeight * 0.8;
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollRef.current.target -= window.innerHeight * 0.8;
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollRef.current.target = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollRef.current.target = document.body.scrollHeight;
      }
      scrollRef.current.target = Math.max(0, Math.min(
        scrollRef.current.target,
        document.body.scrollHeight - window.innerHeight
      ));
    };

    const animate = () => {
      const diff = scrollRef.current.target - scrollRef.current.current;
      scrollRef.current.current += diff * scrollRef.current.ease;

      // Stop when very close
      if (Math.abs(diff) < 0.5) {
        scrollRef.current.current = scrollRef.current.target;
      }

      window.scrollTo(0, scrollRef.current.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(rafRef.current);
      document.documentElement.style.scrollBehavior = 'smooth';
    };
  }, []);
};

export default useSmoothScroll;

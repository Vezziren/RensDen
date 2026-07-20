import { useEffect, useRef, useState } from 'react';
import { useTextScramble } from '../hooks/useTextScramble';

const Hero = () => {
  const heroRef = useRef(null);
  const subtitleRef = useRef(null);
  const badgeRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Text scramble for the main title
  const titleRef = useTextScramble("Vezziren's Den", isLoaded);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Entrance animations for subtitle and badge
  useEffect(() => {
    if (!isLoaded || !window.anime) return;

    window.anime({
      targets: badgeRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      delay: 200,
      easing: 'easeOutExpo'
    });

    window.anime({
      targets: subtitleRef.current,
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: 1800,
      easing: 'easeOutExpo'
    });
  }, [isLoaded]);

  // Magnetic parallax on mouse move
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      const title = titleRef.current;
      const subtitle = subtitleRef.current;

      if (title) {
        title.style.transform = `translate(${xPercent * 8}px, ${yPercent * 8}px)`;
      }
      if (subtitle) {
        subtitle.style.transform = `translate(${xPercent * 4}px, ${yPercent * 4}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [titleRef]);

  return (
    <section id="hero" className="hero-section" ref={heroRef}>
      <div className="hero-content">
        <div className="hero-badge mono" ref={badgeRef} style={{ opacity: 0 }}>
          <span className="badge-dot" />
          Available for work
        </div>

        <h1 className="hero-title" ref={titleRef}>
          Vezziren's Den
        </h1>

        <p className="hero-subtitle" ref={subtitleRef} style={{ opacity: 0 }}>
          Welcome, to Vezziren's Den.
        </p>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          z-index: 1;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 900px;
          padding: 0 2rem;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(201, 168, 76, 0.1);
          border: 1px solid rgba(201, 168, 76, 0.2);
          border-radius: 100px;
          font-size: 0.85rem;
          color: var(--accent-gold);
          margin-bottom: 2rem;
        }
        .badge-dot {
          width: 8px;
          height: 8px;
          background: #00ff88;
          border-radius: 50%;
          animation: pulse 2s ease infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        .hero-title {
          font-size: clamp(3.5rem, 10vw, 8rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.03em;
          white-space: nowrap;
          will-change: transform;
          font-family: var(--font-mono);
        }
        .scramble-char {
          color: var(--accent-gold);
          opacity: 0.7;
        }
        .hero-subtitle {
          font-size: clamp(1.2rem, 2.5vw, 1.6rem);
          color: var(--text-secondary);
          font-weight: 500;
          line-height: 1.6;
          will-change: transform;
        }
        @media (max-width: 768px) {
          .hero-title {
            white-space: normal;
            font-size: clamp(2.5rem, 12vw, 4rem);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;

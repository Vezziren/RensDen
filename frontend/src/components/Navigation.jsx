import { useEffect, useRef, useState } from 'react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef(null);
  const lastScrollY = useRef(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      navRef.current.style.transform = isVisible ? 'translateY(0)' : 'translateY(-100%)';
      navRef.current.style.opacity = isVisible ? '1' : '0';
    }
  }, [isVisible]);

  return (
    <>
      <nav
        ref={navRef}
        className={`main-nav ${isScrolled ? 'nav-scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
        style={{ transition: 'transform 0.4s ease, opacity 0.4s ease, background 0.4s ease, backdrop-filter 0.4s ease' }}
      >
        <div className="nav-container">
          <a href="#hero" className="nav-logo" onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}>
            <span className="logo-text">Vezziren'sDen</span>
          </a>
          <div className="nav-spacer" />
        </div>
      </nav>

      <style>{`
        .main-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1.5rem 0;
          transition: background 0.4s ease, backdrop-filter 0.4s ease;
        }
        .nav-scrolled {
          background: rgba(12, 12, 12, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
          padding: 1rem 0;
        }
        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-logo {
          font-family: var(--font-mono);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          transition: color 0.3s ease;
        }
        .nav-logo:hover {
          color: var(--accent-gold);
        }
        .logo-text {
          background: linear-gradient(135deg, var(--accent-gold), var(--accent-beige));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .nav-spacer {
          flex: 1;
        }
      `}</style>
    </>
  );
};

export default Navigation;

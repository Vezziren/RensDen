import { useEffect, useRef } from 'react';
import { useAnime } from '../hooks/useAnime';
import { useMagnetic } from '../hooks/useMagnetic';

const Footer = () => {
  const year = new Date().getFullYear();
  const footerRef = useRef(null);
  const { animate } = useAnime();

  useEffect(() => {
    const handleScroll = () => {
      const footer = footerRef.current;
      if (!footer) return;
      const rect = footer.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight;
      if (isVisible && !footer.classList.contains('animated')) {
        footer.classList.add('animated');
        if (animate) {
          animate({
            targets: footer.querySelectorAll('.footer-stagger'),
            translateY: [30, 0],
            opacity: [0, 1],
            duration: 900,
            delay: anime.stagger(80),
            easing: 'easeOutExpo'
          });
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [animate]);

  const socialLinks = [
    { name: 'GitHub', href: '#' },
    { name: 'LinkedIn', href: '#' },
    { name: 'Twitter', href: '#' },
    { name: 'Dribbble', href: '#' }
  ];

  return (
    <footer className="footer" ref={footerRef}>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand footer-stagger">
            <a href="#hero" className="footer-logo">
              <span>Vezziren'sDen</span>
            </a>
            <p className="footer-tagline">
              Crows are menaces.
            </p>
          </div>

          <div className="footer-links footer-stagger">
            <span className="footer-label mono">Navigation</span>
            <nav className="footer-nav">
              {['Home', 'About', 'Skills', 'Projects', 'Contact'].map(link => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="footer-link"
                  data-cursor-hover
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          <div className="footer-social footer-stagger">
            <span className="footer-label mono">Connect</span>
            <nav className="footer-nav">
              {socialLinks.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  className="footer-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-hover
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copyright mono">
            © {year} Vezziren. All rights reserved.
          </span>
          <span className="footer-credit mono">
            Built with React, Node.js & Three.js
          </span>
        </div>
      </div>

      <style>{`
        .footer {
          padding: 4rem 0 2rem;
          position: relative;
          z-index: 1;
          background: linear-gradient(180deg, transparent 0%, rgba(12,12,12,0.95) 20%);
          border-top: 1px solid var(--border-subtle);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 4rem;
          margin-bottom: 4rem;
        }
        .footer-logo {
          font-family: var(--font-mono);
          font-size: 1.5rem;
          font-weight: 700;
          display: inline-block;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, var(--accent-gold), var(--accent-beige));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.3s ease;
        }
        .footer-logo:hover {
          opacity: 0.8;
        }
        .footer-tagline {
          color: var(--text-secondary);
          max-width: 300px;
          font-size: 0.95rem;
        }
        .footer-label {
          display: block;
          color: var(--accent-gold);
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
        }
        .footer-nav {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .footer-link {
          color: var(--text-secondary);
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          position: relative;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--accent-gold);
          transition: width 0.3s ease;
        }
        .footer-link:hover {
          color: var(--text-primary);
          transform: translateX(6px);
        }
        .footer-link:hover::after {
          width: 100%;
        }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: 1rem;
        }
        .footer-copyright, .footer-credit {
          color: var(--text-muted);
          font-size: 0.8rem;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;

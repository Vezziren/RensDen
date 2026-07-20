import { useEffect, useRef, useState, useCallback } from 'react';
import { useScrollTrigger } from '../hooks/useScrollTrigger';
import { useAnime } from '../hooks/useAnime';

const Projects = () => {
  const { ref: sectionRef, isVisible } = useScrollTrigger({ threshold: 0.1 });
  const [activeImage, setActiveImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const gridRef = useRef(null);
  const imageContainerRef = useRef(null);
  const { timeline } = useAnime();

  const project = {
    id: 1,
    title: "EliteBasket",
    category: "E-Commerce Platform",
    description: "A full-stack e-commerce platform built with modern authentication via Clerk and a robust Supabase backend. Features include product browsing, category filtering, shopping cart management, user authentication with Google OAuth, promo code system, and a responsive premium UI inspired by boutique retail experiences.",
    images: [
      "/images/elitebasket-1.png",
      "/images/elitebasket-2.png",
      "/images/elitebasket-3.png",
      "/images/elitebasket-4.png",
      "/images/elitebasket-5.png",
      "/images/elitebasket-6.png"
    ],
    tech: ["React", "Clerk", "Supabase", "Node.js", "CSS3"],
    links: { github: "#" }
  };

  useEffect(() => {
    if (!isVisible || !timeline) return;
    const tl = timeline();

    tl.add({
      targets: gridRef.current.querySelectorAll('.project-animate'),
      translateY: [80, 0],
      opacity: [0, 1],
      rotateX: [15, 0],
      duration: 1200,
      delay: anime.stagger(200),
      easing: 'easeOutExpo'
    });

    return () => tl.pause();
  }, [isVisible, timeline]);

  // Smooth image transition with Anime.js
  const transitionToImage = useCallback((newIndex) => {
    if (isTransitioning || newIndex === activeImage) return;
    setIsTransitioning(true);

    const container = imageContainerRef.current;
    if (!container || !window.anime) {
      setActiveImage(newIndex);
      setIsTransitioning(false);
      return;
    }

    const currentImg = container.querySelector('.gallery-image-current');
    const nextImg = container.querySelector('.gallery-image-next');

    if (currentImg && nextImg) {
      // Set next image source
      nextImg.src = project.images[newIndex];
      nextImg.style.opacity = '0';
      nextImg.style.transform = 'scale(1.08)';

      window.anime({
        targets: currentImg,
        opacity: [1, 0],
        scale: [1, 0.95],
        filter: ['blur(0px)', 'blur(4px)'],
        duration: 500,
        easing: 'easeInCubic'
      });

      window.anime({
        targets: nextImg,
        opacity: [0, 1],
        scale: [1.08, 1],
        filter: ['blur(4px)', 'blur(0px)'],
        duration: 600,
        delay: 200,
        easing: 'easeOutCubic',
        complete: () => {
          setActiveImage(newIndex);
          setIsTransitioning(false);
        }
      });
    } else {
      setActiveImage(newIndex);
      setIsTransitioning(false);
    }
  }, [activeImage, isTransitioning, project.images]);

  const nextImage = () => {
    const next = (activeImage + 1) % project.images.length;
    transitionToImage(next);
  };

  const prevImage = () => {
    const prev = (activeImage - 1 + project.images.length) % project.images.length;
    transitionToImage(prev);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage]);

  return (
    <section id="projects" className="projects-section" ref={sectionRef}>
      <div className="container">
        <div className="projects-header">
          <span className="section-label mono">03 / Showcase</span>
          <h2 className="projects-title">
            Featured <span className="gold-text">Project</span>
          </h2>
          <p className="projects-subtitle">
            An interactive e-commerce experience built with precision and passion. [NOT PUBLISHED]
          </p>
        </div>

        <div className="projects-grid" ref={gridRef}>
          <div className="project-card project-animate">
            <div className="project-gallery">
              <div className="gallery-main" ref={imageContainerRef}>
                <img
                  src={project.images[activeImage]}
                  alt={`${project.title} screenshot ${activeImage + 1}`}
                  className="gallery-image gallery-image-current"
                />
                <img
                  src={project.images[(activeImage + 1) % project.images.length]}
                  alt=""
                  className="gallery-image gallery-image-next"
                  aria-hidden="true"
                />
                <button className="gallery-nav prev" onClick={prevImage} aria-label="Previous image" data-cursor-hover>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                <button className="gallery-nav next" onClick={nextImage} aria-label="Next image" data-cursor-hover>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
                <div className="gallery-counter mono">
                  {String(activeImage + 1).padStart(2, '0')} / {String(project.images.length).padStart(2, '0')}
                </div>
                <div className="gallery-progress">
                  {project.images.map((_, i) => (
                    <div
                      key={i}
                      className={`progress-dot ${i === activeImage ? 'active' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div className="gallery-thumbs">
                {project.images.map((img, i) => (
                  <button
                    key={i}
                    className={`thumb ${i === activeImage ? 'active' : ''}`}
                    onClick={() => transitionToImage(i)}
                    aria-label={`View screenshot ${i + 1}`}
                    data-cursor-hover
                  >
                    <img src={img} alt={`Thumbnail ${i + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="project-meta">
              <div className="project-info">
                <span className="project-category">{project.category}</span>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>
              </div>
              <div className="project-tech">
                {project.tech.map(t => (
                  <span key={t} className="tech-pill mono">{t}</span>
                ))}
              </div>
              <div className="project-actions">
                <a href={project.links.github} className="btn btn-outline" data-cursor-hover>
                  Source Code
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="project-border" />
            <div className="project-glow" />
          </div>
        </div>
      </div>

      <style>{`
        .projects-section {
          padding: 8rem 0;
          position: relative;
          z-index: 1;
          background: linear-gradient(180deg, transparent 0%, rgba(12,12,12,0.92) 15%, rgba(12,12,12,0.92) 85%, transparent 100%);
        }
        .projects-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .projects-title {
          margin: 1rem 0;
          color: var(--text-primary);
        }
        .projects-subtitle {
          color: var(--text-secondary);
        }
        .projects-grid {
          display: grid;
          grid-template-columns: 1fr;
          max-width: 1000px;
          margin: 0 auto;
          perspective: 1000px;
        }
        .project-card {
          position: relative;
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border-subtle);
          transition: border-color 0.3s ease;
        }
        .project-card:hover {
          border-color: var(--border-glow);
        }
        .project-gallery {
          display: flex;
          flex-direction: column;
        }
        .gallery-main {
          position: relative;
          aspect-ratio: 16/9;
          overflow: hidden;
          background: var(--bg-primary);
        }
        .gallery-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .gallery-image-current {
          z-index: 2;
        }
        .gallery-image-next {
          z-index: 1;
          opacity: 0;
        }
        .gallery-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(12, 12, 12, 0.6);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: none;
          backdrop-filter: blur(10px);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 5;
        }
        .gallery-nav:hover {
          background: var(--accent-gold);
          color: var(--bg-primary);
          border-color: var(--accent-gold);
          transform: translateY(-50%) scale(1.1);
        }
        .gallery-nav.prev { left: 1rem; }
        .gallery-nav.next { right: 1rem; }
        .gallery-counter {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          padding: 0.4rem 0.8rem;
          background: rgba(12, 12, 12, 0.6);
          border-radius: 100px;
          font-size: 0.75rem;
          color: var(--text-secondary);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border-subtle);
          z-index: 5;
        }
        .gallery-progress {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 5;
        }
        .progress-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(212, 196, 168, 0.2);
          transition: all 0.4s ease;
        }
        .progress-dot.active {
          background: var(--accent-gold);
          width: 24px;
          border-radius: 3px;
        }
        .gallery-thumbs {
          display: flex;
          gap: 0.5rem;
          padding: 1rem;
          background: var(--bg-tertiary);
          overflow-x: auto;
        }
        .thumb {
          flex-shrink: 0;
          width: 80px;
          height: 50px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 2px solid transparent;
          cursor: none;
          padding: 0;
          background: none;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          opacity: 0.6;
        }
        .thumb.active {
          border-color: var(--accent-gold);
          opacity: 1;
          transform: scale(1.05);
        }
        .thumb:hover {
          opacity: 1;
          transform: scale(1.08);
        }
        .thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .project-meta {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .project-category {
          display: block;
          font-size: 0.8rem;
          color: var(--accent-gold);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.25rem;
        }
        .project-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        .project-desc {
          color: var(--text-secondary);
          line-height: 1.7;
          font-size: 0.95rem;
        }
        .project-tech {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .tech-pill {
          padding: 0.35rem 0.9rem;
          background: var(--bg-primary);
          border: 1px solid var(--border-subtle);
          border-radius: 100px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          transition: all 0.3s ease;
        }
        .tech-pill:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }
        .project-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .project-border {
          position: absolute;
          inset: 0;
          border-radius: var(--radius-lg);
          border: 1px solid transparent;
          pointer-events: none;
          transition: border-color 0.3s ease;
        }
        .project-card:hover .project-border {
          border-color: var(--border-glow);
        }
        .project-glow {
          position: absolute;
          inset: -1px;
          border-radius: var(--radius-lg);
          opacity: 0;
          background: linear-gradient(135deg, rgba(201, 168, 76, 0.08), rgba(168, 168, 168, 0.05));
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: -1;
        }
        .project-card:hover .project-glow {
          opacity: 1;
        }
        @media (max-width: 768px) {
          .gallery-thumbs {
            gap: 0.35rem;
            padding: 0.75rem;
          }
          .thumb {
            width: 64px;
            height: 40px;
          }
          .project-meta {
            padding: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Projects;

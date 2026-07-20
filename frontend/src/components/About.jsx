import { useEffect, useRef } from 'react';
import { useScrollTrigger } from '../hooks/useScrollTrigger';
import { useAnime } from '../hooks/useAnime';
import { useMagnetic } from '../hooks/useMagnetic';

const About = () => {
  const { ref: sectionRef, isVisible } = useScrollTrigger({ threshold: 0.2 });
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const statsRef = useRef(null);
  const { timeline } = useAnime();
  const magneticRef = useMagnetic(0.15);

  useEffect(() => {
    if (!isVisible || !timeline) return;
    const tl = timeline();

    // Snappier reveal: 900ms instead of 1400ms
    tl.add({
      targets: imageWrapperRef.current,
      clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
      duration: 900,
      easing: 'easeOutExpo'
    })
    .add({
      targets: imageRef.current,
      scale: [1.15, 1],
      duration: 1100,
      easing: 'easeOutCubic'
    }, '-=700')
    .add({
      targets: contentRef.current.querySelectorAll('.about-line'),
      translateY: [40, 0],
      opacity: [0, 1],
      duration: 900,
      delay: anime.stagger(100),
      easing: 'easeOutExpo'
    }, '-=700')
    .add({
      targets: statsRef.current.querySelectorAll('.stat-item'),
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 700,
      delay: anime.stagger(120),
      easing: 'easeOutExpo'
    }, '-=500');

    return () => tl.pause();
  }, [isVisible, timeline]);

  // Parallax on image
  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;
    const handleScroll = () => {
      const rect = image.getBoundingClientRect();
      const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const translateY = (scrollPercent - 0.5) * 30;
      image.style.transform = `translateY(${translateY}px) scale(1.05)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { value: '5+', label: 'Years Experience' },
    { value: '19', label: 'Projects Completed' },
    { value: '15', label: 'Happy Clients' }
  ];

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className="container">
        <div className="about-grid">
          <div className="about-image-wrapper" ref={imageWrapperRef}>
            <div className="about-image" ref={magneticRef}>
              <img
                ref={imageRef}
                src="/images/about-meme.png"
                alt="Vezziren"
                loading="lazy"
              />
              <div className="image-frame" />
              <div className="image-corner top-left" />
              <div className="image-corner top-right" />
              <div className="image-corner bottom-left" />
              <div className="image-corner bottom-right" />
            </div>
          </div>

          <div className="about-content" ref={contentRef}>
            <span className="section-label mono about-line">01 / About</span>
            <h2 className="about-title about-line">
              CEO of absolutely no company.
            </h2>
            <p className="about-text about-line">
              I am a developer. I use such a broad term because that describes best of what I do.
              Software developing, Web developing, UI/UX, etc. My expertise spans across not only
              developing but taps into AI prompting and engineering as well.
            </p>
            <p className="about-text about-line">
              I can best define myself as both an architect and an engineer. The one who designs
              the house, is the same who builds the house.
            </p>
            <div className="about-tags about-line">
              {['React', 'Node.js', 'Three.js', 'WebGL', 'UI/UX'].map(tag => (
                <span key={tag} className="tag mono">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="about-stats" ref={statsRef}>
          {stats.map((stat, i) => (
            <div key={i} className="stat-item">
              <span className="stat-value gold-text">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .about-section {
          padding: 8rem 0;
          position: relative;
          z-index: 1;
          background: linear-gradient(180deg, transparent 0%, rgba(12,12,12,0.9) 20%, rgba(12,12,12,0.95) 80%, transparent 100%);
        }
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 6rem;
          align-items: center;
          margin-bottom: 6rem;
        }
        .about-image-wrapper {
          position: relative;
          clip-path: inset(0 100% 0 0);
        }
        .about-image {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          aspect-ratio: 1/1;
          max-width: 400px;
          margin: 0 auto;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          will-change: transform;
        }
        .about-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
          transform: scale(1.15);
        }
        .image-frame {
          position: absolute;
          inset: -2px;
          border: 2px solid var(--accent-gold);
          border-radius: var(--radius-lg);
          opacity: 0.3;
          pointer-events: none;
        }
        .image-corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid var(--accent-gold);
          opacity: 0.6;
          pointer-events: none;
          transition: all 0.4s ease;
        }
        .image-corner.top-left {
          top: -4px;
          left: -4px;
          border-right: none;
          border-bottom: none;
        }
        .image-corner.top-right {
          top: -4px;
          right: -4px;
          border-left: none;
          border-bottom: none;
        }
        .image-corner.bottom-left {
          bottom: -4px;
          left: -4px;
          border-right: none;
          border-top: none;
        }
        .image-corner.bottom-right {
          bottom: -4px;
          right: -4px;
          border-left: none;
          border-top: none;
        }
        .about-image:hover .image-corner {
          width: 30px;
          height: 30px;
          opacity: 1;
        }
        .about-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .section-label {
          color: var(--accent-gold);
          font-size: 0.9rem;
          letter-spacing: 0.1em;
        }
        .about-title {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          line-height: 1.2;
          color: var(--text-primary);
        }
        .about-text {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.8;
        }
        .about-tags {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-top: 1rem;
        }
        .tag {
          padding: 0.5rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          border-radius: 100px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          transition: all 0.3s ease;
          cursor: none;
        }
        .tag:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(201, 168, 76, 0.1);
        }
        .about-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          padding-top: 4rem;
          border-top: 1px solid var(--border-subtle);
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1.5rem;
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          transition: all 0.4s ease;
          text-align: center;
        }
        .stat-item:hover {
          border-color: var(--border-glow);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(201, 168, 76, 0.06);
        }
        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
        }
        .stat-label {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        @media (max-width: 968px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .about-image-wrapper {
            max-width: 300px;
            margin: 0 auto;
          }
          .about-stats {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 600px) {
          .about-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default About;

import { useEffect, useRef } from 'react';
import { useScrollTrigger } from '../hooks/useScrollTrigger';
import { useAnime } from '../hooks/useAnime';

const Skills = () => {
  const { ref: sectionRef, isVisible } = useScrollTrigger({ threshold: 0.15 });
  const gridRef = useRef(null);
  const { animate, timeline } = useAnime();

  const skills = [
    { name: 'React / Next.js', level: 86, isGold: true },
    { name: 'Node.js', level: 88, isGold: true },
    { name: 'TypeScript', level: 35, isGold: false },
    { name: 'Three.js / WebGL', level: 65, isGold: false },
    { name: 'UI/UX Design', level: 89, isGold: true },
    { name: 'Animation & Motion', level: 95, isGold: true },
    { name: 'Database Architecture', level: 56, isGold: false }
  ];

  useEffect(() => {
    if (!isVisible || !timeline) return;
    const tl = timeline();

    tl.add({
      targets: gridRef.current.querySelectorAll('.skill-card'),
      translateY: [60, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: anime.stagger(120),
      easing: 'easeOutExpo'
    })
    .add({
      targets: gridRef.current.querySelectorAll('.skill-bar-fill'),
      width: (el) => el.dataset.level + '%',
      duration: 1400,
      delay: anime.stagger(120),
      easing: 'easeOutCubic'
    }, '-=800')
    .add({
      targets: gridRef.current.querySelectorAll('.skill-percent'),
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 600,
      delay: anime.stagger(120),
      easing: 'easeOutExpo'
    }, '-=1200');

    return () => tl.pause();
  }, [isVisible, timeline]);

  const handleCardHover = (e, entering) => {
    if (!animate) return;
    const card = e.currentTarget;
    if (entering) {
      animate({
        targets: card,
        scale: 1.03,
        duration: 500,
        easing: 'easeOutElastic(1, .7)'
      });
      animate({
        targets: card.querySelector('.skill-glow'),
        opacity: [0.03, 0.15],
        duration: 400,
        easing: 'easeOutCubic'
      });
    } else {
      animate({
        targets: card,
        scale: 1,
        duration: 500,
        easing: 'easeOutElastic(1, .7)'
      });
      animate({
        targets: card.querySelector('.skill-glow'),
        opacity: [0.15, 0.03],
        duration: 400,
        easing: 'easeOutCubic'
      });
    }
  };

  return (
    <section id="skills" className="skills-section" ref={sectionRef}>
      <div className="container">
        <div className="skills-header">
          <span className="section-label mono">02 / Expertise</span>
          <h2 className="skills-title">
            Technical <span className="gold-text">Mastery</span>
          </h2>
          <p className="skills-subtitle">
            How far I've delved into each category:
          </p>
        </div>

        <div className="skills-grid" ref={gridRef}>
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              className="skill-card"
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
              data-cursor-hover
            >
              <div className="skill-header">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-percent mono" style={{ opacity: 0 }}>{skill.level}%</span>
              </div>
              <div className="skill-bar">
                <div
                  className={`skill-bar-fill ${skill.isGold ? 'gold' : 'silver'}`}
                  data-level={skill.level}
                  style={{ width: '0%' }}
                />
              </div>
              <div className={`skill-glow ${skill.isGold ? 'gold' : 'silver'}`} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .skills-section {
          padding: 8rem 0;
          position: relative;
          z-index: 1;
          background: linear-gradient(180deg, transparent 0%, rgba(12,12,12,0.92) 15%, rgba(12,12,12,0.92) 85%, transparent 100%);
        }
        .skills-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .skills-title {
          margin: 1rem 0;
          color: var(--text-primary);
        }
        .skills-subtitle {
          color: var(--text-secondary);
          max-width: 500px;
          margin: 0 auto;
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        .skill-card {
          position: relative;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          overflow: hidden;
          transition: border-color 0.3s ease;
          cursor: none;
        }
        .skill-card:hover {
          border-color: var(--border-glow);
        }
        .skill-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .skill-name {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-primary);
        }
        .skill-percent {
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        .skill-bar {
          height: 4px;
          background: var(--bg-primary);
          border-radius: 2px;
          overflow: hidden;
        }
        .skill-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: box-shadow 0.3s ease;
        }
        .skill-bar-fill.gold {
          background: linear-gradient(90deg, #c9a84c, #e8c868);
          box-shadow: 0 0 10px rgba(201, 168, 76, 0.4);
        }
        .skill-bar-fill.silver {
          background: linear-gradient(90deg, #a8a8a8, #d0d0d0);
          box-shadow: 0 0 10px rgba(168, 168, 168, 0.3);
        }
        .skill-glow {
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          opacity: 0.03;
          filter: blur(60px);
          pointer-events: none;
          transition: opacity 0.4s ease;
        }
        .skill-card:hover .skill-glow {
          opacity: 0.15;
        }
        .skill-glow.gold {
          background: radial-gradient(circle, #c9a84c 0%, transparent 70%);
        }
        .skill-glow.silver {
          background: radial-gradient(circle, #a8a8a8 0%, transparent 70%);
        }
        @media (max-width: 768px) {
          .skills-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default Skills;

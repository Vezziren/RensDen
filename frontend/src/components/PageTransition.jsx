import { useEffect, useRef } from 'react';

const PageTransition = ({ isLoading }) => {
  const containerRef = useRef(null);
  const barRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (!isLoading && containerRef.current && window.anime) {
      window.anime({
        targets: barRef.current,
        width: '100%',
        duration: 1500,
        easing: 'easeInOutCubic'
      });

      window.anime({
        targets: textRef.current,
        opacity: [1, 0],
        translateY: [0, -20],
        duration: 600,
        delay: 1000,
        easing: 'easeInCubic'
      });

      window.anime({
        targets: containerRef.current,
        opacity: [1, 0],
        duration: 800,
        delay: 1600,
        easing: 'easeInCubic',
        complete: () => {
          if (containerRef.current) containerRef.current.style.display = 'none';
        }
      });
    }
  }, [isLoading]);

  return (
    <div className="loading-screen" ref={containerRef}>
      <div className="loading-text" ref={textRef}>
        INITIALIZING VEZZIREN'S DEN
      </div>
      <div className="loading-bar">
        <div className="loading-bar-fill" ref={barRef} />
      </div>
    </div>
  );
};

export default PageTransition;

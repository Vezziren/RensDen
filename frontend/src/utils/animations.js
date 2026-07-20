/**
 * Reusable animation presets for Anime.js
 * All values respect the design system
 */

export const staggerReveal = (targets, stagger = 100, delay = 0) => ({
  targets,
  translateY: [40, 0],
  opacity: [0, 1],
  easing: 'easeOutExpo',
  duration: 1200,
  delay: anime.stagger(stagger, { start: delay })
});

export const fadeInUp = (targets, delay = 0) => ({
  targets,
  translateY: [30, 0],
  opacity: [0, 1],
  easing: 'easeOutCubic',
  duration: 800,
  delay
});

export const scaleIn = (targets, delay = 0) => ({
  targets,
  scale: [0.8, 1],
  opacity: [0, 1],
  easing: 'easeOutElastic(1, .6)',
  duration: 1000,
  delay
});

export const textReveal = (targets, stagger = 50) => ({
  targets,
  translateY: ['100%', '0%'],
  opacity: [0, 1],
  easing: 'easeOutExpo',
  duration: 1000,
  delay: anime.stagger(stagger)
});

export const clipReveal = (targets, direction = 'left') => {
  const clipPaths = {
    left: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
    right: ['inset(0 0 0 100%)', 'inset(0 0 0 0%)'],
    top: ['inset(100% 0 0 0)', 'inset(0% 0 0 0)'],
    bottom: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)']
  };

  return {
    targets,
    clipPath: clipPaths[direction] || clipPaths.left,
    easing: 'easeOutExpo',
    duration: 1200
  };
};

export const microBounce = (targets) => ({
  targets,
  scale: [1, 1.05, 1],
  easing: 'easeOutElastic(1, .5)',
  duration: 600
});

export const glowPulse = (targets) => ({
  targets,
  boxShadow: [
    '0 0 20px rgba(0, 240, 255, 0.2)',
    '0 0 40px rgba(0, 240, 255, 0.4)',
    '0 0 20px rgba(0, 240, 255, 0.2)'
  ],
  easing: 'easeInOutSine',
  duration: 2000,
  loop: true
});

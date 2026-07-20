import { useEffect, useRef, useCallback } from 'react';

/**
 * Safe wrapper for Anime.js that works with CDN or npm
 * Provides a declarative API for complex animations
 */

const getAnime = () => {
  if (typeof window !== 'undefined' && window.anime) {
    return window.anime;
  }
  try {
    return require('animejs');
  } catch (e) {
    console.warn('Anime.js not available');
    return null;
  }
};

export const useAnime = () => {
  const animeRef = useRef(null);

  useEffect(() => {
    animeRef.current = getAnime();
  }, []);

  const animate = useCallback((params) => {
    if (animeRef.current) {
      return animeRef.current(params);
    }
    return null;
  }, []);

  const timeline = useCallback((params = {}) => {
    if (animeRef.current) {
      return animeRef.current.timeline(params);
    }
    return null;
  }, []);

  return { animate, timeline, anime: animeRef.current };
};

export default useAnime;

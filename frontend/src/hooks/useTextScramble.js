import { useEffect, useRef, useCallback } from 'react';

const chars = '!<>-_\/[]{}—=+*^?#________';

export const useTextScramble = (text, trigger = true) => {
  const elRef = useRef(null);
  const frameRef = useRef(null);
  const queueRef = useRef([]);
  const frameCount = useRef(0);

  const setText = useCallback((newText) => {
    const el = elRef.current;
    if (!el) return;

    const length = Math.max(el.innerText.length, newText.length);
    const promise = new Promise((resolve) => {
      queueRef.current = [];
      for (let i = 0; i < length; i++) {
        const from = el.innerText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        queueRef.current.push({ from, to, start, end });
      }
      cancelAnimationFrame(frameRef.current);
      frameCount.current = 0;

      const update = () => {
        let output = '';
        let complete = 0;
        for (let i = 0; i < queueRef.current.length; i++) {
          let { from, to, start, end } = queueRef.current[i];
          let char = queueRef.current[i].char;

          if (frameCount.current >= end) {
            complete++;
            output += to;
          } else if (frameCount.current >= start) {
            if (!char || Math.random() < 0.28) {
              char = chars[Math.floor(Math.random() * chars.length)];
              queueRef.current[i].char = char;
            }
            output += `<span class="scramble-char">${char}</span>`;
          } else {
            output += from;
          }
        }
        el.innerHTML = output;
        if (complete === queueRef.current.length) {
          resolve();
        } else {
          frameCount.current++;
          frameRef.current = requestAnimationFrame(update);
        }
      };
      update();
    });
    return promise;
  }, []);

  useEffect(() => {
    if (trigger && elRef.current) {
      const el = elRef.current;
      el.innerText = text;
      setText(text);
    }
    return () => cancelAnimationFrame(frameRef.current);
  }, [text, trigger, setText]);

  return elRef;
};

export default useTextScramble;

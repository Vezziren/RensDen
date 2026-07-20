import { useEffect, useRef } from 'react';

const GlobalBackground = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);
  const particlesRef = useRef(null);
  const cameraRef = useRef(null);
  const isVisibleRef = useRef(true);
  const scrollRef = useRef({ target: 0, current: 0 });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.THREE) {
      console.warn('Three.js not loaded');
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const THREE = window.THREE;
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0c0c, 0.012);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance'
    });
    // Cap pixel ratio for performance
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0c0c0c, 1);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Reduced particle count for performance: 1000 instead of 3000
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const gold = new THREE.Color(0xc9a84c);
    const silver = new THREE.Color(0xa8a8a8);
    const beige = new THREE.Color(0xd4c4a8);
    const warmWhite = new THREE.Color(0xf0ece4);

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const radius = 2.2 + Math.random() * 0.8;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const rand = Math.random();
      let color;
      if (rand < 0.25) color = gold;
      else if (rand < 0.5) color = silver;
      else if (rand < 0.8) color = beige;
      else color = warmWhite;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Inner core glow - simplified
    const coreGeometry = new THREE.SphereGeometry(0.6, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0xc9a84c,
      transparent: true,
      opacity: 0.03,
      blending: THREE.AdditiveBlending
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // Ambient dust - reduced count
    const dustCount = 200;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 20;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      color: 0xd4c4a8,
      size: 0.02,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    // Scroll-driven camera orbit with throttling
    let scrollTimeout;
    const handleScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      scrollRef.current.target = scrollPercent * Math.PI * 2;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Visibility API - pause when tab hidden
    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Animation loop with delta time and frame skipping
    let lastTime = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    const animate = (time) => {
      frameRef.current = requestAnimationFrame(animate);

      // Skip frames if tab hidden
      if (!isVisibleRef.current) return;

      // Frame rate limiting
      const delta = time - lastTime;
      if (delta < frameInterval) return;
      lastTime = time - (delta % frameInterval);

      // Smooth camera orbit interpolation
      scrollRef.current.current += (scrollRef.current.target - scrollRef.current.current) * 0.04;

      const radius = 5;
      camera.position.x = Math.sin(scrollRef.current.current) * radius;
      camera.position.z = Math.cos(scrollRef.current.current) * radius;
      camera.position.y = Math.sin(scrollRef.current.current * 0.5) * 1.5;
      camera.lookAt(0, 0, 0);

      // Gentle particle rotation
      particles.rotation.y += 0.0002;
      particles.rotation.x += 0.00005;
      core.rotation.y += 0.0003;
      dust.rotation.y -= 0.0001;

      renderer.render(scene, camera);
    };
    animate(0);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(frameRef.current);
      geometry.dispose();
      material.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default GlobalBackground;

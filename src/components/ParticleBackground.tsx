'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { getPerformanceManager, type DeviceTier, type AnimationConfig } from '@/lib/hardwareDetection';
import * as THREE from 'three';

interface ParticleBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  colorScheme?: 'gold' | 'blue' | 'purple' | 'custom';
  customColors?: string[];
  enableInteraction?: boolean;
  className?: string;
}

export default function ParticleBackground({
  intensity = 'medium',
  colorScheme = 'gold',
  customColors,
  enableInteraction = true,
  className = '',
}: ParticleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  
  const { theme } = useTheme();
  const [deviceTier, setDeviceTier] = useState<DeviceTier>('medium');
  const [config, setConfig] = useState<AnimationConfig | null>(null);
  const [useCanvas2D, setUseCanvas2D] = useState(false);

  useEffect(() => {
    const perfManager = getPerformanceManager();
    const capabilities = perfManager.getCapabilities();
    const currentConfig = perfManager.getConfig();
    
    setDeviceTier(capabilities.tier);
    setConfig(currentConfig);
    
    // Fallback to Canvas 2D if WebGL not supported
    if (!capabilities.supportsWebGL || capabilities.reducedMotion) {
      setUseCanvas2D(true);
      return;
    }

    perfManager.start();

    // Listen for performance tier changes
    const handleTierChange = (e: CustomEvent) => {
      setDeviceTier(e.detail.tier);
      setConfig(e.detail.config);
    };

    window.addEventListener('performance-tier-changed', handleTierChange as EventListener);

    return () => {
      perfManager.stop();
      window.removeEventListener('performance-tier-changed', handleTierChange as EventListener);
    };
  }, []);

  // Canvas 2D Fallback
  useEffect(() => {
    if (!useCanvas2D || !containerRef.current || !config) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    containerRef.current.appendChild(canvas);

    const resizeCanvas = () => {
      canvas.width = containerRef.current?.clientWidth || window.innerWidth;
      canvas.height = containerRef.current?.clientHeight || window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Simple particle system for low-end devices
    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number }> = [];
    const particleCount = Math.min(config.particles, 20);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }

    const colors = getColorScheme();
    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = colors[0];
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      canvas.remove();
    };
  }, [useCanvas2D, config, theme, colorScheme]);

  // Three.js WebGL Rendering
  useEffect(() => {
    if (useCanvas2D || !containerRef.current || !config || config.particles === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 50;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: config.enableBlur 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Particle geometry
    const particleCount = config.particles;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorSchemeColors = getColorScheme();
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Positions (spread in 3D space)
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 50;

      // Velocities
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

      // Colors
      const color = new THREE.Color(colorSchemeColors[i % colorSchemeColors.length]);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // Sizes
      sizes[i] = Math.random() * 2 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Particle material
    const material = new THREE.PointsMaterial({
      size: config.particleComplexity === 'full' ? 2 : 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    // Create particle system
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      if (!enableInteraction) return;
      
      mouseRef.current.x = (event.clientX / width) * 2 - 1;
      mouseRef.current.y = -(event.clientY / height) * 2 + 1;
    };

    if (enableInteraction) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Animation loop
    let frameCount = 0;
    const frameSkip = config.targetFPS === 60 ? 1 : config.targetFPS === 30 ? 2 : 3;

    const animate = () => {
      frameCount++;
      
      // Skip frames based on target FPS
      if (frameCount % frameSkip !== 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const positions = particles.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Update positions
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];

        // Boundary checking
        if (Math.abs(positions[i3]) > 50) velocities[i3] *= -1;
        if (Math.abs(positions[i3 + 1]) > 50) velocities[i3 + 1] *= -1;
        if (Math.abs(positions[i3 + 2]) > 25) velocities[i3 + 2] *= -1;

        // Mouse interaction (subtle attraction)
        if (enableInteraction && config.particleComplexity === 'full') {
          const dx = mouseRef.current.x * 30 - positions[i3];
          const dy = mouseRef.current.y * 30 - positions[i3 + 1];
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 20) {
            positions[i3] += dx * 0.001;
            positions[i3 + 1] += dy * 0.001;
          }
        }
      }

      particles.geometry.attributes.position.needsUpdate = true;

      // Rotate particle system
      particles.rotation.y += 0.0002;
      particles.rotation.x += 0.0001;

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [useCanvas2D, config, theme, colorScheme, enableInteraction]);

  const getColorScheme = (): string[] => {
    if (customColors && customColors.length > 0) {
      return customColors;
    }

    const isDark = theme === 'dark';

    const schemes = {
      gold: isDark 
        ? ['#FFD700', '#FFA500', '#DAA520', '#B8860B']
        : ['#D4AF37', '#FFD700', '#FFA500', '#F4C430'],
      blue: isDark
        ? ['#4169E1', '#1E90FF', '#00BFFF', '#87CEEB']
        : ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD'],
      purple: isDark
        ? ['#9370DB', '#8A2BE2', '#9932CC', '#BA55D3']
        : ['#6B21A8', '#9333EA', '#A855F7', '#C084FC'],
      custom: ['#D4AF37', '#FFD700'],
    };

    return schemes[colorScheme] || schemes.gold;
  };

  if (!config || config.particles === 0) {
    return null; // No particles for low-tier devices
  }

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity: 0.4 }}
    />
  );
}

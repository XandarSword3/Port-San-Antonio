/**
 * Hardware Detection & Performance Monitoring System
 * Detects device capabilities and provides adaptive animation configurations
 */

export type DeviceTier = 'high' | 'medium' | 'low';

export interface DeviceCapabilities {
  tier: DeviceTier;
  gpu: string;
  gpuVendor: string;
  cores: number;
  memory: number; // GB
  reducedMotion: boolean;
  supportsWebGL: boolean;
  isMobile: boolean;
  screen: {
    width: number;
    height: number;
    pixelRatio: number;
  };
  connection: {
    effectiveType: string;
    saveData: boolean;
  };
}

export interface AnimationConfig {
  particles: number;
  particleComplexity: 'full' | 'simple' | 'none';
  transitions: 'smooth' | 'standard' | 'minimal';
  targetFPS: number;
  enableBlur: boolean;
  enableShadows: boolean;
  enableGradients: boolean;
  enableTransforms3D: boolean;
  enableBackdropFilter: boolean;
  animationDuration: number; // multiplier
  staggerDelay: number; // multiplier
}

/**
 * Detect WebGL capabilities and GPU information
 */
function detectGPU(): { vendor: string; renderer: string; supportsWebGL: boolean } {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return { vendor: 'Unknown', renderer: 'Unknown', supportsWebGL: false };
    }

    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    
    if (debugInfo) {
      const vendor = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      return { vendor, renderer, supportsWebGL: true };
    }

    return { vendor: 'Unknown', renderer: 'Unknown', supportsWebGL: true };
  } catch (error) {
    return { vendor: 'Unknown', renderer: 'Unknown', supportsWebGL: false };
  }
}

/**
 * Detect device capabilities
 */
export function detectHardware(): DeviceCapabilities {
  const gpu = detectGPU();
  
  // CPU cores
  const cores = navigator.hardwareConcurrency || 2;
  
  // Memory in GB (with fallback)
  const memory = (navigator as any).deviceMemory || estimateMemory();
  
  // Reduced motion preference
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Screen info
  const screen = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1,
  };
  
  // Connection info
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const connectionInfo = {
    effectiveType: connection?.effectiveType || '4g',
    saveData: connection?.saveData || false,
  };
  
  // Calculate device tier
  const tier = calculateDeviceTier({
    cores,
    memory,
    gpu: gpu.renderer,
    isMobile,
    reducedMotion,
    supportsWebGL: gpu.supportsWebGL,
    connectionType: connectionInfo.effectiveType,
    pixelRatio: screen.pixelRatio,
  });

  return {
    tier,
    gpu: gpu.renderer,
    gpuVendor: gpu.vendor,
    cores,
    memory,
    reducedMotion,
    supportsWebGL: gpu.supportsWebGL,
    isMobile,
    screen,
    connection: connectionInfo,
  };
}

/**
 * Estimate memory for devices that don't support navigator.deviceMemory
 */
function estimateMemory(): number {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const cores = navigator.hardwareConcurrency || 2;
  
  if (isMobile) {
    return cores >= 8 ? 6 : cores >= 4 ? 4 : 2;
  }
  
  return cores >= 8 ? 16 : cores >= 4 ? 8 : 4;
}

/**
 * Calculate device tier based on multiple factors
 */
function calculateDeviceTier(params: {
  cores: number;
  memory: number;
  gpu: string;
  isMobile: boolean;
  reducedMotion: boolean;
  supportsWebGL: boolean;
  connectionType: string;
  pixelRatio: number;
}): DeviceTier {
  const { cores, memory, gpu, isMobile, reducedMotion, supportsWebGL, connectionType, pixelRatio } = params;
  
  // Force low tier if reduced motion is preferred
  if (reducedMotion) {
    return 'low';
  }
  
  // Force low tier if no WebGL support
  if (!supportsWebGL) {
    return 'low';
  }
  
  // Force low tier on slow connections with data saver
  if (connectionType === 'slow-2g' || connectionType === '2g') {
    return 'low';
  }
  
  let score = 0;
  
  // CPU score (0-40 points)
  if (cores >= 8) score += 40;
  else if (cores >= 6) score += 30;
  else if (cores >= 4) score += 20;
  else score += 10;
  
  // Memory score (0-30 points)
  if (memory >= 16) score += 30;
  else if (memory >= 8) score += 25;
  else if (memory >= 4) score += 15;
  else score += 5;
  
  // GPU score (0-20 points)
  const gpuLower = gpu.toLowerCase();
  if (gpuLower.includes('nvidia') || gpuLower.includes('geforce') || 
      gpuLower.includes('radeon') || gpuLower.includes('amd')) {
    score += 20;
  } else if (gpuLower.includes('intel') && gpuLower.includes('iris')) {
    score += 15;
  } else if (gpuLower.includes('apple') && gpuLower.includes('gpu')) {
    score += 18; // Apple Silicon is powerful
  } else if (gpuLower.includes('mali') || gpuLower.includes('adreno')) {
    score += isMobile ? 12 : 8; // Mobile GPUs
  } else {
    score += 10;
  }
  
  // Mobile penalty (0-10 points)
  if (isMobile) {
    score -= 10;
  }
  
  // High resolution bonus
  if (pixelRatio >= 2) {
    score -= 5; // More pixels to render
  }
  
  // Connection bonus
  if (connectionType === '4g' || connectionType === '5g') {
    score += 10;
  } else if (connectionType === '3g') {
    score += 5;
  }
  
  // Tier calculation
  if (score >= 70) return 'high';
  if (score >= 45) return 'medium';
  return 'low';
}

/**
 * Get animation configuration for device tier
 */
export function getAnimationConfig(tier: DeviceTier): AnimationConfig {
  const configs: Record<DeviceTier, AnimationConfig> = {
    high: {
      particles: 150,
      particleComplexity: 'full',
      transitions: 'smooth',
      targetFPS: 60,
      enableBlur: true,
      enableShadows: true,
      enableGradients: true,
      enableTransforms3D: true,
      enableBackdropFilter: true,
      animationDuration: 1.0,
      staggerDelay: 1.0,
    },
    medium: {
      particles: 50,
      particleComplexity: 'simple',
      transitions: 'standard',
      targetFPS: 30,
      enableBlur: false,
      enableShadows: false,
      enableGradients: true,
      enableTransforms3D: true,
      enableBackdropFilter: false,
      animationDuration: 0.75,
      staggerDelay: 0.5,
    },
    low: {
      particles: 0,
      particleComplexity: 'none',
      transitions: 'minimal',
      targetFPS: 20,
      enableBlur: false,
      enableShadows: false,
      enableGradients: false,
      enableTransforms3D: false,
      enableBackdropFilter: false,
      animationDuration: 0.5,
      staggerDelay: 0.25,
    },
  };

  return configs[tier];
}

/**
 * FPS Monitoring Class
 */
export class FPSMonitor {
  private frames: number[] = [];
  private lastFrameTime: number = performance.now();
  private frameCount: number = 0;
  private currentFPS: number = 60;
  private targetFPS: number = 60;
  private onFPSChange?: (fps: number, shouldThrottle: boolean) => void;
  private isRunning: boolean = false;
  private animationFrameId?: number;

  constructor(targetFPS: number = 60, onFPSChange?: (fps: number, shouldThrottle: boolean) => void) {
    this.targetFPS = targetFPS;
    this.onFPSChange = onFPSChange;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.tick();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private tick = () => {
    if (!this.isRunning) return;

    const now = performance.now();
    const delta = now - this.lastFrameTime;
    this.lastFrameTime = now;

    // Calculate instantaneous FPS
    const fps = 1000 / delta;
    this.frames.push(fps);

    // Keep last 60 frames for average
    if (this.frames.length > 60) {
      this.frames.shift();
    }

    // Calculate average FPS every 30 frames
    this.frameCount++;
    if (this.frameCount >= 30) {
      this.frameCount = 0;
      const avgFPS = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
      this.currentFPS = Math.round(avgFPS);

      // Determine if throttling is needed
      const shouldThrottle = this.currentFPS < this.targetFPS * 0.8;

      if (this.onFPSChange) {
        this.onFPSChange(this.currentFPS, shouldThrottle);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  getCurrentFPS(): number {
    return this.currentFPS;
  }

  setTargetFPS(fps: number) {
    this.targetFPS = fps;
  }
}

/**
 * Performance Manager - Auto-adjusts animation complexity based on FPS
 */
export class PerformanceManager {
  private fpsMonitor: FPSMonitor;
  private currentTier: DeviceTier;
  private capabilities: DeviceCapabilities;
  private config: AnimationConfig;
  private throttleCount: number = 0;
  private readonly THROTTLE_THRESHOLD = 3; // Throttle after 3 consecutive low FPS readings

  constructor() {
    this.capabilities = detectHardware();
    this.currentTier = this.capabilities.tier;
    this.config = getAnimationConfig(this.currentTier);
    
    this.fpsMonitor = new FPSMonitor(this.config.targetFPS, this.handleFPSChange);
  }

  start() {
    this.fpsMonitor.start();
  }

  stop() {
    this.fpsMonitor.stop();
  }

  private handleFPSChange = (fps: number, shouldThrottle: boolean) => {
    if (shouldThrottle) {
      this.throttleCount++;
      
      if (this.throttleCount >= this.THROTTLE_THRESHOLD) {
        this.downgradePerformance();
        this.throttleCount = 0;
      }
    } else {
      this.throttleCount = Math.max(0, this.throttleCount - 1);
    }
  };

  private downgradePerformance() {
    if (this.currentTier === 'high') {
      this.currentTier = 'medium';
      this.config = getAnimationConfig('medium');
      console.warn('🔽 Performance downgraded to MEDIUM tier due to low FPS');
    } else if (this.currentTier === 'medium') {
      this.currentTier = 'low';
      this.config = getAnimationConfig('low');
      console.warn('🔽 Performance downgraded to LOW tier due to low FPS');
    }
    
    // Update target FPS for monitor
    this.fpsMonitor.setTargetFPS(this.config.targetFPS);
    
    // Dispatch custom event for components to react
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('performance-tier-changed', { 
        detail: { tier: this.currentTier, config: this.config } 
      }));
    }
  }

  getCapabilities(): DeviceCapabilities {
    return this.capabilities;
  }

  getCurrentTier(): DeviceTier {
    return this.currentTier;
  }

  getConfig(): AnimationConfig {
    return this.config;
  }

  getCurrentFPS(): number {
    return this.fpsMonitor.getCurrentFPS();
  }
}

// Singleton instance
let performanceManager: PerformanceManager | null = null;

export function getPerformanceManager(): PerformanceManager {
  if (!performanceManager) {
    performanceManager = new PerformanceManager();
  }
  return performanceManager;
}

// Utility: Get adaptive transition duration
export function getAdaptiveDuration(baseDuration: number, tier?: DeviceTier): number {
  const currentTier = tier || getPerformanceManager().getCurrentTier();
  const config = getAnimationConfig(currentTier);
  return baseDuration * config.animationDuration;
}

// Utility: Get adaptive stagger delay
export function getAdaptiveStagger(baseDelay: number, tier?: DeviceTier): number {
  const currentTier = tier || getPerformanceManager().getCurrentTier();
  const config = getAnimationConfig(currentTier);
  return baseDelay * config.staggerDelay;
}

// Utility: Check if feature is enabled for current tier
export function isFeatureEnabled(feature: keyof AnimationConfig, tier?: DeviceTier): boolean {
  const currentTier = tier || getPerformanceManager().getCurrentTier();
  const config = getAnimationConfig(currentTier);
  return Boolean(config[feature]);
}

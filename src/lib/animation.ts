// Centralized animation constants for consistent easing and duration
export const EASING = {
  cinematic: [0.22, 0.8, 0.2, 1], // cubic-bezier(.22,.8,.2,1)
  soft: [0.32, 0.8, 0.24, 1],
  pop: [0.2, 1, 0.22, 1],
  linear: [0, 0, 1, 1],
  easeOut: "easeOut", // Changed to string for framer-motion compatibility
  easeIn: "easeIn", // Changed to string for framer-motion compatibility
  easeInOut: "easeInOut" // Changed to string for framer-motion compatibility
}

export const DURATION = {
  slow: 0.72,
  medium: 0.42,
  fast: 0.24,
  verySlow: 6.0
}

// Predefined transitions for common animations
export const TRANSITIONS = {
  hero: {
    duration: DURATION.verySlow,
    ease: EASING.cinematic
  },
  text: {
    duration: DURATION.slow,
    ease: EASING.cinematic
  },
  cta: {
    duration: DURATION.medium,
    ease: EASING.pop
  },
  card: {
    duration: DURATION.medium,
    ease: EASING.soft
  }
}

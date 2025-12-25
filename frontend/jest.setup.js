import '@testing-library/jest-dom'

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock requestAnimationFrame
global.requestAnimationFrame = (cb) => setTimeout(cb, 16);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// Mock WebGL context
Object.defineProperty(window, 'WebGLRenderingContext', {
  value: function() {},
  writable: true
});

// Mock performance.now
global.performance = global.performance || {};
global.performance.now = global.performance.now || (() => Date.now());
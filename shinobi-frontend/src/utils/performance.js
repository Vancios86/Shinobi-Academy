// Performance optimization utilities

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to wait
 * @returns {Function} - The debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit how often a function can be called
 * @param {Function} func - The function to throttle
 * @param {number} limit - The number of milliseconds to limit
 * @returns {Function} - The throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Intersection Observer for lazy loading
 * @param {Element} element - The element to observe
 * @param {Function} callback - The callback to execute when element is visible
 * @param {Object} options - Observer options
 * @returns {IntersectionObserver} - The observer instance
 */
export const createIntersectionObserver = (element, callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, defaultOptions);

  if (element) {
    observer.observe(element);
  }

  return observer;
};

/**
 * Preload image for better performance
 * @param {string} src - The image source URL
 * @returns {Promise} - Promise that resolves when image is loaded
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Batch DOM updates for better performance
 * @param {Function} updateFunction - The function containing DOM updates
 */
export const batchDOMUpdates = (updateFunction) => {
  // Use requestAnimationFrame for smooth updates
  requestAnimationFrame(() => {
    updateFunction();
  });
};

/**
 * Check if element is in viewport
 * @param {Element} element - The element to check
 * @returns {boolean} - Whether the element is in viewport
 */
export const isInViewport = (element) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Performance measurement utility
 * @param {string} label - The label for the measurement
 * @param {Function} fn - The function to measure
 * @returns {any} - The result of the function
 */
export const measurePerformance = (label, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`${label}: ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
};

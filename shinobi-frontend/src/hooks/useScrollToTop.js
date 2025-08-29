import { useEffect } from 'react';

/**
 * Hook to scroll to top on every component mount
 */
export const useScrollToTopOnMount = () => {
  useEffect(() => {
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []); // Empty dependency array - only runs on mount
};

/**
 * Hook to scroll to top when a single dependency changes
 * @param {any} dependency - The dependency to watch for changes
 */
export const useScrollToTopOnChange = (dependency) => {
  useEffect(() => {
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [dependency]); // Single dependency array
};

/**
 * Hook to scroll to top when multiple dependencies change
 * @param {any} dependency1 - First dependency to watch
 * @param {any} dependency2 - Second dependency to watch
 */
export const useScrollToTopOnMultipleChanges = (dependency1, dependency2) => {
  useEffect(() => {
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [dependency1, dependency2]); // Multiple dependencies
};

/**
 * Hook to scroll to top with custom enable/disable logic
 * @param {boolean} enabled - Whether scroll to top is enabled
 */
export const useScrollToTopConditional = (enabled) => {
  useEffect(() => {
    if (enabled) {
      // Smooth scroll to top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }, [enabled]);
};

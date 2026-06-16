// Global navigation handler
let navigateFn: (path: string) => void = (path) => {
  // Fallback to location-based routing if React Router has not registered yet
  window.location.hash = path;
};

/**
 * Registers the React Router navigate function globally.
 */
export function setGlobalNavigator(nav: (path: string) => void) {
  navigateFn = nav;
}

/**
 * Static navigate function usable outside of React components (e.g., in controllers/APIs).
 */
export function navigate(path: string) {
  navigateFn(path);
}

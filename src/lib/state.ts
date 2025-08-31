import type { Mode } from './types';

/**
 * Announces a message to screen readers.
 * This is a side-effect, but closely tied to state changes.
 * @param message The message to announce.
 */
function announce(message: string) {
  const ariaLiveRegion = document.getElementById('aria-live-region');
  if (ariaLiveRegion) {
    ariaLiveRegion.textContent = ''; // Clear previous message to ensure it's read out again
    ariaLiveRegion.textContent = message;
  }
}

/**
 * Sets the application mode. Updates the DOM and localStorage.
 * @param newMode The mode to switch to.
 */
export function setMode(newMode: Mode) {
  document.documentElement.setAttribute('data-mode', newMode);
  try {
    localStorage.setItem('mode', newMode);
  } catch (e) {
    console.warn('localStorage is not available. Mode preference will not be saved.');
  }
  const modeName = newMode === 'no-one' ? 'no one' : newMode;
  announce(`Mode set to ${modeName}.`);
}

/**
 * Toggles the 'calm' state for reduced motion. Updates the DOM and localStorage.
 * @param calmState The desired calm state.
 */
export function setCalm(calmState: boolean) {
  document.documentElement.classList.toggle('calm', calmState);
  const calmToggle = document.getElementById('calm-toggle');
  if (calmToggle) {
    calmToggle.classList.toggle('active', calmState);
  }
  try {
    localStorage.setItem('calm', String(calmState));
  } catch (e) {
    console.warn('localStorage is not available. Calm preference will not be saved.');
  }
  announce(calmState ? 'Calm mode enabled.' : 'Calm mode disabled.');
}

/**
 * Initializes the mode from localStorage or defaults.
 */
export function initMode(): Mode {
    try {
        const savedMode = localStorage.getItem('mode') as Mode | null;
        if (savedMode && ['nothing', 'object', 'no-one'].includes(savedMode)) {
            setMode(savedMode);
            return savedMode;
        }
    } catch (e) {
        console.warn('localStorage is not available.');
    }
    setMode('object'); // Default
    return 'object';
}

/**
 * Initializes the calm state from localStorage or defaults.
 */
export function initCalm(): boolean {
    try {
        const savedCalm = localStorage.getItem('calm');
        const isCalm = savedCalm === 'true';
        setCalm(isCalm);
        return isCalm;
    } catch (e) {
        console.warn('localStorage is not available.');
    }
    setCalm(false); // Default
    return false;
}

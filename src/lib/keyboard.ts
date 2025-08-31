import type { Mode } from './types';

type KeyboardActions = {
  setMode: (mode: Mode) => void;
  setCalm: (calm: boolean) => void;
  toggleHelpSheet: (visible?: boolean) => void;
  getCalmState: () => boolean;
};

// This factory function allows us to inject dependencies for testing
export function createKeyboardHandler(actions: KeyboardActions) {
  let keySequence = '';
  let sequenceTimer: number;

  return function handleKeyPress(e: KeyboardEvent) {
    // Ignore keypresses in input fields or with modifier keys
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.metaKey || e.ctrlKey || e.altKey) {
      return;
    }

    const key = e.key.toLowerCase();

    // Handle single-purpose keys first
    if (key === 'escape') {
      actions.toggleHelpSheet(false); // Always hide on escape
      return;
    }

    // Handle navigation sequences ('g' followed by another key)
    if (keySequence === 'g') {
      clearTimeout(sequenceTimer);
      let path: string | null = null;
      if (key === 'w') path = '/work.html';
      else if (key === 'l') path = '/log.html';
      else if (key === 'a') path = '/about.html';

      if (path) {
        window.location.href = path;
      }
      keySequence = ''; // Reset sequence
      return;
    }

    // Handle other single-key shortcuts
    switch (key) {
      case 'n': actions.setMode('nothing'); break;
      case 'o': actions.setMode('object'); break;
      case '1': actions.setMode('no-one'); break;
      case 'c': actions.setCalm(!actions.getCalmState()); break;
      case '?': actions.toggleHelpSheet(); break;
      case '/': {
        const filterInput = document.getElementById('work-filter') as HTMLInputElement;
        if (filterInput) {
          e.preventDefault();
          filterInput.focus();
        }
        break;
      }
      case 'g':
        keySequence = 'g';
        // Set a timer to reset the sequence if no valid key is pressed
        sequenceTimer = window.setTimeout(() => { keySequence = '' }, 1500);
        break;
    }
  };
}

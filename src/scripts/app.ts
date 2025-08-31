import githubDataJson from '../data/github.json';
import type { GithubData, Mode } from '../lib/types';
import { setMode, setCalm, initMode, initCalm } from '../lib/state';
import { createKeyboardHandler } from '../lib/keyboard';
import { toggleHelpSheet } from '../lib/ui';
import { renderWorkGrid, renderLogList, initWorkFilter } from '../lib/rendering';

// --- STATE ---
let isCalm = false;
const githubData: GithubData = githubDataJson;

// --- DOM ELEMENTS ---
const modeToggles = document.querySelectorAll<HTMLButtonElement>('[data-mode-target]');
const calmToggle = document.getElementById('calm-toggle');
const helpSheet = document.getElementById('help-sheet');

// --- INITIALIZATION ---

function init() {
  // Initialize state
  isCalm = initCalm();
  initMode();

  // Define actions that can be triggered by various events
  const actions = {
    setMode,
    setCalm: (newCalmState: boolean) => {
        isCalm = newCalmState;
        setCalm(isCalm);
    },
    toggleHelpSheet,
    getCalmState: () => isCalm,
  };

  // Set up event listeners
  const handleKeyPress = createKeyboardHandler(actions);
  window.addEventListener('keydown', handleKeyPress);

  modeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const targetMode = toggle.dataset.modeTarget as Mode;
      if (targetMode) actions.setMode(targetMode);
    });
  });

  calmToggle?.addEventListener('click', () => actions.setCalm(!isCalm));

  helpSheet?.addEventListener('click', (e) => {
      if (e.target === helpSheet) actions.toggleHelpSheet(false);
  });

  // Render dynamic content from fetched data
  renderWorkGrid(githubData.work);
  renderLogList(githubData.log);

  // Initialize page-specific interactive elements
  initWorkFilter();
}

// --- RUN ---
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

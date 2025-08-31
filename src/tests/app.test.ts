import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the github.json data
vi.mock('../data/github.json', () => ({
  default: {
    work: [],
    log: [],
    facts: {}
  }
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const indexHtml = `
<!doctype html>
<html lang="en" data-mode="object" data-calm="false">
<head>
  <title>Test</title>
</head>
<body>
  <header class="header">
    <div class="brand"><span class="name">Ali</span><span class="dot"></span></div>
    <div class="chips">
      <button class="chip" data-set-mode="nothing"></button>
      <button class="chip" data-set-mode="object"></button>
      <button class="chip" data-set-mode="noone"></button>
      <button class="chip" id="calm"></button>
    </div>
  </header>
  <main class="main" id="main">
    <section class="portals">
      <div class="grid" id="portals"></div>
    </section>
  </main>
  <footer class="footer"></footer>
  <div id="help"></div>
  <div id="announce"></div>
  <script type="module" src="/scripts/app.ts"></script>
</body>
</html>
`;

describe('app.ts integration tests', () => {

  beforeEach(async () => {
    document.body.innerHTML = indexHtml;
    localStorage.clear();
    vi.resetModules();
    await import('../scripts/app');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default "object" mode', () => {
    expect(document.documentElement.getAttribute('data-mode')).toBe('object');
  });

  it('should switch mode on keypress "n"', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' }));
    expect(document.documentElement.getAttribute('data-mode')).toBe('nothing');
    expect(localStorage.getItem('mode')).toBe('nothing');
  });

  it('should switch mode on button click', () => {
    const nothingButton = document.querySelector('[data-set-mode="nothing"]') as HTMLButtonElement;
    nothingButton.click();
    expect(document.documentElement.getAttribute('data-mode')).toBe('nothing');
    expect(localStorage.getItem('mode')).toBe('nothing');
  });

  it('should toggle calm mode on keypress "c"', () => {
    const html = document.documentElement;
    // Initial state is false
    expect(html.getAttribute('data-calm')).toBe('false');

    // Turn on
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }));
    expect(html.getAttribute('data-calm')).toBe('true');
    expect(localStorage.getItem('calm')).toBe('true');

    // Turn off
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }));
    expect(html.getAttribute('data-calm')).toBe('false');
    expect(localStorage.getItem('calm')).toBe('false');
  });

  it('should toggle help sheet with "?" and "Escape"', () => {
    const helpPanel = document.getElementById('help');

    // Show help
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }));
    expect(helpPanel?.classList.contains('active')).toBe(true);

    // Hide help with Escape
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(helpPanel?.classList.contains('active')).toBe(false);
  });
});

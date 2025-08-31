import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setMode, setCalm, initMode, initCalm } from '../lib/state';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('state.ts', () => {
  beforeEach(() => {
    // Reset DOM and localStorage before each test
    document.body.innerHTML = `
      <div id="aria-live-region"></div>
      <button id="calm-toggle"></button>
    `;
    localStorage.clear();
    vi.spyOn(localStorage, 'setItem');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('setMode', () => {
    it('should set data-mode attribute on html element', () => {
      setMode('nothing');
      expect(document.documentElement.getAttribute('data-mode')).toBe('nothing');
    });

    it('should save the mode to localStorage', () => {
      setMode('no-one');
      expect(localStorage.setItem).toHaveBeenCalledWith('mode', 'no-one');
    });

    it('should update the aria-live region with the new mode', () => {
      setMode('object');
      const region = document.getElementById('aria-live-region');
      expect(region?.textContent).toBe('Mode set to object.');
    });
  });

  describe('setCalm', () => {
    it('should add "calm" class to html element when true', () => {
      setCalm(true);
      expect(document.documentElement.classList.contains('calm')).toBe(true);
    });

    it('should remove "calm" class from html element when false', () => {
      document.documentElement.classList.add('calm');
      setCalm(false);
      expect(document.documentElement.classList.contains('calm')).toBe(false);
    });

    it('should add "active" class to calm-toggle button when true', () => {
      setCalm(true);
      const button = document.getElementById('calm-toggle');
      expect(button?.classList.contains('active')).toBe(true);
    });

    it('should save the calm state to localStorage', () => {
      setCalm(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('calm', 'true');
      setCalm(false);
      expect(localStorage.setItem).toHaveBeenCalledWith('calm', 'false');
    });
  });

  describe('initMode', () => {
    it('should return and set mode from localStorage if it exists', () => {
      localStorage.setItem('mode', 'nothing');
      const mode = initMode();
      expect(mode).toBe('nothing');
      expect(document.documentElement.getAttribute('data-mode')).toBe('nothing');
    });

    it('should return and set default mode "object" if localStorage is empty', () => {
      const mode = initMode();
      expect(mode).toBe('object');
      expect(document.documentElement.getAttribute('data-mode')).toBe('object');
    });
  });

  describe('initCalm', () => {
    it('should return and set calm state from localStorage if it exists', () => {
      localStorage.setItem('calm', 'true');
      const calm = initCalm();
      expect(calm).toBe(true);
      expect(document.documentElement.classList.contains('calm')).toBe(true);
    });

    it('should return and set default calm state false if localStorage is empty', () => {
      const calm = initCalm();
      expect(calm).toBe(false);
      expect(document.documentElement.classList.contains('calm')).toBe(false);
    });
  });

  describe('with localStorage errors', () => {
    beforeEach(() => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage is full');
      });
       vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('Storage is disabled');
      });
    });

    it('should handle setMode errors gracefully', () => {
      setMode('nothing');
      expect(console.warn).toHaveBeenCalledWith('localStorage is not available. Mode preference will not be saved.');
    });

    it('should handle setCalm errors gracefully', () => {
      setCalm(true);
      expect(console.warn).toHaveBeenCalledWith('localStorage is not available. Calm preference will not be saved.');
    });

    it('should handle initMode errors gracefully and return default', () => {
        const mode = initMode();
        expect(console.warn).toHaveBeenCalledWith('localStorage is not available.');
        expect(mode).toBe('object');
    });

    it('should handle initCalm errors gracefully and return default', () => {
        const calm = initCalm();
        expect(console.warn).toHaveBeenCalledWith('localStorage is not available.');
        expect(calm).toBe(false);
    });
  });
});

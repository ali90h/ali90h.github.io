import { describe, it, expect, beforeEach } from 'vitest';
import { toggleHelpSheet } from '../lib/ui';

describe('ui.ts', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="help-sheet"></div>';
  });

  describe('toggleHelpSheet', () => {
    it('should add "visible" class if it is not present', () => {
      const helpSheet = document.getElementById('help-sheet');
      toggleHelpSheet();
      expect(helpSheet?.classList.contains('visible')).toBe(true);
    });

    it('should remove "visible" class if it is present', () => {
      const helpSheet = document.getElementById('help-sheet');
      helpSheet?.classList.add('visible');
      toggleHelpSheet();
      expect(helpSheet?.classList.contains('visible')).toBe(false);
    });

    it('should force visibility on when passed true', () => {
      const helpSheet = document.getElementById('help-sheet');
      toggleHelpSheet(true);
      expect(helpSheet?.classList.contains('visible')).toBe(true);
      toggleHelpSheet(true); // Should remain visible
      expect(helpSheet?.classList.contains('visible')).toBe(true);
    });

    it('should force visibility off when passed false', () => {
      const helpSheet = document.getElementById('help-sheet');
      helpSheet?.classList.add('visible');
      toggleHelpSheet(false);
      expect(helpSheet?.classList.contains('visible')).toBe(false);
      toggleHelpSheet(false); // Should remain hidden
      expect(helpSheet?.classList.contains('visible')).toBe(false);
    });

    it('should do nothing if help-sheet element does not exist', () => {
      document.body.innerHTML = ''; // Remove the element
      toggleHelpSheet();
      // No error should be thrown
      expect(document.getElementById('help-sheet')).toBeNull();
    });
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { renderWorkGrid, renderLogList, initWorkFilter } from '../lib/rendering';
import type { WorkItem, LogItem } from '../lib/types';

describe('rendering.ts', () => {
  beforeEach(() => {
    document.body.innerHTML = ''; // Clear DOM before each test
  });

  describe('renderWorkGrid', () => {
    const mockWork: WorkItem[] = [
      { repo: 'user/repo1', oneLine: 'desc1', type: 'tools', language: 'TypeScript', lastUpdate: 'commit1' },
      { repo: 'user/repo2', oneLine: 'desc2', type: 'docs', language: 'Rust', lastUpdate: 'commit2' },
    ];

    beforeEach(() => {
        document.body.innerHTML = '<div id="work-grid"></div>';
    });

    it('should render work items correctly', () => {
      renderWorkGrid(mockWork);
      const grid = document.getElementById('work-grid');
      expect(grid?.children.length).toBe(2);
      expect(grid?.innerHTML).toContain('repo1');
      expect(grid?.innerHTML).toContain('TypeScript');
    });

    it('should render empty state if no work items are provided', () => {
      renderWorkGrid([]);
      const grid = document.getElementById('work-grid');
      expect(grid?.innerHTML).toContain('No work items to display.');
    });

    it('should not throw if grid element is not found', () => {
        document.body.innerHTML = '';
        expect(() => renderWorkGrid(mockWork)).not.toThrow();
    });
  });

  describe('renderLogList', () => {
    const mockLog: LogItem[] = [
      { id: '1', type: 'PullRequestEvent', public: true, actor: { login: 'ali90h', avatar_url: '' }, repo: { name: 'user/repo1', url: '' }, payload: { action: 'opened', pull_request: { html_url: '#', title: 'pr title', merged: false } }, created_at: new Date().toISOString() },
      { id: '2', type: 'IssuesEvent', public: true, actor: { login: 'ali90h', avatar_url: '' }, repo: { name: 'user/repo2', url: '' }, payload: { action: 'opened', issue: { html_url: '#', title: 'issue title' } }, created_at: new Date().toISOString() },
    ];

    beforeEach(() => {
        document.body.innerHTML = '<div id="log-list"></div>';
    });

    it('should render log items correctly', () => {
        renderLogList(mockLog);
        const list = document.getElementById('log-list');
        expect(list?.querySelectorAll('.log-item').length).toBe(2);
        expect(list?.innerHTML).toContain('pr title');
        expect(list?.innerHTML).toContain('issue title');
    });

    it('should render empty state if no log items are provided', () => {
        renderLogList([]);
        const list = document.getElementById('log-list');
        expect(list?.innerHTML).toContain('no recent noise.');
    });
  });

  describe('initWorkFilter', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <input id="work-filter" />
            <div id="work-grid">
                <div class="work-card" data-type="tools"></div>
                <div class="work-card" data-type="docs"></div>
            </div>
        `;
        // initWorkFilter depends on the grid being rendered first
        initWorkFilter();
    });

    it('should filter items based on input', () => {
        const filterInput = document.getElementById('work-filter') as HTMLInputElement;
        const card1 = document.querySelector('[data-type="tools"]') as HTMLElement;
        const card2 = document.querySelector('[data-type="docs"]') as HTMLElement;

        filterInput.value = 'tool';
        filterInput.dispatchEvent(new Event('input'));

        expect(card1.style.display).toBe('');
        expect(card2.style.display).toBe('none');

        filterInput.value = 'doc';
        filterInput.dispatchEvent(new Event('input'));

        expect(card1.style.display).toBe('none');
        expect(card2.style.display).toBe('');
    });
  });
});

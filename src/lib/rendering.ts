import type { WorkItem, LogItem } from './types'; // I'll need to create this types file

export function renderWorkGrid(workItems: WorkItem[]) {
  const grid = document.getElementById('work-grid');
  if (!grid) return;

  if (!workItems || workItems.length === 0) {
    grid.innerHTML = '<p>No work items to display.</p>';
    return;
  }

  grid.innerHTML = workItems.map(item => `
    <div class="work-card" data-type="${item.type.toLowerCase()}">
      <h3><a href="https://github.com/${item.repo}" target="_blank" rel="noopener noreferrer">${item.repo.split('/')[1]}</a></h3>
      <p class="descriptive">${item.oneLine}</p>
      <p class="meta"><span class="language">${item.language}</span> <span class="last-update descriptive">${(item.lastUpdate || '').substring(0, 100)}</span></p>
      <a href="https://github.com/${item.repo}" target="_blank" rel="noopener noreferrer" class="cta">open repo</a>
    </div>
  `).join('');
}

export function renderLogList(logItems: LogItem[]) {
    const list = document.getElementById('log-list');
    if (!list) return;

    if (!logItems || logItems.length === 0) {
        list.innerHTML = '<p class="empty-state">no recent noise.</p>';
        return;
    }

    const html = logItems.map(item => {
        const url = item.payload.pull_request?.html_url || item.payload.issue?.html_url;
        const title = item.payload.pull_request?.title || item.payload.issue?.title;
        const date = new Date(item.created_at).toLocaleDateString('en-US', { year: '2-digit', month: 'short', day: 'numeric' });
        const action = item.payload.pull_request?.merged ? 'merged' : item.payload.action;
        const icon = action === 'merged' ? '++' : (action === 'closed' ? '--' : '+');
        return `
            <div class="log-item">
                <span class="diff-icon" data-action="${action}">${icon}</span>
                <a href="${url}" target="_blank" rel="noopener noreferrer" class="log-title">${title}</a>
                <span class="repo-badge">${item.repo.name}</span>
                <time class="date" datetime="${item.created_at}">${date}</time>
            </div>
        `;
    }).join('');
    list.innerHTML = `<div class="log-list-container">${html}</div>`;
}

export function initWorkFilter() {
  const filterInput = document.getElementById('work-filter') as HTMLInputElement;
  if (!filterInput) return;

  const workCards = document.querySelectorAll<HTMLDivElement>('.work-card');
  if (workCards.length === 0) return;

  const handleFilter = () => {
      const query = filterInput.value.toLowerCase().trim();
      workCards.forEach(card => {
          const type = card.dataset.type || '';
          card.style.display = type.includes(query) ? '' : 'none';
      });
  };
  filterInput.addEventListener('input', handleFilter);
}

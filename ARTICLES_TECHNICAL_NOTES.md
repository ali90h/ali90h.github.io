# ⚙️ Articles Section - Technical Implementation Reminders

## 🏗️ Technical Architecture Decisions Needed

### 1. Content Storage Strategy
**DECISION REQUIRED**: How to store and serve articles?

**Option A: Single-file approach (Recommended)**
- Keep current zero-dependency philosophy
- Embed articles directly in index.html
- Use JavaScript to show/hide article content
- Pros: Fast, simple, no build step
- Cons: Large file size as content grows

**Option B: Separate files approach**
- Create individual HTML files for each article
- Maintain simple structure without build tools
- Use relative links for navigation
- Pros: Better organization, smaller main file
- Cons: Multiple requests, more complex

**RECOMMENDATION**: Start with Option A, migrate to Option B if file gets too large

### 2. Article Display Implementation

**Current Placeholder Code Location:**
```html
<!-- Line ~XXX in index.html -->
<section id="articles" aria-labelledby="articles-heading">
  <div class="articles-coming-soon">
    <!-- "Coming Soon" content here -->
  </div>
</section>
```

**Proposed Implementation:**
```html
<section id="articles" aria-labelledby="articles-heading">
  <header>
    <h2 id="articles-heading">Articles</h2>
    <div class="article-filters">
      <button class="filter-btn active" data-filter="all">All</button>
      <button class="filter-btn" data-filter="devtools">DevTools</button>
      <button class="filter-btn" data-filter="automation">Automation</button>
      <button class="filter-btn" data-filter="practices">Best Practices</button>
    </div>
  </header>
  <div class="articles-grid">
    <!-- Article cards will be inserted here -->
  </div>
</section>
```

### 3. CSS Classes to Add

```css
/* Article-specific styles */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.article-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.article-card:hover {
  border-color: color-mix(in oklab, var(--border) 50%, var(--accent));
  transform: translateY(-2px);
  box-shadow: 0 4px 12px color-mix(in oklab, var(--accent) 15%, transparent);
}

.article-header {
  margin-bottom: 16px;
}

.article-title {
  margin: 0 0 12px;
  font-size: 1.25em;
  line-height: 1.3;
}

.article-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  color: var(--muted);
  font-size: 0.9em;
  flex-wrap: wrap;
}

.article-tags {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.article-tag {
  background: color-mix(in oklab, var(--accent) 15%, transparent);
  color: var(--accent);
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 0.8em;
  font-weight: 500;
}

.article-excerpt {
  margin: 16px 0;
  color: var(--muted);
  line-height: 1.6;
}

.article-read-more {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.article-read-more:hover {
  text-decoration: underline;
}

.article-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  background: var(--bg-soft);
  border: 1px solid var(--border);
  color: var(--muted);
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background: var(--card);
  color: var(--text);
}

.filter-btn.active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

/* Article page styles (if using separate pages) */
.article-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.article-content {
  line-height: 1.8;
}

.article-content h2 {
  margin-top: 32px;
  margin-bottom: 16px;
  color: var(--text);
}

.article-content h3 {
  margin-top: 24px;
  margin-bottom: 12px;
  color: var(--text);
}

.article-content p {
  margin-bottom: 16px;
}

.article-content code {
  background: var(--bg-soft);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.9em;
}

.article-content pre {
  background: var(--bg-soft);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 16px 0;
}

.article-content blockquote {
  border-left: 4px solid var(--accent);
  padding-left: 16px;
  margin: 16px 0;
  color: var(--muted);
  font-style: italic;
}
```

### 4. JavaScript Functions to Implement

```javascript
// Article management functions
function showArticles() {
  // Replace "Coming Soon" with actual articles
}

function filterArticles(category) {
  // Filter articles by category
}

function showArticle(articleId) {
  // Show full article content (inline or navigate)
}

function calculateReadingTime(content) {
  // Already exists, ensure it works for articles
}

function searchArticles(query) {
  // Add articles to existing search functionality
}

// Article data structure
const articles = [
  {
    id: 'autorepro-cli-lessons',
    title: 'Building AutoRepro: Lessons in CLI Development',
    excerpt: 'Real lessons learned while building a CLI tool from scratch...',
    content: '...', // Full article content
    tags: ['DevTools', 'Python', 'CLI'],
    date: '2026-01-15',
    readingTime: '8 min read',
    category: 'devtools'
  },
  // More articles...
];
```

### 5. Performance Considerations

**Loading Strategy:**
- Lazy load article content
- Use intersection observer for article cards
- Minimize initial bundle size
- Cache article data in localStorage

**SEO Considerations:**
- Add proper meta tags for each article
- Use structured data for articles
- Implement proper heading hierarchy
- Add canonical URLs

## 🔧 Implementation Checklist

### Phase 1: Setup (October 2025)
- [ ] Design article card component
- [ ] Create CSS classes for articles
- [ ] Implement basic article display
- [ ] Add filtering functionality
- [ ] Update search to include articles

### Phase 2: Content Integration (November-December 2025)
- [ ] Create article data structure
- [ ] Implement article rendering
- [ ] Add reading time calculation
- [ ] Test responsive design
- [ ] Implement article navigation

### Phase 3: Polish (January 2026)
- [ ] Add loading animations
- [ ] Implement article sharing
- [ ] Add print styles for articles
- [ ] Performance optimization
- [ ] Accessibility audit

### Phase 4: Launch (February 2026)
- [ ] Content migration from placeholder
- [ ] Final testing
- [ ] Performance verification
- [ ] Launch announcement

## 📝 Code Snippets to Remember

### Replace Current Placeholder
```javascript
// Find this in current code and replace
const searchData = [
  // ... existing items ...
  {title: 'Technical Articles Coming Soon', content: '...', url: '#articles', type: 'articles'},
];

// Replace with:
const searchData = [
  // ... existing items ...
  ...articles.map(article => ({
    title: article.title,
    content: article.excerpt,
    url: `#article-${article.id}`,
    type: 'article'
  }))
];
```

### Navigation Update
```html
<!-- Update this when articles are ready -->
<a href="#articles">Articles</a>

<!-- Consider adding article count -->
<a href="#articles">Articles <span class="count">(3)</span></a>
```

---

**⚠️ CRITICAL REMINDER**: Update this file as you make implementation decisions!
**📅 NEXT TECHNICAL REVIEW**: October 15, 2025

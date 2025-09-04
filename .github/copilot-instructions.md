# Personal Portfolio Website

This is a **single-file static personal website** deployed via GitHub Pages with no build process, dependencies, or external assets. The entire site is contained in `index.html` with inline CSS and JavaScript.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Local Development and Testing
- Serve the site locally for development and testing:
  - `cd /home/runner/work/ali90h.github.io/ali90h.github.io`
  - `python3 -m http.server 8080` -- NEVER CANCEL. Takes 1-2 seconds to start. Always wait for "Serving HTTP on..." message.
  - Access site at `http://localhost:8080`
  - Server startup is instant (<1 second), site loads in <0.01 seconds
- **ALWAYS test locally before committing changes**
- Stop server with `Ctrl+C` or `kill` command when testing is complete

### Validation and Testing
- **MANUAL VALIDATION REQUIREMENT**: After making any changes, you MUST test the following scenarios:
  1. **Theme Toggle**: Click the "Theme" button and verify light/dark mode switching works
  2. **Navigation**: Test all anchor links (Projects, Writing, GitHub) scroll to correct sections
  3. **Responsive Layout**: Verify grid layout adapts properly (resize browser or test mobile view)
  4. **Accessibility**: Ensure skip links, ARIA labels, and semantic HTML remain intact
- **NO build step needed** -- this is a static site with no compilation
- **NO package managers** -- no npm, pip, or other dependency management
- **NO linting tools required** -- pure HTML/CSS/JS with no external dependencies

### Deployment
- **Automatic GitHub Pages deployment** -- changes to main branch deploy automatically
- **NO CI/CD configuration needed** -- GitHub Pages serves static files directly
- **Live site**: https://ali90h.github.io (deployed from main branch)
- **Deployment time**: 1-2 minutes after push to main branch

## Validation Requirements

### Manual Testing Steps (REQUIRED for all changes)
1. **Start local server**: `python3 -m http.server 8080`
2. **Load site**: Navigate to `http://localhost:8080`
3. **Test theme toggle**: Click "Theme" button, verify color scheme changes
4. **Test navigation**: Click "Projects", "Writing", "GitHub" -- verify smooth scrolling to sections
5. **Test responsive behavior**: Resize browser window, verify layout adapts correctly
6. **Test accessibility**: Use tab navigation, verify skip links and ARIA labels work
7. **Verify no console errors**: Open browser dev tools, check for JavaScript errors

### Performance Expectations
- **Server startup**: <1 second -- NEVER CANCEL
- **Page load time**: <0.01 seconds locally
- **Theme toggle response**: Instant (<0.1 seconds)
- **Navigation scrolling**: Smooth animation (0.3-0.5 seconds)

## Code Structure and Patterns

### File Organization
```
/
├── index.html          # Complete website (HTML + CSS + JS)
├── .git/              # Git repository
└── .github/           # GitHub configurations
    └── copilot-instructions.md
```

### Architecture Patterns
- **Single-page application**: All content in one HTML file
- **CSS Custom Properties**: Theme colors defined as CSS variables in `:root`
- **Progressive Enhancement**: Works without JavaScript, enhanced with JS
- **Mobile-first responsive**: CSS Grid with responsive breakpoints
- **Accessibility-first**: Semantic HTML, ARIA labels, skip links

### Theme System
```css
:root {
  --bg: #0b0c0e;        /* Dark theme background */
  --text: #e6e7ea;      /* Dark theme text */
  /* ... other variables */
}

[data-theme="light"] {
  --bg: #f8f9fb;        /* Light theme background */
  --text: #0b1020;      /* Light theme text */
  /* ... other variables */
}
```

### JavaScript Functionality
- **Theme toggle**: Switches `data-theme` attribute on `<html>` element
- **Local storage**: Persists theme preference across sessions
- **Year display**: Automatically updates copyright year
- **Word wrapping**: Enables hover effects on individual words

## Common Tasks

### Making Content Changes
1. **Edit `index.html` directly** -- no build process required
2. **Test locally**: `python3 -m http.server 8080`
3. **Validate functionality**: Run through manual testing checklist
4. **Commit and push**: Changes deploy automatically via GitHub Pages

### Adding New Sections
- Follow existing grid pattern: `<section>` with `<header>` and content grid
- Use semantic HTML: `<article>`, `<header>`, `<h2>`, `<h3>`
- Apply consistent styling classes: `.card`, `.grid`, `.span-6`
- Test responsive behavior at different screen sizes

### Modifying Styles
- **Edit inline CSS** in `<style>` section of `index.html`
- **Use CSS custom properties** for consistent theming
- **Test both light and dark themes** after changes
- **Verify responsive breakpoints** still work correctly

### Troubleshooting
- **Site not loading**: Check if server is running on correct port
- **Theme not switching**: Verify JavaScript console for errors
- **Layout broken**: Check CSS grid properties and responsive breakpoints
- **Navigation not working**: Verify anchor links match section IDs

## Expected File Contents

### Repository root (ls -la)
```
total 24
drwxr-xr-x 3 runner docker  4096 Sep  4 13:38 .
drwxr-xr-x 3 runner docker  4096 Sep  4 13:37 ..
drwxr-xr-x 7 runner docker  4096 Sep  4 13:38 .git
-rw-r--r-- 1 runner docker 11484 Sep  4 13:38 index.html
drwxr-xr-x 2 runner docker  4096 Sep  4 13:38 .github
```

### index.html structure
- **Lines 1-9**: DOCTYPE and head with meta tags
- **Lines 10-70**: Inline CSS with theme variables and responsive styles
- **Lines 71-89**: Header with navigation and theme toggle
- **Lines 90-163**: Main content sections (hero, projects, writing, github, contact)
- **Lines 164-199**: Inline JavaScript for theme toggle and word wrapping

## Development Workflow

### For Content Updates
1. `cd /home/runner/work/ali90h.github.io/ali90h.github.io`
2. Edit `index.html` directly
3. `python3 -m http.server 8080` -- test locally
4. Open `http://localhost:8080` -- verify changes
5. Test theme toggle and navigation
6. Commit and push changes

### For Style Changes
1. Edit CSS in `<style>` section of `index.html`
2. Test both light and dark themes
3. Verify responsive behavior
4. Test on different screen sizes
5. Commit and push changes

### For JavaScript Changes
1. Edit JS in `<script>` section of `index.html`
2. Test theme toggle functionality
3. Check browser console for errors
4. Verify localStorage persistence works
5. Commit and push changes

**Remember**: This site intentionally has "no build step" -- edit HTML directly and test with Python's HTTP server.
# Tamirat Dalasa — Personal Portfolio

A single-page portfolio built with **plain HTML5, CSS3 and vanilla JavaScript only** — no frameworks, no build step, no dependencies.

Files:

| File          | Purpose |
|---------------|---------|
| `index.html`  | All page content and markup |
| `styles.css`  | Theme, layout, animations (all variables at the top) |
| `script.js`   | Menu, scroll effects, reveal animations, clock, form |
| `README.md`   | This file |

## Run it

Open `index.html` in a browser. That's it.

For local development you can serve the folder instead (avoids any file:// quirks):

```bash
# Python
python -m http.server 8000
# or Node
npx serve .
```

Then visit http://localhost:8000

## Deploy

Upload the three files to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, your own server). Nothing to build.

## Replace the placeholder content

Everything written in **[SQUARE BRACKETS]** is a placeholder to swap for your real information. Search the files for `[` and fill in:

### Identity & links
- `[YOUR EMAIL]` — in the hero, contact section and footer (3 places)
- `[YOUR GITHUB URL]`, `[YOUR LINKEDIN URL]`, `[YOUR TWITTER URL]`, `[YOUR BLOG URL]`
- `[YOUR DOMAIN]` — `index.html` `<link rel="canonical">` + JSON-LD
- `Tamirat Dalasa` / `Wordmark` — if the name changes

### Experience & education timeline
- Job titles, companies, date ranges (`[YEAR]`), descriptions
- `[CERT NAME]` / `[ISSUING ORGANIZATION]` / `[YEAR ISSUED]` — inside the commented-out certification block (uncomment to use)

### Projects
- `[PROJECT TITLE]`, `[PROJECT TYPE]`, `[YEAR]`, `[YOUR ROLE]`, `[ONE-LINE DESCRIPTION]`
- Tool tags inside `<ul class="tech-stack">`
- `[YOUR CONTRIBUTION]` rows in the collapsibles
- `[PROJECT URL]` / `[YOUR GITHUB URL]`

### Writing
- `[ARTICLE TITLE]`, `[SHORT SUMMARY]`, `[PUBLICATION]`, `[READ TIME]`, `[ARTICLE URL]`

### Contact
- Form posts nowhere by default (see "Backend" below)
- `AT` in `hello [AT] yourdomain.com` is an anti-spam convention — replace with your real address

Search for leftovers when you're done:

```powershell
Select-String -Path index.html, styles.css, script.js -Pattern '\[[A-Z][^\]]*\]'
```

## Add a photo

`index.html` → the hero has a CSS monogram placeholder inside `<figure class="portrait-wrap">`.

```html
<figure class="portrait-wrap">
  <img src="assets/portrait.jpg" alt="Tamirat Dalasa" width="560" height="700">
</figure>
```

Add your image (recommended ~560×700, under 200 KB) and drop a `.portrait` class on the `img` if you want the existing `border-radius: var(--radius)` framing. The monogram `<div class="portrait-placeholder">` can be deleted.

## Change the theme colours

`styles.css` → first block, `:root`:

```css
--paper: #f4f3ef;   /* page background */
--ink: #11110f;     /* headings, dark sections */
--blue: #2f5bff;    /* accent (links, eyebrows) */
--lime: #d9ff57;    /* accent on dark sections */
--line: rgba(17, 17, 15, .16);
--radius: 18px;
```

Change those four colour variables and the whole site follows. Fonts live on the two lines right below:

```css
--font-display: "Source Serif 4", Georgia, serif;   /* headings only */
--font-sans: "Hanken Grotesk", Arial, sans-serif;   /* body copy */
```

Set `--font-display` to the same value as `--font-sans` if you prefer all-sans headings.

## Hide the Writing section

In `index.html` find the comment pair `WRITING:START` / `WRITING:END` and delete everything between them. If only one card remains, leave it — the grid handles it.

## Contact form backend

The form validates in the browser, then either:

1. **No backend** — opens the visitor's mail client via `mailto:` (works out of the box), or
2. **Your backend** — uncomment the `BACKEND HOOK` block in `script.js` and point it at your endpoint:

```js
// await fetch("/api/contact", { method: "POST", body: JSON.stringify(payload) });
```

Set `USE_BACKEND = true` above it.

## Feature notes

- Sticky header gains a background after you scroll, hides on scroll-down and returns on scroll-up
- Blue scroll-progress bar under the header
- Live local time in the hero (time zone set in `script.js` → `LOCAL_TIME_ZONE`, default `Africa/Addis_Ababa`)
- Sections fade in as they enter the viewport; all animation is disabled if the OS asks for reduced motion
- Mobile hamburger menu with focus trap, `Esc` to close
- Works without JavaScript (content stays readable; navigation links remain visible)

## Browser support

Current Chrome, Firefox, Safari and Edge. Uses `color-mix()`, `inert` and `IntersectionObserver` — all supported since 2022–2023.

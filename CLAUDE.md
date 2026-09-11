# Final Affairs — notes for Claude

Static marketing website. Plain HTML, CSS, and JavaScript. No framework, no
build step, no package manager, no dependencies.

## Layout

- `src/` — the deployed website. HTML pages at the top level, assets in
  `src/assets/{css,js,img,fonts}/`.
- `design/` — original design exports for reference. **Never deployed and never
  referenced by `src/`.** Don't edit these to change the site, and don't point
  the site at files inside this folder.
- `docs/` — team conventions. `structure.md` is the authority on naming,
  CSS organisation, and breakpoints.

## Conventions

- **Mobile-first CSS.** Mobile layout is the default with no media query;
  desktop rules go inside `@media (min-width: ...)`.
- Desktop and mobile are the **same HTML file** with different CSS layouts. Do
  not create separate mobile files and do not add user-agent detection.
- The mobile layout may be a completely different arrangement from desktop —
  it is not a narrowed desktop. Follow whatever the designs in `design/` show.
- Colours, fonts, and spacing are CSS custom properties defined in
  `src/assets/css/base.css`. Reference them with `var()`; never hard-code a hex
  value in a page stylesheet.
- CSS load order: `base.css` → `components.css` → `pages/<page>.css`. A rule
  used by more than one page belongs in `components.css`.
- Filenames: lowercase with dashes. No spaces, no capitals.

## Accessibility

Applies to all generated markup: every `<img>` needs `alt` (empty for
decorative), headings descend without skipping levels, interactive elements are
`<button>`/`<a>` rather than `<div>`, form inputs have real `<label>`s, and body
text meets 4.5:1 contrast.

## Git

Never commit to `main` — branch and open a PR. Branch prefixes: `feat/`,
`fix/`, `content/`, `design/`, `chore/`. Full workflow in `docs/workflow.md`.

## Deployment

Not configured. Hosting is undecided (Vercel vs. Webflow), so **do not add
host-specific config files** unless asked. When it is decided, the deploy root
will be `src/`.

## Preview

No build step — serve the folder statically:

```bash
cd src && python3 -m http.server 8000
```

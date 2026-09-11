# Final Affairs — notes for Claude

Static marketing website. Plain HTML, CSS, and JavaScript. No framework, no
build step, no package manager, no dependencies.

## Layout

- `src/` — the deployed website. HTML pages at the top level, assets in
  `src/assets/{css,js,img,fonts}/`.
- `design/` — original Claude Design exports, kept for reference. These are
  self-extracting React bundles (multi-MB, content packed in a base64
  manifest), **not** editable source. **Never deployed and never referenced by
  `src/`.** To change the site, edit `src/`; never edit `design/`.
- `docs/` — team conventions. `structure.md` is the authority on naming,
  CSS organisation, and breakpoints.

Note: `design/desktop/your memories desktop .html` is a design *canvas* holding
two artboards — the Your Memories wall and the Memory Tree detail page — which
became two separate pages in `src/`.

The pages in `src/` were rebuilt from those bundles into plain static HTML.
The design system, tokens, markup and copy are carried over faithfully — treat
the rendered design as the spec and don't restyle it.

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
- Header, footer and buttons are in `components.css` (`.fa-header`, `.fa-footer`,
  `.fa-btn`). They are CSS translations of the approved design-system
  components — every page uses them, so a change there hits the whole site.
- Page width: the designs were drawn on a 1440px canvas with 100px side
  padding, i.e. a **1240px content column**. `.fa-bleed` reproduces that with
  `padding-inline: max(100px, calc((100% - 1240px) / 2))`, which is exactly
  100px at 1440px wide and grows beyond it, so backgrounds reach the screen
  edge while content stays at 1240px. Use `.fa-bleed` for full-width sections;
  don't hard-code a 1440px wrapper.
- The Your Memories pages are the exception: they were designed on a 1320px
  content column, not 1240px, and keep it. Their design-local tokens
  (`--paper`, `--canvas`, `--ink`, …) live on `.fa-memories` in their page CSS.
- Filenames: lowercase with dashes. No spaces, no capitals.

## Accessibility

Applies to all generated markup: every `<img>` needs `alt` (empty for
decorative), headings descend without skipping levels, interactive elements are
`<button>`/`<a>` rather than `<div>`, form inputs have real `<label>`s, and body
text meets 4.5:1 contrast.

## Navigation

Header nav — seven items, this order, on every page:
Home · About Us · For Families · For Funeral Homes · For Attorneys ·
Your Memories · Contact Us

Footer links — five, deliberately a subset (no Home, no Your Memories):
About Us · For Families · For Funeral Homes · For Attorneys · Contact Us

**Don't add a sixth footer link.** The footer row is logo + links + Log In on
one line; a sixth link overflows the 1240px column and wraps the links onto
their own row, which is not the design. If one must be added, the logo width
and link gap have to come down together — check it at 1440px.

The nav is duplicated in each HTML file. Adding or renaming an item means
editing every page in `src/`. Mark the current page with `aria-current="page"`
(that attribute, not a class, drives the active styling).

Three pages sit under Your Memories and are not in the nav. All three mark
Your Memories as the current nav item:

- `memory-tree.html` — a single shared note, reached from the wall; its
  "back to the wall" link returns to `your-memories.html`.
- `final-record.html` — the Final Record for Eleanor Ruth Vance, reached by
  searching her name on the wall.

## Final Record search

`your-memories.html` has no search backend. `assets/js/record-search.js`
holds a `RECORDS` list mapping names to record pages; a match navigates
there, a miss shows a quiet status line. **Add an entry to `RECORDS` whenever
a new Final Record page is added** — nothing else discovers them.

Matching is deliberately loose (substring, either direction) so "eleanor",
"Vance" and "Eleanor Ruth Vance" all resolve.

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

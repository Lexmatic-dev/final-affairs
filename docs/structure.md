# Structure & conventions

Where things go and what to call them. Following these keeps the repo navigable
as the team and the site grow.

---

## `src/` — the website

This folder *is* the deployed site. Its internal paths are the site's URLs.

```
src/
├── index.html              → /
├── about.html              → /about
├── contact.html            → /contact
└── assets/
    ├── css/
    │   ├── base.css        ← reset, variables, typography — loaded everywhere
    │   ├── components.css  ← buttons, cards, nav, footer — shared pieces
    │   └── pages/
    │       └── about.css   ← styles only used by one page
    ├── js/
    ├── img/
    └── fonts/
```

One HTML file per page, named after its URL, at the top level of `src/`.

### CSS organisation

Three layers, loaded in this order:

1. **`base.css`** — CSS custom properties (colours, fonts, spacing scale), the
   reset, and base typography. Everything depends on this.
2. **`components.css`** — anything that appears on more than one page: the nav,
   footer, buttons, form fields, cards.
3. **`pages/<page>.css`** — styles used by exactly one page. If a rule starts
   getting copied into a second page file, promote it to `components.css`.

Define colours, fonts, and spacing as custom properties in `base.css` and
reference them everywhere else. Never hard-code a hex value in a page file —
that's how a brand colour ends up with six slightly different versions.

```css
/* base.css */
:root {
  --color-ink: #1a1a1a;
  --space-4: 1rem;
}

/* anywhere else */
.card { color: var(--color-ink); padding: var(--space-4); }
```

### Naming

| Thing        | Convention              | Example                    |
|--------------|-------------------------|----------------------------|
| HTML files   | lowercase, dashes       | `how-it-works.html`        |
| CSS / JS     | lowercase, dashes       | `nav-mobile.css`           |
| Images       | lowercase, dashes       | `hero-background.jpg`      |
| CSS classes  | lowercase, dashes       | `.pricing-card__title`     |

No spaces, no capitals, no `Final Logo FINAL v2.png`. Filenames with spaces
break on some servers and are painful to type in paths.

---

## Responsive / breakpoints

Desktop and mobile are the same HTML file with different CSS layouts.

Write the **mobile layout as the default**, then add desktop rules inside a
`min-width` media query:

```css
/* mobile layout — the default, no media query */
.hero { display: block; }

/* desktop layout takes over here */
@media (min-width: 1024px) {
  .hero { display: grid; grid-template-columns: 1fr 1fr; }
}
```

Mobile-first is the convention because phones then never download or parse
desktop layout rules they don't use.

**Breakpoints — provisional, to be confirmed against the mobile designs:**

| Name    | Width    | Target                |
|---------|----------|-----------------------|
| mobile  | default  | phones                |
| tablet  | ≥ 768px  | tablets, small laptops|
| desktop | ≥ 1024px | laptops and up        |

These will be pinned to whatever the actual designs use once the mobile files
land. Define them in one place and don't invent new ones ad hoc.

### What "mobile design" means here

The mobile layout is allowed to be a completely different arrangement —
different order, different components, things hidden or added. It is not
required to be the desktop layout at a narrower width. The breakpoint is just
the switch; what's on either side of it is whatever the designs say.

---

## `design/` — reference only

Original design exports, kept so we can check the build against the source.

```
design/
├── desktop/
└── mobile/
```

**Never referenced by the live site.** Nothing in `src/` should link to,
import, or `<img src>` anything in `design/`. If an asset from a design export
is needed on the site, copy it into `src/assets/`.

Keep the original export filenames here — don't rename them. Matching them to
what the designer sent is the entire point of this folder.

---

## Images

- Photos → `.jpg` (or `.webp` where we can)
- Logos, icons, illustrations → `.svg`
- Screenshots, anything needing transparency → `.png`

Compress before committing. An uncompressed 8MB hero image is the single most
common cause of a slow site, and git keeps every version of it forever.

---

## Accessibility baseline

Not optional, and much cheaper to do as we go than to retrofit:

- Every `<img>` gets an `alt`. Decorative images get `alt=""`.
- Headings descend in order — `h1` → `h2` → `h3`, never skipping a level.
- Interactive things are `<button>` or `<a>`, not a `<div>` with a click handler.
- Body text meets 4.5:1 contrast against its background.
- Every form input has a real `<label>`.

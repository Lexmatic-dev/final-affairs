# Final Affairs

Marketing website for Final Affairs.

Static HTML/CSS/JS. No build step, no framework, no dependencies to install —
open a file in a browser and it works.

---

## Quick start

```bash
git clone https://github.com/Lexmatic-dev/final-affairs.git
cd final-affairs
```

To preview the site locally, serve the `src/` folder. Any of these work:

```bash
# Python (already on macOS and most Linux machines)
cd src && python3 -m http.server 8000

# Node
npx serve src

# VS Code
# Install the "Live Server" extension, right-click src/index.html → "Open with Live Server"
```

Then open <http://localhost:8000>.

> **Why serve it instead of double-clicking the HTML?**
> Opening a file directly (`file:///...`) breaks shared assets, fonts, and
> anything fetched by JavaScript. Always use a local server.

---

## Repository layout

```
final-affairs/
├── src/                        ← THE WEBSITE. This is what gets deployed.
│   ├── index.html              ← Home
│   ├── about-us.html
│   ├── for-families.html
│   ├── for-funeral-homes.html
│   ├── for-attorneys.html
│   ├── your-memories.html      ← the memories wall
│   ├── memory-tree.html        ← single-note detail, linked from the wall
│   ├── contact-us.html
│   └── assets/
│       ├── css/
│       │   ├── base.css        ← fonts + design tokens
│       │   ├── components.css  ← header, footer, buttons, page shell
│       │   └── pages/          ← per-page overrides
│       ├── img/
│       └── fonts/              ← Nunito Sans, self-hosted
│
├── design/                     ← Reference only. NOT deployed.
│   ├── desktop/                ← original Claude Design exports
│   └── mobile/                 ← (mobile designs go here)
│
├── docs/
│   ├── workflow.md             ← git workflow — read first if git is new to you
│   └── structure.md            ← naming rules and where things go
│
└── .github/
```

**The one rule that matters:** `src/` is the live site. `design/` is the
original artwork we're building from. Never edit `design/` to change the
website, and never point the site at a file inside `design/`.

The files in `design/desktop/` are self-extracting React bundles — several MB
each, with the real content packed inside. They render in a browser but are
not editable source. The pages in `src/` were rebuilt from them into plain
HTML, preserving the design system, markup and copy.

---

## Responsive approach

Desktop and mobile are the **same pages** with **different layouts**, swapped
by CSS breakpoints — not separate files and not device sniffing. The mobile
layout is a genuinely different arrangement that takes over below the
breakpoint, not a squished desktop.

**Desktop is built. Mobile is not yet** — the mobile designs are still to come,
and their breakpoint rules will be added to the same files.

Page width: the designs were drawn on a 1440px canvas with 100px side padding,
giving a **1240px content column**. The site reproduces that exactly at 1440px
and holds the 1240px column on wider screens while full-bleed backgrounds
reach the screen edge.

| Viewport | Content column | Side gutter |
|---------:|---------------:|------------:|
|   1280px |         1080px |       100px |
|   1440px |         1240px |       100px |
|   1920px |         1240px |       340px |
|   2560px |         1240px |       660px |

See [`docs/structure.md`](docs/structure.md) for details.

---

## Deployment

**Not configured yet** — hosting is still being decided (Vercel vs. Webflow).

The repo is deliberately host-agnostic: plain static files, no host-specific
config committed. Whatever we choose, the deploy root will be `src/`.

---

## Contributing

Don't commit directly to `main`. Branch, then open a pull request.

Full walkthrough — including the exact commands — is in
[`docs/workflow.md`](docs/workflow.md).

```bash
git checkout main
git pull origin main
git checkout -b feat/your-change
# ...make changes...
git add .
git commit -m "Add hero section to homepage"
git push -u origin feat/your-change
# then open a PR on GitHub
```

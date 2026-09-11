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
├── src/                  ← THE WEBSITE. This is what gets deployed.
│   ├── index.html
│   └── assets/
│       ├── css/          ← stylesheets
│       ├── js/           ← scripts
│       ├── img/          ← images, SVGs, logos
│       └── fonts/        ← self-hosted webfonts
│
├── design/               ← Reference only. NOT deployed.
│   ├── desktop/          ← original desktop design exports
│   └── mobile/           ← original mobile design exports
│
├── docs/                 ← How we work
│   ├── workflow.md       ← git workflow — read this first if git is new to you
│   └── structure.md      ← naming rules and where things go
│
└── .github/              ← PR template and (later) CI
```

**The one rule that matters:** `src/` is the live site. `design/` is the
original artwork we're building from. Never edit `design/` to change the
website, and never point the site at a file inside `design/`.

---

## Responsive approach

Desktop and mobile are the **same pages** with **different layouts**, swapped
by CSS breakpoints — not separate files and not device sniffing.

The mobile design is not a squished desktop. It's a genuinely different layout
that takes over below the breakpoint. Both designs are preserved exactly as
drawn; they just live in one file per page.

Why this way:
- Copy and content exist in one place, so a text change is made once, not twice.
- One URL per page — better for SEO, sharing, and analytics.
- Resizing a desktop browser window behaves correctly.
- No user-agent detection, which misfires on tablets and "Request Desktop Site."

See [`docs/structure.md`](docs/structure.md) for the breakpoint values.

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

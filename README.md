# Rishu Shrivastava — Portfolio

A single-page portfolio built with React + Vite. The `Portfolio.jsx` component
is self-contained: it injects its own fonts (JetBrains Mono + Fraunces) and all
of its CSS, so there are no extra styling dependencies.

## Requirements

- Node.js 18 or newer ( check with `node -v` )

## Run it locally

```bash
npm install
npm run dev
```

Vite prints a local URL (usually http://localhost:5173). Open it in your
browser. Edits hot-reload instantly.

## Build for production

```bash
npm run build      # outputs static files to /dist
npm run preview    # preview the production build locally
```

## Deploy

The contents of `/dist` are plain static files. On Vercel, import the repo and
it auto-detects Vite — no config needed.

## Where things live

- `src/Portfolio.jsx` — the whole site (edit your content here)
- `src/main.jsx` — mounts the component
- `src/index.css` — minimal global reset
- `index.html` — page shell + tab title / meta description

## Adding your resume download

`src/Resume.pdf` is included. To link it from the page, import it at the top of
`Portfolio.jsx` (`import resume from "./Resume.pdf";`) and point an anchor or
button at `resume`.

# BECOMING A MICROSCOPE TO CREATE NEW SECRETS

Process documentation for a graduate typography project — a single-page site built with vanilla HTML, CSS, and p5.js.

## The idea

This assignment made me rethink the possibilities of visualization. When I design, I rarely sketch with a pen on paper; I usually start directly using various software applications on my computer. Even though I'm very good at drawing, I still feel a bit lost when faced with highly abstract concepts and a multitude of adjectives that describe specific visual elements. Sometimes, after spending several hours on it, I find it difficult to come up with new ideas. It was precisely during this process that I continually pushed my thinking into new directions, no longer sticking to any single idea.

In both Method A and Method B, I constantly rearranged the patterns I had drawn. Even though these five adjectives — **blurry, instant, raw, smooth, thin** — were very different, the rearranged patterns produced incredible visual effects. I kept trying and experimenting, encountering moments of confusion and stagnation, as well as moments brimming with inspiration and discovery. When I use these patterns to convey certain feelings, I realize just how important it is to communicate effectively without written explanations.

## What this page shows

The page is a two-column archive of the full process:

- **Left column** — every asset in the project, organized exactly as it lives in the folder tree, as clickable thumbnails.
- **Right column** — a large viewing area: click any thumbnail to inspect that file at full size, rendered crisply on a p5 canvas. The project statement sits beneath the viewer.

## Folder structure

| Folder | Contents |
| --- | --- |
| `5adj/` | Twelve-frame sequences for each of the five adjectives (`blurry`, `instant`, `raw`, `smooth`, `thin`), as SVG |
| `A/` | Screenshots from Method A |
| `B/` | Twenty numbered steps from Method B: each operation (CUT, KNOT, TEAR, SHORTEN) moves through CHANCE → APPROPRIATE → ELIMINATION |
| `chance/` | Screenshots from the chance operations |
| `poster/` | The final poster |

## How it's built

- Plain HTML + CSS. Header (15% window height), footer (5%), 5% side padding; the thumbnail column is 25% of the window width.
- **p5.js 2.x** with the [p5.svgkit](https://github.com/MattObject/p5.svgkit) addon loads and displays the SVG drawings.
- The typeface is [Encode Sans Semi Expanded](https://fonts.google.com/specimen/Encode+Sans+Semi+Expanded), self-hosted in `fonts/` alongside local copies of p5 — the page has no external dependencies.

## Run it

Serve the folder over HTTP and open `index.html` — e.g. the **Live Server** extension in VS Code, or:

```sh
python3 -m http.server
```

Opening the file directly via `file://` will not work, because assets are fetched with `fetch()`.

# The Porch — a book on the web

An antiquarian, letterpress-style reading site: EB Garamond on cream paper,
justified text, Tufte-style margin sidenotes. Plain semantic HTML + one
hand-written CSS file. **No framework, no build step, no JavaScript** — the
reading experience works fully with JS disabled.

## How to run it

Just open `index.html` in any browser. There is no server, no install, no build.

```
index.html      front matter — title, subtitle, table of contents
foreword.html   a complete sample chapter (the per-chapter template)
book.css        all styling, heavily commented
fonts/          self-hosted EB Garamond (woff2) — no font CDN at runtime
```

(Hosted copy: GitHub Pages serves the same files at the repo's Pages URL.)

## Where the design tokens live

Everything you'd want to change is at the **top of `book.css`, section 1
("DESIGN TOKENS")**. You rarely need to touch anything else.

| To change… | Edit this token |
|---|---|
| Paper colour | `--paper` |
| Body ink | `--ink` |
| Title / drop cap / link colour | `--rubric` |
| Line length (the measure) | `--measure` (≈ 65 chars) |
| Width of margin notes | `--note-width` |
| Gap between text and notes | `--note-gap` |
| Body text size | `--size-0` |
| Overall type scale | `--ratio` |
| Leading | `--leading` |

Only three colours are used (`--paper`, `--ink`, `--rubric`); every other tone
is a `color-mix()` derivative of those, so the palette stays coherent. **Dark
mode** is automatic via `prefers-color-scheme` — it overrides only those three
tokens (section 7).

## Adding a sidenote

Sidenotes are pure CSS (the Tufte hidden-checkbox technique). Numbering is
automatic. Paste this right after the word you're annotating:

```html
<label class="margin-toggle sidenote-ref" for="sn-1"></label
><input type="checkbox" id="sn-1" class="margin-toggle"
><span class="sidenote">Your note here.</span>
```

For an **unnumbered margin note** (a free-floating side summary):

```html
<label class="margin-toggle" for="mn-1">&#8853;</label
><input type="checkbox" id="mn-1" class="margin-toggle"
><span class="marginnote">Your note here.</span>
```

Give each note a unique `id` (`sn-1`, `sn-2`, `mn-1`, …). On wide screens the
note sits in the right margin; below 760px it collapses and the reader taps the
number (or the ⊕) to reveal it inline.

> **Note density:** this pure-CSS approach stacks notes with `clear`, so very
> dense notes can drift below their reference, and the tap-to-reveal isn't
> keyboard-operable on mobile. If you ever need heavy annotation, the upgrade
> path is [gwern's `sidenotes.js`](https://gwern.net/sidenote). Not included here
> to keep the site JS-free.

## Adding a new chapter

1. **Copy `foreword.html`** to e.g. `1-1-so-you-want.html`.
2. Change `<title>`, the running-head `<span class="folio">`, and the
   `titleblock` heading/subtitle.
3. Replace the prose between the `<!-- PLACEHOLDER PROSE -->` comments. Keep the
   first paragraph as `<p class="opening"><span class="runin">First few words</span> …</p>`
   for the drop cap + small-caps opening.
4. In `index.html`, point that chapter's table-of-contents link at the new file.

## Replaceable asset slots

Each is marked in the markup with an HTML comment (`<!-- REPLACE: … -->`):

| Slot | Where | Notes |
|---|---|---|
| Wordmark / logo | `index.html` titleblock | optional SVG in place of the `<h1>` |
| Decorative initial | `book.css` (drop cap rule) | optional inline `<svg class="initial">`; clean CSS drop cap ships by default |
| Section ornament / fleuron | `index.html`, `foreword.html` | inline SVG, reused as divider + in the footer |
| Favicon | `<link rel="icon">` | currently an inline-SVG fleuron placeholder |

## Fonts

`fonts/` holds subsetted EB Garamond woff2 (regular + italic, latin &
latin-ext), declared with `font-display: swap` in `book.css` §2. They are
self-hosted — the site makes **no requests to a font CDN**. To swap typefaces,
drop new woff2 files in `fonts/`, update the `@font-face` blocks, and change
`--serif`.

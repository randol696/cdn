# cdn

A personal CDN and library of UI elements, styles, and utility functions, served
straight from GitHub Pages so any project can pull them in with a couple of tags.
Dark, glassmorphic theme by default — frosted panels, glowing cyan/violet accents.

Live docs + interactive demo: **[randol696.github.io/cdn](https://randol696.github.io/cdn/)**

## What's in here

```text
css/
  rg.css        Design tokens (CSS variables) + component styles — this is the library
  docs.css      Layout styles for index.html only, not part of the library
js/
  rg-lib.js     RG.ui.* element builders and RG.utils.* helper functions — this is the library
  docs.js       Demo wiring for index.html only, not part of the library
button.js       Original standalone snippet, kept for backward compatibility
index.html      Documentation + live demo page for everything below
```

## Install

Drop these two tags into any page. No build step, no dependencies, no npm install.

```html
<link rel="stylesheet" href="https://randol696.github.io/cdn/css/rg.css">
<script src="https://randol696.github.io/cdn/js/rg-lib.js"></script>
```

That gives you a single global, `RG`, with two namespaces:

- `RG.ui.*` — functions that build and return DOM elements
- `RG.utils.*` — plain helper functions

### Versioning via jsDelivr

Serving directly from `github.io` always gives you whatever is on `main`. If you
want a copy that's edge-cached and can be pinned to a release, use jsDelivr's
GitHub mirror instead — it fronts this same repo with real CORS and CDN headers:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/randol696/cdn@main/css/rg.css">
<script src="https://cdn.jsdelivr.net/gh/randol696/cdn@main/js/rg-lib.js"></script>
```

Once you tag a release (e.g. `v1.0.0`), swap `@main` for `@v1.0.0` so pages don't
break when this repo changes.

## Usage

```html
<div id="app"></div>
<script>
  var btn = RG.ui.button({
    text: 'Save',
    variant: 'primary',           // primary | secondary | danger | outline
    onClick: function () {
      RG.ui.toast('Saved!', { variant: 'success' });
    }
  });
  document.getElementById('app').appendChild(btn);
</script>
```

### UI elements (`RG.ui`)

| Function | Description |
| --- | --- |
| `button({ text, variant, onClick, className })` | Returns a `<button>` (`primary`, `secondary`, `danger`, `outline`) |
| `card({ title, body, footer })` | Returns a glass card `<div>` |
| `badge(text, variant)` | Returns an inline pill with a glow dot (`default`, `primary`, `success`, `danger`) |
| `alert({ title, body, variant, dismissible })` | Returns a dismissible banner (`default`, `success`, `warning`, `danger`) |
| `toast(message, { duration, variant })` | Appends a self-dismissing toast to the page |
| `modal({ title, body, onClose })` | Appends an overlay modal; returns `{ element, close }` |
| `tabs({ tabs, active })` | Returns `{ element, setActive }` — `tabs` is `[{ label, content }]` |
| `accordion({ items, multiple })` | Returns a collapsible list `<div>` — `items` is `[{ title, body }]` |
| `table({ columns, rows, striped })` | Returns a wrapped, styled `<table>` |
| `progress({ value, max, label })` | Returns `{ element, setValue(v) }` |
| `tooltip(target, text)` | Attaches a hover tooltip to an existing element |
| `spinner(size)` | Returns a spinning loader `<div>` |

### Utilities (`RG.utils`)

| Function | Description |
| --- | --- |
| `qs(sel, ctx)` / `qsa(sel, ctx)` | `querySelector` / `querySelectorAll`, the latter as a real array |
| `onReady(fn)` | Runs `fn` once the DOM is ready |
| `debounce(fn, wait)` | Delays calls until input goes quiet |
| `throttle(fn, limit)` | Caps how often `fn` can run |
| `clamp(n, min, max)` | Restricts a number to a range |
| `randomId(prefix)` | Short random DOM-safe id |
| `escapeHtml(str)` | Escapes text before injecting it as HTML |
| `formatDate(date, locale, opts)` | Locale-aware date formatting |
| `formatCurrency(amount, currency, locale)` | Locale-aware currency formatting |
| `copyToClipboard(text)` | Copies text, with a fallback for insecure contexts |
| `storage.get/set/remove(key, ...)` | JSON-safe `localStorage` wrapper |
| `deepClone(obj)` | Quick structural clone for plain JSON data |

Full interactive examples for every function above live on the
[docs page](https://randol696.github.io/cdn/), including copy-pasteable snippets.

## Deployment

Pushing to `main` triggers [`.github/workflows/static.yml`](.github/workflows/static.yml),
which publishes the entire repository root to GitHub Pages — no build step required.

## Adding something new

1. Add utilities to `js/rg-lib.js` under `RG.utils`, or new elements under `RG.ui`.
2. Add matching styles to `css/rg.css`, prefixed `.rg-*` to avoid clashing with
   consuming pages.
3. Add a demo block + snippet to `index.html` so the docs page stays the source
   of truth for what's available.
4. Push to `main` — Pages redeploys automatically.

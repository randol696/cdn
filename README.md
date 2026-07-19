# cdn

A personal CDN and library of UI elements, styles, and utility functions, served
straight from GitHub Pages so any project can pull them in with a couple of tags.
Glassmorphic, dark or light, five selectable accent skins — every color is a
CSS variable, and there's a built-in navbar + sidebar for building multi-page
docs sites like this one.

Live docs: **[randol696.github.io/cdn](https://randol696.github.io/cdn/)**

- [Overview](https://randol696.github.io/cdn/) — quick start, theming, skins, buttons, cards, alerts
- [Components](https://randol696.github.io/cdn/components.html) — toast, modal, tabs, accordion, table, progress, tooltip, avatar, skeleton, mobile patterns (bottom nav, FAB, bottom sheet), navbar/sidebar
- [Forms](https://randol696.github.io/cdn/forms.html) — text/phone inputs, select, checkbox, switch
- [Reference](https://randol696.github.io/cdn/reference.html) — full API tables

## What's in here

```text
css/
  rg.css          Design tokens (CSS variables, dark + light) + component styles — this is the library
  docs.css        Page chrome (starfield background, hero) for the docs site only
js/
  rg-lib.js       rg.ui.* element builders and rg.utils.* helper functions — this is the library
  docs.js         Builds the navbar/sidebar shell and wires up demos on the docs pages only
button.js         Original standalone snippet, kept for backward compatibility
index.html            Overview: quick start, theming, buttons, cards, alerts
components.html       Interactive components
forms.html            Form elements
reference.html        Full API reference tables
```

## Install

Drop these two tags into any page. No build step, no dependencies, no npm install.

```html
<link rel="stylesheet" href="https://randol696.github.io/cdn/css/rg.css">
<script src="https://randol696.github.io/cdn/js/rg-lib.js"></script>
```

That gives you a single global, `rg`, with two namespaces:

- `rg.ui.*` — functions that build and return DOM elements
- `rg.utils.*` — plain helper functions

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
  var btn = rg.ui.button({
    text: 'Save',
    variant: 'primary',           // primary | secondary | success | warning | info | danger | outline | ghost
    shape: 'rounded',             // pill (default) | rounded | square
    onClick: function () {
      rg.ui.toast('Saved!', { variant: 'success' });
    }
  });
  document.getElementById('app').appendChild(btn);
</script>
```

### Dark / light theme

Call `rg.utils.theme.init()` once, as early as possible (ideally right after
loading `rg-lib.js`, before the rest of the page renders), to restore whatever
theme the visitor last picked and avoid a flash of the wrong theme:

```html
<script src="https://randol696.github.io/cdn/js/rg-lib.js"></script>
<script>rg.utils.theme.init();</script>
```

Then flip it from anywhere, e.g. with the built-in toggle button:

```js
document.body.appendChild(rg.ui.themeToggle());
// or manually:
rg.utils.theme.toggle();          // dark <-> light
rg.utils.theme.set('light');
rg.utils.theme.get();             // 'dark' | 'light'
```

### Skins

Independent of the dark/light theme, `rg.utils.skin` controls the accent color
pair — five built in: `cyan` (default), `violet`, `emerald`, `amber`, `rose`.
Call `rg.utils.skin.init()` alongside `theme.init()` to restore the visitor's
last pick:

```html
<script>rg.utils.theme.init(); rg.utils.skin.init();</script>
```

```js
document.body.appendChild(rg.ui.skinPicker());  // ready-made swatch row
// or manually:
rg.utils.skin.set('violet');
rg.utils.skin.get();              // 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose'
```

### Navbar + sidebar

Both are plain functions that return elements — add `rg-with-navbar` /
`rg-with-sidebar` to `<body>` so the layout offsets apply:

```js
const sidebar = rg.ui.sidebar({
  sections: [{ title: 'Guide', links: [{ label: 'Getting started', href: '#', active: true }] }]
});
const navbar = rg.ui.navbar({
  brand: 'My App',
  links: [{ label: 'Home', href: '/', active: true }, { label: 'Docs', href: '/docs' }],
  actions: [rg.ui.themeToggle()],
  onToggle: () => sidebar.classList.toggle('rg-sidebar--open') // mobile hamburger
});

document.body.prepend(sidebar, navbar);
document.body.classList.add('rg-with-navbar', 'rg-with-sidebar');
```

### UI elements (`rg.ui`)

| Function | Description |
| --- | --- |
| `button({ text, variant, shape, onClick, className })` | Returns a `<button>` (`primary`, `secondary`, `success`, `warning`, `info`, `danger`, `outline`, `ghost`) |
| `card({ title, body, footer })` | Returns a glass card `<div>` |
| `badge(text, variant, { shape })` | Returns an inline pill with a glow dot |
| `alert({ title, body, variant, dismissible })` | Returns a dismissible banner (`default`, `success`, `warning`, `danger`) |
| `toast(message, { duration, variant })` | Appends a self-dismissing toast to the page |
| `modal({ title, body, onClose })` | Appends an overlay modal; returns `{ element, close }` |
| `tabs({ tabs, active })` | Returns `{ element, setActive }` — `tabs` is `[{ label, content }]` |
| `accordion({ items, multiple })` | Returns a collapsible list `<div>` — `items` is `[{ title, body }]` |
| `table({ columns, rows, striped, variant, shape })` | Returns a wrapped, styled `<table>` |
| `progress({ value, max, label })` | Returns `{ element, setValue(v) }` |
| `tooltip(target, text)` | Attaches a hover tooltip to an existing element |
| `spinner(size)` | Returns a spinning loader `<div>` |
| `input({ label, type, placeholder, value, onInput })` | Returns `{ element, input }` |
| `phoneInput({ label, placeholder, value, onChange })` | Auto-formats digits as `(555) 123-4567`; returns `{ element, input }` |
| `select({ label, options, value, onChange })` | Returns `{ element, select }` |
| `checkbox({ label, checked, onChange })` | Returns a styled `<label>` checkbox |
| `switchToggle({ label, checked, onChange })` | Returns `{ element, input }` |
| `themeToggle()` | Returns a sun/moon `<button>` wired to `rg.utils.theme` |
| `skinPicker({ skins })` | Returns a row of color swatches wired to `rg.utils.skin` |
| `navbar({ brand, brandHref, links, actions, onToggle, fixed })` | Returns a `<header>` top bar |
| `sidebar({ sections, fixed })` | Returns an `<aside>` nav drawer — `sections` is `[{ title, links }]` |
| `avatar({ src, initials, size, status })` | Returns a circular avatar, with an optional status dot (`online`, `busy`, `offline`) |
| `skeleton({ shape, width, height })` | Returns a shimmering loading placeholder (`text`, `circle`, `rect`) |
| `fab({ icon, variant, onClick, fixed })` | Returns a floating action button, fixed bottom-right by default |
| `bottomNav({ items, fixed })` | Returns a mobile tab bar, fixed to the bottom and visible only under 900px by default |
| `bottomSheet({ title, body, onClose })` | Appends a mobile-style sheet sliding up from the bottom; returns `{ element, close }` |

`shape` on `button`/`badge`/`table` is `pill` (default) / `rounded` / `square`. `fixed` on
`navbar`/`sidebar`/`fab`/`bottomNav` defaults to `true` (pinned to the viewport) —
pass `fixed: false` to render inline instead, e.g. for an embedded preview.

### Utilities (`rg.utils`)

| Function | Description |
| --- | --- |
| `qs(sel, ctx)` / `qsa(sel, ctx)` | `querySelector` / `querySelectorAll`, the latter as a real array |
| `onReady(fn)` | Runs `fn` once the DOM is ready |
| `debounce(fn, wait)` | Delays calls until input goes quiet |
| `throttle(fn, limit)` | Caps how often `fn` can run |
| `clamp(n, min, max)` | Restricts a number to a range |
| `randomId(prefix)` | Short random DOM-safe id |
| `uuid()` | RFC-4122-ish v4 UUID |
| `sleep(ms)` | Promise that resolves after `ms` |
| `groupBy(arr, key)` | Groups an array into an object, `key` a string or a function |
| `escapeHtml(str)` | Escapes text before injecting it as HTML |
| `truncate(str, len, suffix)` | Shortens a string, appending a suffix (default `…`) |
| `formatDate(date, locale, opts)` | Locale-aware date formatting |
| `formatNumber(n, locale)` | Locale-aware number formatting |
| `formatCurrency(amount, currency, locale)` | Locale-aware currency formatting |
| `getQueryParam(name)` | Reads a query-string parameter |
| `isMobile()` | `true` under a 768px viewport |
| `onOutsideClick(el, handler)` | Fires `handler` on clicks outside `el`; returns a teardown function |
| `copyToClipboard(text)` | Copies text, with a fallback for insecure contexts |
| `storage.get/set/remove(key, ...)` | JSON-safe `localStorage` wrapper |
| `deepClone(obj)` | Quick structural clone for plain JSON data |
| `theme.get() / set(name) / toggle() / init()` | Reads, applies, flips, or restores the dark/light theme |
| `skin.get() / set(name) / init()` | Reads, applies, or restores the accent color pair |

Full interactive examples for every function above live on the docs site —
see [Overview](https://randol696.github.io/cdn/), [Components](https://randol696.github.io/cdn/components.html),
[Forms](https://randol696.github.io/cdn/forms.html), and [Reference](https://randol696.github.io/cdn/reference.html).

## Deployment

Pushing to `main` triggers [`.github/workflows/static.yml`](.github/workflows/static.yml),
which publishes the entire repository root to GitHub Pages — no build step required.

## Adding something new

1. Add utilities to `js/rg-lib.js` under `rg.utils`, or new elements under `rg.ui`.
2. Add matching styles to `css/rg.css`, prefixed `.rg-*` to avoid clashing with
   consuming pages. Use the existing CSS variables (`--rg-accent`, `--rg-text`, …)
   so new components stay theme-aware automatically.
3. Add a demo block + snippet to whichever docs page fits best (or a new page,
   linked from the shared navbar in `js/docs.js`), so the docs site stays the
   source of truth for what's available.
4. Push to `main` — Pages redeploys automatically.

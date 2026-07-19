/*!
 * rg lib v1.4.0
 * A tiny, dependency-free utility & UI kit, served straight from this CDN.
 * https://randol696.github.io/cdn/
 *
 * Usage:
 *   <link rel="stylesheet" href="https://randol696.github.io/cdn/css/rg.css">
 *   <script src="https://randol696.github.io/cdn/js/rg-lib.js"></script>
 *   <script>rg.ui.button({ text: 'Hi' })</script>
 */
(function (global) {
  'use strict';

  var utils = {
    qs: function (sel, ctx) {
      return (ctx || document).querySelector(sel);
    },
    qsa: function (sel, ctx) {
      return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
    },
    onReady: function (fn) {
      if (document.readyState !== 'loading') fn();
      else document.addEventListener('DOMContentLoaded', fn);
    },
    debounce: function (fn, wait) {
      wait = wait || 250;
      var timer;
      return function () {
        var args = arguments, ctx = this;
        clearTimeout(timer);
        timer = setTimeout(function () { fn.apply(ctx, args); }, wait);
      };
    },
    throttle: function (fn, limit) {
      limit = limit || 250;
      var waiting = false;
      return function () {
        var args = arguments, ctx = this;
        if (!waiting) {
          fn.apply(ctx, args);
          waiting = true;
          setTimeout(function () { waiting = false; }, limit);
        }
      };
    },
    clamp: function (n, min, max) {
      return Math.min(Math.max(n, min), max);
    },
    randomId: function (prefix) {
      return (prefix || 'rg') + '-' + Math.random().toString(36).slice(2, 10);
    },
    escapeHtml: function (str) {
      var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
      return String(str).replace(/[&<>"']/g, function (c) { return map[c]; });
    },
    formatDate: function (date, locale, opts) {
      locale = locale || 'en-US';
      opts = opts || { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(date).toLocaleDateString(locale, opts);
    },
    formatCurrency: function (amount, currency, locale) {
      currency = currency || 'USD';
      locale = locale || 'en-US';
      return new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(amount);
    },
    copyToClipboard: function (text) {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
      }
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) { /* no-op */ }
      document.body.removeChild(ta);
      return Promise.resolve();
    },
    storage: {
      get: function (key, fallback) {
        try {
          var v = localStorage.getItem(key);
          return v ? JSON.parse(v) : (fallback === undefined ? null : fallback);
        } catch (e) {
          return fallback === undefined ? null : fallback;
        }
      },
      set: function (key, value) {
        try {
          localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch (e) {
          return false;
        }
      },
      remove: function (key) {
        localStorage.removeItem(key);
      }
    },
    deepClone: function (obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    uuid: function () {
      if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0;
        var v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    sleep: function (ms) {
      return new Promise(function (resolve) { setTimeout(resolve, ms); });
    },
    groupBy: function (arr, key) {
      var getKey = typeof key === 'function' ? key : function (item) { return item[key]; };
      return arr.reduce(function (acc, item) {
        var k = getKey(item);
        (acc[k] = acc[k] || []).push(item);
        return acc;
      }, {});
    },
    formatNumber: function (n, locale) {
      return new Intl.NumberFormat(locale || 'en-US').format(n);
    },
    truncate: function (str, len, suffix) {
      str = String(str);
      suffix = suffix === undefined ? '…' : suffix;
      return str.length > len ? str.slice(0, len).replace(/\s+$/, '') + suffix : str;
    },
    getQueryParam: function (name) {
      return new URLSearchParams(window.location.search).get(name);
    },
    isMobile: function () {
      return window.matchMedia('(max-width: 768px)').matches;
    },
    onOutsideClick: function (el, handler) {
      function listener(e) {
        if (!el.contains(e.target)) handler(e);
      }
      document.addEventListener('click', listener, true);
      return function () { document.removeEventListener('click', listener, true); };
    },
    theme: {
      STORAGE_KEY: 'rg-theme',
      get: function () {
        return document.documentElement.getAttribute('data-theme') || 'dark';
      },
      set: function (name) {
        document.documentElement.setAttribute('data-theme', name);
        utils.storage.set(utils.theme.STORAGE_KEY, name);
        document.dispatchEvent(new CustomEvent('rg:themechange', { detail: { theme: name } }));
      },
      toggle: function () {
        var next = utils.theme.get() === 'dark' ? 'light' : 'dark';
        utils.theme.set(next);
        return next;
      },
      init: function () {
        var saved = utils.storage.get(utils.theme.STORAGE_KEY, null);
        document.documentElement.setAttribute('data-theme', saved || 'dark');
      }
    },
    skin: {
      STORAGE_KEY: 'rg-skin',
      SKINS: ['cyan', 'violet', 'emerald', 'amber', 'rose'],
      get: function () {
        return document.documentElement.getAttribute('data-skin') || 'cyan';
      },
      set: function (name) {
        document.documentElement.setAttribute('data-skin', name);
        utils.storage.set(utils.skin.STORAGE_KEY, name);
        document.dispatchEvent(new CustomEvent('rg:skinchange', { detail: { skin: name } }));
      },
      init: function () {
        var saved = utils.storage.get(utils.skin.STORAGE_KEY, null);
        document.documentElement.setAttribute('data-skin', saved || 'cyan');
      }
    }
  };

  // UI builders. Every function returns a plain DOM element (or a small
  // handle object) ready to be appended wherever you need it — no
  // framework, no virtual DOM, no build step.
  var ui = {
    button: function (opts) {
      opts = opts || {};
      var btn = document.createElement('button');
      btn.type = opts.type || 'button';
      btn.textContent = opts.text || 'Click me';
      var classes = ['rg-btn', 'rg-btn--' + (opts.variant || 'primary')];
      if (opts.shape) classes.push('rg-shape-' + opts.shape);
      if (opts.className) classes.push(opts.className);
      btn.className = classes.join(' ');
      if (opts.onClick) btn.addEventListener('click', opts.onClick);
      return btn;
    },
    card: function (opts) {
      opts = opts || {};
      var card = document.createElement('div');
      card.className = 'rg-card';
      card.innerHTML =
        (opts.title ? '<div class="rg-card__title">' + opts.title + '</div>' : '') +
        '<div class="rg-card__body">' + (opts.body || '') + '</div>' +
        (opts.footer ? '<div class="rg-card__footer">' + opts.footer + '</div>' : '');
      return card;
    },
    badge: function (text, variant, opts) {
      opts = opts || {};
      var span = document.createElement('span');
      var classes = ['rg-badge', 'rg-badge--' + (variant || 'default')];
      if (opts.shape) classes.push('rg-shape-' + opts.shape);
      span.className = classes.join(' ');
      span.textContent = text || '';
      return span;
    },
    spinner: function (size) {
      var el = document.createElement('div');
      el.className = 'rg-spinner';
      var px = (size || 24) + 'px';
      el.style.width = px;
      el.style.height = px;
      return el;
    },
    toast: function (message, opts) {
      opts = opts || {};
      var duration = opts.duration || 3000;
      var container = document.querySelector('.rg-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'rg-toast-container';
        document.body.appendChild(container);
      }
      var toast = document.createElement('div');
      toast.className = 'rg-toast rg-toast--' + (opts.variant || 'default');
      toast.textContent = message;
      container.appendChild(toast);
      requestAnimationFrame(function () { toast.classList.add('rg-toast--visible'); });
      setTimeout(function () {
        toast.classList.remove('rg-toast--visible');
        toast.addEventListener('transitionend', function () { toast.remove(); }, { once: true });
      }, duration);
      return toast;
    },
    modal: function (opts) {
      opts = opts || {};
      var overlay = document.createElement('div');
      overlay.className = 'rg-modal-overlay';
      overlay.innerHTML =
        '<div class="rg-modal" role="dialog" aria-modal="true">' +
          '<div class="rg-modal__header">' +
            '<span>' + (opts.title || '') + '</span>' +
            '<button class="rg-modal__close" aria-label="Close">&times;</button>' +
          '</div>' +
          '<div class="rg-modal__body">' + (opts.body || '') + '</div>' +
        '</div>';
      function close() {
        overlay.remove();
        if (opts.onClose) opts.onClose();
      }
      overlay.querySelector('.rg-modal__close').addEventListener('click', close);
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close();
      });
      document.body.appendChild(overlay);
      return { element: overlay, close: close };
    },
    table: function (opts) {
      opts = opts || {};
      var columns = opts.columns || [];
      var rows = opts.rows || [];
      var wrap = document.createElement('div');
      var wrapClasses = ['rg-table-wrap'];
      if (opts.variant) wrapClasses.push('rg-table-wrap--' + opts.variant);
      if (opts.shape) wrapClasses.push('rg-shape-' + opts.shape);
      wrap.className = wrapClasses.join(' ');
      var table = document.createElement('table');
      table.className = 'rg-table' + (opts.striped ? ' rg-table--striped' : '');

      var thead = document.createElement('thead');
      var headRow = document.createElement('tr');
      columns.forEach(function (col) {
        var th = document.createElement('th');
        th.textContent = col.label;
        headRow.appendChild(th);
      });
      thead.appendChild(headRow);

      var tbody = document.createElement('tbody');
      rows.forEach(function (row) {
        var tr = document.createElement('tr');
        columns.forEach(function (col) {
          var td = document.createElement('td');
          td.textContent = row[col.key];
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      table.appendChild(thead);
      table.appendChild(tbody);
      wrap.appendChild(table);
      return wrap;
    },
    tabs: function (opts) {
      opts = opts || {};
      var items = opts.tabs || [];
      var activeIndex = opts.active || 0;
      var root = document.createElement('div');
      root.className = 'rg-tabs';
      var list = document.createElement('div');
      list.className = 'rg-tabs__list';
      var panels = document.createElement('div');
      panels.className = 'rg-tabs__panels';
      var tabEls = [];
      var panelEls = [];

      function setActive(index) {
        activeIndex = index;
        tabEls.forEach(function (el, i) { el.classList.toggle('rg-tabs__tab--active', i === index); });
        panelEls.forEach(function (el, i) { el.classList.toggle('rg-tabs__panel--active', i === index); });
      }

      items.forEach(function (item, i) {
        var tabBtn = document.createElement('button');
        tabBtn.type = 'button';
        tabBtn.className = 'rg-tabs__tab' + (i === activeIndex ? ' rg-tabs__tab--active' : '');
        tabBtn.textContent = item.label;
        tabBtn.addEventListener('click', function () { setActive(i); });
        list.appendChild(tabBtn);
        tabEls.push(tabBtn);

        var panel = document.createElement('div');
        panel.className = 'rg-tabs__panel' + (i === activeIndex ? ' rg-tabs__panel--active' : '');
        if (typeof item.content === 'string') panel.innerHTML = item.content;
        else if (item.content) panel.appendChild(item.content);
        panels.appendChild(panel);
        panelEls.push(panel);
      });

      root.appendChild(list);
      root.appendChild(panels);
      return { element: root, setActive: setActive };
    },
    accordion: function (opts) {
      opts = opts || {};
      var items = opts.items || [];
      var multiple = !!opts.multiple;
      var root = document.createElement('div');
      root.className = 'rg-accordion';
      var itemEls = [];

      items.forEach(function (item) {
        var itemEl = document.createElement('div');
        itemEl.className = 'rg-accordion__item';

        var header = document.createElement('button');
        header.type = 'button';
        header.className = 'rg-accordion__header';
        header.innerHTML = '<span>' + item.title + '</span><span class="rg-accordion__icon">&#9662;</span>';

        var body = document.createElement('div');
        body.className = 'rg-accordion__body';
        var bodyInner = document.createElement('div');
        bodyInner.className = 'rg-accordion__body-inner';
        if (typeof item.body === 'string') bodyInner.innerHTML = item.body;
        else if (item.body) bodyInner.appendChild(item.body);
        body.appendChild(bodyInner);

        header.addEventListener('click', function () {
          var isOpen = itemEl.classList.contains('rg-accordion__item--open');
          if (!multiple) {
            itemEls.forEach(function (other) {
              if (other !== itemEl) {
                other.classList.remove('rg-accordion__item--open');
                other.querySelector('.rg-accordion__body').style.maxHeight = null;
              }
            });
          }
          if (isOpen) {
            itemEl.classList.remove('rg-accordion__item--open');
            body.style.maxHeight = null;
          } else {
            itemEl.classList.add('rg-accordion__item--open');
            body.style.maxHeight = body.scrollHeight + 'px';
          }
        });

        itemEl.appendChild(header);
        itemEl.appendChild(body);
        root.appendChild(itemEl);
        itemEls.push(itemEl);
      });

      return root;
    },
    alert: function (opts) {
      opts = opts || {};
      var el = document.createElement('div');
      el.className = 'rg-alert' + (opts.variant ? ' rg-alert--' + opts.variant : '');
      var content = document.createElement('div');
      content.innerHTML =
        (opts.title ? '<div class="rg-alert__title">' + opts.title + '</div>' : '') +
        '<div class="rg-alert__body">' + (opts.body || '') + '</div>';
      el.appendChild(content);
      if (opts.dismissible !== false) {
        var close = document.createElement('button');
        close.type = 'button';
        close.className = 'rg-alert__close';
        close.innerHTML = '&times;';
        close.setAttribute('aria-label', 'Dismiss');
        close.addEventListener('click', function () { el.remove(); });
        el.appendChild(close);
      }
      return el;
    },
    progress: function (opts) {
      opts = opts || {};
      var max = opts.max || 100;
      var value = utils.clamp(opts.value || 0, 0, max);
      var root = document.createElement('div');
      root.className = 'rg-progress';

      var label = document.createElement('div');
      label.className = 'rg-progress__label';
      var labelText = document.createElement('span');
      labelText.textContent = opts.label || '';
      var pct = document.createElement('span');

      var track = document.createElement('div');
      track.className = 'rg-progress__track';
      var bar = document.createElement('div');
      bar.className = 'rg-progress__bar';

      function render() {
        var percent = Math.round((value / max) * 100);
        bar.style.width = percent + '%';
        pct.textContent = percent + '%';
      }

      label.appendChild(labelText);
      label.appendChild(pct);
      track.appendChild(bar);
      root.appendChild(label);
      root.appendChild(track);
      render();

      function setValue(v) {
        value = utils.clamp(v, 0, max);
        render();
      }

      return { element: root, setValue: setValue };
    },
    tooltip: function (target, text) {
      target.classList.add('rg-tooltip');
      var bubble = document.createElement('span');
      bubble.className = 'rg-tooltip__bubble';
      bubble.textContent = text;
      target.appendChild(bubble);
      return bubble;
    },
    input: function (opts) {
      opts = opts || {};
      var wrap = document.createElement('div');
      wrap.className = 'rg-field';
      var id = opts.id || utils.randomId('rg-input');
      if (opts.label) {
        var label = document.createElement('label');
        label.className = 'rg-field__label';
        label.setAttribute('for', id);
        label.textContent = opts.label;
        wrap.appendChild(label);
      }
      var input = document.createElement('input');
      input.className = 'rg-field__control';
      input.type = opts.type || 'text';
      input.id = id;
      if (opts.placeholder) input.placeholder = opts.placeholder;
      if (opts.value !== undefined) input.value = opts.value;
      if (opts.onInput) input.addEventListener('input', function (e) { opts.onInput(e.target.value, e); });
      wrap.appendChild(input);
      return { element: wrap, input: input };
    },
    phoneInput: function (opts) {
      opts = opts || {};
      var field = ui.input({
        label: opts.label || 'Phone',
        type: 'tel',
        placeholder: opts.placeholder || '(555) 123-4567',
        value: opts.value || '',
        id: opts.id
      });
      var input = field.input;
      input.addEventListener('input', function () {
        var digits = input.value.replace(/\D/g, '').slice(0, 10);
        var formatted = digits;
        if (digits.length > 6) formatted = '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6);
        else if (digits.length > 3) formatted = '(' + digits.slice(0, 3) + ') ' + digits.slice(3);
        else if (digits.length > 0) formatted = '(' + digits;
        input.value = formatted;
        if (opts.onChange) opts.onChange(formatted, digits);
      });
      return field;
    },
    select: function (opts) {
      opts = opts || {};
      var wrap = document.createElement('div');
      wrap.className = 'rg-field';
      var id = opts.id || utils.randomId('rg-select');
      if (opts.label) {
        var label = document.createElement('label');
        label.className = 'rg-field__label';
        label.setAttribute('for', id);
        label.textContent = opts.label;
        wrap.appendChild(label);
      }
      var select = document.createElement('select');
      select.className = 'rg-field__control';
      select.id = id;
      (opts.options || []).forEach(function (opt) {
        var option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        if (opt.value === opts.value) option.selected = true;
        select.appendChild(option);
      });
      if (opts.onChange) select.addEventListener('change', function (e) { opts.onChange(e.target.value, e); });
      wrap.appendChild(select);
      return { element: wrap, select: select };
    },
    checkbox: function (opts) {
      opts = opts || {};
      var label = document.createElement('label');
      label.className = 'rg-checkbox';
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = !!opts.checked;
      if (opts.onChange) input.addEventListener('change', function (e) { opts.onChange(e.target.checked, e); });
      var box = document.createElement('span');
      box.className = 'rg-checkbox__box';
      var text = document.createElement('span');
      text.className = 'rg-checkbox__label';
      text.textContent = opts.label || '';
      label.appendChild(input);
      label.appendChild(box);
      label.appendChild(text);
      return label;
    },
    switchToggle: function (opts) {
      opts = opts || {};
      var label = document.createElement('label');
      label.className = 'rg-switch';
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = !!opts.checked;
      if (opts.onChange) input.addEventListener('change', function (e) { opts.onChange(e.target.checked, e); });
      var track = document.createElement('span');
      track.className = 'rg-switch__track';
      label.appendChild(input);
      label.appendChild(track);
      if (opts.label) {
        var text = document.createElement('span');
        text.className = 'rg-switch__label';
        text.textContent = opts.label;
        label.appendChild(text);
      }
      return { element: label, input: input };
    },
    themeToggle: function () {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rg-theme-toggle';
      function render() {
        var isDark = utils.theme.get() === 'dark';
        btn.textContent = isDark ? '☀️' : '🌙';
        btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      }
      btn.addEventListener('click', function () {
        utils.theme.toggle();
        render();
      });
      render();
      return btn;
    },
    skinPicker: function (opts) {
      opts = opts || {};
      var skins = opts.skins || utils.skin.SKINS;
      var wrap = document.createElement('div');
      wrap.className = 'rg-skin-picker';

      function render() {
        wrap.innerHTML = '';
        var current = utils.skin.get();
        skins.forEach(function (name) {
          var swatch = document.createElement('button');
          swatch.type = 'button';
          swatch.className = 'rg-skin-swatch rg-skin-swatch--' + name + (name === current ? ' rg-skin-swatch--active' : '');
          swatch.setAttribute('aria-label', 'Switch to the ' + name + ' skin');
          swatch.addEventListener('click', function () {
            utils.skin.set(name);
            render();
          });
          wrap.appendChild(swatch);
        });
      }

      render();
      return wrap;
    },
    navbar: function (opts) {
      opts = opts || {};
      var nav = document.createElement('header');
      nav.className = 'rg-navbar' + (opts.fixed === false ? '' : ' rg-navbar--fixed');

      var brand = document.createElement('a');
      brand.className = 'rg-navbar__brand';
      brand.href = opts.brandHref || '#';
      brand.textContent = opts.brand || 'rg';

      var links = document.createElement('nav');
      links.className = 'rg-navbar__links';
      (opts.links || []).forEach(function (link) {
        var a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.label;
        a.className = 'rg-navbar__link' + (link.active ? ' rg-navbar__link--active' : '');
        links.appendChild(a);
      });

      var actions = document.createElement('div');
      actions.className = 'rg-navbar__actions';
      (opts.actions || []).forEach(function (el) { actions.appendChild(el); });

      var toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'rg-navbar__toggle';
      toggle.setAttribute('aria-label', 'Toggle menu');
      toggle.innerHTML = '&#9776;';
      if (opts.onToggle) toggle.addEventListener('click', opts.onToggle);

      nav.appendChild(brand);
      nav.appendChild(links);
      nav.appendChild(actions);
      nav.appendChild(toggle);
      return nav;
    },
    sidebar: function (opts) {
      opts = opts || {};
      var aside = document.createElement('aside');
      aside.className = 'rg-sidebar' + (opts.fixed === false ? '' : ' rg-sidebar--fixed');

      (opts.sections || []).forEach(function (section) {
        var sec = document.createElement('div');
        sec.className = 'rg-sidebar__section';
        if (section.title) {
          var title = document.createElement('div');
          title.className = 'rg-sidebar__title';
          title.textContent = section.title;
          sec.appendChild(title);
        }
        (section.links || []).forEach(function (link) {
          var a = document.createElement('a');
          a.href = link.href;
          a.textContent = link.label;
          a.className = 'rg-sidebar__link' + (link.active ? ' rg-sidebar__link--active' : '');
          sec.appendChild(a);
        });
        aside.appendChild(sec);
      });

      return aside;
    },
    avatar: function (opts) {
      opts = opts || {};
      var size = opts.size || 40;
      var el = document.createElement('div');
      el.className = 'rg-avatar';
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.fontSize = Math.round(size * 0.4) + 'px';
      if (opts.src) {
        var img = document.createElement('img');
        img.src = opts.src;
        img.alt = opts.alt || '';
        el.appendChild(img);
      } else {
        var initials = document.createElement('span');
        initials.textContent = (opts.initials || '?').slice(0, 2).toUpperCase();
        el.appendChild(initials);
      }
      if (opts.status) {
        var dot = document.createElement('span');
        dot.className = 'rg-avatar__status rg-avatar__status--' + opts.status;
        el.appendChild(dot);
      }
      return el;
    },
    skeleton: function (opts) {
      opts = opts || {};
      var el = document.createElement('div');
      el.className = 'rg-skeleton rg-skeleton--' + (opts.shape || 'text');
      if (opts.width) el.style.width = typeof opts.width === 'number' ? opts.width + 'px' : opts.width;
      if (opts.height) el.style.height = typeof opts.height === 'number' ? opts.height + 'px' : opts.height;
      return el;
    },
    fab: function (opts) {
      opts = opts || {};
      var btn = document.createElement('button');
      btn.type = 'button';
      var classes = ['rg-fab', 'rg-fab--' + (opts.variant || 'primary')];
      if (opts.fixed === false) classes.push('rg-fab--static');
      btn.className = classes.join(' ');
      btn.textContent = opts.icon || '+';
      btn.setAttribute('aria-label', opts.label || 'Action');
      if (opts.onClick) btn.addEventListener('click', opts.onClick);
      return btn;
    },
    bottomNav: function (opts) {
      opts = opts || {};
      var nav = document.createElement('nav');
      nav.className = 'rg-bottom-nav' + (opts.fixed === false ? ' rg-bottom-nav--static' : '');
      (opts.items || []).forEach(function (item) {
        var a = document.createElement('a');
        a.href = item.href || '#';
        a.className = 'rg-bottom-nav__item' + (item.active ? ' rg-bottom-nav__item--active' : '');
        a.innerHTML =
          '<span class="rg-bottom-nav__icon">' + (item.icon || '') + '</span>' +
          '<span class="rg-bottom-nav__label">' + (item.label || '') + '</span>';
        nav.appendChild(a);
      });
      return nav;
    },
    bottomSheet: function (opts) {
      opts = opts || {};
      var overlay = document.createElement('div');
      overlay.className = 'rg-sheet-overlay';
      overlay.innerHTML =
        '<div class="rg-sheet" role="dialog" aria-modal="true">' +
          '<div class="rg-sheet__handle"></div>' +
          (opts.title ? '<div class="rg-sheet__header">' + opts.title + '</div>' : '') +
          '<div class="rg-sheet__body">' + (opts.body || '') + '</div>' +
        '</div>';
      function close() {
        overlay.classList.remove('rg-sheet-overlay--visible');
        setTimeout(function () {
          overlay.remove();
          if (opts.onClose) opts.onClose();
        }, 250);
      }
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close();
      });
      document.body.appendChild(overlay);
      requestAnimationFrame(function () { overlay.classList.add('rg-sheet-overlay--visible'); });
      return { element: overlay, close: close };
    }
  };

  global.rg = { utils: utils, ui: ui, version: '1.4.0' };
})(window);

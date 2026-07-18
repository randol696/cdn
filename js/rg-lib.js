/*!
 * RG Lib v1.1.0
 * A tiny, dependency-free utility & UI kit, served straight from this CDN.
 * https://randol696.github.io/cdn/
 *
 * Usage:
 *   <link rel="stylesheet" href="https://randol696.github.io/cdn/css/rg.css">
 *   <script src="https://randol696.github.io/cdn/js/rg-lib.js"></script>
 *   <script>RG.ui.button({ text: 'Hi' })</script>
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
    }
  };

  // UI builders. Every function returns a plain DOM element (or a small
  // handle object) ready to be appended wherever you need it — no
  // framework, no virtual DOM, no build step.
  var ui = {
    button: function (opts) {
      opts = opts || {};
      var btn = document.createElement('button');
      btn.textContent = opts.text || 'Click me';
      btn.className = ('rg-btn rg-btn--' + (opts.variant || 'primary') + ' ' + (opts.className || '')).trim();
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
    badge: function (text, variant) {
      var span = document.createElement('span');
      span.className = 'rg-badge rg-badge--' + (variant || 'default');
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
      wrap.className = 'rg-table-wrap';
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
    }
  };

  global.RG = { utils: utils, ui: ui, version: '1.1.0' };
})(window);

/*!
 * Docs page wiring for index.html — demo glue code, not part of RG Lib.
 */
RG.utils.onReady(function () {
  // Buttons
  var buttonDemo = document.getElementById('button-demo');
  ['primary', 'secondary', 'danger', 'outline'].forEach(function (variant) {
    buttonDemo.appendChild(RG.ui.button({
      text: variant.charAt(0).toUpperCase() + variant.slice(1),
      variant: variant
    }));
  });

  // Card + badge
  var cardDemo = document.getElementById('card-demo');
  var card = RG.ui.card({
    title: 'Deploy status',
    body: 'Last build finished without errors.',
    footer: 'Updated just now'
  });
  card.querySelector('.rg-card__footer').appendChild(document.createTextNode(' '));
  card.querySelector('.rg-card__footer').appendChild(RG.ui.badge('online', 'success'));
  cardDemo.appendChild(card);

  // Alerts
  var alertDemo = document.getElementById('alert-demo');
  alertDemo.appendChild(RG.ui.alert({
    title: 'Heads up',
    body: 'This banner stays until dismissed.',
    variant: 'warning'
  }));
  alertDemo.appendChild(RG.ui.alert({
    title: 'Deployed',
    body: 'The latest build is live on all edges.',
    variant: 'success'
  }));

  // Toast
  document.getElementById('toast-demo').appendChild(
    RG.ui.button({
      text: 'Show toast',
      variant: 'primary',
      onClick: function () { RG.ui.toast('Saved!', { variant: 'success', duration: 2500 }); }
    })
  );

  // Modal
  document.getElementById('modal-demo').appendChild(
    RG.ui.button({
      text: 'Open modal',
      variant: 'secondary',
      onClick: function () {
        RG.ui.modal({
          title: 'Confirm',
          body: 'Are you sure you want to continue?'
        });
      }
    })
  );

  // Tabs
  var tabs = RG.ui.tabs({
    tabs: [
      { label: 'Overview', content: '<p>Mission status: nominal.</p>' },
      { label: 'Telemetry', content: '<p>Uplink stable at 220 Mbps.</p>' },
      { label: 'Logs', content: '<p>No anomalies in the last 24h.</p>' }
    ]
  });
  document.getElementById('tabs-demo').appendChild(tabs.element);

  // Accordion
  var accordion = RG.ui.accordion({
    items: [
      { title: 'What is this?', body: 'A dependency-free UI kit served from GitHub Pages.' },
      { title: 'How do I install it?', body: 'Two tags — see Quick start above.' },
      { title: 'Can I self-host it?', body: 'Yes, fork the repo and point at your own Pages URL.' }
    ]
  });
  document.getElementById('accordion-demo').appendChild(accordion);

  // Table
  var table = RG.ui.table({
    striped: true,
    columns: [
      { key: 'name', label: 'Satellite' },
      { key: 'status', label: 'Status' },
      { key: 'orbit', label: 'Orbit' }
    ],
    rows: [
      { name: 'RG-1', status: 'Online', orbit: 'LEO' },
      { name: 'RG-2', status: 'Online', orbit: 'LEO' },
      { name: 'RG-3', status: 'Standby', orbit: 'MEO' }
    ]
  });
  document.getElementById('table-demo').appendChild(table);

  // Progress
  var progressDemo = document.getElementById('progress-demo');
  var progressValue = 40;
  var progress = RG.ui.progress({ label: 'Deploying…', value: progressValue });
  progressDemo.appendChild(progress.element);

  var progressControls = document.getElementById('progress-controls');
  progressControls.appendChild(RG.ui.button({
    text: '-10%',
    variant: 'outline',
    onClick: function () { progressValue -= 10; progress.setValue(progressValue); }
  }));
  progressControls.appendChild(RG.ui.button({
    text: '+10%',
    variant: 'outline',
    onClick: function () { progressValue += 10; progress.setValue(progressValue); }
  }));

  // Tooltip
  var tooltipBtn = RG.ui.button({ text: 'Hover me', variant: 'secondary' });
  RG.ui.tooltip(tooltipBtn, 'This is a tooltip');
  document.getElementById('tooltip-demo').appendChild(tooltipBtn);

  // Spinner
  document.getElementById('spinner-demo').appendChild(RG.ui.spinner(32));

  // Debounced search
  var searchInput = document.getElementById('search-input');
  var searchOutput = document.getElementById('search-output');
  var search = RG.utils.debounce(function (value) {
    searchOutput.textContent = value ? 'Searching for: "' + RG.utils.escapeHtml(value) + '"' : 'Waiting for input…';
  }, 400);
  searchInput.addEventListener('input', function (e) { search(e.target.value); });

  // Copy to clipboard
  document.getElementById('copy-demo').appendChild(
    RG.ui.button({
      text: 'Copy page URL',
      variant: 'outline',
      onClick: function () {
        RG.utils.copyToClipboard(window.location.href);
        RG.ui.toast('URL copied to clipboard', { variant: 'primary' });
      }
    })
  );

  // Utils reference table, built with RG.ui.table itself
  document.getElementById('utils-reference').appendChild(RG.ui.table({
    columns: [
      { key: 'fn', label: 'Function' },
      { key: 'desc', label: 'What it does' }
    ],
    rows: [
      { fn: 'RG.utils.qs / qsa', desc: 'Shorthand for querySelector / querySelectorAll, returns a real array' },
      { fn: 'RG.utils.onReady(fn)', desc: 'Runs fn once the DOM is ready' },
      { fn: 'RG.utils.debounce(fn, wait)', desc: 'Delays calls until input goes quiet' },
      { fn: 'RG.utils.throttle(fn, limit)', desc: 'Caps how often fn can run' },
      { fn: 'RG.utils.clamp(n, min, max)', desc: 'Restricts a number to a range' },
      { fn: 'RG.utils.randomId(prefix)', desc: 'Short random DOM-safe id' },
      { fn: 'RG.utils.escapeHtml(str)', desc: 'Escapes user text before injecting as HTML' },
      { fn: 'RG.utils.formatDate(date, locale, opts)', desc: 'Locale-aware date formatting' },
      { fn: 'RG.utils.formatCurrency(amount, currency, locale)', desc: 'Locale-aware currency formatting' },
      { fn: 'RG.utils.copyToClipboard(text)', desc: 'Copies text, with a fallback for insecure contexts' },
      { fn: 'RG.utils.storage.get/set/remove', desc: 'JSON-safe localStorage wrapper' },
      { fn: 'RG.utils.deepClone(obj)', desc: 'Quick structural clone for plain JSON data' }
    ]
  }));

  // Component reference table
  document.getElementById('components-reference').appendChild(RG.ui.table({
    columns: [
      { key: 'fn', label: 'Function' },
      { key: 'desc', label: 'What it does' }
    ],
    rows: [
      { fn: 'RG.ui.button({ text, variant, onClick, className })', desc: 'Returns a <button>' },
      { fn: 'RG.ui.card({ title, body, footer })', desc: 'Returns a glass card <div>' },
      { fn: 'RG.ui.badge(text, variant)', desc: 'Returns an inline pill with a glow dot' },
      { fn: 'RG.ui.alert({ title, body, variant, dismissible })', desc: 'Returns a dismissible banner' },
      { fn: 'RG.ui.toast(message, { duration, variant })', desc: 'Appends a self-dismissing toast' },
      { fn: 'RG.ui.modal({ title, body, onClose })', desc: 'Appends an overlay modal; returns { element, close }' },
      { fn: 'RG.ui.tabs({ tabs, active })', desc: 'Returns { element, setActive }' },
      { fn: 'RG.ui.accordion({ items, multiple })', desc: 'Returns a collapsible list <div>' },
      { fn: 'RG.ui.table({ columns, rows, striped })', desc: 'Returns a wrapped, styled <table>' },
      { fn: 'RG.ui.progress({ value, max, label })', desc: 'Returns { element, setValue }' },
      { fn: 'RG.ui.tooltip(target, text)', desc: 'Attaches a hover tooltip to an existing element' },
      { fn: 'RG.ui.spinner(size)', desc: 'Returns a spinning loader <div>' }
    ]
  }));
});

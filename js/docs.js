/*!
 * Shared docs-site chrome (navbar/sidebar/theme toggle) + per-page demo
 * wiring for index/components/forms/reference.html. Not part of rg lib.
 */
(function () {
  var PAGES = [
    { key: 'index', label: 'Overview', href: 'index.html' },
    { key: 'components', label: 'Components', href: 'components.html' },
    { key: 'forms', label: 'Forms', href: 'forms.html' },
    { key: 'reference', label: 'Reference', href: 'reference.html' }
  ];

  var SIDEBARS = {
    index: [
      { title: 'Get started', links: [{ label: 'Quick start', href: '#quick-start' }, { label: 'Theming', href: '#theming' }] },
      { title: 'Core', links: [{ label: 'Buttons', href: '#buttons' }, { label: 'Card & badge', href: '#card-badge' }, { label: 'Alerts', href: '#alerts' }, { label: 'Legacy snippet', href: '#legacy' }] }
    ],
    components: [
      { title: 'Feedback', links: [{ label: 'Toast', href: '#toast' }, { label: 'Modal', href: '#modal' }] },
      { title: 'Navigation', links: [{ label: 'Tabs', href: '#tabs' }, { label: 'Accordion', href: '#accordion' }, { label: 'Navbar & sidebar', href: '#navbar-sidebar' }] },
      { title: 'Data', links: [{ label: 'Table', href: '#table' }, { label: 'Progress', href: '#progress' }] },
      { title: 'Other', links: [{ label: 'Tooltip', href: '#tooltip' }, { label: 'Spinner', href: '#spinner' }, { label: 'Avatar', href: '#avatar' }, { label: 'Skeleton loader', href: '#skeleton' }] },
      { title: 'Mobile', links: [{ label: 'Bottom navigation', href: '#bottom-nav' }, { label: 'Floating action button', href: '#fab' }, { label: 'Bottom sheet', href: '#bottom-sheet' }] }
    ],
    forms: [
      { title: 'Fields', links: [{ label: 'Text input', href: '#text-input' }, { label: 'Phone input', href: '#phone-input' }, { label: 'Select', href: '#select' }, { label: 'Checkbox', href: '#checkbox' }, { label: 'Switch', href: '#switch' }] },
      { title: 'Utilities demo', links: [{ label: 'Debounced search', href: '#debounced-search' }, { label: 'Copy to clipboard', href: '#copy-clipboard' }] }
    ],
    reference: [
      { title: 'Docs', links: [{ label: 'Utilities', href: '#utils' }, { label: 'Components', href: '#components' }] }
    ]
  };

  rg.utils.onReady(function () {
    buildShell();
    wireIndexDemos();
    wireComponentsDemos();
    wireFormsDemos();
    wireReferenceDemos();
  });

  function buildShell() {
    var currentPage = document.body.getAttribute('data-page') || 'index';

    var navLinks = PAGES.map(function (p) {
      return { label: p.label, href: p.href, active: p.key === currentPage };
    });

    var githubLink = document.createElement('a');
    githubLink.href = 'https://github.com/randol696/cdn';
    githubLink.target = '_blank';
    githubLink.rel = 'noopener';
    githubLink.className = 'rg-btn rg-btn--ghost rg-shape-rounded';
    githubLink.textContent = 'GitHub ↗';

    var sidebar = rg.ui.sidebar({ sections: SIDEBARS[currentPage] || [] });

    var backdrop = document.createElement('div');
    backdrop.className = 'rg-sidebar-backdrop';

    function openSidebar() {
      sidebar.classList.add('rg-sidebar--open');
      backdrop.classList.add('rg-sidebar-backdrop--visible');
    }
    function closeSidebar() {
      sidebar.classList.remove('rg-sidebar--open');
      backdrop.classList.remove('rg-sidebar-backdrop--visible');
    }
    function toggleSidebar() {
      if (sidebar.classList.contains('rg-sidebar--open')) closeSidebar();
      else openSidebar();
    }

    var navbar = rg.ui.navbar({
      brand: 'rg cdn',
      brandHref: 'index.html',
      links: navLinks,
      actions: [githubLink, rg.ui.skinPicker(), rg.ui.themeToggle()],
      onToggle: toggleSidebar
    });

    backdrop.addEventListener('click', closeSidebar);
    sidebar.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeSidebar();
    });

    document.body.classList.add('rg-with-navbar', 'rg-with-sidebar');
    document.body.insertBefore(backdrop, document.body.firstChild);
    document.body.insertBefore(sidebar, document.body.firstChild);
    document.body.insertBefore(navbar, document.body.firstChild);
  }

  // ---------- index.html ----------
  function wireIndexDemos() {
    var themeDemo = document.getElementById('theme-demo');
    if (themeDemo) {
      themeDemo.appendChild(rg.ui.themeToggle());
      var themeLabel = document.createElement('span');
      themeLabel.textContent = 'Click the icon — same toggle as the one in the navbar.';
      themeDemo.appendChild(themeLabel);
    }

    var skinDemo = document.getElementById('skin-demo');
    if (skinDemo) {
      skinDemo.appendChild(rg.ui.skinPicker());
      var skinLabel = document.createElement('span');
      skinLabel.textContent = 'Cyan, violet, emerald, amber, rose — pick one.';
      skinDemo.appendChild(skinLabel);
    }

    var buttonDemo = document.getElementById('button-demo');
    if (buttonDemo) {
      ['primary', 'success', 'warning', 'info', 'danger', 'outline', 'ghost'].forEach(function (variant) {
        buttonDemo.appendChild(rg.ui.button({
          text: variant.charAt(0).toUpperCase() + variant.slice(1),
          variant: variant
        }));
      });
    }

    var buttonShapeDemo = document.getElementById('button-shape-demo');
    if (buttonShapeDemo) {
      ['pill', 'rounded', 'square'].forEach(function (shape) {
        buttonShapeDemo.appendChild(rg.ui.button({
          text: shape.charAt(0).toUpperCase() + shape.slice(1),
          variant: 'secondary',
          shape: shape === 'pill' ? undefined : shape
        }));
      });
    }

    var cardDemo = document.getElementById('card-demo');
    if (cardDemo) {
      var card = rg.ui.card({
        title: 'Deploy status',
        body: 'Last build finished without errors.',
        footer: 'Updated just now'
      });
      card.querySelector('.rg-card__footer').appendChild(document.createTextNode(' '));
      card.querySelector('.rg-card__footer').appendChild(rg.ui.badge('online', 'success'));
      cardDemo.appendChild(card);
    }

    var alertDemo = document.getElementById('alert-demo');
    if (alertDemo) {
      alertDemo.appendChild(rg.ui.alert({
        title: 'Heads up',
        body: 'This banner stays until dismissed.',
        variant: 'warning'
      }));
      alertDemo.appendChild(rg.ui.alert({
        title: 'Deployed',
        body: 'The latest build is live on all edges.',
        variant: 'success'
      }));
    }
  }

  // ---------- components.html ----------
  function wireComponentsDemos() {
    var toastDemo = document.getElementById('toast-demo');
    if (toastDemo) {
      toastDemo.appendChild(rg.ui.button({
        text: 'Show toast',
        variant: 'primary',
        onClick: function () { rg.ui.toast('Saved!', { variant: 'success', duration: 2500 }); }
      }));
    }

    var modalDemo = document.getElementById('modal-demo');
    if (modalDemo) {
      modalDemo.appendChild(rg.ui.button({
        text: 'Open modal',
        variant: 'secondary',
        onClick: function () {
          rg.ui.modal({ title: 'Confirm', body: 'Are you sure you want to continue?' });
        }
      }));
    }

    var tabsDemo = document.getElementById('tabs-demo');
    if (tabsDemo) {
      var tabs = rg.ui.tabs({
        tabs: [
          { label: 'Overview', content: '<p>Mission status: nominal.</p>' },
          { label: 'Telemetry', content: '<p>Uplink stable at 220 Mbps.</p>' },
          { label: 'Logs', content: '<p>No anomalies in the last 24h.</p>' }
        ]
      });
      tabsDemo.appendChild(tabs.element);
    }

    var accordionDemo = document.getElementById('accordion-demo');
    if (accordionDemo) {
      accordionDemo.appendChild(rg.ui.accordion({
        items: [
          { title: 'What is this?', body: 'A dependency-free UI kit served from GitHub Pages.' },
          { title: 'How do I install it?', body: 'Two tags — see Quick start on the Overview page.' },
          { title: 'Can I self-host it?', body: 'Yes, fork the repo and point at your own Pages URL.' }
        ]
      }));
    }

    var tableDemo = document.getElementById('table-demo');
    if (tableDemo) {
      tableDemo.appendChild(rg.ui.table({
        striped: true,
        variant: 'info',
        columns: [
          { key: 'name', label: 'Satellite' },
          { key: 'status', label: 'Status' },
          { key: 'orbit', label: 'Orbit' }
        ],
        rows: [
          { name: 'rg-1', status: 'Online', orbit: 'LEO' },
          { name: 'rg-2', status: 'Online', orbit: 'LEO' },
          { name: 'rg-3', status: 'Standby', orbit: 'MEO' }
        ]
      }));
    }

    var progressDemo = document.getElementById('progress-demo');
    if (progressDemo) {
      var progressValue = 40;
      var progress = rg.ui.progress({ label: 'Deploying…', value: progressValue });
      progressDemo.appendChild(progress.element);

      var progressControls = document.getElementById('progress-controls');
      progressControls.appendChild(rg.ui.button({
        text: '-10%',
        variant: 'outline',
        onClick: function () { progressValue -= 10; progress.setValue(progressValue); }
      }));
      progressControls.appendChild(rg.ui.button({
        text: '+10%',
        variant: 'outline',
        onClick: function () { progressValue += 10; progress.setValue(progressValue); }
      }));
    }

    var tooltipDemo = document.getElementById('tooltip-demo');
    if (tooltipDemo) {
      var tooltipBtn = rg.ui.button({ text: 'Hover me', variant: 'secondary' });
      rg.ui.tooltip(tooltipBtn, 'This is a tooltip');
      tooltipDemo.appendChild(tooltipBtn);
    }

    var spinnerDemo = document.getElementById('spinner-demo');
    if (spinnerDemo) spinnerDemo.appendChild(rg.ui.spinner(32));

    var avatarDemo = document.getElementById('avatar-demo');
    if (avatarDemo) {
      avatarDemo.appendChild(rg.ui.avatar({ initials: 'AL', status: 'online' }));
      avatarDemo.appendChild(rg.ui.avatar({ initials: 'JS', status: 'busy' }));
      avatarDemo.appendChild(rg.ui.avatar({ initials: 'rg', size: 56, status: 'offline' }));
    }

    var skeletonDemo = document.getElementById('skeleton-demo');
    if (skeletonDemo) {
      var skeletonRow = document.createElement('div');
      skeletonRow.className = 'demo-row';
      skeletonRow.appendChild(rg.ui.skeleton({ shape: 'circle' }));
      var skeletonLines = document.createElement('div');
      skeletonLines.style.flex = '1';
      skeletonLines.style.display = 'flex';
      skeletonLines.style.flexDirection = 'column';
      skeletonLines.style.gap = '8px';
      skeletonLines.appendChild(rg.ui.skeleton({ shape: 'text', width: '60%' }));
      skeletonLines.appendChild(rg.ui.skeleton({ shape: 'text', width: '90%' }));
      skeletonRow.appendChild(skeletonLines);
      skeletonDemo.appendChild(skeletonRow);
      skeletonDemo.appendChild(rg.ui.skeleton({ shape: 'rect', height: 80 }));
    }

    var bottomNavDemo = document.getElementById('bottom-nav-demo');
    if (bottomNavDemo) {
      bottomNavDemo.appendChild(rg.ui.bottomNav({
        fixed: false,
        items: [
          { icon: '🏠', label: 'Home', href: '#', active: true },
          { icon: '🔍', label: 'Search', href: '#' },
          { icon: '🔔', label: 'Alerts', href: '#' },
          { icon: '⚙️', label: 'Settings', href: '#' }
        ]
      }));
      // A real fixed bottom nav, visible only under 900px — resize the window to see it.
      document.body.appendChild(rg.ui.bottomNav({
        items: [
          { icon: '🏠', label: 'Home', href: '#', active: true },
          { icon: '🔍', label: 'Search', href: '#' },
          { icon: '🔔', label: 'Alerts', href: '#' },
          { icon: '⚙️', label: 'Settings', href: '#' }
        ]
      }));
    }

    var fabDemo = document.getElementById('fab-demo');
    if (fabDemo) {
      fabDemo.appendChild(rg.ui.fab({
        icon: '+',
        variant: 'primary',
        fixed: false,
        onClick: function () { rg.ui.toast('New item'); }
      }));
      // A real fixed FAB, pinned to the bottom-right of the viewport.
      document.body.appendChild(rg.ui.fab({
        icon: '+',
        variant: 'primary',
        onClick: function () { rg.ui.toast('New item'); }
      }));
    }

    var bottomSheetDemo = document.getElementById('bottom-sheet-demo');
    if (bottomSheetDemo) {
      bottomSheetDemo.appendChild(rg.ui.button({
        text: 'Open bottom sheet',
        variant: 'secondary',
        onClick: function () {
          rg.ui.bottomSheet({ title: 'Share', body: 'Copy the link or send it directly.' });
        }
      }));
    }
  }

  // ---------- forms.html ----------
  function wireFormsDemos() {
    var textInputDemo = document.getElementById('text-input-demo');
    if (textInputDemo) {
      var nameField = rg.ui.input({ label: 'Name', placeholder: 'Ada Lovelace' });
      textInputDemo.appendChild(nameField.element);
    }

    var phoneInputDemo = document.getElementById('phone-input-demo');
    if (phoneInputDemo) {
      var phoneField = rg.ui.phoneInput({ label: 'Phone number' });
      phoneInputDemo.appendChild(phoneField.element);
    }

    var selectDemo = document.getElementById('select-demo');
    if (selectDemo) {
      var orbitField = rg.ui.select({
        label: 'Orbit',
        options: [
          { value: 'leo', label: 'Low Earth Orbit' },
          { value: 'meo', label: 'Medium Earth Orbit' },
          { value: 'geo', label: 'Geostationary' }
        ],
        value: 'leo'
      });
      selectDemo.appendChild(orbitField.element);
    }

    var checkboxDemo = document.getElementById('checkbox-demo');
    if (checkboxDemo) {
      checkboxDemo.appendChild(rg.ui.checkbox({ label: 'Notify me on deploy', checked: true }));
    }

    var switchDemo = document.getElementById('switch-demo');
    if (switchDemo) {
      switchDemo.appendChild(rg.ui.switchToggle({ label: 'Auto-refresh' }).element);
    }

    var searchDemo = document.getElementById('search-demo');
    var searchOutput = document.getElementById('search-output');
    if (searchDemo && searchOutput) {
      var searchField = rg.ui.input({ placeholder: 'Type to see debounce in action…' });
      searchDemo.appendChild(searchField.element);
      var search = rg.utils.debounce(function (value) {
        searchOutput.textContent = value ? 'Searching for: "' + rg.utils.escapeHtml(value) + '"' : 'Waiting for input…';
      }, 400);
      searchField.input.addEventListener('input', function (e) { search(e.target.value); });
    }

    var copyDemo = document.getElementById('copy-demo');
    if (copyDemo) {
      copyDemo.appendChild(rg.ui.button({
        text: 'Copy page URL',
        variant: 'outline',
        onClick: function () {
          rg.utils.copyToClipboard(window.location.href);
          rg.ui.toast('URL copied to clipboard', { variant: 'primary' });
        }
      }));
    }
  }

  // ---------- reference.html ----------
  function wireReferenceDemos() {
    var utilsRef = document.getElementById('utils-reference');
    if (utilsRef) {
      utilsRef.appendChild(rg.ui.table({
        columns: [{ key: 'fn', label: 'Function' }, { key: 'desc', label: 'What it does' }],
        rows: [
          { fn: 'rg.utils.qs / qsa', desc: 'Shorthand for querySelector / querySelectorAll, returns a real array' },
          { fn: 'rg.utils.onReady(fn)', desc: 'Runs fn once the DOM is ready' },
          { fn: 'rg.utils.debounce(fn, wait)', desc: 'Delays calls until input goes quiet' },
          { fn: 'rg.utils.throttle(fn, limit)', desc: 'Caps how often fn can run' },
          { fn: 'rg.utils.clamp(n, min, max)', desc: 'Restricts a number to a range' },
          { fn: 'rg.utils.randomId(prefix)', desc: 'Short random DOM-safe id' },
          { fn: 'rg.utils.uuid()', desc: 'RFC-4122-ish v4 UUID' },
          { fn: 'rg.utils.sleep(ms)', desc: 'Promise that resolves after ms' },
          { fn: 'rg.utils.groupBy(arr, key)', desc: 'Groups an array into an object by key or key-fn' },
          { fn: 'rg.utils.escapeHtml(str)', desc: 'Escapes user text before injecting as HTML' },
          { fn: 'rg.utils.truncate(str, len, suffix)', desc: 'Shortens a string, appending a suffix' },
          { fn: 'rg.utils.formatDate(date, locale, opts)', desc: 'Locale-aware date formatting' },
          { fn: 'rg.utils.formatNumber(n, locale)', desc: 'Locale-aware number formatting' },
          { fn: 'rg.utils.formatCurrency(amount, currency, locale)', desc: 'Locale-aware currency formatting' },
          { fn: 'rg.utils.getQueryParam(name)', desc: 'Reads a query-string parameter' },
          { fn: 'rg.utils.isMobile()', desc: 'True under a 768px viewport' },
          { fn: 'rg.utils.onOutsideClick(el, handler)', desc: 'Fires handler on clicks outside el; returns a teardown fn' },
          { fn: 'rg.utils.copyToClipboard(text)', desc: 'Copies text, with a fallback for insecure contexts' },
          { fn: 'rg.utils.storage.get/set/remove', desc: 'JSON-safe localStorage wrapper' },
          { fn: 'rg.utils.deepClone(obj)', desc: 'Quick structural clone for plain JSON data' },
          { fn: 'rg.utils.theme.get/set/toggle/init', desc: 'Reads, applies, flips, or restores the dark/light theme' },
          { fn: 'rg.utils.skin.get/set/init', desc: 'Reads, applies, or restores the accent color pair (cyan, violet, emerald, amber, rose)' }
        ]
      }));
    }

    var componentsRef = document.getElementById('components-reference');
    if (componentsRef) {
      componentsRef.appendChild(rg.ui.table({
        columns: [{ key: 'fn', label: 'Function' }, { key: 'desc', label: 'What it does' }],
        rows: [
          { fn: 'rg.ui.button({ text, variant, shape, onClick, className })', desc: 'Returns a <button>' },
          { fn: 'rg.ui.card({ title, body, footer })', desc: 'Returns a glass card <div>' },
          { fn: 'rg.ui.badge(text, variant, { shape })', desc: 'Returns an inline pill with a glow dot' },
          { fn: 'rg.ui.alert({ title, body, variant, dismissible })', desc: 'Returns a dismissible banner' },
          { fn: 'rg.ui.toast(message, { duration, variant })', desc: 'Appends a self-dismissing toast' },
          { fn: 'rg.ui.modal({ title, body, onClose })', desc: 'Appends an overlay modal; returns { element, close }' },
          { fn: 'rg.ui.tabs({ tabs, active })', desc: 'Returns { element, setActive }' },
          { fn: 'rg.ui.accordion({ items, multiple })', desc: 'Returns a collapsible list <div>' },
          { fn: 'rg.ui.table({ columns, rows, striped, variant, shape })', desc: 'Returns a wrapped, styled <table>' },
          { fn: 'rg.ui.progress({ value, max, label })', desc: 'Returns { element, setValue }' },
          { fn: 'rg.ui.tooltip(target, text)', desc: 'Attaches a hover tooltip to an existing element' },
          { fn: 'rg.ui.spinner(size)', desc: 'Returns a spinning loader <div>' },
          { fn: 'rg.ui.input({ label, type, placeholder, value, onInput })', desc: 'Returns { element, input }' },
          { fn: 'rg.ui.phoneInput({ label, placeholder, value, onChange })', desc: 'Auto-formatting phone field; returns { element, input }' },
          { fn: 'rg.ui.select({ label, options, value, onChange })', desc: 'Returns { element, select }' },
          { fn: 'rg.ui.checkbox({ label, checked, onChange })', desc: 'Returns a styled <label> checkbox' },
          { fn: 'rg.ui.switchToggle({ label, checked, onChange })', desc: 'Returns { element, input }' },
          { fn: 'rg.ui.themeToggle()', desc: 'Returns a sun/moon <button> wired to rg.utils.theme' },
          { fn: 'rg.ui.skinPicker({ skins })', desc: 'Returns a row of color swatches wired to rg.utils.skin' },
          { fn: 'rg.ui.navbar({ brand, links, actions, onToggle, fixed })', desc: 'Returns a <header> top bar' },
          { fn: 'rg.ui.sidebar({ sections, fixed })', desc: 'Returns an <aside> nav drawer' },
          { fn: 'rg.ui.avatar({ src, initials, size, status })', desc: 'Returns a circular avatar, with an optional status dot' },
          { fn: 'rg.ui.skeleton({ shape, width, height })', desc: 'Returns a shimmering loading placeholder' },
          { fn: 'rg.ui.fab({ icon, variant, onClick, fixed })', desc: 'Returns a floating action button, fixed bottom-right by default' },
          { fn: 'rg.ui.bottomNav({ items, fixed })', desc: 'Returns a mobile tab bar, fixed to the bottom under 900px' },
          { fn: 'rg.ui.bottomSheet({ title, body, onClose })', desc: 'Appends a mobile-style sheet sliding up from the bottom; returns { element, close }' }
        ]
      }));
    }
  }
})();

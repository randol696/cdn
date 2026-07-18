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
});

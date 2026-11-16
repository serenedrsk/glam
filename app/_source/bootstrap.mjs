// A sendData attempt is not an acknowledgement from the bot or a bank payment.
// Keep the buyer's saved cart until they explicitly change or clear it.
export function prepareCheckout(storage) {
  try { storage.removeItem('glam.sent.v1'); } catch {}
}

function showGiftCertificate() {
  const root = document.getElementById('app');
  const template = document.getElementById('gift-certificate-card');

  function mount() {
    const home = root.querySelector(':scope > .screen--home');
    const shelf = home?.querySelector(':scope > [data-shelf]');
    if (!shelf || home.querySelector('.mini-gift-certificate')) return;

    const card = template.content.firstElementChild.cloneNode(true);
    const link = card.querySelector('a');
    link.addEventListener('click', event => {
      const webApp = window.Telegram?.WebApp;
      if (!webApp?.openTelegramLink || !webApp.platform || webApp.platform === 'unknown') return;
      try {
        webApp.openTelegramLink(link.href);
      } catch {
        return;
      }
      event.preventDefault();
      webApp.close?.();
    });
    shelf.before(card);

    const filters = home.querySelector(':scope > .chips');
    const certificateFilter = filters?.querySelector('button[data-f="compact"]');
    if (!certificateFilter) return;
    certificateFilter.textContent = 'сертификаты';
    certificateFilter.dataset.f = 'certificates';
    certificateFilter.removeAttribute('data-act');

    filters.addEventListener('click', event => {
      const selected = event.target.closest('button[data-f]');
      if (!selected) return;
      const certificatesOnly = selected === certificateFilter;
      card.hidden = !certificatesOnly && selected.dataset.f !== 'all';
      shelf.hidden = certificatesOnly;
      if (certificatesOnly) {
        for (const filter of filters.querySelectorAll('button[data-f]')) {
          filter.setAttribute('aria-pressed', String(filter === selected));
        }
        card.scrollIntoView({block: 'nearest'});
      }
    });
  }

  mount();
  new MutationObserver(mount).observe(root, {childList: true});
}

if (typeof window !== 'undefined') {
  try { prepareCheckout(window.localStorage); } catch {}
  showGiftCertificate();
  import('./index-aMkEsQav.js');
}

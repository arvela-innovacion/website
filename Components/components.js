(function () {
  const headerContainer = document.getElementById('header-container');
  const footerPromise = fetch('/Components/footer.html').then(checkResponse).then(r => r.text());

  function checkResponse(response) {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response;
  }

  function markActiveNavigation(container) {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    container.querySelectorAll('nav a[href]').forEach(link => {
      const href = new URL(link.getAttribute('href'), window.location.origin)
        .pathname.replace(/\/+$/, '') || '/';
      const active = path === href || (href !== '/' && path.startsWith(href + '/'));
      if (active) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  if (headerContainer) {
    fetch('/Components/header.html')
      .then(checkResponse)
      .then(r => r.text())
      .then(html => {
        headerContainer.innerHTML = html;
        markActiveNavigation(headerContainer);
      })
      .catch(error => {
        headerContainer.classList.add('component-error');
        console.error('Header ARVELA:', error);
      });
  }

  function mountFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) return;
    footerPromise
      .then(html => { footerContainer.innerHTML = html; })
      .catch(error => console.error('Footer ARVELA:', error));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountFooter, { once: true });
  } else {
    mountFooter();
  }
})();


// Contact form success message
(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('enviado') === '1') {
    const message = document.getElementById('form-success');
    if (message) message.classList.add('is-visible');
  }
})();

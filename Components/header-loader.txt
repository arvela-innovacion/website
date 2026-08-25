(function () {
  const container = document.createElement('div');
  container.id = 'header-container';

  container.style.overflow = 'hidden';
  container.style.height = '0';
  container.style.opacity = '0';
  container.style.transition = 'height .28s ease, opacity .35s ease';

  document.currentScript.insertAdjacentElement('afterend', container);

  fetch('/Components/header.html')
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar el header');
      return response.text();
    })
    .then(html => {
      container.innerHTML = html;

      const path = window.location.pathname;

      container.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');

        if (
          path === href ||
          (href.endsWith('/') && href !== '/' && path.startsWith(href))
        ) {
          link.classList.add('active');
        }
      });

      const altura = container.scrollHeight;

      requestAnimationFrame(() => {
        container.style.height = altura + 'px';
        container.style.opacity = '1';
      });

      container.addEventListener('transitionend', () => {
        container.style.height = 'auto';
        container.style.overflow = 'visible';
      }, { once: true });
    })
    .catch(error => console.error('Header ARVELA:', error));
})();

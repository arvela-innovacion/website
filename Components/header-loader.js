(function () {
  const script = document.currentScript;
  const container = document.createElement('div');
  container.id = 'header-container';

  /*
   * Reserva espacio inmediatamente, antes de que el navegador continúe
   * construyendo el <main>. Las alturas se adaptan al ancho de pantalla.
   * El header NO anima su altura: solo aparece mediante opacity.
   */
  function reservedHeight() {
    const w = window.innerWidth;
    if (w <= 380) return 230;
    if (w <= 520) return 205;
    if (w <= 700) return 180;
    if (w <= 900) return 165;
    return 100;
  }

  container.style.minHeight = reservedHeight() + 'px';
  container.style.opacity = '0';
  container.style.transition = 'opacity .28s ease';
  container.style.willChange = 'opacity';

  script.insertAdjacentElement('afterend', container);

  fetch('/Components/header.html')
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar el header');
      return response.text();
    })
    .then(html => {
      container.innerHTML = html;

      // Marca automáticamente la sección activa.
      const path = window.location.pathname.replace(/\/+$/, '') || '/';

      container.querySelectorAll('nav a').forEach(link => {
        const rawHref = link.getAttribute('href');
        if (!rawHref) return;

        const href = new URL(rawHref, window.location.origin)
          .pathname
          .replace(/\/+$/, '') || '/';

        const active =
          path === href ||
          (href !== '/' && path.startsWith(href + '/'));

        if (active) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });

      /*
       * Ya conocemos la altura real. Si la reserva era mayor, no la reducimos
       * antes de mostrar el header para evitar que el contenido suba de golpe.
       * Si era menor, la ampliamos antes del fade.
       */
      const realHeight = container.scrollHeight;
      const currentReserve = reservedHeight();

      if (realHeight > currentReserve) {
        container.style.minHeight = realHeight + 'px';
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          container.style.opacity = '1';
        });
      });

      // Una vez visible, permitimos que el header responda a cambios de tamaño.
      const finish = () => {
        container.style.willChange = 'auto';
        container.removeEventListener('transitionend', finish);
      };
      container.addEventListener('transitionend', finish);

      // Si cambia orientación/tamaño, nunca ocultamos ni animamos la altura.
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const needed = container.scrollHeight;
          container.style.minHeight = Math.max(needed, reservedHeight()) + 'px';
        }, 100);
      });
    })
    .catch(error => {
      console.error('Header ARVELA:', error);
      // Si falla la carga, eliminamos la reserva para no dejar un hueco vacío.
      container.style.minHeight = '0';
      container.style.opacity = '1';
    });
})();

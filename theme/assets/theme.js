/* ============================================================
   NURA — theme.js
   ============================================================ */
(function () {
  'use strict';

  var body = document.body;
  var cartDrawer = document.querySelector('[data-cart-drawer]');
  var drawerSectionId = cartDrawer ? cartDrawer.getAttribute('data-section-id') : '';
  var overlay = document.querySelector('[data-overlay]');

  /* ---------- State helpers ---------- */
  function showOverlay() {
    if (overlay) overlay.classList.add('is-visible');
  }

  function hideOverlay() {
    if (overlay) overlay.classList.remove('is-visible');
  }

  function lockScroll() {
    body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    body.style.overflow = '';
  }

  /* ---------- Cart count ---------- */
  function refreshCartCount() {
    fetch('/cart.js')
      .then(function (res) { return res.json(); })
      .then(function (cart) {
        document.querySelectorAll('[data-cart-count]').forEach(function (el) {
          el.textContent = cart.item_count;
          el.style.display = cart.item_count > 0 ? 'flex' : 'none';
        });
      })
      .catch(function () {});
  }

  /* ---------- Cart drawer re-render ---------- */
  function refreshCartDrawer() {
    if (!cartDrawer || !drawerSectionId) return;
    fetch('/cart?section_id=' + drawerSectionId)
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        var fresh = tmp.querySelector('[data-cart-drawer]');
        if (fresh) cartDrawer.innerHTML = fresh.innerHTML;
      })
      .catch(function () {});
  }

  /* ---------- Drawer / menu ---------- */
  function openDrawer() {
    if (!cartDrawer) return;
    refreshCartDrawer();
    cartDrawer.classList.add('is-open');
    showOverlay();
    lockScroll();
  }

  function closeDrawer() {
    if (!cartDrawer) return;
    cartDrawer.classList.remove('is-open');
    hideOverlay();
    unlockScroll();
  }

  function openMobileMenu() {
    var menu = document.querySelector('[data-mobile-menu]');
    if (!menu) return;
    menu.classList.add('is-open');
    showOverlay();
    lockScroll();
  }

  function closeMobileMenu() {
    var menu = document.querySelector('[data-mobile-menu]');
    if (!menu) return;
    menu.classList.remove('is-open');
    if (cartDrawer && !cartDrawer.classList.contains('is-open')) hideOverlay();
    unlockScroll();
  }

  /* ---------- AJAX add to cart ---------- */
  function addToCart(form, trigger) {
    var submit = trigger || form.querySelector('[type="submit"]');
    var original = submit ? submit.innerHTML : '';

    if (submit) {
      window.clearTimeout(submit._nuraErrorReset);
      submit.setAttribute('disabled', 'disabled');
      submit.classList.add('is-loading');
    }

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form))
    })
      .then(function (res) {
        if (!res.ok) throw new Error('add failed');
        return res.json();
      })
      .then(function () {
        refreshCartCount();
        openDrawer();
      })
      .catch(function () {
        if (submit) {
          submit.innerHTML = submit.getAttribute('data-error-message');
          submit._nuraErrorReset = window.setTimeout(function () {
            submit.innerHTML = original;
          }, 3000);
        }
      })
      .finally(function () {
        if (submit) {
          submit.removeAttribute('disabled');
          submit.classList.remove('is-loading');
        }
      });
  }

  /* ---------- Event delegation ---------- */
  document.addEventListener('click', function (e) {
    var openCart = e.target.closest('[data-open-cart]');
    var closeCart = e.target.closest('[data-close-cart]');
    var openMenu = e.target.closest('[data-open-menu]');
    var closeMenu = e.target.closest('[data-close-menu]');
    var quickAdd = e.target.closest('[data-quick-add]');
    var qtyMinus = e.target.closest('[data-qty-minus]');
    var qtyPlus = e.target.closest('[data-qty-plus]');
    var thumb = e.target.closest('[data-thumbnail]');
    var scrollToForm = e.target.closest('[data-scroll-to-form]');
    var facetsToggle = e.target.closest('[data-facets-toggle]');
    var accordionTrigger = e.target.closest('.accordion__trigger');
    var announcementClose = e.target.closest('[data-announcement-close]');

    if (openCart) {
      var href = openCart.getAttribute('href') || '';
      if (href.indexOf('/cart') === 0 && cartDrawer) {
        e.preventDefault();
        openDrawer();
      }
      return;
    }

    if (closeCart) {
      e.preventDefault();
      closeDrawer();
      return;
    }

    if (openMenu) {
      openMobileMenu();
      return;
    }

    if (closeMenu) {
      closeMobileMenu();
      return;
    }

    if (quickAdd) {
      e.preventDefault();
      var id = quickAdd.getAttribute('data-quick-add');
      var form = document.createElement('form');
      var input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'id';
      input.value = id;
      form.appendChild(input);
      document.body.appendChild(form);
      addToCart(form, quickAdd);
      form.remove();
      return;
    }

    if (qtyMinus) {
      var minusInput = qtyMinus.parentElement.querySelector('input');
      var v = parseInt(minusInput.value, 10);
      if (!isNaN(v) && v > 1) minusInput.value = v - 1;
      minusInput.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }

    if (qtyPlus) {
      var plusInput = qtyPlus.parentElement.querySelector('input');
      var pv = parseInt(plusInput.value, 10);
      if (!isNaN(pv)) plusInput.value = pv + 1;
      plusInput.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }

    if (thumb) {
      var gallery = thumb.closest('.product__gallery');
      var main = gallery && gallery.querySelector('[data-main-image]');
      var src = thumb.getAttribute('data-full-src') || thumb.getAttribute('src');
      if (main && src) {
        main.src = src;
        main.srcset = '';
        main.alt = thumb.getAttribute('alt') || '';
      }
      gallery.querySelectorAll('[data-thumbnail]').forEach(function (t) {
        t.classList.remove('is-active');
      });
      thumb.classList.add('is-active');
      return;
    }

    if (scrollToForm) {
      e.preventDefault();
      var target = document.querySelector('[data-product-form]');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (facetsToggle) {
      var facets = document.querySelector('[data-facets]');
      if (facets) facets.classList.toggle('is-open');
      return;
    }

    if (accordionTrigger) {
      var item = accordionTrigger.closest('.accordion__item');
      var panel = item.querySelector('.accordion__panel');
      var isOpen = item.classList.contains('is-open');
      item.classList.toggle('is-open', !isOpen);
      if (panel) {
        panel.style.maxHeight = isOpen ? 0 : panel.scrollHeight + 'px';
      }
      accordionTrigger.setAttribute('aria-expanded', String(!isOpen));
      return;
    }

    if (announcementClose) {
      var bar = announcementClose.closest('[data-announcement]');
      if (bar) bar.style.display = 'none';
    }
  });

  document.addEventListener('submit', function (e) {
    var addForm = e.target.closest('form[data-add-to-cart]');

    if (addForm) {
      e.preventDefault();
      addToCart(addForm);
    }
  });

  document.addEventListener('change', function (e) {
    var select = e.target.closest('select[data-variant-select]');
    if (!select) return;

    var form = select.closest('form');
    var priceEl = form.querySelector('[data-variant-price]');
    var raw = form.querySelector('[data-variants]');
    var variants = raw ? JSON.parse(raw.textContent) : {};

    if (variants[select.value]) {
      if (priceEl) priceEl.textContent = variants[select.value].price;
      var submit = form.querySelector('[type="submit"]');
      if (submit) submit.disabled = !variants[select.value].available;
    }
  });

  document.addEventListener('keyup', function (e) {
    if (e.key === 'Escape') {
      closeDrawer();
      closeMobileMenu();
    }
  });

  /* ---------- Sticky add-to-cart ---------- */
  var stickyAtc = document.querySelector('[data-sticky-atc]');
  var stickyTrigger = document.querySelector('[data-product-form]');
  if (stickyAtc && stickyTrigger) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          stickyAtc.classList.toggle('is-visible', !entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );
    observer.observe(stickyTrigger);
  }

  /* ---------- Country select default (customer addresses) ---------- */
  document.querySelectorAll('select[data-default]').forEach(function (select) {
    var def = select.getAttribute('data-default');
    if (def) select.value = def;
  });

  /* ---------- Init ---------- */
  refreshCartCount();
})();

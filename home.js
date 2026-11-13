/**
 * Landinger - Clean Vanilla JavaScript
 * Pure Vanilla JS for Navbar, Mobile Drawer, Accordions, Active Links & AOS Animations
 * No jQuery | No Tailwind Dependencies | No Heavy Frameworks
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Sticky Header
     ========================================================================== */
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY >= 75 || document.documentElement.scrollTop >= 75) {
        header.classList.add('is-sticky');
      } else {
        header.classList.remove('is-sticky');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initGlobalPresenceParallax() {
    const section = document.getElementById('global-presence');
    const map = section && section.querySelector('.global-presence-map');
    if (!section || !map) return;

    const motionQuery = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    let ticking = false;

    function updateMap() {
      if (motionQuery.matches) {
        const rect = section.getBoundingClientRect();
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const offset = (progress - 0.5) * 70;
        map.style.transform = 'translate3d(0, ' + offset.toFixed(1) + 'px, 0)';
      } else {
        map.style.transform = '';
      }
      ticking = false;
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateMap);
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', requestUpdate);
    else motionQuery.addListener(requestUpdate);
    updateMap();
  }

  function initWipeReveal() {
    const images = document.querySelectorAll('.wipe');
    if (!images.length) return;
    if (!('IntersectionObserver' in window)) {
      images.forEach(function (image) {
        image.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.querySelector('.wipe').classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18 });

    images.forEach(function (image) {
      observer.observe(image.parentElement);
    });
  }

  /* ==========================================================================
     2. Mobile Menu (Offcanvas Drawer)
     ========================================================================== */
  function initMobileDrawer() {
    const openBtn = document.getElementById('mobileMenuOpenBtn');
    const closeBtn = document.getElementById('mobileMenuCloseBtn');
    const drawer = document.getElementById('mobileMenuOffcanvas');
    if (!drawer) return;

    // Create backdrop element if it doesn't exist
    let backdrop = document.querySelector('.drawer-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'drawer-backdrop';
      document.body.appendChild(backdrop);
    }

    function openDrawer() {
      drawer.classList.add('is-open');
      backdrop.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      backdrop.classList.remove('is-active');
      document.body.style.overflow = '';
      if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    }

    if (openBtn) {
      openBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openDrawer();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeDrawer();
      });
    }

    backdrop.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });

    // Close drawer when clicking any link inside
    const drawerLinks = drawer.querySelectorAll('a');
    drawerLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeDrawer();
      });
    });
  }

  /* ==========================================================================
     3. Mobile Accordions
     ========================================================================== */
  function initMobileAccordions() {
    const accordionToggles = document.querySelectorAll('.accordion-toggle');

    accordionToggles.forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        const item = this.closest('.accordion-item');
        if (!item) return;

        const isOpen = item.classList.contains('is-open');

        // Optional: close siblings to keep only one open
        const parentGroup = item.closest('.accordion-group');
        if (parentGroup) {
          const siblings = parentGroup.querySelectorAll('.accordion-item');
          siblings.forEach(function (sibling) {
            if (sibling !== item) {
              sibling.classList.remove('is-open');
              const siblingToggle = sibling.querySelector('.accordion-toggle');
              if (siblingToggle) siblingToggle.setAttribute('aria-expanded', 'false');
            }
          });
        }

        if (isOpen) {
          item.classList.remove('is-open');
          this.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-open');
          this.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ==========================================================================
     4. Active Navigation Link Highlighting
     ========================================================================== */
  function initActiveNavLinks() {
    const currentUrl = window.location.href.split(/[?#]/)[0];
    const navLinks = document.querySelectorAll('.main-nav a, .mobile-drawer a');

    navLinks.forEach(function (link) {
      if (link.href === currentUrl) {
        link.classList.add('active');

        // If link is inside a desktop dropdown, highlight parent toggle
        const parentDropdown = link.closest('.dropdown');
        if (parentDropdown) {
          const toggle = parentDropdown.querySelector('.dropdown-toggle');
          if (toggle) toggle.classList.add('active');
        }
      }
    });
  }

  /* ==========================================================================
     5. Vanilla AOS (Animate On Scroll) Engine
     ========================================================================== */
  const VanillaAOS = {
    init: function (options) {
      const config = Object.assign(
        {
          offset: 100,
          once: false,
        },
        options || {}
      );

      const elements = document.querySelectorAll('[data-aos]');
      if (!elements.length) return;

      elements.forEach(function (el) {
        el.classList.add('aos-init');
      });

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              const el = entry.target;
              const isOnce = el.getAttribute('data-aos-once') === 'true' || config.once;

              if (entry.isIntersecting) {
                el.classList.add('aos-animate');
                if (isOnce) {
                  observer.unobserve(el);
                }
              } else {
                if (!isOnce) {
                  el.classList.remove('aos-animate');
                }
              }
            });
          },
          {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.1,
          }
        );

        elements.forEach(function (el) {
          observer.observe(el);
        });
      } else {
        // Fallback for older browsers
        function checkScroll() {
          const scrollPos = window.pageYOffset + window.innerHeight;
          elements.forEach(function (el) {
            const rect = el.getBoundingClientRect();
            const elTop = rect.top + window.pageYOffset;
            if (scrollPos > elTop + config.offset) {
              el.classList.add('aos-animate');
            }
          });
        }
        window.addEventListener('scroll', checkScroll, { passive: true });
        checkScroll();
      }
    },
  };

  // Expose global AOS object for compatibility
  window.AOS = VanillaAOS;

  /* ==========================================================================
     Initialize on DOM Ready
     ========================================================================== */
  function initAll() {
    initStickyHeader();
    initMobileDrawer();
    initMobileAccordions();
    initActiveNavLinks();
    VanillaAOS.init();
    initGlobalPresenceParallax();
    initWipeReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();

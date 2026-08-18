/* ==========================================================================
   VARVI — behaviour
   Age gate · header · mobile menu · scroll reveals · flagship parallax ·
   certificate lightbox · phone popup · language prompt · contact links
   ========================================================================== */
(function () {
  'use strict';

  /* ---- CONTACT DETAILS (single source of truth; set real values when
     supplied). Empty = placeholder shown, links stay inert, and the call
     CTA opens the "coming soon" popup instead. ---- */
  var PHONE = ''; // e.g. '+40 7xx xxx xxx'
  var EMAIL = ''; // e.g. 'comenzi@...'

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= Age gate =================
     Shown by default; an inline <head> script adds .age-ok before paint for
     returning visitors, so the gate never flashes. */
  var gate = document.querySelector('.age-gate');
  if (gate) {
    var enterBtn = gate.querySelector('[data-gate-enter]');
    var leaveBtn = gate.querySelector('[data-gate-leave]');
    if (enterBtn) enterBtn.addEventListener('click', function () {
      try { localStorage.setItem('varvi_age_ok', '1'); } catch (e) {}
      document.documentElement.classList.add('age-ok');
    });
    if (leaveBtn) leaveBtn.addEventListener('click', function () {
      if (window.history.length > 1) window.history.back();
      else window.location.assign('https://www.google.com');
    });
  }

  /* ================= Header: dark bar past 60px ================= */
  var header = document.querySelector('.site-header');
  if (header) {
    var onHeaderScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onHeaderScroll, { passive: true });
    onHeaderScroll();
  }

  /* ================= Mobile menu ================= */
  var menuToggle = document.querySelector('.menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    var setMenu = function (open) {
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      mobileMenu.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      if (open) {
        var first = mobileMenu.querySelector('a');
        if (first) first.focus();
      } else {
        menuToggle.focus();
      }
    };
    menuToggle.addEventListener('click', function () {
      setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false); // in-page anchors: close, then jump
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) setMenu(false);
    });
  }

  /* ================= Scroll reveals =================
     Elements keep full opacity without JS; hiding only happens here, and a
     scroll fallback plus a 4s safety net guarantee nothing stays hidden. */
  if (!reduced && 'IntersectionObserver' in window) {
    var hidden = [];
    var show = function (el) { el.style.opacity = '1'; el.style.transform = 'none'; };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { show(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9) return; // already visible; don't hide
      el.style.opacity = '0';
      el.style.transform = 'translateY(26px)';
      el.style.transition = 'opacity 1.1s cubic-bezier(.22,.61,.36,1), transform 1.2s cubic-bezier(.22,.61,.36,1)';
      io.observe(el);
      hidden.push(el);
    });

    window.addEventListener('scroll', function () {
      for (var i = hidden.length - 1; i >= 0; i--) {
        var r = hidden[i].getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
          show(hidden[i]);
          io.unobserve(hidden[i]);
          hidden.splice(i, 1);
        }
      }
    }, { passive: true });

    setTimeout(function () { hidden.forEach(show); hidden.length = 0; }, 4000);
  }

  /* ================= Flagship bottle parallax (±30px) ================= */
  var bottle = document.querySelector('.flagship__bottle');
  if (bottle && !reduced) {
    window.addEventListener('scroll', function () {
      var r = bottle.getBoundingClientRect();
      var p = Math.max(-1, Math.min(1, (window.innerHeight / 2 - (r.top + r.height / 2)) / window.innerHeight));
      bottle.style.transform = 'translateY(' + (p * 30).toFixed(1) + 'px)';
    }, { passive: true });
  }

  /* ================= Modals (lightbox / phone popup) ================= */
  var openModal = function (modal) {
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    var closeBtn = modal.querySelector('[data-modal-close]');
    if (closeBtn) closeBtn.focus();
  };
  var closeModal = function (modal) {
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  };
  document.querySelectorAll('.modal').forEach(function (modal) {
    modal.addEventListener('click', function (e) {
      if (!e.target.closest('[data-modal-card]')) closeModal(modal); // backdrop
    });
    modal.querySelectorAll('[data-modal-close]').forEach(function (btn) {
      btn.addEventListener('click', function () { closeModal(modal); });
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal.is-open').forEach(closeModal);
  });

  // Certificate lightbox: buttons carry the wine name to show under the frame
  var lightbox = document.getElementById('cert-lightbox');
  if (lightbox) {
    var lbName = lightbox.querySelector('.lightbox__name');
    document.querySelectorAll('[data-cert]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (lbName) lbName.textContent = btn.getAttribute('data-cert-name') || '';
        openModal(lightbox);
      });
    });
  }

  /* ================= Telephone / email wiring ================= */
  var phonePopup = document.getElementById('phone-popup');

  document.querySelectorAll('[data-phone-number]').forEach(function (el) {
    el.textContent = PHONE || '+40 ··· ··· ···';
  });

  // Rings the number once PHONE is set; until then shows the coming-soon notice
  document.querySelectorAll('[data-call-cta]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (PHONE) window.location.href = 'tel:' + PHONE.replace(/\s/g, '');
      else if (phonePopup) openModal(phonePopup);
    });
  });

  // Contact page: mailto with a localized, pre-filled order template
  var mailLink = document.querySelector('[data-mail-link]');
  if (mailLink) {
    mailLink.textContent = EMAIL || '··· @ ···';
    var setMailHref = function (t) {
      if (!EMAIL) { mailLink.removeAttribute('href'); return; }
      mailLink.setAttribute('href', 'mailto:' + EMAIL +
        '?subject=' + encodeURIComponent(t('cpage.mailSubject')) +
        '&body=' + encodeURIComponent(t('cpage.mailBody')));
    };
    document.addEventListener('i18n:applied', function (e) { setMailHref(e.detail.t); });
  }

  /* ================= Background music =================
     Starts once the visitor lands on the page proper: on the age gate's
     "Enter" click (a user gesture, so playback is allowed) or, for returning
     visitors with no gate, on load — falling back to the first interaction
     if the browser blocks autoplay. The toggle persists as varvi_music. */
  var music = document.getElementById('bg-music');
  var musicBtn = document.querySelector('[data-sound-toggle]');
  if (music && musicBtn) {
    var musicOff = false;
    try { musicOff = localStorage.getItem('varvi_music') === 'off'; } catch (e) {}
    music.volume = 0.4;

    var reflectMusic = function () {
      musicBtn.setAttribute('aria-pressed', music.paused ? 'false' : 'true');
      musicBtn.classList.toggle('is-off', music.paused);
    };

    var tryPlayMusic = function () {
      if (musicOff) return;
      music.play().then(reflectMusic).catch(function () {
        var once = function () {
          document.removeEventListener('pointerdown', once);
          document.removeEventListener('keydown', once);
          if (!musicOff) music.play().then(reflectMusic).catch(function () {});
        };
        document.addEventListener('pointerdown', once);
        document.addEventListener('keydown', once);
      });
    };

    musicBtn.addEventListener('click', function () {
      if (music.paused) {
        musicOff = false;
        try { localStorage.setItem('varvi_music', 'on'); } catch (e) {}
        music.play().then(reflectMusic).catch(function () {});
      } else {
        music.pause();
        musicOff = true;
        try { localStorage.setItem('varvi_music', 'off'); } catch (e) {}
        reflectMusic();
      }
    });
    reflectMusic();

    var gateUpForMusic = gate && document.documentElement.classList.contains('js') &&
      !document.documentElement.classList.contains('age-ok');
    if (gateUpForMusic) {
      var gateEnterForMusic = gate.querySelector('[data-gate-enter]');
      if (gateEnterForMusic) gateEnterForMusic.addEventListener('click', tryPlayMusic, { once: true });
    } else {
      tryPlayMusic();
    }
  }

  /* ================= Language switch + first-visit prompt ================= */
  document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.I18n.set(btn.getAttribute('data-lang-btn'));
    });
  });

  /* The prompt appears only until the user has ever made a language choice
     (either answer — including "stay" — is persisted by I18n.set). It is
     rendered in the DETECTED language, so an English-speaking visitor reads
     the offer in English even though the page behind it is Romanian. */
  function showLangPrompt(lang) {
    window.I18n.loadDict(lang).then(function (dict) {
      var t = function (k) { return dict[k] || k; };

      var modal = document.createElement('div');
      modal.className = 'modal popup is-open';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', t('langPrompt.message'));

      var card = document.createElement('div');
      card.className = 'popup__card';
      card.setAttribute('data-modal-card', '');

      var crest = document.createElement('img');
      crest.className = 'popup__crest crest';
      crest.src = 'assets/images/brand/crest-logo.png';
      crest.alt = '';
      crest.width = 110;

      var copy = document.createElement('p');
      copy.className = 'popup__copy';
      copy.textContent = t('langPrompt.message');

      var actions = document.createElement('div');
      actions.className = 'popup__actions';

      var switchBtn = document.createElement('button');
      switchBtn.className = 'btn btn--dark';
      switchBtn.textContent = t('langPrompt.switch');

      var stayBtn = document.createElement('button');
      stayBtn.className = 'popup__stay';
      stayBtn.textContent = t('langPrompt.stay');

      var settle = function (choice) {
        window.I18n.set(choice); // either answer counts as a choice — persisted
        modal.remove();
        document.removeEventListener('keydown', onKey);
      };
      switchBtn.addEventListener('click', function () { settle(lang); });
      stayBtn.addEventListener('click', function () { settle('ro'); });
      modal.addEventListener('click', function (e) {
        if (!e.target.closest('[data-modal-card]')) settle('ro'); // backdrop = stay
      });
      var onKey = function (e) { if (e.key === 'Escape') settle('ro'); };
      document.addEventListener('keydown', onKey);

      actions.appendChild(switchBtn);
      actions.appendChild(stayBtn);
      card.appendChild(crest);
      card.appendChild(copy);
      card.appendChild(actions);
      modal.appendChild(card);
      document.body.appendChild(modal);

      setTimeout(function () { switchBtn.focus(); }, 60);
    }).catch(function () {});
  }

  // Shown immediately, on top of the age gate when that is open (.modal
  // stacks above the gate), so the visitor can settle the language first.
  window.I18n.init().then(function (result) {
    if (result && result.prompt) showLangPrompt(result.prompt);
  });
})();

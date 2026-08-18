/* ==========================================================================
   VARVI i18n engine
   The site always opens in Romanian (the native brand language), regardless
   of the browser's language. Browser detection only decides whether to OFFER
   a switch (via the language prompt in main.js) — it never switches
   automatically. A choice, once made, persists in localStorage.
   ========================================================================== */
(function () {
  'use strict';

  var STORAGE_KEY = 'varvi_lang';
  var DEFAULT_LANG = 'ro';
  var SUPPORTED = ['ro', 'en', 'de'];

  var current = DEFAULT_LANG;
  var dicts = {};

  /* Walk navigator.languages in preference order. Match on language code,
     but also on region — so e.g. en-MD (English UI, Moldovan region) still
     maps to Romanian and en-AT to German. Anything unrecognized falls back
     to English. */
  function detectBrowser() {
    var prefs = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || 'en'];
    var RO_REGIONS = ['RO', 'MD'];
    var DE_REGIONS = ['DE', 'AT', 'CH', 'LI', 'LU'];
    for (var i = 0; i < prefs.length; i++) {
      var parts = String(prefs[i]).split('-');
      var code = parts[0].toLowerCase();
      var region = (parts[1] || '').toUpperCase();
      if (code === 'ro' || RO_REGIONS.indexOf(region) !== -1) return 'ro';
      if (code === 'de' || DE_REGIONS.indexOf(region) !== -1) return 'de';
      if (code === 'en') return 'en';
    }
    return 'en';
  }

  function loadDict(lang) {
    if (dicts[lang]) return Promise.resolve(dicts[lang]);
    return fetch('i18n/' + lang + '.json')
      .then(function (res) {
        if (!res.ok) throw new Error('i18n: could not load ' + lang);
        return res.json();
      })
      .then(function (json) {
        dicts[lang] = json;
        return json;
      });
  }

  function apply(lang, dict) {
    current = lang;
    document.documentElement.lang = lang;

    // Text content: <el data-i18n="some.key">
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-i18n');
      if (dict[key] === undefined) continue;
      if (nodes[i].tagName === 'TITLE') {
        nodes[i].textContent = dict[key];
      } else {
        nodes[i].innerHTML = dict[key];
      }
    }

    // Attributes: <el data-i18n-attr="aria-label:nav.menuOpen;title:some.key">
    var attrNodes = document.querySelectorAll('[data-i18n-attr]');
    for (var j = 0; j < attrNodes.length; j++) {
      var pairs = attrNodes[j].getAttribute('data-i18n-attr').split(';');
      for (var k = 0; k < pairs.length; k++) {
        var pair = pairs[k].split(':');
        if (pair.length === 2 && dict[pair[1]] !== undefined) {
          attrNodes[j].setAttribute(pair[0], dict[pair[1]]);
        }
      }
    }

    // Mark the active RO / EN buttons
    var btns = document.querySelectorAll('[data-lang-btn]');
    for (var m = 0; m < btns.length; m++) {
      var active = btns[m].getAttribute('data-lang-btn') === lang;
      btns[m].classList.toggle('is-active', active);
      if (active) btns[m].setAttribute('aria-current', 'true');
      else btns[m].removeAttribute('aria-current');
    }

    document.dispatchEvent(new CustomEvent('i18n:applied', {
      detail: {
        lang: lang,
        t: function (key) { return dict[key] !== undefined ? dict[key] : key; }
      }
    }));
  }

  /* Apply without persisting (used for the default first paint). */
  function render(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;
    return loadDict(lang)
      .then(function (dict) { apply(lang, dict); })
      .catch(function () { /* dictionaries unreachable: inline Romanian markup stays */ });
  }

  /* Apply AND persist — a deliberate user choice. */
  function set(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    return render(lang);
  }

  /* Startup: saved choice wins and suppresses the prompt forever; otherwise
     render Romanian and report whether the browser would prefer English. */
  function init() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (saved && SUPPORTED.indexOf(saved) !== -1) {
      return render(saved).then(function () { return { prompt: null }; });
    }
    return render(DEFAULT_LANG).then(function () {
      var detected = detectBrowser();
      return { prompt: detected !== DEFAULT_LANG ? detected : null };
    });
  }

  window.I18n = {
    init: init,
    render: render,
    set: set,
    loadDict: loadDict,
    getLang: function () { return current; }
  };
})();

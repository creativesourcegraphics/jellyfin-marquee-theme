/* Jellyfin 12 scrolls <main>; toggle .mq-scrolled on body/app bar. */
(function() {
  "use strict";
  var THRESHOLD = 24;
  var bound = [];
  function apply(y) {
    var on = y > THRESHOLD;
    if (document.body.classList.contains("mq-scrolled") !== on) {
      document.body.classList.toggle("mq-scrolled", on);
      var bar = document.querySelector(".MuiAppBar-root");
      if (bar) bar.classList.toggle("mq-scrolled", on);
    }
  }
  function onScroll(e) {
    var t = e.target;
    var y = t && t.scrollTop != null ? t.scrollTop : window.scrollY || document.documentElement.scrollTop || 0;
    apply(y);
  }
  function bind() {
    var hosts = [ document, window ];
    document.querySelectorAll('main, .mainAnimatedPage, .skinBody, .pageContainer, [class*="scroller"]').forEach(function(el) {
      hosts.push(el);
    });
    hosts.forEach(function(h) {
      if (bound.indexOf(h) !== -1) return;
      bound.push(h);
      h.addEventListener("scroll", onScroll, {
        passive: true,
        capture: true
      });
    });
  }
  bind();
  new MutationObserver(function() {
    bind();
  }).observe(document.body, {
    childList: true,
    subtree: true
  });
  document.addEventListener("viewshow", function() {
    setTimeout(function() {
      bind();
      apply(0);
    }, 60);
  });
  setInterval(function() {
    var best = 0;
    document.querySelectorAll('main, .mainAnimatedPage, [class*="scroller"]').forEach(function(el) {
      if (el.scrollTop > best) best = el.scrollTop;
    });
    if (!best) best = window.scrollY || document.documentElement.scrollTop || 0;
    apply(best);
  }, 400);
})();
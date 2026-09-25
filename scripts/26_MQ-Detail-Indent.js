/* Align detail-page sections inside and outside the poster column. */
(function() {
  "use strict";
  function fix() {
    var hosts = document.querySelectorAll(".detailPagePrimaryContent");
    if (!hosts.length) return;
    var ref = null;
    document.querySelectorAll(".verticalSection").forEach(function(s2) {
      if (ref) return;
      if (s2.closest(".detailPagePrimaryContent")) return;
      if (s2.getBoundingClientRect().width > 0) ref = s2;
    });
    var targetX;
    if (ref) {
      targetX = Math.round(ref.getBoundingClientRect().x);
    } else {
      var firstCard = null;
      document.querySelectorAll(".cardImageContainer").forEach(function(ci) {
        if (!firstCard && ci.getBoundingClientRect().width > 0) firstCard = ci;
      });
      targetX = firstCard ? Math.round(firstCard.getBoundingClientRect().x) - 4 : 39;
    }
    hosts.forEach(function(host) {
      if ((parseFloat(getComputedStyle(host).paddingLeft) || 0) < 40) return;
      host.querySelectorAll(".verticalSection").forEach(function(sec) {
        if (sec.querySelector(".mainDetailButtons, .detailPagePrimaryContainer")) return;
        if (sec.closest(".detailRibbon")) return;
        if (sec.getBoundingClientRect().width === 0) return;
        var cur = Math.round(sec.getBoundingClientRect().x);
        if (Math.abs(cur - targetX) <= 1) {
          alignTitles(sec, targetX);
          return;
        }
        var prev = parseFloat(sec.style.marginLeft) || 0;
        var next = prev - (cur - targetX);
        sec.style.setProperty("margin-left", next + "px", "important");
        sec.style.setProperty("width", "calc(100% + " + Math.abs(next) + "px)", "important");
        sec.style.setProperty("max-width", "none", "important");
        alignTitles(sec, targetX);
      });
    });
  }
  function titleTarget(sections) {
    var counts = {};
    document.querySelectorAll(".sectionTitle").forEach(function(h) {
      if (h.getBoundingClientRect().width === 0) return;
      if (h.closest(".detailPagePrimaryContent")) return;
      var x = Math.round(h.getBoundingClientRect().x);
      counts[x] = (counts[x] || 0) + 1;
    });
    var best = null, n = 0;
    Object.keys(counts).forEach(function(x) {
      if (counts[x] > n) {
        n = counts[x];
        best = parseInt(x, 10);
      }
    });
    return best;
  }
  function alignTitles(scope, fallbackX) {
    var tgt = titleTarget();
    if (tgt === null) tgt = fallbackX;
    scope.querySelectorAll(".sectionTitle").forEach(function(h) {
      if (h.getBoundingClientRect().width === 0) return;
      var cur = Math.round(h.getBoundingClientRect().x);
      if (Math.abs(cur - tgt) <= 1) return;
      var prev = parseFloat(h.style.marginLeft) || 0;
      h.style.setProperty("margin-left", prev - (cur - tgt) + "px", "important");
    });
  }
  var t = null;
  new MutationObserver(function() {
    if (t) return;
    t = setTimeout(function() {
      t = null;
      fix();
    }, 250);
  }).observe(document.body, {
    childList: true,
    subtree: true
  });
  window.addEventListener("resize", function() {
    setTimeout(fix, 150);
  });
  document.addEventListener("viewshow", function() {
    setTimeout(fix, 300);
  });
  setInterval(fix, 1200);
  fix();
})();
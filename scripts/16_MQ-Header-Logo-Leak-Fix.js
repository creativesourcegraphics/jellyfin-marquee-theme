/* Remove duplicate brand-logo nodes left in the header after route changes. */
(function() {
  function prune() {
    var bar = document.querySelector(".MuiAppBar-root .MuiToolbar-root, header .MuiToolbar-root");
    if (!bar) return;
    var brandLinks = bar.querySelectorAll('a[href="#/"]');
    if (brandLinks.length > 1) {
      for (var i = 1; i < brandLinks.length; i++) {
        brandLinks[i].remove();
      }
    }
    var icons = bar.querySelectorAll("span.MuiButton-icon.MuiButton-startIcon");
    icons.forEach(function(span) {
      var p = span.parentElement;
      if (!p || p.tagName !== "A" && p.tagName !== "BUTTON") {
        span.remove();
      }
    });
  }
  var mo = new MutationObserver(prune);
  function start() {
    var target = document.querySelector(".MuiAppBar-root") || document.body;
    mo.observe(target, {
      childList: true,
      subtree: true
    });
    prune();
  }
  if (document.querySelector(".MuiAppBar-root")) start(); else document.addEventListener("DOMContentLoaded", function() {
    setTimeout(start, 500);
  });
  document.addEventListener("viewshow", prune);
})();

(function() {
  var header = document.querySelector("header.MuiAppBar-root");
  if (!header) return;
  var mo = new MutationObserver(function() {
    if (typeof pruneHeaderLogos === "function") pruneHeaderLogos();
  });
  mo.observe(header, {
    childList: true,
    subtree: true
  });
})();
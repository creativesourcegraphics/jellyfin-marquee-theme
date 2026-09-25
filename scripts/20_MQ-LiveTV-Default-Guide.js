/* Open Live TV on the Guide tab. */
(function() {
  function fixHref(a) {
    var h = a.getAttribute("href") || "";
    if (/#\/livetv(\.html)?(\?|$)/.test(h) && !/[?&]tab=/.test(h)) {
      a.setAttribute("href", "#/livetv?tab=1" + (h.indexOf("collectionType") > -1 ? "&collectionType=livetv" : ""));
    }
  }
  function sweep() {
    document.querySelectorAll('a[href*="livetv"]').forEach(fixHref);
  }
  function guard() {
    var h = location.hash || "";
    if (/^#\/livetv(\.html)?(\?|$)/.test(h) && !/[?&]tab=/.test(h)) {
      var q = h.indexOf("?") > -1 ? h.slice(h.indexOf("?") + 1) : "";
      location.replace("#/livetv?tab=1" + (q ? "&" + q : ""));
    }
  }
  guard();
  window.addEventListener("hashchange", guard);
  sweep();
  new MutationObserver(sweep).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  document.addEventListener("viewshow", sweep);
})();
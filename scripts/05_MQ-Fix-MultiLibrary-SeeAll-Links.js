/* Fix "See All" links on home rows that span several libraries. */
(function() {
  "use strict";
  function fixHref(href) {
    if (!href || href.indexOf("list.html") === -1) return null;
    var qIdx = href.indexOf("?");
    if (qIdx === -1) return null;
    var params = new URLSearchParams(href.slice(qIdx + 1));
    var parentId = params.get("parentId") || params.get("ParentId");
    var alreadyMarked = params.get("IsNew") === "1";
    if ((!parentId || parentId.indexOf(",") === -1) && !alreadyMarked) return null;
    var serverId = params.get("serverId") || params.get("ServerId") || "";
    var out = new URLSearchParams;
    if (serverId) out.set("serverId", serverId);
    out.set("IsNew", "1");
    return href.slice(0, qIdx) + "?" + out.toString();
  }
  function patch() {
    document.querySelectorAll('a[href*="list.html"]').forEach(function(a) {
      var fixed = fixHref(a.getAttribute("href"));
      if (fixed) a.setAttribute("href", fixed);
    });
  }
  document.addEventListener("viewshow", function() {
    patch();
    setTimeout(patch, 200);
    setTimeout(patch, 600);
  });
  setInterval(patch, 1e3);
  if (!window.__mqNewFetchPatched) {
    window.__mqNewFetchPatched = true;
    var origFetch = window.fetch;
    window.fetch = function(input, init) {
      try {
        var isOnNewView = location.hash.indexOf("IsNew=1") !== -1;
        var urlStr = typeof input === "string" ? input : input && input.url;
        if (isOnNewView && urlStr && /\/Items(\?|$)/.test(urlStr) && urlStr.indexOf("/Items/") === -1) {
          var qIdx = urlStr.indexOf("?");
          var base = qIdx === -1 ? urlStr : urlStr.slice(0, qIdx);
          var params = new URLSearchParams(qIdx === -1 ? "" : urlStr.slice(qIdx + 1));
          params.set("IncludeItemTypes", "Movie,Series");
          params.set("SortBy", "DateCreated");
          params.set("SortOrder", "Descending");
          params.set("Recursive", "true");
          var newUrl = base + "?" + params.toString();
          if (typeof input === "string") {
            input = newUrl;
          } else {
            input = new Request(newUrl, input);
          }
        }
      } catch (e) {}
      return origFetch.call(this, input, init);
    };
  }
})();
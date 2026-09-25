/* Force lazy images to load so rows don't appear empty after fast scrolling. */
(function() {
  function forceLoadLazyImages() {
    var els = document.querySelectorAll(".lazy[data-src]");
    if (!els.length) return;
    els.forEach(function(el) {
      var src = el.getAttribute("data-src");
      if (!src) return;
      if (el.tagName === "IMG") {
        if (el.src !== src) el.src = src;
      } else {
        var cur = el.style.backgroundImage;
        if (!cur || cur === "none") el.style.backgroundImage = 'url("' + src + '")';
      }
      el.classList.remove("lazy-hidden");
      el.classList.remove("lazy");
    });
  }
  var mo = new MutationObserver(function(muts) {
    for (var i = 0; i < muts.length; i++) {
      if (muts[i].addedNodes && muts[i].addedNodes.length) {
        forceLoadLazyImages();
        break;
      }
    }
  });
  mo.observe(document.body, {
    childList: true,
    subtree: true
  });
  document.addEventListener("viewshow", function() {
    setTimeout(forceLoadLazyImages, 300);
  });
  forceLoadLazyImages();
})();
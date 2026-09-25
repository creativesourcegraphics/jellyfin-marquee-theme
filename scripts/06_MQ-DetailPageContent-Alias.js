/* Add the detailPageContent class to detail sections that lack it. */
(function() {
  function patch() {
    document.querySelectorAll(".page.itemDetailPage:not(.hide) .detailSection").forEach(function(el) {
      if (!el.classList.contains("detailPageContent")) {
        el.classList.add("detailPageContent");
      }
    });
  }
  document.addEventListener("viewshow", function() {
    patch();
    setTimeout(patch, 200);
    setTimeout(patch, 600);
  });
  setInterval(patch, 1e3);
})();
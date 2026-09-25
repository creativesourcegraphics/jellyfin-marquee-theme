/* Highlight the active MUI nav tab. */
(function() {
  function normalize(h) {
    return (h || "").split("?")[0].replace(/^#/, "").replace(/^\//, "").toLowerCase();
  }
  function highlight() {
    var bar = document.querySelector(".MuiAppBar-root .MuiToolbar-root");
    if (!bar) return;
    var current = normalize(location.hash);
    var links = bar.querySelectorAll("a.MuiButtonBase-root[href]");
    links.forEach(function(a) {
      var target = normalize(a.getAttribute("href"));
      if (target === "") {
        a.classList.remove("mq-nav-current");
        return;
      }
      var match = current.indexOf(target) === 0;
      if (match) {
        a.classList.add("mq-nav-current");
      } else {
        a.classList.remove("mq-nav-current");
      }
    });
  }
  window.addEventListener("hashchange", highlight);
  document.addEventListener("viewshow", highlight);
  setInterval(highlight, 1e3);
  highlight();
})();
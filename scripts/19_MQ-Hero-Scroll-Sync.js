/* Sync the Media Bar hero with page scroll. */
(function() {
  function findScrollContainer() {
    return document.querySelector("main.MuiBox-root");
  }
  function sync() {
    var sc = findScrollContainer();
    var hero = document.getElementById("slides-container");
    if (!sc || !hero) return;
    var offset = sc.scrollTop;
    hero.style.transform = "translateY(" + -offset + "px)";
    var h = hero.offsetHeight || 700;
    hero.style.zIndex = offset > h * .9 ? "0" : "1";
  }
  document.addEventListener("scroll", function(e) {
    if (e.target && (e.target.classList?.contains("MuiBox-root") || e.target === document)) sync();
  }, true);
  setInterval(sync, 1e3);
  document.addEventListener("viewshow", function() {
    setTimeout(sync, 300);
  });
  document.addEventListener("wheel", function(e) {
    var hero = document.getElementById("slides-container");
    if (!hero || !hero.contains(e.target)) return;
    var sc = findScrollContainer();
    if (!sc) return;
    var dy = e.deltaY;
    if (e.deltaMode === 1) dy *= 40; else if (e.deltaMode === 2) dy *= sc.clientHeight;
    sc.scrollTop += dy;
    e.preventDefault();
  }, {
    passive: false,
    capture: true
  });
})();
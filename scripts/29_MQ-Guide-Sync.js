/* Keep the Live TV channel rail level with the programme grid. */
(function() {
  "use strict";
  var raf = null;
  function wire() {
    var grid = document.querySelector(".programGrid");
    var rail = document.querySelector(".channelsContainer");
    if (!grid || !rail) return;
    if (grid.dataset.mqGuideSync === "1") return;
    grid.dataset.mqGuideSync = "1";
    function sync() {
      raf = null;
      if (rail.scrollTop !== grid.scrollTop) rail.scrollTop = grid.scrollTop;
    }
    grid.addEventListener("scroll", function() {
      if (raf) return;
      raf = requestAnimationFrame(sync);
    }, {
      passive: true
    });
    rail.addEventListener("scroll", function() {
      if (grid.scrollTop !== rail.scrollTop) grid.scrollTop = rail.scrollTop;
    }, {
      passive: true
    });
    rail.addEventListener("wheel", function(e) {
      grid.scrollTop += e.deltaY;
      e.preventDefault();
    }, {
      passive: false
    });
    sync();
  }
  new MutationObserver(function() {
    wire();
  }).observe(document.body, {
    childList: true,
    subtree: true
  });
  window.addEventListener("hashchange", function() {
    setTimeout(wire, 800);
  });
  setInterval(wire, 2e3);
  wire();
})();
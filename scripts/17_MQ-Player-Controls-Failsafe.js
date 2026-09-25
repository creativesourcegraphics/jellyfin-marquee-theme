/* Video OSD failsafe for the Jellyfin 12 HLS init bug. Disable if your build no longer needs it. */
(function() {
  var lastMove = 0;
  function showOsd() {
    document.querySelectorAll(".videoOsdBottom").forEach(function(el) {
      el.classList.remove("hide");
      el.classList.remove("videoOsdBottom-hidden");
      el.style.display = "";
    });
  }
  function scheduleHide() {
    lastMove = Date.now();
    setTimeout(function() {
      if (Date.now() - lastMove >= 2900) {
        document.querySelectorAll(".videoOsdBottom").forEach(function(el) {
          el.classList.add("hide");
        });
      }
    }, 3e3);
  }
  document.addEventListener("mousemove", function(e) {
    var container = e.target.closest && e.target.closest(".videoPlayerContainer");
    if (container) {
      showOsd();
      scheduleHide();
    }
  }, true);
  document.addEventListener("click", function(e) {
    var v = e.target.tagName === "VIDEO" ? e.target : null;
    if (!v) return;
    try {
      if (v.paused) {
        v.play();
      } else {
        v.pause();
      }
    } catch (err) {}
    showOsd();
    scheduleHide();
  }, true);
  document.addEventListener("viewshow", function() {
    setTimeout(function() {
      if (document.querySelector(".htmlvideoplayer")) {
        showOsd();
        scheduleHide();
      }
    }, 1500);
  });
})();
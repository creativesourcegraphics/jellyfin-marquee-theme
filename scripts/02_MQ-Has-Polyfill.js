/* :has() polyfill for older TV engines. */
(function() {
  "use strict";
  if (window.__mqHas) return;
  window.__mqHas = true;
  function tog(el, cls, on) {
    if (el.classList.contains(cls) !== on) el.classList.toggle(cls, on);
  }
  function sync() {
    var b = document.body;
    if (!b) return;
    tog(b, "mq-has-detail", !!document.querySelector(".detailPageWrapperContainer"));
    tog(b, "mq-has-player", !!document.querySelector("video.htmlvideoplayer, .videoPlayerContainer"));
    tog(b, "mq-has-osd", !!document.getElementById("videoOsdPage"));
    var i, n;
    n = document.querySelectorAll(".page.itemDetailPage");
    for (i = 0; i < n.length; i++) tog(n[i], "mq-page-has-backdrop", !!n[i].querySelector(".itemBackdrop.mq-has-backdrop"));
    n = document.querySelectorAll(".MuiAppBar-root .MuiToolbar-regular button");
    for (i = 0; i < n.length; i++) tog(n[i], "mq-avatar-btn", !!n[i].querySelector("img, .MuiAvatar-root"));
    n = document.querySelectorAll(".MuiButtonGroup-root");
    for (i = 0; i < n.length; i++) tog(n[i], "mq-playall-group", !!n[i].querySelector('button[title="Play All" i]'));
    n = document.querySelectorAll(".sectionTitleContainer");
    for (i = 0; i < n.length; i++) tog(n[i], "mq-season-sel", !!(n[i].querySelector(".season-selector-button") || n[i].querySelector(":scope > select")));
    n = document.querySelectorAll(".homePage .verticalSection, .homeSectionsContainer .verticalSection");
    for (i = 0; i < n.length; i++) {
      var s = n[i];
      if (s.classList.contains("mq-billboard")) {
        tog(s, "mq-empty-section", false);
        continue;
      }
      var noCard = !s.querySelector(".card") && !s.querySelector(".mq-season-block");
      var hide = noCard && !!s.closest(".homeSectionsContainer") || noCard && !!s.closest(".homePage") && !s.querySelector("iframe");
      tog(s, "mq-empty-section", hide);
    }
  }
  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function() {
      queued = false;
      sync();
    });
  }
  function start() {
    sync();
    new MutationObserver(schedule).observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [ "class" ]
    });
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("hashchange", schedule);
  }
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
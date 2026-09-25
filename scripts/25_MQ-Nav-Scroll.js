/* Header goes from transparent to solid on scroll. */
(function() {
  function main() {
    return document.querySelector("main.MuiBox-root");
  }
  function upd() {
    var m = main();
    var home = /^#\/(home)?(\?.*)?$/.test(location.hash || "#/");
    var top = home && m && m.scrollTop < 60;
    document.body.classList.toggle("mq-at-top", !!top);
  }
  var bound = null;
  setInterval(function() {
    var m = main();
    if (m && m !== bound) {
      bound = m;
      m.addEventListener("scroll", upd, {
        passive: true
      });
    }
    upd();
  }, 500);
  window.addEventListener("hashchange", function() {
    setTimeout(upd, 50);
  });
})();
/* No back button; Home is a permanent first tab. */
(function() {
  "use strict";
  function isHome() {
    var h = location.hash || "";
    return h === "" || h === "#/" || /^#\/home(\?|$)/.test(h);
  }
  function ensure() {
    var tb = document.querySelector(".MuiAppBar-root .MuiToolbar-root");
    if (!tb) return;
    tb.querySelectorAll(".mq-back-btn").forEach(function(b) {
      b.remove();
    });
    var brand = tb.querySelector('a[href="#/"]');
    if (!brand || !brand.parentElement) return;
    var stack = brand.parentElement;
    var home = stack.querySelector("a.mq-home-tab");
    if (!home) {
      var model = stack.querySelector("a.MuiButton-sizeMedium");
      home = document.createElement("a");
      home.className = (model ? model.className : "MuiButtonBase-root MuiButton-root MuiButton-sizeMedium") + " mq-home-tab";
      home.href = "#/home";
      home.textContent = "Home";
      home.addEventListener("click", function() {
        setTimeout(mark, 60);
      });
      stack.insertBefore(home, brand.nextSibling);
    }
    mark();
  }
  function mark() {
    var home = document.querySelector("a.mq-home-tab");
    if (!home) return;
    var on = isHome();
    home.classList.toggle("mq-nav-current", on);
    if (on) {
      document.querySelectorAll(".MuiAppBar-root .MuiToolbar-root a.MuiButton-sizeMedium.mq-nav-current").forEach(function(a) {
        if (a !== home) a.classList.remove("mq-nav-current");
      });
    }
  }
  var t = null;
  new MutationObserver(function() {
    if (t) return;
    t = setTimeout(function() {
      t = null;
      ensure();
    }, 250);
  }).observe(document.body, {
    childList: true,
    subtree: true
  });
  window.addEventListener("hashchange", function() {
    setTimeout(ensure, 50);
  });
  document.addEventListener("viewshow", function() {
    setTimeout(ensure, 50);
  });
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && !isHome() && !document.querySelector(".videoOsd, .dialog, .dialogContainer")) history.back();
  });
  ensure();
})();
/* Detail pages: show the item logo instead of the text title when one exists. */
(function() {
  var lastId = null;
  async function tryLogo() {
    var m = location.hash.match(/#\/details\?id=([a-f0-9]+)/i);
    if (!m) return;
    var itemId = m[1];
    if (itemId === lastId) return;
    var titleEl = document.querySelector('.itemName, .infoText.itemName, h1.itemName, .nameContainer h1, [class*="itemName"]');
    if (!titleEl) return;
    lastId = itemId;
    if (titleEl.dataset.mqLogoApplied === itemId) return;
    try {
      var img = new Image;
      img.onload = function() {
        if (titleEl.dataset.mqLogoApplied === itemId) return;
        titleEl.dataset.mqLogoApplied = itemId;
        titleEl.style.display = "none";
        var wrap = document.createElement("div");
        wrap.className = "mq-title-logo-wrap";
        var logo = document.createElement("img");
        logo.className = "mq-title-logo";
        logo.src = img.src;
        wrap.appendChild(logo);
        titleEl.parentElement.insertBefore(wrap, titleEl);
      };
      img.onerror = function() {
        lastId = null;
      };
      img.src = "/Items/" + itemId + "/Images/Logo?quality=90";
    } catch (e) {}
  }
  document.addEventListener("viewshow", function() {
    lastId = null;
    setTimeout(tryLogo, 250);
  });
  setInterval(tryLogo, 1e3);
  var css = ".mq-title-logo-wrap{ max-width: 360px; max-height: 100px; margin-bottom: 4px; } .mq-title-logo{ max-width: 100%; max-height: 100px; object-fit: contain; display: block; filter: drop-shadow(0 2px 8px rgba(0,0,0,.6)); }";
  var s = document.createElement("style");
  s.textContent = css;
  document.head.appendChild(s);
})();
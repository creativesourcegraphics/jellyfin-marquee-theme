/* Stop KefinTweaks' admin configuration.js from loading (retry loop on Jellyfin 12). */
(function() {
  "use strict";
  if (window.__mqKefinConfigBlocked) return;
  window.__mqKefinConfigBlocked = true;
  function isTarget(url) {
    if (!url) return false;
    var u = String(url);
    return /kefintweaks/i.test(u) && /\/configuration\.js(\?|$)/i.test(u);
  }
  var origCreate = document.createElement.bind(document);
  document.createElement = function(tag) {
    var el = origCreate.apply(null, arguments);
    if (String(tag).toLowerCase() !== "script") return el;
    try {
      var proto = Object.getPrototypeOf(el);
      var desc = Object.getOwnPropertyDescriptor(proto, "src") || Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, "src");
      if (desc && desc.set) {
        Object.defineProperty(el, "src", {
          configurable: true,
          enumerable: true,
          get: function() {
            return desc.get.call(el);
          },
          set: function(v) {
            if (isTarget(v)) {
              console.log("[MQ] blocked KefinTweaks configuration.js (infinite retry loop on JF12)");
              setTimeout(function() {
                if (typeof el.onload === "function") el.onload();
              }, 0);
              return;
            }
            desc.set.call(el, v);
          }
        });
      }
    } catch (e) {}
    return el;
  };
})();
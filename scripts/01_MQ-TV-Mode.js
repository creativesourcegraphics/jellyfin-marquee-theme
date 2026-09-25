/* TV browsers (Tizen/webOS/Roku): throttle the theme so the built-in TV apps stay responsive. Runs first. */
(function() {
  "use strict";
  if (window.__MQ_TV_MODE__) return;
  window.__MQ_TV_MODE__ = true;
  var ua = (navigator.userAgent || "") + " " + (navigator.appVersion || "");
  var isTV = /Tizen|Web0S|WebOS|webOS|NetCast|SmartTV|SMART-TV|HbbTV|Roku|AFT[BMS]|BRAVIA|VIDAA|Hisense|PhilipsTV|Opera TV/i.test(ua);
  if (!isTV && (typeof window.tizen !== "undefined" || typeof window.webOS !== "undefined" || typeof window.PalmSystem !== "undefined")) isTV = true;
  window.MQ_TV = isTV ? 1 : 0;
  if (!isTV) return;
  var html = document.documentElement;
  if (html && html.classList) html.classList.add("mq-tv");
  var MIN_INTERVAL = 500;
  var nativeSetInterval = window.setInterval;
  window.setInterval = function(fn, delay) {
    var d = typeof delay === "number" && delay < MIN_INTERVAL ? MIN_INTERVAL : delay;
    return nativeSetInterval.apply(window, [ fn, d ].concat([].slice.call(arguments, 2)));
  };
  var NativeMO = window.MutationObserver;
  var BatchedMO = function(cb) {
    var pending = null, queued = [];
    var self = this;
    var wrapped = function(records, obs) {
      queued = queued.concat(records);
      if (pending) return;
      pending = setTimeout(function() {
        var batch = queued;
        queued = [];
        pending = null;
        try {
          cb(batch, obs || self._obs);
        } catch (e) {}
      }, 120);
    };
    this._obs = new NativeMO(wrapped);
  };
  BatchedMO.prototype.observe = function() {
    return this._obs.observe.apply(this._obs, arguments);
  };
  BatchedMO.prototype.disconnect = function() {
    return this._obs.disconnect.apply(this._obs, arguments);
  };
  BatchedMO.prototype.takeRecords = function() {
    return this._obs.takeRecords.apply(this._obs, arguments);
  };
  if (NativeMO) {
    window.MutationObserver = BatchedMO;
    window.__MQ_NativeMutationObserver = NativeMO;
  }
  try {
    var s = document.createElement("style");
    s.id = "mq-tv-mode-css";
    s.textContent = "html.mq-tv *{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;}" + "html.mq-tv *{text-shadow:none!important;}" + "html.mq-tv .cardBox,html.mq-tv .card,html.mq-tv .cardImageContainer{box-shadow:none!important;}" + "html.mq-tv *{transition-duration:.12s!important;animation-duration:.12s!important;}" + "html.mq-tv .backdropImage,html.mq-tv .itemBackdrop{filter:none!important;}";
    (document.head || html).appendChild(s);
  } catch (e) {}
  try {
    console.log("[MQ-TV-Mode] TV browser detected — reduced-motion/low-poll mode active");
  } catch (e) {}
})();
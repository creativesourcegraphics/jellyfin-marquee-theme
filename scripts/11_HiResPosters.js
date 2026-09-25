/* Request larger poster/thumb images for 4K displays. */
(function() {
  var TARGET_DPR = 2;
  var QUALITY = 95;
  var CAP_W = 1600, CAP_H = 2400;
  function onLiveTv() {
    return (location.hash || "").indexOf("livetv.html") >= 0;
  }
  function pick(cssPx, current, cap) {
    var want = Math.round((cssPx || 0) * TARGET_DPR);
    if (want > cap) want = cap;
    if (!current) return want || null;
    return want > current ? want : current;
  }
  function retune(u, w, h) {
    try {
      if (!u || u.indexOf("/Images/") < 0) {
        return u;
      }
      u = u.replace(/fillWidth=(\d+)/, function(m, n) {
        var v = pick(w, +n, CAP_W);
        return "fillWidth=" + v;
      });
      u = u.replace(/fillHeight=(\d+)/, function(m, n) {
        var v = pick(h, +n, CAP_H);
        return "fillHeight=" + v;
      });
      u = u.replace(/maxWidth=(\d+)/, function(m, n) {
        var v = pick(w, +n, CAP_W);
        return "maxWidth=" + v;
      });
      u = u.replace(/maxHeight=(\d+)/, function(m, n) {
        var v = pick(h, +n, CAP_H);
        return "maxHeight=" + v;
      });
      if (/quality=\d+/.test(u)) {
        u = u.replace(/quality=\d+/, "quality=" + QUALITY);
      } else {
        u = u + (u.indexOf("?") < 0 ? "?" : "&") + "quality=" + QUALITY;
      }
      return u;
    } catch (e) {
      return u;
    }
  }
  function skip(el) {
    return el.closest && el.closest("[data-type='TvChannel'],.guide-channelHeaderCell");
  }
  var pending = {};
  function near(r) {
    return r.bottom > -600 && r.top < (window.innerHeight || 900) + 900;
  }
  function swapWhenReady(url, apply) {
    if (pending[url]) return;
    pending[url] = 1;
    var pre = new Image;
    pre.onload = function() {
      delete pending[url];
      if (pre.naturalWidth) apply();
    };
    pre.onerror = function() {
      delete pending[url];
    };
    pre.src = url;
  }
  function applySrc(el, url) {
    swapWhenReady(url, function() {
      el.src = url;
    });
  }
  function applyBg(el, url) {
    swapWhenReady(url, function() {
      el.style.backgroundImage = 'url("' + url + '")';
    });
  }
  function fix() {
    if (onLiveTv()) {
      return;
    }
    var imgs = document.querySelectorAll(".card:not([data-type='TvChannel']) img,.cardImageContainer img");
    for (var i = 0; i < imgs.length; i++) {
      var im = imgs[i];
      if (skip(im)) {
        im.setAttribute("data-hi", "1");
        continue;
      }
      var r = im.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) {
        continue;
      }
      if (!near(r)) {
        continue;
      }
      var s = im.getAttribute("src") || im.src;
      if (!s || s.indexOf("/Images/") < 0) {
        continue;
      }
      var b = retune(s, r.width, r.height);
      if (im.getAttribute("data-hi") === "1" && b === s) {
        continue;
      }
      im.setAttribute("data-hi", "1");
      if (b !== s) {
        applySrc(im, b);
      }
    }
    var divs = document.querySelectorAll(".cardImage,.cardImageContainer");
    for (var j = 0; j < divs.length; j++) {
      var d = divs[j];
      if (skip(d)) {
        d.setAttribute("data-hi", "1");
        continue;
      }
      var rr = d.getBoundingClientRect();
      if (rr.width < 8 || rr.height < 8) {
        continue;
      }
      if (!near(rr)) {
        continue;
      }
      var bg = d.style.backgroundImage;
      if (!bg || bg.indexOf("/Images/") < 0) {
        continue;
      }
      var m = bg.match(/url\(["']?([^"')]+)["']?\)/);
      if (!m) {
        continue;
      }
      var b2 = retune(m[1], rr.width, rr.height);
      if (d.getAttribute("data-hi") === "1" && b2 === m[1]) {
        continue;
      }
      d.setAttribute("data-hi", "1");
      if (b2 !== m[1]) {
        applyBg(d, b2);
      }
    }
  }
  window.__mqHiRes = {
    pick: pick,
    retune: retune,
    TARGET_DPR: TARGET_DPR,
    QUALITY: QUALITY
  };
  setInterval(fix, 2e3);
})();
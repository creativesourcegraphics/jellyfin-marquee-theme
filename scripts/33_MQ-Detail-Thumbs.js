/* Detail page: thumbs up/down (Jellyfin Likes) instead of shuffle/mark-played/favourite. */
(function() {
  "use strict";
  if (window.__mqThumbs) return;
  window.__mqThumbs = true;
  var UP = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M7 10v11H3V10h4zm0 0l4.2-7.2c.4-.7 1.3-1 2-.6 .8.4 1.1 1.3.9 2.1L13 9h6.3c1.2 0 2.1 1.1 1.9 2.3l-1.4 8c-.2 1-1 1.7-2 1.7H7"/></svg>';
  var DOWN = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" style="transform:rotate(180deg)"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M7 10v11H3V10h4zm0 0l4.2-7.2c.4-.7 1.3-1 2-.6 .8.4 1.1 1.3.9 2.1L13 9h6.3c1.2 0 2.1 1.1 1.9 2.3l-1.4 8c-.2 1-1 1.7-2 1.7H7"/></svg>';
  function css() {
    if (document.getElementById("mq-thumbs-css")) return;
    var s = document.createElement("style");
    s.id = "mq-thumbs-css";
    s.textContent = "html body .itemDetailPage .detailRibbon .mainDetailButtons>button.btnShuffle.detailButton,html body .itemDetailPage .detailRibbon .mainDetailButtons>button.btnPlaystate.detailButton,html body .itemDetailPage .detailRibbon .mainDetailButtons>button.btnUserRating.detailButton{display:none!important}" + ".itemDetailPage .mq-thumb{width:42px;height:42px;min-width:42px;border-radius:50%!important;border:2px solid rgba(255,255,255,.5)!important;background:rgba(42,42,42,.6)!important;color:#fff!important;display:inline-flex!important;align-items:center;justify-content:center;padding:0!important;margin:0 .35em!important;cursor:pointer;transition:border-color .15s,background .15s,transform .15s}" + ".itemDetailPage .mq-thumb:hover{border-color:#fff!important;background:rgba(255,255,255,.12)!important;transform:scale(1.06)}" + ".itemDetailPage .mq-thumb.on{border-color:#fff!important;background:#fff!important;color:#141414!important}" + ".itemDetailPage .mq-thumb.on svg path{fill:currentColor}";
    document.head.appendChild(s);
  }
  function idFromHash() {
    var m = (location.hash || "").match(/[?&]id=([a-f0-9]{32})/i);
    return m ? m[1] : null;
  }
  function live(sel) {
    var a = document.querySelectorAll(sel);
    for (var i = a.length - 1; i >= 0; i--) {
      var r = a[i].getBoundingClientRect();
      if (r.width > 0 && r.height > 0) return a[i];
    }
    return null;
  }
  function api(method, path) {
    var ac = window.ApiClient;
    if (!ac || !ac.accessToken) return Promise.reject();
    return fetch((ac.serverAddress ? ac.serverAddress() : "") + path, {
      method: method,
      headers: {
        Authorization: 'MediaBrowser Token="' + ac.accessToken() + '"'
      }
    }).then(function(r) {
      return r.ok ? r.json().catch(function() {
        return null;
      }) : Promise.reject(r.status);
    });
  }
  function paint(row, likes) {
    var u = row.querySelector(".mq-thumb-up"), d = row.querySelector(".mq-thumb-down");
    if (u) u.classList.toggle("on", likes === true);
    if (d) d.classList.toggle("on", likes === false);
  }
  function build() {
    var id = idFromHash();
    if (!id) return;
    var row = live(".itemDetailPage .mainDetailButtons");
    if (!row) return;
    row.querySelectorAll(".btnShuffle, .btnPlaystate, .btnUserRating").forEach(function(b) {
      b.style.setProperty("display", "none", "important");
    });
    if (row.dataset.mqThumbsFor === id && row.querySelector(".mq-thumb")) return;
    row.querySelectorAll(".mq-thumb").forEach(function(b) {
      b.remove();
    });
    row.dataset.mqThumbsFor = id;
    css();
    var uid = window.ApiClient && ApiClient.getCurrentUserId && ApiClient.getCurrentUserId();
    if (!uid) return;
    function mk(cls, svg, title, val) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "mq-thumb detailButton emby-button button-flat " + cls;
      b.title = title;
      b.setAttribute("aria-label", title);
      b.innerHTML = svg;
      b.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        var isOn = b.classList.contains("on");
        var req = isOn ? api("DELETE", "/UserItems/" + id + "/Rating?userId=" + uid) : api("POST", "/UserItems/" + id + "/Rating?userId=" + uid + "&likes=" + val);
        req.then(function(ud) {
          paint(row, ud ? ud.Likes : null);
        }).catch(function() {});
      });
      return b;
    }
    var up = mk("mq-thumb-up", UP, "I like this", "true"), down = mk("mq-thumb-down", DOWN, "Not for me", "false");
    var after = row.querySelector(".watchlist-icon") || row.querySelector(".btnPlayTrailer") || row.querySelector(".btnPlay");
    if (after && after.parentElement === row) {
      row.insertBefore(down, after.nextSibling);
      row.insertBefore(up, down);
    } else {
      row.appendChild(up);
      row.appendChild(down);
    }
    api("GET", "/UserItems/" + id + "/UserData?userId=" + uid).then(function(ud) {
      paint(row, ud ? ud.Likes : null);
    }).catch(function() {});
  }
  var t = null;
  new MutationObserver(function() {
    if (t) return;
    t = setTimeout(function() {
      t = null;
      if (idFromHash()) build();
    }, 250);
  }).observe(document.body, {
    childList: true,
    subtree: true
  });
  window.addEventListener("hashchange", function() {
    setTimeout(build, 300);
  });
  css();
})();
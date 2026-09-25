/* One "Editor's Choice" billboard after the second home row. */
(function() {
  "use strict";
  var CSS = [ ".mq-billboard{position:relative;margin:26px 3.3% 30px;height:clamp(260px,34vw,460px);border-radius:12px;overflow:hidden;background:#111;box-shadow:0 12px 40px rgba(0,0,0,.55)}", ".mq-billboard .mq-bb-bg{position:absolute;inset:0;background-size:cover;background-position:center 20%;transform:scale(1.02);transition:transform .8s ease}", ".mq-billboard:hover .mq-bb-bg{transform:scale(1.05)}", ".mq-billboard .mq-bb-shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.88) 0%,rgba(0,0,0,.55) 40%,rgba(0,0,0,0) 70%),linear-gradient(0deg,rgba(20,20,20,.9) 0%,rgba(0,0,0,0) 40%)}", ".mq-billboard .mq-bb-tag{position:absolute;top:18px;left:28px;font-size:11px;font-weight:800;letter-spacing:.18em;color:#fff;background:#e50914;padding:4px 9px;border-radius:3px}", ".mq-billboard .mq-bb-body{position:absolute;left:28px;bottom:26px;width:min(46%,560px);color:#fff}", ".mq-billboard .mq-bb-logo{max-width:min(60%,360px);max-height:120px;object-fit:contain;display:block;margin-bottom:12px;filter:drop-shadow(0 4px 12px rgba(0,0,0,.7))}", ".mq-billboard .mq-bb-title{font-size:clamp(22px,2.6vw,40px);font-weight:800;line-height:1.05;margin:0 0 10px;text-shadow:0 3px 14px rgba(0,0,0,.8)}", ".mq-billboard .mq-bb-meta{font-size:13px;color:#ddd;margin-bottom:8px;font-weight:600}", ".mq-billboard .mq-bb-meta b{color:#46d369}", ".mq-billboard .mq-bb-plot{font-size:14px;line-height:1.4;color:#eaeaea;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:16px;text-shadow:0 2px 8px rgba(0,0,0,.8)}", ".mq-billboard .mq-bb-btns{display:flex;gap:10px}", ".mq-billboard .mq-bb-btn{display:inline-flex;align-items:center;gap:8px;border:0;border-radius:6px;padding:10px 22px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit}", ".mq-billboard .mq-bb-play{background:#fff;color:#000}.mq-billboard .mq-bb-play:hover{background:#e6e6e6}", ".mq-billboard .mq-bb-info{background:rgba(109,109,110,.7);color:#fff}.mq-billboard .mq-bb-info:hover{background:rgba(109,109,110,.5)}", "@media (max-width:800px){.mq-billboard .mq-bb-body{width:80%}.mq-billboard{height:56vw}}" ].join("\n");
  function api() {
    return window.ApiClient;
  }
  function injectCss() {
    if (document.getElementById("mq-billboards-css")) return;
    var s = document.createElement("style");
    s.id = "mq-billboards-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  function dayKey() {
    var d = new Date;
    return d.getFullYear() * 1e3 + Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5);
  }
  var pool = null, building = false;
  function loadPool() {
    if (pool) return Promise.resolve(pool);
    var a = api();
    if (!a) return Promise.reject();
    var uid = a.getCurrentUserId();
    var url = a.getUrl("Users/" + uid + "/Items", {
      IncludeItemTypes: "Movie,Series",
      Recursive: true,
      SortBy: "DateCreated",
      SortOrder: "Descending",
      Limit: 60,
      Fields: "Overview,ProductionYear,OfficialRating,CommunityRating,RunTimeTicks,ImageTags,BackdropImageTags,Genres",
      ImageTypes: "Backdrop",
      HasBackdrop: true,
      IsPlayed: false
    });
    return a.ajax({
      type: "GET",
      url: url,
      dataType: "json"
    }).then(function(r) {
      pool = (r.Items || []).filter(function(i) {
        return i.BackdropImageTags && i.BackdropImageTags.length;
      });
      return pool;
    });
  }
  function pick(n, idx) {
    if (!pool || !pool.length) return null;
    var seed = dayKey();
    return pool[(seed * 7 + idx * 13) % pool.length];
  }
  function imgUrl(item, type, tag, w) {
    var a = api();
    return a.getUrl("Items/" + item.Id + "/Images/" + type, {
      tag: tag,
      maxWidth: w || 1600,
      quality: 88
    });
  }
  function meta(i) {
    var p = [];
    if (i.ProductionYear) p.push(i.ProductionYear);
    if (i.OfficialRating) p.push(i.OfficialRating);
    if (i.RunTimeTicks && i.Type === "Movie") p.push(Math.round(i.RunTimeTicks / 6e8) + " min");
    if (i.Genres && i.Genres.length) p.push(i.Genres.slice(0, 2).join(" · "));
    var m = p.join("  ·  ");
    if (i.CommunityRating) m = "<b>" + Math.round(i.CommunityRating * 10) + "% match</b>  ·  " + m;
    return m;
  }
  function build(item, label) {
    var el = document.createElement("div");
    el.className = "mq-billboard verticalSection";
    el.setAttribute("data-mq-bb", item.Id);
    var bg = imgUrl(item, "Backdrop/0", item.BackdropImageTags[0], 1900);
    var logo = item.ImageTags && item.ImageTags.Logo ? imgUrl(item, "Logo", item.ImageTags.Logo, 600) : null;
    el.innerHTML = '<div class="mq-bb-bg" style="background-image:url(&quot;' + bg + '&quot;)"></div><div class="mq-bb-shade"></div>' + '<div class="mq-bb-tag">' + label + '</div><div class="mq-bb-body">' + (logo ? '<img class="mq-bb-logo" alt="" src="' + logo + '">' : '<h2 class="mq-bb-title"></h2>') + '<div class="mq-bb-meta">' + meta(item) + '</div><div class="mq-bb-plot"></div>' + '<div class="mq-bb-btns"><button class="mq-bb-btn mq-bb-play">&#9654;&nbsp; Play</button><button class="mq-bb-btn mq-bb-info">&#9432;&nbsp; More Info</button></div></div>';
    if (!logo) el.querySelector(".mq-bb-title").textContent = item.Name;
    el.querySelector(".mq-bb-plot").textContent = item.Overview || "";
    var sid = api().serverId();
    el.querySelector(".mq-bb-info").addEventListener("click", function(e) {
      e.stopPropagation();
      location.hash = "#/details?id=" + item.Id + "&serverId=" + sid;
    });
    el.querySelector(".mq-bb-play").addEventListener("click", function(e) {
      e.stopPropagation();
      if (window.playbackManager) {
        window.playbackManager.play({
          ids: [ item.Id ],
          serverId: sid
        });
      } else location.hash = "#/details?id=" + item.Id + "&serverId=" + sid;
    });
    el.addEventListener("click", function() {
      location.hash = "#/details?id=" + item.Id + "&serverId=" + sid;
    });
    return el;
  }
  function visibleRows(container) {
    var rows = [ ...container.querySelectorAll(":scope > .verticalSection:not(.mq-billboard)") ].filter(function(s) {
      return s.offsetHeight > 40;
    });
    rows.forEach(function(r, i) {
      r._mqIdx = i;
      r._mqOrder = parseInt(getComputedStyle(r).order, 10) || 0;
    });
    return rows.sort(function(a, b) {
      return a._mqOrder - b._mqOrder || a._mqIdx - b._mqIdx;
    });
  }
  function place() {
    if (building) return;
    var c = document.querySelector("#indexPage:not(.hide) .homeSectionsContainer");
    if (!c) return;
    if (c.querySelectorAll(".mq-billboard").length >= 2) return;
    var rows = visibleRows(c);
    if (rows.length < 3) return;
    building = true;
    loadPool().then(function() {
      injectCss();
      var slots = [ [ rows[1], 0, "EDITOR’S CHOICE" ] ];
      slots.forEach(function(s) {
        var after = s[0], item = pick(2, s[1]);
        if (!item || !after || after.nextElementSibling && after.nextElementSibling.classList.contains("mq-billboard")) return;
        if (c.querySelector('.mq-billboard[data-mq-bb="' + item.Id + '"]')) item = pick(2, s[1] + 2) || item;
        var bb = build(item, s[2]);
        bb.style.order = String(after._mqOrder || 0);
        after.insertAdjacentElement("afterend", bb);
      });
    }).catch(function() {}).then(function() {
      building = false;
    });
  }
  var t = null;
  new MutationObserver(function() {
    if (t) return;
    t = setTimeout(function() {
      t = null;
      place();
    }, 500);
  }).observe(document.body, {
    childList: true,
    subtree: true
  });
  document.addEventListener("viewshow", function() {
    setTimeout(place, 800);
  });
  setTimeout(place, 1500);
})();
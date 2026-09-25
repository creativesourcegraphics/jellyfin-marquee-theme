/* Detail page: full-bleed backdrop, local trailer, ratings row, seasons, anthology grouping (MQ_CONFIG). */
(function() {
  "use strict";
  var CFG = window.MQ_CONFIG || {};
  var TRAILER_BACKDROPS = CFG.trailerBackdrops || {};
  function paintTrailerBackdrop() {
    var id = itemIdFromHash();
    var band = liveEl(".itemBackdrop");
    if (!band) return;
    var srcId = id && TRAILER_BACKDROPS[id];
    if (!srcId) {
      var stray = band.querySelector(".mq-band-video");
      if (stray && stray.parentElement) stray.parentElement.removeChild(stray);
      delete band.dataset.mqBandVideo;
      return;
    }
    if (band.dataset.mqBandVideo === id) return;
    band.dataset.mqBandVideo = id;
    var prev = band.querySelector(".mq-band-video");
    if (prev && prev.parentElement) prev.parentElement.removeChild(prev);
    var ac = window.ApiClient;
    if (!ac || !ac.accessToken) {
      delete band.dataset.mqBandVideo;
      return;
    }
    var base = ac.serverAddress ? ac.serverAddress() : "";
    mqApi("/Users/" + ac.getCurrentUserId() + "/Items/" + srcId + "/LocalTrailers").then(function(list) {
      if (!list || !list.length) return;
      if (!document.body.contains(band)) return;
      var wrap = document.createElement("div");
      wrap.className = "mq-band-video";
      var v = document.createElement("video");
      v.muted = true;
      v.defaultMuted = true;
      v.loop = true;
      v.autoplay = true;
      v.playsInline = true;
      v.preload = "auto";
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "");
      v.src = base + "/Videos/" + list[0].Id + "/stream.mp4?static=true&api_key=" + ac.accessToken();
      wrap.appendChild(v);
      band.appendChild(wrap);
      var p = v.play();
      if (p && p.catch) p.catch(function() {});
      v.addEventListener("canplay", function() {
        setTimeout(function() {
          wrap.classList.add("on");
        }, 250);
      }, {
        once: true
      });
    }).catch(function() {
      delete band.dataset.mqBandVideo;
    });
  }
  function itemIdFromHash() {
    var m = (location.hash || "").match(/[?&]id=([a-f0-9]{32})/i);
    return m ? m[1] : null;
  }
  function liveEl(sel) {
    var all = document.querySelectorAll(sel);
    for (var i = all.length - 1; i >= 0; i--) {
      var r = all[i].getBoundingClientRect();
      if (r.width > 0 && r.height > 0) return all[i];
    }
    return all.length ? all[all.length - 1] : null;
  }
  function mqApi(path) {
    var ac = window.ApiClient;
    if (!ac || !ac.accessToken) return Promise.reject("no ApiClient");
    var base = ac.serverAddress ? ac.serverAddress() : "";
    return fetch(base + path, {
      headers: {
        Authorization: 'MediaBrowser Token="' + ac.accessToken() + '"'
      }
    }).then(function(r) {
      if (!r.ok) throw r.status;
      return r.json();
    });
  }
  var itemCache = {};
  function getItemCached(id) {
    var u = uid();
    if (!u) return Promise.reject("no user");
    var k = u + ":" + id;
    if (!itemCache[k]) {
      itemCache[k] = mqApi("/Users/" + u + "/Items/" + id).catch(function(e) {
        delete itemCache[k];
        throw e;
      });
      setTimeout(function() {
        delete itemCache[k];
      }, 12e4);
    }
    return itemCache[k];
  }
  function uid() {
    var ac = window.ApiClient;
    return ac && ac.getCurrentUserId ? ac.getCurrentUserId() : null;
  }
  function firstArtwork(id, depth) {
    var u = uid();
    if (!u || depth > 2) return Promise.resolve(null);
    return mqApi("/Users/" + u + "/Items?ParentId=" + id + "&Limit=10&Fields=BackdropImageTags,ImageTags").then(function(r) {
      var kids = r && r.Items || [];
      var OK = {
        Movie: 1,
        Series: 1,
        Season: 1,
        Episode: 1,
        BoxSet: 1,
        Video: 1,
        MusicVideo: 1
      };
      kids = kids.filter(function(k) {
        if (!OK[k.Type]) return false;
        return true;
      });
      for (var i = 0; i < kids.length; i++) {
        if (kids[i].BackdropImageTags && kids[i].BackdropImageTags.length) return {
          id: kids[i].Id,
          kind: "Backdrop/0"
        };
      }
      for (var j = 0; j < kids.length; j++) {
        if (kids[j].ImageTags && kids[j].ImageTags.Primary) return {
          id: kids[j].Id,
          kind: "Primary"
        };
      }
      var sets = (r && r.Items || []).filter(function(k) {
        return k.Type === "BoxSet" || k.Type === "Season";
      });
      if (!sets.length) return null;
      var n = 0;
      return function next() {
        if (n >= sets.length) return null;
        return firstArtwork(sets[n++].Id, depth + 1).then(function(hit) {
          return hit || next();
        });
      }();
    }).catch(function() {
      return null;
    });
  }
  function imgUrl(id, tag, kind, h) {
    var ac = window.ApiClient;
    var base = ac && ac.serverAddress ? ac.serverAddress() : "";
    return base + "/Items/" + id + "/Images/" + (kind || "Primary") + "?maxHeight=" + (h || 180) + "&quality=80" + (tag ? "&tag=" + tag : "");
  }
  function applyBackdrop(host, url) {
    host.style.setProperty("background-image", 'linear-gradient(to top, rgba(20,20,20,1) 0%, rgba(20,20,20,.35) 45%, rgba(20,20,20,0) 100%), url("' + url + '")', "important");
    host.style.setProperty("background-size", "cover", "important");
    host.style.setProperty("background-position", "center top", "important");
    host.style.setProperty("background-repeat", "no-repeat", "important");
    host.style.setProperty("opacity", "1", "important");
    host.classList.add("mq-has-backdrop");
    document.body.classList.remove("mq-no-backdrop");
  }
  function stripHiddenBackdrops() {
    var els = document.querySelectorAll(".backdropContainer, .backdropImage, .backgroundContainer");
    for (var i = 0; i < els.length; i++) {
      var e = els[i];
      var c = getComputedStyle(e);
      var r = e.getBoundingClientRect();
      var invisible = c.display === "none" || parseFloat(c.opacity) === 0 || r.width < 2 || r.height < 2;
      if (!invisible) continue;
      var bgv = c.backgroundImage || "";
      if (bgv.indexOf("url(") === -1) continue;
      e.style.setProperty("background-image", "none", "important");
      e.dataset.mqStripped = "1";
    }
  }
  var bdCache = {};
  function resolveBackdrop(id) {
    if (Object.prototype.hasOwnProperty.call(bdCache, id)) return Promise.resolve(bdCache[id]);
    var u = uid();
    var q = "/Items?ids=" + id + (u ? "&userId=" + u : "");
    return mqApi(q).then(function(r) {
      var it = r && r.Items && r.Items[0];
      if (!it) return "";
      if (it.BackdropImageTags && it.BackdropImageTags.length) return "/Items/" + id + "/Images/Backdrop/0?maxWidth=1920&quality=80&tag=" + it.BackdropImageTags[0];
      if (it.ParentBackdropItemId && it.ParentBackdropImageTags && it.ParentBackdropImageTags.length) return "/Items/" + it.ParentBackdropItemId + "/Images/Backdrop/0?maxWidth=1920&quality=80&tag=" + it.ParentBackdropImageTags[0];
      return firstArtwork(id, 0).then(function(hit) {
        return hit ? "/Items/" + hit.id + "/Images/" + hit.kind + "?maxWidth=1920&quality=80" : "";
      });
    }).catch(function() {
      return null;
    }).then(function(url) {
      if (url !== null) bdCache[id] = url;
      return url;
    });
  }
  function paintBackdrop() {
    var id = itemIdFromHash();
    if (!id) return;
    var host = liveEl(".itemBackdrop") || liveEl(".backdropContainer");
    if (!host) return;
    if (host.dataset.mqBackdropId === id) {
      var want = host.dataset.mqBdUrl;
      if (want === "") return;
      if (want && (getComputedStyle(host).backgroundImage || "").indexOf(want.split("?")[0]) !== -1) return;
      if (host.dataset.mqBdPending === id) return;
    }
    host.dataset.mqBackdropId = id;
    host.dataset.mqBdPending = id;
    resolveBackdrop(id).then(function(url) {
      if (itemIdFromHash() !== id) {
        delete host.dataset.mqBdPending;
        return;
      }
      if (url === null) {
        delete host.dataset.mqBdPending;
        delete host.dataset.mqBackdropId;
        return;
      }
      if (!url) {
        delete host.dataset.mqBdPending;
        host.dataset.mqBdUrl = "";
        host.style.removeProperty("background-image");
        document.body.classList.add("mq-no-backdrop");
        return;
      }
      var probe = new Image;
      probe.onload = function() {
        delete host.dataset.mqBdPending;
        if (itemIdFromHash() !== id) return;
        host.dataset.mqBdUrl = url;
        applyBackdrop(host, url);
      };
      probe.onerror = function() {
        delete host.dataset.mqBdPending;
        host.dataset.mqBdUrl = "";
        delete bdCache[id];
      };
      probe.src = url;
    });
  }
  function clearPosterBlurhash() {
    var box = liveEl(".detailImageContainer .cardImageContainer, .detailImageContainer .cardBox, .detailImageContainer .cardPadder");
    if (!box) return;
    var scope = box.closest(".cardScalable") || box.closest(".detailImageContainer") || box;
    var cvs = scope.querySelectorAll("canvas.blurhash-canvas");
    if (!cvs.length) return;
    var bg = getComputedStyle(box).backgroundImage || "";
    var m = bg.match(/url\(["']?([^"')]+)["']?\)/);
    if (!m) return;
    if (box.dataset.mqBlurUrl === m[1]) return;
    box.dataset.mqBlurUrl = m[1];
    var probe = new Image;
    probe.onload = function() {
      if (!probe.naturalWidth) return;
      scope.querySelectorAll("canvas.blurhash-canvas").forEach(function(c) {
        c.style.setProperty("display", "none", "important");
      });
    };
    probe.onerror = function() {
      box.dataset.mqBlurUrl = "";
    };
    probe.src = m[1];
  }
  function paintPoster() {
    var id = itemIdFromHash();
    if (!id) return;
    var box = liveEl(".detailImageContainer .cardImageContainer, .detailImageContainer .cardBox, .detailImageContainer .cardPadder");
    if (!box) return;
    if (box.dataset.mqPosterId === id && (getComputedStyle(box).backgroundImage || "").indexOf("/Items/" + id + "/") !== -1) return;
    var im = box.querySelector("img");
    var hasImg = im && (im.currentSrc || im.getAttribute("src")) || getComputedStyle(box).backgroundImage.indexOf("url(") === 0;
    if (hasImg) {
      box.dataset.mqPosterId = id;
      return;
    }
    var u = uid();
    if (!u) return;
    box.dataset.mqPosterId = id;
    function put(url) {
      box.style.setProperty("background-image", 'url("' + url + '")', "important");
      box.style.setProperty("background-size", "cover", "important");
      box.style.setProperty("background-position", "center", "important");
    }
    var own = "/Items/" + id + "/Images/Primary?maxHeight=600&quality=85";
    var probe = new Image;
    probe.onload = function() {
      if (probe.naturalWidth) {
        put(own);
        return;
      }
      probe.onerror();
    };
    probe.onerror = function() {
      firstArtwork(id, 0).then(function(hit) {
        if (!hit) {
          box.dataset.mqPosterId = "";
          return;
        }
        put("/Items/" + hit.id + "/Images/" + (hit.kind === "Primary" ? "Primary" : "Primary") + "?maxHeight=600&quality=85");
      });
    };
    probe.src = own;
  }
  function mins(ticks) {
    if (!ticks) return "";
    return Math.round(ticks / 6e8) + "m";
  }
  function episodeRow(seriesId, ep) {
    var row = document.createElement("div");
    row.className = "mq-ep-row";
    row.setAttribute("data-id", ep.Id);
    var thumb = document.createElement("div");
    thumb.className = "mq-ep-thumb";
    var tag = ep.ImageTags && ep.ImageTags.Primary;
    var src = tag ? imgUrl(ep.Id, tag, "Primary", 200) : imgUrl(seriesId, null, "Backdrop/0", 200);
    var im = document.createElement("img");
    im.loading = "lazy";
    im.src = src;
    im.alt = ep.Name || "";
    thumb.appendChild(im);
    var pl = document.createElement("span");
    pl.className = "mq-ep-play";
    thumb.appendChild(pl);
    var num = document.createElement("div");
    num.className = "mq-ep-num";
    num.textContent = ep.IndexNumber != null ? ep.IndexNumber : "";
    var body = document.createElement("div");
    body.className = "mq-ep-body";
    var head = document.createElement("div");
    head.className = "mq-ep-head";
    var nm = document.createElement("span");
    nm.className = "mq-ep-name";
    nm.textContent = ep.Name || "Episode";
    var rt = document.createElement("span");
    rt.className = "mq-ep-time";
    rt.textContent = mins(ep.RunTimeTicks);
    head.appendChild(nm);
    head.appendChild(rt);
    var ov = document.createElement("p");
    ov.className = "mq-ep-ov";
    ov.textContent = ep.Overview || "";
    body.appendChild(head);
    body.appendChild(ov);
    if (ep.UserData && ep.UserData.Played) {
      var w = document.createElement("span");
      w.className = "mq-ep-watched";
      w.textContent = "✓";
      head.appendChild(w);
    }
    if (ep.UserData && ep.UserData.PlayedPercentage > 1) {
      var bar = document.createElement("span");
      bar.className = "mq-ep-resume";
      bar.style.width = Math.min(100, ep.UserData.PlayedPercentage) + "%";
      thumb.appendChild(bar);
    }
    row.appendChild(num);
    row.appendChild(thumb);
    row.appendChild(body);
    row.addEventListener("click", function() {
      location.hash = "#/details?id=" + ep.Id;
    });
    return row;
  }
  function hideNativeSeasonUi(root) {
    var sels = root.querySelectorAll("select");
    for (var i = 0; i < sels.length; i++) {
      var w = sels[i].closest(".sectionTitleContainer, .verticalSection");
      if (w) w.style.setProperty("display", "none", "important");
    }
    var h2s = root.querySelectorAll("h2.sectionTitle, .sectionTitle");
    for (var j = 0; j < h2s.length; j++) {
      if (/^seasons?$/i.test(h2s[j].textContent.trim())) {
        var v = h2s[j].closest(".verticalSection");
        if (v && !v.classList.contains("mq-season-stack")) v.style.setProperty("display", "none", "important");
      }
    }
    var kids = root.querySelectorAll(".childrenItemsContainer, #childrenContent .itemsContainer");
    for (var k = 0; k < kids.length; k++) {
      var vs = kids[k].closest(".verticalSection") || kids[k];
      if (!vs.classList.contains("mq-season-stack")) vs.style.setProperty("display", "none", "important");
    }
    var titles = root.querySelectorAll("h2.sectionTitle, .sectionTitle");
    for (var t = 0; t < titles.length; t++) {
      var txt = (titles[t].textContent || "").trim();
      if (!/^season\s*\d+/i.test(txt) && !/^episodes?$/i.test(txt)) continue;
      var sec = titles[t].closest(".verticalSection");
      if (!sec) continue;
      if (sec.classList.contains("mq-season-stack")) continue;
      if (sec.querySelector(".mq-season-stack")) continue;
      sec.style.setProperty("display", "none", "important");
    }
  }
  var SB_CSS = [ ".mq-season-stack.mq-sb{display:block!important;max-width:none!important;margin:30px 0 48px!important;padding:0 clamp(16px,3.3vw,60px)!important;box-sizing:border-box}", ".mq-sb-h{font-size:clamp(18px,1.4vw,24px);font-weight:700;color:#fff;margin:0 0 12px}", ".mq-sb-seasons{display:flex;gap:clamp(10px,1vw,18px);overflow-x:auto;padding:6px 4px 14px;scroll-snap-type:x proximity;scrollbar-width:thin}", ".mq-sb-season{flex:0 0 auto;width:clamp(92px,8.2vw,150px);background:none;border:0;padding:0;margin:0;cursor:pointer;text-align:left;font:inherit;scroll-snap-align:start}", ".mq-sb-poster{display:block;width:100%;aspect-ratio:2/3;border-radius:6px;background:#23232a center/cover no-repeat;box-shadow:0 4px 14px rgba(0,0,0,.5);outline:3px solid transparent;outline-offset:2px;transition:outline-color .15s,transform .15s,opacity .15s;opacity:.72}", ".mq-sb-season:hover .mq-sb-poster,.mq-sb-season:focus-visible .mq-sb-poster{opacity:1;transform:translateY(-2px)}", ".mq-sb-season.on .mq-sb-poster{outline-color:#e50914;opacity:1}", ".mq-sb-sname{display:block;margin-top:8px;font-size:14px;font-weight:600;color:#bdbdbd;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}", ".mq-sb-season.on .mq-sb-sname{color:#fff}", ".mq-sb-scount{display:block;font-size:12px;color:#8c8c8c;margin-top:1px}", ".mq-sb-info{margin:16px 0 18px;max-width:1100px}", ".mq-sb-info h3{font-size:clamp(20px,1.7vw,28px);font-weight:700;color:#fff;margin:0 0 4px}", ".mq-sb-meta{font-size:13px;color:#a3a3a3;margin:0 0 8px}", ".mq-sb-info p{font-size:14px;line-height:1.5;color:#bcbcbc;margin:0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}", ".mq-sb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(clamp(230px,20vw,360px),1fr));gap:clamp(14px,1.3vw,24px)}", ".mq-sb-ep{cursor:pointer;min-width:0;outline:none}", ".mq-sb-thumb{position:relative;aspect-ratio:16/9;border-radius:6px;overflow:hidden;background:#23232a}", ".mq-sb-thumb img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .25s ease}", ".mq-sb-ep:hover .mq-sb-thumb img,.mq-sb-ep:focus-visible .mq-sb-thumb img{transform:scale(1.04)}", ".mq-sb-num{position:absolute;left:8px;top:7px;font-size:13px;font-weight:700;color:#fff;background:rgba(0,0,0,.62);padding:2px 8px;border-radius:4px}", ".mq-sb-rt{position:absolute;right:8px;bottom:9px;font-size:12px;font-weight:600;color:#fff;background:rgba(0,0,0,.66);padding:2px 6px;border-radius:4px}", ".mq-sb-play{position:absolute;inset:0;margin:auto;width:54px;height:54px;border-radius:50%;background:rgba(0,0,0,.55);border:2px solid #fff;opacity:0;transition:opacity .15s,transform .15s;cursor:pointer;padding:0}", '.mq-sb-play::after{content:"";position:absolute;left:21px;top:15px;border-left:17px solid #fff;border-top:10px solid transparent;border-bottom:10px solid transparent}', ".mq-sb-ep:hover .mq-sb-play,.mq-sb-ep:focus-visible .mq-sb-play{opacity:1}.mq-sb-play:hover{transform:scale(1.08)}", ".mq-sb-prog{position:absolute;left:0;bottom:0;height:4px;background:#e50914}", ".mq-sb-title{margin:10px 2px 4px;font-size:15px;font-weight:600;color:#fff;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}", ".mq-sb-w{color:#46d369;margin-left:6px;font-size:13px}", ".mq-sb-ov{margin:0 2px;font-size:13px;line-height:1.45;color:#a8a8a8;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}", ".mq-sb-skel{aspect-ratio:16/9;border-radius:6px;background:linear-gradient(90deg,#1c1c1f 0%,#27272b 50%,#1c1c1f 100%);background-size:200% 100%;animation:mqsb 1.2s linear infinite}", "@keyframes mqsb{to{background-position:-200% 0}}", "@media (max-width:640px){.mq-sb-grid{grid-template-columns:1fr}.mq-sb-season{width:96px}.mq-season-stack.mq-sb{padding:0 4px!important}}", "@media (hover:none){.mq-sb-play{opacity:.85;width:46px;height:46px}.mq-sb-play::after{left:17px;top:12px}}" ].join("\n");
  function sbCss() {
    if (document.getElementById("mq-sb-css")) return;
    var st = document.createElement("style");
    st.id = "mq-sb-css";
    st.textContent = SB_CSS;
    document.head.appendChild(st);
  }
  var epCache = {};
  function seasonEpisodes(seriesId, seasonId, u) {
    if (!epCache[seasonId]) epCache[seasonId] = mqApi("/Shows/" + seriesId + "/Episodes?seasonId=" + seasonId + "&userId=" + u + "&Fields=Overview&EnableUserData=true").then(function(r) {
      return r && r.Items || [];
    }).catch(function(e) {
      delete epCache[seasonId];
      throw e;
    });
    setTimeout(function() {
      delete epCache[seasonId];
    }, 6e4);
    return epCache[seasonId];
  }
  function playEp(ep) {
    var pm = window.playbackManager || window.Emby && window.Emby.PlaybackManager;
    var ac = window.ApiClient;
    if (pm && pm.play && ac) {
      try {
        pm.play({
          ids: [ ep.Id ],
          serverId: ac.serverId()
        });
        return;
      } catch (e) {}
    }
    location.hash = "#/details?id=" + ep.Id;
  }
  function episodeCard(seriesId, ep) {
    var card = document.createElement("div");
    card.className = "mq-sb-ep";
    card.tabIndex = 0;
    card.setAttribute("data-id", ep.Id);
    var th = document.createElement("div");
    th.className = "mq-sb-thumb";
    var im = document.createElement("img");
    im.loading = "lazy";
    im.decoding = "async";
    im.alt = ep.Name || "";
    var tag = ep.ImageTags && ep.ImageTags.Primary;
    im.src = tag ? imgUrl(ep.Id, tag, "Primary", 300) : imgUrl(seriesId, null, "Backdrop/0", 300);
    th.appendChild(im);
    if (ep.IndexNumber != null) {
      var n = document.createElement("span");
      n.className = "mq-sb-num";
      n.textContent = "E" + ep.IndexNumber + (ep.IndexNumberEnd ? "-" + ep.IndexNumberEnd : "");
      th.appendChild(n);
    }
    var rt = mins(ep.RunTimeTicks);
    if (rt) {
      var r = document.createElement("span");
      r.className = "mq-sb-rt";
      r.textContent = rt;
      th.appendChild(r);
    }
    var pb = document.createElement("button");
    pb.type = "button";
    pb.className = "mq-sb-play";
    pb.setAttribute("aria-label", "Play " + (ep.Name || "episode"));
    pb.addEventListener("click", function(e) {
      e.stopPropagation();
      playEp(ep);
    });
    th.appendChild(pb);
    if (ep.UserData && ep.UserData.PlayedPercentage > 1 && !ep.UserData.Played) {
      var bar = document.createElement("span");
      bar.className = "mq-sb-prog";
      bar.style.width = Math.min(100, ep.UserData.PlayedPercentage) + "%";
      th.appendChild(bar);
    }
    var t = document.createElement("div");
    t.className = "mq-sb-title";
    t.textContent = (ep.IndexNumber != null ? ep.IndexNumber + ". " : "") + (ep.Name || "Episode");
    if (ep.UserData && ep.UserData.Played) {
      var w = document.createElement("span");
      w.className = "mq-sb-w";
      w.textContent = "✓";
      w.title = "Watched";
      t.appendChild(w);
    }
    var ov = document.createElement("p");
    ov.className = "mq-sb-ov";
    ov.textContent = ep.Overview || "";
    card.appendChild(th);
    card.appendChild(t);
    if (ep.Overview) card.appendChild(ov);
    card.addEventListener("click", function() {
      location.hash = "#/details?id=" + ep.Id;
    });
    card.addEventListener("keydown", function(e) {
      if (e.key === "Enter") location.hash = "#/details?id=" + ep.Id;
    });
    return card;
  }
  var ANTHOLOGY = CFG.anthologies || [];
  function anthologyFor(id) {
    for (var a = 0; a < ANTHOLOGY.length; a++) for (var m = 0; m < ANTHOLOGY[a].members.length; m++) if (ANTHOLOGY[a].members[m].id === id) return ANTHOLOGY[a];
    return null;
  }
  function fetchSeasons(id, u) {
    var anth = anthologyFor(id);
    var q = "/Seasons?userId=" + u + "&Fields=ItemCounts,ChildCount,Overview,ProductionYear&EnableUserData=true";
    if (!anth) return mqApi("/Shows/" + id + q).then(function(r) {
      return (r && r.Items || []).map(function(s) {
        s._seriesId = id;
        return s;
      });
    });
    return Promise.all(anth.members.map(function(m) {
      return mqApi("/Shows/" + m.id + q).then(function(r) {
        return r && r.Items || [];
      }).catch(function() {
        return [];
      }).then(function(items) {
        return items.map(function(s) {
          s._seriesId = m.id;
          s._anthNum = m.num;
          s._own = m.id === id;
          if (s.IndexNumber !== 0) s.Name = "Season " + m.num + " · " + m.label;
          return s;
        });
      });
    })).then(function(lists) {
      return [].concat.apply([], lists);
    });
  }
  function renderSeasonBrowser(page, id, u) {
    return Promise.all([ fetchSeasons(id, u).then(function(items) {
      return {
        Items: items
      };
    }), mqApi("/Shows/NextUp?SeriesId=" + id + "&UserId=" + u + "&Limit=1&EnableTotalRecordCount=false").catch(function() {
      return null;
    }) ]).then(function(res) {
      var seasons = res[0] && res[0].Items || [];
      if (!seasons.length) {
        page.dataset.mqSeasonsNot = id;
        return;
      }
      if (itemIdFromHash() !== id) return;
      sbCss();
      var next = res[1] && res[1].Items && res[1].Items[0];
      var dup = document.querySelectorAll(".mq-season-stack");
      for (var z = 0; z < dup.length; z++) if (dup[z].parentElement) dup[z].parentElement.removeChild(dup[z]);
      var stack = document.createElement("section");
      stack.className = "mq-season-stack mq-sb verticalSection";
      stack.dataset.mqFor = id;
      var row = null;
      if (seasons.length > 1) {
        var h = document.createElement("h2");
        h.className = "mq-sb-h";
        h.textContent = "Seasons";
        stack.appendChild(h);
        row = document.createElement("div");
        row.className = "mq-sb-seasons";
        row.setAttribute("role", "tablist");
        stack.appendChild(row);
      }
      var info = document.createElement("div");
      info.className = "mq-sb-info";
      stack.appendChild(info);
      var grid = document.createElement("div");
      grid.className = "mq-sb-grid";
      stack.appendChild(grid);
      var btns = [];
      function select(i) {
        var s = seasons[i];
        btns.forEach(function(b, j) {
          b.classList.toggle("on", j === i);
          b.setAttribute("aria-selected", j === i ? "true" : "false");
        });
        stack.dataset.mqSeason = s.Id;
        info.innerHTML = "";
        var h3 = document.createElement("h3");
        h3.textContent = s.Name || "Season " + s.IndexNumber;
        info.appendChild(h3);
        var cnt = s.ChildCount || s.RecursiveItemCount;
        var meta = document.createElement("div");
        meta.className = "mq-sb-meta";
        meta.textContent = [ cnt ? cnt + " Episode" + (cnt === 1 ? "" : "s") : "", s.ProductionYear || "" ].filter(Boolean).join("  ·  ");
        info.appendChild(meta);
        if (s.Overview) {
          var p = document.createElement("p");
          p.textContent = s.Overview;
          info.appendChild(p);
        }
        grid.innerHTML = "";
        for (var k = 0; k < Math.min(cnt || 6, 8); k++) {
          var sk = document.createElement("div");
          sk.className = "mq-sb-skel";
          grid.appendChild(sk);
        }
        seasonEpisodes(s._seriesId || id, s.Id, u).then(function(eps) {
          if (stack.dataset.mqSeason !== s.Id) return;
          grid.innerHTML = "";
          eps.forEach(function(ep) {
            grid.appendChild(episodeCard(s._seriesId || id, ep));
          });
          if (!cnt && eps.length) {
            meta.textContent = [ eps.length + " Episode" + (eps.length === 1 ? "" : "s"), s.ProductionYear || "" ].filter(Boolean).join("  ·  ");
            if (btns[i]) btns[i].querySelector(".mq-sb-scount").textContent = eps.length + " Episode" + (eps.length === 1 ? "" : "s");
          }
        }).catch(function() {
          grid.innerHTML = "";
        });
      }
      var start = 0, ownStart = -1;
      seasons.forEach(function(s, i) {
        if (s._own && ownStart < 0 && s.IndexNumber !== 0) ownStart = i;
        if (next && next.SeasonId === s.Id) start = i;
        if (!row) return;
        var b = document.createElement("button");
        b.type = "button";
        b.className = "mq-sb-season";
        b.setAttribute("role", "tab");
        var ps = document.createElement("span");
        ps.className = "mq-sb-poster";
        var pid = s.ImageTags && s.ImageTags.Primary ? s.Id : s._seriesId || id;
        ps.style.backgroundImage = 'url("' + imgUrl(pid, s.ImageTags && s.ImageTags.Primary || null, "Primary", 330) + '")';
        var nm = document.createElement("span");
        nm.className = "mq-sb-sname";
        nm.textContent = s.Name || "Season " + s.IndexNumber;
        var c = s.ChildCount || s.RecursiveItemCount;
        var sc = document.createElement("span");
        sc.className = "mq-sb-scount";
        sc.textContent = c ? c + " Episode" + (c === 1 ? "" : "s") : "";
        b.appendChild(ps);
        b.appendChild(nm);
        b.appendChild(sc);
        b.addEventListener("click", function() {
          select(i);
        });
        row.appendChild(b);
        btns.push(b);
      });
      if (!next && seasons[0] && seasons[0].IndexNumber === 0 && seasons.length > 1) start = 1;
      if (!next && ownStart >= 0) start = ownStart;
      var anchor = page.querySelector(".childrenItemsContainer, #childrenContent .itemsContainer");
      var anchorSection = anchor ? anchor.closest(".verticalSection") || anchor : null;
      if (anchorSection && anchorSection.parentElement) anchorSection.parentElement.insertBefore(stack, anchorSection); else page.appendChild(stack);
      page.dataset.mqSeasonsBuilt = id;
      hideNativeSeasonUi(page);
      select(start);
      if (row && btns[start] && start > 2) row.scrollLeft = btns[start].offsetLeft - 20;
    });
  }
  function buildSeasons() {
    var id = itemIdFromHash();
    if (!id) return;
    var page = liveEl(".detailPageContent, .detailPageWrapperContainer");
    if (!page) return;
    var stacks = document.querySelectorAll(".mq-season-stack");
    var mine = null;
    for (var q = 0; q < stacks.length; q++) {
      if (stacks[q].dataset.mqFor === id && !mine) {
        mine = stacks[q];
      } else {
        stacks[q].parentElement && stacks[q].parentElement.removeChild(stacks[q]);
      }
    }
    if (mine) {
      hideNativeSeasonUi(page);
      return;
    }
    if (page.dataset.mqSeasonsFor === id && page.dataset.mqSeasonsBuilt === id) {
      hideNativeSeasonUi(page);
      return;
    }
    var u = uid();
    if (!u) return;
    if (page.dataset.mqSeasonsPending === id || page.dataset.mqSeasonsNot === id) return;
    page.dataset.mqSeasonsFor = id;
    page.dataset.mqSeasonsPending = id;
    getItemCached(id).then(function(item) {
      if (!item || item.Type !== "Series") {
        page.dataset.mqSeasonsNot = id;
        return;
      }
      return renderSeasonBrowser(page, id, u);
    }).then(function() {
      delete page.dataset.mqSeasonsPending;
    }, function() {
      delete page.dataset.mqSeasonsPending;
    });
  }
  function fillEmptyCards() {
    var vh = window.innerHeight || 800;
    var cards = document.querySelectorAll(".card[data-id]:not([data-mq-fill])");
    var n = 0;
    for (var i = 0; i < cards.length && n < 24; i++) {
      var card = cards[i];
      var r = card.getBoundingClientRect();
      if (!r.width) continue;
      if (r.bottom < -vh || r.top > vh * 2) continue;
      var box = card.querySelector(".cardImageContainer");
      if (!box) continue;
      var img = box.querySelector("img");
      var hasArt = img && (img.currentSrc || img.getAttribute("src")) || getComputedStyle(box).backgroundImage.indexOf("url(") === 0;
      if (hasArt) {
        card.setAttribute("data-mq-fill", "own");
        continue;
      }
      var type = card.getAttribute("data-type");
      if (type === "BoxSet") continue;
      var id = card.getAttribute("data-id");
      if (!id) continue;
      card.setAttribute("data-mq-fill", "filled");
      n++;
      box.style.setProperty("background-image", 'url("/Items/' + id + '/Images/Primary?maxHeight=480&quality=85")', "important");
      box.style.setProperty("background-size", "cover", "important");
      box.style.setProperty("background-position", "center", "important");
    }
  }
  function paintBorrowed(b, cid, c) {
    firstArtwork(cid, 0).then(function(hit) {
      if (!hit) {
        c.setAttribute("data-mq-art", "none");
        return;
      }
      b.style.setProperty("background-image", 'url("/Items/' + hit.id + '/Images/Primary?maxHeight=480&quality=85")', "important");
      b.style.setProperty("background-size", "cover", "important");
      b.style.setProperty("background-position", "center", "important");
      var ph = b.querySelector(".cardImageIcon, .material-icons");
      if (ph) ph.style.setProperty("display", "none", "important");
      var scal = c.querySelector(".cardScalable") || c;
      scal.querySelectorAll("canvas.blurhash-canvas").forEach(function(cv) {
        cv.style.setProperty("display", "none", "important");
      });
      c.setAttribute("data-mq-art", "borrowed");
    });
  }
  function fixBoxSetCards() {
    var cards = document.querySelectorAll('.card[data-type="BoxSet"]:not([data-mq-art])');
    var n = 0;
    for (var i = 0; i < cards.length && n < 12; i++) {
      var card = cards[i];
      var box = card.querySelector(".cardImageContainer");
      if (!box) continue;
      var id = card.getAttribute("data-id");
      if (!id) continue;
      var hasArt = box.querySelector("img") || getComputedStyle(box).backgroundImage.indexOf("url(") === 0;
      card.setAttribute("data-mq-art", hasArt ? "own" : "pending");
      if (hasArt) continue;
      n++;
      paintBorrowed(box, id, card);
    }
  }
  function alignRibbon() {
    var ribbon = liveEl(".detailRibbon");
    var pr = null;
    var cands = document.querySelectorAll(".detailImageContainer .cardImageContainer, .detailImageContainer .cardPadder, .detailImageContainer .card");
    for (var ci = 0; ci < cands.length; ci++) {
      var cr = cands[ci].getBoundingClientRect();
      if (cr.width < 80 || cr.height < 80) continue;
      if (cr.left > window.innerWidth * .35) continue;
      if (!pr || cr.right > pr.right) pr = cr;
    }
    if (!ribbon) return;
    if (!pr) {
      document.body.dataset.mqAlign = "no-poster";
      return;
    }
    var indent = Math.round(pr.right + 54);
    if (indent < 40 || indent > window.innerWidth * .6) return;
    var probe = null;
    var pcands = ribbon.querySelectorAll(".infoWrapper, .mainDetailButtons");
    for (var pi = 0; pi < pcands.length; pi++) {
      var prr = pcands[pi].getBoundingClientRect();
      if (prr.width > 0 && prr.height > 0) {
        probe = pcands[pi];
        break;
      }
    }
    if (probe) {
      var cur = Math.round(probe.getBoundingClientRect().left);
      if (Math.abs(cur - indent) <= 4) {
        document.body.dataset.mqAlign = "ok " + cur + "/" + indent;
        return;
      }
    } else if (ribbon.dataset.mqIndent === String(indent)) {
      document.body.dataset.mqAlign = "latched-noprobe " + indent;
      return;
    }
    ribbon.style.setProperty("margin-left", "0", "important");
    var curPad = parseFloat(getComputedStyle(ribbon).paddingLeft) || 0;
    var curLeft = probe ? probe.getBoundingClientRect().left : ribbon.getBoundingClientRect().left;
    var pad = Math.max(0, Math.round(curPad + (indent - curLeft)));
    ribbon.dataset.mqIndent = String(indent);
    ribbon.style.setProperty("padding-left", pad + "px", "important");
    ribbon.style.setProperty("padding-right", "40px", "important");
    document.body.dataset.mqAlign = "corrected pad=" + pad + " target=" + indent + " from=" + Math.round(curLeft);
  }
  var gateTimer = null, gateFor = null;
  function gateCss() {
    if (document.getElementById("mq-detail-gate-css")) return;
    var st = document.createElement("style");
    st.id = "mq-detail-gate-css";
    st.textContent = 'body[data-mq-gate="1"] .itemDetailPage:not(.hide) .detailPageWrapperContainer,' + 'body[data-mq-gate="1"] .itemDetailPage:not(.hide) .detailPagePrimaryContainer{opacity:0!important}' + ".itemDetailPage .detailPageWrapperContainer,.itemDetailPage .detailPagePrimaryContainer{transition:opacity .22s ease}";
    document.head.appendChild(st);
  }
  function gateOpen() {
    if (gateTimer) {
      clearTimeout(gateTimer);
      gateTimer = null;
    }
    delete document.body.dataset.mqGate;
  }
  function gateClose() {
    var id = itemIdFromHash();
    if (!id) {
      gateOpen();
      return;
    }
    if (gateFor === id && document.body.dataset.mqGate !== "1") return;
    gateCss();
    gateFor = id;
    document.body.dataset.mqGate = "1";
    try {
      (new Image).src = "/Items/" + id + "/Images/Logo?maxHeight=250&quality=90";
    } catch (e) {}
    if (gateTimer) clearTimeout(gateTimer);
    gateTimer = setTimeout(gateOpen, 1600);
  }
  function gateDone(id) {
    if (id && id === gateFor) setTimeout(gateOpen, 180);
  }
  function ensureTitleLogo() {
    var id = itemIdFromHash();
    if (!id) return;
    var info = liveEl(".detailRibbon .infoWrapper, .infoWrapper");
    if (!info) return;
    if (info.dataset.mqLogoFor === id) return;
    if (info.querySelector(".mq-title-logo")) {
      info.dataset.mqLogoFor = id;
      gateDone(id);
      return;
    }
    info.dataset.mqLogoFor = id;
    var url = "/Items/" + id + "/Images/Logo?maxHeight=250&quality=90";
    var probe = new Image;
    probe.onload = function() {
      if (info.querySelector(".mq-title-logo")) return;
      var wrap = document.createElement("div");
      wrap.className = "mq-title-logo-wrap";
      var img = document.createElement("img");
      img.className = "mq-title-logo";
      img.src = url;
      img.alt = "";
      wrap.appendChild(img);
      info.insertBefore(wrap, info.firstChild);
      var name = info.querySelector(".nameContainer");
      if (name) name.style.setProperty("display", "none", "important");
      if (img.complete) gateDone(id); else {
        img.onload = img.onerror = function() {
          gateDone(id);
        };
      }
    };
    probe.onerror = function() {
      gateDone(id);
    };
    probe.src = url;
  }
  function placeExternalLinks() {
    var misc = liveEl(".itemMiscInfo-primary") || liveEl(".itemMiscInfo");
    var links = liveEl(".itemExternalLinks");
    if (!misc || !links) return;
    var nodes = links.childNodes;
    for (var ni = 0; ni < nodes.length; ni++) {
      if (nodes[ni].nodeType === 3 && nodes[ni].textContent.indexOf(",") !== -1) nodes[ni].textContent = "";
    }
    var after = misc;
    var genre = misc.parentElement && misc.parentElement.querySelector(".mq-genre-line");
    if (genre) after = genre;
    if (after.nextElementSibling === links) return;
    if (!after.parentElement) return;
    after.parentElement.insertBefore(links, after.nextSibling);
    links.classList.add("mq-links-row");
  }
  function buildInfoRow() {
    var id = itemIdFromHash();
    if (!id) return;
    var misc = liveEl(".itemMiscInfo-primary") || liveEl(".itemMiscInfo");
    if (!misc) return;
    if (misc.dataset.mqInfoFor === id) return;
    var u = uid();
    if (!u) return;
    misc.dataset.mqInfoFor = id;
    getItemCached(id).then(function(it) {
      if (!it || !document.body.contains(misc)) return;
      document.body.dataset.mqItemType = it.Type || "";
      var streams = it.MediaStreams || it.MediaSources && it.MediaSources[0] && it.MediaSources[0].MediaStreams || [];
      var badges = [];
      var vid = streams.filter(function(s) {
        return s.Type === "Video";
      })[0];
      if (vid && vid.Height) {
        badges.push(vid.Height >= 2e3 ? "4K" : vid.Height >= 700 ? "HD" : "SD");
      }
      var aud = streams.filter(function(s) {
        return s.Type === "Audio";
      })[0];
      if (aud) {
        var ch = aud.Channels || 0;
        if (ch >= 8) badges.push("7.1"); else if (ch >= 6) badges.push("5.1"); else if (ch >= 2) badges.push("2.0"); else if (ch === 1) badges.push("MONO");
      }
      var row = misc.querySelector(".ratings-row");
      if (!row) {
        row = document.createElement("div");
        row.className = "ratings-row";
        misc.insertBefore(row, misc.firstChild);
      }
      Array.prototype.slice.call(misc.children).forEach(function(k) {
        if (k === row) return;
        if (k.classList.contains("mq-badges")) return;
        if (k.classList.contains("endsAt")) return;
        if (k.classList.contains("mediaInfoItem-watchProgress")) return;
        if (k.classList.contains("mediaInfoItem")) row.appendChild(k);
      });
      var hasCC = streams.some(function(s) {
        return s.Type === "Subtitle";
      });
      var hasAD = streams.some(function(s) {
        return s.Type === "Audio" && /audio\s*description|\bdescriptive\b|\bAD\b/i.test((s.Title || "") + " " + (s.DisplayTitle || ""));
      });
      var glyphs = row.querySelector(".mq-a11y");
      if (glyphs) glyphs.parentElement.removeChild(glyphs);
      if (hasAD || hasCC) {
        glyphs = document.createElement("span");
        glyphs.className = "mq-a11y";
        if (hasAD) glyphs.innerHTML += '<svg class="mq-ico-ad" viewBox="0 0 24 24" width="30" height="30" fill="none" role="img" aria-label="Audio description available"><path fill="currentColor" fill-rule="evenodd" d="M21.978 7.52h.284A7.24 7.24 0 0 1 24 12.208a7.23 7.23 0 0 1-1.378 4.237h-1.056a6.6 6.6 0 0 0 1.555-4.237 6.64 6.64 0 0 0-1.96-4.688zM6.914 16.48h1.96V7.527H6.425L0 16.48h2.877l.755-1.184h3.282zm-2.051-3.05h2.063v-3.206zm7.439-3.807a2.38 2.38 0 0 1 2.382 2.382 2.383 2.383 0 0 1-2.382 2.385h-.623V9.623zm.242 6.851a4.48 4.48 0 0 0 4.477-4.47 4.46 4.46 0 0 0-4.456-4.476H9.799v8.95h2.745zM20.01 7.52h-1.1a6.64 6.64 0 0 1 1.96 4.688 6.6 6.6 0 0 1-1.555 4.237h1.049a7.2 7.2 0 0 0 1.385-4.237c0-1.728-.63-3.39-1.738-4.688m-2.536 0h.284a7.23 7.23 0 0 1 1.732 4.688 7.2 7.2 0 0 1-1.378 4.237h-1.05a6.62 6.62 0 0 0 1.548-4.237c0-1.759-.71-3.452-1.953-4.688z" clip-rule="evenodd"></path></svg>';
        if (hasCC) glyphs.innerHTML += '<svg class="mq-ico-cc" viewBox="0 0 16 16" width="17" height="17" fill="none" role="img" aria-label="Subtitles available"><path fill="currentColor" fill-rule="evenodd" d="M0 1.75C0 1.34.34 1 .75 1h14.5c.41 0 .75.34.75.75v10.5c0 .41-.34.75-.75.75h-2.5v2a.75.75 0 0 1-1.11.66L6.8 13H.75a.75.75 0 0 1-.75-.75zm1.5.75v9h5.7l.16.1 3.89 2.13V11.5h3.25v-9zm4.5 4H3V5h3zm7 1h-3V9h3zM3 9V7.5h6V9zm10-4H7v1.5h6z" clip-rule="evenodd"></path></svg>';
        row.appendChild(glyphs);
      }
      Array.prototype.slice.call(row.children).forEach(function(k) {
        if (k.classList.contains("mq-a11y")) return;
        var t = (k.textContent || "").trim();
        var isRuntime = /^\d+\s*h(\s*\d+\s*m)?$|^\d+\s*m$/i.test(t);
        var isStar = k.classList.contains("starRatingContainer");
        var isCritic = k.classList.contains("mediaInfoCriticRating") || k.className.indexOf("CriticRating") !== -1;
        if (isRuntime || isStar || isCritic) k.style.setProperty("display", "none", "important"); else k.style.removeProperty("display");
      });
      var old = misc.querySelector(".mq-badges");
      if (old) old.parentElement.removeChild(old);
      var spatial = streams.some(function(s) {
        if (s.Type !== "Audio") return false;
        var p = ((s.Profile || "") + " " + (s.Codec || "") + " " + (s.Title || "") + " " + (s.DisplayTitle || "")).toLowerCase();
        return p.indexOf("atmos") !== -1 || p.indexOf("dts:x") !== -1 || p.indexOf("dts-x") !== -1 || p.indexOf("dts-hd ma") !== -1 || p.indexOf("truehd") !== -1;
      });
      badges = badges.filter(function(b) {
        return b !== "SPATIAL" && b !== "ATMOS";
      });
      if (badges.length || spatial) {
        var wrap = document.createElement("span");
        wrap.className = "mq-badges";
        badges.forEach(function(b) {
          var s = document.createElement("span");
          s.className = "mq-badge";
          s.textContent = b;
          wrap.appendChild(s);
        });
        if (spatial) {
          var sp = document.createElement("span");
          sp.className = "mq-spatial";
          sp.innerHTML = '<svg class="mq-ico-spatial" viewBox="0 0 24 24" width="20" height="20" role="img" ' + 'aria-label="Spatial Audio"><path fill="currentColor" d="M12 2a6 6 0 0 1 6 6v1h-1.5V8a4.5 4.5 0 0 0-9 0v1H6V8a6 6 0 0 1 6-6m0 3.25a2.75 2.75 0 1 1 0 5.5 2.75 2.75 0 0 1 0-5.5m0 7.25c2.9 0 5.6 1.2 5.6 2.7V19H6.4v-3.8c0-1.5 2.7-2.7 5.6-2.7"></path></svg>' + '<span class="mq-spatial-word"><b>Spatial</b><i>Audio</i></span>';
          wrap.appendChild(sp);
        }
        misc.appendChild(wrap);
      }
      var host = misc.parentElement;
      if (!host) return;
      var line = host.querySelector(".mq-genre-line");
      var gen = (it.Genres || []).slice(0, 4);
      if (!gen.length) {
        if (line) line.parentElement.removeChild(line);
        return;
      }
      if (!line) {
        line = document.createElement("div");
        line.className = "mq-genre-line";
        host.insertBefore(line, misc.nextSibling);
      }
      line.textContent = "";
      gen.forEach(function(g, i) {
        if (i) {
          var dot = document.createElement("span");
          dot.className = "mq-dot";
          dot.textContent = "•";
          line.appendChild(dot);
        }
        var s = document.createElement("span");
        s.className = "mq-genre";
        s.textContent = g;
        line.appendChild(s);
      });
    }).catch(function() {
      delete misc.dataset.mqInfoFor;
    });
  }
  function tick() {
    paintBackdrop();
    stripHiddenBackdrops();
    paintTrailerBackdrop();
    paintPoster();
    clearPosterBlurhash();
    ensureTitleLogo();
    buildInfoRow();
    placeExternalLinks();
    buildSeasons();
    alignRibbon();
    fixBoxSetCards();
  }
  (function() {
    var pending = null;
    function onScroll() {
      if (pending) return;
      pending = requestAnimationFrame(function() {
        pending = null;
        fixBoxSetCards();
      });
    }
    [ "scroll", "wheel" ].forEach(function(ev) {
      document.addEventListener(ev, onScroll, {
        passive: true,
        capture: true
      });
    });
    window.addEventListener("resize", onScroll, {
      passive: true
    });
  })();
  var t = null;
  new MutationObserver(function() {
    if (t) return;
    t = setTimeout(function() {
      t = null;
      tick();
    }, 300);
  }).observe(document.body, {
    childList: true,
    subtree: true
  });
  var burstTimer = null;
  function burst() {
    if (burstTimer) clearInterval(burstTimer);
    var n = 0;
    tick();
    burstTimer = setInterval(function() {
      tick();
      if (++n > 25) {
        clearInterval(burstTimer);
        burstTimer = null;
      }
    }, 120);
  }
  window.addEventListener("hashchange", function() {
    document.querySelectorAll("[data-mq-backdrop-id]").forEach(function(e) {
      delete e.dataset.mqBackdropId;
      delete e.dataset.mqBdUrl;
      delete e.dataset.mqBdPending;
    });
    document.querySelectorAll("[data-mq-seasons-for]").forEach(function(e) {
      delete e.dataset.mqSeasonsFor;
      delete e.dataset.mqSeasonsPending;
    });
    document.querySelectorAll("[data-mq-indent]").forEach(function(e) {
      delete e.dataset.mqIndent;
    });
    document.querySelectorAll("[data-mq-poster-id]").forEach(function(e) {
      delete e.dataset.mqPosterId;
    });
    document.querySelectorAll("[data-mq-logo-for]").forEach(function(e) {
      delete e.dataset.mqLogoFor;
    });
    document.querySelectorAll("[data-mq-band-video]").forEach(function(e) {
      delete e.dataset.mqBandVideo;
    });
    document.querySelectorAll("[data-mq-info-for]").forEach(function(e) {
      delete e.dataset.mqInfoFor;
    });
    delete document.body.dataset.mqItemType;
    gateClose();
    burst();
  });
  document.addEventListener("viewshow", burst);
  setInterval(tick, 1500);
  if (itemIdFromHash()) gateClose();
  burst();
})();
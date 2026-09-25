/* Cable-box style Live TV guide. */
(function() {
  "use strict";
  var SLOT_MIN = 30, rowDone = new WeakSet, inflight = 0, queue = [];
  function api() {
    return window.ApiClient;
  }
  function guideRoot() {
    return document.querySelector(".tvguide");
  }
  function parseHeaderTime(txt) {
    var m = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i.exec(txt || "");
    if (!m) return null;
    var h = parseInt(m[1], 10) % 12, mm = parseInt(m[2] || "0", 10);
    if (/pm/i.test(m[3])) h += 12;
    return {
      h: h,
      m: mm
    };
  }
  function selectedDate() {
    var t = document.querySelector(".guideDateTabButton.emby-tab-button-active, .guideDateTab.emby-tab-button-active");
    var d = t && t.getAttribute("data-date");
    if (d) {
      var x = new Date(d);
      if (!isNaN(x)) return x;
    }
    return new Date;
  }
  function guideStart() {
    var first = document.querySelector(".timeslotHeader");
    if (!first) return null;
    var hm = parseHeaderTime(first.textContent);
    if (!hm) return null;
    var d = selectedDate();
    d.setHours(hm.h, hm.m, 0, 0);
    return d;
  }
  function ensure(parent, cls) {
    var el = parent.querySelector(":scope > ." + cls);
    if (!el) {
      el = document.createElement("div");
      el.className = cls;
      parent.appendChild(el);
    }
    return el;
  }
  var lastMark = 0;
  function updateNowLine(force) {
    var grid = document.querySelector(".programGrid"), hdr = document.querySelector(".timeslotHeadersInner"), slot = document.querySelector(".timeslotHeader");
    if (!grid || !hdr || !slot) return;
    var start = guideStart(), now = new Date;
    var line = ensure(grid, "mq-now-line"), mark = ensure(hdr, "mq-now-marker");
    if (!start) {
      line.style.display = mark.style.display = "none";
      return;
    }
    var pxPerMin = slot.offsetWidth / SLOT_MIN, mins = (now - start) / 6e4, x = mins * pxPerMin;
    var visible = mins >= 0 && x <= hdr.scrollWidth;
    line.style.display = mark.style.display = visible ? "" : "none";
    if (!visible) {
      document.querySelectorAll(".programCell.mq-on-now").forEach(function(c) {
        c.classList.remove("mq-on-now");
      });
      return;
    }
    line.style.left = x + "px";
    line.style.height = Math.max(grid.scrollHeight, grid.clientHeight) + "px";
    mark.style.left = x + "px";
    mark.textContent = now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
    });
    var t = Date.now();
    if (!force && t - lastMark < 2e4) return;
    lastMark = t;
    document.querySelectorAll(".programCell").forEach(function(c) {
      var l = c.offsetLeft, w = c.offsetWidth, on = l <= x && x < l + w;
      if (on !== c.classList.contains("mq-on-now")) c.classList.toggle("mq-on-now", on);
    });
  }
  function fmtDetail(it) {
    if (!it) return "";
    if (it.IsMovie || it.Type === "Movie") return "MOVIE" + (it.ProductionYear ? " · " + it.ProductionYear : "");
    if (it.ParentIndexNumber != null && it.IndexNumber != null) return "S" + it.ParentIndexNumber + " E" + it.IndexNumber;
    if (it.IndexNumber != null) return "E" + it.IndexNumber;
    if (it.IsSports) return "SPORTS";
    if (it.IsNews) return "NEWS";
    if (it.IsKids) return "KIDS";
    return it.ProductionYear ? String(it.ProductionYear) : "";
  }
  function applyDetail(cell, it) {
    cell.setAttribute("data-mq-se", "1");
    var txt = fmtDetail(it);
    if (!txt) return;
    var host = cell.querySelector(".guideProgramNameText");
    if (!host) return;
    var sec = host.querySelector(".guideProgramSecondaryInfo");
    if (!sec) {
      sec = document.createElement("div");
      sec.className = "guideProgramSecondaryInfo";
      host.appendChild(sec);
    }
    var d = sec.querySelector(".mq-detail");
    if (!d) {
      d = document.createElement("span");
      d.className = "mq-detail";
      sec.insertBefore(d, sec.firstChild);
    }
    d.textContent = txt + (sec.querySelector(".programSecondaryTitle") ? " · " : "");
  }
  function loadRow(row) {
    var a = api(), chid = row.getAttribute("data-channelid"), start = guideStart();
    if (!a || !chid || !start) {
      rowDone.delete(row);
      setTimeout(function() {
        if (document.contains(row)) {
          rowDone.delete(row);
          io.observe(row);
        }
      }, 1500);
      return;
    }
    var end = new Date(start.getTime() + 24 * 36e5);
    inflight++;
    a.ajax({
      type: "GET",
      dataType: "json",
      url: a.getUrl("LiveTv/Programs", {
        ChannelIds: chid,
        MinEndDate: start.toISOString(),
        MaxStartDate: end.toISOString(),
        Fields: "ProductionYear,EpisodeTitle,IndexNumber,ParentIndexNumber,IsMovie,IsSports,IsNews,IsKids",
        Limit: 300
      })
    }).then(function(res) {
      var by = {};
      (res.Items || []).forEach(function(it) {
        by[it.Id] = it;
      });
      row.querySelectorAll(".programCell").forEach(function(c) {
        var it = by[c.getAttribute("data-id")];
        if (it) applyDetail(c, it); else c.setAttribute("data-mq-se", "0");
      });
    }).catch(function() {
      rowDone.delete(row);
    }).then(function() {
      inflight--;
      pump();
    });
  }
  function pump() {
    while (inflight < 3 && queue.length) loadRow(queue.shift());
  }
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (!e.isIntersecting) return;
      var r = e.target;
      io.unobserve(r);
      if (rowDone.has(r)) return;
      rowDone.add(r);
      queue.push(r);
    });
    pump();
  }, {
    rootMargin: "400px 0px"
  });
  function observeRows() {
    document.querySelectorAll(".channelPrograms:not([data-mq-obs])").forEach(function(r) {
      r.setAttribute("data-mq-obs", "1");
      io.observe(r);
    });
  }
  var timer = null;
  function tick() {
    if (!guideRoot()) return;
    observeRows();
    updateNowLine(false);
  }
  new MutationObserver(function(muts) {
    var relevant = false;
    for (var i = 0; i < muts.length && !relevant; i++) {
      var t = muts[i].target;
      if (t.classList && (t.classList.contains("programGrid") || t.classList.contains("tvguide") || t.classList.contains("channelsContainer") || t.id === "reactRoot" || t.classList.contains("mainAnimatedPages"))) relevant = true;
    }
    if (!relevant || timer) return;
    timer = setTimeout(function() {
      timer = null;
      tick();
    }, 300);
  }).observe(document.body, {
    childList: true,
    subtree: true
  });
  setInterval(function() {
    updateNowLine(true);
  }, 3e4);
  document.addEventListener("viewshow", function() {
    setTimeout(tick, 400);
  });
  tick();
})();
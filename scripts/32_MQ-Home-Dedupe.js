/* Remove duplicate items from home rows. */
(function() {
  "use strict";
  if (window.__mqHomeDedupe) return;
  window.__mqHomeDedupe = true;
  var HOME_RE = /(^|#)\/?(home|home\.html)/i;
  function onHome() {
    var h = location.hash || "";
    return HOME_RE.test(h) || h === "" || h === "#/";
  }
  function titleOf(card) {
    var t = card.querySelector(".cardText-first, .cardText, .cardTextCentered, .cardTitle");
    t = t && t.textContent ? t.textContent.trim().toLowerCase() : "";
    return t.replace(/[^a-z0-9]+/g, "");
  }
  function keysFor(card) {
    var keys = [];
    var type = (card.getAttribute("data-type") || "").toLowerCase();
    var sid = card.getAttribute("data-seriesid") || card.getAttribute("data-series-id");
    if (sid) keys.push("S:" + sid);
    var id = card.getAttribute("data-id") || card.getAttribute("data-itemid");
    if (id) keys.push("I:" + id);
    if (type === "series" || type === "season" || type === "episode" || !sid && !id) {
      var t = titleOf(card);
      if (t) keys.push("T:" + t);
    }
    return keys;
  }
  function dedupeRow(row) {
    var seen = Object.create(null);
    var cards = row.querySelectorAll(".card");
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i];
      if (c.getAttribute("data-mq-dupe") === "1") continue;
      var ks = keysFor(c);
      if (!ks.length) continue;
      var dupe = false;
      for (var j = 0; j < ks.length; j++) {
        if (seen[ks[j]]) {
          dupe = true;
          break;
        }
      }
      if (dupe) {
        c.setAttribute("data-mq-dupe", "1");
        c.style.setProperty("display", "none", "important");
      } else {
        for (var k = 0; k < ks.length; k++) seen[ks[k]] = 1;
      }
    }
  }
  function run() {
    if (!onHome()) return;
    var rows = document.querySelectorAll(".homeSectionsContainer .itemsContainer, .homeSection .itemsContainer, " + ".section .itemsContainer, .verticalSection .itemsContainer");
    for (var i = 0; i < rows.length; i++) dedupeRow(rows[i]);
  }
  var t = null;
  function schedule() {
    if (t) clearTimeout(t);
    t = setTimeout(run, 120);
  }
  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  window.addEventListener("hashchange", schedule);
  schedule();
})();
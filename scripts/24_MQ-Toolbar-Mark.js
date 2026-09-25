/* Tag icon-only toolbar buttons so CSS can round them. */
(function() {
  function mark() {
    document.querySelectorAll(".MuiAppBar-root .MuiToolbar-root .MuiButton-root").forEach(function(b) {
      var t = (b.textContent || "").replace(/\s+/g, "");
      var icons = b.querySelectorAll(".material-icons, svg");
      var iconText = Array.prototype.map.call(icons, function(i) {
        return (i.textContent || "").replace(/\s+/g, "");
      }).join("");
      var onlyIcon = t.length === 0 || t === iconText;
      b.classList.toggle("mq-icon-only", onlyIcon);
    });
  }
  mark();
  new MutationObserver(mark).observe(document.body, {
    childList: true,
    subtree: true
  });
})();
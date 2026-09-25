/* Inter from Google Fonts. Disabled by default; use this or Netflix-Sans, not both. */
(function() {
  if (document.getElementById("mq-font-inter")) return;
  var pre = document.createElement("link");
  pre.rel = "preconnect";
  pre.href = "https://fonts.gstatic.com";
  pre.crossOrigin = "";
  document.head.appendChild(pre);
  var l = document.createElement("link");
  l.id = "mq-font-inter";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap";
  document.head.appendChild(l);
})();
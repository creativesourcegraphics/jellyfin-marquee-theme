/* Hide the show-all button, fix vertical card row gaps. */
(function() {
  var CSS = ".show-all-button{ display: none !important; }\n.itemsContainer.vertical-wrap{ row-gap: 30px !important; }";
  function inject() {
    var old = document.getElementById("mq-card-hover-fix");
    if (old) old.remove();
    if (document.getElementById("mq-card-hover-fix-v2")) return;
    var s = document.createElement("style");
    s.id = "mq-card-hover-fix-v2";
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  inject();
  document.addEventListener("viewshow", inject);
})();
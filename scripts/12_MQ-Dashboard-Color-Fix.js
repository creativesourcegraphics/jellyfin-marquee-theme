/* Theme red on MUI primary buttons and dashboard accents. */
(function() {
  var CSS = ".MuiButton-containedPrimary{background-color:#e50914 !important;color:#fff !important;}\n.MuiButton-outlinedPrimary{color:#e50914 !important;border-color:#e50914 !important;}\n.MuiButton-textPrimary{color:#e50914 !important;}\n.Mui-selected{background-color:rgba(229,9,20,.16) !important;color:#e50914 !important;}\n.MuiSwitch-colorPrimary.Mui-checked{color:#e50914 !important;}\n.MuiSwitch-colorPrimary.Mui-checked+.MuiSwitch-track{background-color:#e50914 !important;}\n.MuiCheckbox-colorPrimary.Mui-checked{color:#e50914 !important;}\n.MuiRadio-colorPrimary.Mui-checked{color:#e50914 !important;}\n.MuiLinearProgress-barColorPrimary{background-color:#e50914 !important;}\n.MuiCircularProgress-colorPrimary{color:#e50914 !important;}\n.MuiTab-root.Mui-selected{color:#e50914 !important;}\n.MuiTabs-indicator{background-color:#e50914 !important;}\n.MuiFab-primary{background-color:#e50914 !important;}\n.raised.button-submit.emby-button{background-color:#e50914 !important;color:#fff !important;}\n.defaultCardBackground1{background-color:#3a1416 !important;}\n.defaultCardBackground2{background-color:#e50914 !important;}\n.defaultCardBackground3{background-color:#5c1a1a !important;}\n.defaultCardBackground4{background-color:#8a2b2b !important;}\n.defaultCardBackground5{background-color:#2a2a2e !important;}\n.defaultCardBackground6{background-color:#6e2020 !important;}";
  function inject() {
    if (document.getElementById("mq-dash-color-fix")) return;
    var s = document.createElement("style");
    s.id = "mq-dash-color-fix";
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  inject();
  document.addEventListener("viewshow", inject);
})();
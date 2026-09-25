/* Small runtime CSS fixes (pill buttons keep their radius, etc). */
(function() {
  if (document.getElementById("mq-ui-polish")) return;
  var css = [ ".emby-button, .button-flat, .MuiButton-root, .MuiTab-root, .MuiChip-root,", ".emby-button:hover, .emby-button:focus, .emby-button:active, .emby-button.focus,", ".button-flat:hover, .button-flat:focus, .button-flat:active,", ".MuiButton-root:hover, .MuiButton-root:focus, .MuiButton-root:active,", ".MuiButton-root.Mui-focusVisible, .MuiButton-root.Mui-selected,", ".MuiTab-root:hover, .MuiTab-root:focus, .MuiTab-root.Mui-selected,", ".MuiChip-root:hover, .MuiChip-root:focus, .MuiChip-root.Mui-selected {", "  border-radius: 999px !important;", "}", ".MuiTouchRipple-root, .MuiButton-root .MuiTouchRipple-child,", ".emby-button::before, .emby-button::after {", "  border-radius: 999px !important;", "}", ".cardOverlayButton-br.flex {", "  padding: 0 10px 10px 0 !important;", "}", ".cardOverlayButton-br svg.MuiSvgIcon-root,", ".MuiButtonGroup-root.cardOverlayButton-br svg.MuiSvgIcon-root,", "svg.MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.css-iguwhy {", "  width: 0.75em !important;", "  height: 0.75em !important;", "}" ].join("\n");
  var st = document.createElement("style");
  st.id = "mq-ui-polish";
  st.textContent = css;
  document.head.appendChild(st);
})();
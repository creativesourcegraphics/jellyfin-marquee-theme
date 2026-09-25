# Assets

Nothing in this folder ships with the repo (logos and fonts are yours to supply). Create a `mq/` folder inside your Jellyfin web root and put these files in it; they are served at `/web/mq/<file>`.

| File | Used by | Notes |
|------|---------|-------|
| `logo.png` | `css/custom.css` (header page title) | Wide wordmark, transparent background. The CSS assumes roughly a 3.5:1 at 44px tall; adjust the `.pageTitle` width rule if not. |
| `nav-logo.png` | `css/custom.css` (MUI app bar brand button) | Same wordmark, used in the Jellyfin 12 top bar. |
| `netflix-sans-300.woff2` `-400` `-500` `-700` | `30_MQ-Netflix-Sans` and the `@font-face` block in the CSS | Optional. Any four-weight webfont works: rename your files to match, or edit the `@font-face` `src:` paths in both places. If you skip this, enable `04_MQ-Font-Loader` (Inter from Google Fonts) instead. |

A packaged Jellyfin upgrade replaces the web folder, so keep a backup of `mq/` and copy it back after updating.

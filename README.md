# Marquee for Jellyfin

Netflix-style skin for the Jellyfin 12 web client. One stylesheet plus a set of small injected scripts for the parts CSS can't do: full-bleed detail pages with trailer playback, a cable-box style Live TV guide, thumbs up/down on detail pages, TV-browser throttling, and a lot of layout fixes for the 12.x UI.

```
css/custom.css              the stylesheet
scripts/                    injected scripts, numbered in load order
tools/build_injector_xml.py packs scripts/ into a JavaScript Injector config
assets/README.md            what goes in <jellyfin-web>/mq/
```
CSS classes are prefixed `mq-`, JS globals `MQ_`.

https://github.com/user-attachments/assets/5ca26ec1-a223-4306-ab06-7a50bfc1aa96

## Needs

- Jellyfin 12.x
- [JavaScript Injector](https://github.com/n00bcodr/Jellyfin-JavaScript-Injector) plugin
- [Media Bar Enhanced](https://github.com/CodeDevMLH/jellyfin-plugin-media-bar-enhanced) plugin (the home hero)
- [KefinTweaks](https://github.com/ranaldsgift/KefinTweaks), loaded from jsDelivr by `09_Tweaks.js`. `10_KefinTweaks-Config.js` is the config the look was built around (header tabs, home sections).

## Install

1. Paste `css/custom.css` into Dashboard > General > Custom CSS (replace, don't append).
2. Make a `mq` folder in your Jellyfin web root and drop in your logo. See `assets/README.md`. Packaged upgrades wipe the web folder, so keep a copy.
3. In `scripts/10_KefinTweaks-Config.js` replace `YOUR_MOVIES_LIBRARY_ID`, `YOUR_SHOWS_LIBRARY_ID`, `YOUR_COLLECTION_ID` with your own ids (the 32-char hex string in the URL when you open a library), or paste your own KefinTweaks config over it. `00_MQ-Config.js` is optional.
4. Load the scripts: paste each file into the JavaScript Injector page in numeric order (tick "requires authentication" where the table says), or

```
python3 tools/build_injector_xml.py > Jellyfin.Plugin.JavaScriptInjector.xml
```

then stop Jellyfin, copy the file to `<data dir>/plugins/configurations/`, start it. That replaces whatever the injector already had.

## Scripts

| # | Script | Auth | |
|---|--------|------|--|
| 00 | MQ-Config |  | optional detail-page ids |
| 01 | MQ-TV-Mode |  | Tizen / webOS / Roku throttling |
| 02 | MQ-Has-Polyfill |  |  |
| 03 | MQ-Kefin-Config-Block |  | stops a KefinTweaks retry loop on 12.x |
| 04 | MQ-Font-Loader |  | off by default; Inter fallback if you skip 30 |
| 05 | MQ-Fix-MultiLibrary-SeeAll-Links |  |  |
| 06 | MQ-DetailPageContent-Alias |  |  |
| 07 | MQ-ScrollToPosition-Polyfill |  |  |
| 08 | MQ-Fetch-Auth-Patch |  | 12.x auth header for legacy X-Emby-Token calls |
| 09 | Tweaks |  | loads KefinTweaks |
| 10 | KefinTweaks-Config |  | edit the ids |
| 11 | HiResPosters |  |  |
| 12 | MQ-Dashboard-Color-Fix |  |  |
| 13 | MQ-Card-Hover-Fix |  |  |
| 14 | MQ-Title-Logo |  |  |
| 15 | MQ-MUI-Nav-Active | yes |  |
| 16 | MQ-Header-Logo-Leak-Fix |  |  |
| 17 | MQ-Player-Controls-Failsafe |  | only for builds with the HLS OSD bug |
| 18 | MQ-Lazy-Image-Force-Load |  |  |
| 19 | MQ-Hero-Scroll-Sync |  |  |
| 20 | MQ-LiveTV-Default-Guide |  |  |
| 21 | MQ-DirecTV-Guide | yes | Live TV guide |
| 22 | MQ-Billboards | yes |  |
| 23 | MQ-Home-Tab |  |  |
| 24 | MQ-Toolbar-Mark |  |  |
| 25 | MQ-Nav-Scroll |  |  |
| 26 | MQ-Detail-Indent |  |  |
| 27 | MQ-Scroll-Class |  |  |
| 28 | MQ-Detail-Backdrop |  | detail page layout (the big one) |
| 29 | MQ-Guide-Sync |  |  |
| 30 | MQ-Netflix-Sans | yes | bring your own woff2 |
| 31 | MQ-UI-Polish | yes |  |
| 32 | MQ-Home-Dedupe |  |  |
| 33 | MQ-Detail-Thumbs |  |  |

Every script is independent; disable any of them and the rest keep working.

## Caveats

Built on one server on Jellyfin 12.0, so selectors target the 12.x DOM. The CSS is ~120 KB; fine on desktop and phones, throttled on TV browsers, and the native Samsung/LG apps don't load custom CSS or scripts at all. No fonts or artwork are included.

MIT.

/* Jellyfin 12 rejects X-Emby-Token; add the MediaBrowser Token header to those requests. */
(function() {
  if (window.__mqFetchAuthPatched) return;
  window.__mqFetchAuthPatched = true;
  const originalFetch = window.fetch.bind(window);
  window.fetch = function(input, init) {
    try {
      init = init || {};
      let headers = init.headers;
      if (input instanceof Request && !headers) headers = input.headers;
      headers = new Headers(headers || {});
      const embyToken = headers.get("X-Emby-Token");
      if (embyToken && !headers.get("Authorization")) {
        headers.set("Authorization", 'MediaBrowser Token="' + embyToken + '"');
      }
      if (input instanceof Request) {
        input = new Request(input, {
          headers: headers
        });
      } else {
        init = Object.assign({}, init, {
          headers: headers
        });
      }
    } catch (e) {
      console.warn("[MQ-Fetch-Auth-Patch] failed to patch headers", e);
    }
    return originalFetch(input, init);
  };
  console.log("[MQ-Fetch-Auth-Patch] window.fetch patched for X-Emby-Token -> Authorization");
})();
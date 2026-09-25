/* Optional ids for the detail page. Inject this first. Ids are the 32-char hex strings from the Jellyfin URL. */
(function () {
  "use strict";
  window.MQ_CONFIG = {

    // collection page -> borrow trailer/backdrop from this movie inside it
    trailerBackdrops: {
      // "<collectionId>": "<movieId>"
    },

    // show separate series entries as one anthology on the detail page
    anthologies: [
      // { name: "Anthology", members: [
      //   { id: "<seriesId>", num: 1, label: "Part One" },
      //   { id: "<seriesId>", num: 2, label: "Part Two" } ] }
    ]
  };
})();

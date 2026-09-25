/* KefinTweaks config. Replace the YOUR_*_ID placeholders with your own library/collection ids. */
window.KefinTweaksConfig = {
  kefinTweaksRoot: "https://cdn.jsdelivr.net/gh/ranaldsgift/KefinTweaks@latest/",
  scripts: {
    watchlist: true,
    homeScreen: true,
    search: true,
    infiniteScroll: true,
    removeContinue: true,
    skinManager: false,
    headerTabs: true,
    customMenuLinks: true,
    breadcrumbs: false,
    playlist: false,
    itemDetailsCollections: true,
    flattenSingleSeasonShows: true,
    seriesInfo: true,
    collections: true,
    subtitleSearch: false,
    exclusiveElsewhere: false,
    backdropLeakFix: true,
    dashboardButtonFix: true
  },
  homeScreen: {
    defaultItemLimit: 16,
    defaultSortOrder: "Random",
    defaultCardFormat: "Poster",
    recentlyReleased: {
      enabled: true,
      movies: {
        enabled: false,
        itemLimit: 16,
        name: "New Movies",
        sortOrder: "Random",
        sortOrderDirection: "Descending",
        cardFormat: "Poster",
        order: 1,
        isPlayed: null,
        minAgeInDays: 0,
        maxAgeInDays: 30
      },
      episodes: {
        enabled: false,
        itemLimit: 16,
        name: "New Episodes",
        sortOrder: "PremiereDate",
        sortOrderDirection: "Descending",
        cardFormat: "Thumb",
        order: 9,
        isPlayed: false,
        minAgeInDays: 0,
        maxAgeInDays: 30
      }
    },
    recentlyAddedInLibrary: {
      "YOUR_MOVIES_LIBRARY_ID": {
        enabled: false,
        itemLimit: 30,
        name: "New Movies",
        cardFormat: "Thumb",
        order: 20
      },
      "YOUR_SHOWS_LIBRARY_ID": {
        enabled: false,
        itemLimit: 30,
        name: "",
        cardFormat: "Poster",
        order: 21
      }
    },
    trending: {
      enabled: true,
      itemLimit: 16,
      name: "Trending",
      sortOrder: "Random",
      sortOrderDirection: "Ascending",
      cardFormat: "Poster",
      order: 45,
      isPlayed: null
    },
    popularTVNetworks: {
      enabled: false,
      minimumShowsForNetwork: 5,
      itemLimit: 6,
      name: "Popular Streaming Platforms",
      sortOrder: "Random",
      sortOrderDirection: "Descending",
      cardFormat: "Thumb",
      order: 7
    },
    watchlist: {
      enabled: false,
      itemLimit: 16,
      name: "Your Watchlist",
      sortOrder: "DateAdded",
      sortOrderDirection: "Descending",
      cardFormat: "Poster",
      order: 60
    },
    watchAgain: {
      enabled: true,
      itemLimit: 16,
      name: "Watch it Again",
      sortOrder: "CommunityRating",
      sortOrderDirection: "Descending",
      cardFormat: "Poster",
      order: 62
    },
    upcoming: {
      enabled: true,
      itemLimit: 48,
      name: "Coming Soon",
      cardFormat: "Poster",
      order: 0
    },
    imdbTop250: {
      enabled: false,
      itemLimit: 16,
      name: "IMDb Top 250",
      sortOrder: "Random",
      sortOrderDirection: "Ascending",
      cardFormat: "Poster",
      order: 21,
      isPlayed: null
    },
    seasonal: {
      enabled: false,
      enableSeasonalAnimations: true,
      enableSeasonalBackground: true,
      defaultItemLimit: 16,
      defaultSortOrder: "Random",
      defaultCardFormat: "Poster",
      seasons: [ {
        id: "halloween",
        name: "Halloween",
        enabled: true,
        startDate: "10-01",
        endDate: "10-31",
        order: 100,
        sections: [ {
          id: "halloween-tag",
          enabled: true,
          name: "Halloween Movies",
          type: "Tag",
          source: "halloween",
          itemLimit: 16,
          sortOrder: "Random",
          sortOrderDirection: "Ascending",
          cardFormat: "Poster",
          order: 50,
          renderMode: "Normal",
          spotlight: false,
          discoveryEnabled: false,
          searchTerm: "",
          includeItemTypes: [ "Movie" ],
          additionalQueryOptions: []
        }, {
          id: "halloween-horror",
          enabled: true,
          name: "Horror Genre",
          type: "Genre",
          source: "Horror",
          itemLimit: 16,
          sortOrder: "Random",
          sortOrderDirection: "Ascending",
          cardFormat: "Poster",
          order: 51
        }, {
          id: "halloween-thriller",
          enabled: true,
          name: "Thriller Genre",
          type: "Genre",
          source: "Thriller",
          itemLimit: 16,
          sortOrder: "Random",
          sortOrderDirection: "Ascending",
          cardFormat: "Poster",
          order: 52
        } ]
      }, {
        id: "thanksgiving",
        name: "Thanksgiving",
        enabled: true,
        startDate: "11-20",
        endDate: "11-30",
        order: 50,
        sections: [ {
          id: "seasonal-2-section-0",
          enabled: true,
          name: "Thanksgiving Movies",
          type: "Tag",
          source: "thanksgiving",
          itemLimit: 16,
          sortOrder: "Random",
          sortOrderDirection: "Ascending",
          cardFormat: "Poster",
          order: 50,
          renderMode: "Spotlight",
          spotlight: true,
          discoveryEnabled: false,
          searchTerm: "",
          includeItemTypes: [ "Movie" ],
          additionalQueryOptions: []
        }, {
          id: "seasonal-2-section-1",
          enabled: true,
          name: "Thanksgiving Episodes",
          type: "Parent",
          source: "",
          itemLimit: 16,
          sortOrder: "Random",
          sortOrderDirection: "Ascending",
          cardFormat: "Thumb",
          order: 51,
          renderMode: "Normal",
          spotlight: false,
          discoveryEnabled: false,
          searchTerm: "thanksgiving",
          includeItemTypes: [ "Episode" ],
          additionalQueryOptions: []
        } ]
      }, {
        id: "christmas",
        name: "Christmas",
        enabled: true,
        startDate: "12-01",
        endDate: "12-31",
        order: 100,
        sections: [ {
          id: "seasonal-1-section-0",
          enabled: true,
          name: "Christmas Movies",
          type: "Tag",
          source: "christmas",
          itemLimit: 16,
          sortOrder: "Random",
          sortOrderDirection: "Ascending",
          cardFormat: "Poster",
          order: 50,
          renderMode: "Spotlight",
          spotlight: true,
          discoveryEnabled: false,
          searchTerm: "",
          includeItemTypes: [ "Movie" ],
          additionalQueryOptions: []
        }, {
          id: "seasonal-1-section-1",
          enabled: true,
          name: "Christmas Episodes",
          type: "Parent",
          source: "",
          itemLimit: 16,
          sortOrder: "Random",
          sortOrderDirection: "Ascending",
          cardFormat: "Thumb",
          order: 51,
          renderMode: "Normal",
          spotlight: false,
          discoveryEnabled: false,
          searchTerm: "christmas",
          includeItemTypes: [ "Episode" ],
          additionalQueryOptions: []
        } ]
      } ]
    },
    discovery: {
      enabled: true,
      infiniteScroll: true,
      randomizeOrder: true,
      minPeopleAppearances: 2,
      minGenreMovieCount: 15,
      spotlightDiscoveryChance: 0,
      renderSpotlightAboveMatching: false,
      defaultItemLimit: 16,
      defaultSortOrder: "Random",
      defaultCardFormat: "Poster",
      sectionTypes: {
        spotlightGenre: {
          itemLimit: 16,
          name: "[Genre]",
          cardFormat: "Poster",
          order: 3,
          isPlayed: null,
          enabled: true
        },
        spotlightNetwork: {
          itemLimit: 6,
          name: "[Studio]",
          cardFormat: "Thumb",
          order: 4,
          isPlayed: null,
          enabled: true
        },
        genreMovies: {
          itemLimit: 26,
          name: "[Genre]",
          cardFormat: "Poster",
          order: 2,
          isPlayed: null,
          enabled: true
        },
        studioShows: {
          itemLimit: 16,
          name: "Shows from [Studio]",
          cardFormat: "Poster",
          order: 100,
          isPlayed: null,
          enabled: false
        },
        collections: {
          itemLimit: 6,
          name: "[Collection Name]",
          cardFormat: "Poster",
          order: 5,
          isPlayed: null,
          enabled: false,
          minimumItems: 6
        },
        becauseYouWatched: {
          itemLimit: 16,
          name: "Because You Watched [Movie]",
          cardFormat: "Poster",
          order: 18,
          isPlayed: false,
          enabled: true
        },
        becauseYouLiked: {
          itemLimit: 16,
          name: "Because you liked [Movie]",
          cardFormat: "Thumb",
          order: 100,
          isPlayed: null,
          enabled: false
        },
        starringTopActor: {
          itemLimit: 16,
          name: "Starring [Actor]",
          cardFormat: "Poster",
          order: 100,
          isPlayed: null,
          enabled: false
        },
        directedByTopDirector: {
          itemLimit: 16,
          name: "Directed by [Director]",
          cardFormat: "Poster",
          order: 100,
          isPlayed: null,
          enabled: false
        },
        writtenByTopWriter: {
          itemLimit: 16,
          name: "Written by [Writer]",
          cardFormat: "Poster",
          order: 100,
          isPlayed: null,
          enabled: false
        },
        becauseYouRecentlyWatched: {
          itemLimit: 16,
          name: "Because you recently watched [Movie]",
          cardFormat: "Thumb",
          order: 100,
          isPlayed: null,
          enabled: false
        },
        starringActorRecentlyWatched: {
          itemLimit: 16,
          name: "Starring [Actor] because you recently watched [Movie]",
          cardFormat: "Poster",
          order: 100,
          isPlayed: null,
          enabled: false
        },
        directedByDirectorRecentlyWatched: {
          itemLimit: 16,
          name: "Directed by [Director] because you recently watched [Movie]",
          cardFormat: "Poster",
          order: 100,
          isPlayed: null,
          enabled: false
        },
        writtenByWriterRecentlyWatched: {
          itemLimit: 16,
          name: "Written by [Writer] because you recently watched [Movie]",
          cardFormat: "Poster",
          order: 100,
          isPlayed: null,
          enabled: false
        }
      }
    },
    customSections: [ {
      id: "custom-section-0",
      enabled: false,
      name: "",
      type: "Parent",
      source: "",
      itemLimit: 6,
      sortOrder: "Name",
      sortOrderDirection: "Descending",
      cardFormat: "Thumb",
      order: 2,
      renderMode: "Spotlight",
      spotlight: true,
      discoveryEnabled: true,
      searchTerm: "Netflix, Prime, HBO, Paramount, Disney+, Hulu",
      includeItemTypes: [ "Movie" ],
      additionalQueryOptions: [ {
        key: "imageTypes",
        value: "Logo"
      }, {
        key: "nameStartsWith",
        value: "Netflix"
      }, {
        key: "nameStartsWith",
        value: "Prime"
      }, {
        key: "nameStartsWith",
        value: "HBO"
      }, {
        key: "nameStartsWith",
        value: "Paramount Plus"
      }, {
        key: "nameStartsWith",
        value: "Disney+"
      }, {
        key: "nameStartsWith",
        value: "Hulu"
      } ]
    }, {
      id: "custom-section-1",
      enabled: false,
      name: "New Arrivals (legacy)",
      type: "Parent",
      source: "new",
      itemLimit: 26,
      sortOrder: "DateAdded",
      sortOrderDirection: "Descending",
      cardFormat: "Poster",
      order: 100,
      renderMode: "Spotlight",
      spotlight: true,
      discoveryEnabled: true,
      searchTerm: "",
      includeItemTypes: [ "Movie", "Season", "Series", "Episode" ],
      additionalQueryOptions: []
    }, {
      id: "custom-section-2",
      enabled: false,
      name: "Get Ready For a New Season",
      type: "Collection",
      source: "",
      itemLimit: 1,
      sortOrder: "PremiereDate",
      sortOrderDirection: "Descending",
      cardFormat: "Poster",
      order: 76,
      renderMode: "Spotlight",
      spotlight: true,
      discoveryEnabled: true,
      searchTerm: "",
      includeItemTypes: [ "Season", "Series" ],
      additionalQueryOptions: [ {
        key: "ids",
        value: ""
      } ]
    }, {
      id: "mq-just-dropped",
      enabled: true,
      name: "Just Dropped",
      type: "Parent",
      source: "YOUR_MOVIES_LIBRARY_ID,YOUR_SHOWS_LIBRARY_ID",
      itemLimit: 30,
      sortOrder: "DateCreated",
      sortOrderDirection: "Descending",
      cardFormat: "Thumb",
      order: 1,
      renderMode: "Normal",
      spotlight: false,
      discoveryEnabled: false,
      searchTerm: "",
      includeItemTypes: [ "Movie", "Series" ],
      additionalQueryOptions: []
    }, {
      id: "mq-featured-collection",
      enabled: false,
      name: "Featured Collection",
      type: "Collection",
      source: "YOUR_COLLECTION_ID",
      itemLimit: 10,
      sortOrder: "PremiereDate",
      sortOrderDirection: "Ascending",
      cardFormat: "Thumb",
      order: 40,
      renderMode: "Normal",
      spotlight: false,
      discoveryEnabled: false,
      searchTerm: "",
      includeItemTypes: [ "Series" ],
      additionalQueryOptions: []
    } ]
  },
  exclusiveElsewhere: {
    hideServerName: true
  },
  search: {
    enableJellyseerr: false
  },
  defaultSkin: null,
  skins: [],
  themes: [],
  customMenuLinks: [],
  enabled: true,
  flattenSingleSeasonShows: {
    hideSingleSeasonContainer: true
  },
  optionalIncludes: [ {
    key: "global-lscambo13-custom-media-covers-latest-min.css",
    enabled: true
  }, {
    key: "global-JamsRepos-central-libraries-small.css",
    enabled: true
  }, {
    key: "global-JamsRepos-hide-my-media.css",
    enabled: true
  }, {
    key: "global-JamsRepos-smaller-cast.css",
    enabled: true
  }, {
    key: "global-LitCastVlog-ScyFlow-EpisodeGrid.css",
    enabled: true
  }, {
    key: "global-LitCastVlog-ScyFLow-RoundCastCrew.css",
    enabled: false
  }, {
    key: "global-CTalvio-smallercast.css",
    enabled: true
  }, {
    key: "global-CTalvio-episodes_compactlist.css",
    enabled: true
  }, {
    key: "global-CTalvio-episodes_grid.css",
    enabled: true
  }, {
    key: "global-CTalvio-pan-animation.css",
    enabled: true
  }, {
    key: "global-LitCastVlog-ScyFlow-AnimatedOverlay.css",
    enabled: true
  }, {
    key: "GlassFin-KBH-Reeper-MediaBar-Plugin-latest.css",
    enabled: false
  }, {
    key: "GlassFin-KBH-Reeper-CardButtons.css",
    enabled: false
  }, {
    key: "GlassFin-KBH-Reeper-ActivateBadges.css",
    enabled: false
  }, {
    key: "GlassFin-ranaldsgift-cardHoverEffect.css",
    enabled: false
  }, {
    key: "GlassFin-ranaldsgift-centerPlayButton.css",
    enabled: false
  }, {
    key: "GlassFin-ranaldsgift-libraryLabelVisibility.css",
    enabled: false
  }, {
    key: "GlassFin-ranaldsgift-solidAppBar.css",
    enabled: false
  }, {
    key: "Jellyfish-n00bcodr-progress_bar.css",
    enabled: false
  }, {
    key: "Jellyfish-n00bcodr-indicators.css",
    enabled: false
  }, {
    key: "Jellyfish-n00bcodr-icontext.css",
    enabled: false
  }, {
    key: "Jellyfish-n00bcodr-ratings.css",
    enabled: false
  }, {
    key: "Jellyfish-n00bcodr-streamberry_logo.css",
    enabled: false
  } ],
  kefinTweaksRootResolved: "https://cdn.jsdelivr.net/gh/ranaldsgift/KefinTweaks@v0.4.13/"
};
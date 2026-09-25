/* scrollToPosition polyfill. */
(function() {
  if (Element.prototype.scrollToPosition) {
    return;
  }
  Element.prototype.scrollToPosition = function(x) {
    try {
      this.scrollTo({
        left: x,
        behavior: "auto"
      });
    } catch (e) {
      this.scrollLeft = x;
    }
  };
})();
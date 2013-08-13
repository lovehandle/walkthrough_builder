(function () {
  window.HTMLCleaner = HTMLCleaner = (function (jQuery) {

    function HTMLCleaner () {} 

    HTMLCleaner.prototype.clean = function (doc, url) {
      this.cleanElement(doc, 'script', 'src', url);
      this.cleanElement(doc, 'link', 'href', url);
      this.cleanElement(doc, 'a', 'href', url);
      this.cleanElement(doc, 'img', 'src', url);

      return this;
    }

    HTMLCleaner.prototype.cleanElement = function (doc, el, attr, url) {
      jQuery(doc).find(el).each(function () {
        val = jQuery(this).attr(attr);
        if ((val !== undefined) && (val.substring(0,4) !== 'http')) {
          jQuery(this).attr(attr, url + val);
        }
      });
      return this;
    }

    return HTMLCleaner;

  })(jQuery);
}).call(this);

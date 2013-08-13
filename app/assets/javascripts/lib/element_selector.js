(function () {
  window.ElementSelector = ElementSelector = (function (jQuery) {

    // UTILITIES

    var nativeBind = Function.prototype.bind
    var ctor = function () {}

    function bind (func, context) {
      var args, bound, slice = Array.prototype.slice;

      if ((nativeBind !== undefined) && (func.bind == nativeBind)) return nativeBind.apply(func, slice.call(arguments, 1));
      if (typeof(func) !== 'function') throw new TypeError;

      args = slice.call(arguments, 2); 

      return bound = function () {
        if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
        return func.apply(context, args.concat(slice.call(arguments), 1));
        ctor.prototype = func.prototype; 
        var self = new ctor;
        ctor.prototype = null;
        var result = func.apply(self, args.concat(slice.call(arguments)));
        if (Object(result) === result) return result;
        return self;
      }
    }

    // ELEMENT SELECTOR

    function ElementSelector () {
      this.bound = true; 
      this.selected = undefined;
      this.restricted = [ 'HTML', 'BODY', 'HEAD' ];
    }

    ElementSelector.SELECTED_CLASS  = 'element_selector_selected';
    ElementSelector.SUGGESTED_CLASS = 'element_selector_suggested';

    ElementSelector.prototype.bind = function (doc) {
      this.doc = doc;
      this.$doc = jQuery(doc);
      this.bound = true;

      this.$doc.on('submit', 'form', bind(this.onFormSubmit, this));
      this.$doc.on('click', 'a', bind(this.onAnchorClick, this));
      this.$doc.on('mouseover', '*', bind(this.onMouseOver, this));
      this.$doc.on('mousedown', '*', bind(this.onMouseDown, this));
      this.$doc.on('mouseout', '*', bind(this.onMouseOut, this));
      this.$doc.on('keydown', 'html', bind(this.onKeyDown, this));

      this.injectCSS();
    }

    ElementSelector.prototype.unbind = function () {
      this.reset();

      this.doc = undefined;
      this.$doc = undefined; 
      this.bound = false; 

      this.$doc.off('submit', 'form', bind(this.onFormSubmit, this));
      this.$doc.off('click', 'a', bind(this.onAnchorClick, this));
      this.$doc.off('mouseover', '*', bind(this.onMouseOver, this));
      this.$doc.off('mousedown', '*', bind(this.onMouseDown, this));
      this.$doc.off('mouseout', '*', bind(this.onMouseOut, this));
      this.$doc.off('keydown', 'html', bind(this.onKeyDown, this));
    }

    ElementSelector.prototype.onFormSubmit = function (e) {
      e.preventDefault();
    }

    ElementSelector.prototype.onAnchorClick = function (e) {
      e.preventDefault();
    }

    ElementSelector.prototype.onMouseOver = function (e) {
      e.stopPropagation();
      if (this.bound === false) return false;
      this.suggestEl(e.target);
    }

    ElementSelector.prototype.onMouseOut = function (e) {
      e.stopPropagation();
      if (this.bound === false) return false;
      this.desuggestEl(e.target);
    }


    ElementSelector.prototype.onMouseDown = function (e) {
      e.stopPropagation();
      var el = e.target;

      if (this.bound === false) return false;
      if (jQuery.inArray(el, this.restricted) !== -1) return false;

      var potentialEl = this.firstSelectedOrSuggestedParent(el);
      if ((potentialEl !== null) && (potentialEl !== el)) el = potentialEl;

      this.selectEl(el);
    }

    ElementSelector.prototype.onKeyDown = function (e) {
      if (e.keyCode === 27) {
        this.reset();
      }
      return false;
    }

    ElementSelector.prototype.injectCSS = function () {
    
    }

    ElementSelector.prototype.reset = function () {
      this.deselectEl();
      this.$doc.find('.'+ElementSelector.SUGGESTED_CLASS).removeClass(ElementSelector.SUGGESTED_CLASS);
    }

    ElementSelector.prototype.isSelected = function (el) {
      return jQuery(el).hasClass(ElementSelector.SELECTED_CLASS);
    }

    ElementSelector.prototype.isSuggested = function (el) {
      return jQuery(el).hasClass(ElementSelector.SUGGESTED_CLASS);
    }

    ElementSelector.prototype.selectEl = function (el) {
      this.deselectEl({"silent": true});
      jQuery(el).addClass(ElementSelector.SELECTED_CLASS);
      this.selected = el
      this.trigger('selected:change');
      return true;
    }

    ElementSelector.prototype.deselectEl = function (opts) {
      if (opts === undefined) opts = {};
      if (this.selected === undefined) return false;
      jQuery(this.selected).removeClass(ElementSelector.SELECTED_CLASS);
      this.selected = undefined;
      if (opts.silent !== true) this.trigger('selected:change');
      return true;
    }

    ElementSelector.prototype.suggestEl = function (el) {
      jQuery(el).addClass(ElementSelector.SUGGESTED_CLASS);
      return true;
    }

    ElementSelector.prototype.desuggestEl = function (el) {
      jQuery(el).removeClass(ElementSelector.SUGGESTED_CLASS);
      return true;
    }

    ElementSelector.prototype.firstSelectedOrSuggestedParent = function (el) {
      if (this.isSuggested(el) || this.isSelected(el)) return el;

      var that = this;
      while ((el.parentNode !== undefined) && (el = el.parentNode)) {
        if (jQuery.inArray(el.nodeName, that.restricted) === -1) {
          if (that.isSuggested(el) || that.isSelected(el)) return el
        }
      }

      return null;
    }

    ElementSelector.prototype.trigger = function (eventName) {
      jQuery(this).trigger(eventName)
    }

    return ElementSelector;

  })(jQuery)
}).call(this);

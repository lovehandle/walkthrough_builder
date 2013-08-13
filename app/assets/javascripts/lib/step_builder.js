(function () {
  window.StepBuilder = StepBuilder = (function () {
    function StepBuilder () {} 
    
    function Step (attrs) {
      if (attrs === undefined) attrs = {};

      this.attributes = {
      
      } 

      this.set(attrs, { "silent": true });
    }

    Step.prototype.set = function (attrs, opts) {
      if (opts === undefined) opts = {};

      var changed = [];
      for (key in attrs) {
        if (key in this.attributes) {
          changed.push(key);
          this.attributes[key] = attrs[key];
        }
      }

      if (changed.length > 0 && opts.silent !== true) {
        for (var i = 0; i < changed.length; i++) {
          this.trigger('change:'+changed[i]);
        }
        this.trigger('change');
      }
    }

    Step.prototype.trigger = function () {
      jQuery(this).trigger(arguments);
    }

    Step.prototype.on = function () {
      jQuery(this).on(arguments)
    }

    Step.prototype.off = function () {
      jQuery(this).off(arguments);
    }

    return StepBuilder;
  })()
}).call(this);

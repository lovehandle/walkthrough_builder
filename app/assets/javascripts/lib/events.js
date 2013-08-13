(function () {
  window.Events = Events = (function () {

    var Events = {
      "on": function () {
         
      },

      "off": function () {
      
      },

      "trigger": function () {
      
      }
    }

    function Events () {} 

    Events.prototype.on = function (name, callback, context) {
      if (!api(this, 'on', name, [callback, context]) || !callback)) return this;
      if (this._events === undefined) this._events = {};
      if (this._events[name] === undefined) this._events[name] = [];
      this._events[name].push({ "callback": callback, "context": context, "ctx": context || this });
      return this;
    }

    Events.prototype.off = function (name, callback, context) {
      var retain, ev, events, names, i, j, k;
      if (this._events === undefined || !api(this, 'off', name, [callback, context])) return this;

    }

    return Events;
  })()
}).call(this);

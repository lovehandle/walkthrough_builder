(function () {
  window.TutorialBuilder = TutorialBuilder = (function () {

    // Utilities
    //
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

    var idCounter = 0;
    function uniqueId (prefix) {
      var id = ++idCounter + '';
      return prefix ? prefix + id : id;
    };

    // Tutorial Builder Model

    function TutorialBuilder () {
      this.tutorial = new Tutorial();
      this.view = new TutorialBuilderView(this);
    }

    TutorialBuilder.prototype.addStep = function (attrs) {
      return this.tutorial.addStep(attrs);
    }

    TutorialBuilder.prototype.removeStep = function (step) {
      return this.tutorial.removeStep(step);
    }

    // Tutorial Model

    function Tutorial (attrs) {
      if (attrs === undefined) attrs = {};

      this.cid = uniqueId('c')

      this.attributes = {
        'url': undefined
      };

      this.steps = [];

      this.set(attrs, { silent: true });
    }

    Tutorial.prototype.set = function (attrs, opts) {
      var changed = false;

      if (opts === undefined) opts = {};

      for (key in attrs) {
        if (key in this.attributes) {
          changed = true;
          this.attributes[key] = attrs[key];
          this.trigger('changed:'+key)
        }
      }

      if ((changed === true) && (opts.silent !== true)) this.trigger('changed')

      return this.attributes;
    }

    Tutorial.prototype.get = function (attr) {
      return this.attributes[attr];
    }

    Tutorial.prototype.addStep = function (attrs) {
      var step = new Step(attrs);

      this.steps.push(step);

      this.trigger('step:added');

      return this.steps;
    }

    Tutorial.prototype.removeStep = function (step) {
      var index = this.steps.indexOf(step);

      if (index !== -1) {
        this.steps.splice(index, 1);
        this.trigger('step:removed');
      }

      return this.steps;
    }

    Tutorial.prototype.trigger = function (eventName) {
      jQuery(this).trigger(eventName);
      return this;
    }

    Tutorial.prototype.on = function (eventName, callback) {
      jQuery(this).on(eventName, callback);
      return this;
    }

    Tutorial.prototype.off = function (eventName, callback) {
      jQuery(this).off(eventName, callback);
      return this;
    }

    Tutorial.prototype.toJSON = function () {
      var attrs = {}

      for (key in this.attributes) {
        attrs[key] = this.attributes[key]
      }

      var steps = [];

      for (index in this.steps) {
        steps.push(this.steps[index].toJSON()) 
      }

      attrs["steps"] = steps

      return { "tutorial": attrs } 
    }

    // Tutorial Step Model

    function Step (attrs) {
      if (attrs === undefined) attrs = {}

      this.cid = uniqueId('c')

      this.attributes = {
        'id': undefined,
        'title': "Unnamed Step",
        'body': undefined,
        'selector': undefined,
        'index': undefined
      };

      this.steps = [];

      this.set(attrs, { silent: true });
    }

    Step.prototype.set = function (attrs, opts) {
      var changed = false;

      if (opts === undefined) opts = {}

      for (key in attrs) {
        if (key in this.attributes) {
          changed = true
          this.attributes[key] = attrs[key];
          this.trigger('changed:'+key)
        }
      }

      if ((changed === true) && (opts.silent !== true)) this.trigger('changed')

      return this.attributes;
    }

    Step.prototype.get = function (attr) {
      return this.attributes[attr];
    }

    Step.prototype.trigger = function (eventName) {
      jQuery(this).trigger(eventName);
      return this;
    }

    Step.prototype.on = function (eventName, callback) {
      jQuery(this).on(eventName, callback);
      return this;
    }

    Step.prototype.off = function (eventName, callback) {
      jQuery(this).off(eventName, callback);
      return this;
    }

    Step.prototype.toJSON = function () {
      return this.attributes
    }

    // Tutorial Builder View

    function TutorialBuilderView (model) {
      this.model = model
      this.el = "#main"
      this.tutorialView = new TutorialView(this.model.tutorial) 
      this.proxyView = new ProxyView(this.model)
      this.bind()
    }

    TutorialBuilderView.prototype.render = function () {
      this.tutorialView.render();
    }

    TutorialBuilderView.prototype.bind = function () {
      jQuery(this.el).on('click', '#new-step', bind(this.onClickNewStep, this));
    }

    TutorialBuilderView.prototype.unbind = function () {
      jQuery(this.el).off('click', '#new-step', bind(this.onClickNewStep, this));
    }

    TutorialBuilderView.prototype.onClickNewStep = function (e) {
      this.model.addStep();
      return false;
    }

    // Tutorial View

    function TutorialView (model) {
      this.model = model;
      this.el = "#tutorial-form"
      this.stepViews = [];
      this.bind();
    }

    TutorialView.prototype.bind = function () {
      this.model.on('changed', bind(this.onChanged, this));
      this.model.on('step:added', bind(this.onStepAdded, this));
      this.model.on('step:removed', bind(this.onStepRemoved, this));

      jQuery(this.el).on('change', '#tutorial-url', bind(this._setUrl, this))
    }

    TutorialView.prototype.unbind = function () {
      this.model.off('changed', bind(this.onChanged, this));
      this.model.off('step:added', bind(this.onStepAdded, this));
      this.model.off('step:removed', bind(this.onStepRemoved, this));

      jQuery(this.el).off('change', '#tutorial-url', bind(this._setUrl, this))
    }

    TutorialView.prototype._setUrl = function (e) {
      this.model.set({ 'url': jQuery(e.target).val() }) 
    }

    TutorialView.prototype.render = function () {
      this.renderTutorial();
      this.renderSteps();

      return this;
    }

    TutorialView.prototype.renderTutorial = function () {
      content = JST['tutorials/tutorial_fields']({ "tutorial": this.model });
      jQuery(this.el).html(content);

      return this;
    }

    TutorialView.prototype.renderSteps = function () {
      var stepView

      for (index in this.stepViews) {
        this.stepViews[index].remove();
      }

      this.stepViews = [];

      for (index in this.model.steps) {
        stepView = new StepView(this.model.steps[index]) 
        this.stepViews.push(stepView);
        stepView.add()
      }

      return this;
    }

    TutorialView.prototype.onChanged = function () {
      this.renderTutorial();
    }

    TutorialView.prototype.onStepAdded = function () {
      this.renderSteps();
    }

    TutorialView.prototype.onStepRemoved = function () {
      this.renderSteps();
    }

    // Step View

    function StepView (model) {
      this.model = model; 
      this.parentEl = '#tutorial-steps-form'
      this.el = '#tutorial-step-' + this.model.cid
      this.bind();
    }

    StepView.prototype.bind = function () {
      this.model.on('changed', bind(this.onChanged, this));
      jQuery(this.parentEl).on('change', this.el + '-title', bind(this._setTitle, this))
      jQuery(this.parentEl).on('change', this.el + '-body', bind(this._setBody, this))
      jQuery(this.parentEl).on('change', this.el + '-selector', bind(this._setSelector, this))
    }

    StepView.prototype.unbind = function () {
      this.model.off('changed', bind(this.onChanged, this));
      jQuery(this.parentEl).off('change', this.el + '-title', bind(this._setTitle, this))
      jQuery(this.parentEl).off('change', this.el + '-body', bind(this._setBody, this))
      jQuery(this.parentEl).off('change', this.el + '-selector', bind(this._setSelector, this))
    }

    StepView.prototype.render = function () {
      content = JST['tutorials/tutorial_step_fields']({ "step": this.model });
      jQuery(this.el).replaceWith(content)
    }

    StepView.prototype.add = function () {
      content = JST['tutorials/tutorial_step_fields']({ "step": this.model });
      jQuery(this.parentEl).append(content)
    }

    StepView.prototype.remove = function () {
      this.unbind();
      jQuery(this.parentEl).html('')
    }

    StepView.prototype._setTitle = function (e) {
      this.model.set({ 'title': jQuery(e.target).val() }, { "silent": true });
    }

    StepView.prototype._setBody = function (e) {
      this.model.set({ 'body': jQuery(e.target).val() }, { "silent": true }) 
    }

    StepView.prototype._setSelector = function (e) {
      this.model.set({ 'selector': jQuery(e.target).val() }, { "silent": true }) 
    }

    StepView.prototype.onChanged = function () {
      this.render()
    }

    // Proxy View

    function ProxyView (model) {
      this.model = model;
      this.el = '#url-preview'
      this.bind();
      this.htmlCleaner = new HTMLCleaner()
    }

    ProxyView.prototype.bind = function () {
      this.model.tutorial.on('changed:url', bind(this.onURLChange, this));
      jQuery(this.el).get(0).onload = bind(this.onLoad, this)
    }

    ProxyView.prototype.unbind = function () {
      this.model.tutorial.off('changed:url', bind(this.onURLChange, this));
      jQuery(this.el).get(0).onload = undefined
    }

    ProxyView.prototype.onURLChange = function () {
      jQuery(this.el).attr('src', this.model.tutorial.get('url'))
    }

    ProxyView.prototype.onLoad = function () {
      el = $(this.el).get(0)
      this.htmlCleaner.clean(el.contentWindow.document, el.src);
      this.elementSelector.bind(el.contentWindow.document);
    }

    return TutorialBuilder;

  })();
}).call(this);

jQuery(function () {
  if (jQuery('body.tutorials.new').length > 0) {
    window.tutorialBuilder = new TutorialBuilder();
    window.tutorialBuilder.view.render();
  }
});

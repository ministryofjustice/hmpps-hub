//     Sitecore.js 1.0.1
//     (c) 2013 Sitecore

//This code will add the console object for all Browsers
//From https://raw.github.com/h5bp/html5-boilerplate/master/js/plugins.js
// Avoid `console` errors in browsers that lack a console.
(function () {
  var method;
  var noop = function () {};
  var methods = [
      'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
      'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
      'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
      'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
}());
// Place any jQuery/helper plugins in here.
(function () {
  //use strict to prevent use of Obsolete Functions
  "use strict";
  //keep a reference of the root (could be usefull for frame)
  var root = this,
    _Speak = {}//root.Sitecore.Speak // Map over Sitecore in case of overwrite
    ,
    __SPEAKDEBUG = root.__SITECOREDEBUG || false,
    __info = {}, __sc = window._sc // Map over the _sc in case of overwrite
    ,
    Speak, _sc, models, views, data, cmds, fctry;
  
  if (typeof root.Sitecore != "undefined") {
    _Speak = root.Sitecore.Speak;
  } else {
    root.Sitecore = {};
    root.Sitecore["Speak"] = {};
  }
  //define the global variable that will be used inside the core
  //support for COMMONJS, it will export the Sitecore global.
  if (typeof exports !== 'undefined') {
    _sc = Speak = exports;
  } else {
    //if we are not on COMMONJS style,
    //then we use the root (generally the window object) to store sitecore
    _sc = Speak = root.Sitecore.Speak = root._sc = {};
  }

  //keep Local reference for deps
  var $ = root.jQuery,
    _ = root._,
    ko = root.ko;

  //if we use require and underscore is not loaded, we try to load it
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');
  //if we use require and backbone is not loaded, we try to load it
  if (!Backbone && (typeof require !== 'undefined')) _ = require('backbone');
  //if we use require and ko is not loaded, we try to load it
  if (!ko && (typeof require !== 'undefined')) ko = require('knockout');

  //version of Sitecore
  _sc.VERSION = "1.0.1";
  //Define the API Entry Point
  _sc.__SPEAKDEBUG = __SPEAKDEBUG;
  _sc.__info = __info;

  _sc.Pipelines = {};
  _sc.Factories = {};
  _sc.Commands = {};

  _sc.Behaviors = {};
  _sc.Definitions = {
    Models: {},
    Views: {},
    Data: {}
  };

  models = _sc.Definitions.Models;
  views = _sc.Definitions.Views;
  data = _sc.Definitions.Data;
  cmds = _sc.Commands;
  fctry = _sc.Factories;

  _sc.Web = {};
  _sc.SiteInfo = {};
  _sc.SiteInfo.virtualFolder = "/";

  _sc.debug = function () {
    if (__SPEAKDEBUG) {
      switch (arguments.length) {
      case 1:
        console.log(arguments[0]);
        return;
      case 2:
        console.log(arguments[0], arguments[1]);
        return;
      case 3:
        console.log(arguments[0], arguments[1], arguments[2]);
      case 4:
        console.log(arguments[0], arguments[1], arguments[2], arguments[3]);
        return;
      }
      console.log(arguments);
    }
  };
  //KO stuffs  
  var myPartialBindingProvider = function (initialExclusionSelector, waitingSelector, componentSelector) {
    var result = new ko.bindingProvider(),
      originalHasBindings = result.nodeHasBindings;

    result.exclusionSelector = initialExclusionSelector;

    result.nodeHasBindings = function (node) {

      if (node.nodeType !== 8 && !$(node).is(result.exclusionSelector) && $(node).closest(waitingSelector).length === 0) {
        return originalHasBindings.call(this, node);
      }
      if (node.nodeType === 8) {
        if (!node.registered) {
          return originalHasBindings.call(this, node);
        }
      }
      return false;
    };

    result.getBindings = function (node, bindingContext) {
      // Only getBindings if context is right. Context must match the component
      var contextNode = bindingContext.$root.$el,
        componentNode = $(node).closest(componentSelector);

      if (contextNode && componentNode.length) {
        var contextNodeMatchesComponent = contextNode.is(componentNode);
        
        if (!contextNodeMatchesComponent) {
          return null;
        }
      }
      
      return ko.bindingProvider.prototype.getBindings.apply(this, arguments);
    };

    return result;
  };

  //to prevent registering the same component multiple times,
  //we add the class data-sc-registered at each component which have been data-bound.
  ko.bindingProvider.instance = new myPartialBindingProvider(".data-sc-registered", ".data-sc-waiting", "[data-sc-id]");

  //Readonly binding usefull for basic controls
  ko.bindingHandlers.readonly = {
    update: function (el, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());
      if (value) {
        el.setAttribute("readOnly", true);
      } else {
        el.removeAttribute("readOnly");
      }
    }
  };

  root.dialogClose = function (value) {
    _sc.trigger("sc-frame-message", value);
  };

  root.receiveMessage = function (value, caller) {
    _sc.trigger("sc-frame-message", value, caller);
  };

  root.getParameterByName = function (query) {
    query = query.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]"),
    regexS = "[\\?&]" + query + "=([^&#]*)",
    regex = new RegExp(regexS),
    results = regex.exec(window.location.href);

    if (results == null) return "";
    else return decodeURIComponent(results[1].replace(/\+/g, " "));
  };
// This is a plugin, constructed from parts of Backbone.js and John Resig's inheritance script.
// (See http://backbonejs.org, http://ejohn.org/blog/simple-javascript-inheritance/)
// No credit goes to me as I did absolutely nothing except patch these two together.
(function (Backbone) {
  Backbone.Model.extend = Backbone.Collection.extend = Backbone.Router.extend = Backbone.View.extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };
  
  var ctor = function () {}, inherits = function (parent, protoProps, staticProps) {
      var child, _super = parent.prototype,
        fnTest = /xyz/.test(function () {
          xyz;
        }) ? /\b_super\b/ : /.*/;

      // The constructor function for the new subclass is either defined by you
      // (the "constructor" property in your `extend` definition), or defaulted
      // by us to simply call the parent's constructor.
      if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
      } else {
        child = function () {
          parent.apply(this, arguments);
        };
      }

      // Inherit class (static) properties from parent.
      _.extend(child, parent);

      // Set the prototype chain to inherit from `parent`, without calling
      // `parent`'s constructor function.
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();

      // Add prototype properties (instance properties) to the subclass,
      // if supplied.
      if (protoProps) {
        _.extend(child.prototype, protoProps);
        //isLayout check if the propery is a composited
        var isLayout = protoProps["nestedlayout"] || child.prototype.nestedlayout;
        //this is done in order to differenciate the view and the model
        var isModel = (child.prototype.modelType === Backbone.Model);
        //We check if the model you are extending has a render, afterRender and beforeRender method. We need that in order to execute
        //the beforeRender, afterRender, render of the behaviors
        if (!isModel && !protoProps["render"] && !isLayout) {
          protoProps["render"] = function () {};
        }
        if (!isModel && !protoProps["afterRender"] && !isLayout) {
          protoProps["afterRender"] = function () {};
        }
        if (!isModel && !protoProps["beforeRender"] && !isLayout) {
          protoProps["beforeRender"] = function () {};
        }
        // Copy the properties over onto the new prototype
        for (var name in protoProps) {
          // Check if we're overwriting an existing function
          if (typeof protoProps[name] == "function" && typeof _super[name] == "function" && fnTest.test(protoProps[name])) {
            child.prototype[name] = (function (name, fn) {
              return function () {
                var tmp = this._super;

                // Add a new ._super() method that is the same method
                // but on the super-class
                this._super = _super[name];

                // The method only need to be bound temporarily, so we
                // remove it when we're done executing
                var ret = fn.apply(this, arguments);
                this._super = tmp;

                return ret;
              };
            })(name, protoProps[name]);
          }
          //if it is not a model and not a composite and if the we have a render, beforeRender or afterRender method
          //we add to the current method the ability to loop throught the object and execute the appropriate behavior "function"
          if (!isLayout && !isModel && (name === "render" || name === "beforeRender" || name === "afterRender")) {
            child.prototype[name] = (function (name, fn) {
              return function () {
                //we execute the normal function
                fn.apply(this, arguments);
                //if we have behavior we execute the function from the behavior
                if (this.hasBehavior) {
                  var behaviors = [];

                  if (name === "render") {
                    behaviors = this.behaviorsRender;
                  }
                  if (name === "afterRender") {
                    behaviors = this.behaviorsAfterRender;
                  }
                  if (name === "beforeRender") {
                    behaviors = this.behaviorsBeforeRender;
                  }

                  _.each(behaviors, function (init) {
                    init.apply(this, arguments);
                  }, this);
                }
              }
            })(name, protoProps[name]);
          }
        }
      }

      // Add static properties to the constructor function, if supplied.
      if (staticProps) _.extend(child, staticProps);

      // Correctly set child's `prototype.constructor`.
      child.prototype.constructor = child;

      // Set a convenience property in case the parent's prototype is needed later.
      child.__super__ = parent.prototype;

      return child;
    };
})(Backbone);
/*
models.Model = function (options) {

  //If the model wants to use KO, we prepare the viewModel for future use
  if(this.ko) { this.viewModel = {}; }

  if(this.defaults && options && _.isObject(options)) {
    this.defaults = _.extend(this.defaults, options);
  }

  //If the model wants to use KO and it has some defaults value
  //We create an appropriate viewModel based on the defaults values.
  if(this.ko && this.defaults) {
    //we remove the computed value from the defaults because Computed needs special tricks
    this._removeComputed();
    //we create the viewModel
    this._creatingViewModelFromDefaults();
  }

  if(this.useLocalStorage) {
    this.localStorage = new Sitecore.Definitions.Data.LocalStorage(options.name);
  }
  //We call the basic Backbone Model
  Backbone.Model.apply(this, [options]);

  //If the model wants to use KO
  if(this.ko) {
    //we know set the Computed with the special tricks
    this._setComputed();
    //Befare creating the ViewModel, we remove the function we do not want to be exposed
    //Generally all the base functions
    this._preventDefaultFunction();
    //we create the viewModel which means that as soons as a the Model will be instanciated
    //you will have a viewModel property which is a KO viewModel.
    this._creatingViewModel();
  }
};*/

models.Model = Backbone.Model.extend({
  ko: true,
  //As you know Javascript is a semi-dynamic language.
  //But sometimes you need to know th type of your object
  //Sure we have instanceOf or the toString() method
  //But as we are using inheritance a lot, sometimes the chain is broken
  //and this method won't work
  //So in place of relying on these 2 methods, I am setting a referene to the Backbone.Model
  //to modelType. This will allow you to write code like
  //if(this.modelType === Backbone.Model) than you know the Base Class is a Backbone.Model
  //Please AVOID this type of check as much as possible !!!!
  modelType: Backbone.Model,
  set: function () {
    var options = arguments[2];
    if (!arguments[2]) {
      arguments[2] = {};
    }
    var isReallySiletn = _.clone(arguments[2].silent);
    var force = arguments[2].force;
    //arguments[2].silent = true; //postpone the change

    Backbone.Model.prototype["set"].apply(this, arguments);

    if (options && options.computed) {
      this.computed = this.computed || {};
      this.computed[arguments[0]] = options;
    }
    if (!_.isObject(arguments[0]) && (!options || !options.local)) {
      this.updateViewModel(arguments[0], force);
    }
    if (_.isObject(arguments[0]) && (!options || !options.local)) {
      //full object to simple object
      var values = arguments[0];
      var keys = _.keys(values);
      _.each(keys, function (key) {
        this.updateViewModel(key);
      }, this);
    }
    /*if(!isReallySiletn) {
        this.change();
    }*/
  },
  constructor: function (options) {
    //If the model wants to use KO, we prepare the viewModel for future use
    if (this.ko) {
      this.viewModel = {};
    }

    if (this.defaults && options && _.isObject(options)) {
      this.defaults = _.extend(this.defaults, options);
    }

    //If the model wants to use KO and it has some defaults value
    //We create an appropriate viewModel based on the defaults values.
    if (this.ko && this.defaults) {
      //we remove the computed value from the defaults because Computed needs special tricks
      this._removeComputed();
      //we create the viewModel
      this._creatingViewModelFromDefaults();
    }

    if (this.useLocalStorage) {
      this.localStorage = new Speak.Definitions.Data.LocalStorage(options.name);
    }
    //We call the basic Backbone Model
    Backbone.Model.apply(this, [options]);

    //If the model wants to use KO
    if (this.ko) {
      //we know set the Computed with the special tricks
      this._setComputed();
      //Befare creating the ViewModel, we remove the function we do not want to be exposed
      //Generally all the base functions
      this._preventDefaultFunction();
      //we create the viewModel which means that as soons as a the Model will be instanciated
      //you will have a viewModel property which is a KO viewModel.
      this._creatingViewModel();
    }
  },
  /*
  initialize: function() {

  },*/
  _preventDefaultFunction: function () {
    var defaultFuncFromModel = ["_creatingViewModel", "_creatingViewModelFromDefaults", "_setComputed", "_findAppropriateAndApplyBinding", "_removeComputed", "_super", "_preventDefaultFunction", "_validate", "bind", "change", "changedAttributes", "clear", "clone", "constructor", "destroy", "escape", "fetch", "get", "has", "hasChanged", "initialize", "isNew", "isValid", "observable", "off", "on", "parse", "previous", "previousAttributes", "save", "set", "toJSON", "trigger", "unbind", "unset", "url"];
    var functionsFromModel = _.functions(this);
    this.applicableFunctionsFromModel = _.reject(functionsFromModel, function (funcName) {
      return (_.indexOf(defaultFuncFromModel, funcName) >= 0);
    });
  },
  _creatingViewModelFromDefaults: function () {
    var model = this,
      keys = _.keys(this.defaults);

    /*first we assign none computed value*/
    _.each(keys, function (key) {
      this._findAppropriateAndApplyBinding(key, this.defaults);
    }, this);
    /*computed Values should be runned after*/
    //_.each(keys, this._registerComputed, this);
    /*Subscribin should be runned after all value in viewModel are set*/
    //_.each(keys, this._registerSubscribe, this);

    var extendedModelBinding = {};

    if (this.applicableFunctionsFromModel) {
      _.each(this.applicableFunctionsFromModel, function (funcName) {
        extendedModelBinding[funcName] = function () {
          model[funcName].apply(model, arguments);
        };
      });
    }
    _.extend(this.viewModel, extendedModelBinding);
  },
  _removeComputed: function () {
    var keys = _.keys(this.defaults),
      defaults = this.defaults,
      model = this,
      computeds = [];

    _.each(keys, function (key) {
      var value = defaults[key];
      if (_.isObject(value) && value.computed) {
        //this is a computed value
        var clone = _.clone(value);
        var computed = {
          computed: true,
          read: clone.read
        };

        if (clone.write) {
          computed = _.extend(computed, {
            write: clone.write
          });
        }
        if (clone.owner) {
          computed = _.extend(computed, {
            owner: clone.owner
          });
        }
        computeds.push({
          key: key,
          value: clone.value,
          computed: computed
        });
        //delete defaults
        delete defaults[key];
      }
    });
    model.computeds = computeds;
  },
  _setComputed: function () {
    _.each(this.computeds, function (computed) {
      var value = computed.value || "";
      var option = _.extend(computed.computed, {
        local: true
      });
      this.set(computed.key, value, computed.computed, option);
    }, this);
  },
  updateViewModel: function (key, force) {
    if ((this.viewModel && !this.viewModel[key]) || force) {
      this._findAppropriateAndApplyBinding(key, this.attributes, force);
    }
  },
  _findAppropriateAndApplyBinding: function (key, extractFrom, force) {
    var vm = this.viewModel || {};
    if (!vm[key] || force) {
      if (_.isArray(extractFrom[key])) {
        if (extractFrom[key].length > 0 && extractFrom[key][0] && extractFrom[key][0].modelType === Backbone.Model) {
          var obsArr = [];
          _.each(extractFrom[key], function (model) {
            obsArr.push(model.viewModel);
          });
          vm[key] = ko.observableArray(obsArr);
          vm[key].nested = true;
        } else {
          vm[key] = ko.observableArray(extractFrom[key]);
        }
      } else {
        if (extractFrom[key] && extractFrom[key].constructor && _.isObject(extractFrom[key].constructor.__super__) && extractFrom[key].ko) {
          vm[key] = extractFrom[key].viewModel;
          vm[key].nested = true;
        } else {
          if (!this.computed || !this.computed[key]) {
            vm[key] = ko.observable(extractFrom[key]);
          }
        }
      }
      this._registerComputed(key);
      this._registerSubscribe(key);
    }
  },
  _registerSubscribe: function (key) {
    var model = this,
      subscriptions = this.subscriptions || [],
      viewModel = this.viewModel || {};

    if (!viewModel[key].nested) {
      if (!viewModel[key].isComputed) { //one way binding for computed
        model.on("change:" + key, function () {
          if (_.isArray(model.get(key)) && model.get(key).length > 0 && model.get(key)[0] && model.get(key)[0].modelType && model.get(key)[0].modelType === Backbone.Model) {
            var viewModelarr = [];
            _.each(model.get(key), function (chil) {
              viewModelarr.push(chil.viewModel);
            });
            viewModel[key](viewModelarr);
          } else {
            viewModel[key](model.get(key));
          }
        });
      }

      if (viewModel[key].subscribe) {
        subscriptions[key] = viewModel[key].subscribe(function (newValue) {
          model.set(key, newValue);
        });
      }
    }
  },
  _registerComputed: function (key) {
    var model = this,
      viewModel = this.viewModel || {};

    if (model.computed && model.computed[key]) {
      if (this.computed[key]["write"] && !this.computed[key]["owner"]) {
        model.computed[key]["owner"] = this.viewModel;
      }
      var comp = _.pick(model.computed[key], 'write', 'owner', 'read');

      if (!comp.write) {
        viewModel[key] = ko.computed(comp.read, this.viewModel); //be carefully you can only value already defined
      } else {
        viewModel[key] = ko.computed(comp); //be carefully you can only value already defined
      }
      viewModel[key].isComputed = true;
    }
  },
  _creatingViewModel: function () {
    var keys = _.keys(this.attributes);

    /*first we assign none computed value*/
    _.each(keys, function (key) {
      this._findAppropriateAndApplyBinding(key, this.attributes);
    }, this);
    /*computed Values should be runned after*/
    _.each(keys, this._registerComputed, this);
    /*Subscribin should be runned after all value in viewModel are set*/
    _.each(keys, this._registerSubscribe, this);
  }
});

models.Model.extend = Backbone.Model.extend;

views.View = function (options) {
  if (options) {
    this.app = options.app ? options.app : "No parent for this app";
    delete options.app;
  }
  
  var self = this;
  if (options && options.behaviors) {
    _.each(options.behaviors.split(" "), function (behav) {
      self.addBehavior(Speak.Behaviors[behav]);
    });
  }

  Backbone.View.apply(this, [options]);

  if (this.model && this["$el"] && !this.model.viewModel["$el"]) {
    this.model.viewModel.$el = this.$el;
  }

  if (this.model && this["app"] && !this.model.viewModel["app"]) {
    this.model.viewModel.app = this.app;
  }

  // It looks like a duplicate of backbone view functions
  //if (this.hasBehavior) {
  //  _.each(this.behaviors, function (init) {
  //    init.call(this);
  //  }, this);
  //}

  this.setupFunctionWhichCouldBeDataBound();
  this.sync();
};

_.extend(Speak.Definitions.Views.View.prototype, Backbone.View.prototype, {
  /*the goal of this is to delegate the function from backbone to the binding in order to call function from the view and from the model with data-bind*/
  setupFunctionWhichCouldBeDataBound: function () {
    var defaultFuncs = ["$", "_configure", "_ensureElement", "setupFunctionWhichCouldBeDataBound", "applyBindingsIfApplicable", "bind", "constructor", "delegateEvents", "initialize", "make", "off", "on", "remove", "render", "setElement", "trigger", "unbind", "undelegateEvents", "afterRender", "beforeRender", "sync"];
    var functions = _.functions(this);
    this.applicableFunctionsFromView = _.reject(functions, function (funcName) {
      return (_.indexOf(defaultFuncs, funcName) >= 0);
    });

    var view = this;
    _.each(this.applicableFunctionsFromView, function (funcName) {
      if (this.model && this.model.viewModel[funcName]) {
        throw "Conflicted names between Model and View, please provide different names: " + funcName;
      }
      if (this.model) {
        this.model.viewModel[funcName] = function () {
          return view[funcName].apply(view, arguments);
        };
      }
    }, this);
  },
  sync: function () {
    if (this.model && this.model.ko) {
      if (__SPEAKDEBUG) {
        console.log("Applying Binding for the element which has the data-sc-id: " + this.$el.data("sc-id") + ". The viewModel you are trying to apply is:", this.model.viewModel);
      }

      ko.applyBindings(this.model.viewModel ? this.model.viewModel : this.model, this.$el.get(0));
    }
  },
  listen: {

  }
});

views.View.extend = Backbone.View.extend;

// The basic application type
Speak.Definitions.App = Backbone.Model.extend({
  appId: undefined,
  modelType: "application",
  initialize: function (options) {
    this.Controls = [];
    if (this.appId) {
      this.localStorage = new Speak.Definitions.Data.LocalStorage(this.appId);
    } else {
      this.localStorage = "you need to provide a appID in order to use localStorage";
    }
  },
  // Create an run the application
  run: function (name, id, mainapp) {
    var app = _sc.Factories.createApp(name, id, mainapp, this);

    // If the 'initializated' method is defined, run it
    if (typeof this.initialized != "undefined") {
      this.initialized();
    }

    app.ScopedEl.find("[data-sc-cloak]").removeAttr("data-sc-cloak");
    app.trigger("app:loaded");

    return app;
  },
  insertControl: function (def, callback, options) {
    var that = this;

    $.post("/api/rendering", def, function (html) {
      that.insertMarkups(html, name, callback, options);
    });
  },
  insertRendering: function (itemId, options, callback) {
    var item,
      that = this,
      selector,
      $el,
      ajaxOptions = options["ajax"]|| {},
      defaultOptions = {
        database: "core",
        path: "/sitecore/shell/api/sitecore/Layout/RenderItem"
      },
      cb = callback,
      jqxhr,
      successCb,
      errorCb;

    var lang = $('meta[data-sc-name=sitecoreLanguage]').attr("data-sc-content");
    
    if (ajaxOptions && ajaxOptions["success"]) {
      successCb = ajaxOptions["success"];
    }

    errorCb = ajaxOptions["error"];
    
    if (_.isFunction(options)) {
      cb = options;
    } else if (options) {
      defaultOptions = _.extend(defaultOptions, options);
      selector = options.selector ? options.selector : undefined;
      $el = options.$el ? options.$el : undefined;
    }

    if (!defaultOptions.name) {
      defaultOptions.name = _.uniqueId("subapp_");
    }

    var requestUrl = defaultOptions.path + "?sc_itemid=" + itemId + "&sc_database=" + defaultOptions.database + ((lang) ? "&sc_lang=" + lang : "");
    
    jqxhr=$.ajax({
      url: requestUrl,
      method:"GET",
      beforeSend:ajaxOptions["beforeSend"],
      success: function (data, textStatus, jqXHR) {
        if (successCb) {
          successCb.call(data, textStatus, jqXHR);
        }
        that.insertMarkups(data, defaultOptions.name, {
          selector: selector,
          $el: $el
        }, cb);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 401) {
          _sc.Helpers.session.unauthorized();
          return;
        }

        if (errorCb) {
          errorCb.call(jqXHR, textStatus, errorThrown);
        }
      },
      complete: ajaxOptions["complete"]
    });

    return jqxhr;
  },
  insertMarkups: function (html, name, options, cb) {
    var defaults = {
      prepend: false,
      selector: undefined,
      parent: undefined,
      $el: undefined
    },
      options = _.extend(defaults, options),
      markup = "<div id='" + name + "' data-sc-app style='display:none;'>" + html + "</div>",
      whereToInject;

    if (options.$el) {
      whereToInject = options.$el;
    } else if (options.selector) {
      whereToInject = $(options.selector);
    } else {
      whereToInject = $("body");
    }

    if (options.prepend) {
      whereToInject.prepend(markup);
    } else {
      whereToInject.append(markup);
    }

    _sc.load(window, whereToInject.find("#" + name), function (app) {
      app.ScopedEl.show();

      if (cb) {
        cb(app);
      }
    });
  },
  destroy: function () {
    var app = this;

    _.each(app.Controls, function (control) {
      control.view.$el.data("sc-app", null); //deregister the control
      control.view.$el.removeClass("data-sc-registered");
    });
    //delete sub controls
    for (var param in app) {
      if (app[param] instanceof Speak.Definitions.App) {
        _.each(app[param].Controls, function (control) {
          control.view.$el.data("sc-app", null); //deregister the control
          control.view.$el.removeClass("data-sc-registered");
        });
      }
    }
    //now delete the app and clean up bindings
    _.each(app.Controls, function (control) {
      ko.cleanNode(control["view"].$el.get(0));
      delete control["model"];
      delete control["view"];
    });

    for (var param in app) {
      delete app[param];
    }

    return undefined;
    //delete Sitecore[appName]; //delete the name
  },
  closeDialog: function (returnValue) {
    window.top.returnValue = returnValue;
    window.top.dialogClose(returnValue);
  },
  sendMessage: function (returnValue) {
    window.top.receiveMessage(returnValue, root.getParameterByName("sp"));
  }
  //dropped as we have separate control for that
  /*,
  openDialog: function (url, args, features) {
    return window.showModalDialog(url, args, features);
  }*/
});

Speak.Definitions.App.extend = Backbone.View.extend;

_.extend(Speak, Backbone.Events);

_.extend(views.View.prototype,
    {
      addBehavior: function (protoProps) {
        this.hasBehavior = true;
        this.behaviors = this.behaviors || [];
        this.behaviorsBeforeRender = this.behaviorsBeforeRender || [];
        this.behaviorsAfterRender = this.behaviorsAfterRender || [];
        this.behaviorsRender = this.behaviorsRender || [];

        if (!protoProps.initialize && !protoProps.afterRender && !protoProps.render && !protoProps.beforeRender) {
          throw "behavior should have an initialize or an after Render method";
        }

        if (protoProps.events) {
          if (this.events) {
            _.extend(this.events, protoProps.events);
          } else {
            this.events = protoProps.events;
          }
        }
        if (protoProps.initialize) {
          this.behaviors.push(protoProps.initialize);
        }
        if (protoProps.afterRender) {
          this.behaviorsAfterRender.push(protoProps.afterRender);
        }
        if (protoProps.render) {
          this.behaviorsRender.push(protoProps.render);
        }
        if (protoProps.beforeRender) {
          this.behaviorsBeforeRender.push(protoProps.beforeRender);
        }

        var behavior = _.omit(protoProps, 'initialize', 'events', 'afterRender', 'render', 'beforeRender');

        _.extend(this, behavior);
      }
    });

_.extend(_sc, {
  /**
   *  destroy the app and unregister all the bindings
   *  @param {app} Sitecore.Definitions.Application you want to destroy
   */
  destroy: function(app) {
    if( !app && !app.destroy ) { throw "you need an app to be destroy"};
    var name = app.name;
    app.destroy();
    delete Speak[name];
  },
  /**
   *  destroy the app and unregister all the bindings
   *  @param {deep} removing all Sitecore variables from the global scope
   *  @returns the Sitecore library
   */
  noConflict: function(deep) {
    if (root._sc === Speak) {
      root._sc = __sc;
    }

    if (deep && root.Speak === Speak) {
      root.Speak = _Speak;
    }

    return Speak;
  }
});

_.extend(_sc, {
  /**
   * load dependencies you need to the PageCode
   * @params {global} generally the windows object
   */
  load: function (global, scopedEL, appLoaded) {
    // collect dependencies from html attributes - dependencies can be separated by commas
    var depsPageCode = [],
      allDepsArray = [],
      firstLoad = false;
    if (!scopedEL) {
      scopedEL = $("html");
      firstLoad = true;
    }

    $(scopedEL).find("[data-sc-require]").each(function () {
      var $depEl = $(this);

      if (!$depEl.is('[data-sc-app]') && $depEl.attr("type") !== "text/x-sitecore-pagecode") {
        $.each($depEl.data("sc-require").split(","), function (i, e) {
          if (_.indexOf(allDepsArray, e) < 0) {
            allDepsArray.push(e);
          }
        });
      }
    });

    if (window.__speak_config && window.__speak_config.useBundle) {
      var allDeps = window.location.origin + "/-/speak/v1/bundles/bundle.js?c=1&n=1&f=" + allDepsArray.join(",");
      depsPageCode.push(allDeps);
    } else {
      depsPageCode = depsPageCode.concat(allDepsArray);
    }

    // override require.js define() to collect sub-dependencies
    var subdeps = [];

    //save the old one
    var _oldDefinedFunction = global.__sc_define;

    global.__sc_define = function (name, deps, callback) {
      if (typeof name == "string") {
        subdeps.push(name);
      }

      if (_oldDefinedFunction)
        _oldDefinedFunction(name, deps, callback);
    };

    $(scopedEL).find("script[type='text/x-sitecore-pagecode']").each(function () {
      global.__sc_define($(this).attr("data-sc-require"));
    });
    
    // load dependencies from html attributes
    require(depsPageCode, function () {
      // find the page code
      var $pageCode = $(scopedEL).find("script[type='text/x-sitecore-pagecode']"),
        $page = $(scopedEL),
        pageCodeSrc = $pageCode.attr("data-sc-require"),
        behaviorsFromPagecode = $pageCode.data("sc-behaviors"),
        pageCode = null;

      $page.attr("data-sc-behaviors", behaviorsFromPagecode);

      var runPageCode = function () {
        if (subdeps.length == 0) {
          // no dependencies - instantiate the page code and run it
          global.__sc_define = _oldDefinedFunction;
          var instance = new pageCode();
          if (appLoaded) {
            appLoaded(instance.run(scopedEL.attr("id"), scopedEL.attr("id")));
          } else {
            instance.run();
          }
          if (firstLoad) {
            _sc.Helpers.overlay.loadOverlays(instance);
          }
        } else {
          // subdependencies found - run recursively
          var t = subdeps;
          subdeps = [];
          _sc.debug("Requiring files: ", t);
          require(t, runPageCode);
        }
      };

      // define function to be called recursively until no subdependencies are collected
      var run = function () {
        if (subdeps.length === 0) {
          // if there is an app, load and run it
          if (pageCodeSrc) {

            _sc.debug("Requiring page code: ", [pageCodeSrc]);

            require([pageCodeSrc], function (pc) {
              pageCode = pc;
              runPageCode();
            });

          } else {
            // no pagecode - run default
            global.__sc_define = _oldDefinedFunction;
            var app;

            if (firstLoad) {
              app = Speak.Factories.createApp();

              _sc.Helpers.overlay.loadOverlays(app);
              // If the 'initializated' method is defined, run it
              if (typeof app.initialized != "undefined") {
                app.initialized();
              }
            } else {
              app = Speak.Factories.createApp(scopedEL.attr("id"), scopedEL.attr("id"));
            }

            app.ScopedEl.find("[data-sc-cloak]").removeAttr("data-sc-cloak");

            if (firstLoad) {
              app.trigger("app:loaded");
            }

            if (appLoaded) {
              appLoaded(app);
            }
          }
        } else {
          // subdependencies found - run recursively
          var t = subdeps;

          subdeps = [];
          _sc.debug("Requiring files: ", t);
          require(t, run);
        }
      };

      if (window.__speak_config && window.__speak_config.useBundle) {
        require(allDepsArray, function () {
          run();
        });
      } else {
        run();
      }
    });
  }
});
_.extend(cmds, {
  /**
   * resovle the property name in the global Object
   * @params {propertyName} property we will try to resolve
   * return the value of the property
   */
  resolve: function (propertyName) {
    if(!_.isString(propertyName)) { throw "provied a correct Path to resolve"; }

    var parts = propertyName.split('.');

    var property = root || window;
    for (var n = 0; n < parts.length; n++) {
      property = property[parts[n]];
        if (property == null) { throw "Reference '" + propertyName + "' not found"; }
    }

    return property;
  },
  /**
   * execute some command available in the Speak.Commands namespace 
   * @params {commandName} the name of the command
   * @params {context} the context you want to pass to the command
   */
  executeCommand: function (commandName, context) {
    if (!commandName || !_.isString(commandName)) { throw "cannot execute command without commandName"; }

    var command = cmds.getCommand(commandName);

    if (command.canExecute(context)) {
      command.execute(context);
    }
  },
  /**
   * getCommand avialable
   * @params {commandName} the command you want to retrieve
   * @returns the command
   */
  getCommand: function (commandName) {
    return cmds.resolve(commandName);
  }
});
var scInit = function() {

  var scAttrs = this._scAttrs;

  _.each(scAttrs, function(attr) {
    if(attr["value"] && attr["value"].indexOf("$el.") !== -1) {
      var value,
          path = attr["value"].substring("$el.".length); 

      if(path.indexOf(":") !== -1) {

        var paths = path.split(":");

        if(paths.length === 2) {

          var valueFromDOM = this.$el[paths[0]](paths[1]);

          if(typeof valueFromDOM !== 'undefined') {
            this.model.set(attr["name"], valueFromDOM);  
          } else {
            //we check if there is a default values
            if(attr["defaultValue"]) { //we fallback to the default value if there is one
              this.model.set(attr["name"], attr["defaultValue"]);  
            }
          }
        }
      } else {
        this.model.set(attr["name"], this.$el[path]());
      }
    }
  }, this);

  _.each(scAttrs, function(attr) {
    if(attr["on"]) {
      this.model.on("change:" + attr["name"], this[attr["on"]], this);
    }
  }, this);
};

var _scInitDefaultValueFromLocalStorage = function() {
  if(this._scAttrs) {
    _.each(this._scAttrs, function(attr) {
      var keys = _.keys(attr);
      var valFromLocalStorage = this.localStorage.get(attr["name"]);
      if(valFromLocalStorage) {
        this.set(attr["name"], valFromLocalStorage)
      } else {
        if(keys.indexOf("defaultValue") === -1 && attr["value"] && attr["value"].indexOf("$el.") !== -1) {
          this.set(attr["name"], null);
        } else if(keys.indexOf("defaultValue") === -1 && attr["value"].indexOf("$el.") === -1) {
          this.set(attr["name"], attr["value"]);  
        } else if(keys.indexOf("defaultValue") > -1) {
          this.set(attr["name"], attr["defaultValue"]);
        } else {
          this.set(attr["name"], undefined);
        }
      }
    }, this);     
  }
}

var scDefaultValue = function () {
  if (this._scAttrs) {
    _.each(this._scAttrs, function (attr) {
      var keys = _.keys(attr);

      if (_.indexOf(keys, "defaultValue") === -1 && attr["value"] && attr["value"].indexOf("$el.") !== -1) {
        this.set(attr["name"], null);
      } else if (_.indexOf(keys, "defaultValue") === -1 && attr["value"].indexOf("$el.") === -1) {
        this.set(attr["name"], attr["value"]);
      } else if (_.indexOf(keys, "defaultValue") > -1) {
        this.set(attr["name"], attr["defaultValue"]);
      } else {
        this.set(attr["name"], undefined);
      }
    }, this);
  }
};

var localStoragetSet = function(model) {
  var baseModel = model;
  return function() {
    baseModel.prototype["set"].apply(this, arguments);

    var options = arguments[2];

    if(_.isObject(arguments[0]) && (!options || !options.local)) {
      //full object to simple object
      var values = arguments[0];
      var keys = _.keys(values);
      _.each(keys, function(key) {
        this.localStorage.set(key, values[key]);
      }, this);
    }
    if(!_.isObject(arguments[0]) && (!options || !options.computed)) {
      this.localStorage.set(arguments[0], arguments[1]);
    }
  };
};

_.extend(fctry, {
  /**
   * createBehavior will add behavior in the Speak.Behaviors namespace
   * @params {name} the name of your behavior
   * @params {behavior} the object you want to turn as a behavior
   * @returns the behavior
   * Changed by ANB on 14.02.04
   * Proviusly the code was throwing an error if the behavior existed, 
   * but since it can happen that our pages try to load teh same behavior (as abehavior rendering or as a required file)
   * than I have checked if the behavior exists, it doesn't add it but it write it on the console.
   */
  createBehavior: function(name, behavior) {

    _sc.Behaviors = _sc.Behaviors || { };

    if (!_sc.Behaviors[name]) {
      _sc.Behaviors[name] = behavior;
    } else {
      _sc.debug("You are trying to create twice the behaviour " + name);  
    }

    return _sc.Behaviors[name];
  },

   /**
   * createComponent, base API to create simple Component
   * @params: {
   *  name: String - "Name of the Control",
   *  selector: String - "css class that will help Speak to register approriate Component"
   *  attrs: [{ }] - "array of object which can define the default value and the value"
   *  initialize: funct - The function that will be exected during the Initialize Time of the Run Method
   *  functions: { } - "the function that will be attached to the component"
   * }
   *          
   */
  createBaseComponent: function(obj) {
    if(!obj.name || !obj.selector) { throw "provide a name and/or a selector"; }

    var componentName = obj.name
      , selector = obj.selector
      , attrs = obj.attributes
      , initialize = obj.initialize
      , base = obj.base
      , based = ["attributes", "name", "selector", "base", "plugin", "initialize", "listenTo", "_scInitFromObject", "extendModel", "_scInit", "_scInitDefaultValue"]
      , functions = _.omit(obj, based)
      , baseModel = models.Model
      , baseView = views.View
      , baseComponent
      , isLocalStorage = obj.localStorage
      , extendModel = obj.extendModel || { }
      , collection = obj.collection
      , exposed;

    if(base) {
      baseComponent = _.find(_sc.Components, function(comp) { return comp.type === base; });
    }

    if(baseComponent) {
      baseModel = baseComponent.model;
      baseView = baseComponent.view;
    }

    if(isLocalStorage) {
      extendModel = _.extend(extendModel, {
        constructor: function () {
          baseModel.apply(this, arguments);
          this._scInitDefaultValueFromLocalStorage();
        },
        set: localStoragetSet(baseModel),
        useLocalStorage: true 
      });
    } else {
      extendModel = _.extend(extendModel, {
        constructor: function() {
          baseModel.apply(this, arguments);
          this._scInitDefaultValue();
        }
      });
    }
    
    var ComponentModel = baseModel.extend(extendModel);

    var ComponentView = baseView.extend({
      initialize: function () {
        _sc.debug("initialize - " + componentName);
        this._super();
        if (this.model.componentName != componentName) {
          return;
        }
        if(this._scInitFromObject) {
          this._scInit();
          this._scInitFromObject();
        } else {
          this._scInit();
        }
      }
    });

    ComponentModel = ComponentModel.extend({
      _scAttrs: attrs,
      _scInitDefaultValue: scDefaultValue,
      _scInitDefaultValueFromLocalStorage: _scInitDefaultValueFromLocalStorage
    });

    exposed = _.extend(functions, {
      _scAttrs: attrs,
      _scInit: scInit,
      _scInitFromObject: initialize
    });

    if(obj["listenTo"]) {
      var listen = {},
          parent = baseView.prototype.listen,
          listenTo = obj["listenTo"],
          listenKeys = _.keys(listenTo);

      _.each(listenKeys, function(key){
        //build the listen
        listen[key + ":$this"] = listenTo[key]
      });
      listen = _.extend(parent, listen);

      ComponentView = _.extend(ComponentView, listen);
    }

    var exposedCollection;
    if(collection) {
      exposedCollection = Backbone.Collection.extend({
        model: collection
      });
    }

    ComponentView = ComponentView.extend(exposed);

    return _sc.Factories.createComponent(componentName, ComponentModel, ComponentView, selector, exposedCollection);    
  },
  /**
   * createComponent will create a component inside the Speak.Components namespace
   * @param {type} string which defines the namespace
   * @param {model}
   * @param {view}
   * @param {el} the selector
   * @param {collection} optionnal, if you want a collection in your component
   * @returns a component
   */
  createComponent: function(type, model, view, el, collection) {
    var component;

    if(!_.isString(type) || !model || !view || !_.isString(el)) { throw "please provide a correct: type (str), model, view and el (html class or id)";}

    _sc.Components = _sc.Components || [];
    _sc.Definitions.Models[type] = model;
    _sc.Definitions.Views[type] = view;

    if(collection) { _sc.Definitions.Collections[type] = collection; }

    _.each(_sc.Components, function(component) {
      if(component.el === el) {  throw "you are trying to add compoment with the same el (.class or #id)"; }
    });

    component = {
        type: type,
        model: model,
        view: view,
        el: el,
        collection: collection
    };

    _sc.Components.push(component);

    return component;
  },
  /**
   * Creating an application object
   * @param {name} the name of your application
   * @param {id} the #id
   * @param {mainApp} the root app
   * @param {app} the current app
   * @returns an application object
   */
  createApp: function(name, id, mainApp, app) {
    var context = { };

    if(_.isObject(name)) {
      context = name;
      _sc.Pipelines.Application.execute(context);
      return context.current;
    } else {
      context.name = name;
      context.id = id;
      context.mainApp = mainApp;
      context.app = app;
      context.aborted = false;

      _sc.Pipelines.Application.execute(context);
      return context.current;
    }
  },
  /**
   * Creating an application object
   * @param {pageUniqueId}
   * @param {id} the #id
   * @returns an application object
   */
  createPageCode: function(pageUniqueId, obj) {
    var rs;
    rs = _sc.Definitions.App.extend(obj);
    rs = rs.extend({ appId: pageUniqueId});
    return rs;
  },
  /*
  convert: {
    name:"hasValue",
    convert: function(param, //params from the converter) {
      return "value";
    }
  }
  */
  createBindingConverter: function(convert) {
    if(!convert.name || !convert.convert) { throw "invalid binding converter"; }
    if(_sc.BindingConverters && _sc.BindingConverters[convert.name]) { throw "already a converter with the same name"; }

    _sc.BindingConverters = _sc.BindingConverters || {};
    _sc.BindingConverters[convert.name] = convert.convert;
  }
});

models.ComponentModel = models.Model.extend({
  initialize: function() {
  }
});

models.ControlModel = models.ComponentModel.extend({
  initialize: function() {
    this._super();
    this.set("isVisible", true);
  },
  toggle: function () {
    this.set("isVisible", !this.get("isVisible"));
  }
});

models.BlockModel = models.ControlModel.extend({
  initialize: function() {
    this._super();
    this.set("width", 0);
    this.set("height", 0);
  }
});

models.InputModel = models.ControlModel.extend({
  initialize: function() {
    this._super();
    this.set("isEnabled", true);
  }
});

models.ButtonBaseModel = models.ControlModel.extend({
  initialize: function() {
    this._super();
    this.set("isEnabled", true);
  }
});
var v = Speak.Definitions.Views;

v.ComponentView = v.View.extend({
  listen: _.extend({}, Speak.Definitions.Views.View.prototype.listen, {
    "set:$this": "set"
  }),
  initialize: function () {
    if (!this.model) {
      throw "Model required in order to instantiate ComponentView";
    }
    if (!this.el) {
      throw "Element required in order to instantiate ComponentView";
    }
    var init = this.$el.data("init");
    if(init) {
      var keys = _.keys(init);
      _.each(keys, function(key) {
          this.set(key, init[key]);
      }, this.model);
    }
  },
  //PDE: really do not like this
  //JC: kinda like it :-)
  set: function(args) {
    if (!args) { return; }
    
    _.each(_.keys(args), function (attributeName) {
      this.model.set(attributeName, args[attributeName]);
    }, this);
  }
});

v.ControlView = v.ComponentView.extend({
  listen: _.extend({}, Speak.Definitions.Views.ComponentView.prototype.listen, {
    "toggle:$this": "toggle",
    "focus:$this": "focus",
    "show:$this": "show",
    "hide:$this": "hide"
  }),
  initialize: function () {
    this._super();
    this.model.set("isVisible", (this.$el.css("display") !== "none"));
  },
  focus: function () {
    this.$el.focus();
  },
  hide: function () {
    this.model.set("isVisible", false);
  },
  show: function() {
    this.model.set("isVisible", true);
  },
  toggle: function () {
    this.model.toggle();
  }                       
});

v.BlockView = v.ControlView.extend({
  initialize: function() {
    this._super();
    this.model.set("width", this.$el.width());
    this.model.set("height", this.$el.height());
  }
});

v.InputView = v.ControlView.extend({
  listen: _.extend({}, Speak.Definitions.Views.ComponentView.prototype.listen, {
    "enable:$this": "enable",
    "disable:$this": "disable"
  }),  
  initialize: function () {
    this._super();
    this.model.set("isEnabled", $(this.el).attr("disabled") != "disabled");
  },
  disable: function () {
    this.model.set("isEnabled", false);
  },
  enable: function () {
    this.model.set("isEnabled", true);
  }
});

v.ButtonBaseView = v.ControlView.extend({
  listen: _.extend({}, Speak.Definitions.Views.ControlView.prototype.listen, {
    "enable:$this": "enable",
    "disable:$this": "disable"
  }),
  initialize: function () {
    this._super();
    this.model.set("isEnabled", $(this.el).attr("disabled") != "disabled");
  },
  click: function() {
    if(this.model.get("isEnabled")) {
        var invocation = this.$el.attr("data-sc-click");
        if (invocation) {
          Speak.Helpers.invocation.execute(invocation, { control: this, app: this.app });
        }
        if (this.model._events && this.model._events["click"]) {
          _.each(this.model._events["click"], function (clickHandler) {
            if (clickHandler["callback"] && clickHandler["context"]) {
              clickHandler["callback"].call(clickHandler["context"]);
            }
          });
        }
    }
  },
  disable: function () {
    this.model.set("isEnabled", false);
  },
  enable: function () {
    this.model.set("isEnabled", true);
  }
});

_sc.Definitions.Collections = _sc.Definitions.Collections || [];

fctry.createComponent("ComponentBase", models.ComponentModel, views.ComponentView, ".sc-componentbase");
fctry.createComponent("ControlBase", models.ControlModel, views.ControlView, ".sc-controlbase");
fctry.createComponent("BlockBase", models.BlockModel, views.BlockView, ".sc-blockbase");
fctry.createComponent("ButtonBase", models.ButtonBaseModel, views.ButtonBaseView, ".sc-buttonBase");
fctry.createComponent("InputBase", models.InputModel, views.InputView, ".sc-inputbase");
fctry.createComponent("PageBase", models.Model, views.View, "body");
fctry.createBindingConverter({
  name: "Has",
  convert: function(array) {
    if(array && array[0]) {
      if(_.isArray(array[0])) {
        if(array[0].length === 0) {
          return false;
        }
        return true;
      }
      return true;
    }
    return false;  
    
  }
});
fctry.createBindingConverter({
  name: "Not",
  convert: function(array) {
    return !(array && array[0]);
  }
});
var urlHelper = {
  combine: function () {
    if (arguments.length === 0) {
      return "";
    }

    var result = _.reduce(arguments, function (memo, part) {
      if (part && _.isString(part)) {
        return memo + "/" + _.compact(part.split("/")).join("/");
      }
      return memo;
    });

    if (!result) {
      return "";
    }

    if (result.indexOf("/") === 0) {
      return result;
    }

    return "/" + result;
  },
  isParameterNameAlreadyInUrl: function (uri, parameterName) {
    return uri.indexOf("?" + parameterName + "=") >= 0 || uri.indexOf("&" + parameterName + "=") >= 0;
  },
  addQueryParameters: function (url, parameterObject) {
    var pairs = _.pairs(parameterObject),
      matchEncodedParamNamePattern = "([\\?&])({{param}}=[^&]+)",
      regexMatchEncodedParam,
      result = url;

    _.each(pairs, function (pair) {
      if (urlHelper.isParameterNameAlreadyInUrl(result, pair[0])) {
        regexMatchEncodedParam = new RegExp(matchEncodedParamNamePattern.replace("{{param}}", encodeURIComponent(pair[0])), "i");
        result = result.replace(regexMatchEncodedParam, "$1" + pair[0] + "=" + pair[1]);
      } else {
        result = ~result.indexOf("?") ? result += "&" : result += "?";
        result += encodeURIComponent(pair[0]) + "=" + encodeURIComponent(pair[1]);
      }
    });

    return result;
  },

  // see solution and benchmark here: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values/901144#901144 
  getQueryParameters: function (url) {
    var result = {},
      parts;

    if (!_.isString(url)) {
      return result;
    }

    parts = url.split("?");

    if (parts.length > 1) { //it is a full url
      parts = parts[1].split("&");
    } else { //it is not
      parts = parts[0].split("&");
    }

    if (!parts) {
      return undefined;
    }
    _.each(parts, function (part) {
      var p = part.split("=");
      if (p.length === 2) {
        result[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
      }
    });
    //some comment
    return result;
  }
};

var dateHelper = {
  parseISO: function (time) {
    var year,
      month,
      day,
      hours,
      minutes,
      seconds;

    if (!_.isString(time)) {
      return null;
    }

    year = parseInt(time.substr(0, 4), 10);
    // month should start from 0 !!!
    // minus one in order to have the right month
    month = parseInt(time.substr(4, 2), 10) - 1;
    day = parseInt(time.substr(6, 2), 10);

    if (time.indexOf("T") !== 8) {
      return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
    }

    hours = parseInt(time.substr(9, 2), 10);
    minutes = parseInt(time.substr(11, 2), 10);
    seconds = parseInt(time.substr(13, 2), 10);

    return new Date(Date.UTC(year, month, day, hours, minutes, seconds));
  },
  toISO: function (date) {
    var result;

    if (!_.isDate(date)) {
      return result;
    }

    result = "";
    result += date.getUTCFullYear();
    // month starts form 0
    result += this.ensureTwoDigits(date.getUTCMonth() + 1);
    result += this.ensureTwoDigits(date.getUTCDate());
    result += "T";
    result += this.ensureTwoDigits(date.getUTCHours());
    result += this.ensureTwoDigits(date.getUTCMinutes());
    result += this.ensureTwoDigits(date.getUTCSeconds());

    return result;
  },
  isISO: function (date) {
    var dateValue,
      dateIsString = _.isString(date);

    // Removes the ticks
    if (dateIsString && date.charAt(15) === ":") {
      date = date.substr(0, 15);
    }

    if (!(dateIsString && (date.length == 8 || date.length == 15))) {
      return false;
    }

    dateValue = this.parseISO(date);
    
    if (Object.prototype.toString.call(dateValue) === "[object Date]") {
      // it is a date
      if (isNaN(dateValue.getYear())) {  // d.valueOf() could also work
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  },
  ensureTwoDigits: function (number) {
    return (number < 10) ? "0" + number.toString() : number.toString();
  }
};

var idHelper = {
  isId: function (value) {
    if (!_.isString(value)) {
      return false;
    }

    return (/^\{?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\}?$/i).test(value);
  },
  toId: function (shortId) {
    if (!shortId || shortId.length !== 32) {
      return shortId;
    }
    return "{" + shortId.substr(0, 8) + "-" + shortId.substr(8, 4) + "-" + shortId.substr(12, 4) + "-" + shortId.substr(16, 4) + "-" + shortId.substr(20, 12) + "}";
  },
  toShortId: function (arg) {
    if (!_.isString(arg) || !idHelper.isId(arg)) {
      return undefined;
    }

    return arg.replace(/-|\{|\}/g, "");
  }
};

var stringHelper = {
  endsWith: function (str, value) {
    if (!value || !str) {
      return false;
    }
    return str.lastIndexOf(value) === (str.length - value.length);
  },
  equals: function (lhs, rhs, caseSensitive) {
    if (!_.isString(lhs) || !_.isString(rhs)) {
      return undefined;
    }
    if (caseSensitive) {
      if (!_.isBoolean(caseSensitive)) {
        return undefined;
      }
      return lhs === rhs;
    }
    return lhs.toLowerCase() === rhs.toLowerCase();
  },
  format: function (str) {
    if (!str) {
      return str;
    }
    _.each(arguments, function (arg, i) {
      str = str.replace(new RegExp("\\{" + (i - 1) + "\\}", "gi"), arg);
    });

    return str;
  },
  formatByTemplate: function (template, getValueByParamName) {
    /* params description
      * template - string with attribute name surrounded with curly brackets, e.g <span>{{itemName}}</span>
      * getValueByParamName - function which should return value by fieldname
    */
    if (typeof getValueByParamName != "function") {
      return template;
    }
    if (typeof template != "string") {
      return "";
    }
    var patt = /{{(.*?)}}/gi;
    var result = template.match(patt);
    _.each(result, function (param) {
      var fieldname = param.replace("{{", "").replace("}}", "");
      var paramV = getValueByParamName(fieldname);
      if (typeof paramV != "undefined" && paramV != null) {
        template = template.replace(param, paramV);
      }
    });
    return template;
  }
};

var objectHelper = {
  getOwnProperties: function (obj) {
    var result = [],
      proprety;

    for (proprety in obj) {
      if (obj.hasOwnProperty(proprety)) {
        result.push(proprety);
      }
    }
    return result;
  }
};

var invocationHelper = {
  execute: function (invocation, options) {
    if (!invocation) {
      return;
    }

    var i = invocation.indexOf(":");
    if (i <= 0) {
      throw "Invocation is malformed (missing 'handler:')";
    }

    options = options || {};
    var handler = invocation.substr(0, i);
    var target = invocation.substr(i + 1);

    var context = _.extend({}, {
      handler: handler,
      target: target
    }, options);

    _sc.Pipelines.Invoke.execute(context);
  }
};

var overlayHelper = {
  /*
  Example:
  {
    "overlays" : [
      { "command": "insert", "selector": "component:FilterButton", "placement": "after", "html": "<div>Hello World!</div>" }
    ]
  }
  */
  loadOverlays: function (app) {
    var $overlays = $("script[type='text/x-sitecore-overlays']");
    if ($overlays.length == 0) {
      return;
    }

    var urls = $overlays.data("sc-overlays").split('|');
    var parameters = $overlays.data("sc-parameters");

    for (var index in urls) {
      var url = urls[index] + "?speak=" + _sc.VERSION + "&" + parameters;

      $.ajax({
        url: url,
        dataType: "json"
      }).done(function (data) {
        _sc.Helpers.overlay.processOverlays(app, data, urls[index]);
      }).fail(function (err) {
        console.log("Overlay url failed: " + url, err);
      });
    }
  },

  processOverlays: function (app, data, url) {
    var overlays = data.overlays;
    for (var index in overlays) {
      this.processOverlay(app, overlays[index], url);
    }
  },

  processOverlay: function (app, overlay, url) {
    var command = overlay.command;
    var selector = overlay.selector;
    var placement = overlay.placement;
    var html = overlay.html;

    var $el;
    if (selector.substr(0, 10) == "component:") {
      var controlId = selector.substr(10);
      var control = _.find(app.Controls, function (c) {
        return c.name == controlId;
      });
      if (control == null) {
        console.log("Overlay selector not found: " + selector);
        return;
      }
      $el = control.view.$el;
    } else {
      $el = $(selector);
    }

    if ($el == null || $el.length == 0) {
      console.log("Overlay selector not found: " + selector);
      return;
    }

    switch (command) {
    case "insert":
      this.insert(app, $el, placement, html, url);
      break;
    case "remove":
      this.remove(app, $el);
      break;
    case "replace":
      this.replace(app, $el, html, url);
      break;
    default:
      console.log("Unknow overlay command: " + command);
    }

  },

  insert: function (app, $el, placement, html, url) {
    html = "<div data-sc-app id='" + _.uniqueId("overlay-") + "' >" + html;
    html += "</div>";

    var $html = $($.parseHTML(html));

    switch (placement) {
    case "before":
      $html.insertBefore($el);
      break;
    case "after":
      $html.insertAfter($el);
      break;
    case "prepend":
      $el.prepend(html);
      break;
    case "append":
      $el.append(html);
      break;
    default:
      console.log("Unknow overlay insert placement: " + placement);
    }
    _sc.load(window, $html, function (app) {
      _sc.trigger("overlay-loaded", {
        app: app,
        url: url
      });
    });
  },

  remove: function (app, $el) {
    $el.remove();
  },

  replace: function (app, $el, html, url) {
    html = $.parseHTML(html),
    $html = $(html);

    $el.replaceWith($html);

    _sc.load(window, $html, function (app) {
      _sc.trigger("overlay-loaded", {
        app: app,
        url: url
      });
    });
  }
};

var windowHelper = {
  init: function () {
    $(window).resize(function () {
      _sc.trigger("window:resize", $(window).width(), $(window).height());
    });

    /* $(window).unload(...) not supported */
  },

  loaded: function () {
    _sc.trigger("window:loaded");
  }
};

var antiForgeryTokenValue = $("input[name=__RequestVerificationToken]").val();
var antiForgeryHelper = {
  getAntiForgeryToken: function() {
    return {
      formKey: "__RequestVerificationToken",
      headerKey: "X-RequestVerificationToken",
      value: antiForgeryTokenValue
    };
  }
};

var sessionHelper = {
  unauthorized: function () {
    sessionHelper.logout(function (result) {
      window.top.location.reload(true);
    });
  },
  
  logout: function (callback) {
    var ajaxSettings = {
      url: "/api/sitecore/Authentication/Logout?sc_database=master",
      type: "POST",
      data: {},
      cache: false
    };

    var token = _sc.Helpers.antiForgery.getAntiForgeryToken();
    ajaxSettings.data[token.formKey] = token.value;
    $.ajax(ajaxSettings).complete(callback);
  }
};

_.extend(_sc, {
  Helpers: {
    antiForgery: antiForgeryHelper,
    url: urlHelper,
    date: dateHelper,
    id: idHelper,
    string: stringHelper,
    object: objectHelper,
    invocation: invocationHelper,
    overlay: overlayHelper,
    window: windowHelper,
    session: sessionHelper
  }
});

_sc.Helpers.window.init();
/*
The Convert Part of SPEAK Framework
------------------------------------

What is exposed:
Speak.Converter

*/
var Utils = _sc.Helpers;

var instances = {
  _current: 0, //not used ?
  converters: [],
  aborted: false //not used ?
},
length = function () {
  return instances.converters.length;
},
add = function (converter) {
  converter = converter || {};
     
  if (!_.isFunction(converter.canConvert) ||
      !_.isFunction(converter.convert) ||
      !_.isFunction(converter.reConvert) ||
      !_.isString(converter.name)
  ) {
    throw "invalid converter";
  }
  instances.converters.push(converter);
},
remove = function (name) {
  instances.converters = _.reject(instances.converters, function (pipeline) {
    return pipeline.name === name;
  });
},
get = function (name) {
  return _.find(instances.converters, function (processor) {
    return processor.name === name;
  });
},
getAll = function () {
  return instances.converters;
},
dateConverter = {
  name: "date",
  canConvert: function (field) {
    return Utils.string.equals(field.type, this.name) || Utils.string.equals(field.type, "datetime");
  },
  convert: function (field) {
    var result = "",
    value = field.value;
    if (value) {
      try {
        return Utils.date.parseISO(value).toLocaleDateString();
      } catch (e) {
        return result;
      }
    }
    return result;
  },
  reConvert: function (fieldValue) {
    //TODO Do we want this ?
    if (!fieldValue) { return ""; }

    try {
      var date = new Date(fieldValue);
      return Utils.date.toISO(date);
    } catch (e) {
      return fieldValue || "";
    }
  },
  toStringWithFormat: function (value, format) {
    if (Utils.date.isISO(value)) {
      try {
        var date = Utils.date.parseISO(value);
        var formats = {
          mmss: {
            expression: "(\\W|^)mm(\\W+s{1,2}\\W|\\W+s{1,2}$)",
            value: Utils.date.ensureTwoDigits(date.getUTCMinutes())
          },
          mss: {
            expression: "(\\W|^)m(\\W+s{1,2}\\W|\\W+s{1,2}$)",
            value: date.getUTCMinutes().toString(),
          },
          hmm: {
            expression: "(\\Wh{1,2}\\W+|^h{1,2}\\W+)mm(\\W|$)",
            value: Utils.date.ensureTwoDigits(date.getUTCMinutes()),
          },
          hm: {
            expression: "(\\Wh{1,2}\\W+|^h{1,2}\\W+)m(\\W|$)",
            value: date.getUTCMinutes().toString(),
          },
          ms: {
            expression: "(\\Wss\\W|^ss\\W)00(\\W|$)",
            value: Utils.date.ensureTwoDigits(date.getUTCMilliseconds()),
          },
          ampm: {
            expression: "(\\W|^)AM/PM(\\W|$)",
            value: ((date.getUTCHours() >= 12) ? "PM" : "AM"),
          },
          ap: {
            expression: "(\\W|^)A/P(\\W|$)",
            value: ((date.getUTCHours() >= 12) ? "P" : "A"),
          },
          yyyy: {
            expression: "(\\W|^)yyyy(\\W|$)",
            value: date.getUTCFullYear().toString(),
          },
          yy: {
            expression: "(\\W|^)yy(\\W|$)",
            value: Utils.date.ensureTwoDigits(date.getUTCFullYear() % 100),
          },
          mm: {
            expression: "(\\W|^)mm(\\W|$)",
            value: Utils.date.ensureTwoDigits(date.getUTCMonth() + 1),
          },
          m: {
            expression: "(\\W|^)m(\\W|$)",
            value: (date.getUTCMonth()+1).toString(),
          },
          dd: {
            expression: "(\\W|^)dd(\\W|$)",
            value: Utils.date.ensureTwoDigits(date.getUTCDate()),
          },
          d: {
            expression: "(\\W|^)d(\\W|$)",
            value: date.getUTCDate().toString(),
          },
          hh: {
            expression: "(\\W|^)hh(\\W|$)",
            value: Utils.date.ensureTwoDigits(date.getUTCHours()),
          },
          h: {
            expression: "(\\W|^)h(\\W|$)",
            value: (date.getUTCHours() > 12) ? (date.getUTCHours() - 12).toString() : ((date.getUTCHours() == 0) ? 12 : date.getUTCHours()).toString(),
          },
          ss: {
            expression: "(\\W|^)ss(\\W|$)",
            value: Utils.date.ensureTwoDigits(date.getUTCSeconds()),
          },
          s: {
            expression: "(\\W|^)s(\\W|$)",
            value: date.getUTCSeconds().toString()
          }
        };
        
        for (var step in formats) {
          var find = (formats[step]) ? formats[step].expression : "";
          var replace = "$1" + formats[step].value + "$2";
          if (find != "") {
            var expression = new RegExp(find, 'g');
            format = format.replace(expression, replace);
          }
        }
        return format;
      } catch (e) {
        return value;
      }      
    }
    return value;
  }
},
iconConverter = {
  name: "Icon",
  baseUrl: Utils.url.combine(_sc.SiteInfo.virtualFolder, "~/icon/"),
  canConvert: function (field, fields, item) {
    return Utils.string.equals(field.type, this.name);
  },
  convert: function (field) {
    if (this.canConvert(field)) {
      var value = field.value || "/sitecore/images/blank.gif"; /*really ?*/
      if (value.indexOf("/sitecore/") !== 0) {
        value = Utils.url.combine(this.baseUrl, value);
      }

      return Utils.string.format("<img src=\"{0}\" alt=\"\" />", value); /*really ?*/
    }
  },
  reConvert: function (field) {
    //no need to reConvert
  }
},
converters = {
  length: length,
  add: add,
  remove: remove,
  get: get,
  getAll: getAll
};

converters.add(dateConverter);
converters.add(iconConverter);

_.extend(_sc, { Converters: converters });
/*
The Pipeline Part of SPEAK Framework
------------------------------------

What is exposed:222222
Speak.Pipelines
- run(options)
- add
- remove
- length
*/

var ppl = Speak.Pipelines = function () {
  var pipelines = [];

  return {
    add: function (pipeline) {
      if (!pipeline || !pipeline.name || !_.isObject(pipeline)) {
        throw new "invalid pipeline";
      }

      pipelines.push(pipeline);
      this[pipeline.name] = pipeline;
    },
    remove: function (pipelineName) {
      pipelines = _.reject(pipelines, function (p) {
        return p.name === pipelineName;
      });

      delete Speak.Pipelines[pipelineName];
    },
    length: function () {
      return pipelines.length;
    }
  };
}();

ppl.Pipeline = function (name) {
  var result = {
    name: name,

    processors: [],

    add: function (processor) {
      if (!processor || !processor.priority || !processor.execute || !_.isNumber(processor.priority) || !_.isFunction(processor.execute)) {
        throw "not valid step";
      }

      this.processors.push(processor);
    },
    length: function () {
      return this.processors.length;
    },
    remove: function (processor) {
      this.processors = _.reject(this.processors, function (p) {
        return p === processor;
      });
    },
    execute: function (context) {
      //TODO: sort on adding processors
      var list = _.sortBy(this.processors, function (processor) {
        return processor.priority;
      });

      _.each(list, function (processor) {
        if (context.aborted) {
          return false;
        }
        processor.execute(context);
      });
    }
  };

  return result;
};

var executeContext = function (target, context) {
  //First we check if you want to existing something in the app.
  var targets = target.split(".");
  var firstPath = targets[0];
  if (firstPath === "this") {
    new Function(target).call(context.control.model);
  } else if (context.app && firstPath === "app") {
    var ex = target.replace("app", "this");
    new Function(ex).call(context.app);
  } else {
    /*!!! dangerous zone !!!*/
    new Function(target)();
  }
}

var handleJavaScript = {
  priority: 1000,
  execute: function (context) {
    if (context.handler === "javascript") {
      if (context.target.indexOf(";") > 0) {
        _.each(context.target.split(";"), function (tar) {
          executeContext(tar, context);
        });
      } else {
        executeContext(context.target, context);
      }
    }
  }
};

var handleCommand = {
  priority: 2000,
  execute: function (context) {
    if (context.handler === "command") {
      Speak.Commands.executeCommand(context.target);
    }
  }
};

var serverClick = {
  priority: 3000,
  execute: function (context) {
    if (context.handler !== "serverclick") {
      return;
    }

    //TODO: maybe we should validate
    var options = {
      url: context.target,
      type: "POST",
      dataType: "json",
      data: {}
    };

    var token = Speak.Helpers.antiForgery.getAntiForgeryToken();
    options.data[token.formKey] = token.value;

    var completed = function (result) {
      //TODO: validate result
      Speak.Pipelines.ServerInvoke.execute({
        data: result,
        model: context.model
      });
    };

    $.ajax(options).done(completed);
  }
};

var triggerEvent = {
  priority: 4000,
  execute: function (context) {
    if (context.handler !== "trigger") {
      return;
    }

    var app = context.app;
    if (!app) {
      throw "An application is a required when triggering events";
    }

    var target = context.target;
    var args = {};

    var n = target.indexOf("(");
    if (n >= 0) {
      if (target.indexOf(")", target.length - 1) == -1) {
        throw "Missing ')'";
      }
      var parameters = target.substr(n + 1, target.length - n - 2);
      args = $.parseJSON(parameters);
      target = target.substr(0, n);
    }

    args.sender = context.control;

    app.trigger(target, args);
  }
};

var ivk = new Speak.Pipelines.Pipeline("Invoke");

ivk.add(handleJavaScript);
ivk.add(handleCommand);
ivk.add(serverClick);
ivk.add(triggerEvent);

Speak.Pipelines.add(ivk);

var srvppl = new Speak.Pipelines.Pipeline("ServerInvoke");

Speak.Pipelines.add(srvppl);
var appPpl = new ppl.Pipeline("Application");

/**
 * Initialized all the components
 */

var hasPublicFunctions = function (defaults) {
  if (!defaults) {
    return false;
  }
  return (_.keys(defaults).length > 0);
};

var exposedCollection = function (collection, defaults) {
  /*current exposed nothing*/
  return {};
};

var exposedModel = function (model, defaults) {
  var obj = {};
  if (hasPublicFunctions(defaults)) {
    var keys = _.keys(defaults);

    _.each(keys, function (funcName) {
      if (model.attributes[funcName] !== undefined) {
        obj[funcName] = function () {
          if (arguments.length) {
            model.set(funcName, arguments[0]);
            return arguments[0];
          }
          else {
            return model.get(funcName);
          }
        };
      }
      else {
        obj[funcName] = function (args) {
          model[funcName].call(model, args);
        };
      }
    });
  }
  return obj;
};

var exposedView = function (view, defaults) {
  var obj = {};
  if (hasPublicFunctions(defaults)) {
    var keys = _.keys(defaults);

    _.each(keys, function (funcName) {
      obj[funcName] = function (args) {
        view[funcName].call(view, args);
      };
    });
  }

  return obj;
};

var exposedComponent = function (component, componentEl, appName, hasExclude, hasNested, selector, app, context, verifyNestedApp) {
  var $component = $(componentEl),
    uniqueId,
    controlName,
    model,
    collection,
    view;

  if (verifyNestedApp) {
    var $subApps = $component.find("[data-sc-app]");
    if ($subApps.length > 0) {
      $.each($subApps, function () {
        $(this).addClass("data-sc-waiting")
      });
    }
  }
  //if it has data on sc-app, it means the component has been already register
  if (!$component.data("sc-app")) {

    uniqueId = _.uniqueId('sc_' + component.type + '_');
    controlName = $component.attr("data-sc-id");
    if (app.appId) {
      controlName = app.appId + ":" + controlName;
    }

    var newClass = _.filter($component.prop("class").split(" "), function (className) {
      return (className.indexOf('sc_') === -1);
    });

    $component.prop("class", newClass.join(" "));
    $component.addClass(uniqueId); //add a uniqueID enforce this !

    if (hasExclude) {
      if ($("[data-sc-exclude] " + "." + uniqueId).length) {
        return {}; //return empty object
      }
    }
    if (hasNested) {
      if ($component.closest("[data-sc-app]").attr("id") && "#" + $component.closest("[data-sc-app]").attr("id") != selector) {
        return {};
      }
    }

    model = new component.model({ type: uniqueId, name: controlName });
    model.componentName = component.type;
    $component.data("sc-app", appName); //prefer to not relying on DOM

    $component.addClass("data-sc-registered");

    if (component.collection) {
      collection = new component.collection();
    }

    /*adding Behaviors*/
    var behaviors = $component.data("sc-behaviors");

    view = new component.view({ el: "." + uniqueId, model: model, collection: collection, app: app, behaviors: behaviors });


    _.each(view.$el.find("[data-bind]"), function (el) {
      var $el = $(el);
      if ($el.closest(".data-sc-waiting").length == 0) {
        $el.addClass("data-sc-registered");
      }
    }, this);

    /*Also registered comment binding*/
    view.$el.find("*").contents().each(function () {
      try {
        this.registered = (this.nodeType === 8) ? true : false; //Node.COMMENT_NODE 
      } catch (e) {

      }
    });
    /*if(! component.model.prototype.defaults) { component.model.prototype.defaults = {}; }
    if(! component.view.prototype.defaults) { component.view.prototype.defaults = {}; }
    
    if(_.intersection(_.keys(component.model.prototype.defaults), _.keys(component.view.prototype.defaults)).length > 0) {
        $component.data("sc-app", null); //deregister the component before breaking
        throw "Your view and your model from component:" + controlName + ", are exposing property under the same name";
    }*/

    app[controlName] = model; /*;*/

    //_.extend(app[controlName], exposedModel(model, component.model.prototype.defaults));
    //_.extend(app[controlName], exposedView(view, component.view.prototype.defaults));

    if (collection) {
      _.extend(app[controlName], exposedCollection(collection, component.collection.prototype.defaults));
    }
    context.Controls.push({ name: controlName, model: model, view: view, collection: collection });

    if (verifyNestedApp) {
      var $deferedKO = $component.find(".data-sc-waiting");
      $deferedKO.each(function () {
        $(this).removeClass("data-sc-waiting");
      });
    }
  }

  return app;
};

var getScope = function (name, id) {

  if (!name) {
    id = "body";
    name = "app";
  }

  if (!id) {
    id = name;
  }

  if (id !== "body" && id.indexOf("#") < 0) {
    id = "#" + id;
  }

  return {
    name: name,
    el: id,
    $el: $(id)
  };
};

var RegisterTree = function ($element, register) {
  if ($element.find("[data-sc-hasnested]").length === 0) {
    register($element);
  } else {
    _.each($element.find("[data-sc-hasnested]"), function (child) {
      RegisterTree($(child), register);
    });
    register($element);
  }
};

var initialization = {
  priority: 1000,
  //run: function(name, id, mainApp, app)
  execute: function (context) {
    context = context || {};
    var name = context.name
      , id = context.id
      , mainApp = context.mainApp
      , app = context.app
      , scoped = getScope(name, id)
      , excludeDom = $(scoped.$el).find("[data-sc-exclude]")
      , hasExclude = excludeDom.length || false
      , hasNested = $(scoped.$el).find("[data-sc-app]").length || false
      , hasNestedComponents = [];

    app = app || new Speak.Definitions.App(); //empty app

    app.Controls = context.Controls = [];

    if (!mainApp) { mainApp = Speak; }
    //throw if app already in the page
    if (mainApp[scoped.name]) { throw "already an app with this name"; }

    app.ScopedEl = scoped.$el;
    app.name = scoped.name;
    //forEach component in Speak, we look for a corresping EL

    if (_sc.Components && _sc.Components.length > 0) {
      _.each(_sc.Components, function (component) {
        // we are just looking for component which are not registered
        $(scoped.$el).find(component.el + ":not(.data-sc-registered)").each(function () {
          //create a Control Object and add it to the App
          if (!$(this).data("sc-hasnested")) {
            exposedComponent(component, this, scoped.name, hasExclude, hasNested, scoped.$el.selector, app, context);
          } else {
            //defering until not nested are done
            hasNestedComponents.push(component);
          }
        });
      });
    }

    if (hasNestedComponents.length > 0) {
      _.each(hasNestedComponents, function (component) {
        $(scoped.$el).find(component.el + ":not(.data-sc-registered)").each(function () {
          /*sub nested*/

          var element = $(this);
          RegisterTree(element, function ($elem) {
            var appropriateComp = _.find(hasNestedComponents, function (comp) {
              return $elem.is(comp.el);
            });
            exposedComponent(appropriateComp, $elem.get(0), scoped.name, hasExclude, hasNested, scoped.$el.selector, app, context, true);
          });

        });
      });
    }

    /*it is time to register events*/
    _.each(context.Controls, function (ctrl) {
      if (ctrl.view.listen) {
        var eventList = _.keys(ctrl.view.listen);
        _.each(eventList, function (eventName) {
          var e = eventName;
          if (e.indexOf(":$this") >= 0) {
            var ctrlId = ctrl.view.$el.attr("data-sc-id");
            if (ctrlId) {
              e = e.replace("$this", ctrlId);
            } else {
              //console.log("Control has no 'data-sc-id' attribute - event '" + eventName + "' is not bound");
              return;
            }
          }
          app.on(e, ctrl.view[ctrl.view.listen[eventName]], ctrl.view);
        });
      }
    });

    //not exposed to Speak anymore
    if (mainApp === Speak) {
      if (__SPEAKDEBUG) {
        mainApp[scoped.name] = app;
      } else {
        mainApp[scoped.name] = "application";
      }
    } else {
      mainApp[scoped.name] = app;
      mainApp["nested"] = mainApp["nested"] || [];
      mainApp["nested"].push(app);
    }

    scoped.$el.find("[data-sc-app]").each(function () {
      var $app = $(this),
          id = $app.attr("data-sc-app"),
          $pageCode = $app.find("script[type='text/x-sitecore-pagecode']");

      //require
      var dep;

      if ($pageCode) {
        dep = $pageCode.attr("data-sc-require");
      }

      if (dep) {
        require(dep.split(','), function (subapp) {
          var instance = new subapp();
          instance.run(id, id, app);
        });
      } else {
        _sc.Factories.createApp({
          name: id,
          id: id,
          mainApp: app,
          aborted: false
        });
      }
    });

    context.current = app;
  }
};

var getConverter = function (converterName) {
  var converter = _sc.BindingConverters[converterName];
  if (!converter) {
    return undefined;
  } else {
    return converter;
  }
}

var getValue = function (bindingForOneProperty) {
  if (bindingForOneProperty.converter) {
    var parameters = [];

    _.each(bindingForOneProperty.from, function (setup) {
      parameters.push(setup.model.get(setup.attribute));
    });
    return bindingForOneProperty.converter(parameters);
  } else {
    var singleModel = bindingForOneProperty.from[0].model,
        value = bindingForOneProperty.from[0].attribute;

    return singleModel.get(value);
  }
}

var createBinding = function (bindingForOneProperty) {
  _.each(bindingForOneProperty.from, function (f) {
    f.model.on("change:" + f.attribute, function () {
      bindingForOneProperty.model.set(bindingForOneProperty.to, getValue(bindingForOneProperty));
    });
  });

  bindingForOneProperty.model.set(bindingForOneProperty.to, getValue(bindingForOneProperty));
};

var getUniformAttribute = function (model, attribute) {
  var keys = _.keys(model.attributes);
  var hasAttribute = _.find(keys, function (key) { return key === attribute; });
  if (!hasAttribute) {
    return (attribute.charAt(0).toLowerCase() + attribute.slice(1));
  } else {
    return attribute;
  }
};


var getUniformModel = function (app, model) {
  var keys = _.keys(app);
  var hasModel = _.find(keys, function (key) { return key === model; });
  if (!hasModel) {
    return app[(model.charAt(0).toUpperCase() + model.slice(1))];
  } else {
    return app[model];
  }
};


var applyBinding = function ($el, app, scId) {
  var namespace = scId,
      conf = $el.attr("data-sc-bindings"),
      bindingConfigurationList = [],
      leftModel = app[namespace];
  //backward compatibily
  if (conf.indexOf("{") != 0) {
    //try to make the old bindings work with new one
    var compatibleBindings = [];

    _.each(conf.split(","), function (singleBinding) {
      var compatibleBinding = [];

      _.each(singleBinding.split(":"), function (part) {
        compatibleBinding.push('"' + part + '"');
      });

      compatibleBindings.push(compatibleBinding.join(":"));
    });
    conf = "{" + compatibleBindings.join(",") + "}";
  }

  try {
    var json = JSON.parse(conf);
    _.each(_.keys(json), function (key) {

      var bindingConfiguration = { from: [], to: key, converter: undefined, model: leftModel },
          config = json[key],
          modelPath,
          model,
          attribute;

      bindingConfiguration.to = getUniformAttribute(leftModel, key);

      if (!_.isObject(config)) {
        //classic binding Items:SearchDatasource.Items
        model = app[config.split(".")[0]];
        attribute = getUniformAttribute(model, config.split(".")[1]);

        /*if(!model.attributes[attribute]) {a
          
        }*/
        bindingConfiguration.from.push({ model: model, attribute: attribute });
      } else {
        bindingConfiguration.converter = getConverter(config.converter);

        _.each(config.parameters, function (value) {
          model = getUniformModel(app, value.split(".")[0]);

          attribute = getUniformAttribute(model, value.split(".")[1]);

          bindingConfiguration.from.push({ model: model, attribute: attribute });
        });
      }
      bindingConfigurationList.push(bindingConfiguration);
    });

    _.each(bindingConfigurationList, createBinding);
  }
  catch (ex) {
    //alert("Failed to data-bind: " + scId + "." + left + " => " + right + "\n" + ex);
    throw "Failed to data-bind: " + scId + "\n" + ex;
  }

};

var applyingCrossBinding = {
  priority: 1500,
  execute: function (context) {
    if (context.current.Controls.length === 0) {
      return;
    }

    _.each(context.current.Controls, function (control) {
      if (control.view.$el.attr("data-sc-bindings")) {
        applyBinding(control.view.$el, context.current, control.view.$el.attr("data-sc-id"));
      }
    });
  }
};

var beforeRenderTime = {
  priority: 2000,
  //run: function(name, id, mainApp, app)
  execute: function (context) {
    _.each(context.Controls, function (control) {
      //if control has a render method
      if (control.view.beforeRender) {
        //we execute it
        control.view.beforeRender();
      }
    });
  }
};
/**
 * Render Methods
 */
var renderingTime = {
  priority: 3000,
  //run: function(name, id, mainApp, app)
  execute: function (context) {
    _.each(context.Controls, function (control) {
      //if control has a render method
      if (control.view.render) {
        //we execute it
        control.view.render();
      }
    });
  }
};

var afterRenderTime = {
  priority: 4000,
  //run: function(name, id, mainApp, app)
  execute: function (context) {
    _.each(context.Controls, function (control) {
      //if control has a render method
      if (control.view.afterRender) {
        //we execute it
        control.view.afterRender();
      }
    });
  }
};

appPpl.add(initialization);
appPpl.add(applyingCrossBinding);
appPpl.add(beforeRenderTime);
appPpl.add(renderingTime);
appPpl.add(afterRenderTime);

Speak.Pipelines.add(appPpl);
_.extend(_sc.Web, {
    itemWebApi: {
      takeValidScope: function(elem) {
        switch (elem) {
          case "self":
            return "s";
          case "children":
            return "c";
          case "parent":
            return "p";
          default:
            throw "Unsupported scope. It must be either 'self', 'children' or 'parent'";
        }
      },
      addScope: function(url, scope) {
        if (scope && _.isArray(scope)) {
          var result = _.compact(_.map(scope, _sc.Web.itemWebApi.takeValidScope)).join("|");

          url = _sc.Helpers.url.addQueryParameters(url, { scope: result });
        }

        return url;
      },
      addDatabase: function(url, database) {
        if (database && _.isString(database)) {
          url = _sc.Helpers.url.addQueryParameters(url, { sc_database: database });
        }

        return url;
      },
      addContentDatabase: function (url, database) {
        if (database && _.isString(database)) {
          url = _sc.Helpers.url.addQueryParameters(url, { sc_content: database });
        }

        return url;
      },
      addItemSelectorUrlPortion: function(url, itemSelector, options) {
        if (itemSelector && _.isString(itemSelector)) {
          if (options && options.facetsRootItemId) {
            url = _sc.Helpers.url.addQueryParameters(url, { facetsRootItemId: options.facetsRootItemId });
          }

          if (itemSelector.indexOf("search:") === 0) {
            url = _sc.Helpers.url.addQueryParameters(url, { search: itemSelector.substr("search:".length) });

            if (options && options.root && Speak.Helpers.id.isId(options.root)) {
              url = _sc.Helpers.url.addQueryParameters(url, { root: options.root });
            }

            if (options && options.searchConfig) {
              url = _sc.Helpers.url.addQueryParameters(url, { searchConfig: options.searchConfig });
            }
          } else if (itemSelector.indexOf("query:") === 0) {
            url = _sc.Helpers.url.addQueryParameters(url, { query: itemSelector.substr("query:".length) });
          } else if (_sc.Helpers.id.isId(itemSelector)) {
            url = _sc.Helpers.url.addQueryParameters(url, { sc_itemid: itemSelector });
          } else {
            url = _sc.Helpers.url.combine(url, itemSelector);
          }
        }
        return url;
      },
      addLanguage: function(url, language) {
        if (language) {
          url = _sc.Helpers.url.addQueryParameters(url, { language: language });
        }
        return url;
      },
      addItemVersion: function(url, version) {
        if (version) {
          url = _sc.Helpers.url.addQueryParameters(url, { sc_itemversion: version });
        }

        return url;
      },
      getUrl: function(itemSelector, options) {
        options = options || {};

        var webApi = "/-/item/v1";
        var virtualFolder = "";
        
        if (options.webApi) {
          webApi = options.webApi;
        }
        
        if (options.virtualFolder) {
          virtualFolder = options.virtualFolder;
        }

        var url = _sc.Helpers.url.combine(webApi, virtualFolder);
        url = this.addItemSelectorUrlPortion(url, itemSelector, options);

        if (options.scope) {
          url = this.addScope(url, options.scope);
        }

        // for search datasource we should use Content Database
        if (options.database && itemSelector != "" && itemSelector.indexOf("search:") === 0) {
          url = this.addContentDatabase(url, options.database);
        }
        else if (options.database) {
          url = this.addDatabase(url, options.database);
        }

        if (options.language) {
          url = this.addLanguage(url, options.language);
        }

        if (options.version) {
          url = this.addItemVersion(url, options.version);
        }

        if (options.payLoad) {
          url = _sc.Helpers.url.addQueryParameters(url, { payload: "full" });
        }

        if (options.formatting) {
          url = _sc.Helpers.url.addQueryParameters(url, { format: options.formatting });
        }

        if (options.sorting) {
          url = _sc.Helpers.url.addQueryParameters(url, { sorting: options.sorting });
        }
        
        if (options.showHiddenItems) {
          url = _sc.Helpers.url.addQueryParameters(url, { showHiddenItems: options.showHiddenItems });
        }
        
        if (options.fields) {
          url = _sc.Helpers.url.addQueryParameters(url, { fields: options.fields.join("|") });
        }

        if (options.pageSize && options.pageSize > 0) {
          url = _sc.Helpers.url.addQueryParameters(url, { pageIndex: options.pageIndex, pageSize: options.pageSize });
        }

        return url;
      }
    }
});

/*!
 * backbone.layoutmanager.js v0.7.5
 * Copyright 2012, Tim Branyen (@tbranyen)
 * backbone.layoutmanager.js may be freely distributed under the MIT license.
 */
(function(window) {

"use strict";

// Hoisted, referenced at the bottom of the source.  This caches a list of all
// LayoutManager options at definition time.
var keys;

// Localize global dependency references.
var Backbone = window.Backbone;
var _ = window._;
var $ = window.$;

// Maintain references to the two `Backbone.View` functions that are
// overwritten so that they can be proxied.
var _configure = Backbone.View.prototype._configure;
var render = Backbone.View.prototype.render;

// Cache these methods for performance.
var aPush = Array.prototype.push;
var aConcat = Array.prototype.concat;
var aSplice = Array.prototype.splice;

// LayoutManager is a wrapper around a `Backbone.View`.
var LayoutManager = Speak.Definitions.Views.View.extend({
  // This named function allows for significantly easier debugging.
  constructor: function Layout(options) {
    // Options may not always be passed to the constructor, this ensures it is
    // always an object.
    options = options || {};

    // Grant this View superpowers.
    LayoutManager.setupView(this, options);

    // Have Backbone set up the rest of this View.
    Backbone.View.call(this, options);
  },
  nestedlayout: true,

  // Shorthand to `setView` function with the `append` flag set.
  insertView: function(selector, view) {
    // If the `view` argument exists, then a selector was passed in.  This code
    // path will forward the selector on to `setView`.
    if (view) {
      return this.setView(selector, view, true);
    }

    // If no `view` argument is defined, then assume the first argument is the
    // View, somewhat now confusingly named `selector`.
    return this.setView(selector, true);
  },

  // Iterate over an object and ensure every value is wrapped in an array to
  // ensure they will be appended, then pass that object to `setViews`.
  insertViews: function(views) {
    // If an array of views was passed it should be inserted into the
    // root view. Much like calling insertView without a selector
    if (_.isArray(views)) {
      return this.setViews({'': views});
    }

    _.each(views, function(view, selector) {
      views[selector] = _.isArray(view) ? view : [view];
    });

    return this.setViews(views);
  },

  // Returns the View that matches the `getViews` filter function.
  getView: function(fn) {
    return this.getViews(fn).first().value();
  },

  // Provide a filter function to get a flattened array of all the subviews.
  // If the filter function is omitted it will return all subviews.  If a 
  // String is passed instead, it will return the Views for that selector.
  getViews: function(fn) {
    // Generate an array of all top level (no deeply nested) Views flattened.
    var views = _.chain(this.views).map(function(view) {
      return _.isArray(view) ? view : [view];
    }, this).flatten().value();

    // If the filter argument is a String, then return a chained Version of the
    // elements.
    if (typeof fn === "string") {
      return _.chain([this.views[fn]]).flatten();
    }

    // If a filter function is provided, run it on all Views and return a
    // wrapped chain. Otherwise, simply return a wrapped chain of all Views.
    return _.chain(typeof fn === "function" ? _.filter(views, fn) : views);
  },

  // This takes in a partial name and view instance and assigns them to
  // the internal collection of views.  If a view is not a LayoutManager
  // instance, then mix in the LayoutManager prototype.  This ensures
  // all Views can be used successfully.
  //
  // Must definitely wrap any render method passed in or defaults to a
  // typical render function `return layout(this).render()`.
  setView: function(name, view, append) {
    var manager, existing, options;
    // Parent view, the one you are setting a View on.
    var root = this;


    // If no name was passed, use an empty string and shift all arguments.
    if (typeof name !== "string") {
      append = view;
      view = name;
      name = "";
    }

    // If the parent views object doesn't exist... create it.
    this.views = this.views || {};

    // Shorthand the `__manager__` property.
    manager = view.__manager__;

    // Shorthand the View that potentially already exists.
    existing = this.views[name];

    // If the View has not been properly set up, throw an Error message
    // indicating that the View needs `manage: true` set.
    if (!manager) {
      throw new Error("Please set `View#manage` property with selector '" +
        name + "' to `true`.");
    }

    // Assign options.
    options = view._options();

    // Add reference to the parentView.
    manager.parent = root;

    // Add reference to the placement selector used.
    manager.selector = name;

    // Code path is less complex for Views that are not being appended.  Simply
    // remove existing Views and bail out with the assignment.
    if (!append) {
      // If the View we are adding has already been rendered, simply inject it
      // into the parent.
      if (manager.hasRendered) {
        options.partial(root.el, manager.selector, view.el, manager.append); 
      }

      // Ensure remove is called when swapping View's.
      if (existing) {
        // If the views are an array, iterate and remove each individually.
        _.each(aConcat.call([], existing), function(nestedView) {
          nestedView.remove();
        });
      }

      // Assign to main views object and return for chainability.
      return this.views[name] = view;
    }

    // Ensure this.views[name] is an array and push this View to the end.
    this.views[name] = aConcat.call([], existing || [], view);

    // Put the view into `append` mode.
    manager.append = true;

    return view;
  },

  // Allows the setting of multiple views instead of a single view.
  setViews: function(views) {
    // Iterate over all the views and use the View's view method to assign.
    _.each(views, function(view, name) {
      // If the view is an array put all views into insert mode.
      if (_.isArray(view)) {
        return _.each(view, function(view) {
          this.insertView(name, view);
        }, this);
      }

      // Assign each view using the view function.
      this.setView(name, view);
    }, this);

    // Allow for chaining
    return this;
  },

  // By default this should find all nested views and render them into
  // the this.el and call done once all of them have successfully been
  // resolved.
  //
  // This function returns a promise that can be chained to determine
  // once all subviews and main view have been rendered into the view.el.
  render: function() {
    var root = this;
    var options = root._options();
    var manager = root.__manager__;
    var parent = manager.parent;
    var rentManager = parent && parent.__manager__;
    var def = options.deferred();

    // Triggered once the render has succeeded.
    function resolve() {
      var next, afterRender;

      // If there is a parent, attach.
      if (parent) {
        if (!options.contains(parent.el, root.el)) {
          options.partial(parent.el, manager.selector, root.el,
            manager.append);
        }
      }

      // Ensure events are always correctly bound after rendering.
      root.delegateEvents();

      // Set this View as successfully rendered.
      manager.hasRendered = true;

      // Resolve the deferred.
      def.resolveWith(root, [root]);

      // Only process the queue if it exists.
      if (next = manager.queue.shift()) {
        // Ensure that the next render is only called after all other
        // `done` handlers have completed.  This will prevent `render`
        // callbacks from firing out of order.
        next();
      } else {
        // Once the queue is depleted, remove it, the render process has
        // completed.
        delete manager.queue;
      }

      // Reusable function for triggering the afterRender callback and event
      // and setting the hasRendered flag.
      function completeRender() {
        var afterRender = options.afterRender;

        if (afterRender) {
          afterRender.call(root, root);
        }

        // Always emit an afterRender event.
        root.trigger("afterRender", root);
      }

      // If the parent is currently rendering, wait until it has completed
      // until calling the nested View's `afterRender`.
      if (rentManager && rentManager.queue) {
        // Wait until the parent View has finished rendering, which could be
        // asynchronous, and trigger afterRender on this View once it has
        // compeleted.
        afterRender = function() {
          // Wish we had `once` for this...
          parent.off("afterRender", afterRender, this);

          // Trigger the afterRender and set hasRendered.
          completeRender();
        };

        return parent.on("afterRender", afterRender, root);
      }

      // This View and its parent have both rendered.
      completeRender();
    }

    // Actually facilitate a render.
    function actuallyRender() {
      var options = root._options();
      var manager = root.__manager__;
      var parent = manager.parent;
      var rentManager = parent && parent.__manager__;

      // The `_viewRender` method is broken out to abstract away from having
      // too much code in `processRender`.
      root._render(LayoutManager._viewRender, options).done(function() {
        // If there are no children to worry about, complete the render
        // instantly.
        if (!_.keys(root.views).length) {
          return resolve();
        }

        // Create a list of promises to wait on until rendering is done.
        // Since this method will run on all children as well, its sufficient
        // for a full hierarchical. 
        var promises = _.map(root.views, function(view) {
          var append = _.isArray(view);

          // If items are being inserted, they will be in a non-zero length
          // Array.
          if (append && view.length) {
            // Only need to wait for the first View to complete, the rest
            // will be synchronous, by virtue of having the template cached.
            return view[0].render().pipe(function() {
              // Map over all the View's to be inserted and call render on
              // them all.  Once they have all resolved, resolve the other
              // deferred.
              return options.when(_.map(view.slice(1), function(insertView) {
                return insertView.render();
              }));
            });
          }

          // Only return the fetch deferred, resolve the main deferred after
          // the element has been attached to it's parent.
          return !append ? view.render() : view;
        });

        // Once all nested Views have been rendered, resolve this View's
        // deferred.
        options.when(promises).done(function() {
          resolve();
        });
      });
    }

    // Another render is currently happening if there is an existing queue, so
    // push a closure to render later into the queue.
    if (manager.queue) {
      aPush.call(manager.queue, function() {
        actuallyRender();
      });
    } else {
      manager.queue = [];

      // This the first `render`, preceeding the `queue` so render
      // immediately.
      actuallyRender(root, def);
    }

    // Add the View to the deferred so that `view.render().view.el` is
    // possible.
    def.view = root;
    
    // This is the promise that determines if the `render` function has
    // completed or not.
    return def;
  },

  // Ensure the cleanup function is called whenever remove is called.
  remove: function() {
    // Force remove itself from its parent.
    LayoutManager._removeView(this, true);

    // Call the original remove function.
    return this._remove.apply(this, arguments);
  },

  // Merge instance and global options.
  _options: function() {
    return LayoutManager.augment({}, this, LayoutManager.prototype.options, this.options);
  }
},
{
  // Clearable cache.
  _cache: {},

  // Creates a deferred and returns a function to call when finished.
  _makeAsync: function(options, done) {
    var handler = options.deferred();

    // Used to handle asynchronous renders.
    handler.async = function() {
      handler._isAsync = true;

      return done;
    };

    return handler;
  },

  // This gets passed to all _render methods.  The `root` value here is passed
  // from the `manage(this).render()` line in the `_render` function
  _viewRender: function(root, options) {
    var url, contents, fetchAsync;
    var manager = root.__manager__;

    // This function is responsible for pairing the rendered template into
    // the DOM element.
    function applyTemplate(rendered) {
      // Actually put the rendered contents into the element.
      if (rendered) {
        options.html(root.$el, rendered);
      }

      // Resolve only after fetch and render have succeeded.
      fetchAsync.resolveWith(root, [root]);
    }

    // Once the template is successfully fetched, use its contents to proceed.
    // Context argument is first, since it is bound for partial application
    // reasons.
    function done(context, contents) {
      // Store the rendered template someplace so it can be re-assignable.
      var rendered;
      // This allows the `render` method to be asynchronous as well as `fetch`.
      var renderAsync = LayoutManager._makeAsync(options, function(rendered) {
        applyTemplate(rendered);
      });

      // Ensure the cache is up-to-date.
      LayoutManager.cache(url, contents);

      // Render the View into the el property.
      if (contents) {
        rendered = options.render.call(renderAsync, contents, context);
      }

      // If the function was synchronous, continue execution.
      if (!renderAsync._isAsync) {
        applyTemplate(rendered);
      }
    }

    return {
      // This `render` function is what gets called inside of the View render,
      // when `manage(this).render` is called.  Returns a promise that can be
      // used to know when the element has been rendered into its parent.
      render: function() {
        var serialize = root.serialize || options.serialize;
        var data = root.data || options.data;
        var context = serialize || data;
        
        var template = root.template || options.template;
        var controlId = "";

        if(root.parent && root.parent.$el) {
          controlId = root.parent.$el.data("sc-id");
        }

        // If data is a function, immediately call it.
        if (_.isFunction(context)) {
          context = context.call(root);
        }

        // This allows for `var done = this.async()` and then `done(contents)`.
        fetchAsync = LayoutManager._makeAsync(options, function(contents) {
          done(context, contents);
        });

        // Set the url to the prefix + the view's template property.
        if (typeof template === "string") {
          url = options.prefix + template;
        }

        // Check if contents are already cached and if they are, simply process
        // the template with the correct data.
        if (contents = LayoutManager.cache(url + controlId)) {
          done(context, contents, url);

          return fetchAsync;
        }

        // Fetch layout and template contents.
        if (typeof template === "string") {
          contents = options.fetch.call(fetchAsync, options.prefix + template, controlId);
        // If its not a string just pass the object/function/whatever.
        } else if (template != null) {
          contents = options.fetch.call(fetchAsync, template);
        }

        // If the function was synchronous, continue execution.
        if (!fetchAsync._isAsync) {
          done(context, contents);
        }

        return fetchAsync;
      }
    };
  },

  // Remove all nested Views.
  _removeViews: function(root, force) {
    // Shift arguments around.
    if (typeof root === "boolean") {
      force = root;
      root = this;
    }

    // Allow removeView to be called on instances.
    root = root || this;

    // Iterate over all of the nested View's and remove.
    root.getViews().each(function(view) {
      // Force doesn't care about if a View has rendered or not.
      if (view.__manager__.hasRendered || force) {
        LayoutManager._removeView(view, force);
      }
    });
  },

  // Remove a single nested View.
  _removeView: function(view, force) {
    var parentViews;
    // Shorthand the manager for easier access.
    var manager = view.__manager__;
    // Test for keep.
    var keep = typeof view.keep === "boolean" ? view.keep : view.options.keep;

    // Only remove views that do not have `keep` attribute set, unless the
    // View is in `append` mode and the force flag is set.
    if (!keep && (manager.append === true || force)) {
      // Clean out the events.
      LayoutManager.cleanViews(view);

      // Since we are removing this view, force subviews to remove
      view._removeViews(true);  
           
      // Remove the View completely.
      view.$el.remove();

      // Bail out early if no parent exists.
      if (!manager.parent) { return; }

      // Assign (if they exist) the sibling Views to a property.
      parentViews = manager.parent.views[manager.selector];

      // If this is an array of items remove items that are not marked to
      // keep.
      if (_.isArray(parentViews)) {
        // Remove duplicate Views.
        return _.each(_.clone(parentViews), function(view, i) {
          // If the managers match, splice off this View.
          if (view && view.__manager__ === manager) {
            aSplice.call(parentViews, i, 1);
          }
        });
      }

      // Otherwise delete the parent selector.
      delete manager.parent.views[manager.selector];
    }
  },

  // Accept either a single view or an array of views to clean of all DOM
  // events internal model and collection references and all Backbone.Events.
  cleanViews: function(views) {
    // Clear out all existing views.
    _.each(aConcat.call([], views), function(view) {
      // Remove all custom events attached to this View.
      view.unbind();

      // Automatically unbind `model`.
      if (view.model instanceof Backbone.Model) {
        view.model.off(null, null, view);
      }

      // Automatically unbind `collection`.
      if (view.collection instanceof Backbone.Collection) {
        view.collection.off(null, null, view);
      }

      // If a custom cleanup method was provided on the view, call it after
      // the initial cleanup is done
      if (view.cleanup) {
        view.cleanup.call(view);
      }
    });
  },

  // Cache templates into LayoutManager._cache.
  cache: function(path, contents) {
    // If template path is found in the cache, return the contents.
    if (path in this._cache) {
      return this._cache[path];
    // Ensure path and contents aren't undefined.
    } else if (path != null && contents != null) {
      return this._cache[path] = contents;
    }

    // If the template is not in the cache, return undefined.
  },

  // This static method allows for global configuration of LayoutManager.
  configure: function(opts) {
    this.augment(LayoutManager.prototype.options, opts);

    // Allow LayoutManager to manage Backbone.View.prototype.
    if (opts.manage) {
      Backbone.View.prototype.manage = true;
    }
  },
  
  augment: !_.forIn ? _.extend : function(destination) {
    return _.reduce(Array.prototype.slice.call(arguments, 1), function(destination, source) {
      _.forIn(source, function(value, key) { destination[key] = value; });
      return destination;
    }, destination);
  },
  
  // Configure a View to work with the LayoutManager plugin.
  setupView: function(view, options) {
    // If the View has already been setup, no need to do it again.
    if (view.__manager__) {
      return;
    }

    var views, declaredViews, viewOptions;
    var proto = Backbone.LayoutManager.prototype;
    var viewOverrides = _.pick(view, keys);

    // Ensure necessary properties are set.
    _.defaults(view, {
      // Ensure a view always has a views object.
      views: {},

      // Internal state object used to store whether or not a View has been
      // taken over by layout manager and if it has been rendered into the DOM.
      __manager__: {},

      // Add the ability to remove all Views.
      _removeViews: LayoutManager._removeViews,

      // Add the ability to remove itself.
      _removeView: LayoutManager._removeView

    // Mix in all LayoutManager prototype properties as well.
    }, LayoutManager.prototype);

    // Extend the options with the prototype and passed options.
    options = view.options = _.defaults(options || {}, view.options,
      proto.options);

    // Ensure view events are properly copied over.
    viewOptions = _.pick(options, aConcat.call(["events"],
      _.values(options.events || {})));

    // Merge the View options into the View.
    LayoutManager.augment(view, viewOptions);

    // If the View still has the Backbone.View#render method, remove it.  Don't
    // want it accidentally overriding the LM render.
    if (viewOverrides.render === LayoutManager.prototype.render ||
      viewOverrides.render === Backbone.View.prototype.render) {
      delete viewOverrides.render;
    }

    // Pick out the specific properties that can be dynamically added at
    // runtime and ensure they are available on the view object.
    LayoutManager.augment(options, viewOverrides);

    // By default the original Remove function is the Backbone.View one.
    view._remove = Backbone.View.prototype.remove;

    // Always use this render function when using LayoutManager.
    view._render = function(manage, options) {
      // Keep the view consistent between callbacks and deferreds.
      var view = this;
      // Shorthand the manager.
      var manager = view.__manager__;
      // Cache these properties.
      var beforeRender = options.beforeRender;

      // Ensure all nested Views are properly scrubbed if re-rendering.
      if (manager.hasRendered) {
        this._removeViews();
      }

      // If a beforeRender function is defined, call it.
      if (beforeRender) {
        beforeRender.call(this, this);
      }

      // Always emit a beforeRender event.
      this.trigger("beforeRender", this);

      // Render!
      return manage(this, options).render();
    };

    // Ensure the render is always set correctly.
    view.render = LayoutManager.prototype.render;

    // If the user provided their own remove override, use that instead of the
    // default.
    if (view.remove !== proto.remove) {
      view._remove = view.remove;
      view.remove = proto.remove;
    }
    
    // Normalize views to exist on either instance or options, default to
    // options.
    views = options.views || view.views;

    // Set the internal views, only if selectors have been provided.
    if (_.keys(views).length) {
      // Keep original object declared containing Views.
      declaredViews = views;

      // Reset the property to avoid duplication or overwritting.
      view.views = {};

      // Set the declared Views.
      view.setViews(declaredViews);
    }

    // If a template is passed use that instead.
    if (view.options.template) {
      view.options.template = options.template;
    // Ensure the template is mapped over.
    } else if (view.template) {
      options.template = view.template;

      // Remove it from the instance.
      delete view.template;
    }
  }
});

// Convenience assignment to make creating Layout's slightly shorter.
Speak.Definitions.Views.CompositeView = Backbone.Layout = Backbone.LayoutView = Backbone.LayoutManager = LayoutManager;
// Tack on the version.
LayoutManager.VERSION = "0.7.5";

// Override _configure to provide extra functionality that is necessary in
// order for the render function reference to be bound during initialize.
Backbone.View.prototype._configure = function() {
  // Run the original _configure.
  var retVal = _configure.apply(this, arguments);

  // If manage is set, do it!
  if (this.manage) {
    // Set up this View.
    LayoutManager.setupView(this);
  }

  // Act like nothing happened.
  return retVal;
};

// Default configuration options; designed to be overriden.
LayoutManager.prototype.options = {
  // Prefix template/layout paths.
  prefix: "",

  // Can be used to supply a different deferred implementation.
  deferred: function() {
    return $.Deferred();
  },

  // Fetch is passed a path and is expected to return template contents as a
  // function or string.
  fetch: function(path) {
    return _.template($(path).html());
  },

  // This is the most common way you will want to partially apply a view into
  // a layout.
  partial: function(root, name, el, append) {
    // If no selector is specified, assume the parent should be added to.
    var $root = name ? $(root).find(name) : $(root);

    // Use the append method if append argument is true.
    this[append ? "append" : "html"]($root, el);
  },

  // Override this with a custom HTML method, passed a root element and an
  // element to replace the innerHTML with.
  html: function($root, el) {
    $root.html(el);
  },

  // Very similar to HTML except this one will appendChild.
  append: function($root, el) {
    $root.append(el);
  },

  // Return a deferred for when all promises resolve/reject.
  when: function(promises) {
    return $.when.apply(null, promises);
  },

  // By default, render using underscore's templating.
  render: function(template, context) {
    return template(context);
  },

  // A method to determine if a View contains another.
  contains: function(parent, child) {
    return $.contains(parent, child);
  }
};

// Maintain a list of the keys at define time.
keys = _.keys(LayoutManager.prototype.options);

LayoutManager.prototype.options = _.extend(LayoutManager.prototype.options, {
  // function or string.
  fetch: function (path, selector, controlId) {
    var templateEl = "[data-layout-" + path + "]";

    if (selector) {
        templateEl = "[data-layout-" + path + "='" + selector + "']";
    }
    /*PDE: should change this code in order to find the template inside the component*/
    //var template = $(selector).find("[data-layout-"+ path +"]").html();
    var template = $(templateEl).html();
    if(template === undefined) {
      throw "missing template data-layout-" + path + " in order to work";
    }
    return _.template(template);
  }
});

})(this);
data.DatabaseUri = function(databaseName) {
  if (!databaseName) {
    throw "Parameter 'databaseName' is null or empty";
  }

  this.databaseName = databaseName;
  this.webApi = "";
  this.virtualFolder = "/sitecore/shell";
};

_.extend(data.DatabaseUri.prototype, {
  getDatabaseName: function() {
    return this.databaseName;
  }
});


data.ItemUri = function(databaseUri, itemId) {
  if (!databaseUri) {
    throw "Parameter 'databaseUri' is null or empty";
  }

  if (!itemId) {
    throw "Parameter 'itemId' is null or empty";
  }

  this.databaseUri = databaseUri;
  this.itemId = itemId;
};

_.extend(data.ItemUri.prototype, {
  getDatabaseName: function() {
    return this.databaseUri.databaseName;
  },  
  getDatabaseUri: function() {
    return this.databaseUri;
  },
  getItemId: function() {
    return this.itemId;
  }
});

data.ItemVersionUri = function(itemUri, language, version)
{
  if (!itemUri) {
    throw "Parameter 'itemUri' is null";
  }

  if (!language) {
    throw "Parameter 'language' is null or empty";
  }

  if (!_.isNumber(version)) {
    throw "Parameter 'version' is null or not a number";
  }

  this.itemUri = itemUri;
  this.language = language;
  this.version = version;
};

_.extend(data.ItemVersionUri.prototype, {
  getDatabaseUri: function() {
    return this.itemUri.getDatabaseUri();
  },
  getDatabaseName: function() {
    return this.itemUri.getDatabaseName();
  },
  getItemUri: function () {
    return this.itemUri;
  },
  getItemId: function () {
    return this.itemUri.getItemId();
  },
  getLanguage: function() {
    return this.language;
  },
  getVersion: function() {
    return this.version;
  }
});

data.FieldUri = function(itemVersionUri, fieldId) {
  if (!itemVersionUri) {
    throw "Parameter 'itemVersionUri' is null or empty";
  }

  if (!fieldId) {
    throw "Parameter 'fieldId' is null or empty";
  }

  this.itemVersionUri = itemVersionUri;
  this.fieldId = fieldId;
};

_.extend(data.FieldUri.prototype, {
  getDatabaseUri: function() {
    return this.itemVersionUri.getDatabaseUri();
  },
  getDatabaseName: function() {
    return this.itemVersionUri.getDatabaseName();
  },
  getItemUri: function () {
    return this.itemVersionUri.getItemUri();
  },
  getItemId: function () {
    return this.itemVersionUri.getItemId();
  },
  getLanguage: function() {
    return this.itemVersionUri.getLanguage();
  },
  getVersion: function() {
    return this.itemVersionUri.getVersion();
  },
  getFieldId: function() {
    return this.fieldId;
  }
});
data.Database = function (databaseUri) {
  if (!databaseUri) {
    throw "Parameter 'databaseUri' is null";
  }

  this.databaseUri = databaseUri;
  this.ajaxOptions = { dataType: "json" };
};

_.extend(data.Database.prototype, {
  convertToItem: function(data) {
    if (!data.result) {
      console.debug("ERROR: No data from server");
      return null;
    }

    if (!data.result.items) {
      console.debug("ERROR: No items from server");
      return null;
    }

    if (data.result.items.length === 0) {
      return null;
    }

    if (data.result.items.length > 1) {
      console.debug("ERROR: Expected a single item");
      return null;
    }

    return new _sc.Definitions.Data.Item(data.result.items[0]);
  },
  convertToItems: function(data) {
    if (!data.result) {
      console.debug("ERROR: No data from server");
      return { items: [], totalCount: 0, data: data };
    }

    if (!data.result.items) {
      console.debug("ERROR: No items from server");
      return { items: [], totalCount: 0, data: data };
    }

    var items = _.map(data.result.items, function (itemData) {
      return new _sc.Definitions.Data.Item(itemData); 
    });

    return { items: items, total: data.result.totalCount, data: data.result };
  },
  getItem: function(id, completed, options) {
    if (!id) {
      throw "Parameter 'id' is null";
    }

    if (!completed) {
      throw "Parameter 'completed' is null";
    }

    options = options || {};
    if (id instanceof _sc.Definitions.Data.ItemUri) {
      options.database = id.getDatabaseName();
      id = id.getItemId();
    }

    if (id instanceof _sc.Definitions.Data.ItemVersionUri) {
      options.database = id.getDatabaseName();
      options.language = id.getLanguage();
      options.version = id.getVersion();
      id = id.getItemId();
    }

    var url = this.getUrl(id, options);

    if (options["scope"] && (_.contains(options["scope"], "parent") || _.contains(options["scope"], "children"))) {
      this.get(url).pipe(this.convertToItems).done(completed).fail(function (err) {
        completed(null, err);
      });
    } else {
      this.get(url).pipe(this.convertToItem).done(completed).fail(function (err) {
        completed(null, err);
      });
    }
  },
  search: function(searchText, completed, options) {
    if (!completed) {
      throw "Parameter 'completed' is null";
    }

    var url = this.getUrl("search:" + searchText, options);

    this.get(url).pipe(this.convertToItems).done(function (data) {
      completed(data.items, data.total, data.data);
    }).fail(function (err) {
      completed([], 0, err);
    });
  },
  
  query: function(queryExpression, completed, options) {
    if (!queryExpression) {
      throw "Parameter 'queryExpression' is null";
    }

    if (!completed) {
      throw "Parameter 'completed' is null";
    }

    var url = this.getUrl("query:" + queryExpression, options);

    this.get(url).pipe(this.convertToItems).done(function (data) {
      completed(data.items, data.total, data.data);
    }).fail(function (err) {
      completed([], 0, err);
    });
  },
  getChildren: function(id, completed, options) {
    if (!id) {
      throw "Parameter 'id' is null";
    }

    if (!completed) {
      throw "Parameter 'completed' is null";
    }

    options = options || {};
    if (!options.scope) {
      options.scope = ["children"];
    }

    var url = this.getUrl(id, options);

    this.get(url).pipe(this.convertToItems).done(function (data) {
      completed(data.items, data.total, data.data);
    }).fail(function (err) {
      completed([], 0, err);
    });
  },
  getUrl: function(itemSelector, options) {
    options = options || {};
    if (!options.database) {
      options.database = this.databaseUri.getDatabaseName();
    }

    if (!options.webApi) {
      options.webApi= this.databaseUri.webApi;
    }

    if (!options.virtualFolder) {
      options.virtualFolder = this.databaseUri.virtualFolder;
    }

    var url = Speak.Web.itemWebApi.getUrl(itemSelector, options);
    
    return url;
  },
  get: function (url) {
    return $.ajax({
      url: url,
      dataType: this.ajaxOptions.dataType
    });
  }
});
data.Field = function(item, fieldUri, fieldName, value, type) {
  if (!item) {
    throw "Parameter 'item' is null";
  }

  if (!(fieldUri instanceof data.FieldUri)) {
    throw "Parameter 'fieldUri' is null";
  }

  this.item = item;
  this.fieldUri = fieldUri;
  this.fieldName = fieldName || "";
  this.value = value || "";
  this.type = type || "Single-Line Text";
};

_.extend(data.Field.prototype, {
  toModel: function () {
    if (!this.$model) {
      this.$model = new _sc.Definitions.Models.Model(this);
    }

    return this.$model;
  },
  toViewModel: function () {
    var vm = {
      fieldId: this.fieldUri.getFieldId(),
      fieldName: this.fieldName,
      type: this.type,
      value: new ko.observable(this.value)
    };

    var self = this;
    vm.value.subscribe(function(newValue) {
      self.item[self.fieldName] = newValue;
      self.value = newValue;
    });
    return vm;
  }
});

data.LocalStorage = function (appID) {
    if(!appID) {
        throw "you need to provide a unique key";
    }
    this.appID = appID;
    this.fullKey = this.prefix + this.appID;
    this.localStorageLibrary = $.jStorage;
};

_.extend(data.LocalStorage.prototype, {
    prefix: "#sc#",
    get: function (key) {
      var realKey = this.fullKey + key;
      return this.localStorageLibrary.get(realKey);
    },
    getAll: function() {
      var index = this.localStorageLibrary.index()
          , result = {}
          , appKeys;

      appKeys = _.filter(index, function(key){
          return (key.indexOf(this.fullKey) >= 0);
      }, this);

      _.each(appKeys, function(key){
          var objKey = key.substring(this.fullKey.length, key.length);

          result[objKey] = this.localStorageLibrary.get(key);
      }, this);

      return result;
    },
    deleteRecord: function(key) {
      var realKey = this.fullKey + key;
      return this.localStorageLibrary.deleteKey(realKey);
    },
    /**
     * options: {TTL: 1000}
     */
    set: function(key, value, options) {
      var realKey = this.fullKey + key;
      return this.localStorageLibrary.set(realKey, value, options)
    },
    /**
     * Will flush only the key which begins with the right prefix
     */
    flush: function() {
      var index = this.localStorageLibrary.index();

      var appKeys = _.filter(index, function(key){
          return (key.indexOf(this.fullKey) >= 0);
      }, this);

      _.each(appKeys, function(key){
          this.localStorageLibrary.deleteKey(key);
      }, this);
    } 
});
var ajaxHelper = {
  options: function (method, data) {
    return {
      dataType: "json",
      type: method,
      data: data
    };
  },
  convertResponse: function (data) {
    if (data.statusCode !== 200) {
      return $.Deferred().reject({
        readyState: 4,
        status: data.statusCode,
        responseText: data.error.message
      });
    }

    return data.result;
  },
  createItem: function (data) {
    return new _sc.Definitions.Data.Item(data.items[0]);
  },
  triggerCreated: function (item) {
    _sc.trigger("item:created", item);
    return item;
  }
};
/**
 * Creating an Item using ItemWebApi
 * @param {itemDefinition} - minium definition for an Item {name, templateId, parentId, database }.
 *        - master database will be used if not defined
 * @param {callback} - function which will be executed as soon as the Item is created on the server
 */
var create = function (itemDefinition, fields, completed) {
  var item = itemDefinition, antiCsrfToken;

  if (!itemDefinition.name || !itemDefinition.templateId || !itemDefinition.parentId) {
    throw "Provide valid parameter in order to create an Item";
  }

  if (!itemDefinition.database) {
    itemDefinition.database = "core";
  }

  var url = _sc.Web.itemWebApi.getUrl(item.parentId, {
    webApi: "/-/item/v1/sitecore/shell",
    database: itemDefinition.database
  });

  url = _sc.Helpers.url.addQueryParameters(url, {
    name: itemDefinition.name
  });

  url = _sc.Helpers.url.addQueryParameters(url, {
    template: itemDefinition.templateId
  });

  antiCsrfToken = _sc.Helpers.antiForgery.getAntiForgeryToken();
  fields[antiCsrfToken.formKey] = antiCsrfToken.value;
  
  return $.when($.ajax(url, ajaxHelper.options("POST", fields)))
    .pipe(ajaxHelper.convertResponse)
    .pipe(ajaxHelper.createItem)
    .pipe(ajaxHelper.triggerCreated)
    .done(completed);
},//updateBackbone
  update = function (completed, context) {
    var dataToSend;

    if (!this.$fields) {
      //in case if the model was translated to Backbone model
      dataToSend = _.map(this.attributes.$fields, function (field) {
        var res;
        //update only changed fields
        if (this.attributes[field.fieldName] !== field.value) {
          res = {
            name: field.fieldName,
            value: this.attributes[field.fieldName]
          };
          return res;
        }
      }, this);

      dataToSend = _.filter(dataToSend, function (field) {
        return typeof field !== "undefined";
      });

    } else {
      //case when fields not nested in the attributes collection
      dataToSend = _.map(this.$fields, function (field) {
        return {
          name: field.fieldName,
          value: this[field.fieldName]
        };
      }, this);
    }

    var url = this.getUrl();

    var ajaxOptions = {
      dataType: "json",
      type: "PUT",
      data: dataToSend
    };

    var triggerUpdated = function (result) {
      _sc.trigger("item:updated", this);
      return result;
    };

    return $.when($.ajax(url, ajaxOptions)).pipe(this.convertResponse).pipe(triggerUpdated).done($.proxy(completed, context));
  },
  read = function (completed, context) {
    var url = this.getUrl();
    var ajaxOptions = {
      dataType: "json",
      type: "GET"
    };

    var updateFields = function (data) {
      if (!data.items) {
        return this;
      }

      if (data.items.length === 0) {
        throw "Item not found";
      }

      if (date.items.length > 1) {
        throw "Expected a single item";
      }

      var itemData = data.items[0];

      _.each(itemData.Fields, function (field, fieldId) {
        this[field.Name] = field.Value;

        var f = this.getFieldById(fieldId);
        if (f != null) {
          f.value = field.Value;
        } else {
          this.$fields.push(this, new Speak.Definitions.Data.Field(fieldUri, field.Name, field.Value, field.Type));
        }
      }, this);

      return this;
    };

    return $.when($.ajax(url, ajaxOptions)).pipe(this.convertResponse).pipe(updateFields).done($.proxy(completed, context));
  },
  remove = function (completed, context) {
    var url = this.getUrl();
    var ajaxOptions = {
      dataType: "json",
      type: "DELETE"
    };

    var triggerDeleted = function (result) {
      _sc.trigger("item:deleted", this);
      return result;
    };

    return $.when($.ajax(url, ajaxOptions)).pipe(this.convertResponse).pipe(triggerDeleted).done($.proxy(completed, context));
  },
  rename = function (newName, completed, context) {
    var data = [{
        name: "__itemName",
        value: newName
      }
    ];

    var url = this.getUrl();
    var ajaxOptions = {
      dataType: "json",
      type: "PUT",
      data: data
    };

    var triggerRenamed = function (result) {
      _sc.trigger("item:renamed", this);
      return result;
    };

    return $.when($.ajax(url, ajaxOptions)).pipe(this.convertResponse).pipe(triggerRenamed).done($.proxy(completed, context));
  };

data.createItem = create;

var itemSync = function (method, completed, options) {
  var self = this;
  options = options || {};
  var success = options.success || function () {
      if (completed) {
        completed(self);
      }
    };

  switch (method) {
  case 'read':
    this.read(this).pipe(success);
    break;
  case 'create':
    throw "The 'create' operation is not supported";
  case 'update':
    this.update(this, options).pipe(success);
    break;
  case 'delete':
    this.remove(this).pipe(success);
    break;
  }
};

var ItemBackbone = Speak.Definitions.Models.Model.extend({
  idAttribute: "itemId",
  getUrl: function () {
    var itemUri = this.get("itemUri"),
      database = new data.Database(itemUri.getDatabaseUri());

    return database.getUrl(itemUri.getItemId());
  },
  read: read,
  remove: remove,
  rename: rename,
  update: update
});


data.Item = function (itemUri, itemData) {
  if (!itemData) {
    itemData = itemUri;

    if (itemData.itemUri) {
      itemUri = itemData.itemUri;
    } else {
      var databaseUri = new data.DatabaseUri(itemData.Database);
      itemUri = new data.ItemUri(databaseUri, itemData.ID);
    }
  }

  if (itemData instanceof data.Item) {
    this.shallowCopy(itemData);
    return;
  }

  this.$fields = [];

  _.each(itemData.Fields, function (field, fieldId) {
    this[field.Name] = field.Value;

    var fieldUri = new data.FieldUri(itemUri, fieldId);

    var itemField = new data.Field(this, fieldUri, field.Name, field.Value, field.Type);
    
    if (field.FormattedValue) {
      itemField.formattedValue = field.FormattedValue;
    }
    if (field.LongDateValue) {
      itemField.longDateValue = field.LongDateValue;
    }
    if (field.ShortDateValue) {
      itemField.shortDateValue = field.ShortDateValue;
    }
    
    this.$fields.push(itemField);
  }, this);

  this.itemUri = itemUri;
  this.itemId = itemUri.getItemId();
  this.itemName = itemData.Name || "";
  /*not field on the Item on Sitecore */
  this.$displayName = itemData.DisplayName || "";
  this.$database = itemData.Database || "";
  this.$language = itemData.Language || "";
  this.$version = itemData.Version || 0;
  this.$templateName = itemData.TemplateName || "";
  this.$templateId = itemData.TemplateId || "";
  this.$hasChildren = itemData.HasChildren || false;
  this.$path = itemData.Path || "";
  this.$url = itemData.Url || "";
  this.$mediaurl = itemData.MediaUrl || "";
  this.$icon = itemData.Icon || "";
};

_.extend(data.Item.prototype, {
  getFieldById: function (fieldId) {
    return _.find(this.$fields, function (field) {
      return field.fieldUri.getFieldId() == fieldId;
    }, this);
  },
  shallowCopy: function (item) {
    this.$fields = item.$fields;

    _.each(item.$fields, function (field, fieldId) {
      this[field.Name] = field.Value;
    }, this);

    this.itemUri = item.itemUri;
    this.itemId = item.itemId;
    this.itemName = item.itemName;
    this.$displayName = item.$displayName;
    this.$language = item.$language;
    this.$version = item.$version;
    this.$templateName = item.$templateName;
    this.$templateId = item.$templateId;
    this.$hasChildren = item.$hasChildren;
    this.$path = item.$path;
    this.$url = item.$url;
    this.$mediaurl = item.$mediaurl;
  },
  toModel: function () {
    if (!this.$model) {
      var item = new ItemBackbone(this);
      item.sync = itemSync;
      return item;
    }
    return this.$model;
  },
  toViewModel: function () {
    return this.toModel().viewModel;
  },
  convertResponse: ajaxHelper.convertResponse
});
_.extend(_sc.Factories, {
  createJQueryUIComponent: function (Models, Views, control, separateWidgetModel) {
    var model = Models.ControlModel.extend({
      initialize: function (options) {
        this._super();

        /* copy functions from the control to the model */
        if (control.model) {
          _.each(_.keys(control.model), function (member) {
            this.model[member] = control.model[member];
          }, this);
        }

        /* create attributes */
        _.each(control.attributes, function (attribute) {
          var defaultValue = typeof attribute.defaultValue != "undefined" ? attribute.defaultValue : null;
          this.set(attribute.name, defaultValue);
        }, this);

        /* call post initialize function */
        if (typeof this.initialized != "undefined") {
          this.initialized();
        }
      }
    });

    /*separate model for plugin*/
    var widgetModel;
    if (separateWidgetModel) {
      widgetModel = Models.ControlModel.extend({
        initialize: function (options) {
          this._super();

          /* create attributes */
          _.each(control.attributes, function (attribute) {
            //skip the sitecore added properties in model
            if (attribute.added == true)
              return;
            //the name of the attribute property can be different for sitecore control model and for jqueryUI plugin
            var pluginPropertyName = typeof attribute.pluginProperty !== "undefined" ? attribute.pluginProperty : attribute.name;
            var defaultValue = typeof attribute.defaultValue != "undefined" ? attribute.defaultValue : null;
            this.set(pluginPropertyName, defaultValue);
          }, this);

          /* call post initialize function */
          if (typeof this.initialized != "undefined") {
            this.initialized();
          }
        }
      });
    }

    var view = Views.ControlView.extend({
      initialize: function (options) {
        this._super();
        var pluginPropertyName;

        options = options || {};

        /* copy functions from the control to the view */
        if (control.view) {
          _.each(_.keys(control.view), function (member) {
            this[member] = control.view[member];
          }, this);
        }

        if (separateWidgetModel) 
          this.widgetModel = new widgetModel();
        
        /* setup attributes on the model */
        _.each(control.attributes, function (attribute) {
          pluginPropertyName = typeof attribute.pluginProperty !== "undefined" ? attribute.pluginProperty : attribute.name;
          var defaultValue = typeof attribute.defaultValue != "undefined" ? attribute.defaultValue : null;
          if (typeof defaultValue !== "undefined" && defaultValue !== null) 
            options[pluginPropertyName] = defaultValue;

          var value = this.$el.attr("data-sc-option-" + pluginPropertyName);

          if (value) {
            if (value == "true") {
              value = true;
            }

            if (value == "false") {
              value = false;
            }
            if (separateWidgetModel) {
              if (this.widgetModel.has(pluginPropertyName))
                this.model.set(pluginPropertyName, value);
            }            
            else
              this.model.set(attribute.name, value);

            /*if (typeof options[attribute.name] === "undefined") {*/
            options[pluginPropertyName] = value;
            /*}*/
          }
        }, this);
        
        /* setup events */
        _.each(control.events, function (eventDescriptor) {
          if (typeof options[eventDescriptor.name] === "undefined") {
            var self = this;
            options[eventDescriptor.name] = function (e, data) {
              self.raiseEvent(eventDescriptor, e, data);
            };
          }
        }, this);

        /* create the jquery ui component */
        this.$el[control.control](options);
        this.widget = this.$el[control.control];

        this.widget = this.widget || this.$el.data(control.control);
        /*after update to jqeryUI 1.10.1 widget retrieving should be done by calling $el.data("widgetNamespace-widgetName")*/
        this.widget = this.widget || this.$el.data(control.namespace + control.control);

        /* setup functions */
        _.each(control.functions, function (functionDescriptor) {
          var self = this;
          //setting the control.function to run appropriate one from the widget
          this[functionDescriptor.name] = function () {
            //if there is no method with appropriate name just inside the widget object (like Datepicker)
            //trying to execute it through the $element.widgetName("methodName", parameters), e.g. $(element).datepicker("setDate","01/01/2014")
            if (!self.widget[functionDescriptor.name]) {
              var func = self.widget;
              return func.apply(self.$el, [functionDescriptor.name, arguments[0]]);
            }
            //when we have needed method inside the widget instance object - trying to execute it through widgetInstance.methodName(params)
            //this part was initialy implemented for the dynaTree library
            return self.widget[functionDescriptor.name].apply(self.widget, arguments);
          };
        }, this);

        /* subscribe to changes */
        if (separateWidgetModel) {
          this.widgetModel.on("change", function (modelArg, opts) {
            var changes = {};
            if (!modelArg.changed) {
              return;
            }

            _.each(_.keys(modelArg.changed), function (attributeName) {
              changes[attributeName] = modelArg.get(attributeName);
            });
            this.$el[control.control]("option", changes);
          }, this);
          this.model.on("change", function (modelArg, opts) {
            var changes = {}, jqPluginPropertyName, attr;
            if (!modelArg.changed) {
              return;
            }

            _.each(_.keys(modelArg.changed), function (attributeName) {
              //getting changed attribute object
              attr = _.find(control.attributes, function (attribute) {
                return attribute.name == attributeName;
              });
              //skip the sitecore added properties in model
              //skip the properties with manual sync
              if (attr && !(attr.added == true || attr.manualSync == true)) {
                //the name of the attribute property can be different for sitecore control model and for jqueryUI plugin
                jqPluginPropertyName = (attr && typeof attr.pluginProperty !== "undefined") ? attr.pluginProperty : attributeName;
                this.widgetModel.set(jqPluginPropertyName, modelArg.get(attributeName));
              }
            }, this);
            this.$el[control.control]("option", changes);
          }, this);
        } else {
          this.model.on("change", function (modelArg, opts) {
            var changes = {}, jqPluginPropertyName, attr;
            if (!modelArg.changed) {
              return;
            }

            _.each(_.keys(modelArg.changed), function (attributeName) {
              //skip the sitecore added properties in model
              if (!_.find(control.attributes, function (attribute) {
                return attribute.name == attributeName && attribute.added == true;
              })) {
                //getting changed attribute object
                attr = _.find(control.attributes, function (attribute) {
                  return attribute.name == attributeName;
                });

                //the name of the attribute property can be different for sitecore control model and for jqueryUI plugin
                jqPluginPropertyName = (attr && typeof attr.pluginProperty !== "undefined") ? attr.pluginProperty : attributeName;
                changes[jqPluginPropertyName] = modelArg.get(attributeName);
              }
            });
            this.$el[control.control]("option", changes);
          }, this);
        }
        
        /* call post initialize function */
        if (typeof this.initialized != "undefined") {
          this.initialized();
        }
      },
      raiseEvent: function (eventDescriptor, e, data) {
        if (eventDescriptor.on) {
          this[eventDescriptor.on](e, data);
        }

        var controlId = this.$el.attr("data-sc-id");

        var ctrl = this.app[controlId];
        if (ctrl && typeof ctrl[eventDescriptor.name] != "undefined") {
          ctrl[eventDescriptor.name](ctrl, e, data);
        }
        if (controlId) {
          this.app.trigger(eventDescriptor.name + ":" + controlId, e, data);
        }
      }
    });

    fctry.createComponent(control.componentName, model, view, control.selector);
  }
});
  if(__SPEAKDEBUG) {

    var numberOfApps = 0
        , totalNumberOfControls = 0
        , totlaNumberOfApp = 0
        , alltheControls = [];

    var retrieveAppInfo = function(app) {      
      var numberOfNestedApp = 0,
          nestedApps = [],
          nbControlInThisApp = 0;

        for(var param in app) {
          if(app[param] && app[param].modelType === "application") {
            var app = app[param];
            totlaNumberOfApp += 1;
            numberOfNestedApp += 1;

            _.each(app.Controls, function(control){
              totalNumberOfControls += 1;
              nbControlInThisApp += 1;
              alltheControls.push(control);
            });
            nestedApps.push(retrieveAppInfo(app[param]));
          }
        }
        return {
          numberOfNestedApp: numberOfApps,
          nestedApps: nestedApps,
          nbControlInThisApp: nbControlInThisApp
        };
    };

    var getAllInfo = function() {
      var appStats = retrieveAppInfo(Speak);
      return {
        numberOfApps: numberOfApps,
        totalNumberOfControls: totalNumberOfControls,
        totlaNumberOfApp: totlaNumberOfApp,
        alltheControls: alltheControls,
        allApplications: appStats
      };
    };

    _sc.__info = function() {
      return  {
        Components: {
          totalComponents: Speak.Components.length,
          compontentList: Speak.Components
        },
        Pipelines: {
          totalPipelines: Speak.Pipelines.length()
        },
        Applications: getAllInfo()
      };
    }
  }
}).call(window);
/**!
 *
 * sitecore SPEAK framework
 *
 * Built: Wed Sep 28 2016 15:44:43 GMT+0300 (FLE Daylight Time)
 * PackageVersion: 2.0.57
 *
 */

!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.sc=e():"undefined"!=typeof global?global.sc=e():"undefined"!=typeof self&&(self.sc=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var property_1 = require('../models/property');
var basePropertyModel = property_1.Property;
var basePropertyPrototype = property_1.Property.prototype;
/**
 * {class} PropertyFactory
 *
 * Class which take a properfy defintion and return a new Property type.
 *
 *var propertyFactory =  new PropertyFactory( scUtils )
 *
 *```javascript
 *  var PropertyWithMethod = propertyFactory.make({
 *    someMethod: function() {
 *        return true;
 *    }
 *  });
 *```
 */
var PropertyFactory = (function () {
    function PropertyFactory(scUtils) {
        this.scUtils = scUtils;
    }
    /**
     * @param {any} propertyDef, generally an object literal with method you want to attach for your property type.
     */
    PropertyFactory.prototype.make = function (propertyDef) {
        var self = this;
        var property = function () {
            basePropertyModel.apply(this, arguments);
        };
        if (this.scUtils.is.a.function(propertyDef)) {
            property = function () {
                basePropertyModel.apply(this, arguments);
                propertyDef.apply(this, arguments);
            };
        }
        for (var i in basePropertyPrototype) {
            property.prototype[i] = basePropertyPrototype[i];
        }
        for (var j in propertyDef) {
            property.prototype[j] = propertyDef[j];
        }
        return property;
    };
    return PropertyFactory;
})();
exports.PropertyFactory = PropertyFactory;
//# sourceMappingURL=propertyFactory.js.map
},{"../models/property":3}],2:[function(require,module,exports){
var propertyFactory_1 = require('./factories/propertyFactory');
exports.PropertyFactory = propertyFactory_1.PropertyFactory;
var property_1 = require('./models/property');
exports.Property = property_1.Property;
//# sourceMappingURL=index.js.map
},{"./factories/propertyFactory":1,"./models/property":3}],3:[function(require,module,exports){
/// <reference path='../../typings/sitecore.d.ts' />
/**
 * Property
 *
 * The default property class. By default, it is a read-only property type.
 */
var Property = (function () {
    /**
     * @param {any} initialValue can be any kind of literal object.
     * @param {SpeakComponent} component that will be used to make complex property type.
     * @param {string} propertyName, the name of the property ( this.get("myProperty") or this.myProperty )
     */
    function Property(initialValue, component, propertyName) {
        this.propertyName = propertyName;
        this.value = initialValue;
        this.component = component;
        this.__type = "Property";
        this.initialize.apply(this, arguments);
    }
    Property.prototype.initialize = function () {
    };
    ;
    Property.prototype.set = function () {
        throw new Error("read only property");
    };
    ;
    Property.prototype.get = function () {
        return this.value;
    };
    ;
    return Property;
})();
exports.Property = Property;
//# sourceMappingURL=property.js.map
},{}],4:[function(require,module,exports){
var TYPE = "data-sc-component", ID = "data-sc-id", APP_KEY = "data-sc-app", SCRIPT = "data-sc-require", ATTR_PAGECODE = "script[type='text/x-sitecore-pagecode']", TEMPLATE = "data-sc-template", PROPERTIES = "data-sc-properties", PRESENTER = "data-sc-presenter", PLUGIN_ID = "data-sc-pluginId", NESTED = "data-sc-hasnested", COMPONENT = "data-sc-id", ATTR_PLUGIN = "script[type='text/x-sitecore-pluginscript']";
var conf = {
    TYPE: TYPE,
    ID: ID,
    SCRIPT: SCRIPT,
    ROOTSTATICURL: "",
    TEMPLATE: TEMPLATE,
    PROPERTIES: PROPERTIES,
    PRESENTER: PRESENTER,
    APP_KEY: APP_KEY,
    NESTED: NESTED,
    ATTR_COMPONENT: "[" + COMPONENT + "]",
    ATTR_TYPE: "[" + TYPE + "]",
    ATTR_ID: "[" + ID + "]",
    ATTR_APP: "[" + APP_KEY + "]",
    ATTR_SCRIPT: "[" + SCRIPT + "]",
    ATTR_PAGECODE: ATTR_PAGECODE,
    ATTR_PLUGIN: ATTR_PLUGIN,
    PLUGIN_ID: PLUGIN_ID,
    /*ATTR_PAGECODE_ID: "[" + PAGECODE_ID + "]",*/
    deferred: false,
    useBundle: false,
    cloak: "data-sc-cloak",
    defaultPresenter: "scComponentPresenter",
    lifeCycle: ["initialize", "initialized", "beforeRender", "render", "afterRender"]
};
module.exports = conf;
//# sourceMappingURL=conf.js.map
},{}],5:[function(require,module,exports){
var deferred_1 = require("../utils/deferred");
var DeferEvent = (function () {
    function DeferEvent(name, value) {
        this.listOfDeferred = [];
        this.value = value;
        this.eventName = name;
    }
    DeferEvent.prototype.defer = function () {
        var deferred = new deferred_1.Deferred();
        this.listOfDeferred.push(deferred.promise);
        return deferred;
    };
    return DeferEvent;
})();
exports.DeferEvent = DeferEvent;
//# sourceMappingURL=deferevent.js.map
},{"../utils/deferred":20}],6:[function(require,module,exports){
var events = function (Sitecore) {
    var eventsHandler = {
        handleEvent: function (invocation, component) {
            if (!invocation) {
                throw new Error("You must pass an invocation");
            }
            var index = invocation.indexOf(":");
            if (index <= 0) {
                throw new Error("Invocation is malformed (missing 'handler:')");
            }
            var context = {
                control: component,
                app: component.app,
                handler: invocation.substr(0, index),
                target: invocation.substr(index + 1)
            };
            Sitecore.module("pipelines").get("Invoke").execute(context);
        }
    };
    return eventsHandler;
};
module.exports = events;
//# sourceMappingURL=index.js.map
},{}],7:[function(require,module,exports){
var inheritante = require("../utils/inheritance");
var appHelper = require("../utils/app");
var utils = require("sc-utils");
var application = function (pageCodeStore, configureInject, PageCode) {
    return {
        createApplication: function (app, appManager) {
            if (app.registered) {
                return;
            }
            var domID = utils.string.uniqueId(), injectMethod = configureInject.setupInjectMethod(appManager), pageCode = pageCodeStore.find(app.key), P;
            if (pageCode) {
                //get deps from requirejs. execute the function and use the object returned.
                var deps = pageCode.deps, args = [];
                if (deps && utils.is.a.function(pageCode)) {
                    deps.forEach(function (d) {
                        args.push(requirejs(d));
                    });
                }
                if (utils.is.a.function(pageCode) && Object.keys(pageCode.prototype).length === 0) {
                    pageCode = pageCode.apply(app, args);
                }
                P = inheritante.wrap(PageCode, pageCode);
                app = new P(app);
            }
            else {
                app = new PageCode(app);
            }
            utils.object.extend(app, appHelper);
            app.inject = function () {
                injectMethod.apply(this, arguments);
            };
            if (app.el) {
                app.el.__domID = domID;
                app.__domID = domID;
            }
            app.registered = true;
            return app;
        }
    };
};
module.exports = application;
//# sourceMappingURL=application.js.map
},{"../utils/app":15,"../utils/inheritance":23,"sc-utils":75}],8:[function(require,module,exports){
var inheritanceUtils = require("../utils/inheritance");
var ComponentFactory = function (basePresenter) {
    var buildPresenter = function (base, presenterDefinition) {
        var ctor = ({}.constructor !== presenterDefinition.constructor) ? presenterDefinition.constructor : base.prototype.constructor, basePrototype = base.prototype;
        var Presenter = (function (ctor) {
            return function () {
                ctor.apply(this, arguments);
            };
        })(ctor);
        if (presenterDefinition.constructor !== {}.constructor) {
            //Presenter = presenterDefinition.constructor;
            if (presenterDefinition.prototype) {
                basePrototype = presenterDefinition.prototype;
            }
        }
        for (var i in basePrototype) {
            if (basePrototype.hasOwnProperty(i) && presenterDefinition[i] /*&& i !== "constructor" -- constructor won't be there*/) {
                Presenter.prototype[i] = presenterDefinition[i];
            }
            else {
                Presenter.prototype[i] = basePrototype[i];
            }
        }
        return Presenter;
    };
    return {
        /**
         * Make a Component class that can be instantiated
         * the same way as the base Component
         * @param  {Object} adapt an adatper object
         * @param  {Def} def definition of the Object
         * @return {Class} a custom Component class
         */
        make: function (presenter, componentDefinition, el) {
            var Presenter, presenterDefinition = presenter || basePresenter.prototype;
            if (presenterDefinition.make) {
                //delegate construction to present
                return presenterDefinition.make(componentDefinition, el);
            }
            Presenter = buildPresenter(basePresenter, presenterDefinition);
            return inheritanceUtils.wrap(Presenter, componentDefinition);
        }
    };
};
module.exports = ComponentFactory;
//# sourceMappingURL=component.js.map
},{"../utils/inheritance":23}],9:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};/// <reference path='../typings/speak/sitecore.d.ts' />
/// <reference path='../typings/speak/speakevent.d.ts' />
/// <reference path='../typings/speak/modulejs.d.ts' />
/// <reference path='../typings/speak/pipelineJS.d.ts' />
/// <reference path='../typings/speak/loaderJS.d.ts' />
/// <reference path='../typings/requirejs/require.d.ts' />
/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/globalize/globalize.d.ts' />
/// <reference path='../typings/es6-promise/es6-promise.d.ts' />
// Includes
var scUtils = require("sc-utils");
var utils = require("./utils/index");
var modulejs = require("modulejs");
var conf = require("./conf");
var DOM = require("./utils/DOM");
var Events = require("speakevent");
var index_1 = require("../../bootjs-loader/src/index");
var index_2 = require("../../bootjs-stores/src/index");
var index_3 = require("../../bootjs-parsers/src/index");
var index_4 = require("../../bootjs-managers/src/index");
var basePresenterModel = require("./model/basePresenter");
var baseModel = require("./model/baseModel");
var pageCode = require("./model/pageCode");
var componentFactorySetup = require("./factory/component");
var injectUtils = require("./utils/inject");
var applicationFactorySetup = require("./factory/application");
var inheritanceUtils = require("./utils/inheritance");
var contextUtils = require("./utils/context");
var ScPipeline = require("pipelineJS");
var eventsHandler = require("./events/index");
var version = require("./version");
var index_5 = require("../../bootjs-globalize/src/index");
/**
 * The sitecore.speak global namespace object
 *
 * You can configure the sitecore.speak global object with an enigmatic Global variable
 *
 * ```
 * __speak_config = {
 *     //Required, point to the loader you want to use
 *     loader: function(deps, callback) {
 *       //deps is an array of dependencies
 *       //callback needs to be called when the deps are all loaded
 *     },
 *     //Required, template is the Template engine you want to use with SPEAK
 *     template: Handlebar,
 *     //Optional, set if the init function needs to be manualy set
 *     deferred: false,
 * }
 * ```
 * @class sitecore
 * @uses Events
 **/
var speak = {};
modulejs.attach(speak);
//1st: we setup all internal variable used accross modules
var isBrowser = typeof window !== "undefined", root = isBrowser ? window : global, isInitialized = root.__SPEAK_LOADED, config = root.__speak_config || {}, cultureConfig = root.__speak_config_culture || [], Handlebars = root.Handlebars, deferred = config.deferred, lifeCycle = config.lifeCycle || conf.lifeCycle, ready = function () { }, onBeforeParse = function () { }, onAfterParse = function () { }, onBeforeLoad = function () { }, onAfterLoad = function () { }, bootstrapValues = (isBrowser && config.conf) ? config.conf : [];
var defaultConfig = {
    loader: function (deps, loaded) {
        var flat = scUtils.array.flatten(deps);
        if (flat.length) {
            requirejs(flat, function () {
                loaded.apply(this, arguments);
            });
        }
        else {
            loaded();
        }
    },
    template: Handlebars
};
if (isBrowser && !root.console) {
    root.log = function () { };
}
config = scUtils.object.defaults(config, defaultConfig);
var templateEngine = config.template, template = new index_4.TemplateManager(templateEngine), 
//2nd: We setup the loader, the stores, the parsers
loader = new index_1.Loader(config), stores = new index_2.StoreLocator(), 
//3rd: We setup the baseComponent used by default
//it needs the pluginManager for later use
pluginManager = new index_4.PluginManager(stores.plugin), baseComponent = basePresenterModel(pluginManager, stores.propertyType), baseData = baseModel(stores.propertyType), basePageCode = pageCode(stores.propertyType), 
//Setup the componentFactory with the baseComponent and the presenterStore for later use
componentFactory = componentFactorySetup(baseComponent), 
//Setup the component and application manager with the appropriates store and shared variable
//we pass isInitialized in order to have access to the public API later inside a Component
componentManager = new index_4.ComponentManager(index_3.ComponentParser, lifeCycle, stores.definition, stores.presenter, componentFactory, speak), injectMethod = injectUtils(loader, index_3.Parser, stores), applicationFactory = applicationFactorySetup(stores.pageCode, injectMethod, basePageCode), applicationManager = new index_4.AppManager(stores.app, componentManager.componentPipeline.bind(componentManager), pluginManager.initializeApplication.bind(pluginManager), applicationFactory);
speak.globalize = new index_5.SpeakGlobalize(root.Globalize, cultureConfig, contextUtils.current().twoLetterIsoCode);
/**
 * Create the speak.app object, register all the component(s), presenter(s), pageCode(s), plugin(s)
 *
 * @static
 * @async
 * @method init
 * @param {Function} callback
 *
 * @example
 * ```
 * Sitecore.Speak.init( function( tree, apps ) {
 *   //tree will be exposed in sitecore.app
 *   //apps is a flat list of all the applications in the page
 * } );
 * ```
 *
 * If sitecore is not loaded by a AMD Loader, the init function will be called automatically
 *
 * How do I defer the exection ?
 *
 *```
 * window.__speak_config = {
 *   context: {},
 *   deferred: true,
 * };
 * ```
 */
speak.init = function (ready) {
    if (isInitialized) {
        return;
    }
    isInitialized = true;
    // Call speak.initAndReady if/when DOM is ready
    if (root.document.readyState === "loading") {
        root.document.onreadystatechange = function () {
            root.document.onreadystatechange = null;
            speak.initAndReady(ready);
        };
    }
    else {
        speak.initAndReady(ready);
    }
};
speak.initAndReady = function (callback) {
    var context = config.context ? config.context : void 0;
    //finding all the components, applications and pagecode in the page
    //build stores based on DOM's Item
    onBeforeParse(speak);
    speak.trigger("beforeParsing");
    var allElements = index_3.Parser.parse();
    speak.trigger("afterParsing");
    onAfterParse(speak);
    stores.build(allElements);
    onBeforeLoad(speak);
    speak.trigger("beforeLoading");
    //load all the store
    loader.load(stores, function () {
        //when everything gets loaded, we instanciate the components and create the applications
        speak.trigger("afterLoading");
        onAfterLoad(speak);
        stores.markAsLoaded();
        applicationManager.start(context, function (tree, flat) {
            if (tree.length === 1) {
                tree = tree[0];
            }
            speak.app = tree;
            speak.applications = flat;
            speak.trigger("apps:loaded", tree);
            if (callback) {
                callback(tree);
            }
        });
    });
};
/**
 * Template manager that will be used for the speak object
 * @property template
 * @static
 * @type Template
 */
speak.template = template;
speak.isDebug = function () {
    var isDebug = config.debug || scUtils.url.parameterByName("sc_debug");
    if (typeof isDebug === "string") {
        isDebug = parseInt(isDebug, 2);
    }
    return !!isDebug; // typecast to boolean
};
/**
 * Template engine is exposed to allow extensions
 * @static
 * @property templateEngine
 */
speak.tmpl = template.tmp;
/**
 * Returns a unique Id across the speak object
 * @method uniqueId
 * @static
 * @return {string} UniqueId
 */
speak.uniqueId = scUtils.string.uniqueId;
/**
 * Async library provided by speak
 * @property async
 * @static
 * @return {Object} async API
 */
speak.async = scUtils.async;
/**
 * Attach a scriptfile in the Page and load it
 * @method attachScript
 * @static
 * @async
 */
//sitecore.attach = utils.attachScript;
/**
 * Register your presenter(s)
 * @method presenter
 * @param {String} name The name of your presenter
 * @param {Object} presenter The definition of your presenter
 * @static
 */
speak.presenter = stores.presenter.create.bind(stores.presenter);
speak.presenter({
    name: conf.defaultPresenter
}); //empty presenter
/**
 * Register your plugin(s)
 * @method plugin
 * @param {String} name The name of your plugin
 * @param {Object} plugin The definition of your plugin
 * @static
 */
speak.plugin = stores.plugin.create.bind(stores.plugin);
/**
 * Register your component(s)
 * @method component
 * @param {String} name The name of your component
 * @param {Object} component The definition of your component
 * @static
 */
speak.component = stores.definition.create.bind(stores.definition);
/**
 * Register your pageCode(s)
 * @method pageCode
 * @param {String} name The name of your pageCode
 * @param {Object} pageCode The definition of your pageCode
 * @static
 */
speak.pageCode = function () {
    stores.pageCode.isPageCode = true;
    stores.pageCode.create.apply(stores.pageCode, arguments);
};
/**
 * Expose a propertyType inside an application
 * @method propertyType
 * @static
 */
speak.propertyType = stores.propertyType.create.bind(stores.propertyType);
/**
 * Expose a component inside an application
 * @method exposeComponent
 * @static
 */
speak.exposeComponent = componentManager.exposeComponent.bind(componentManager);
/**
 * Extending the speak object
 * @method extend
 * @static
 */
speak.extend = scUtils.object.extend;
speak.inherit = inheritanceUtils.inherit;
/**
 * Apply all the pluagins to all the application
 * @method applyPlugins
 * @static
 */
speak.applyPlugins = pluginManager.initializeComponent.bind(pluginManager);
/**
 * See utils, exposed our utility method to the speak object
 * @property utils
 * @static
 */
speak.utils = scUtils.object.extend(scUtils, utils);
speak.utils.Events = Events;
speak.Context = contextUtils;
speak.Pipelines = speak.module("pipelines", ScPipeline);
speak.Events = eventsHandler(speak);
speak.bindable = function (data) {
    return new baseData(data);
};
scUtils.object.extend(speak, Events);
//start the engine if not deferred
if (isBrowser) {
    //expose to Global object if in browser
    //window.Sitecore = speak;
    DOM.addCloak();
    // If __speak_config.deferred is set, it is the responsibility of deferrer to call init()
    if (!deferred) {
        speak.init(ready);
    }
}
/**
 * Execute a callback when all the application has been instanciated
 * @method ready
 * @static
 */
speak.ready = function (callback) {
    ready = callback;
};
/**
 * Execute some code before and after the page has been parsed
 * @property parser
 * @static
 */
speak.parser = {
    before: function (callback) {
        onBeforeParse = callback;
    },
    after: function (callback) {
        onAfterParse = callback;
    }
};
/**
 * Execute some code before and after the page has been loaded
 * @property loaded
 * @static
 */
speak.loaded = {
    before: function (callback) {
        onBeforeLoad = callback;
    },
    after: function (callback) {
        onAfterParseLoad = callback;
    }
};
speak.version = version;
if (isBrowser) {
    window.Sitecore = window.Sitecore || {};
    if (Sitecore.Speak) {
        scUtils.object.extend(Sitecore.Speak, speak);
    }
    else {
        Sitecore.Speak = speak;
    }
}
module.exports = speak;
//# sourceMappingURL=index.js.map
},{"../../bootjs-globalize/src/index":28,"../../bootjs-loader/src/index":30,"../../bootjs-managers/src/index":33,"../../bootjs-parsers/src/index":45,"../../bootjs-stores/src/index":53,"./conf":4,"./events/index":6,"./factory/application":7,"./factory/component":8,"./model/baseModel":10,"./model/basePresenter":11,"./model/pageCode":12,"./utils/DOM":13,"./utils/context":17,"./utils/index":22,"./utils/inheritance":23,"./utils/inject":24,"./version":27,"modulejs":56,"pipelineJS":57,"sc-utils":75,"speakevent":85}],10:[function(require,module,exports){
var utils = require("../utils/index");
var classUtils = require("../utils/class");
var extendUtil = require("../utils/inheritance");
var Events = require("../utils/events");
var deferEvents_1 = require("../utils/deferEvents");
var baseModel = function (propertyStore) {
    var BaseModel = window.SpeakBaseModel = function BaseModel(initial) {
        utils.initializeProperties(this, initial);
        this.__parameterTemplates = initial || {};
        this.defineProperties();
    };
    extendUtil.extend(BaseModel.prototype, classUtils(propertyStore));
    extendUtil.extend(BaseModel.prototype, Events);
    extendUtil.extend(BaseModel.prototype, deferEvents_1.DeferEvents);
    return BaseModel;
};
module.exports = baseModel;
//# sourceMappingURL=baseModel.js.map
},{"../utils/class":16,"../utils/deferEvents":18,"../utils/events":21,"../utils/index":22,"../utils/inheritance":23}],11:[function(require,module,exports){
var utils = require("../utils/index");
var extendUtil = require("../utils/inheritance");
var classUtil = require("../utils/class");
var Events = require("../utils/events");
var DOM = require("../utils/DOM");
var deferEvents_1 = require("../utils/deferEvents");
//Component Model needs the pluginManager to be be created
var SetupComponentModel = function (pluginManager, propertyStore) {
    /**
     * Component class
     *
     * @class Component
     * @constructor
     * @param  {initial} initial value
     * @param  {initial} app where the component will be contained
     * @param  {el} the component DOM element
     * @param  {_s} the SPEAK framework
     * @returns {Component}
     */
    var Component = function (initial, app, el, _s) {
    };
    Component.prototype.constructor = function (initial, app, el, _s) {
        this.el = el;
        this._s = _s;
        this.app = app;
        this.id = initial.id;
        this.name = initial.name;
        this.children = [];
        this.parent = initial.parent;
        this.__properties = {};
        this.__parameterTemplates = initial._properties || {};
        utils.initializeProperties(this, initial);
        this.initialize.apply(this, arguments);
        pluginManager.initializeComponent(this);
        this.defineProperties();
        if (this.listen) {
            for (var evtKey in this.listen) {
                if (this.listen.hasOwnProperty(evtKey)) {
                    if (evtKey.indexOf(":$this") === -1) {
                        return;
                    }
                    var evtKeyWithId = evtKey.replace("$this", this.id);
                    this.app.on(evtKeyWithId, this[this.listen[evtKey]], this);
                }
            }
        }
    };
    /**
     * Initialize the component {{#crossLink "Component"}}{{/crossLink}}.
     *div
     * @for  Component
     * @method initialize
     */
    Component.prototype.initialize = function () { };
    /**
     * Call this function when the component is fully initialize
     *
     * @for  Component
     * @method initialized
     */
    Component.prototype.initialized = function () { };
    /**
     * Render the component {{#crossLink "Component"}}{{/crossLink}}.
     *
     * @for  Component
     * @method render
     * @param  {Function} callback a callback
     * @return {Component}            The {{#crossLink "Component"}}{{/crossLink}}
     */
    Component.prototype.render = function (callback) {
        if (!this.hasTemplate) {
            return;
        }
        var html, toClient = [], self = this, template = this.template || this.type || undefined, data = (self.serialize) ? self.serialize() : self;
        this._s.template.get(template, function (tmplContent, extendObj) {
            var compiled = self._s.tmpl.compile(tmplContent);
            html = compiled(data);
            if (!html && callback) {
                return callback(html);
            }
            var elements = DOM.createDomElement(html);
            if (elements.length === 1) {
                self.el.appendChild(elements[0]);
            }
            else {
                console.log("A component must have only one root Element");
            }
            self.el = self.el.firstChild;
            if (self.appendTo) {
                self.appendTo.appendChild(self.el);
            }
            if (callback) {
                return callback(html);
            }
        });
        return this;
    };
    /**
     * Serialize the component {{#crossLink "Component"}}{{/crossLink}}.
     *
     * @for  Component
     * @method serialize
     * @return {JSON}            a JSON representation of the component
     */
    Component.prototype.serialize = function () {
        var result = {};
        for (var i in this) {
            if (i !== "template" && i !== "render" && i !== "serialize" && i !== "placeholder" && i !== "app") {
                var a = this[i];
                if (typeof a !== "function") {
                    result[i] = a;
                }
            }
        }
        return result;
    };
    extendUtil.extend(Component.prototype, classUtil(propertyStore));
    extendUtil.extend(Component.prototype, Events);
    extendUtil.extend(Component.prototype, deferEvents_1.DeferEvents);
    return Component;
};
module.exports = SetupComponentModel;
//# sourceMappingURL=basePresenter.js.map
},{"../utils/DOM":13,"../utils/class":16,"../utils/deferEvents":18,"../utils/events":21,"../utils/index":22,"../utils/inheritance":23}],12:[function(require,module,exports){
var utils = require("../utils/index");
var classUtils = require("../utils/class");
var extendUtil = require("../utils/inheritance");
var Events = require("../utils/events");
var deferevents_1 = require("../utils/deferevents");
var pageCode = function (propertyStore) {
    /**
     * PageCode class
     *
     * @class PageCode
     * @constructor
     * @param  {app} initial value
     * @returns {PageCode}
     */
    var PageCode = function (app) {
        utils.initializeProperties(this, app);
        this.__parameterTemplates = {};
        this.defineProperties();
    };
    extendUtil.extend(PageCode.prototype, classUtils(propertyStore));
    extendUtil.extend(PageCode.prototype, Events);
    extendUtil.extend(PageCode.prototype, deferevents_1.DeferEvents);
    return PageCode;
};
module.exports = pageCode;
//# sourceMappingURL=pageCode.js.map
},{"../utils/class":16,"../utils/deferevents":19,"../utils/events":21,"../utils/index":22,"../utils/inheritance":23}],13:[function(require,module,exports){
var scutils = require("sc-utils");
var conf = require("../conf");
var toArray = scutils.array.toArray;
var isBrowser = typeof window !== "undefined", root = isBrowser ? window : module.exports, doc = root.document;
if (isBrowser) {
    var table = doc.createElement("table"), tableRow = doc.createElement("tr"), containers = {
        "tr": doc.createElement("tbody"),
        "tbody": table,
        "thead": table,
        "tfoot": table,
        "td": tableRow,
        "th": tableRow,
        "*": doc.createElement("div")
    }, fragmentRE = /^\s*<(\w+|!)[^>]*>/;
}
var DOMutils = {
    /**
     * Find all the DOM element which has the appropriate markup for an application
     * @return {Array} array of DOM Element
     */
    findApps: function (el) {
        var element = el ? el : document;
        if (element.querySelectorAll) {
            return toArray(element.querySelectorAll(conf.ATTR_APP));
        }
        return [];
    },
    /**
     * Find among all the childer of a DOM
     * to retreive all the DOM elements which as the appropriate markup for a component
     * @param  {[type]} el [description]
     * @return {[type]}    [description]
     */
    findComponents: function (el) {
        var element = el ? el : document;
        if (element.querySelectorAll) {
            return toArray(element.querySelectorAll(conf.ATTR_COMPONENT));
        }
        return [];
    },
    findPageCodes: function (el) {
        var element = el ? el : document;
        if (element.querySelectorAll) {
            return toArray(element.querySelectorAll(conf.ATTR_PAGECODE));
        }
        return [];
    },
    findPageCode: function (el) {
        var element = el ? el : document;
        if (element.querySelector) {
            return element.querySelector(conf.ATTR_PAGECODE);
        }
        return [];
    },
    findPlugins: function (el) {
        var element = el ? el : document;
        if (element.querySelectorAll) {
            return toArray(element.querySelectorAll(conf.ATTR_PLUGIN));
        }
        return [];
    },
    /**
     * Based his parent, find the depth of a child Node
     * @param  {DOM Element} child the DOM element you want to find the depth
     * @param  {DOM Element} parent the parent DOM element you want as root, if not, the parent is the window Object
     * @return {Integer}        the depth of the DOM element compared o his parent.
     */
    getDepth: function (child, parent) {
        var node = child, comp = null, depth = 0;
        if (parent) {
            comp = parent.id;
        }
        while (node.parentNode !== comp) {
            node = node.parentNode;
            depth++;
        }
        return depth;
    },
    // Find first ancestor of el with tagName
    // or undefined if not found
    findParentApp: function (el) {
        do {
            el = el.parentNode;
            if (el.hasAttribute && el.hasAttribute(conf.APP_KEY)) {
                return el;
            }
        } while (el.parentNode);
        // Many DOM methods return null if they don't 
        // find the element they are searching for
        // It would be OK to omit the following and just
        // return undefined
        return null;
    },
    findParentComponent: function (el) {
        do {
            el = el.parentNode;
            if (el.hasAttribute && el.hasAttribute(conf.ID) && el.hasAttribute(conf.NESTED)) {
                return el;
            }
            if (el.hasAttribute && el.hasAttribute(conf.APP_KEY)) {
                return null;
            }
        } while (el.parentNode);
        return null;
    },
    findNestedApplications: function (el) {
        return toArray(el.querySelectorAll(conf.ATTR_APP));
    },
    createDomElement: function (html) {
        var dom, container, name;
        if (!html) {
            return doc.createElement("div");
        }
        name = fragmentRE.test(html) && RegExp.$1;
        if (!(name in containers)) {
            name = "*";
        }
        container = containers[name];
        container.innerHTML = "" + html;
        dom = container.childNodes;
        //clear DOM
        var realArray = Array.prototype.slice.call(container.childNodes);
        /*realArray.forEach( function ( node ) {
          container.removeChild( node );
        } );*/
        /*if ( realArray.length === 1 ) {
          dom = realArray[ 0 ];
        }*/
        return realArray;
    },
    addCss: function (cssCode) {
        var styleElement = document.createElement("style");
        styleElement.type = "text/css";
        if (styleElement.styleSheet) {
            styleElement.styleSheet.cssText = cssCode;
        }
        else {
            styleElement.appendChild(document.createTextNode(cssCode));
        }
        document.getElementsByTagName("head")[0].appendChild(styleElement);
    },
    addCloak: function () {
        this.addCss("*[" + conf.cloak + "] { display:none; !important }");
    },
    findMetaLang: function () {
        var lang = document.querySelector("meta[data-sc-name=sitecoreLanguage]");
        if (!lang) {
            return;
        }
        return lang.getAttribute("data-sc-content");
    },
    findMetaCulture: function () {
        var lang = document.querySelector("meta[data-sc-name=sitecoreCultureName]");
        if (!lang) {
            return;
        }
        return lang.getAttribute("data-sc-content");
    },
    findMetaTwoLetterIsoCode: function () {
        var lang = document.querySelector("meta[data-sc-name=sitecoreCultureTwoLetterIsoCode]");
        if (!lang) {
            return;
        }
        return lang.getAttribute("data-sc-content");
    },
    findMetaThreeLetterIsoCode: function () {
        var lang = document.querySelector("meta[data-sc-name=sitecoreCultureThreeLetterIsoCode]");
        if (!lang) {
            return;
        }
        return lang.getAttribute("data-sc-content");
    },
    findAntiForgeryToken: function () {
        var elements = doc.querySelectorAll("input[name=__RequestVerificationToken]");
        if (!elements) {
            return;
        }
        if (elements.length === 0) {
            return;
        }
        return elements[0].value;
    },
    findDatabase: function () {
        var element = doc.querySelector("meta[data-sc-name=sitecoreDatabase]");
        if (!element) {
            return;
        }
        return element.getAttribute("data-sc-content");
    },
    findContentDatabase: function () {
        var element = doc.querySelector("meta[data-sc-name=sitecoreContentDatabase]");
        if (!element) {
            return;
        }
        return element.getAttribute("data-sc-content");
    }
};
module.exports = DOMutils;
//# sourceMappingURL=DOM.js.map
},{"../conf":4,"sc-utils":75}],14:[function(require,module,exports){
var ajaxUtils = {
    get: function (url, complete, ajaxOptions) {
        ajaxOptions = ajaxOptions || {};
        var errorCallback = ajaxOptions.error || function (args) {
            console.log(args);
            complete({
                error: "Something went wrong when loading: " + url
            });
        };
        var completeCallback = complete;
        if (ajaxOptions.complete) {
            completeCallback = function () {
                ajaxOptions.complete.apply(this, arguments);
                complete.apply(this, arguments);
            };
        }
        var successCallback = ajaxOptions.success || function () { };
        var request = new XMLHttpRequest();
        if (ajaxOptions.beforeSend) {
            ajaxOptions.beforeSend(request);
        }
        request.open("GET", url, true);
        request.onload = function () {
            var resp = request.responseText;
            var result;
            if (request.status >= 200 && request.status < 400) {
                result = {
                    result: resp,
                    error: null
                };
                successCallback(result);
                completeCallback(result);
            }
            else {
                result = {
                    result: resp,
                    error: request.status
                };
                errorCallback(result);
            }
        };
        request.onerror = errorCallback;
        request.send();
    }
};
module.exports = ajaxUtils;
//# sourceMappingURL=ajax.js.map
},{}],15:[function(require,module,exports){
var ajaxUtils = require("./ajax");
var DOM = require("./DOM");
var scUtils = require("sc-utils");
var app = {
    closeDialog: function (returnValue) {
        window.top.returnValue = returnValue;
        window.top.dialogClose(returnValue);
    },
    remove: function (el) {
        if (scUtils.is.a.string(el)) {
            el = this.el.querySelector(el);
        }
        el = el || this.el;
        var parentApp = this, component = [], removeApp = function (appEl) {
            var byElement = function (appObject) {
                return appEl === appObject.el;
            }, rejectByElement = function (element) {
                return !byElement(element);
            }, appObj = scUtils.array.find(parentApp.children, byElement);
            if (appObj) {
                appObj.remove();
                parentApp.children = parentApp.children.filter(rejectByElement);
            }
        }, removeComponent = function (compEl) {
            var byUniqueId = function (compObject) {
                return compEl.__domID === compObject.__domID;
            }, rejectById = function (comp) {
                return !byUniqueId(comp);
            }, compObj = scUtils.array.find(parentApp.components, byUniqueId);
            if (compObj) {
                if (compObj.destroy) {
                    compObj.destroy();
                }
                var fromApp = parentApp[compObj.id];
                if (fromApp) {
                    if (scUtils.is.an.array(fromApp)) {
                        parentApp[compObj.id] = parentApp[compObj.id].filter(rejectById);
                    }
                    else {
                        delete parentApp[compObj.id];
                    }
                }
                parentApp.components = parentApp.components.filter(rejectById);
            }
        };
        //remove applications
        var apps = DOM.findApps(el);
        if (apps) {
            apps.forEach(removeApp);
        }
        var comps = DOM.findComponents(el);
        if (comps) {
            comps.forEach(removeComponent);
        }
        el.innerHTML = ""; //empty the HTML element
        return parentApp;
    },
    sendMessage: function (returnValue) {
        window.top.receiveMessage(returnValue, root.getParameterByName("sp"));
    },
    findComponent: function (componentName) {
        var componentLenght = 0, components = this.components, nestedApps = this.children, result, found;
        components.forEach(function (comp) {
            if (!found && (comp.id === componentName)) {
                found = true;
                result = comp;
            }
        });
        if (!result && nestedApps && nestedApps.length) {
            nestedApps.forEach(function (app) {
                if (!found) {
                    result = app.findComponent(componentName);
                    found = true;
                }
            });
        }
        return result;
    },
    findApplication: function (appName) {
        var result, found, nestedApps = this.children || [];
        if (!appName) {
            return null;
        }
        if (this.key === appName) {
            return this;
        }
        else {
            nestedApps.forEach(function (app) {
                if (!found) {
                    var res = app.findApplication(appName);
                    if (res) {
                        found = true;
                        result = res;
                    }
                }
            });
        }
        return result;
    },
    replace: function (config, callback) {
        config.el = scUtils.is.a.string(config.el) ? this.el.querySelector(config.el) : config.el;
        config.el = config.el || this.el;
        this.remove(config.el);
        this.inject(config, callback);
    },
    append: function (config, callback) {
        if (scUtils.is.an.object(config)) {
            config.el = scUtils.is.a.string(config.el) ? this.el.querySelector(config.el) : config.el;
            config.el = config.el || this.el;
        }
        else {
            config = {
                html: config,
                el: this.el
            };
        }
        config.append = true;
        this.inject(config, callback);
    },
    prepend: function (config, callback) {
        if (scUtils.is.an.object(config)) {
            config.el = scUtils.is.a.string(config.el) ? this.el.querySelector(config.el) : config.el;
            config.el = config.el || this.el;
        }
        else {
            config = {
                html: config,
                el: this.el
            };
        }
        config.prepend = true;
        this.inject(config, callback);
    },
    replaceRendering: function (itemId, options, cb) {
        // First recursively remove all child elements
        this.remove(options.el);
        // Insert new child elements
        this.insertRendering(itemId, options, cb);
    },
    insertRendering: function (itemId, options, cb) {
        var item, _sc = Sitecore.Speak, that = this, selector, $el, queryStringLang = "", langFromDom = DOM.findMetaLang(), lang = langFromDom ? langFromDom : "", database = "core", defaultOptions = {
            contentDabase: "",
            database: database,
            domainName: "",
            path: "/sitecore/shell/api/sitecore/Layout/RenderItem",
            lang: lang,
            ajax: {},
            parameter: void 0
        };
        if (scUtils.is.a.function(options)) {
            cb = options;
        }
        else if (options) {
            defaultOptions = scUtils.object.extend(defaultOptions, options);
        }
        if (!defaultOptions.name) {
            defaultOptions.name = void 0; //we let it to undefined;
        }
        if (defaultOptions.lang) {
            queryStringLang = "&sc_lang=" + lang;
        }
        var urlToCall = defaultOptions.path + "?sc_itemid=" + itemId + "&sc_database=" + defaultOptions.database + queryStringLang;
        if (defaultOptions.contentDabase) {
            urlToCall = urlToCall + "&sc_content=" + defaultOptions.contentDabase;
        }
        if (defaultOptions.parameter) {
            if (scUtils.is.a.string(defaultOptions.parameter)) {
                urlToCall += "&" + defaultOptions.parameter;
            }
            else {
                for (var key in defaultOptions.parameter) {
                    if (defaultOptions.parameter.hasOwnProperty(key)) {
                        urlToCall += "&" + key + "=" + defaultOptions.parameter[key];
                    }
                }
            }
        }
        if (defaultOptions.domainName) {
            urlToCall = defaultOptions.domainName + urlToCall;
        }
        ajaxUtils.get(urlToCall, function (data) {
            that.insertMarkups(data.result, defaultOptions, cb);
        }, options.ajax);
    },
    insertMarkups: function (html, options, cb) {
        var defaultOptions = {
            prepend: false,
            el: options.el,
            html: html
        };
        defaultOptions = scUtils.object.extend(defaultOptions, options);
        if (!defaultOptions.el) {
            if (defaultOptions.selector) {
                defaultOptions.el = document.querySelector(options.selector);
            }
            else {
                defaultOptions.el = document.body;
            }
        }
        this.inject(defaultOptions, cb);
    },
    parse: function (el, callback) {
        var defaultOptions = {
            parse: true,
            el: el
        };
        this.inject(defaultOptions, callback);
    }
};
module.exports = app;
//# sourceMappingURL=app.js.map
},{"./DOM":13,"./ajax":14,"sc-utils":75}],16:[function(require,module,exports){
var propertyHelper = require("../utils/propertyHelper");
var scUtils = require("sc-utils");
var index_1 = require("../../../bootJS-factories/src/index");
var propertyFactory = new index_1.PropertyFactory(scUtils);
var PropertyEvent = (function () {
    function PropertyEvent(property, modifier) {
        if (!modifier) {
            modifier = "change";
        }
        this.eventName = modifier + ":" + property;
    }
    return PropertyEvent;
})();
var Class = function (propertyStore) {
    return {
        get: function (propertyName) {
            propertyName = scUtils.is.capitalize(propertyName) ? propertyName : scUtils.string.capitalize(propertyName);
            var value = this.__properties[propertyName];
            if (value && value.__type === "Property") {
                return value.get(propertyName);
            }
            else {
                return value;
            }
        },
        set: function (propertyName, newValue, silent) {
            propertyName = scUtils.is.capitalize(propertyName) ? propertyName : scUtils.string.capitalize(propertyName);
            var property = this.__properties[propertyName], beforeChangeComputedValues = this.__getComputedValues(), isNew;
            if (property && property.__type === "Property" && property.isNew) {
                isNew = property.isNew(newValue);
            }
            else {
                isNew = property !== newValue;
            }
            if (isNew) {
                if (!silent) {
                    this.trigger("beforeChange:" + propertyName, this.get(propertyName), new PropertyEvent(propertyName, "beforeChange"));
                }
                if (property && property.__type === "Property") {
                    property.set(newValue);
                }
                else {
                    this.__properties[propertyName] = newValue;
                }
                if (!silent) {
                    this.__triggerForComputed(beforeChangeComputedValues);
                    this.trigger("change:" + propertyName, this.get(propertyName), new PropertyEvent(propertyName));
                }
            }
        },
        __getComputedValues: function () {
            var result = {}, self = this;
            if (!this.computed) {
                return;
            }
            var keys = Object.keys(this.computed);
            keys.forEach(function (key) {
                result[key] = self[key];
            });
            return result;
        },
        __triggerForComputed: function (currentValues) {
            if (!this.computed) {
                return;
            }
            var self = this, keys = Object.keys(this.computed);
            keys.forEach(function (key) {
                if (this[key] !== currentValues[key]) {
                    this.trigger("change:" + scUtils.string.capitalize(key), this.get(key), new PropertyEvent(key));
                }
            }, this);
        },
        defineProperties: function () {
            this.__properties = this.__properties || {};
            for (var i in this.__parameterTemplates) {
                if (propertyHelper.isProperty(this.__parameterTemplates, i)) {
                    this.defineProperty(i, this.__parameterTemplates[i]);
                }
            }
            if (this.properties) {
                for (var key in this.properties) {
                    if (!this.__properties[scUtils.string.capitalize(key)]) {
                        var value = this.properties[key];
                        if (scUtils.is.a.function(value)) {
                            this.defineComputedProperty(key, value);
                        }
                        else if (scUtils.is.a.object(value) && scUtils.is.a.function(value.get) && scUtils.is.a.function(value.set)) {
                            this.definePureComputedProperty(key, value);
                        }
                        else {
                            this.defineProperty(key, value);
                        }
                    }
                }
            }
        },
        defineProperty: function (propertyName, value) {
            var comp = this, initial = value, metaProperty = propertyHelper.getCustomType(propertyName), propertyDef = metaProperty.type ? propertyStore.find(metaProperty.type) : void 0;
            var p = metaProperty.type ? metaProperty.property : propertyName;
            if (metaProperty.type) {
                var Property = propertyFactory.make(propertyDef);
                this.__properties[scUtils.string.capitalize(p)] = new Property(initial, this, propertyName);
            }
            else {
                this.__properties[scUtils.string.capitalize(p)] = initial;
            }
            Object.defineProperty(this, p, {
                get: function () {
                    return comp.get(p);
                },
                set: function (newValue) {
                    comp.set(p, newValue);
                },
                enumerable: true
            });
        },
        defineComputedProperty: function (name, getter) {
            var self = this;
            if (!scUtils.is.a.string(name)) {
                throw "please provide a valid name";
            }
            if (!scUtils.is.a.function(getter)) {
                throw "please provide a valid name";
            }
            this.computed = this.computed || {};
            this.computed[name] = {
                read: getter
            };
            Object.defineProperty(this, name, {
                get: function () {
                    return self.computed[name].read.call(self);
                },
                set: function () {
                    throw "this is a readonly property";
                }
            });
        },
        definePureComputedProperty: function (name, getterAndSetter) {
            var self = this;
            if (!scUtils.is.a.string(name)) {
                throw "please provide a valid name";
            }
            if (!scUtils.is.an.object(getterAndSetter) && !scUtils.is.an.function(getterAndSetter.set) && !scUtils.is.an.function(getterAndSetter.get)) {
                throw "please provide a valid name";
            }
            this.computed = this.computed || {};
            this.computed[name] = {
                read: getterAndSetter.get,
                write: getterAndSetter.set
            };
            Object.defineProperty(this, name, {
                get: function () {
                    return self.computed[name].read.call(self);
                },
                set: function () {
                    var value = self.computed[name].read.call(self);
                    this.trigger("beforeChange:" + name, value, new PropertyEvent(name, "beforeChange"));
                    self.computed[name].write.apply(self, arguments);
                    this.trigger("change:" + name, self.computed[name].read.call(self), new PropertyEvent(name));
                }
            });
        }
    };
};
module.exports = Class;
//# sourceMappingURL=class.js.map
},{"../../../bootJS-factories/src/index":2,"../utils/propertyHelper":25,"sc-utils":75}],17:[function(require,module,exports){
var DOMHelper = require("./DOM");
var language, database, contentDatabase, cultureName, twoLetterIsoCode, threeLetterIsoCode;
var context = {
    current: function () {
        language = language || DOMHelper.findMetaLang();
        database = database || DOMHelper.findDatabase();
        contentDatabase = contentDatabase || DOMHelper.findContentDatabase();
        language = language || DOMHelper.findMetaLang();
        database = database || DOMHelper.findDatabase();
        contentDatabase = contentDatabase || DOMHelper.findContentDatabase();
        cultureName = cultureName || DOMHelper.findMetaCulture();
        twoLetterIsoCode = DOMHelper.findMetaTwoLetterIsoCode() || cultureName;
        threeLetterIsoCode = DOMHelper.findMetaThreeLetterIsoCode() || cultureName;
        return {
            language: language,
            database: database,
            contentDatabase: contentDatabase,
            cultureName: cultureName,
            twoLetterIsoCode: twoLetterIsoCode,
            threeLetterIsoCode: threeLetterIsoCode
        };
    }
};
module.exports = context;
//# sourceMappingURL=context.js.map
},{"./DOM":13}],18:[function(require,module,exports){
var deferevent_1 = require("../events/deferevent");
var DeferEvents = (function () {
    function DeferEvents() {
    }
    DeferEvents.triggerDeferredEvent = function (eventName, value) {
        var deferEvent = new deferevent_1.DeferEvent(eventName, value);
        // TODO: use inheritance instead to ensure the availability of trigger method
        this.trigger(deferEvent.eventName, deferEvent);
        return Promise.all(deferEvent.listOfDeferred);
    };
    return DeferEvents;
})();
exports.DeferEvents = DeferEvents;
//# sourceMappingURL=deferEvents.js.map
},{"../events/deferevent":5}],19:[function(require,module,exports){
module.exports=require(18)
},{"../events/deferevent":5}],20:[function(require,module,exports){
/**
 * A deferred represents work that is not yet finished whereas a Promise represents a value that is not yet defined.
 * Therefore a deferred _has a_ Promise.
 *
 * Please consider using Promise class instead of a Deferred object, as Deferred is often considered an anti-pattern to promises.
 * See also (Promise anti-patterns)[https://github.com/petkaantonov/bluebird/wiki/Promise-anti-patterns] for more information.
 */
var Deferred = (function () {
    function Deferred() {
        this.promise = new Promise(function (resolve, reject) {
            this.resolve = resolve;
            this.reject = reject;
        }.bind(this));
    }
    return Deferred;
})();
exports.Deferred = Deferred;
//# sourceMappingURL=deferred.js.map
},{}],21:[function(require,module,exports){
/* jshint forin: false, loopfunc: true */
/* Events from backbonejs */
var scUtils = require("sc-utils");
var eventSplitter = /\s+/;
var triggerEvents = function (events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
        case 0:
            while (++i < l) {
                (ev = events[i]).callback.call(ev.ctx);
            }
            return;
        case 1:
            while (++i < l) {
                (ev = events[i]).callback.call(ev.ctx, a1);
            }
            return;
        case 2:
            while (++i < l) {
                (ev = events[i]).callback.call(ev.ctx, a1, a2);
            }
            return;
        case 3:
            while (++i < l) {
                (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
            }
            return;
        default:
            while (++i < l) {
                (ev = events[i]).callback.apply(ev.ctx, args);
            }
    }
};
var eventsApi = function (obj, action, name, rest) {
    if (!name) {
        return true;
    }
    if (typeof name === "object") {
        for (var key in name) {
            obj[action].apply(obj, [key, name[key]].concat(rest));
        }
        return false;
    }
    if (eventSplitter.test(name)) {
        var names = name.split(eventSplitter);
        for (var i = 0, l = names.length; i < l; i++) {
            var evtName = names[i];
            evtName = evtName.split(":");
            evtName[1] = scUtils.string.capitalize(evtName[1]);
            obj[action].apply(obj, [evtName.join(":")].concat(rest));
        }
        return false;
    }
    return true;
};
/**
 * @class Events
 */
var Events = {
    /**
     * On
     * @method on
     * @static
     */
    on: function (name, callback, context) {
        if (!eventsApi(this, "on", name, [callback, context]) || !callback) {
            return this;
        }
        this._events || (this._events = {});
        if (name.indexOf(":") > 0) {
            var evtArr = name.split(":");
            evtArr[1] = scUtils.string.capitalize(evtArr[1]);
            name = evtArr.join(":");
        }
        var events = this._events[name] || (this._events[name] = []);
        events.push({
            callback: callback,
            context: context,
            ctx: context || this
        });
        return this;
    },
    /** Once
     * @method once
     * @static
     */
    once: function (name, callback, context) {
        if (!eventsApi(this, "once", name, [callback, context]) || !callback) {
            return this;
        }
        var self = this;
        var once = scUtils.function.once(function () {
            self.off(name, once);
            callback.apply(this, arguments);
        });
        once._callback = callback;
        return this.on(name, once, context);
    },
    /**
     * Off
     * @method off
     * @static
     */
    off: function (name, callback, context) {
        var retain, ev, events, names, i, l, j, k;
        if (!this._events || !eventsApi(this, "off", name, [callback, context])) {
            return this;
        }
        if (!name && !callback && !context) {
            this._events = {};
            return this;
        }
        if (name.indexOf(":") > 0) {
            var evtArr = name.split(":");
            evtArr[1] = scUtils.string.capitalize(evtArr[1]);
            name = evtArr.join(":");
        }
        names = name ? [name] : Object.keys(this._events);
        for (i = 0, l = names.length; i < l; i++) {
            name = names[i];
            if (events = this._events[name]) {
                this._events[name] = retain = [];
                if (callback || context) {
                    for (j = 0, k = events.length; j < k; j++) {
                        ev = events[j];
                        if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                            (context && context !== ev.context)) {
                            retain.push(ev);
                        }
                    }
                }
                if (!retain.length) {
                    delete this._events[name];
                }
            }
        }
        return this;
    },
    /**
     * Trigger events
     * @method trigger
     * @static
     */
    trigger: function (name) {
        if (!this._events) {
            return this;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        //when you have change:Text, you need to trigger 2 events. 
        //One is the specific event ( change:Text ) and the other is the broader scope
        //in this case,'change'.
        var broaderScopeEventName;
        if (!eventsApi(this, "trigger", name, args)) {
            return this;
        }
        if (name.indexOf(":") > 0) {
            var evtArr = name.split(":");
            broaderScopeEventName = evtArr[0];
        }
        var events = this._events[name];
        if (events) {
            triggerEvents(events, args);
        }
        if (broaderScopeEventName) {
            var broaderScopeEvents = this._events[broaderScopeEventName];
            if (broaderScopeEvents) {
                triggerEvents(broaderScopeEvents, args);
            }
        }
        return this;
    },
    stopListening: function (obj, name, callback) {
        var listeningTo = this._listeningTo;
        if (!listeningTo) {
            return this;
        }
        var remove = !name && !callback;
        if (!callback && typeof name === "object") {
            callback = this;
        }
        if (obj) {
            (listeningTo = {})[obj._listenId] = obj;
        }
        for (var id in listeningTo) {
            obj = listeningTo[id];
            obj.off(name, callback, this);
            if (remove || Object.keys(obj._events) === 0) {
                delete this._listeningTo[id];
            }
        }
        return this;
    }
};
/*
 * Credit to Backbone source code, please find it here:
 * http://backbonejs.org/docs/backbone.html
 */
var listenMethods = {
    /**
     * listenTo
     * @method listenTo
     * @static
     */
    listenTo: "on",
    /**
     * listenToOnce
     * @method listenToOnce
     * @static
     */
    listenToOnce: "once"
};
//TODO: verify if implemtnation and method are well defined, see backbone source code
for (var i in listenMethods) {
    var implementation = listenMethods[i], method = i;
    Events[method] = function (obj, name, callback) {
        var listeningTo = this._listeningTo || (this._listeningTo = {});
        var id = obj._listenId || (obj._listenId = scUtils.string.uniqueId("l"));
        listeningTo[id] = obj;
        if (!callback && typeof name === "object") {
            callback = this;
        }
        obj[implementation](name, callback, this);
        return this;
    };
}
module.exports = Events;
//# sourceMappingURL=events.js.map
},{"sc-utils":75}],22:[function(require,module,exports){
/* jshint forin:false */
var conf = require("../conf");
var scUtils = require("sc-utils");
var security = require("./security");
var arrayProto = Array.prototype, nativeForEach = arrayProto.forEach, nativeSlice = arrayProto.slice, xhr = function (obj) {
    var type = obj.type, url = obj.url, data = obj.data, cb = obj.cb;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open(type, url, true);
    if (type.toLowerCase() === "post") {
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
    xmlHttp.send(type === "post" ? JSON.stringify(data) : null);
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200 || xmlHttp.status === 0 /*remove this*/) {
                cb(xmlHttp.responseText);
            }
            else {
                console.log("Error: " + xmlHttp.responseText);
            }
        }
    };
}, scriptLoadError = function () {
    console.log(arguments);
}, attachScript = function (url, cb) {
    var script = document.createElement("script");
    script.src = url;
    script.onload = function () {
        cb();
    };
    script.onerror = scriptLoadError;
    (document.head || document.getElementsByTagName("head")[0]).appendChild(script);
}, extractProperties = function (def) {
    var initialValues = {};
    for (var i in def) {
        if (def.hasOwnProperty(i)) {
            var property = def[i];
            if (typeof proto !== "function") {
                initialValues[i] = property;
            }
        }
    }
    return initialValues;
}, extractProto = function (def) {
    var protoprops = {};
    for (var i in def) {
        var proto = def[i];
        if (typeof proto === "function" && i !== "initialize" && i !== "constructor") {
            protoprops[i] = proto;
        }
    }
    return protoprops;
}, initializeProperties = function (obj, properties) {
    for (var i in properties) {
        if (properties.hasOwnProperty(i) && !scUtils.is.a.function(properties[i])) {
            obj[i] = properties[i];
        }
    }
}, 
/**
 * Build the request for bundled file
 * eg. /-/speak/v1/bundles/bundle.js?f=/-/speak/v1/business/button.js,/-/speak/v1/business/text.js
 * @param  {[type]} types [description]
 * @return {[type]}       [description]
 */
buildModRequest = function (types) {
    var request = conf.ROOTSTATICURL ? conf.ROOTSTATICURL : (window.location.origin + "/"), mod = "/-/speak/v1/bundles/bundle.js?d=0&c=1&n=1&f=";
    return [request + mod + types.join(",").toLowerCase()];
}, createTree = function (flatArray, k, expose) {
    var number = flatArray.length, tree = [], key = k ? k : "key", node, map = {}, roots = [];
    for (var j = 0; j < number; j++) {
        map[flatArray[j][key]] = j;
        flatArray[j].children = [];
    }
    for (var i = 0; i < number; i++) {
        node = flatArray[i];
        if (node.parent) {
            var parentKey = map[node.parent];
            if (parentKey !== void 0) {
                var parent = flatArray[parentKey];
                node.parent = parent ? parent : void 0;
                if (parent) {
                    var c = node.PageCodeObject || node;
                    parent.children.push(c);
                    if (expose) {
                        if (parent[c[k]]) {
                            throw new Error("Conflicting id for " + k + " in object " + c.id);
                        }
                        parent[c[k]] = c;
                    }
                }
            }
        }
        else {
            roots.push(node.PageCodeObject || node);
        }
    }
    return roots;
}, removeFileExtensionIfNeeded = function (str) {
    str = str.trim();
    if (/.js$/i.test(str)) {
        str = str.slice(0, -3);
    }
    return str;
};
var utils = {
    attachScript: attachScript,
    extractProto: extractProto,
    xhr: xhr,
    extractProperties: extractProperties,
    initializeProperties: initializeProperties,
    buildModRequest: buildModRequest,
    createTree: createTree,
    removeFileExtensionIfNeeded: removeFileExtensionIfNeeded,
    security: security
};
module.exports = utils;
//# sourceMappingURL=index.js.map
},{"../conf":4,"./security":26,"sc-utils":75}],23:[function(require,module,exports){
/*jshint loopfunc: true */
var scUtils = require("sc-utils");
var extend = function (obj) {
    if (!scUtils.is.an.object(obj)) {
        return obj;
    }
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
        source = arguments[i];
        for (prop in source) {
            if (hasOwnProperty.call(source, prop)) {
                obj[prop] = source[prop];
            }
        }
    }
    return obj;
};
var inheritance = {
    wrap: function (Presenter, componentDefinition) {
        var component = (function (_ctor) {
            return function () {
                _ctor.apply(this, arguments); //closure
            };
        })(Presenter.prototype.constructor);
        for (var j in Presenter.prototype) {
            if (Presenter.prototype.hasOwnProperty(j)) {
                component.prototype[j] = Presenter.prototype[j];
            }
        }
        if (componentDefinition.prototype) {
            componentDefinition = componentDefinition.prototype;
        }
        for (var i in componentDefinition) {
            if (component.prototype[i] && scUtils.is.a.function(componentDefinition[i])) {
                component.prototype[i] = (function (_presenter, _component) {
                    return function () {
                        _component.apply(this, arguments);
                        _presenter.apply(this, arguments);
                    };
                }(Presenter.prototype[i], componentDefinition[i]));
            }
            else {
                component.prototype[i] = componentDefinition[i];
            }
        }
        return component;
    },
    extend: extend
};
module.exports = inheritance;
//# sourceMappingURL=inheritance.js.map
},{"sc-utils":75}],24:[function(require,module,exports){
/*jshint loopfunc: true */
var DOM = require("./DOM");
var inject = function (loader, parser, stores) {
    var htmlToBeInjected = [];
    var isInjecting = false;
    return {
        setupInjectMethod: function (appManager) {
            var inject = function (config, appFromArg, callback) {
                var app = appFromArg, el = config.el, html = config.html, append = config.append, replace = config.replace, parse = config.parse, prepend = config.prepend, context = config.context, appName = config.name;
                var exposeApp = function (apps, exposed) {
                    if (exposed) {
                        app.children = app.children || [];
                        app.children = app.children.concat(exposed);
                    }
                    if (callback) {
                        callback(app);
                    }
                    app.trigger("change", app);
                };
                if (!append && !prepend && !replace && !parse) {
                    append = true;
                }
                if (!app || !el || !(html || parse)) {
                    throw new Error("incorrect parameter passed");
                }
                if (parse) {
                    stores.build(parser.parse(el));
                    loader.load(stores, function () {
                        stores.markAsLoaded();
                        appManager.start(context, exposeApp);
                    });
                    return;
                }
                if (appName) {
                    html = "<div data-sc-app=\"" + appName + "\">" + html + "</div>";
                }
                //el.style.display = 'none';
                var emptyDiv = DOM.createDomElement(), elements = DOM.createDomElement(html);
                elements.forEach(function (nodeElement) {
                    emptyDiv.appendChild(nodeElement);
                });
                if (append || replace) {
                    if (replace) {
                        el.innerHTML = "";
                    }
                    elements.forEach(function (nodeElement) {
                        el.appendChild(nodeElement);
                    });
                }
                else {
                    elements.reverse().forEach(function (nodeElement) {
                        el.parentNode.insertBefore(nodeElement, el);
                    });
                }
                var allElements = parser.parse(el); //this is parsing
                stores.build(allElements);
                loader.load(stores, function () {
                    stores.markAsLoaded();
                    appManager.start(context, exposeApp);
                });
            };
            var startInjecting = function () {
                isInjecting = true;
                var conf = htmlToBeInjected.shift();
                var done = function () {
                    if (conf.callback) {
                        conf.callback.apply(this, arguments);
                    }
                    if (htmlToBeInjected.length > 0) {
                        startInjecting();
                    }
                    else {
                        isInjecting = false;
                    }
                };
                inject(conf.config, conf.app, done);
            };
            setInterval(function () {
                if (htmlToBeInjected.length > 0 && !isInjecting) {
                    startInjecting();
                }
            }, 100);
            return function (config, callback) {
                htmlToBeInjected.push({ config: config, callback: callback, app: this });
            };
        }
    };
};
module.exports = inject;
//# sourceMappingURL=inject.js.map
},{"./DOM":13}],25:[function(require,module,exports){
var excludes = [], isObject = function (obj) {
    return obj === Object(obj);
}, isValidProperty = function (obj, i) {
    var value = obj[i], isExclude, type;
    excludes.forEach(function (excludeKey) {
        if (excludeKey === i) {
            isExclude = true;
        }
    });
    if (isExclude) {
        return false;
    }
    if (!value) {
        //if the property does not have any value, we force it to be a string
        //if we do not do this 
        value = "";
    }
    type = value.toString();
    if (Array.isArray(value)) {
        return true;
    }
    return (!isObject(value) && type !== "[object Function]" && type !== "[object RegExp]");
};
var propertyHelper = {
    isProperty: function (obj, i, ex) {
        excludes = ex || [];
        return (obj.hasOwnProperty(i) && isValidProperty(obj, i));
    },
    getCustomType: function (property) {
        if (property.indexOf(":") === -1) {
            return {
                type: void 0,
                property: property
            };
        }
        return {
            type: property.split(":")[1],
            property: property.split(":")[0]
        };
    }
};
module.exports = propertyHelper;
//# sourceMappingURL=propertyHelper.js.map
},{}],26:[function(require,module,exports){
var DOMHelper = require("./DOM");
var antiForgeryTokenValue, formKey = "__RequestVerificationToken";
var security = {
    antiForgery: {
        getAntiForgeryToken: function () {
            antiForgeryTokenValue = antiForgeryTokenValue || DOMHelper.findAntiForgeryToken();
            return {
                formKey: formKey,
                headerKey: "X-RequestVerificationToken",
                value: antiForgeryTokenValue
            };
        }
    }
};
module.exports = security;
//# sourceMappingURL=security.js.map
},{"./DOM":13}],27:[function(require,module,exports){
var version = "2.0.52";
module.exports = version;
//# sourceMappingURL=version.js.map
},{}],28:[function(require,module,exports){
/// <reference path='../typings/globalize/globalize.d.ts' />
/**
     * Wrapper Class for Globalize which setup the culture for SPEAK and interface the methods needed by SPEAK,
     * pageCodes and plugins.
     *
     * ## Usage
     * ```javascript
     * import { SpeakGlobalize } from "bootjs-globalize/src/index";
     *
     * var speakGlobalize = new SpeakGlobalize( Globalize );
     * speakGlobalize.load( [gregorianTextCode, numberTextCode, timezoneTextCode, likelySubTag, timeData, weekData ], 'fr' );
     * speakGlobalize.parseDate("11/30/2010");
     * ```
*/
var SpeakGlobalize = (function () {
    function SpeakGlobalize(globalize, globalObjectCultureApi, currentCulture) {
        this.DEFAULT_CULTURE = "en";
        if (!globalize && !globalObjectCultureApi) {
            console.log("invalid parameter passed to SpeakGlobalize constructor - culture won't work");
        }
        this.globalize = globalize;
        this.globalObjectCultureApi = globalObjectCultureApi;
        this.currentCulture = currentCulture || this.DEFAULT_CULTURE;
        if (globalObjectCultureApi && globalObjectCultureApi.length > 0) {
            this.globalize.load(globalObjectCultureApi);
            this.globalize.locale(this.currentCulture);
        }
    }
    /**
     * This method allows you to load CLDR JSON locale data. Globalize.load() is a proxy to Cldr.load().
     *
     *```javascript
     * speakGlobalize.load( [gregorianTextCode, numberTextCode, timezoneTextCode, likelySubTag, timeData, weekData ], 'fr' );
     * speakGlobalize.parseDate("11/30/2010");
     * ```
     */
    SpeakGlobalize.prototype.load = function (cldrJSONData, culture) {
        return this.globalize.load.apply(this.globalize, arguments);
    };
    /**
     * Set default locale, or get it if locale argument is omitted.
     * More information: https://github.com/jquery/globalize/blob/master/doc/api/core/locale.md
     *```javascript
     * speakGlobalize.locale( 'pt' );
     * speakGlobalize.locale();
     * // > {
     * //   attributes: {
     * //      "languageId": "pt",
     * //      "maxLanguageId": "pt_Latn_BR",
     * //       "language": "pt",
     * //      "script": "Latn",
     * //      "territory": "BR",
     * //      "region": "BR"
     * //   },
     * //   some more stuff...
     * ```
    */
    SpeakGlobalize.prototype.locale = function (locale) {
        return this.globalize.locale.apply(this.globalize, arguments);
    };
    /**
     * Build the culture needed by SPEAK based on the CLR-Data coming from the Globalize project.
     * SpeakGlobalize can build any culture if you provide him the necessary information.
     * For more informatio around CLR-Data, you can find them here: https://github.com/jquery/globalize#2-cldr-content
     *
     * Please note, the minimal culture object consists on the:
     *
     * 1. Gregorian Text Code - needed for parsing and formating the dates
     * 2. Number Text Code - needed for parsing and formating numbers and dates.
     * 3. Timezone Text Code - needed for parsing and formating dates.
     * 4. Likely SubTag - needed by the CORE Globalize Module.
     * 5. Time Data - needed for parsing and formating dates.
     * 6. Week Data - needed for parsing and foramting dates.
     *
     * The order of which the culture information are passed to the build method is not important.
    */
    SpeakGlobalize.prototype.changeCulture = function (globalObjectCultureApi, currentCulture) {
        if (!globalObjectCultureApi) {
            console.log('Invalid parameter passed to build method');
        }
        if (currentCulture) {
            this.currentCulture = currentCulture;
        }
        this.globalObjectCultureApi = globalObjectCultureApi;
        if (globalObjectCultureApi.length === 0) {
            console.log("No Culture Api was provided");
        }
        else {
            this.globalize.load(globalObjectCultureApi);
            this.globalize.locale(this.currentCulture || "en");
        }
    };
    /**
     * Return a function that formats a date according to the given options.
     * The default formatting is numeric year, month, and day (i.e., { skeleton: "yMd" }.
     *
     * ```javascript
     * .dateFormatter()( new Date() )
     * // > "11/30/2010"
     * ```
     *
     * ```javascript
     * .dateFormatter({ skeleton: "GyMMMd" })( new Date() )
     * // > "Nov 30, 2010 AD"
     *  ```
     *
     * ```javascript
     * .dateFormatter({ date: "medium" })( new Date() )
     * // > "Nov 1, 2010"
     * ```
     *
     * ```javascript
     * .dateFormatter({ time: "medium" })( new Date() )
     * // > "5:55:00 PM"
     * ```
     *
     * ```javascript
     * .dateFormatter({ datetime: "medium" })( new Date() )
     * // > "Nov 1, 2010, 5:55:00 PM"
     * ```
     *
     * More information: https://github.com/jquery/globalize/blob/master/doc/api/date/date-formatter.md
     */
    SpeakGlobalize.prototype.dateFormatter = function (options) {
        return this.globalize.dateFormatter.apply(this.globalize, arguments);
    };
    /**
     * Return a function that parses a string representing a date into a JavaScript Date object according to the given options. The default parsing assumes numeric year, month, and day (i.e., { skeleton: "yMd" }).
     *
     * ```javascript
     * .dateParser()( "11/30/2010" )
     * // > new Date( 2010, 10, 30, 0, 0, 0 )
     * ```
     *
     * ```javascript
     * .dateParser({ skeleton: "GyMMMd" })( "Nov 30, 2010 AD" )
     * // > new Date( 2010, 10, 30, 0, 0, 0 )
     * ```
     *
     * ```javascript
     * .dateParser({ date: "medium" })( "Nov 1, 2010" )
     * // > new Date( 2010, 10, 30, 0, 0, 0 )
     * ```
     *
     * ```javascript
     * .dateParser({ time: "medium" })( "5:55:00 PM" )
     * // > new Date( 2015, 3, 22, 17, 55, 0 ) // i.e., today @ 5:55PM
     * ```
     *
     * ```javascript
     * .dateParser({ datetime: "medium" })( "Nov 1, 2010, 5:55:00 PM" )
     * // > new Date( 2010, 10, 30, 17, 55, 0 )
     * ```
     *
     * More information: https://github.com/jquery/globalize/blob/master/doc/api/date/date-parser.md
     */
    SpeakGlobalize.prototype.dateParser = function (options) {
        return this.globalize.dateParser.apply(this.globalize, arguments);
    };
    /**
     * Alias for .dateFormatter( [options] )( value ).
     */
    SpeakGlobalize.prototype.formatDate = function (options) {
        return this.globalize.formatDate.apply(this.globalize, arguments);
    };
    /**
     * Alias for .dateParser( [options] )( value ).
     */
    SpeakGlobalize.prototype.parseDate = function (options) {
        return this.globalize.parseDate.apply(this.globalize, arguments);
    };
    /**
     * Prior to using any number methods, you must load cldr/main/{locale}/numbers.json and cldr/supplemental/numberingSystems.json. Read CLDR content if you need more information.
     *
     * You can use the static method Globalize.numberFormatter(), which uses the default locale.
     *
     * ```javascript
     * var formatter;
     * Globalize.locale( "en" );
     * formatter = Globalize.numberFormatter();
     *
     * formatter( 3.141592 );
     * // > "3.142"
     * ```
     *
     * More information: https://github.com/jquery/globalize/blob/master/doc/api/number/number-formatter.md
     */
    SpeakGlobalize.prototype.numberFormatter = function (options) {
        return this.globalize.numberFormatter(options);
    };
    /**
     * Prior to using any number methods, you must load cldr/main/{locale}/numbers.json and cldr/supplemental/numberingSystems.json. Read CLDR content if you need more information.
     *
     * You can use the static method Globalize.numberParser(), which uses the default locale.
     *
     * ```javascript
     * var parser;
     *
     * Globalize.locale( "en" );
     * parser = Globalize.numberParser();
     *
     * parser( "3.14" );
     * // > 3.14
     * ```
     *
     * More information: https://github.com/jquery/globalize/blob/master/doc/api/number/number-parser.md
     */
    SpeakGlobalize.prototype.numberParser = function (options) {
        return this.globalize.numberParser(options);
    };
    /**
     * Alias for .numberFormatter( [options] )( value ).
     */
    SpeakGlobalize.prototype.formatNumber = function (value, options) {
        return this.globalize.formatNumber(value, options);
    };
    /**
     * Alias for .numberParser( [options] )( value ).
     */
    SpeakGlobalize.prototype.parseNumber = function (value, options) {
        return this.globalize.parseNumber(value, options);
    };
    /**
     *Return a function that formats a currency according to the given options or locale's defaults. The returned function is invoked with one argument: the Number value to be formatted.
     *
     * ```javascript
     * var formatter;
     * Globalize.locale( "en" );
     * formatter = Globalize.currencyFormatter( "USD" );
     * formatter( 9.99 );
     * // > "$9.99"
     * ```
     *
     * More information: https://github.com/jquery/globalize/blob/master/doc/api/currency/currency-formatter.md
     */
    SpeakGlobalize.prototype.currencyFormatter = function (currency, options) {
        return this.globalize.currencyFormatter(currency, options);
    };
    /**
     * Alias for .currencyFormatter( [options] )( value ).
     */
    SpeakGlobalize.prototype.formatCurrency = function (value, currency, options) {
        return this.globalize.formatCurrency(value, currency, options);
    };
    return SpeakGlobalize;
})();
exports.SpeakGlobalize = SpeakGlobalize;
//# sourceMappingURL=index.js.map
},{}],29:[function(require,module,exports){
/**
 * Constansts used throughout the utils class inside the bootjs-loader
 * Grouped here for single point of access.
 */
var Config = (function () {
    function Config() {
    }
    Config.ROOT_STATIC_URL = "";
    Config.BUNDLE_QUERY = "/-/speak/v1/bundles/bundle.js?d=0&c=1&n=1&f=";
    return Config;
})();
exports.Config = Config;
//# sourceMappingURL=conf.js.map
},{}],30:[function(require,module,exports){
/// <reference path='../../loaderJS/typings/loaderJS.d.ts' />
var loaderJS = require("loaderJS");
var utils_1 = require("./utils/utils");
/**
  * Loader class is used for loading all the dependencies needed to run the application
  *
  * ## Usage
  * ```javascript
    * import { Loader } from "bootjs-loader/src/index";
  *
  * var loader = new Loader(config);
  * loader.load(stores, callback);
  * ```
  */
var Loader = (function () {
    function Loader(conf) {
        this.bundleSourceInventory = {};
        //initializing the loader function and useBundle flag from the config
        this.useBundle = conf.useBundle,
            this.loaderWorker = conf.loader ? conf.loader : void 0;
        //if the loader function wasn't passed in config object, than the loaderJS.use method should be used
        if (!this.loaderWorker) {
            this.loaderWorker = loaderJS.use;
        }
    }
    Loader.prototype.loadAssets = function (stores, type, callback) {
        var componentkeys = stores.component[type]();
        var pageCodeKeys = stores.pageCode[type]();
        var presenterStoreKeys = stores.presenter[type]();
        var pluginStoreKeys = stores.plugin[type]();
        var definitionStoresKeys = stores.definition[type]();
        var all = [];
        all = all
            .concat(componentkeys)
            .concat(pageCodeKeys)
            .concat(presenterStoreKeys)
            .concat(pluginStoreKeys)
            .concat(definitionStoresKeys);
        if (all.length === 0) {
            return callback();
        }
        if (type !== "deps" && this.useBundle) {
            var totalRequestsForBundle = [], 
            // Keep track of modules loaded by bundles to avoid reloading and more important re-initializing
            getIsLoaded = utils_1.dictionaryContains.bind(null, this.bundleSourceInventory), setIsLoaded = utils_1.saveToDictionary.bind(null, this.bundleSourceInventory, true), 
            // Only make a bundled request for sources that do not require a plugin
            canBundle = utils_1.not(utils_1.isRequirePlugin), canNotBundle = utils_1.isRequirePlugin, 
            // Do not include modules already loaded in another bundle
            shouldBundle = utils_1.not(getIsLoaded), 
            // flat list of sources that is asked to be loaded
            requestedSources = utils_1.flatten(all, ","), 
            // list of sources that can bundle (a.k.a does not require a plugin to load)
            // and should bundle (a.k.a not already loaded in another bundle)
            sourcesThatCanAndShouldBundle = requestedSources.filter(canBundle).filter(shouldBundle);
            if (sourcesThatCanAndShouldBundle.length > 0) {
                sourcesThatCanAndShouldBundle.forEach(setIsLoaded);
                var bundleRequest = utils_1.buildBundleRequest(sourcesThatCanAndShouldBundle);
                totalRequestsForBundle.push(bundleRequest);
            }
            var sourcesThatCanNotBundle = requestedSources.filter(canNotBundle);
            if (sourcesThatCanNotBundle.length > 0) {
                totalRequestsForBundle = totalRequestsForBundle.concat(sourcesThatCanNotBundle);
            }
            return this.loaderWorker(totalRequestsForBundle, function () {
                callback();
            });
        }
        this.loaderWorker(all, callback);
    };
    /**
       * load all the appropriate depedencies needed to create all the applications
       * @param  {Object} All the stores
       * @param  {Function} callback called when done
       */
    Loader.prototype.load = function (stores, callback) {
        this.loadAssets(stores, "scripts", function () {
            this.loadAssets(stores, "deps", callback);
        }.bind(this));
    };
    return Loader;
})();
exports.Loader = Loader;
//# sourceMappingURL=index.js.map
},{"./utils/utils":31,"loaderJS":55}],31:[function(require,module,exports){
var conf_1 = require("../conf");
function buildBundleRequest(types) {
    var request = conf_1.Config.ROOT_STATIC_URL ? conf_1.Config.ROOT_STATIC_URL : (window.location.origin + "/"), mod = conf_1.Config.BUNDLE_QUERY;
    return request + mod + types.join(",").toLowerCase();
}
exports.buildBundleRequest = buildBundleRequest;
function isRequirePlugin(resourceReference) {
    // RequireJS references that contains some text followed by exclamation mark, like "css!path/to/module.css"
    // are treated with plugins (in the example a css plugin)
    return resourceReference.indexOf("!") !== -1;
}
exports.isRequirePlugin = isRequirePlugin;
function not(predicate) {
    return function (key, index, list) {
        return !predicate(key, index, list);
    };
}
exports.not = not;
function dictionaryContains(map, key) {
    return !!map[key];
}
exports.dictionaryContains = dictionaryContains;
function saveToDictionary(map, value, key) {
    map[key] = value;
}
exports.saveToDictionary = saveToDictionary;
function flatten(list, separator) {
    return list.join(separator).split(separator);
}
exports.flatten = flatten;
//# sourceMappingURL=utils.js.map
},{"../conf":29}],32:[function(require,module,exports){
var Conf = (function () {
    function Conf() {
    }
    Conf.CLOAK_ATTR = "data-sc-cloak";
    return Conf;
})();
exports.Conf = Conf;
//# sourceMappingURL=conf.js.map
},{}],33:[function(require,module,exports){
/// <reference path='../../sc-utils/typings/sc-utils.d.ts' />
/// <reference path='../typings/requirejs/require.d.ts' />
var app_1 = require("./manager/app");
exports.AppManager = app_1.AppManager;
var component_1 = require("./manager/component");
exports.ComponentManager = component_1.ComponentManager;
var template_1 = require("./manager/template");
exports.TemplateManager = template_1.TemplateManager;
var plugin_1 = require("./manager/plugin");
exports.PluginManager = plugin_1.PluginManager;
//# sourceMappingURL=index.js.map
},{"./manager/app":34,"./manager/component":35,"./manager/plugin":36,"./manager/template":37}],34:[function(require,module,exports){
var scUtils = require("sc-utils");
var tree_1 = require("../utils/tree");
var lifecycleiterator_1 = require("../utils/lifecycleiterator");
var sortByDepth = scUtils.array.sortByDepth, pageCodeLifeCycle = new lifecycleiterator_1.LifeCycleIterator(["initialize", "initialized", "render"]);
var AppManager = (function () {
    function AppManager(applicationStore, createComponents, applyApplicationPlugin, applicationFactory) {
        this.applicationStore = applicationStore;
        this.createComponents = createComponents;
        this.applyApplicationPlugin = applyApplicationPlugin;
        this.applicationFactory = applicationFactory;
    }
    /**
     * Creates a tree of applications and components.
     * More or less an object representation of the DOM elements.
     * Once the application tree is created an "appLoaded" event is dispatched on each new application object
     * @param dataContext
     * @param callback
     */
    AppManager.prototype.start = function (dataContext, callback) {
        var tree, self = this;
        var apps = sortByDepth(scUtils.object.flatten(this.applicationStore.stores)), exposed = [], freshlyCreatedApps = [];
        if (apps.length > 0) {
            apps.forEach(function (app) {
                if (app.registered) {
                    exposed.push(app);
                    self.createComponents(app, app.el);
                    self.applyApplicationPlugin(app, dataContext);
                    return;
                }
                var applicationFreshlyCreated = self.applicationFactory.createApplication(app, self);
                self.applicationStore.stores[app.key] = applicationFreshlyCreated;
                freshlyCreatedApps.push(applicationFreshlyCreated);
                exposed.push(applicationFreshlyCreated);
                self.createComponents(applicationFreshlyCreated, app.el);
                self.applyApplicationPlugin(applicationFreshlyCreated, dataContext);
            });
            tree = tree_1.Tree.create(exposed, "key");
            pageCodeLifeCycle.runOn(freshlyCreatedApps);
            freshlyCreatedApps.forEach(function (app) {
                self.applyApplicationPlugin(app, dataContext);
            });
        }
        callback(tree, exposed);
        freshlyCreatedApps.forEach(function (freshApp) {
            freshApp.registered = true;
            freshApp.trigger("appLoaded", freshApp);
        });
    };
    return AppManager;
})();
exports.AppManager = AppManager;
//# sourceMappingURL=app.js.map
},{"../utils/lifecycleiterator":42,"../utils/tree":43,"sc-utils":75}],35:[function(require,module,exports){
var conf_1 = require("../conf");
var scUtils = require("sc-utils");
var tree_1 = require("../utils/tree");
var class_1 = require("../utils/class");
var lifeCycleIterator_1 = require("../utils/lifeCycleIterator");
var isAFunction = scUtils.is.a.function;
function executeMethod(method, app, isPreInit) {
    return function (c) {
        if (c[method]) {
            if (isPreInit) {
                c[method](c);
            }
            else {
                c[method]();
            }
        }
    };
}
var ComponentManager = (function () {
    function ComponentManager(componentParser, lifeCycle, definitionStore, presenterStore, componentFactory, _s) {
        this.componentParser = componentParser;
        this.lifeCycle = lifeCycle;
        this.definitionStore = definitionStore;
        this.presenterStore = presenterStore;
        this.componentFactory = componentFactory;
        this._s = _s;
    }
    ComponentManager.prototype.getInitialValue = function (comp, def) {
        var init = comp.properties || {}, properties = class_1.ClassUtils.extractProperties(def);
        //set property from the definition
        for (var i in properties) {
            if (properties.hasOwnProperty(i)) {
                init[i] = properties[i];
            }
        }
        //override properties from the component
        for (var j in comp) {
            if (comp.hasOwnProperty(j)) {
                init[j] = comp[j];
            }
        }
        return init;
    };
    ComponentManager.prototype.initializeComponents = function (components, app) {
        var result = [];
        components.forEach(function (c) {
            var cObject = this.exposeComponent(c, app);
            if (!cObject) {
                return;
            }
            //remove cloak
            if (cObject.el.hasAttribute(conf_1.Conf.CLOAK_ATTR)) {
                cObject.el.removeAttribute(conf_1.Conf.CLOAK_ATTR);
            }
            result.push(cObject);
            if (cObject.parent && !cObject.depricated) {
                return;
            }
            var current = app[cObject.id];
            if (current) {
                if (scUtils.is.an.array(current)) {
                    current.push(cObject);
                }
                else {
                    app[cObject.id] = [current, cObject];
                }
            }
            else {
                app[cObject.id] = cObject;
            }
        }, this);
        return result;
    };
    /**
     * Find a definition in the definition store.
     * If definition is a callback function it executes the callback and passes the loaded dependency.
     * A component constructor is then created extending the definition object.
     * A new instance is initialized from the newly created constructor.
     * New instance is applied several system properties by SPEAK which includes the following:
     * - id
     * - __domID
     * - type
     * - name
     * - el
     * - app
     * - parent
     * - template
     * - isComposite
     *
     * On top of that the DOM element associated with the instance is marked as registered
     * by applying the flags:
     * - __speak (set to true)
     * - __domID
     *
     * A DOM element can only be used once, per instance of a component definition, so if
     * a DOM element is already registered, nothing will be initialized again.
     *
     * @return New instance of component definition
     */
    ComponentManager.prototype.exposeComponent = function (comp, app) {
        //if already registered
        if (comp.el && comp.el.__speak) {
            return;
        }
        var def = this.definitionStore.find(comp.key) || {}, initial = this.getInitialValue(comp, def), result, domID = scUtils.string.uniqueId(), Component;
        //get deps from requirejs. execute the function and use the object returned.
        var deps = def.deps, args = [];
        if (deps && isAFunction(def)) {
            deps.forEach(function (d) {
                args.push(requirejs(d)); // TODO: Remove hardcoded dependency to requireJS
            });
            def = def.apply(null, args);
        }
        var presenter = this.presenterStore.find(def.presenter || comp.presenter);
        if (presenter && presenter.make) {
            result = presenter.make(def, comp.el, app, initial);
        }
        else {
            Component = this.componentFactory.make(presenter, def, comp.el, app, initial);
            result = new Component(initial, app, comp.el, this._s);
        }
        if (comp.el) {
            comp.el.__speak = true;
            comp.el.__domID = domID;
        }
        if (comp._properties && comp._properties.compositescopeid) {
            // Remove "App." from compositescopeid
            var scopeId = comp._properties.compositescopeid;
            result.parent = scopeId.split(".").slice(1).join(".");
        }
        else {
            result.parent = comp.parent;
        }
        result.id = comp.id;
        result.__domID = domID;
        result.type = comp.type;
        result.name = comp.name;
        result.el = comp.el;
        result.app = app;
        result.template = comp.template || comp.id;
        result.isComposite = comp.isComposite;
        result.uid = result.parent ? [result.parent, result.id].join(".") : result.id;
        return result;
    };
    /**
     * Create components for an Application.
     * Dependencies and definition should have been loaded before calling this method.
     */
    ComponentManager.prototype.componentPipeline = function (app, el) {
        if (!el) {
            el = app.el;
        }
        var components = this.componentParser.parse(el), life = this.lifeCycle.slice(0); //clone to keep lifeCycle clean
        if (!scUtils.array.contains(life, "initialize")) {
            throw new Error("you must have a initialize method in your lifeCycle");
        }
        var componentObjects = this.initializeComponents(components, app);
        app.components = app.components || [];
        app.components = app.components.concat(componentObjects);
        var tree = tree_1.Tree.create(componentObjects, "uid", "id");
        // remove initialize from lifecycle as it is called elsewhere prior to here
        life.shift();
        var lifeIterator = new lifeCycleIterator_1.LifeCycleIterator(life);
        lifeIterator.runOn(componentObjects);
        return tree;
    };
    return ComponentManager;
})();
exports.ComponentManager = ComponentManager;
//# sourceMappingURL=component.js.map
},{"../conf":32,"../utils/class":39,"../utils/lifeCycleIterator":41,"../utils/tree":43,"sc-utils":75}],36:[function(require,module,exports){
/**
 * For each component/pageCode given, the plugin manager will apply every plugin available.
 */
var PluginManager = (function () {
    function PluginManager(pluginIteratee) {
        this.pluginIteratee = pluginIteratee;
    }
    /**
     * Take a component and apply the appropriate plugins
     */
    PluginManager.prototype.initializeComponent = function (component) {
        this.pluginIteratee.each(function (plugin) {
            if (plugin.extendComponent) {
                plugin.extendComponent(component);
            }
        });
    };
    /**
     * Take a Pagecode and apply the appropriate plugins
     */
    PluginManager.prototype.initializeApplication = function (pageCode, context) {
        this.pluginIteratee.each(function (plugin) {
            if (plugin.extendApplication) {
                plugin.extendApplication(pageCode, context);
            }
        });
    };
    return PluginManager;
})();
exports.PluginManager = PluginManager;
//# sourceMappingURL=plugin.js.map
},{}],37:[function(require,module,exports){
var ajax_1 = require("../utils/ajax");
/**
 * Will loaded and compile template strings using an engine.
 * By default SPEAK uses handlebars.js as the template engine.
 * Any template engine can be used.
 * See [tmpl](#_manager_template_.templatemanager.tmp) on how to extend adapter to be used for another template engine.
 *
 * Usage of TemplateManager
 * ```javascript
 * var templateManager = new TemplateManager(handlerbars);
 * templateManager.get("myTemplatePath", function (templateData) {
 *   var compiledTmpl = templateManager.tmpl.compile(templateData);
 *   var html = compiledTmpl(tmplData);
 *   html; // -> html ready to be inserted.
 * })
 * ```
 */
var TemplateManager = (function () {
    function TemplateManager(templateEngine) {
        this.cache = {};
        this.loader = ajax_1.AjaxUtils;
        if (!templateEngine) {
            throw new Error("Template engine has not been set");
        }
        this.tmp = {
            compile: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return templateEngine.compile.apply(this, arguments);
            },
            original: templateEngine
        };
    }
    /**
     * Get a Template from the server and cache it.
     * The cached version will be returned if already loaded.
     * @param path name of the Component
     * @param callback called when done
     */
    TemplateManager.prototype.get = function (path, callback) {
        var template = this.cache[path];
        if (template) {
            callback(template);
            return;
        }
        this.loader.xhr({
            type: "GET",
            url: path,
            cb: function (data) {
                this.cache[path] = data;
                return callback(data);
            }.bind(this)
        });
    };
    return TemplateManager;
})();
exports.TemplateManager = TemplateManager;
//# sourceMappingURL=template.js.map
},{"../utils/ajax":38}],38:[function(require,module,exports){
/**
 * Helper utility for making AJax calls.
 */
var AjaxUtils = (function () {
    function AjaxUtils() {
    }
    AjaxUtils.xhr = function (options) {
        var type = options.type, url = options.url, data = options.data, cb = options.cb, xmlHttp = new XMLHttpRequest();
        xmlHttp.open(type, url, true);
        if (type.toLowerCase() === "post") {
            xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        xmlHttp.send(type === "post" ? JSON.stringify(data) : null);
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4) {
                if (xmlHttp.status === 200 || xmlHttp.status === 0) {
                    cb(xmlHttp.responseText);
                }
                else {
                    console.log("Error: " + xmlHttp.responseText);
                }
            }
        };
    };
    return AjaxUtils;
})();
exports.AjaxUtils = AjaxUtils;
//# sourceMappingURL=ajax.js.map
},{}],39:[function(require,module,exports){
var ClassUtils = (function () {
    function ClassUtils() {
    }
    ClassUtils.extractProperties = function (def) {
        var initialValues = {};
        for (var i in def) {
            if (def.hasOwnProperty(i)) {
                var property = def[i];
                initialValues[i] = property;
            }
        }
        return initialValues;
    };
    return ClassUtils;
})();
exports.ClassUtils = ClassUtils;
//# sourceMappingURL=class.js.map
},{}],40:[function(require,module,exports){
/**
 * Iterates over a set of items.
 */
var Iterator = (function () {
    function Iterator(items) {
        this.items = [];
        this.nextIndex = 0;
        this.items = items;
    }
    /**
     * @return Will return the next item in the list.
     * Will return null if no more objects are to be found.
     *
     */
    Iterator.prototype.next = function () {
        return this.nextIndex < this.items.length ?
            this.items[this.nextIndex++] : null;
    };
    /**
     * Will reset iterator to start from first item again.
     */
    Iterator.prototype.reset = function () {
        this.nextIndex = 0;
    };
    return Iterator;
})();
exports.Iterator = Iterator;
//# sourceMappingURL=iterator.js.map
},{}],41:[function(require,module,exports){
var iterator_1 = require("./iterator");
function callMethodIfExists(methodName, target) {
    var method = target[methodName];
    if (method) {
        method.call(target);
    }
}
/**
 * Takes a list of lifecycle methods to run on a set of targets.
 * To run the life-cycle on some target objects call the runOn method.
 */
var LifeCycleIterator = (function () {
    function LifeCycleIterator(lifecycles) {
        this.lifecycles = lifecycles;
    }
    /**
     * @param targets Objects to call life-cycle methods on.
     * If target does not have method listed in a life-cycle it is silently ignored.
     */
    LifeCycleIterator.prototype.runOn = function (targets) {
        var lifeCycleIterator = new iterator_1.Iterator(this.lifecycles), targetIterator = new iterator_1.Iterator(targets), target = targetIterator.next(), methodName;
        while (target) {
            methodName = lifeCycleIterator.next();
            while (methodName) {
                callMethodIfExists(methodName, target);
                methodName = lifeCycleIterator.next();
            }
            lifeCycleIterator.reset();
            target = targetIterator.next();
        }
    };
    return LifeCycleIterator;
})();
exports.LifeCycleIterator = LifeCycleIterator;
//# sourceMappingURL=lifecycleiterator.js.map
},{"./iterator":40}],42:[function(require,module,exports){
module.exports=require(41)
},{"./iterator":40}],43:[function(require,module,exports){
var Tree = (function () {
    function Tree() {
    }
    Tree.create = function (flatArray, key, exposeKey) {
        var flatArrayLength = flatArray.length, key = key ? key : "key", exposeKey = exposeKey ? exposeKey : key, node, map = {}, roots = [];
        for (var j = 0; j < flatArrayLength; j++) {
            var currNode = flatArray[j];
            map[currNode[key]] = j;
            currNode.children = [];
        }
        for (var i = 0; i < flatArrayLength; i++) {
            node = flatArray[i];
            if (node.parent) {
                var parentKey = map[node.parent];
                if (parentKey !== void 0) {
                    var parent = flatArray[parentKey];
                    // overriding parent as a string with a parent as a TreeNode
                    node.parent = parent ? parent : void 0;
                    if (parent) {
                        parent.children.push(node);
                        if (parent[node[exposeKey]]) {
                            throw new Error("Conflicting id for " + node[key] + " in object " + parent[key]);
                        }
                        parent[node[exposeKey]] = node;
                    }
                }
            }
            else {
                roots.push(node);
            }
        }
        return roots;
    };
    return Tree;
})();
exports.Tree = Tree;
;
//# sourceMappingURL=tree.js.map
},{}],44:[function(require,module,exports){
/**
 * Constansts used throughout the parser application to find specific DOM elements to parse.
 * Grouped here for single point of access.
 */
var Config = (function () {
    function Config() {
    }
    Config.APP_KEY = "data-sc-app";
    Config.PLUGIN_KEY = "data-sc-pluginId";
    Config.SCRIPT = "data-sc-require";
    Config.COMPONENT_KEY = "data-sc-id";
    Config.COMPONENT_TYPE = "data-sc-component";
    Config.NESTED = "data-sc-hasnested";
    Config.TEMPLATE = "data-sc-template";
    Config.PROPERTIES = "data-sc-properties";
    Config.PRESENTER = "data-sc-presenter";
    Config.ATTR_APP = "[" + Config.APP_KEY + "]";
    Config.ATTR_PAGECODE = "script[type='text/x-sitecore-pagecode']";
    Config.ATTR_PLUGIN = "script[type='text/x-sitecore-pluginscript']";
    Config.ATTR_COMPONENT = "[" + Config.COMPONENT_KEY + "]";
    Config.defaultPresenter = "scComponentPresenter";
    return Config;
})();
exports.Config = Config;
//# sourceMappingURL=conf.js.map
},{}],45:[function(require,module,exports){
/// <reference path='../../sc-utils/typings/sc-utils.d.ts' />
var app_1 = require("./parser/app");
var plugin_1 = require("./parser/plugin");
var pageCode_1 = require("./parser/pageCode");
var component_1 = require("./parser/component");
exports.ComponentParser = component_1.ComponentParser;
var parserresult_1 = require("./parser/parserresult");
var Parser = (function () {
    function Parser() {
    }
    /**
     * Static method traversing through the DOM an find all components, applications,
     * pageCodes and plugins.
     *
     * ## Usage
     * ```javascript
     * import { Parser } from "bootjs-parsers/src/index";
     *
     * Parser.parse(document);
     * ```
     */
    Parser.parse = function (element) {
        var result = new parserresult_1.AllElementsParserResult();
        result.applications = app_1.AppParser.parse(element);
        result.plugins = plugin_1.PluginParser.parse(element);
        result.pageCodes = pageCode_1.PageCodeParser.parse(element);
        result.components = component_1.ComponentParser.parse(element);
        return result;
    };
    return Parser;
})();
exports.Parser = Parser;
//# sourceMappingURL=index.js.map
},{"./parser/app":46,"./parser/component":47,"./parser/pageCode":48,"./parser/parserresult":49,"./parser/plugin":50}],46:[function(require,module,exports){
var conf_1 = require("../conf");
var parserresult_1 = require("./parserresult");
var DOM_1 = require("../utils/DOM");
var AppParser = (function () {
    function AppParser() {
    }
    /**
     * Find all application Nodes from a given element. An application is
     * found by searching for the data-sc-app attribute.
     * Example of Nodes it will find:
     *
     * ```html
     * <div data-sc-app></div>
     * ```
     *
     * Also nested apps will be found:
     *
     * ```html
     *<body data-sc-app="myApp">
     *  <div data-sc-app="mySubApp"></div>
     *<body>
     * ```
     */
    AppParser.parse = function (element) {
        return DOM_1.DOMUtils
            .findElements(conf_1.Config.ATTR_APP, element)
            .map(function (el) {
            var parent = DOM_1.DOMUtils.findParentByAttr(el, [conf_1.Config.APP_KEY]), parentKey = void 0;
            if (parent) {
                parentKey = parent.getAttribute(conf_1.Config.APP_KEY) || "app";
            }
            var parserResult = new parserresult_1.AppParserResult();
            parserResult.el = el;
            parserResult.key = el.getAttribute(conf_1.Config.APP_KEY) || "app";
            parserResult.depth = DOM_1.DOMUtils.getDepth(el);
            parserResult.components = [];
            parserResult.parent = parentKey,
                parserResult.pageCode = el.querySelector(conf_1.Config.ATTR_PAGECODE);
            return parserResult;
        });
    };
    return AppParser;
})();
exports.AppParser = AppParser;
//# sourceMappingURL=app.js.map
},{"../conf":44,"../utils/DOM":51,"./parserresult":49}],47:[function(require,module,exports){
var conf_1 = require("../conf");
var DOM_1 = require("../utils/DOM");
var Path_1 = require("../utils/Path");
var parserresult_1 = require("./parserresult");
var ComponentParser = (function () {
    function ComponentParser() {
    }
    /**
     * Find all application Nodes from a given element. An application is
     * found by searching for the data-sc-id attribute. It will only find it
     * it also has at least one of the following attributes:
     *
     * 1. data-sc-require
     * 1. data-sc-presenter
     *
     * `data-sc-presenter` is required because we use that to determine if it is a SPEAK 1
     * or a SPEAK 2 component. When data-sc-presenter is present, we consider is a SPEAK 2
     * component.
     *
     * Example Nodes it will find and parse:
     *
     * ```html
     * <div data-sc-id="myComp1" data-sc-require="myComp.js"></div>
     * <div data-sc-id="myComp2" data-sc-require="myComp.js" data-sc-presenter="scComponentPresenter"></div>
     * <div data-sc-id="myComp3" data-sc-presenter="scComponentPresenter"></div>
     * <div data-sc-id="myComp1" data-sc-presenter></div>
     * ```
     *
     * It will *not* find and parse:
     * ```html
     * <div data-sc-id="myComp1"></div>
     * <div data-sc-id="myComp1" data-sc-require></div>
     * ```
     */
    ComponentParser.parse = function (element) {
        return DOM_1.DOMUtils
            .findElements(conf_1.Config.ATTR_COMPONENT, element)
            .map(function (el) {
            var type = el.getAttribute(conf_1.Config.COMPONENT_TYPE);
            var parentComponents = DOM_1.DOMUtils.findParentsByAttr(el, [conf_1.Config.COMPONENT_KEY, conf_1.Config.NESTED], [conf_1.Config.APP_KEY]);
            var presenter = el.getAttribute(conf_1.Config.PRESENTER);
            var hasPresenter = el.hasAttribute(conf_1.Config.PRESENTER);
            var script = el.getAttribute(conf_1.Config.SCRIPT);
            var _properties = el.getAttribute(conf_1.Config.PROPERTIES);
            if (!script && !hasPresenter) {
                return void 0;
            }
            var parserResult = new parserresult_1.ComponentParserResult();
            if (hasPresenter) {
                if (presenter) {
                    var presenterInfo = Path_1.PathUtils.parse(presenter);
                    parserResult.presenter = presenterInfo.name;
                    var presenterNameWithPath = Path_1.PathUtils.join(presenterInfo.basePath, presenterInfo.name);
                    if (presenterNameWithPath.toLowerCase() !== conf_1.Config.defaultPresenter.toLowerCase()) {
                        parserResult.presenterScript = [presenterNameWithPath];
                    }
                }
            }
            else {
                parserResult.presenter = "SpeakPresenter";
                parserResult.presenterScript = void 0;
                type = script;
            }
            if (_properties) {
                try {
                    _properties = JSON.parse(_properties);
                }
                catch (e) {
                    throw new Error("Cannot parse the value of data-sc-properties to JSON. Please verify your component contains valid JSON");
                }
            }
            parserResult.el = el;
            parserResult.key = type || "generic";
            parserResult.id = el.getAttribute(conf_1.Config.COMPONENT_KEY);
            parserResult.depth = DOM_1.DOMUtils.getDepth(el);
            parserResult.parent = parentComponents.length > 0 ? parentComponents.map(function (x) { return x.getAttribute(conf_1.Config.COMPONENT_KEY); }).join(".") : void 0;
            parserResult.script = script ? script.split(",") : void 0;
            parserResult.template = el.getAttribute(conf_1.Config.TEMPLATE);
            parserResult.hasTemplate = el.hasAttribute(conf_1.Config.TEMPLATE);
            parserResult.isComposite = el.hasAttribute(conf_1.Config.NESTED);
            parserResult._properties = _properties;
            return parserResult;
        })
            .filter(function isDefined(parserResult) {
            return parserResult !== void 0;
        })
            .sort(function (a, b) {
            return b.depth - a.depth;
        });
    };
    return ComponentParser;
})();
exports.ComponentParser = ComponentParser;
//# sourceMappingURL=component.js.map
},{"../conf":44,"../utils/DOM":51,"../utils/Path":52,"./parserresult":49}],48:[function(require,module,exports){
var conf_1 = require("../conf");
var DOM_1 = require("../utils/DOM");
var parserresult_1 = require("./parserresult");
var PageCodeParser = (function () {
    function PageCodeParser() {
    }
    /**
     * Find all PageCodes from a given element. A PageCode is
     * found by searching for `<script type="text/x-sitecore-pagecode">`.
     *
     * Examples of Nodes it will find:
     *
     * ```html
     * <script type="text/x-sitecore-pagecode" id="firstFindAllElement"></script>
     * <script type="text/x-sitecore-pagecode" src="/foobar.js"></script>
     * <div data-sc-app="myapp">
     *   <script type="text/x-sitecore-pagecode" data-sc-require="foobar"></script>
     * </div>
     * ```
     *
     * __NB__ _src_ and _data-sc-require_ are used for the same purpose for declaring a path to a script file.
     * _src_ is used over _data-sc-require_.
     */
    PageCodeParser.parse = function (element) {
        return DOM_1.DOMUtils
            .findElements(conf_1.Config.ATTR_PAGECODE, element)
            .map(function (el) {
            var parentApp = DOM_1.DOMUtils.findParentByAttr(el, [conf_1.Config.APP_KEY]) || document.body, script = el.getAttribute("src") || el.getAttribute(conf_1.Config.SCRIPT), pageCodeName = parentApp.getAttribute(conf_1.Config.APP_KEY) || "app";
            var parserResult = new parserresult_1.PageCodeParserResult();
            parserResult.el = el;
            parserResult.id = parentApp.getAttribute(conf_1.Config.APP_KEY);
            parserResult.key = pageCodeName;
            parserResult.script = [script];
            return parserResult;
        });
        return [];
    };
    return PageCodeParser;
})();
exports.PageCodeParser = PageCodeParser;
//# sourceMappingURL=pageCode.js.map
},{"../conf":44,"../utils/DOM":51,"./parserresult":49}],49:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AllElementsParserResult = (function () {
    function AllElementsParserResult() {
    }
    return AllElementsParserResult;
})();
exports.AllElementsParserResult = AllElementsParserResult;
var ParserResult = (function () {
    function ParserResult() {
    }
    return ParserResult;
})();
exports.ParserResult = ParserResult;
var AppParserResult = (function (_super) {
    __extends(AppParserResult, _super);
    function AppParserResult() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(AppParserResult.prototype, "isApp", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return AppParserResult;
})(ParserResult);
exports.AppParserResult = AppParserResult;
var PluginParserResult = (function (_super) {
    __extends(PluginParserResult, _super);
    function PluginParserResult() {
        _super.apply(this, arguments);
    }
    return PluginParserResult;
})(ParserResult);
exports.PluginParserResult = PluginParserResult;
var PageCodeParserResult = (function (_super) {
    __extends(PageCodeParserResult, _super);
    function PageCodeParserResult() {
        _super.apply(this, arguments);
    }
    return PageCodeParserResult;
})(ParserResult);
exports.PageCodeParserResult = PageCodeParserResult;
var ComponentParserResult = (function (_super) {
    __extends(ComponentParserResult, _super);
    function ComponentParserResult() {
        _super.apply(this, arguments);
    }
    return ComponentParserResult;
})(ParserResult);
exports.ComponentParserResult = ComponentParserResult;
//# sourceMappingURL=parserresult.js.map
},{}],50:[function(require,module,exports){
var conf_1 = require("../conf");
var DOM_1 = require("../utils/DOM");
var parserresult_1 = require("./parserresult");
var PluginParser = (function () {
    function PluginParser() {
    }
    /**
     * Find all plugins from a given element. A plugin is
     * found by searching for `<script type='text/x-sitecore-pluginscript'>`.
     *
     * Examples of Nodes it will find:
     *
     * ```html
     * <script type="text/x-sitecore-pluginscript"></script>
     * <script type="text/x-sitecore-pluginscript" data-sc-pluginId="myplugin"></script>
     * <script type="text/x-sitecore-pluginscript" data-sc-require="/mypluginscript.js"></script>
     * ```
     */
    PluginParser.parse = function (element) {
        return DOM_1.DOMUtils
            .findElements(conf_1.Config.ATTR_PLUGIN, element)
            .map(function (el) {
            var parserResult = new parserresult_1.PluginParserResult();
            parserResult.el = el;
            parserResult.key = el.getAttribute(conf_1.Config.PLUGIN_KEY);
            parserResult.script = [el.getAttribute(conf_1.Config.SCRIPT)];
            return parserResult;
        });
    };
    return PluginParser;
})();
exports.PluginParser = PluginParser;
//# sourceMappingURL=plugin.js.map
},{"../conf":44,"../utils/DOM":51,"./parserresult":49}],51:[function(require,module,exports){
var scutils = require("sc-utils");
var toArray = scutils.array.toArray;
var DOMUtils = (function () {
    function DOMUtils() {
    }
    /**
     * Given a selector, it will search from an element and return all results in an array.
     * Handling an array is easier to loop over than a NodeList.
     */
    DOMUtils.findElements = function (selector, root) {
        if (root === void 0) { root = document; }
        return toArray(root.querySelectorAll(selector));
    };
    /**
     * Search up the DOM tree and return the first element that has a given attribute.
     */
    DOMUtils.findParentByAttr = function (el, attrs, stopForAttrs) {
        if (stopForAttrs === void 0) { stopForAttrs = []; }
        while (el.parentElement) {
            el = el.parentElement;
            // If we meet an attribute that should stop the search we stop by returning null
            var stopFor = stopForAttrs.filter(el.hasAttribute.bind(el));
            if (stopFor.length > 0) {
                return null;
            }
            // return result if all attributes match
            var hasAttrs = attrs.filter(el.hasAttribute.bind(el));
            if (attrs.length === hasAttrs.length) {
                return el;
            }
        }
        // Many DOM methods return null if they don't 
        // find the element they are searching for
        // It would be OK to omit the following and just
        // return undefined
        return null;
    };
    /**
     * Searches up the DOM tree and return all elements that has a given set of attributes.
     * If nothing found, an empty list is returned. Results start with outermost parent.
     */
    DOMUtils.findParentsByAttr = function (el, attrs, stopForAttrs) {
        if (stopForAttrs === void 0) { stopForAttrs = []; }
        var result = [];
        while (el.parentElement) {
            el = el.parentElement;
            // If we meet an attribute that should stop the search we stop by returning null
            var stopFor = stopForAttrs.filter(el.hasAttribute.bind(el));
            if (stopFor.length > 0) {
                return result;
            }
            // return result if all attributes match
            var hasAttrs = attrs.filter(el.hasAttribute.bind(el));
            if (attrs.length === hasAttrs.length) {
                result.unshift(el);
            }
        }
        return result;
    };
    /**
     * Find the depth of an element all the way to the root of the document.
     * @returns An integer. Will return 0 if argument is document, 1 if body etc.
     */
    DOMUtils.getDepth = function (el) {
        var depth = 0;
        while (el.parentNode !== null) {
            el = el.parentNode;
            depth++;
        }
        return depth;
    };
    return DOMUtils;
})();
exports.DOMUtils = DOMUtils;
//# sourceMappingURL=DOM.js.map
},{"sc-utils":75}],52:[function(require,module,exports){
var PathInfo = (function () {
    function PathInfo() {
    }
    return PathInfo;
})();
exports.PathInfo = PathInfo;
var PathUtils = (function () {
    function PathUtils() {
    }
    PathUtils.parse = function (pathString) {
        var info = new PathInfo();
        info.basePath = pathString.substring(0, pathString.lastIndexOf("/"));
        info.baseName = pathString.substring(pathString.lastIndexOf("/") + 1);
        var baseNameSplit = info.baseName.split(".");
        info.ext = baseNameSplit.length > 1 ? "." + baseNameSplit.pop() : "";
        info.name = baseNameSplit.join(".");
        return info;
    };
    PathUtils.join = function (path1, path2) {
        if (path1 === "" || path2 === "") {
            return path1 + path2;
        }
        return path1 + "/" + path2;
    };
    return PathUtils;
})();
exports.PathUtils = PathUtils;
//# sourceMappingURL=Path.js.map
},{}],53:[function(require,module,exports){
/// <reference path='../node_modules/sc-utils/typings/sc-utils.d.ts' />
var store_1 = require("./models/store");
/**
 * An accesspoint to get a Store.
 * Responsible of creating a Store for each SPEAK element type and making them accesible.
 *
 * ```typescript
 * var stores = new StoreLocator();
 * stores.app; // -> app store
 * ```
 */
var StoreLocator = (function () {
    function StoreLocator() {
        this.app = new store_1.Store("applications");
        this.component = new store_1.Store("components");
        this.definition = new store_1.Store("definitions");
        this.pageCode = new store_1.Store("pagecodes");
        this.plugin = new store_1.Store("plugins");
        this.presenter = new store_1.Store("presenters");
        this.propertyType = new store_1.Store("properties");
    }
    /**
     * Helper method for calling build on each of the stores that can have a related DOM element definition.
     * @param elements An object describing DOM elements found on page.
     */
    StoreLocator.prototype.build = function (elements) {
        this.app.build(elements.applications);
        this.component.build(elements.components);
        this.pageCode.build(elements.pageCodes);
        this.plugin.build(elements.plugins);
    };
    /**
     * Helper method calling the markAsLoaded on each of the stores which can have scripts, which needs loading.
     */
    StoreLocator.prototype.markAsLoaded = function () {
        this.app.markAsLoaded();
        this.component.markAsLoaded();
        this.definition.markAsLoaded();
        this.pageCode.markAsLoaded();
        this.plugin.markAsLoaded();
    };
    /**
     * TODO: Figure out if this can be removed.
     */
    StoreLocator.prototype.markAsRegistered = function () {
        this.app.markAsRegistered();
    };
    return StoreLocator;
})();
exports.StoreLocator = StoreLocator;
//# sourceMappingURL=index.js.map
},{"./models/store":54}],54:[function(require,module,exports){
var scUtils = require("sc-utils");
var isAFunction = scUtils.is.a.function; // using this in if statement directly messes up the code higlighting.
var scriptDependency = (function () {
    function scriptDependency() {
        this.loaded = false;
    }
    return scriptDependency;
})();
/**
 * Store object is used to keep all items used by SPEAK.
 */
var Store = (function () {
    function Store(name, key) {
        if (key === void 0) { key = "name"; }
        /**
         * A list of dependencies for all elements in this store.
         */
        this.dependencies = [];
        /**
         * Each element in the store is added here for future reference by name.
         * Example: `store.stores["myElement"] = myElement;`
         */
        this.stores = {};
        /**
         * Set when creating a new pageCode. The reason being a root pageCode should always be named "app".
         */
        this.isPageCode = false;
        this.name = name;
        this.key = key;
    }
    /**
     * The build method is always called _before_ [creating an element](#_models_store_.store.create). Currently there is
     * nothing enforcing this rule.
     *
     * If the element has presenterScripts, it adds the scripts to the dependencies in the store.
     *
     * @param domElementDescriptions If reference not already present, a reference to the SPEAK DOM elements is added to the store.
     */
    Store.prototype.build = function (domElementDescriptions) {
        domElementDescriptions.forEach(function (domElementDescription) {
            var storeElement = this.stores[domElementDescription.key];
            if (storeElement) {
                // El property is used for future reference by AppManager to search the DOM.
                // Components are not stored and referenced individually like apps, thats the reason for this isApp check.
                var domElementHasChanged = storeElement.el !== domElementDescription.el;
                if (domElementDescription.isApp && domElementHasChanged) {
                    storeElement.el = domElementDescription.el;
                }
                return;
            }
            this.stores[domElementDescription.key] = domElementDescription;
            if (domElementDescription.presenterScript && domElementDescription.presenterScript.length > 0) {
                var presenterScript = { loaded: false, script: domElementDescription.presenterScript };
                this.dependencies.push(presenterScript);
            }
        }, this);
    };
    /**
     * Implementation of create.
     */
    Store.prototype.create = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var name, definition, deps;
        if (arguments.length === 1 && scUtils.is.a.string(args[0])) {
            name = args[0];
            return this.find(name);
        }
        if (arguments.length === 1) {
            definition = args[0];
            if (!this.isPageCode || !isAFunction(definition)) {
                name = definition.name;
            }
        }
        else if (arguments.length === 2 && !scUtils.is.an.array(args[0])) {
            definition = args[0];
            name = args[1];
        }
        else if (arguments.length === 2 && scUtils.is.an.array(args[0])) {
            deps = args[0];
            definition = args[1];
            if (!isAFunction(definition)) {
                name = definition.name;
            }
        }
        else if (arguments.length === 3) {
            deps = args[0];
            definition = args[1];
            name = args[2];
        }
        if (!name) {
            name = "app";
        }
        this.stores[name] = definition;
        this.stores[name].deps = deps;
        if (deps) {
            deps.forEach(function (dep) {
                this.dependencies.push({
                    script: [dep],
                    loaded: false
                });
            }, this);
        }
        return this.find(name);
    };
    /**
     * Remove all elements and dependencies from store.
     */
    Store.prototype.flush = function () {
        this.dependencies = [];
        this.stores = {};
    };
    /**
     * Implementation of find.
     */
    Store.prototype.find = function (name) {
        if (isAFunction(name)) {
            var comparator = name, result = [];
            this.each(function (definition) {
                if (comparator(definition)) {
                    result.push(definition);
                }
            });
            return result[0];
        }
        else {
            return this.stores[name];
        }
    };
    /**
     * Iterate over the elements in the store, yielding each in turn to an __iteratee__ function.
     * Each invocation of the __iteratee__ is called with a store element.
     */
    Store.prototype.each = function (iteratee) {
        for (var k in this.stores) {
            if (this.stores.hasOwnProperty(k)) {
                iteratee(this.stores[k]);
            }
        }
    };
    /**
     * Get dependencies that haven't been loaded yet.
     * @return A list with lists of scripts that are not loaded yet. I.e `[["script1"],["script2"]]`
     */
    Store.prototype.deps = function () {
        var result = [];
        this.dependencies.forEach(function (dependency) {
            if (!dependency.loaded) {
                result.push(dependency.script);
            }
        });
        return result;
    };
    /**
     * Return all element keys registered in store.
     */
    Store.prototype.keys = function () {
        var result = [], keys = Object.keys(this.stores);
        for (var k in keys) {
            if (keys.hasOwnProperty(k)) {
                result.push([keys[k]]);
            }
        }
        return result;
    };
    /**
     * Iterates through each DOM element added through the build method and collects the scripts
     * needed to load the element definition.
     *
     * Should be called _before_ create() is called.
     *
     * @returns a flat list of paths to js files with definitions.
     */
    Store.prototype.scripts = function () {
        var result = [];
        for (var c in this.stores) {
            if (this.stores.hasOwnProperty(c) && this.stores[c].script) {
                result = result.concat(this.stores[c].script);
            }
        }
        return result;
    };
    /**
     * Mark all DOM elements in store and dependencies as loaded.
     * Should be called _before_ create() is called.
     */
    Store.prototype.markAsLoaded = function () {
        this.each(function (element) {
            element.scriptLoaded = true;
        });
        this.dependencies.forEach(function (dependency) {
            dependency.loaded = true;
        });
    };
    /**
     * Mark all DOM elements in store as registered.
     * Should be called _before_ create() is called.
     */
    Store.prototype.markAsRegistered = function () {
        this.each(function (element) {
            element.registered = true;
        });
    };
    /**
     * Get elements in store that are not registered.
     * Should be called _before_ create() is called.
     */
    Store.prototype.getNotRegistered = function () {
        var result = {};
        this.each(function (element) {
            if (!element.registered) {
                result[element.key] = element;
            }
        });
        return result;
    };
    return Store;
})();
exports.Store = Store;
//# sourceMappingURL=store.js.map
},{"sc-utils":75}],55:[function(require,module,exports){

},{}],56:[function(require,module,exports){
/* jshint forin: false*/

var isObject = function ( obj ) {
  return typeof {} === typeof obj;
};

var extend = function ( base, ext ) {
  for ( var i in ext ) {
    if ( base[ i ] ) {
      throw "key " + i + " already exists in the module";
    }
    base[ i ] = ext[ i ];
  }
};

var mod = function ( key, obj ) {
  var fn, extension;

  fn = this.fn = this.fn || {};

  if ( !key && !obj ) {
    throw "Please, pass at least a module name";
  }

  if ( fn[ key ] && !obj ) {
    return fn[ key ];
  }

  if ( !fn[ key ] && !obj ) {
    return null;
  }

  extension = isObject( obj ) ? obj : obj.apply( {}, [ this ] );

  if ( !fn[ key ] && obj ) {
    fn[ key ] = extension;
  } else {
    extend( fn[ key ], extension );
  }

  return fn[ key ];
};

module.exports = {
  attach: function ( sitecore ) {
    if ( sitecore.module ) {
      return;
    }
    sitecore.module = mod.bind( sitecore );
  }
};
},{}],57:[function(require,module,exports){
var pipelines = require( "./model/pipelines" );

//export the Pipeline's model via the pipelines API
pipelines.Pipeline = require( "./model/pipeline" );

var invoke = require( "./pipelines/Invoke/index" );
var serverInvoke = require( "./pipelines/ServerInvoke/index" );

pipelines.add( invoke );
pipelines.add( serverInvoke );

module.exports = pipelines;
},{"./model/pipeline":58,"./model/pipelines":59,"./pipelines/Invoke/index":64,"./pipelines/ServerInvoke/index":65}],58:[function(require,module,exports){
var utils = require( "../utils/index" );

var Pipeline = function ( name ) {

  var result = {
    processors: [],
    name: name,
    add: function ( processor ) {

      if ( !processor || !processor.priority || !processor.execute || !utils.isNumber( processor.priority ) || !utils.isFunction( processor.execute ) ) {
        throw "not valid step";
      }

      this.processors.push( processor );
    },
    length: function () {
      return this.processors.length;
    },
    remove: function ( processor ) {
      this.processors = utils.reject( this.processors, function ( p ) {
        return p.priority === processor.priority;
      } );
    },
    execute: function ( context ) {
      //TODO: sort on adding processors
      var list = utils.sortBy( this.processors, function ( processor ) {
        return processor.priority;
      } );

      list.forEach( function ( processor ) {
        if ( context.aborted ) {
          return false;
        }
        processor.execute( context );
      } );
    }
  };

  return result;
};

module.exports = Pipeline;
},{"../utils/index":67}],59:[function(require,module,exports){
var utils = require( "../utils/index" ),
  pipelines = [];

var api = {
  get: function ( name ) {
    var result;

    pipelines.forEach( function ( pip ) {
      if ( pip.name === name ) {
        result = pip;
      }
    } );

    return result;
  },
  add: function ( pipeline ) {
    if ( !pipeline || !pipeline.name || !utils.isObject( pipeline ) ) {
      throw new Error( "invalid pipeline" );
    }

    pipelines.push( pipeline );
    this[ pipeline.name ] = pipeline;
  },
  remove: function ( pipelineName ) {
    pipelines = utils.reject( pipelines, function ( p ) {
      return p.name === pipelineName;
    } );
  },
  length: function () {
    return pipelines.length;
  }
};

module.exports = api;
},{"../utils/index":67}],60:[function(require,module,exports){
var utils = require( "../../utils/index" );

var handleJavaScript = {
  priority: 1000,
  execute: function ( context ) {
    if ( context.handler === "javascript" ) {
      if ( context.target.indexOf( ";" ) > 0 ) {
        context.target.split( ";" ).forEach( function ( tar ) {
          utils.executeContext( tar, context );
        } );
      } else {
        utils.executeContext( context.target, context );
      }
    }
  }
};

module.exports = handleJavaScript;
},{"../../utils/index":67}],61:[function(require,module,exports){
var utils = require( "../../utils/index" ),
  commands = require( "../../utils/command" );

var handleCommand = {
  priority: 2000,
  execute: function ( context ) {
    if ( context.handler === "command" ) {
      commands.executeCommand( context.target );
    }
  }
};

module.exports = handleCommand;
},{"../../utils/command":66,"../../utils/index":67}],62:[function(require,module,exports){
var utils = require( "../../utils/index" );

var serverClick = {
  priority: 3000,
  execute: function ( context ) {
    if ( context.handler !== "serverclick" ) {
      return;
    }

    //TODO: maybe we should validate
    var options = {
      url: context.target,
      type: "POST",
      dataType: "json"
    };

    var completed = function ( result ) {
      //TODO: validate result
      Sitecore.Speak.module( "pipelines" ).get( "ServerInvoke" ).execute( {
        data: result,
        model: context.model
      } );
    };
    //jQuery won't be here
    //TODO: replace with something more robut

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( options.type, options.url, true );

    if ( options.type.toLowerCase() === "post" ) {
      xmlHttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
    }

    var token = Sitecore.Speak.utils.security.antiForgery.getAntiForgeryToken();

    var data = {};
    data[token.formKey] = token.value;
    
    xmlHttp.send($.param(data));

    xmlHttp.onreadystatechange = function () {
      if ( xmlHttp.readyState === 4 ) {
        if ( xmlHttp.status === 200 ) {
          completed( JSON.parse( xmlHttp.responseText ) );
        } else {
          console.log( "Error: " + xmlHttp.responseText );
        }
      }
    };
  }
};

module.exports = serverClick;
},{"../../utils/index":67}],63:[function(require,module,exports){
var utils = require( "../../utils/index" );

var triggerEvent = {
  priority: 4000,
  execute: function ( context ) {
    var app = context.app,
      target = context.target,
      args = {};

    if ( context.handler !== "trigger" ) {
      return;
    }

    if ( !app ) {
      throw new Error( "An application is a required when triggering events" );
    }

    var n = target.indexOf( "(" );
    if ( n >= 0 ) {
      if ( target.indexOf( ")", target.length - 1 ) === -1 ) {
        throw "Missing ')'";
      }
      var parameters = target.substr( n + 1, target.length - n - 2 );
      args = JSON.parse( parameters );
      target = target.substr( 0, n );
    }

    args.sender = context.control;

    app.trigger( target, args );
  }
};

module.exports = triggerEvent;
},{"../../utils/index":67}],64:[function(require,module,exports){
var Pipeline = require( "../../model/pipeline" ),
  invokePipeline = new Pipeline( "Invoke" );

invokePipeline.add( require( "./1000-HandleJavascript" ) );
invokePipeline.add( require( "./2000-HandleCommand" ) );
invokePipeline.add( require( "./3000-ServerClick" ) );
invokePipeline.add( require( "./4000-TriggerEvent" ) );

module.exports = invokePipeline;
},{"../../model/pipeline":58,"./1000-HandleJavascript":60,"./2000-HandleCommand":61,"./3000-ServerClick":62,"./4000-TriggerEvent":63}],65:[function(require,module,exports){
var Pipeline = require( "../../model/pipeline" ),
  serverInvokePipeline = new Pipeline( "ServerInvoke" );

module.exports = serverInvokePipeline;
},{"../../model/pipeline":58}],66:[function(require,module,exports){
var utils = require( "./index" );

/**
 * resovle the property name in the global Object
 * @params {propertyName} property we will try to resolve
 * return the value of the property
 */
var resolve = function ( propertyName ) {
  if ( !utils.isString( propertyName ) ) {
    throw "provied a correct Path to resolve";
  }

  var parts = propertyName.split( "." );

  var property = root || window;
  for ( var n = 0; n < parts.length; n++ ) {
    property = property[ parts[ n ] ];
    if ( property == null ) {
      throw "Reference '" + propertyName + "' not found";
    }
  }

  return property;
};

/**
 * getCommand avialable
 * @params {commandName} the command you want to retrieve
 * @returns the command
 */
var getCommand = function ( commandName ) {
  return resolve( commandName );
};

/**
 * execute some command available in the Sitecore.Commands namespace
 * @params {commandName} the name of the command
 * @params {context} the context you want to pass to the command
 */
var executeCommand = function ( commandName, context ) {
  if ( !commandName || !utils.isString( commandName ) ) {
    throw new Error( "cannot execute command without commandName" );
  }

  var command = getCommand( commandName );

  if ( command.canExecute( context ) ) {
    command.execute( context );
  }
};

var command = {
  resolve: resolve,
  getCommand: getCommand,
  executeCommand: executeCommand
};

module.exports = command;
},{"./index":67}],67:[function(require,module,exports){
/*jshint -W054 */
var toString = Object.prototype.toString;

var utils = {
  lookupIterator: function ( value ) {
    return utils.isFunction( value ) ? value : function ( obj ) {
      return obj[ value ];
    };
  },
  isFunction: function ( obj ) {
    return typeof obj === "function";
  },
  isObject: function ( obj ) {
    return toString.call( obj ) === "[object Object]";
  },
  isNumber: function ( obj ) {
    return toString.call( obj ) === "[object Number]";
  },
  isString: function ( obj ) {
    return ttoString.call( obj ) === "[object String]";
  },
  pluck: function ( obj, key ) {
    return obj.map( function ( value ) {
      return value[ key ];
    } );
  },
  reject: function ( obj, iterator, context ) {
    return obj.filter( function ( value, index, list ) {
      return !iterator.call( context, value, index, list );
    } );
  },
  sortBy: function ( obj, value, context ) {
    var iterator = utils.lookupIterator( value );
    return utils.pluck( obj.map( function ( value, index, list ) {
      return {
        value: value,
        index: index,
        criteria: iterator.call( context, value, index, list )
      };
    } ).sort( function ( left, right ) {
      var a = left.criteria;
      var b = right.criteria;
      if ( a !== b ) {
        if ( a > b || a === void 0 ) {
          return 1;
        }

        if ( a < b || b === void 0 ) {
          return -1;
        }
      }
      return left.index - right.index;
    } ), "value" );
  },
  executeContext: function ( target, context ) {
    //First we check if you want to existing something in the app.
    var targets = target.split( "." ),
      firstPath = targets[ 0 ],
      ex;

    if ( firstPath === "this" ) {
      new Function( target ).call( context.control );
    } else if ( firstPath === "$component" ) {
      ex = target.replace( "$component", "this" );

      new Function( ex ).call( context.control.parent );

    } else if ( ( context.app && firstPath === "$app" ) || ( context.app && firstPath === "app" ) ) {
      //var ex;

      if(firstPath === "$app") {
         ex = target.replace( "$app", "this" ); 
      } else {
         ex = target.replace( "app", "this" );
      }

      new Function( ex ).call( context.app );
    } else {
      /*!!! dangerous zone !!!*/
      new Function( target )();
    }
  }
};

module.exports = utils;
},{}],68:[function(require,module,exports){
var type = require( "./ises/type" ),
  is = {
    a: {},
    an: {},
    not: {
      a: {},
      an: {}
    }
  };

var ises = {
  "arguments": [ "arguments", type( "arguments" ) ],
  "array": [ "array", type( "array" ) ],
  "boolean": [ "boolean", type( "boolean" ) ],
  "date": [ "date", type( "date" ) ],
  "function": [ "function", "func", "fn", type( "function" ) ],
  "null": [ "null", type( "null" ) ],
  "number": [ "number", "integer", "int", type( "number" ) ],
  "object": [ "object", type( "object" ) ],
  "regexp": [ "regexp", type( "regexp" ) ],
  "string": [ "string", type( "string" ) ],
  "undefined": [ "undefined", type( "undefined" ) ],
  "empty": [ "empty", require( "./ises/empty" ) ],
  "nullorundefined": [ "nullOrUndefined", "nullorundefined", require( "./ises/nullorundefined" ) ],
  "guid": [ "guid", require( "./ises/guid" ) ]
}

Object.keys( ises ).forEach( function ( key ) {

  var methods = ises[ key ].slice( 0, ises[ key ].length - 1 ),
    fn = ises[ key ][ ises[ key ].length - 1 ];

  methods.forEach( function ( methodKey ) {
    is[ methodKey ] = is.a[ methodKey ] = is.an[ methodKey ] = fn;
    is.not[ methodKey ] = is.not.a[ methodKey ] = is.not.an[ methodKey ] = function () {
      return fn.apply( this, arguments ) ? false : true;
    }
  } );

} );

exports = module.exports = is;
exports.type = type;
},{"./ises/empty":69,"./ises/guid":70,"./ises/nullorundefined":71,"./ises/type":72}],69:[function(require,module,exports){
var type = require("../type");

module.exports = function ( value ) {
  var empty = false;

  if ( type( value ) === "null" || type( value ) === "undefined" ) {
    empty = true;
  } else if ( type( value ) === "object" ) {
    empty = Object.keys( value ).length === 0;
  } else if ( type( value ) === "boolean" ) {
    empty = value === false;
  } else if ( type( value ) === "number" ) {
    empty = value === 0 || value === -1;
  } else if ( type( value ) === "array" || type( value ) === "string" ) {
    empty = value.length === 0;
  }

  return empty;

};
},{"../type":74}],70:[function(require,module,exports){
var guid = require( "sc-guid" );

module.exports = function ( value ) {
  return guid.isValid( value );
};
},{"sc-guid":73}],71:[function(require,module,exports){
module.exports = function ( value ) {
	return value === null || value === undefined || value === void 0;
};
},{}],72:[function(require,module,exports){
var type = require( "../type" );

module.exports = function ( _type ) {
  return function ( _value ) {
    return type( _value ) === _type;
  }
}
},{"../type":74}],73:[function(require,module,exports){
var guidRx = "{?[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}}?";
var sitecoreRootGuid = '11111111-1111-1111-1111-111111111111';
exports.generate = function () {
  var d = new Date().getTime();
  var guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace( /[xy]/g, function ( c ) {
    var r = ( d + Math.random() * 16 ) % 16 | 0;
    d = Math.floor( d / 16 );
    return ( c === "x" ? r : ( r & 0x7 | 0x8 ) ).toString( 16 );
  } );
  return guid;
};

exports.match = function ( string ) {
  var rx = new RegExp( guidRx, "g" ),
    matches = ( typeof string === "string" ? string : "" ).match( rx );
  return Array.isArray( matches ) ? matches : [];
};

exports.isValid = function ( guid ) {
  if( guid === sitecoreRootGuid || guid === '{' + sitecoreRootGuid + '}' ) {
    return true;
  }
  
  var rx = new RegExp( guidRx );
  return rx.test( guid );
};
},{}],74:[function(require,module,exports){
var toString = Object.prototype.toString;

module.exports = function ( val ) {
  switch ( toString.call( val ) ) {
  case '[object Function]':
    return 'function';
  case '[object Date]':
    return 'date';
  case '[object RegExp]':
    return 'regexp';
  case '[object Arguments]':
    return 'arguments';
  case '[object Array]':
    return 'array';
  }

  if ( val === null ) return 'null';
  if ( val === undefined ) return 'undefined';
  if ( val === Object( val ) ) return 'object';

  return typeof val;
};
},{}],75:[function(require,module,exports){
var is = require("sc-is");

module.exports = {
    is: require("./utils/is"),
    string: require("./utils/string"),
    object: require("./utils/object"),
    array: require("./utils/array"),
    url: require("./utils/url"),
    function: require("./utils/function"),
    async: require("./utils/async"),
    date: require("./utils/date")
};
},{"./utils/array":76,"./utils/async":77,"./utils/date":78,"./utils/function":79,"./utils/is":80,"./utils/object":82,"./utils/string":83,"./utils/url":84,"sc-is":68}],76:[function(require,module,exports){
var is = require( "sc-is" );
var arrayProto = Array.prototype;

var toArray = function( arrayLike ) {
        var array = [],
            i = arrayLike.length >>> 0; // ensure that length is an Uint32
        while ( i-- ) {
            array[ i ] = arrayLike[ i ];
        }
        return array;
    },
    contains = function( array, obj ) {
        var i = array.length;
        while ( i-- ) {
            if ( array[ i ] === obj ) {
                return true;
            }
        }
        return false;
    },
    flatten = function( all, shallow ) {

        shallow = shallow || [];

        if ( !is.an.array( all ) ) {
            return all;
        }

        all.forEach( function( input ) {
            if ( is.an.array( input ) ) {

                var child = flatten( input );

                if ( is.an.array( child ) ) {
                    shallow = arrayProto.concat( shallow, child );
                } else {
                    shallow.push( input );
                }
            } else {
                shallow.push( input );
            }
        } );

        return shallow;
    },
    find = function( obj, predicate, context ) {
        var result,
            context = context ? context : this;

        obj.forEach( function( value, index ) {
            if ( predicate.call( context, value, index, obj ) ) {
                result = value;
            }
        } );

        return result;
    },
    byDepth = function compare( a, b ) {
        if ( a.depth < b.depth ) {
            return -1;
        }
        if ( a.depth > b.depth ) {
            return 1;
        }
        return 0;
    },
    sortByDepth = function( arr ) {
        return arr.sort( byDepth ).reverse( );
    };

module.exports = {
    /**
     * toArray transform an array-like (DOM) to a real Array
     * @param  {Array-like} arrayLike result returned by querySelectorAll
     * @return {[Array]} a real array
     */
    toArray: toArray,
    contains: contains,
    flatten: flatten,
    find: find,
    sortByDepth: sortByDepth
};
},{"sc-is":68}],77:[function(require,module,exports){
var native = require( "./native" ),
    nativeSlice = native.slice;

var doParallel = function( fn ) {
        return function() {
            var args = nativeSlice.call( arguments );
            return fn.apply( null, [ _asyncEach ].concat( args ) );
        };
    },
    only_once = function( fn ) {
        var called = false;
        return function() {
            if ( called ) {
                throw new Error( "Callback was already called." );
            }
            called = true;
            fn.apply( window, arguments );
        };
    },
    _asyncEach = function( arr, iterator, callback ) {
        callback = callback || function() {};
        if ( !arr.length ) {
            return callback();
        }
        var completed = 0;
        arr.forEach( function( x ) {
            iterator( x, only_once( function( err ) {
                if ( err ) {
                    callback( err );
                    callback = function() {};
                } else {
                    completed += 1;
                    if ( completed >= arr.length ) {
                        callback( null );
                    }
                }
            } ) );
        } );
    },
    _asyncMap = function( eachfn, arr, iterator, callback ) {
        var results = [];
        //!!! Verify - wierd !!!
        arr = arr.map( function( x, i ) {
            return {
                index: i,
                value: x
            };
        } );
        eachfn( arr, function( x, callback ) {
            iterator( x.value, function( err, v ) {
                results[ x.index ] = v;
                callback( err );
            } );
        }, function( err ) {
            callback( err, results );
        } );
    };

module.exports = {
    each: _asyncEach,
    map: doParallel( _asyncMap )
};
},{"./native":81}],78:[function(require,module,exports){
var is = require("./is"),
  ensureTwoDigits = function(number) {
    return (number < 10) ? "0" + number.toString() : number.toString();
  };
var formats = {
  mmss: {
    expression: "(\\W|^)mm(\\W+s{1,2}\\W|\\W+s{1,2}$)",
    value: function(date) {
      return ensureTwoDigits(date.getUTCMinutes())
    }
  },
  mss: {
    expression: "(\\W|^)m(\\W+s{1,2}\\W|\\W+s{1,2}$)",
    value: function(date) {
      return date.getUTCMinutes().toString();
    }
  },
  hmm: {
    expression: "(\\Wh{1,2}\\W+|^h{1,2}\\W+)mm(\\W|$)",
    value: function(date) {
      return ensureTwoDigits(date.getUTCMinutes());
    }
  },
  hm: {
    expression: "(\\Wh{1,2}\\W+|^h{1,2}\\W+)m(\\W|$)",
    value: function(date) {
      return date.getUTCMinutes().toString();
    }
  },
  ms: {
    expression: "(\\Wss\\W|^ss\\W)00(\\W|$)",
    value: function(date) {
      return ensureTwoDigits(date.getUTCMilliseconds())
    }
  },
  ampm: {
    expression: "(\\W|^)AM/PM(\\W|$)",
    value: function(date) {
      return ((date.getUTCHours() >= 12) ? "PM" : "AM");
    }
  },
  ap: {
    expression: "(\\W|^)A/P(\\W|$)",
    value: function(date) {
      return ((date.getUTCHours() >= 12) ? "P" : "A");
    }
  },
  yyyy: {
    expression: "(\\W|^)yyyy(\\W|$)",
    value: function(date) {
      return date.getUTCFullYear().toString();
    }
  },
  yy: {
    expression: "(\\W|^)yy(\\W|$)",
    value: function(date) {
      return ensureTwoDigits(date.getUTCFullYear() % 100);
    }
  },
  mm: {
    expression: "(\\W|^)mm(\\W|$)",
    value: function(date) {
      return ensureTwoDigits(date.getUTCMonth() + 1);
    }
  },
  m: {
    expression: "(\\W|^)m(\\W|$)",
    value: function(date) {
      return (date.getUTCMonth() + 1).toString();
    }
  },
  dd: {
    expression: "(\\W|^)dd(\\W|$)",
    value: function(date) {
      return ensureTwoDigits(date.getUTCDate());
    }
  },
  d: {
    expression: "(\\W|^)d(\\W|$)",
    value: function(date) {
      return date.getUTCDate().toString();
    }
  },
  hh: {
    expression: "(\\W|^)hh(\\W|$)",
    value: function(date) {
      return ensureTwoDigits(date.getUTCHours());
    }
  },
  h: {
    expression: "(\\W|^)h(\\W|$)",
    value: function(date) {
      return (date.getUTCHours() > 12) ? (date.getUTCHours() - 12).toString() : ((date.getUTCHours() == 0) ? 12 : date.getUTCHours()).toString();
    }
  },
  ss: {
    expression: "(\\W|^)ss(\\W|$)",
    value: function(date) {
      return ensureTwoDigits(date.getUTCSeconds());
    }
  },
  s: {
    expression: "(\\W|^)s(\\W|$)",
    value: function(date) {
      return date.getUTCSeconds().toString();
    }
  }
};

var dateHelper = {
  //TODO: Not sure about that logic, just trying to port it from 1.1
  toISO: function(date) {

    if (!is.a.date(date)) {
      return false;
    }

    var y = ensureTwoDigits(date.getFullYear()),
      m = ensureTwoDigits(date.getMonth() + 1),
      d = ensureTwoDigits(date.getDate());

    return y + m + d;
  },
  parseISO: function(dateString) {
    var year,
      month,
      day,
      hours,
      minutes,
      seconds;

    if (!is.a.string(dateString)) {
      return null;
    }

    year = parseInt(dateString.substr(0, 4), 10);
    // month should start from 0 !!!
    // minus one in order to have the right month
    month = parseInt(dateString.substr(4, 2), 10) - 1;
    day = parseInt(dateString.substr(6, 2), 10);

    if (dateString.indexOf("T") !== 8) {
      return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
    }

    hours = parseInt(dateString.substr(9, 2), 10);
    minutes = parseInt(dateString.substr(11, 2), 10);
    seconds = parseInt(dateString.substr(13, 2), 10);

    return new Date(Date.UTC(year, month, day, hours, minutes, seconds));
  },
  isISO: function(date) {
    var dateValue;

    if (is.a.date(date)) {
      date = date.toString();
    }

    if (!is.a.string(date)) {
      return false;
    }

    // Removes the ticks
    if (date.charAt(15) === ":") {
      date = date.substr(0, 15);
    }

    if (!(date.length == 8 || date.length == 15)) {
      return false;
    }

    dateValue = this.parseISO(date);

    if (is.a.date(dateValue)) {
      // it is a date
      if (isNaN(dateValue.getYear())) { // d.valueOf() could also work
        return false;
      }
      return true;
    }

    return false;
  },
  toStringWithFormat: function(value, format) {
    if (this.isISO(value)) {
      try {
        var date = this.parseISO(value);

        for (var step in formats) {
          var find = (formats[step]) ? formats[step].expression : "";
          var replace = "$1" + formats[step].value(date) + "$2";
          if (find != "") {
            var expression = new RegExp(find, 'g');

            format = format.replace(expression, replace);
          }
        }

        return format;
      } catch (e) {
        return false;
      }
    }
    return false;
  }
};

module.exports = dateHelper;
},{"./is":80}],79:[function(require,module,exports){
var once = function( func ) {

    var ran = false,
        memo;

    return function() {
        if ( ran ) {
            return memo;
        }
        ran = true;
        memo = func.apply( this, arguments );
        func = null;
        return memo;
    };
};

module.exports = {
    once: once
};
},{}],80:[function(require,module,exports){
var is = require( "sc-is" );

var isCapitalize = function( str ) {
    return str.charAt( 0 ) === str.charAt( 0 ).toUpperCase();
};

is.capitalize = isCapitalize;

module.exports = is;
},{"sc-is":68}],81:[function(require,module,exports){
var arrayProto = Array.prototype;

module.exports = {
    arrayProto: arrayProto,
    forEach: arrayProto.forEach,
    slice: arrayProto.slice
};
},{}],82:[function(require,module,exports){
var native = require( "./native" ),
    navtiveForEach = native.forEach,
    nativeSlice = native.slice;

var extend = function( obj ) {
        navtiveForEach.call( nativeSlice.call( arguments, 1 ), function( source ) {
            if ( source ) {
                for ( var prop in source ) {
                    if ( source.hasOwnProperty( prop ) ) {
                        obj[ prop ] = source[ prop ];
                    }
                }
            }
        } );
        return obj;
    },
    inherits = function( base, init, proto ) {
        var child = function() {
            return base.apply( this, arguments );
        };
        extend( child, base );

        var Surrogate = function() {
            this.constructor = child;
        };

        Surrogate.prototype = base.prototype;
        child.prototype = new Surrogate();

        child.prototype.initialize = init || base.prototype.initialize || function() {};
        if ( proto ) {
            for ( var i in proto ) {
                if ( proto.hasOwnProperty( i ) ) {
                    child.prototype[ i ] = proto[ i ];
                }
            }
        }

        child.__super__ = base.prototype;

        return child;

    },
    defaults = function( obj ) {
        nativeSlice.call( arguments, 1 ).forEach( function( source ) {
            if ( source ) {
                for ( var prop in source ) {
                    if ( obj[ prop ] === void 0 ) {
                        obj[ prop ] = source[ prop ];
                    }
                }
            }
        } );
        return obj;
    },
    extendProto = function( obj, proto ) {
        for ( var p in proto ) {
            if ( proto.hasOwnProperty( p ) ) {
                obj.prototype[ p ] = proto[ p ];
            }
        }
        return obj;
    },
    flattenObject = function( obj ) {
        var result = [];

        for ( var app in obj ) {
            if ( obj.hasOwnProperty( app ) ) {
                result.push( obj[ app ] );
            }
        }
        return result;
    };

module.exports = {
    extend: extend,
    inherits: inherits,
    defaults: defaults,
    extendProto: extendProto,
    flatten: flattenObject
};
},{"./native":81}],83:[function(require,module,exports){
var idCounter = 0;

var capitalize = function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    lowerFirstLetter = function(str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    },
    uniqueId = function(prefix) {
        var id = ++idCounter + "";
        return prefix ? prefix + id : id;
    };

module.exports = {
    capitalize: capitalize,
    lowerFirstLetter: lowerFirstLetter,
    uniqueId: uniqueId
};
},{}],84:[function(require,module,exports){
var getParameterByName = function( name ) {
    name = name.replace( /[\[]/, "\\[" ).replace( /[\]]/, "\\]" );

    var regexS = "[\\?&]" + name + "=([^&#]*)",
        regex = new RegExp( regexS ),
        results = regex.exec( window.location.href );

    if ( results == null ) {
        return "";
    } else {
        return decodeURIComponent( results[ 1 ].replace( /\+/g, " " ) );
    }
};

module.exports = {
    parameterByName: getParameterByName
};
},{}],85:[function(require,module,exports){
/* jshint forin:false,  loopfunc: true  */

/**
 * This is a module extracted from the backboneJS source code
 * but works without Underscore and backbone
 */
var idCounter = 0;

var _uniqueId = function () {
  var id = ++idCounter + "";
  return prefix ? prefix + id : id;
};

var eventSplitter = /\s+/;

var triggerEvents = function ( events, args ) {
  var ev, i = -1,
    l = events.length,
    a1 = args[ 0 ],
    a2 = args[ 1 ],
    a3 = args[ 2 ];

  switch ( args.length ) {
  case 0:
    while ( ++i < l ) {
      ( ev = events[ i ] ).callback.call( ev.ctx );
    }
    return;
  case 1:
    while ( ++i < l ) {
      ( ev = events[ i ] ).callback.call( ev.ctx, a1 );
    }
    return;
  case 2:
    while ( ++i < l ) {
      ( ev = events[ i ] ).callback.call( ev.ctx, a1, a2 );
    }
    return;
  case 3:
    while ( ++i < l ) {
      ( ev = events[ i ] ).callback.call( ev.ctx, a1, a2, a3 );
    }
    return;
  default:
    while ( ++i < l ) {
      ( ev = events[ i ] ).callback.apply( ev.ctx, args );
    }
  }
};

var eventsApi = function ( obj, action, name, rest ) {
  if ( !name ) {
    return true;
  }

  if ( typeof name === "object" ) {
    for ( var key in name ) {
      obj[ action ].apply( obj, [ key, name[ key ] ].concat( rest ) );
    }
    return false;
  }
  if ( eventSplitter.test( name ) ) {
    var names = name.split( eventSplitter );
    for ( var i = 0, l = names.length; i < l; i++ ) {
      obj[ action ].apply( obj, [ names[ i ] ].concat( rest ) );
    }
    return false;
  }

  return true;
};

/**
 * @class Events
 */
var Events = {
  /**
   * On
   * @method on
   * @static
   */
  on: function ( name, callback, context ) {
    if ( !eventsApi( this, "on", name, [ callback, context ] ) || !callback ) {
      return this;
    }

    this._events || ( this._events = {} );

    var events = this._events[ name ] || ( this._events[ name ] = [] );

    events.push( {
      callback: callback,
      context: context,
      ctx: context || this
    } );

    return this;
  },
  /** Once
   * @method once
   * @static
   */
  once: function ( name, callback, context ) {
    if ( !eventsApi( this, "once", name, [ callback, context ] ) || !callback ) {
      return this;
    }

    var self = this;

    var once = _.once( function () {
      self.off( name, once );
      callback.apply( this, arguments );
    } );
    once._callback = callback;

    return this.on( name, once, context );
  },
  /** 
   * Off
   * @method off
   * @static
   */
  off: function ( name, callback, context ) {
    var retain, ev, events, names, i, l, j, k;

    if ( !this._events || !eventsApi( this, "off", name, [ callback, context ] ) ) {
      return this;
    }

    if ( !name && !callback && !context ) {
      this._events = {};
      return this;
    }
    names = name ? [ name ] : Object.keys( this._events );

    for ( i = 0, l = names.length; i < l; i++ ) {
      name = names[ i ];
      if ( events = this._events[ name ] ) {
        this._events[ name ] = retain = [];
        if ( callback || context ) {
          for ( j = 0, k = events.length; j < k; j++ ) {
            ev = events[ j ];
            if ( ( callback && callback !== ev.callback && callback !== ev.callback._callback ) ||
              ( context && context !== ev.context ) ) {
              retain.push( ev );
            }
          }
        }
        if ( !retain.length ) {
          delete this._events[ name ];
        }
      }
    }

    return this;
  },
  /** 
   * Trigger events
   * @method trigger
   * @static
   */
  trigger: function ( name ) {
    if ( !this._events ) {
      return this;
    }

    var args = Array.prototype.slice.call( arguments, 1 );

    if ( !eventsApi( this, "trigger", name, args ) ) {
      return this;
    }

    var events = this._events[ name ];
    var allEvents = this._events.change;
    if ( events ) {
      triggerEvents( events, args );
    }
    if ( allEvents ) {
      triggerEvents( allEvents, arguments );
    }
    return this;
  },
  stopListening: function ( obj, name, callback ) {
    var listeningTo = this._listeningTo;

    if ( !listeningTo ) {
      return this;
    }

    var remove = !name && !callback;
    if ( !callback && typeof name === "object" ) {
      callback = this;
    }

    if ( obj ) {
      ( listeningTo = {} )[ obj._listenId ] = obj;
    }
    for ( var id in listeningTo ) {
      obj = listeningTo[ id ];
      obj.off( name, callback, this );
      if ( remove || Object.keys( obj._events ) === 0 ) {
        delete this._listeningTo[ id ];
      }
    }
    return this;
  }
};
/*
 * Credit to Backbone source code, please find it here:
 * http://backbonejs.org/docs/backbone.html
 */

var listenMethods = {
  /**
   * listenTo
   * @method listenTo
   * @static
   */
  listenTo: "on",
  /** 
   * listenToOnce
   * @method listenToOnce
   * @static
   */
  listenToOnce: "once"
};

//TODO: verify if implemtnation and method are well defined, see backbone source code
for ( var i in listenMethods ) {
  var implementation = listenMethods[ i ],
    method = i;

  Events[ method ] = function ( obj, name, callback ) {
    var listeningTo = this._listeningTo || ( this._listeningTo = {} );
    var id = obj._listenId || ( obj._listenId = _uniqueId( "l" ) );
    listeningTo[ id ] = obj;
    if ( !callback && typeof name === "object" ) {
      callback = this;
    }
    obj[ implementation ]( name, callback, this );
    return this;
  };
}

module.exports = Events;
},{}]},{},[9])
(9)
});
;
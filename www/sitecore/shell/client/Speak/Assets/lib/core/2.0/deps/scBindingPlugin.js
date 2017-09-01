(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/// <reference path='../typings/speak/sitecore.d.ts' />
/**
 * The Binding class takes a binding configuration and synchronize the changes between components.
 */
var Binding = (function () {
    function Binding(bindingConfiguration, utils) {
        this.bindingConfiguration = bindingConfiguration;
        this.utils = utils;
    }
    /**
     * synchronizeProperty
     *
     * Synchronize the property based on the binding setup.
     */
    Binding.prototype._synchronizeProperty = function (binding) {
        var valueToSynchronize = this.utils.getValue(binding);
        binding.isLateBinding = valueToSynchronize.isLateBinding;
        //We initialize the value of the current component to the value of the component's value defined by the bindings
        //NOTE: for multiple bindings, the last one will win for initializing the value
        if (this.utils.isComponentProperty(binding.component, binding.to)) {
            //We do not synchronize if it is a late binding ( this means the value could come later)
            if (!valueToSynchronize.isLateBinding) {
                binding.component.set(binding.to, valueToSynchronize.value);
            }
            return;
        }
        var res = this.utils.resolve(binding.component, binding.to);
        if (!valueToSynchronize.isLateBinding) {
            res.component[res.lastProperty] = valueToSynchronize.value;
        }
    };
    Binding.prototype._synchronizePropertyForLateBinding = function (source, oldResolveResult) {
        var res = this.utils.resolve(source.component, source.attribute);
        //if it is the same result for this binding (late binding, same component and same property) 
        if (res.latestExistingComponent === oldResolveResult.latestExistingComponent && res.latestExistingProperty === oldResolveResult.latestExistingProperty) {
            //we do nothing
            return;
        }
        //if the binding is different, we re-evalute to see if something has changed.
        //I do not call off in order to keep the re-assignation of a whole new object as it is the case for the selectedItem of a list control
        //BUT ! we should introduce, somwhere in the component a 'destroy' method. That method would destroy the binding associated with it and we should ask the component developer to call it when necessaray
        //oldResolveResult.latestExistingComponent.off("change:" + oldResolveResult.latestExistingProperty); //we unsubribe from the late callback ( object is present, no need to listen to that again)
        //we go back to normal for this bindings.
        this.synchronize();
        this.registerChanges();
    };
    /**
     * Regsiter the changes between the bindingSetup and the source of the binding.
     */
    Binding.prototype._registerChanges = function (binding, source) {
        //When the source component change, we update the current component
        var self = this;
        var callback = function (newValue) {
            self._synchronizeProperty(binding);
        };
        if (binding.isLateBinding) {
            var res = this.utils.resolve(source.component, source.attribute);
            var lateBindingCallback = function (newValue) {
                self._synchronizePropertyForLateBinding(source, res);
            };
            if (res.latestExistingComponent && res.latestExistingComponent.on) {
                res.latestExistingComponent.on("change:" + res.latestExistingProperty, lateBindingCallback);
            }
        }
        else {
            var sourcesForChanges = this.utils.resolve(source.component, source.attribute);
            if (sourcesForChanges.component.subscribe) {
                sourcesForChanges.component.subscribe("change:" + sourcesForChanges.lastProperty, callback);
            }
            else if (!sourcesForChanges.component.subscribe && sourcesForChanges.component.on) {
                sourcesForChanges.component.on("change:" + sourcesForChanges.lastProperty, callback);
            }
        }
    };
    Binding.prototype.synchronize = function () {
        var self = this;
        this.bindingConfiguration.forEach(function (binding) {
            self.utils.printDebug("Applying bindings - synchronize properties for the component: " + (binding.component.id ? binding.component.id : "$app"));
            self.utils.printDebug("  for the property: " + binding.to);
            //and for each component used as source for the bindings
            binding.from.forEach(function (source) {
                self.utils.printDebug("    We initialize the value from the component: " + (source.component ? source.component.id : "a piece of $data"));
                self._synchronizeProperty(binding);
            });
        });
    };
    /**
     * Base on the binding configuration for a Property, it synchrnoize the values and make sure that when you change one, the other will change too.
     */
    Binding.prototype.registerChanges = function () {
        //For Each bindingConfiguration
        var self = this;
        this.bindingConfiguration.forEach(function (binding) {
            self.utils.printDebug("Applying bindings - register changes for the component: " + (binding.component.id ? binding.component.id : "$app"));
            self.utils.printDebug("  for the property: " + binding.to);
            //and for each component used as source for the bindings
            binding.from.forEach(function (source) {
                if (!binding.onetime) {
                    self._registerChanges(binding, source);
                }
            });
        });
    };
    return Binding;
})();
exports.Binding = Binding;

}).call(this,require("ngpmcQ"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/binding.js","/")
},{"buffer":7,"ngpmcQ":10}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/// <reference path='../typings/speak/sitecore.d.ts' />
/**
 * @class BindingConfigurationBuilder
 *
 * BindingConfigurationBuilder is a class used for translate the binding syntax sent by the server ( Sitecore ), generally entered in Sitecore ROCKS,
 * into an object understood by the Binding Class in order to setup the appropriate bindings.
 */
var BindingConfigurationBuilder = (function () {
    /**
     * Create the bindings for a single component
     * @param  {Object} component                Component where the binding will be setup
     * @param  {Object} jsonBindingConfigurationFromServer JSON Object which represent a bindingConfiguration
     *
     * ```javascript
     * [ {
     *      "text": "XBinding2.text"
     *   },
     *   {
     *      "text": {
     *                  "mode": "twoway",
     *                  "parameters": [ "TextOustide2.text" ]
     *              }
     *    },
     *    {
     *      "text": {
     *                  "converter": "Has",
     *                  "parameters": [ "Text1.text" ]
     *              }
     *     }
     * ```
     *
     * @param  {Object} data                     Object used for bindings not set to a Component to a classic Object
     * @param  {Object} context                  Object which will be used for the binding as the context for the $data binding.
     */
    function BindingConfigurationBuilder(component, jsonBindingConfigurationFromServer, isTwoWay, converterApi, speakUtils, utils, isData, isApp, context) {
        this.component = component;
        this.jsonBindingConfigurationFromServer = jsonBindingConfigurationFromServer;
        this.isTwoWay = isTwoWay;
        this.isData = isData;
        this.isApp = isApp;
        this.speakUtils = speakUtils;
        this.converterApi = converterApi;
        this.utils = utils;
        this.context = context;
    }
    /**
     * Start to build the BindingSetup array for a property
     *
     * @param {String} propertyName: name of the property for which the binding setup will be built.
     * @param {rawStringBindingConfigFromServer} this is the raw text comfing from the server such as "XBinding2.text"
     *
     * @return {BindingSetup[]} an array of BindingSetup for that property
     */
    BindingConfigurationBuilder.prototype._createBindingConfigurationForProperty = function (propertyName, rawStringBindingConfigFromServer) {
        if (!this.speakUtils.is.an.object(rawStringBindingConfigFromServer)) {
            rawStringBindingConfigFromServer = {
                parameters: [rawStringBindingConfigFromServer]
            };
        }
        return this._createBindingConfigurationForPropertyFromObject(propertyName, rawStringBindingConfigFromServer);
    };
    BindingConfigurationBuilder.prototype._createBindingConfigurationForPropertyFromObject = function (propertyName, bindingConfig) {
        var result = [], from = [], converter = this.converterApi.getConverter(bindingConfig.converter);
        var currentApp = this.isApp ? this.component : this.component.app, self = this;
        bindingConfig.parameters.forEach(function (value) {
            var componentAndMetaData;
            try {
                componentAndMetaData = self.utils.getComponentAndBindingMetaData(self.component, value, currentApp, self.isData ? self.jsonBindingConfigurationFromServer.$data : void 0, self.context);
            }
            catch (e) {
                throw new Error("SPEAK Bindings: Unable to find " + value + " to apply bindings for component " + self.component.id);
            }
            if (!componentAndMetaData) {
                return;
            }
            from.push({
                component: componentAndMetaData.component,
                attribute: componentAndMetaData.attribute
            });
            if (self.isTwoWay || (bindingConfig.mode && (bindingConfig.mode.toLowerCase() === "onewaytosource" || bindingConfig.mode.toLowerCase() === "twoway"))) {
                var reverseBinding = {
                    $data: void 0
                };
                var compName = self.isApp ? "$app" : self.utils.getFullComponentNameFromComponent(self.component);
                var isData = false, isApp = (componentAndMetaData.fullCompName === "$app") ? true : false;
                if (!compName) {
                    reverseBinding[componentAndMetaData.attribute] = "$data." + propertyName;
                    reverseBinding.$data = self.component;
                    isData = true;
                }
                else {
                    if (componentAndMetaData.component.parent) {
                        var reConstructFullCompName = [compName];
                        var component = componentAndMetaData.component.parent;
                        while (component.parent) {
                            reConstructFullCompName.push(component.name);
                            component = component.parent;
                        }
                        reConstructFullCompName.push("$app");
                        reConstructFullCompName.reverse();
                        compName = reConstructFullCompName.join(".");
                    }
                    reverseBinding[componentAndMetaData.attribute] = compName + "." + propertyName;
                }
                var bindingConfBuilder = new BindingConfigurationBuilder(componentAndMetaData.component, reverseBinding, false, self.converterApi, self.speakUtils, self.utils, isData, isApp, self.context);
                result = result.concat(bindingConfBuilder.generate());
            }
            var config = {
                from: from,
                to: propertyName,
                converter: converter,
                component: self.component,
                onetime: false
            };
            if (bindingConfig.mode && bindingConfig.mode.toLowerCase() === "onetime") {
                config.onetime = true;
            }
            if (!(bindingConfig.mode && bindingConfig.mode.toLowerCase() === "onewaytosource")) {
                result.push(config);
            }
        });
        return result.reverse();
    };
    /**
     * Create a binding configuration based on the config set on the data-sc-bindings
     * List of bindingConfiguration is an array which looks like:
     *
     *```javascript
     * [
     *  {
     *    from: [
     *            {
     *              component: "Component - component which will be used for setting the value",
     *              attribute: "String - property used to set the value"
     *            }
     *          ],
     *    to: "String - component's property that will be set",
     *    component: "Component - currentComponent (the one from the EL)"
     *  }, ...
     * ]
     * ```
     */
    BindingConfigurationBuilder.prototype.generate = function () {
        var result = [], self = this;
        if (!this.jsonBindingConfigurationFromServer) {
            return result;
        }
        this.utils.forEachPropertyWithBinding(this.jsonBindingConfigurationFromServer, function (property, rawPropertyBindingConfiguration) {
            if (self.component.depricated) {
                property = self.utils.lowerCaseFirstLetter(property);
            }
            if (self.speakUtils.is.an.array(rawPropertyBindingConfiguration)) {
                rawPropertyBindingConfiguration.forEach(function (rawPropertyConf) {
                    result = result.concat(self._createBindingConfigurationForProperty(property, rawPropertyConf));
                });
            }
            else {
                result = result.concat(self._createBindingConfigurationForProperty(property, rawPropertyBindingConfiguration));
            }
        });
        return result;
    };
    return BindingConfigurationBuilder;
})();
exports.BindingConfigurationBuilder = BindingConfigurationBuilder;

}).call(this,require("ngpmcQ"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/bindingConfigurationBuilder.js","/")
},{"buffer":7,"ngpmcQ":10}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var bindingConfigurationBuilder_1 = require("./bindingConfigurationBuilder");
var binding_1 = require("./binding");
/**
 * The BindingLocator class is used for managing all the bindings for an application.
 */
var BindingLocator = (function () {
    /**
     * @param {SpeakComponent[]} components, All components that will be managed by the BindingLocator.
     * @param {IConverterApi} converter, Converter API that would be used to convert the values for the bindings when a converter is expressed.
     * @param {speakUtils} speakUtils, helpers class from Sitecore.Speak.utils
     * @param {BindingUtils} utils, internal utils helper class.
     * @param {Context} will be used for the $data bindings.
     */
    function BindingLocator(components, converter, speakUtils, utils, context) {
        this.components = components || [];
        this.converter = converter;
        this.utils = utils;
        this.speakUtils = speakUtils;
        this.bindingConfigurations = [];
        this.Bindings = [];
        this.context = context;
    }
    /**
     * For each of the component, it will parse the Binding Syntax sent by the server and will create a BincingConfigurationBuilder object for each of the bindings.
     */
    BindingLocator.prototype.generateConfigurations = function () {
        var self = this;
        this.components.forEach(function (comp) {
            var bindingConfigurationInJSONFormat = comp.el.getAttribute("data-sc-bindings");
            if (bindingConfigurationInJSONFormat) {
                var bindingConfigurationConfig = JSON.parse(bindingConfigurationInJSONFormat);
                self.bindingConfigurations.push(new bindingConfigurationBuilder_1.BindingConfigurationBuilder(comp, bindingConfigurationConfig, false, self.converter, self.speakUtils, self.utils, false, false, self.context));
            }
        });
    };
    /**
     * For each of the BindingConfiguration, it will create a Binding object and keep the reference in the BindingLocator.
     */
    BindingLocator.prototype.createBindings = function () {
        var self = this;
        this.bindingConfigurations.forEach(function (bindingConfig) {
            self.Bindings.push(new binding_1.Binding(bindingConfig.generate(), self.utils));
        });
    };
    /**
     * For each of the binding contained in the BindingLocator, it will synchronize all the properties of the bindings.
     */
    BindingLocator.prototype.synchrnonizeAllProperties = function () {
        this.Bindings.forEach(function (binding) {
            binding.synchronize();
        });
    };
    /**
     * For each of the binding contained in the BindingLocator, it will regsiter all the changes callback needed for the binding to keep the properties synchronized.
     */
    BindingLocator.prototype.registerChanges = function () {
        this.Bindings.forEach(function (binding) {
            binding.registerChanges();
        });
    };
    /**
     * Main method of the BindingLocator which will setup the necessary bindings for each of the components contained by the BindingLocator.
     * This method will:
     *  1. For each of the component contained, it will generate all the configuration needed.
     *  2. For each of the configuration, it will create all the bindings object needed.
     *  3. For each of the binding, it will synchronize all the properties.
     *  4. For each of the binding, it will make sure that the properties of a binding are always synchronized.
     */
    BindingLocator.prototype.startBindings = function () {
        this.generateConfigurations();
        this.createBindings();
        this.synchrnonizeAllProperties();
        this.registerChanges();
    };
    /**
     * Method to addBinding after the initialize time. This is used to add a binding for an application after the plugin has been initialized.
     *
     * @param {SpeakComponent} component, the component for which you will add the binding
     * @param {configuration}, a JSON configuration syntax ( same as the one sent by the server )
     *
     * Configuration example:
     * ```javascript
     *   {
     *      "text": "XBinding2.text"
     *   }
     * ```
     */
    BindingLocator.prototype.addBinding = function (component, configuration) {
        var bindingConfig = new bindingConfigurationBuilder_1.BindingConfigurationBuilder(component, configuration, true, this.converter, this.speakUtils, this.utils, false, false, this.context), bindingConfigurationForAComponent = bindingConfig.generate();
        this.bindingConfigurations.push(bindingConfig);
        var binding = new binding_1.Binding(bindingConfigurationForAComponent, this.utils);
        binding.synchronize();
        binding.registerChanges();
        this.Bindings.push(binding);
    };
    return BindingLocator;
})();
exports.BindingLocator = BindingLocator;

}).call(this,require("ngpmcQ"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/bindinglocator.js","/")
},{"./binding":1,"./bindingConfigurationBuilder":2,"buffer":7,"ngpmcQ":10}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/// <reference path='../typings/speak/sitecore.d.ts' />
var ConverterApi = (function () {
    function ConverterApi() {
        this.converters = {};
    }
    /**
     * getConverter
     *
     * Method which retuns the appropriate converter for a given name ('has', 'not',...)
     *
     * @param {string} converterName
     */
    ConverterApi.prototype.getConverter = function (converterName) {
        var converter = this.converters[converterName];
        if (!converter) {
            return undefined;
        }
        return converter;
    };
    /**
     * createBindingConverter
     *
     * Register the converter to the converter API. After the converter has been added, it can be used in the bindings.
     *
     * @params {IConverter} a converter object.
     */
    ConverterApi.prototype.createBindingConverter = function (convert) {
        if (!convert.name || !convert.convert) {
            throw "invalid binding converter";
        }
        if (this.converters[convert.name]) {
            throw "already a converter with the same name";
        }
        this.converters[convert.name] = convert.convert;
    };
    return ConverterApi;
})();
exports.ConverterApi = ConverterApi;
;

}).call(this,require("ngpmcQ"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/converter.js","/")
},{"buffer":7,"ngpmcQ":10}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/// <reference path='../typings/speak/sitecore.d.ts' />
/// <reference path='../typings/node/node.d.ts' />
var isBrowser = (typeof window !== "undefined"), hasGlobalSitecore = isBrowser && window.Sitecore, speakGlobal = hasGlobalSitecore ? window.Sitecore.Speak : global, speakUtils = speakGlobal.utils, isDebug = speakGlobal.isDebug();
var index_1 = require("./utils/index");
var converter_1 = require("./converter");
var bindinglocator_1 = require("./bindinglocator");
var utils = new index_1.Utils(isDebug);
var converter = new converter_1.ConverterApi();
var preBindings = [];
var BindingLocators = [];
speakGlobal.module("bindings", {
    applyBindings: function (data, config, app, cb) {
        var currentLocator = speakUtils.array.find(BindingLocators, function (bindingLocator) {
            return bindingLocator.app === app;
        });
        if (!currentLocator) {
            preBindings.push({
                data: data,
                config: config,
                app: app,
                cb: cb
            });
            return;
        }
        data.app = app;
        currentLocator.locator.addBinding(data, config);
    },
    createBindingConverter: converter.createBindingConverter.bind(converter)
});
speakGlobal.module("bindings").createBindingConverter({
    name: "Has",
    convert: function (array) {
        if (array && array[0]) {
            if (Array.isArray(array[0])) {
                if (array[0].length === 0) {
                    return false;
                }
                return true;
            }
            return true;
        }
        return false;
    }
});
speakGlobal.module("bindings").createBindingConverter({
    name: "Not",
    convert: function (array) {
        return !(array && array[0]);
    }
});
speakGlobal.plugin({
    name: "bindings",
    /**
     * Method which takes an application and setup the binding for each of the component.
     *
     * @params {app} Application where to look up for components.
     * @params {context} object that will play the role of the context ( for $data binding ).
     */
    extendApplication: function (app, context) {
        var bindingLocator = new bindinglocator_1.BindingLocator(app.components, converter, speakUtils, utils, context);
        var preBindingsForCurrentApp = preBindings.filter(function (pre) {
            return pre.app === app;
        });
        preBindingsForCurrentApp.forEach(function (preBindingInfo) {
            if (preBindingInfo.data) {
                preBindingInfo.data.app = app;
                bindingLocator.addBinding(preBindingInfo.data, preBindingInfo.config);
                if (preBindingInfo.cb) {
                    preBindingInfo.call(window);
                }
            }
        });
        bindingLocator.startBindings();
        BindingLocators.push({
            app: app,
            locator: bindingLocator
        });
    }
});

}).call(this,require("ngpmcQ"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_3b845b55.js","/")
},{"./bindinglocator":3,"./converter":4,"./utils/index":6,"buffer":7,"ngpmcQ":10}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/// <reference path='../../typings/speak/sitecore.d.ts' />
/**
 * Find the firt composite component from a given component.
 * This is used to create the correct scope for the binding.
 */
var findParentComposite = function (component) {
    var $component = component.parent;
    if (!$component) {
        return void 0;
    }
    return $component.isComposite ? $component : findParentComposite(component);
};
/*
 * hasOwnProperty cache
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
/*
 * Check if 'something' (an object, array, value) is empty.
 * @params {obj} a Javascript object, array, value
 */
function isEmpty(obj) {
    // null and undefined are "empty"
    if (obj == null)
        return true;
    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)
        return false;
    if (obj.length === 0)
        return true;
    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key))
            return false;
    }
    return true;
}
/**
 * Find a component based on an application and the full name of the component.
 *
 * @params {SpeakBaseModel} application where to look up the component
 * @params {String} the full name of the component
 *
 * @return {SpeakComponent} return the component found.
 */
var findComponent = function (app, componentKey) {
    var componentSplitByName = componentKey.split("."), result = app;
    if (componentSplitByName.length === 1) {
        return app[componentKey];
    }
    var foundComp = false;
    var i = 0;
    var componentSplitByNameLength = componentSplitByName.length;
    while (!foundComp && i < componentSplitByNameLength) {
        var compName = componentSplitByName.shift();
        if (!result[compName]) {
            foundComp = true;
        }
        else {
            result = result[compName];
            i++;
        }
    }
    return result;
};
/**
 * Utils module for the binding plugin.
 *
 * @params {Boolean} Passed by the Sitecore.Speak object to indicate if the current Page is in debug mode.
 */
var Utils = (function () {
    function Utils(isDebug) {
        isDebug = isDebug;
    }
    /**
     * Use console.log only when in debug mode to avoid checking the value each time you want to log something.
     *
     * @params {String} the message you want to output
     * @params {String} the method you want to use from the console object ( log, warn, info ).
     */
    Utils.prototype.printDebug = function (message, typeOfMessage) {
        if (typeOfMessage === void 0) { typeOfMessage = "log"; }
        if (this.isDebug) {
            console[typeOfMessage](message);
        }
    };
    /**
     * Check if a given property ( by name ) is a property from the component.
     * Property means that it is defined on the component definition in Sitecore.
     *
     * @params {SpeakComponent} the component where to lookup the properties
     * @params {String} the property name to check if it is a component property.
     *
     * @return {Boolean} true or false
     */
    Utils.prototype.isComponentProperty = function (component, property) {
        if (component.set && (property in component.__properties)) {
            return true;
        }
        return false;
    };
    /**
     * Static method to lower the case of the 1st character for a string ( TestString => testString ).
     * @params {string} a string
     *
     * @return {string} the manipulated string
     */
    Utils.prototype.lowerCaseFirstLetter = function (str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    };
    /**
     * Static method to find the root Component from another Component ( can be null ).
     * Composite component if it exists set the scope of the Binding.
     *
     * @params {SPeakComponent} the component which will act as a base to find the composite.
     * @params {String} the full name of the current component.
     *
     * @return {SpeakBindingCompositeDescription} a SpeakBindingCompositeDescription which is composed by
     * {
     *      component //the composite component
     *      addedProperty //the property that will be used for the binding
     *      fullCompName //the full name of the composite component ( replace the $component by the real name )
     * }
     *
     */
    Utils.prototype.findParentCompositeComponent = function (component, compToFindFullName) {
        var compositeComponent = findParentComposite(component);
        if (!compositeComponent) {
            return;
        }
        var compToFindFullNameParts = compToFindFullName.split(".");
        if (compToFindFullName.indexOf("$component") > -1) {
            compToFindFullNameParts.shift();
        }
        var compToFindFullNamePartsLength = compToFindFullNameParts.length;
        var realCompFullName = compositeComponent.id;
        var parent = compositeComponent;
        var index = 0;
        var findChildrenComponent = function (c) {
            if (c.id === current) {
                index++;
                parent = c;
                realCompFullName = realCompFullName + "." + c.id;
            }
        };
        for (var i = 0; i < compToFindFullNamePartsLength; i++) {
            var current = compToFindFullNameParts.shift();
            compositeComponent.children.forEach(findChildrenComponent);
            if (!parent) {
                throw new Error("Could not find binding for " + component.id + " looking for " + compToFindFullName);
            }
        }
        if (index === compToFindFullNamePartsLength) {
            return {
                component: parent,
                addedProperty: void 0,
                fullCompName: realCompFullName
            };
        }
        var addedProperty = compToFindFullName.split(".").slice(0 - (compToFindFullNamePartsLength - index));
        return {
            component: parent,
            addedProperty: addedProperty,
            fullCompName: realCompFullName
        };
    };
    /**
     * Methods which take the full name of a component with a property and return the component name and the attribute name.
     * This is important as you can have nested properties and nested components which makes it difficult to differenciate the property and the component.
     *
     * @params {String} full name of the component as ParentComponent.ChilComponent.MyComponent.MyProperty
     * @params {Boolean} if that compoennt is a 1.1 component.
     *
     * @return {Object} returns an obkect which has the component Name and the attribute name.
     */
    Utils.prototype.getFullComponentNameAndAttribute = function (nameWithAttribute, depricated) {
        var onlyCompName = nameWithAttribute.split("."), attribute = onlyCompName.pop(), compName;
        if (Array.isArray(onlyCompName) && onlyCompName.length > 1) {
            compName = onlyCompName.join(".");
        }
        else {
            compName = onlyCompName[0];
        }
        return {
            fullCompName: compName,
            attribute: depricated ? this.lowerCaseFirstLetter(attribute) : attribute
        };
    };
    /**
     * Get the component and the binding metaData from a component and its full name.
     *
     * @params {SpeakComponent} the component to create the metadata
     * @params {string} the full property name
     * @params {SpeakBaseModel} the currenet application
     * @params {SpeakBaseModel} data ( used when you want to bind data and not component )
     * @params {any} context used by the binding ( $data )
     *
     * For example, nameWithAttribute can be:
     *
     *     - CompName.PropertyName
     *     - ParentName.CompName.PropertyName
     *     - CompName.PropertyName.PropertyName
     *     - ParentName.CompName.PropertyName
     *     - $app.CompName.text
     *     - $component.CompName.text
     *
     * @return {SpeakBindingDescription} Return the description of the component used for the bindings.
     */
    Utils.prototype.getComponentAndBindingMetaData = function (receiveComponent, nameWithAttribute, app, data, context) {
        var compMetaData = this.getFullComponentNameAndAttribute(nameWithAttribute), //first call assume, only one property at the end
        compNameParts = compMetaData.fullCompName.split("."), itemLength = compNameParts.length, addedProperty = [], comp;
        if (data) {
            return {
                component: data,
                attribute: compMetaData.attribute,
                fullCompName: compMetaData.fullCompName
            };
        }
        if (compMetaData.fullCompName.indexOf("$data") === 0 && context.isScoped) {
            var keys = Object.keys(context.data);
            if (keys.length > 0) {
                var compName = keys[0];
                var found = false;
                var component = receiveComponent;
                while (!found && component.parent) {
                    if (component.id === compName) {
                        found = true;
                        context = context.data[compName];
                    }
                    else {
                        component = component.parent;
                    }
                }
                if (found) {
                    compNameParts.shift();
                    itemLength--;
                    while (itemLength--) {
                        addedProperty.push(compNameParts.pop());
                    }
                    return {
                        component: context,
                        attribute: (addedProperty.length > 0) ? addedProperty.reverse().join(".") + "." + compMetaData.attribute : compMetaData.attribute,
                        fullCompName: compMetaData.fullCompName
                    };
                }
                else {
                    return void 0;
                }
            }
        }
        if (compMetaData.fullCompName.indexOf("$data") === 0 && !context.isScoped) {
            compNameParts.shift();
            itemLength--;
            while (itemLength--) {
                addedProperty.push(compNameParts.pop());
            }
            return {
                component: context.data,
                attribute: (addedProperty.length > 0) ? addedProperty.reverse().join(".") + "." + compMetaData.attribute : compMetaData.attribute,
                fullCompName: compMetaData.fullCompName
            };
        }
        if (compMetaData.fullCompName === "$app") {
            return {
                component: app,
                attribute: compMetaData.attribute,
                fullCompName: compMetaData.fullCompName
            };
        }
        var componentFromCompositeDetails = this.findParentCompositeComponent(receiveComponent, compMetaData.fullCompName);
        if (compMetaData.fullCompName.indexOf("$app") <= -1 && (componentFromCompositeDetails || compMetaData.fullCompName.indexOf("$component") === 0)) {
            var componentFromComposite = componentFromCompositeDetails.component;
            var attribute = compMetaData.attribute;
            if (componentFromCompositeDetails.addedProperty) {
                attribute = componentFromCompositeDetails.addedProperty.join(".") + "." + compMetaData.attribute;
            }
            return {
                component: componentFromComposite,
                attribute: attribute,
                fullCompName: componentFromCompositeDetails.fullCompName
            };
        }
        if (compMetaData.fullCompName.indexOf("$app") === 0) {
            compNameParts.shift();
            itemLength--;
        }
        while (itemLength--) {
            comp = findComponent(app, compNameParts.join("."));
            addedProperty.push(compNameParts.pop());
            if (comp.app) {
                break;
            }
        }
        return {
            component: comp,
            attribute: (addedProperty.length > 0) ? addedProperty.reverse().join(".") + "." + compMetaData.attribute : compMetaData.attribute,
            fullCompName: compNameParts ? compNameParts.join(".") : void 0
        };
    };
    /**
     * Get the full name of a component based on a component object.
     *
     * @param {SpeakComponent} a component
     *
     * @return {String} the full name of the component.
     */
    Utils.prototype.getFullComponentNameFromComponent = function (comp) {
        var memo = comp, result = comp.id;
        while (memo.parent) {
            result = memo.parent.id + "." + result;
            memo = memo.parent;
        }
        return result;
    };
    /**
     * A specialized forEach to be looped only on the properties ( meaning the property defined in Sitecore ) of the component.
     */
    Utils.prototype.forEachPropertyWithBinding = function (config, callback) {
        Object.keys(config).forEach(function (property) {
            if (property !== "$data") {
                callback(property, config[property]);
            }
        });
    };
    /**
     * Get the value to set to your component's property based on a BindingSetup.
     */
    Utils.prototype.getValue = function (binding) {
        var value;
        var isLateBinding = false;
        var self = this;
        if (binding.converter) {
            var parameters = [];
            binding.from.forEach(function (setup) {
                var parameterFromResovle = self.resolve(setup.component, setup.attribute);
                parameters.push(parameterFromResovle.component[parameterFromResovle.lastProperty]);
            });
            return {
                value: binding.converter(parameters),
                isLateBinding: isLateBinding
            };
        }
        var singleModel = binding.from[0].component, attr = binding.from[0].attribute;
        if (this.isComponentProperty(singleModel, attr)) {
            if (singleModel.depricated) {
                attr = this.lowerCaseFirstLetter(attr);
            }
            value = singleModel.get(attr);
        }
        else {
            var res = this.resolve(singleModel, attr);
            if (!res.isLateBinding) {
                value = res.component[res.lastProperty];
            }
            else {
                isLateBinding = res.isLateBinding;
            }
        }
        this.printDebug("      we set the value to: " + value);
        return {
            value: value,
            isLateBinding: isLateBinding
        };
    };
    /**
     * Resovling the value of a compoennt's property ( even nested )
     *
     * @params {SpeakComponent} component where to lookup the property
     * @params {String} the full property name
     *
     * @return an object like
     *
     * {
     *    component: comp,
     *    lastProperty: lastProperty
     * }
     */
    Utils.prototype.resolve = function (component, to) {
        var isLateBinding = false;
        var latestExistingComponent;
        if (to.indexOf(".") === -1) {
            return {
                component: component,
                lastProperty: to,
                isLateBinding: isLateBinding,
                latestExistingProperty: to,
                latestExistingComponent: latestExistingComponent
            };
        }
        var latestExistingProperty = "";
        var latestExistingComponents = [component];
        var toAttributeParts = to.split(".");
        var lastProperty = toAttributeParts.pop();
        var latestExistingProperties = [];
        var toAttributePartslength = toAttributeParts.length;
        var comp = component;
        for (var i = 0; i < toAttributePartslength; i++) {
            var current = comp[toAttributeParts[i]];
            if (current && !isEmpty(current)) {
                comp = current;
                latestExistingComponents.push(comp);
            }
            else {
                if (comp.hasOwnProperty(toAttributeParts[i])) {
                    latestExistingProperties.push(toAttributeParts[i]);
                }
            }
        }
        latestExistingProperties.push(lastProperty);
        latestExistingProperties.reverse();
        var numberExistingComponents = latestExistingComponents.length;
        var numberExistingProperties = latestExistingProperties.length;
        while ((latestExistingComponents.length > 0 || latestExistingProperties.length > 0) && (!latestExistingComponent || !latestExistingComponent.hasOwnProperty(latestExistingProperty))) {
            if (latestExistingComponents.length > 0) {
                latestExistingComponent = latestExistingComponents.pop(); //we go one level up as the latest existing component will never receive the change event ( the proeprty is unknown at this stage )    
            }
            if (latestExistingProperties.length > 0) {
                latestExistingProperty = latestExistingProperties.shift(); //we go one level up for the property, same principle than from the component.                
            }
        }
        return {
            component: comp,
            lastProperty: lastProperty,
            isLateBinding: (!(comp === latestExistingComponent)) || (numberExistingComponents < numberExistingProperties),
            latestExistingProperty: latestExistingProperty,
            latestExistingComponent: latestExistingComponent //that latest existing component ( where to listen ) ( this might change depending on timing )
        };
    };
    return Utils;
})();
exports.Utils = Utils;

}).call(this,require("ngpmcQ"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/utils\\index.js","/utils")
},{"buffer":7,"ngpmcQ":10}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("ngpmcQ"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\buffer\\index.js","/..\\..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\buffer")
},{"base64-js":8,"buffer":7,"ieee754":9,"ngpmcQ":10}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("ngpmcQ"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\buffer\\node_modules\\base64-js\\lib\\b64.js","/..\\..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\buffer\\node_modules\\base64-js\\lib")
},{"buffer":7,"ngpmcQ":10}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("ngpmcQ"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\buffer\\node_modules\\ieee754\\index.js","/..\\..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\buffer\\node_modules\\ieee754")
},{"buffer":7,"ngpmcQ":10}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("ngpmcQ"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\process\\browser.js","/..\\..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\process")
},{"buffer":7,"ngpmcQ":10}]},{},[5])
/**!
 *
 * koPresenter
 *
 * Built: Wed Mar 16 2016 13:15:11 GMT+0100 (Romance Standard Time)
 * PackageVersion: 0.0.15
 *
 */

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var computeComments = function ( el, callback ) {
  function traverseDom( curr_element ) { // this is the recursive function
    // base case: node is a comment node
    if ( curr_element.nodeType === 8 ) {
      // You need this OR because some browsers won't support either nodType or nodeName... I think...
      callback( curr_element );
    }
    // recursive case: node is not a comment node
    else if ( curr_element.childNodes.length > 0 ) {
      for ( var i = 0; i < curr_element.childNodes.length; i++ ) {
        // adventures with recursion!
        traverseDom( curr_element.childNodes[ i ], callback );
      }
    }
  }
  return traverseDom( el, callback );
};

module.exports = {
  computeComments: computeComments
};
},{}],2:[function(require,module,exports){

module.exports = function( sitecore, ko ) {
  return require( "./ko" )( sitecore, ko );
}
},{"./ko":3}],3:[function(require,module,exports){
var DOMUtils = require( "./dom" );

module.exports = function( sitecore, ko ) {

  var markAsRegistered = function( comp ) {
    if ( !comp.el ) {
      return;
    }

    var bindingsElement = [ comp.el ],
      nestedBinding = sitecore.utils.array.toArray( comp.el.querySelectorAll( "[data-bind]" ) );

    bindingsElement = bindingsElement.concat( nestedBinding );

    bindingsElement.forEach( function( el ) {
      el.__registered = true;
    } );

    DOMUtils.computeComments( comp.el, function( el ) {
      el.__registered = true;
    } );

    comp.el.__registered = true;
  };

  /**
   * Setup ko
   */
  var SPEAKBindingProvider = function() {
    var result = new ko.bindingProvider(),
      originalHasBindings = result.nodeHasBindings;

    result.nodeHasBindings = function( node ) {
      if ( !node.__registered ) {
        return originalHasBindings.call( this, node );
      }
      return false;
    };

    return result;
  };

  return {
    markAsRegistered: markAsRegistered,
    SPEAKBindingProvider: SPEAKBindingProvider
  };
};
},{"./dom":1}],4:[function(require,module,exports){
var skip = {
    el: 1,
    id: 1,
    key: 1,
    script: 1,
    template: 1,
    depth: 1,
    ko: 1,
    app: 1,
    parent: 1,
    on: 1,
    trigger: 1,
    once: 1,
    listenToOnce: 1,
    listenTo: 1,
    off: 1,
    children: 1,
    __properties: 1,
    processSubscribers: 1,
    _s: 1,
    viewModel: 1,
    __parameterTemplates: 1,
    _events: 1,
    computed: 1,
    get: 1,
    set: 1,
    _subscriptions: 1,
    __getComputedValues: 1,
    __triggerForComputed: 1,
    defineProperties: 1,
    defineProperty: 1
};

module.exports = {
    skip: skip
};

},{}],5:[function(require,module,exports){
( function( ) {

    var isBrowser = ( typeof window !== "undefined" ),
        ko = window.ko || requirejs( "knockout" ),
        sitecore = isBrowser && window.Sitecore ? window.Sitecore.Speak : requirejs( "boot" ),
        _forEachValidProperty = require("./utils/utils").forEachValidProperty,
        koUtils = require( "sc-kospeakbindingprovider" )( sitecore, ko ),
        compHelper = require( "./utils/component" )( ko ),
        vmHelper = require( "./utils/viewModel" )( ko, compHelper.updateComponentWhenViewModelChange ),
        isDebug = Sitecore.Speak.isDebug( ),
        _printDebug = function( string, type ) {
            if ( !type ) {
                type = "log";
            }

            if ( isDebug ) {
                console[ type ]( string );
            }
        };

    var syncModelandViewModel = function( key, component, viewModel, force ) {
            vmHelper.updateViewModelWhenComponentChange( key, component, viewModel );
            compHelper.updateComponentWhenViewModelChange( key, component, viewModel, force );
        },
        _buildViewModel = function( component, viewModel, force ) {

            _printDebug( "Create ViewModel for Component: " + component.id );

            _forEachValidProperty( component, function( key ) {

                vmHelper.buildPropertyForViewModel( key, component, viewModel, force );

                syncModelandViewModel( key, component, viewModel, force );
            } );

            vmHelper.buildComputed( component, viewModel );
            compHelper.syncComputed(component, viewModel);
            
            _printDebug( "Finish creating ViewModel " + component.id + ", result is:" );
            _printDebug( viewModel );

        };

    //to prevent registering the same component multiple times
    ko.bindingProvider.instance = new koUtils.SPEAKBindingProvider( );

    Sitecore.Speak.module( "scKoPresenter", {
        buildViewModel: function( object ) {
            object.viewModel = object.viewModel || {};
            _buildViewModel( object, object.viewModel, true );
        }
    } );

    Sitecore.Speak.presenter( {
        name: "scKoPresenter",
        updateViewModel: function( ) {
            _buildViewModel( this, this.viewModel, true );
        },
        initialized: function( ) {

            //Setup container for the ViewModel
            this.viewModel = this.viewModel || {};
            this._subscriptions = {}; //store subscription

            _buildViewModel( this, this.viewModel, true );

            this.viewModel.app = this.app;

            if ( !this.hasTemplate ) {

                _printDebug( "Applying bindings for component: " + this.id );
                _printDebug( "Dom element for " + this.id + " is:" );
                _printDebug( this.el );

                ko.applyBindings( this.viewModel, this.el );
                koUtils.markAsRegistered( this );
            }
        }
    } );
} )( );

},{"./utils/component":6,"./utils/utils":8,"./utils/viewModel":9,"sc-kospeakbindingprovider":2}],6:[function(require,module,exports){
module.exports = function(ko) {

    var syncUtils = require("./sync")(ko);
    var conf = require("../conf");
    var skipkeys = conf.skip;
    var syncObject = function(component, viewModel) {
        for (var key in component) {
            if (component.hasOwnProperty(key) && !skipkeys[key]) {
                updateComponentWhenViewModelChange(key, component, viewModel);
            }
        }
    };

    var capitalize = function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    var updateComponentWhenViewModelChange = function(key, component, viewModel) {
        if (viewModel[key].arrayBinding) {
            component._subscriptions[key] = syncUtils.syncFromKoObsToSpeakObs(key, component, viewModel, ko);
            var koArr = viewModel[key]();
            if (koArr.length > 0 && component[key].array && component[key].array[0] instanceof SpeakBaseModel) {
                koArr.forEach(function(kElem, i) {
                    var modelElem = component[key].array[i];

                    syncObject(modelElem, kElem);
                });
            }
        } else if (viewModel[key].bindableBinding && !skipkeys[key]) {
            var vmBindable = viewModel[key];
            for (var i in vmBindable) {
                if (vmBindable.hasOwnProperty(i)) {
                    updateComponentWhenViewModelChange(i, component[key], vmBindable);
                }
            }
        } else {
            if (ko.isObservable(viewModel[key])) {
                var func = syncUtils.updateComponent(key, component, viewModel);
                component._subscriptions[key] = viewModel[key].subscribe(func);
            }
        }
    },
    syncComputed = function(component, viewModel) {
        var computedConfiguration = component.computed || {},
                keys = Object.keys(computedConfiguration),
                propertiesConfiguration = component.__properties,
                keysProperties = Object.keys(propertiesConfiguration);
                

            keys.forEach(function(key) {
                component.on("change:" + capitalize(key), function() {
                    viewModel.$updateComputedCount += 1;
                    viewModel.$updateComputed(viewModel.$updateComputedCount);
                });
            });

            keysProperties.forEach(function(key) {
                component.on("change:" + capitalize(key), function() {
                    viewModel.$updateComputedCount += 1;
                    viewModel.$updateComputed(viewModel.$updateComputedCount);
                });
            });
    };

    return {
        updateComponentWhenViewModelChange: updateComponentWhenViewModelChange,
        syncComputed: syncComputed
    };
};

},{"../conf":4,"./sync":7}],7:[function(require,module,exports){
var utils = require("./utils");

module.exports = function(ko, vmHelper) { //keep reference to ko
    var updateViewModel = function(key, model, viewModel) {
            return function() {
                if (Array.isArray(model[key])) {
                    //should desable the 
                    viewModel[key]._changing = true;
                    if (viewModel[key]().length > 0) {
                        viewModel[key].removeAll();
                    }

                    model[key].forEach(function(i) {
                        viewModel[key].push(i);
                    });
                    viewModel[key]._changing = false;
                    return;
                }

                if (!Array.isArray(model[key])) {
                    viewModel[key](model[key]);
                }
            };
        },
        syncAddFromOriginalArrayToKoObs = function( key, model, viewModel ) {
            return function( value ) {
                viewModel[key]._changing = true;
                
                viewModel[key].push( value );

                viewModel[key]._changing = false;
                return;
            };
        },
        syncRemoveFromOriginalArrayToKoObs = function ( key, model, viewModel ) {
            return function( value ) {
                viewModel[key]._changing = true;
                
                viewModel[key].remove( value );

                viewModel[key]._changing = false;
                return;
            };
        },
        syncFromSpeakObsToKoObs = function(key, model, viewModel, buildBindableViewModel, updateViewModelWhenComponentChange, updateComponentWhenViewModelChange) {
            var appropriateFunc = function(funcToCall) {
                var callToCall = funcToCall;

                return function(value) {
                    if (!viewModel[key]._changing) {
                        viewModel[key]._changing = true;
                        if( value instanceof SpeakBaseModel) {
                            var vm = buildBindableViewModel(value, model);

                            viewModel[key][callToCall].apply(viewModel[key], [vm]);

                            utils.forEachValidProperty( value, function( key ) {
                                if(value.hasOwnProperty(key)) {
                                  updateViewModelWhenComponentChange( key, value, vm );
                                  updateComponentWhenViewModelChange( key, value, vm );
                                }
                            } );
  
                        } else {
                            viewModel[key][callToCall].apply(viewModel[key], arguments);
                        }

                        viewModel[key]._changing = false;
                    }
                };
            };

            model[key].on("push", appropriateFunc("push"));
            model[key].on("pop", appropriateFunc("pop"));
            model[key].on("slice", appropriateFunc("slice"));
            model[key].on("concat", appropriateFunc("concat"));
            model[key].on("shift", appropriateFunc("shift"));
            model[key].on("unshift", appropriateFunc("unshift"));
            model[key].on("reverse", appropriateFunc("reverse"));
            model[key].on("sort", appropriateFunc("sort"));
            model[key].on("remove", function( item ) {
                if (!viewModel[key]._changing) {
                        viewModel[key]._changing = true;
                        viewModel[key].splice(item, 1);
                        viewModel[key]._changing = false;
                }
            });
            //model[key].on("splice", appropriateFunc("splice"));
        },
        syncFromKoObsToSpeakObs = function(key, model, viewModel) {
            var previousValue;

            viewModel[key].subscribe(function(_previousValue) {
                previousValue = _previousValue.slice(0);
            }, undefined, "beforeChange");

            return viewModel[key].subscribe(function(latestValue) {

                var editScript = ko.utils.compareArrays(previousValue, latestValue);

                //viewModel[ key ]._changing = false;
                for (var i = 0, j = editScript.length; i < j; i++) {
                    var index = ko.utils.arrayIndexOf(model[key].array || model[key], editScript[i].value);

                    switch (editScript[i].status) {
                        case "retained":
                            break;
                        case "deleted":
                            if (index >= 0 && !viewModel[key]._changing) {
                                model[key].splice(index, 1);
                            }
                            break;
                        case "added":
                            if (!viewModel[key]._changing) {
                                if (editScript[i].index === 0) {
                                    model[key].unshift(editScript[i].value);
                                } else {
                                    model[key].push(editScript[i].value);
                                }
                            }
                            break;
                    }
                }
                if (!model[key].array && !viewModel[key]._changing) { //this is an original, should manually trigger the change
                    model.trigger("change:" + key, model.get(key));
                    viewModel[key]._changing = false;
                }
                previousValue = undefined;
            });
        },
        updateComponent = function(key, model, viewModel) {
            return function(newValue) {
                if (!viewModel[key]._changing) {
                    model[key] = newValue;
                }
            };
        };

    return {
        updateViewModel: updateViewModel,
        syncFromSpeakObsToKoObs: syncFromSpeakObsToKoObs,
        syncFromKoObsToSpeakObs: syncFromKoObsToSpeakObs,
        updateComponent: updateComponent,
        syncAddFromOriginalArrayToKoObs: syncAddFromOriginalArrayToKoObs,
        syncRemoveFromOriginalArrayToKoObs: syncRemoveFromOriginalArrayToKoObs
    };
};

},{"./utils":8}],8:[function(require,module,exports){
var conf = require( "../conf" ),
    skipkeys = conf.skip;

module.exports = {
    forEachValidProperty: function( component, callback ) {
        for ( var i in component ) { //no check if hasOwnProperty on purpose
            if ( !skipkeys[ i ] ) {
                callback( i );
            }
        }
    }
};
},{"../conf":4}],9:[function(require,module,exports){
module.exports = function(ko, updateComponentWhenViewModelChange) {

    var syncUtils = require("./sync")(ko, this);
    var conf = require("../conf"),
        skipkeys = conf.skip;

    var buildComputed = function(model, viewModel) {
            var computedConfiguration = model.computed || {},
                keys = Object.keys(computedConfiguration);

            viewModel.$updateComputed = ko.observable();
            viewModel.$updateComputedCount = viewModel.$updateComputedCount || 0;
            keys.forEach(function(key) {
                var computed = computedConfiguration[key];

                if (computed["write"] && !computed["owner"]) {
                    computed["owner"] = model;
                }

                if (!computed.write) {
                    viewModel[key] = ko.computed(function(){
                        //this will make a deps to be able to manually recalculate computed.
                        var makeADeps = this.viewModel.$updateComputed();

                        return computed.read.apply(this, arguments);
                    }, model); //be carefully you can only value already defined
                } else {
                    viewModel[key] = ko.computed({
                        read: function() {
                            var makeADeps = this.viewModel.$updateComputed();

                            return computed.read.apply(this, arguments);
                        },
                        owner: model,
                        write: function () {
                            computed.write.apply(this, arguments);
                            viewModel.$updateComputedCount += 1;
                            viewModel.$updateComputed(viewModel.$updateComputedCount);
                        }
                    }); //be carefully you can only value already defined
                }
                viewModel[key].isComputed = true;
            });
        },
        updateViewModelWhenComponentChange = function(key, component, viewModel) {
            var model = component;

            if (typeof model[key] === "function") {
                return;
            }
            if (skipkeys[key]) {
                return;
            }

            if (viewModel[key].arrayType !== "speak") {
                model.on("add:" + key, syncUtils.syncAddFromOriginalArrayToKoObs( key, component, viewModel ));
                model.on("remove:" + key, syncUtils.syncRemoveFromOriginalArrayToKoObs( key, component, viewModel ));


                if (model[key] instanceof SpeakBaseModel) {
                    var bindable = model[key];
                    for (var i in bindable) {
                        if (bindable.hasOwnProperty(i)) {
                            updateViewModelWhenComponentChange(i, bindable, viewModel[key]);
                        }
                    }
                } else {
                    model.on("change:" + key, syncUtils.updateViewModel(key, model, viewModel));
                }
            } else {
                //this will sync both array from Model and viewModel
                syncUtils.syncFromSpeakObsToKoObs(key, model, viewModel, buildBindableViewModel, updateViewModelWhenComponentChange, updateComponentWhenViewModelChange);
                var speakobs = model[key];

                if (speakobs.length > 0) {
                    speakobs.forEach(function(single, index) {
                        var vm = viewModel[key]()[index];
                        syncModelWithKo(single, model, vm);
                    });
                }
            }
        },
        syncModelWithKo = function(bindable, component, vm) {
            for (var key in bindable) {
                if (bindable.hasOwnProperty(key)) {
                    if (!skipkeys[key]) {
                        updateViewModelWhenComponentChange(key, bindable, vm);
                    }
                }
            }
        },
        buildBindableViewModel = function(bindable, component) {
            var subVM = {};
            bindable._subscriptions = {};
            subVM._subscriptions = {};
            for (var key in bindable) {
                if (bindable.hasOwnProperty(key)) {
                    bindable._s = component._s; //ok that is odd.
                    if (!skipkeys[key]) {
                        buildPropertyForViewModel(key, bindable, subVM);
                    }
                }
            }
            return subVM;
        },
        buildPropertyForViewModel = function(key, component, viewModel, force) {
            var vm = viewModel,
                value = component[key],
                isSPEAKObs = (value && value.array),
                isArray = Array.isArray(value),
                arrayToBind;

            if (vm[key] && !force) { //if we do not force and key already exists, we skip it
                return;
            }

            if (isArray || isSPEAKObs) { //if it is an array
                arrayToBind = isSPEAKObs ? value.array : value;
                //here create viewModel
                var copy = arrayToBind.slice(0);
                if (copy.length > 0 && copy[0] instanceof SpeakBaseModel) {
                    var copyKo = [];

                    copy.forEach(function(speakBaseModel) {
                        copyKo.push(buildBindableViewModel(speakBaseModel, component));
                    });

                    vm[key] = ko.observableArray(copyKo);
                } else {
                    vm[key] = ko.observableArray(copy);
                }
                vm[key].arrayBinding = true;
                vm[key].arrayType = isSPEAKObs ? "speak" : "original";

            } else if (component._s.utils.is.a.function(value)) { //if it is a function

                if (!vm[key] && component._s.utils.is.a.function(value)) {
                    vm[key] = function() {
                        return component[key].apply(component, arguments);
                    };
                }
            } else if (ko.isObservable(value)) { //if it is a an observable

                vm[key] = value; //leave it alone if it is already a observable

            } else if (value instanceof SpeakBaseModel) { //this is a bindable
                vm[key] = buildBindableViewModel(value, component);
                vm[key].bindableBinding = true;
            } else { //then it is a regular property
                vm[key] = ko.observable(value);
            }
        };

    return {
        buildPropertyForViewModel: buildPropertyForViewModel,
        updateViewModelWhenComponentChange: updateViewModelWhenComponentChange,
        buildComputed: buildComputed,
        buildBindableViewModel: buildBindableViewModel
    };
};

},{"../conf":4,"./sync":7}]},{},[5])
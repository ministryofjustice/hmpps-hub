!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.SpeakObservableArray=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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
    var allEvents = this._events.all;
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
},{}],2:[function(_dereq_,module,exports){
var Events = _dereq_("speakevent"),
    keys = Object.getOwnPropertyNames(Array.prototype);

var ObservableArray = function ObservableArray(arr) {
    //TODO: could use array.prototype.push to get an "indexed" array.
    this.array = arr;
};

ObservableArray.prototype.reset = function() {
    //using PoP for event - slice is not understood by koPresenter.
    this.forEach(function() {
        this.array.pop();
    }, this);
    this.pop();
};

ObservableArray.prototype.remove = function(item) {
    var index = this.array.indexOf(item);
    if (index === -1) {
        throw "Item does not exist in array and thus cannot be removed";
    }

    this.splice(index, 1);

    this.trigger("remove", index);
};

ObservableArray.prototype.removeAt = function(index) {
    if (index < 0 || index > (this.array.length - 1)) {
        throw "Item does not exist in array and thus cannot be removed";
    }

    var item = this.array[index];

    this.splice(index, 1);

    this.trigger("remove", index);
};

ObservableArray.prototype.actionList = {
    join: ["change", "join"],
    pop: ["remove", "change", "pop"],
    slice: ["change", "slice"],
    splice: ["splice", "change"],
    push: ["add", "change", "push"],
    concat: ["add", "change", "concat"],
    shift: ["remove", "change", "shift"],
    unshift: ["add", "change", "unshift"],
    reverse: ["change", "reverse"],
    sort: ["change", "sort"]
};

keys.forEach(function(key) {
    if (key === "length") {
        return;
    }

    var action = ObservableArray.prototype.actionList[key];

    if (action && key !== "toString") {
        ObservableArray.prototype[key] = function() {
            var self = this,
                args = arguments,
                underlyingArray = this.array,
                methodCallResult = Array.prototype[key].apply(underlyingArray, arguments),
                events = this.actionList[key];

            events.forEach(function(e) {
                self.trigger(e, args[0]);
            });

            return methodCallResult;
        };
    } else {
        ObservableArray.prototype[key] = function() {
            var underlyingArray = this.array,
                methodCallResult = Array.prototype[key].apply(this.array, arguments);

            return methodCallResult;
        };
    }
});

Object.defineProperty(ObservableArray.prototype, "length", {
    get: function() {
        return this.array.length;
    },
    set: function(length) {
        var currentLength = this.array.length;

        if (length > currentLength) {
            for (var i = currentLength; i < length; i++) {
                this.push(void 0);
            }
        } else {
            this.array.length = length;
        }
    }
});

//add events to the ObservableArray
for (var prop in Events) {
    if (Events.hasOwnProperty(prop)) {
        ObservableArray.prototype[prop] = Events[prop];
    }
}

if ((typeof window !== "undefined")) {
    window.SpeakObservableArray = ObservableArray;
}

module.exports = ObservableArray;

},{"speakevent":1}]},{},[2])
(2)
});
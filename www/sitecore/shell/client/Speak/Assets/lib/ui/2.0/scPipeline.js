(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var pipelines = require( "./model/pipelines" ),
  isBrowser = typeof window !== "undefined",
  root = isBrowser ? window : module.exports;

//export the Pipeline's model via the pipelines API
pipelines.Pipeline = require( "./model/pipeline" );

var invoke = require( "./pipelines/Invoke/index" );
var serverInvoke = require( "./pipelines/ServerInvoke/index" );

pipelines.add( invoke );
pipelines.add( serverInvoke );

if ( isBrowser && root.sitecore ) {
  Sitecore.module( "pipelines", pipelines );
}

module.exports = pipelines;
},{"./model/pipeline":2,"./model/pipelines":3,"./pipelines/Invoke/index":8,"./pipelines/ServerInvoke/index":10}],2:[function(require,module,exports){
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
},{"../utils/index":12}],3:[function(require,module,exports){
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
},{"../utils/index":12}],4:[function(require,module,exports){
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
},{"../../utils/index":12}],5:[function(require,module,exports){
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
},{"../../utils/command":11,"../../utils/index":12}],6:[function(require,module,exports){
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
      sitecore.module( "pipelines" ).get( "ServerInvoke" ).execute( {
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

    xmlHttp.send( null );

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
},{"../../utils/index":12}],7:[function(require,module,exports){
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
},{"../../utils/index":12}],8:[function(require,module,exports){
var Pipeline = require( "../../model/pipeline" ),
  invokePipeline = new Pipeline( "Invoke" );

invokePipeline.add( require( "./1000-HandleJavascript" ) );
invokePipeline.add( require( "./2000-HandleCommand" ) );
invokePipeline.add( require( "./3000-ServerClick" ) );
invokePipeline.add( require( "./4000-TriggerEvent" ) );

module.exports = invokePipeline;
},{"../../model/pipeline":2,"./1000-HandleJavascript":4,"./2000-HandleCommand":5,"./3000-ServerClick":6,"./4000-TriggerEvent":7}],9:[function(require,module,exports){
var updateModel = {
  priority: 1000,
  execute: function ( context ) {
    var viewModel = context.data.ViewModel;
    if ( viewModel != null ) {
      ko.mapping.fromJS( viewModel, {}, context.model );
    }
  }
};

module.exports = updateModel;
},{}],10:[function(require,module,exports){
var Pipeline = require( "../../model/pipeline" ),
  serverInvokePipeline = new Pipeline( "ServerInvoke" );

serverInvokePipeline.add( require( "./1000-UpdateModel" ) );

module.exports = serverInvokePipeline;
},{"../../model/pipeline":2,"./1000-UpdateModel":9}],11:[function(require,module,exports){
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
},{"./index":12}],12:[function(require,module,exports){
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
      firstPath = targets[ 0 ];

    if ( firstPath === "this" ) {
      new Function( target ).call( context.control.model );
    } else if ( context.app && firstPath === "app" ) {
      var ex = target.replace( "app", "this" );
      new Function( ex ).call( context.app );
    } else {
      /*!!! dangerous zone !!!*/
      new Function( target )();
    }
  }
};

module.exports = utils;
},{}]},{},[1])
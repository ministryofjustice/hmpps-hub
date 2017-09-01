Sitecore.Event = Base.extend({
  constructor: function() {
    this._callbacks = new Array();
  },
  
  fire: function(args) {
    var length = this._callbacks.length;
    for (var i = 0; i < length; i++) {
      this._callbacks[i](args);
    }    
  },
  
  observe: function(callback) {
    if ($sc.inArray(callback, this._callbacks) > -1) {
      return;
    }
    
    this._callbacks.push(callback);
  },
  
  stopObserving: function(callback) {    
    this._callbacks = $sc.grep(this._callbacks, function(func) { return func !== callback; });    
  }
});
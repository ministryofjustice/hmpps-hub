(function (Speak) {

  define("Collection/Factory", [], function () {
    
    return {
      createBaseModel: function(initial) {
        var Model = function (data) {
          SpeakBaseModel.prototype.constructor.call(this, Speak.extend({}, initial, data));
        };
        Model.prototype.constructor = Model;

        Speak.extend(Model.prototype, SpeakBaseModel.prototype, initial);
        return Model;
      },

      createCollectionModel: function (keyProp, initial) {
        var Collection = require("bclCollection");

        var CollectionModel = function (data) {
          SpeakBaseModel.prototype.constructor.call(this, Speak.extend({}, initial, data));
          
          this.initialize();
          this.reset(data[keyProp]);
        }

        CollectionModel.prototype = Speak.extend({}, SpeakBaseModel.prototype, Collection.prototype, {
          constructor: CollectionModel,
          Model: this.createBaseModel()
        }, initial);

        return CollectionModel;
      }
    }
  });

})(Sitecore.Speak);
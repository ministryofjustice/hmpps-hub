(function (Speak) {

  define("Collection/DefaultDataParser", [], function () {

    function getParsedData(data) {
      var isJson = typeof data == "string",
        isArray = Array.isArray(data);

      return isJson ? JSON.parse(data) : isArray ? data : [];
    }

    return {
      initialized: function () {
        this.DynamicData = getParsedData(this.DynamicData); // To support Data-binding on DynamicData

        this.on("change:DynamicData", function () {
          this.reset(getParsedData(this.DynamicData));
        }, this);

        this.reset(this.DynamicData);
      }
    }

  });

})(Sitecore.Speak);
(function(Speak) {

  define("Collection/DisplayFieldName", [], function () {

    return {
      /**
       * Returns the value of the DisplayFieldName property on the given item.
       * 
       * @example
       * myComponent.DisplayFieldName = "name";
       * 
       * var newItem = { name: "Martin" };
       * myComponent.add(newItem);
       * 
       * var displayName = myComponent.getDisplayName(newItem);
       * console.log(displayName); // outputs: Martin
       * 
       * @param {Object} item - The item to get the display name from.
       * @alias Collection#getDisplayName
       */
      getDisplayName: function (item) {
        item = item[0] || item;
        return item[this.DisplayFieldName];
      }
    }

  });

})(Sitecore.Speak);
(function(Speak) {

  define("Collection/ValueFieldName", [], function () {

    return {

      /**
       * Similar to findWhere but does a search specifically on the ValueFieldName property.
       * Returns the first item that has a value matching <b>value</b>.
       * @param {*} value - The value that should be searched for.
       * @alias Collection#getByValue
       */
      getByValue: function (value) {
        var attributes = {};
        attributes[this.ValueFieldName] = value;

        return this.findWhere(attributes);
      },

      /**
       * Returns the value of the ValueFieldName property on the given item.
       * 
       * @example
       * myComponent.ValueFieldName = "age";
       * 
       * var newItem = { name: "John", age: 30 };
       * myComponent.add(newItem);
       * 
       * var value = myComponent.getValue(newItem);
       * console.log(value); // outputs: 30
       * 
       * @param {Object} item - The item to read the value field of.
       * @alias Collection#getValue
       */
      getValue: function (item) {
        item = item[0] || item;
        return item[this.ValueFieldName];
      }
    }


  });

})(Sitecore.Speak);
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
(function(Speak) {
  define('Collection/Data', ['Collection/DefaultDataParser'], function (DefaultDataParser) {

    var hasWhiteSpace = /\s+/;

    var getNewKey = function (obj, key) {
      var increment = 1;

      if (!obj.hasOwnProperty(key)) {
        return key;
      }

      while (obj.hasOwnProperty(key + increment)) {
        increment++;
      }

      return key + increment;
    }

    function cleanPropertyNames(data) {
      return _.each(data, function(val, key, obj) {
        if (hasWhiteSpace.test(key)) {
          var keyWithoutSpace = key.replace(/\s/g, "");

          obj[getNewKey(obj, keyWithoutSpace)] = val;

          delete obj[key];
        }
      });
    }

    function createModel(data) {
      // buildViewModel does not allow properties with whitespace in them, like "__updated by",
      // so we rename the property with the whitespace, and append a number if property already exists
      var model = new this.Model(cleanPropertyNames(data));

      // _s and _subscriptions added here for compatibility with buildViewModel
      model._s = Speak;
      model._subscriptions = {};
      
      Speak.module("scKoPresenter").buildViewModel(model); // creates a .viewModel property with knockout bindings
      return model;
    }
    
    return Speak.extend(DefaultDataParser, {
      Model: null, // Is set in main, using the Collection/Factory

      initialize: function() {
        /**
         * Contains a list of models wrapping the provided data.
         * 
         * @name Collection#Items
         * @type {Object[]}
         * @default []
         */
        this.defineProperty("Items", []);

        /**
         * @param { function|string } Takes either a function which will work as a sortBy (takes one param), a sort
         * (two params) or a string, which will use sortBy internally on that property. That property should be a string
         * or a number.
         */
        this.defineProperty("Comparator", null);
      },

      /**
       * If you want a new set of data to be applied to your control the reset method is a good place to start.
       * The reset method will remove all old data and replace any new given data. When used it will trigger a
       * reset event.
       * 
       * Each of the new Items will be wrapped in the Model porperty object.
       * 
       * @param {Object[]} [items] - New items that should be set instead of the old ones.
       * @alias Collection#reset
       */
      reset: function(items) {
        var newList = [];

        if (Array.isArray(items)) {
          newList = newList.concat(items);
        }

        this.trigger("beforeReset", this.Items);

        this.set("Items", newList.map(createModel, this), true);
        
        if (this.Comparator) {
          this.sort();
        }

        this.trigger("change:Items", this.Items);
        this.trigger("itemsChanged", this.Items);

        /**
         * Triggers when the reset method is called. The newly added items passed along.
         * @event Collection#reset
         * @type {Object[]}
         */
        this.trigger("reset", this.Items);
        return this.Items;
      },

      sort: function() {
        if (!this.Comparator) {
          throw new Error("Cannot sort Items without a comparator");
        }

        if (typeof this.Comparator === "string" || this.Comparator.length === 1) {
          var sorted = _.sortBy(this.Items, this.Comparator);
          this.set("Items", sorted, true);
        } else {
          this.Items.sort(this.Comparator);
        }

        this.trigger("sort", this.Items);
      },

      /**
       * Allows you to add one item to the Items property. Will trigger a change on Items.
       * It also triggers an 'add' event, if you want to know when something was specifically added.
       * 
       * @example
       * // Add one item
       * myComponent.add({ foo: "bar" });
       * 
       * @param {Object} item - The item that should be added to the end of the list.
       * @alias Collection#add
       */
      add: function(item) {
        var model = createModel.call(this, item);
        this.Items.push(model);

        if (this.Comparator) {
          this.sort();
        }

        /**
         * Triggers when add is called. The newly created model is passed along with the event.
         * @event Collection#add
         */
        this.trigger("add:Items", model, { index: ( this.Items.length - 1 ) });
        this.trigger("itemsChanged", this.Items);
        return model;
      },

    /**
     * Remove one model from the Items property. Will trigger a change on Items property.
     * It also triggers a 'remove' event, if you want to know when something was specifically removed.
     * 
     * @example
     * // Remove first model in the list
     * var item = myComponent.at(0);
     * myComponent.remove(item);
     * 
     * @param {Object} model - The model to be removed. If you try to remove a model not in the list it will throw an exception.
     * @alias Collection#remove
     */
    remove: function(model) {
      var index = this.Items.indexOf(model);
      if (index === -1)
        throw "Item does not exist and cannot be removed";

      var removed = this.Items.splice(index, 1);

      /**
       * Triggers when remove is called. The removed item is passed along.
       * @event Collection#remove
       */
      this.trigger("remove:Items", model, { index: index });
      this.trigger("itemsChanged", this.Items);
      return removed[0];
    },

    /**
     * Remove a model at a given index. Visually the models might be sorted. But this will always refer to the original pre-sorted order.
     * @param {number} index - An integer between 0 and the number of models -1. If provided index is not available it will throw an exception.
     * @alias Collection#removeAt
     */
    removeAt: function(index) {
      return this.remove(this.at(index));
    },

    /**
     * Looks through the Items list and returns the first model that matches all of the key-value pairs listed in <b>attributes</b>.
     * 
     * @example <caption>Find first model where title attribute is "The Castle".</caption>
     * var theCastle = myComponent.findWhere({ title: "The Castle" });
     * 
     * @example <caption>Find first model matching multiple attributes.</caption>
     * var john30YearOld = myComponent.findWhere({ name: "john", age: 30 });
     * 
     * @param {Object} attributes - Set of key-value pairs to match
     * @alias Collection#findWhere
     */
    findWhere: function(attributes) {
      return _.findWhere(this.Items, attributes);
    },

      /**
    * 
    * The find method executes the <b>predicate</b> function once for each model present in the Items array until it finds one where <b>predicate</b> returns a true value. If such a model is found, find immediately returns this model. Otherwise, find returns undefined. 
    * 
    * @example <caption>Find first model which is not hidden, IsHidden property is not equal 1.</caption>
    *  function notHidden(item) {
    *    return item["IsHidden"] !== "1";
    *  }
    *  var notHiddenItem = myComponent.find(notHidden);
    *
    * @param {Function} predicate - Function to execute on each value in the array, taking three arguments:
    * @param {Object} item
    * The current item model being processed in the Items array.
    * @param {int} index
    * The index of the current element being processed in the array.
    * @param {array} array
    * The array find was called upon.
    * @alias Collection#find
    */

    find: function (predicate) {
      return _.find(this.Items, predicate);
    },

    /**
     * Looks through the Items list and returns all models that matches all of the key-value pairs listed in <b>attributes</b>.
     * 
     * @example <caption>Find all models where year attribute is 1930.</caption>
     * var booksFrom1930 = myComponent.where({ year: 1930 });
     * 
     * @example <caption>Find all models matching multiple attributes.</caption>
     * var johnsFrom30s = myComponent.where({ author: "john doe", year: 1930 });
     * 
     * @param {Object} attributes - Set of key-value pairs to match
     * @alias Collection#where
     */
    where: function(attributes) {
      return _.where(this.Items, attributes);
    },

    /**
     * Find a model at a given index. Visually the models might be sorted. But this will always refer to the original pre-sorted order.
     * 
     * @example
     * var firstItem = myComponent.at(0);
     * @param {number} index - First item is 0.
     * @alias Collection#at
     */
    at: function(index) {
      return this.Items[index];
    },

    /**
     * Find the index of an item.
     * @param {Object} item - The item to search for.
     * @alias Collection#indexOf
     */
    indexOf: function(item) {
      return this.Items.indexOf(item);
    },

    /**
     * Returns <i>true</i> if item is present in {@link Collection#Items Items}.
     * @param {Object} item - The item to search for.
     * @alias Collection#contains
     */
    contains: function (item) {
      return this.indexOf(item) !== -1;
    },

    /**
     * Return <i>true</i> if {@link Collection#Items Items} has any items.
     * @alias Collection#hasData
     */
    hasData: function() {
      return this.Items.length > 0;
    },

    /**
     * Returns the length of {@link Collection#Items Items}.
     * @alias Collection#getNumOfItems
     */
    getNumOfItems: function() {
      return this.Items.length;
    }
  });
});
})(Sitecore.Speak);
define("bclCollection", ["Collection/Data", "Collection/DisplayFieldName", "Collection/ValueFieldName", "Collection/Factory"], function (Data, DisplayFieldName, ValueFieldName, Factory) {

  /**
   * By default Collection ships with special attributes. But if you do not need the all of special attributes
   * the assemle method lets you create a custom Collection only containing the basics of data handling and an
   * optional amount of special attributes.
   * 
   * @example
   * var ValueFieldCollection = Collection.assemble({ ValueFieldName: true });
   * 
   * @param {assembleOptions} include - What parts to include besides the basics.
   * @memberOf Collection
   */
  function assemble(include) {
    /**
     * @typedef {Object} assembleOptions
     * @alias assembleOptions
     * @property {boolean} [DisplayFieldName] - Include DisplayFieldName related methods and properties.
     * @property {boolean} [ValueFieldName] - Include ValueFieldName related methods and properties.
     */
    include = include || {};

    /**
     * The mixin <b>Collection</b> is intended to be used whenever you have a Control that should render a list of
     * elements.<br> The collection is meant to be used as an extension of your component, meaning it will add
     * properties and methods to your component.
     * 
     * <p>A custom build can be done by using the static {@link Collection.assemble} method, to exclude some of the featues.</p>
     * 
     * @example <caption>Loading and extending a component with Collection</caption>
     * (function (Speak) {
     *   var collectionPath = "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/Collection.js";
     *
     *   Speak.component([collectionPath], function (Collection) {
     *     
     *     return Speak.extend({}, Collection.prototype, {
     *       initialized: function () {
     *         Collection.prototype.initialized.call(this); // call super
     * 
     *         this.on("itemsChanged", this.render, this);
     *       },
     * 
     *       render: function () {
     *         $(this.el).empty();
     *         this.Items.forEach(function (item) {
     *            $(this.el).append("<li>" + this.getDisplayName(item) + "</li>");
     *         }, this);
     *       }
     *     };
     * 
     *   }, "ListComponent");
     * 
     * })(Sitecore.Speak);
     * 
     * @constructor
     * @mixin Collection
     */
    var Custom = function () { };
    Custom.prototype.constructor = Custom;

    var dfn = include.DisplayFieldName ? DisplayFieldName : {},
      vfn = include.ValueFieldName ? ValueFieldName : {};

    Custom.prototype = Sitecore.Speak.extend({}, Data, dfn, vfn, { Model: Factory.createBaseModel() });
    return Custom;
  }

  var Collection = assemble({ ValueFieldName: true, DisplayFieldName: true });
  Collection.assemble = assemble;

  Collection.factory = Factory;

  return Collection;
});
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
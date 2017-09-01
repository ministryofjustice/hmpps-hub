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
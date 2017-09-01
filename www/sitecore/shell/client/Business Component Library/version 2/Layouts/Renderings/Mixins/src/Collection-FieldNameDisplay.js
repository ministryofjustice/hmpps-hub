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
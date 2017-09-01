(function (Speak) {
  define("Utils/DOM", [], function () {
    return {
      /**
      * Gets the index of the element of its parentNode.
      * @param {Element} element - An Element usually gained from querySelector
      * @alias DOM#index
      */
      index: function (element) {
        var childrenOfParent = this.nodeListToArray(element.parentNode.children);

        return childrenOfParent.indexOf(element);
      },

      /**
      * Convert a NodeList into an Array
      * @param {NodeList} elements - A list of Elements usually gained from querySelectorAll
      * @alias DOM#nodeListToArray
      */
      nodeListToArray: function (elements) {
        return Speak.utils.array.toArray(elements);
      }
    };
  });
})(Sitecore.Speak);
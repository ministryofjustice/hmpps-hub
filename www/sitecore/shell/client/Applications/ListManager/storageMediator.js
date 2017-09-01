define(function () {
  return {
    isStorageSupported: function () {
      return typeof localStorage !== "undefined" && localStorage !== null;
    },
    addToStorage: function (key, value) {
      if (this.isStorageSupported()) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    },
    getFromStorage: function (key) {
      if (this.isStorageSupported()) {
        var items = localStorage.getItem(key);
        if (items !== null) {
          return JSON.parse(items);
        }
      }
      return null;
    },
    removeFromStorage: function (key) {
      if (this.isStorageSupported()) {
        var items = localStorage.getItem(key);
        if (items !== null) {
          localStorage.removeItem(key);
        }
      }
    }
  };
});
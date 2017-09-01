define([], function () {
  "use strict";
  return {
    showMessage: function (container, type, text) {
      container.addMessage(type, {
        text: text,
        actions: [],
        closable: true,
        temporary: true
      });
    },
    showNotification: function (container, text) {
      this.showMessage(container, "notification", text);
    },
    showWarning: function (container, text) {
      this.showMessage(container, "warning", text);
    },
    showError: function (container, text) {
      this.showMessage(container, "error", text);
    }
  };
});
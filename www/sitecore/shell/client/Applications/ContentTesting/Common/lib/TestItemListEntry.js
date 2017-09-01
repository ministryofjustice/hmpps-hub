define(["sitecore"], function(_sc) {
  var entry = _sc.Definitions.App.extend({
    initialized: function () {
    },

    removeTestItem: function() {
      this.trigger("removeEntry", this);
    },
    
    editTestItem: function() {
      this.trigger("editEntry", this);
    },

    showTestItemWarnings: function () {
      var msg = this.get("warnings").join("\r\n");
      alert(msg);
    }
  });

  return entry;
});
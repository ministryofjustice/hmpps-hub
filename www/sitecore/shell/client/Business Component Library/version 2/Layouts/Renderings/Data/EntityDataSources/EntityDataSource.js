Sitecore.Speak.component(["entityService"], function(entityService) {
  return {
    name: "EntityDataSource",
    initialized: function() {
      this.Entity = {};

      this.on("change:EntityID", this.refresh, this);
    },

    refresh: function() {
      var self = this;
      var service = new entityService({ url: this.ServiceUrl });

      this.IsBusy = true;

      service
        .fetchEntity(this.EntityID)
        .execute()
        .then(function(entity) {
          self.Entity = entity;
        })
        .fail(function(error) {
          console.log("Error while calling the entity service");
          console.log(error);
        })
        .done(function() {
          self.IsBusy = false;
        });
    }
  };
}, "EntityDataSource");
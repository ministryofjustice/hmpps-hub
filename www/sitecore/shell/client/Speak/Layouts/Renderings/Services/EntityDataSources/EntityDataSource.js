require.config({
  paths: {
      entityService: "/sitecore/shell/client/Services/Assets/lib/entityservice"
  }
});

define(["sitecore", "entityService"], function (Sitecore, entityService) {
  "use strict";

var model = Sitecore.Definitions.Models.ComponentModel.extend({
  initialize: function (attributes) {
    this._super();
    this.set("serviceURL", "");
    this.set("entityID", "");
    this.set("entity", {});
    this.set("isBusy", false);

    this.on("change:entityID", this.refresh, this);
  },

  refresh: function () {
    this.Service = new entityService({
      url: this.get("serviceURL")
    });

    this.query = this.Service.fetchEntity(this.get("entityID"));

    if (!this.IsDeferred) {
      this.execute();
    }
  },

  execute: function () {
    var comp = this;
    this.query.execute().then(function (entity) {
      comp.set("entity", entity);
    }).fail(function (error) {
		console.log("Error while calling the entity service");
		console.log(error);
	});
  }
});

var view = Sitecore.Definitions.Views.ComponentView.extend({
  initialize: function(options)
  {
    this._super();

    this.model.set("serviceURL", this.$el.attr("data-sc-serviceURL"));
    this.model.set("entityID", this.$el.attr("data-sc-entityID"));
    this.model.set("isBusy", this.$el.attr("data-sc-isBusy"));
  }
});

_sc.Factories.createComponent("EntityDataSource", model, view, "script[type='text/x-sitecore-entitydatasource']");
});

// TODO add create entity 
// TODO validation
// TODO change notifications on a property level from entity service

// NOTE no access to RPC methods

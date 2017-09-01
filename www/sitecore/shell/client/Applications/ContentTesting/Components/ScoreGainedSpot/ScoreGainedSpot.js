define(["sitecore"], function (Sitecore) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();
      this.set("Score", 0);
    },

    render: function (data) {
      if (this.viewModel.$el) {
        this.viewModel.$el.find(".old-score").html(data.PreviousScore);
        this.viewModel.$el.find(".new-score").html(data.Score);
      }
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function () {
      //this._super();
      
      this.model.on("change:Score", this.render, this);
    },
    
    render : function()
    {
      this.$el.find(".new-score").html(this.model.get("Score"));
    }
  });

  Sitecore.Factories.createComponent("ScoreGainedSpot", model, view, ".sc-ScoreGainedSpot");
});

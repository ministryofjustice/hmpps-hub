define([], function () {
  var ob = {
    init: function(options){
      this.improvementText = options.improvementText;
      this.decreaseText = options.decreaseText;
    },

    // Backbone event callback for binding repeater data. Can't specify arguments so need to pull them from the context
    setRepeaterData: function () {
      this.repeater.viewModel.reset();
      this.repeater.viewModel.addData(this.dataSource.get("items"));
    },

    bindLeaderboardEntryData: function (args) {
      var subapp = args.app;
      var data = args.data;

      subapp.Entry.viewModel.$el.addClass(data.Class);

      if (data.Rank > 0) {
        subapp.Rank.set("text", data.Rank);
      }

      subapp.Name.set("text", data.User);
      subapp.ScoreValueBar.set("value", data.Score);
      subapp.GuessValueBar.set("value", data.Guess);
      subapp.EffectValueBar.set("value", data.Effect);
      subapp.ActivityValueBar.set("value", data.Activity);

      if (ob.kpi) {
        subapp.ScoreBorder.set("isVisible", ob.kpi === "all");
        subapp.GuessBorder.set("isVisible", ob.kpi === "all" || ob.kpi === "guess");
        subapp.EffectBorder.set("isVisible", ob.kpi === "all" || ob.kpi === "effect");
        subapp.ActivityBorder.set("isVisible", ob.kpi === "all" || ob.kpi === "activity");
      }

      ob.setChangeData(subapp.ChangeValue, data.ComparisonChange, ob.improvementText, ob.decreaseText);
    },

    setChangeData: function (control, value, riseTextFormat, fallTextFormat) {
      if (value) {
        control.viewModel.$el.addClass("change-value");

        if (value < 0) {
          control.set("text", (fallTextFormat || "{0}").replace("{0}", value));
          control.viewModel.$el.addClass("value-drop");
        } else if (value > 0) {
          control.set("text", (riseTextFormat || "{0}").replace("{0}", value));
          control.viewModel.$el.addClass("value-rise");
        }
      } else {
        control.set("visible", false);
      }
    },

    kpi: null
  };

  return ob;
});
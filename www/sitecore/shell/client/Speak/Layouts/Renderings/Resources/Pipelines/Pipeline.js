define(["sitecore"], function (Speak) {
  Speak.Factories.createBaseComponent({
    name: "Pipeline",
    base: "ComponentBase",
    selector: "script[data-sc-component=Pipeline]",
    attributes: [
      { name: "pipelineUrl", value: "$el.data:sc-pipelineurl" },
      { name: "pipelineName", value: "$el.data:sc-pipelinename" },
      { name: "pipelineArgs", value: "$el.data:sc-pipelineargs" },
      { name: "trigger", value: "$el.data:sc-trigger" },
      { name: "targetControl", value: "$el.data:sc-targetcontrol" },
      { name: "loadmode", value: "$el.data:sc-loadmode" },
      { name: "isPipelineReady", defaultValue: false }
    ],

    initialize: function () {
      this._super();

      var loadMode = this.model.get("loadmode");
      if (loadMode === "immediately" || loadMode === "inline") {
        this.model.loadAndInitPipeline();
      }

      this.model.once("change:isPipelineReady", this.triggerReadyEvent, this);
    },

    triggerReadyEvent: function () {
      this.model.trigger("pipelineready", Speak.Pipelines[this.model.get("pipelineName")]);
    },

    extendModel: {
      loadAndInitPipeline: function () {
        var isReady = $.Deferred();

        require([this.get("pipelineUrl")], $.proxy(function () {
          this.set("isPipelineReady", true);
          isReady.resolve();
        }, this));

        return isReady;
      }
    },

    startPipeline: function () {
      this.model.loadAndInitPipeline().done($.proxy(function () {
        var context = {
          args: this.model.get("pipelineArgs"),
          app: this.app,
          pipeline: this
        };

        Speak.Pipelines[this.model.get("pipelineName")].execute(context);
      }, this));
    },

    afterRender: function () {
      var trigger = this.model.get("trigger");
      if (trigger === null || trigger === "") {
        return;
      }

      var targetControl = null;

      var targetControlName = this.model.get("targetControl");
      if (targetControlName !== null && targetControlName !== "") {
        targetControl = this.app[targetControlName];
      }

      if (targetControl != null) {
        targetControl.on(trigger, this.startPipeline, this);
      } else {
        this.app.on(trigger, this.startPipeline, this);
      }
    }
  });
});
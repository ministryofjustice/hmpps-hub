(function(speak, $) {
  var pipelines = speak.module("pipelines");

  speak.component([], function() {
    var loadAndInitPipeline = function(component) {
      var isReady = $.Deferred();

      require([component.PipelineUrl], $.proxy(function(pipelineDto) {
        var pipeline = pipelines.Pipeline(pipelineDto.name);
        var processor;

        for (var i = 0; i < pipelineDto.processors.length; i++) {
          processor = pipelineDto.processors[i];
          processor.priority = i + 1;
          pipeline.add(processor);
        }

        pipelines.add(pipeline);

        component.IsPipelineReady = true;
        isReady.resolve();
      }, component));

      return isReady;
    };

    // This function is called in context of the component.
    var triggerReadyEvent = function() {
      this.trigger("pipelineready", pipelines[this.PipelineName]);
    };

    // This function is called in context of the component.
    var startPipeline = function() {
      loadAndInitPipeline(this).done($.proxy(function() {
        var context = {
          args: this.PipelineArgs,
          app: this.app,
          pipeline: this
        };

        pipelines[this.PipelineName].execute(context);
      }, this));
    };

    return {
      name: "Pipeline",

      initialize: function() {
        this.defineProperty("IsPipelineReady", false);
      },

      initialized: function() {
        var loadMode = this.LoadMode;
        if (loadMode === "immediately" || loadMode === "inline") {
          loadAndInitPipeline(this);
        }

        this.once("change:IsPipelineReady", triggerReadyEvent, this);
      },

      afterRender: function() {
        var targetControl;
        var targetControlName;
        var trigger = this.Trigger;

        if (trigger === null || trigger === "" || trigger === undefined) {
          return;
        }

        targetControlName = this.TargetControl;
        if (targetControlName !== null && targetControlName !== "") {
          targetControl = this.app[targetControlName];
        }

        if (targetControl) {
          targetControl.on(trigger, startPipeline, this);
        } else {
          this.app.on(trigger, startPipeline, this);
        }
      }
    };
  }, "Pipeline");
})(Sitecore.Speak, $);
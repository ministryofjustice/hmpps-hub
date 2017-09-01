(function(speak) {
  speak.component(["scSpeakObservableArray"], function(observableArray) {
    var control;

    // This function is called in context of a file model.
    var triggerUpdateError = function() {
      control.app.trigger("upload-info-updated", this);
    };

    // This function is called in context of the control.
    var addFile = function(info) {
      if (!info.type) {
        info.fileSize = "";
        info.type = "";
      }

      this.Files.push(info);
      info.on("change", triggerUpdateError);
    };

    // This function is called in context of the control.
    var showError = function(errorObject) {
      var id = errorObject.id;
      var fileToUpdate = speak.utils.array.find(this.Files, function(f) {
        return f.get("id") === id;
      });

      if (fileToUpdate) {
        fileToUpdate.error = true;
      }
    };

    return {
      name: "UploaderInfo",
      initialize: function() {
        control = this;
        this.defineProperty("Files", new observableArray([]));
      },
      initialized: function() {
        this.app.on("upload-fileAdded", addFile, this);
        this.app.on("upload-error", showError, this);
      },
      remove: function(index) {
        var file = this.Files.array[index];

        this.app.trigger("upload-info-deleted", file);
        this.app.trigger("sc-uploader-remove", speak.utils.extractProperties(file));

        this.Files.removeAt(index);
      }
    };
  }, "UploaderInfo");
})(Sitecore.Speak);
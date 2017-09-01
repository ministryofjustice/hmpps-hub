(function(speak) {
    speak.component(["underscore", "scSpeakObservableArray", "jqueryui", "jqueryFileUpload", "jqueryIFrameTransport", "bclSession"], function (_, observableArray) {
    var ONLYIMAGE = /^(image\/bmp|image\/dib|image\/gif|image\/jpeg|image\/jpg|image\/jpe|image\/jfif|image\/png|image\/tif|image\/tiff)$/i,
      uploadedSize = 0,
      iMaxFilesize = 10485760, // 10MB
      uploadTimer,
      url,
      datas = [],
      $preeview,
      uploadFile,
      domElements,
      totalSize = 0,
      collection;

    var removeExtension = function(name) {
      return name.replace(/\.[^/.]+$/, "");
    };

    var bytesToSize = function(bytes) {
      var sizes = ['bytes', 'Kb', 'Mb'];

      if (bytes === 0) return '0 bytes';
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    };

    var validateFile = function(file) {
      file.errors = file.errors || [];

      if (file.size > iMaxFilesize) {
        file.errors.push({ param: "size", msg: "invalid size" });
      }
    };

    var validateFiles = function(files) {
      _.each(files, validateFile);
    };

    var prepareData = function(file) {
      file.__id = _.uniqueId("file_");
      var size = file.size || 0;
      totalSize += size;

      return {
        id: file.__id,
        name: removeExtension(file.name),
        size: size,
        fileSize: bytesToSize(size),
        type: file.type,
        percentage: 0,
        data: file,
        done: undefined,
        bytesTransfered: 0,
        description: "",
        alternate: ""
      };
    };

    var setupDataForFiles = function(preview, files, cb) {
      _.each(files, function(file) {
        var oImage = preview.clone().get(0),
          modelJSON = prepareData(file);

        var isImg = ONLYIMAGE.test(file.type);
        if (typeof FileReader !== "undefined" && isImg) {
          var oReader = new FileReader();
          oReader.onload = function(e) {
            // e.target.result contains the DataURL which we will use as a source of the image
            oImage.src = e.target.result;

            oImage.onload = function() { // binding onload event
              // we are going to display some custom image information here
              modelJSON.image = e.target.result;
              modelJSON.width = oImage.naturalWidth;
              modelJSON.height = oImage.naturalHeight;
              modelJSON.error = false;

              collection.push(speak.bindable(modelJSON));
              cb(modelJSON.id);
            };
          };
          oReader.readAsDataURL(file);
        } else {
          modelJSON.image = "/sitecore/shell/client/Speak/Assets/img/Speak/Uploader/upload_file_icon.png";
          modelJSON.error = false;
          collection.push(new speak.bindable(modelJSON));
          cb(modelJSON.id);
        }
      }, this);
    };

    var uploadProgress = function(data, model, cb) { // upload process in progress
      var percentage = Math.round(data.loaded * 100 / data.total),
        bytesTransfered = bytesToSize(data.total);

      model.set("percentage", percentage.toString());
      model.set("bytesTransfered", bytesTransfered);
      cb(model);
    };

    // This function is called in context of the control.
    var removeFilesFromQueue = function(model) {
      var modelIndex = -1;
      for (var i = 0; i < collection.length; i++) {
        if (collection.array[i].id === model.id) {
          modelIndex = i;
          break;
        }
      }

      if (modelIndex < 0) {
        return;
      }

      var index = 0;
      _.each(datas, function(data) {
        data.files = _.reject(data.files, function(file) {
          return (file.__id === model.get("id"));
        });
        if (data.files.length === 0) {
          datas.splice(index, 1);
        }
        ++index;
      }, this);

      totalSize = totalSize - model.get("size");

      collection.splice(modelIndex, 1); // remove model from collection

      if (uploadFile.context.forms && uploadFile.context.forms.length >= 1 && uploadFile.context.forms[0].__ids) {
        uploadFile.context.forms[0].__ids.splice(uploadFile.context.forms[0].__ids.indexOf(model.id), 1);
      }

      updateUploadInfo(collection.length > 0, false);
      refreshNumberFiles(this, false);
      refreshNumberSize(this, false);
    };

    // This function is called in context of the control.
    var updateFromQueue = function(model) {
      var name = model.get("name"),
          description = model.get("description"),
          id = model.get("id");

      _.each(datas, function(data) {
        data.files = _.reject(data.files, function(file) {
          if (file.__id === id) {
            file.name = name;
            file.description = description;
          }
        });
      }, this);
    };

    var setFileSizeExceeded = function(control) {
      var errorId = "upload-error-fileSizeExceeded";

      if (totalSize > control.MaxRequestLength) {
        control.app.trigger("sc-error", [{ id: errorId, Message: control.MaximumSizeMessage + " " + bytesToSize(control.MaxRequestLength) }]);
        control.app.trigger(errorId, totalSize);
      } else {
        control.app.trigger("sc-uploader-remove", { id: errorId });
      }
    };

    var getTotalSize = function(control) {
      var hasFilesToUpload = control.TotalFiles && totalSize < control.MaxRequestLength;

      if (control.HasFilesToUpload !== hasFilesToUpload && !control.QueueWasAborted) {
        control.HasFilesToUpload = hasFilesToUpload;

        setFileSizeExceeded(control);
      } else
        if (control.QueueWasAborted) {
          control.HasFilesToUpload = false;
        }

      return bytesToSize(totalSize);
    };

    var refreshNumberSize = function(control, isUploading) {
      if (isUploading) {
        control.UploadedSize = control.QueueWasAborted ? control.UploadedSize : bytesToSize(uploadedSize);
        return;
      }

      control.TotalSize = getTotalSize(control);
      control.UploadedSize = 0;
    };

    var refreshNumberFiles = function(control, isUploading) {
      if (isUploading) {
        control.UploadedFiles = control.QueueWasAborted ? control.UploadedFiles : control.TotalFiles - collection.length;
        return;
      }

      control.TotalFiles = control.QueueWasAborted ? 0 : collection.length;
      control.UploadedFiles = 0;
    };

    var showDataPanel = function(state) {
      if (state) {
        domElements.infoDataPanel.show();
      } else {
        domElements.infoDataPanel.hide();
      }
    };

    var showProgressBar = function(state) {
      if (state) {
        domElements.infoProgressBar.show();
      } else {
        domElements.infoProgressBar.hide();
      }
    };

    var showUploadingDataPanel = function(state) {
      if (state) {
        domElements.infoUploadingDataPanels.css('display', 'inline-block');
      } else {
        domElements.infoUploadingDataPanels.hide();
      }
    };

    var updateUploadInfo = function(hasFilesToUpload, isUploading, hasCompletedUploading) {
      showDataPanel(hasFilesToUpload || isUploading || hasCompletedUploading);
      showUploadingDataPanel(isUploading);
      showProgressBar(isUploading);
    };

    // Starts a timer from the setting executionTimeout
    var startUploadTimer = function(control) {
      var errorId = "uploadErrorTimeout",
        executionTimeout = control.ExecutionTimeout,
        currentSeconds = 0;

      uploadTimer = window.setInterval(function() {
        currentSeconds += 0.1;

        if (currentSeconds > executionTimeout) {
          // Abort each file upload, and triggers an error event with each file
          _.each(datas, function(data) {
            data.abort();
          });

          collection.reset();

          clearInterval(uploadTimer);

          control.app.trigger("sc-error", [{ id: errorId, Message: control.CannotUploadMessage }]);

          // To resets the indicator width
          control.GlobalPercentage = 0;

          // Resets everything
          datas = [];
          totalSize = 0;
          uploadedSize = 0;
          control.QueueWasAborted = true;
        }
      }, 100);
    };

    var updateRealImage = function(control, data, id) {
      var model = _.find(collection.array, function(m) { return m.id === id; });
      if (!model) {
        return;
      }

      model.set("image", data.uploadedFileItems[0].Icon);
      model.set("itemId", data.uploadedFileItems[0].ItemId);
      control.app.trigger("upload-fileUploaded", speak.utils.extractProperties(model));
    };

    // This function is called in context of the control.
    var setUploadUrl = function() {
      var databaseParam = this.Database ? "?database=" + this.Database : "";
      var contentParam = this.Database ? "&sc_content=" + this.Database : "";
      url = "/sitecore/shell/api/sitecore/Media/Upload" + databaseParam;

      if (this.DestinationUrl !== null) {
        url += "&destinationUrl=" + this.DestinationUrl;
      }
      if (this.Database !== null) {
        url += contentParam;
      }

      this.$el.find(".sc-uploader-fileupload").attr("data-url", url);
      _.each(datas,
        function(file) {
          file.url = url;
        },
        this);
    };

    // This function is called in context of the control.
    var fileAdded = function(model) {
      updateUploadInfo(true, false);
      refreshNumberFiles(this, false);
      this.app.trigger("upload-fileAdded", model);
    };

    return {
      name: "Uploader",
      listenTo: { "upload": "upload" },

      initialize: function() {
        this.$el = $(this.el);

        collection = new observableArray([]);

        ["GlobalPercentage", "UploadedSize", "TotalSize", "TotalFiles", "UploadedFiles"].forEach(function(name) {
          this.defineProperty(name, 0);
        }, this);

        ["QueueWasAborted", "HasFilesToUpload"].forEach(function(name) {
          this.defineProperty(name, false);
        }, this);
      },

      initialized: function() {
        setUploadUrl.call(this);
        this.app.on("upload-info-deleted", removeFilesFromQueue, this);
        this.app.on("upload-info-updated", updateFromQueue, this);
        $preeview = this.$el.find(".sc-uploader-preview");
        uploadFile = this.$el.find(".sc-uploader-fileupload");
        collection.on("add", fileAdded, this);
        refreshNumberFiles(this, false);

        domElements = {
          infoUploadingDataPanels: this.$el.find(".sc-uploader-general-info-data-uploadingData"),
          infoDataPanel: this.$el.find(".sc-uploader-general-info-data"),
          infoProgressBar: this.$el.find(".sc-uploader-general-info-progressbar")
        },

        this.on("change:destinationUrl", setUploadUrl, this);
      },

      upload: function() {
        var that = this;
        startUploadTimer(this);
        updateUploadInfo(true, true);

        //for each files - do the upload
        _.each(datas, function(data) {
          data.submit().error(function(jqXHR, textStatus, errorThrown) {
            var errors = [];
            if (jqXHR.status === 401) {
              var session = speak.module("bclSession");
              session.unauthorized();
              return;
            }
            // Triggers error on each model that had an abort
            if (errorThrown === "abort") {
              that.app.trigger("upload-error", { id: data.__id });
            } else {

              if (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.errorItems) {
                errors = jqXHR.responseJSON.errorItems;
                _.each(errors,
                  function(error) {
                    error.id = data.__id;
                  }); 

                that.app.trigger("sc-error", errors);
                that.app.trigger("upload-error", { id: data.__id, errors: errors });               
              }
            }
          });
        });
      },

      afterRender: function() {
        var that = this;

        uploadFile.fileupload({
          autoUpload: false,
          dataType: 'json',

          add: function(e, data) {
            data.url = url;

            // Resets the aborted state
            if (that.QueueWasAborted) {
              that.app.trigger("sc-uploader-remove", { id: "uploadErrorTimeout" });
              that.QueueWasAborted = false;
              collection.reset();
            }

            that.GlobalPercentage = 0;
            var files = data.files,
                currentNumber = that.TotalFiles || 0;

            that.TotalFiles = (currentNumber + files.length);

            validateFiles(files);
            setupDataForFiles($preeview, files, function(modelId) {

              /*if (data.form) {
                  data.form.__id = model.id;
              } else {*/
              e.target.form.__ids = e.target.form.__ids || [];
              e.target.form.__ids.push(modelId);
              /*}*/

              data.__id = modelId;

              datas.push(data);
              refreshNumberSize(that, false);
            });
          },

          progressall: function(e, data) {
            if (!that.QueueWasAborted) {
              that.GlobalPercentage = Math.round(data.loaded * 100 / data.total);
            }
          },

          formData: function(form) {
            var id = form.context.__ids.shift(),
              data = form.serializeArray();

            var token = speak.utils.security.antiForgery.getAntiForgeryToken();
            data.push({ name: token.formKey, value: token.value });

            return this.getModelData(data, id);
          },

          getModelData: function(data, id) {
            for (var modelIndex in collection.array) {
              var model = collection.array[modelIndex];
              if (model.id === id) {
                var name = model.get("name");
                var description = model.get("description");
                var alternate = model.get("alternate");
                data.push({ name: "name", value: name });
                data.push({ name: "description", value: description });
                data.push({ name: "alternate", value: alternate });

                return data;
              }
            }

            return data;
          },

          done: function(e, data) {
            datas.splice(datas.indexOf(data), 1);

            if (data.jqXHR) {
              data.jqXHR.done(function(res) {
                if (res.errorItems) {
                  _.each(res.errorItems, function(error) {
                    error.id = data.__id;
                  });

                  that.app.trigger("sc-error", res.errorItems);
                  that.app.trigger("upload-error", { id: data.__id, errors: res.errorItems });

                  return;
                }

                updateRealImage(that, res, data.__id);

                var ids = _.pluck(data.files, "__id");

                for (var i = collection.length - 1; i >= 0; i--) {
                  var model = collection.array[i];
                  if (!_.contains(ids, model.id)) {
                    continue;
                  }

                  model.set("error", false);
                  model.set("percentage", 100);
                  collection.splice(i, 1); // remove model from collection
                }

                uploadedSize += data.files[0].size;
                refreshNumberFiles(that, true);
                refreshNumberSize(that, true);

                if (collection.length === 0) {
                  totalSize = 0;
                  updateUploadInfo(false, false, true);
                  setTimeout(function() {
                    that.trigger("uploadCompleted");
                  }, 1000);
                }
              });
            }

            if (datas.length === 0) {
              clearInterval(uploadTimer);
            }
          }
        });

        uploadFile.bind("fileuploadprogress", function(e, data) {
          var id = data.files[0].__id;

          var update = _.find(collection.array, function(img) { return img.id === id; });
          if (update) {
            uploadProgress(data, update, function(model) {
              that.trigger("upload-progress", speak.utils.extractProperties(model));
            });
          }
        });
      }
    };
  }, "Uploader");
})(Sitecore.Speak);
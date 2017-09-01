/// <reference path="../../../../Assets/lib/ui/deps/jQueryUI/jquery-ui-1.8.23.custom.min.js" />
require.config({
  paths: {
    fileUpload: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/jquery-File-Upload/jquery.fileupload",
    iFrameTransport: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/jquery-File-Upload/jquery.iframe-transport"
  },
  shim: {
    'fileUpload': { deps: ['jqueryui'] },
    'iFrameTransport': { deps: ['fileUpload'] }
  }
});
define(["sitecore", "jqueryui", "fileUpload", "iFrameTransport"], function (_sc, fileUpload) {

  var progEv = !!(window.ProgressEvent),
      fdata = !!(window.FormData),
      wCreds = window.XMLHttpRequest && "withCredentials" in new XMLHttpRequest,
      hasXMLRequestLevel2 = progEv && fdata && wCreds,
      ONLYIMAGE = /^(image\/bmp|image\/dib|image\/gif|image\/jpeg|image\/jpg|image\/jpe|image\/jfif|image\/png|image\/tif|image\/tiff)$/i,
      uploadedSize = 0,
      iMaxFilesize = 10485760, // 10MB
      fileSizeExceededErrorMessage = "",
      timeoutErrorMessage = "",
      uploadTimer,       
      removeExtension = function (name) {
        return name.replace(/\.[^/.]+$/, "");
      },
      bytesToSize = function (bytes) {
        var sizes = ['bytes', 'Kb', 'Mb'];

        if (bytes == 0) return '0 bytes';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
      },
      Files = Backbone.Collection.extend({
        model: _sc.Definitions.Models.Model
      }),
      validateFile = function (file) {
        file.errors = file.errors || [];

        if (file.size > iMaxFilesize) {
          file.errors.push({ param: "size", msg: "invalid size" });
        }
      },
      validateFiles = function (files) {
        _.each(files, validateFile);
      },
      prepareData = function (file, component) {
        file.__id = _.uniqueId("file_");
        var size = file.size || 0;        
        component.totalSize += size;
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
      },
      setupDataForFiles = function (preview, files, component, cb) {
        var that = this;

        _.each(files, function (file) {
          var oImage = preview.clone().get(0),
              modelJSON = prepareData(file, component);

          var isImg = ONLYIMAGE.test(file.type);
          if (typeof FileReader !== "undefined" && isImg) {
            var oReader = new FileReader();
            oReader.onload = function (e) {
              // e.target.result contains the DataURL which we will use as a source of the image
              oImage.src = e.target.result;

              oImage.onload = function () { // binding onload event
                // we are going to display some custom image information here
                modelJSON.image = e.target.result;
                modelJSON.width = oImage.naturalWidth;
                modelJSON.height = oImage.naturalHeight;
                modelJSON.error = false;
                var model = new _sc.Definitions.Models.Model(modelJSON);
                component.collection.add(model);
                cb(modelJSON);
              };
            };
            oReader.readAsDataURL(file);
          } else {
            modelJSON.image = "/sitecore/shell/client/Speak/Assets/img/Speak/Uploader/upload_file_icon.png";
            modelJSON.error = false;
            component.collection.add(new _sc.Definitions.Models.Model(modelJSON));
            cb(modelJSON);
          }
        }, this);
      },
      uploadProgress = function (data, model, cb) { // upload process in progress
        var percentage = Math.round(data.loaded * 100 / data.total),
            bytesTransfered = bytesToSize(data.total);

        model.set("percentage", percentage.toString());
        model.set("bytesTransfered", bytesTransfered);        
        cb(model);
      },
      removeFilesFromQueue = function (model) {
        var index = 0;

        _.each(this.datas, function (data) {
          data.files = _.reject(data.files, function (file) {
            return (file.__id === model.get("id"));
          });
          if (data.files.length === 0) {
            this.datas.splice(index, 1);
          }
          ++index;
        }, this);

        this.totalSize = this.totalSize - model.get("size");

        this.collection.remove(model);

        if (this.uploadFile.context.forms && this.uploadFile.context.forms.length >= 1 && this.uploadFile.context.forms[0].__ids) {
          this.uploadFile.context.forms[0].__ids.splice(this.uploadFile.context.forms[0].__ids.indexOf(model.id), 1);
        }

        this.updateUploadInfo(this.collection.length > 0, false);        
        this.refreshNumberFiles(false);
        this.refreshNumberSize(false);
      },
      updateFromQueue = function (model) {
        var name = model.get("name"),
            description = model.get("description"),
            id = model.get("id");

        _.each(this.datas, function (data) {
          data.files = _.reject(data.files, function (file) {
            if (file.__id === id) {
              file.name = name;
              file.description = description;
            }
          });
        }, this);
      };

  _sc.Factories.createBaseComponent({
    name: "Uploader",
    base: "ControlBase",
    selector: ".sc-uploader",
    collection: Files,
    listenTo: {
      "upload": "upload"
    },
    attributes: [
        { name: "destinationUrl", value: "$el.data:sc-destinationurl" },
        { name: "maxRequestLength", value: "$el.data:sc-maxrequestlength" },
        { name: "hasFilesToUpload", defaultValue: null },
        { name: "executionTimeout", value: "$el.data:sc-executiontimeout" },
        { name: "totalFiles", defaultValue: 0 },
        { name: "uploadedFiles", defaultValue: 0 },
        { name: "globalPercentage", defaultValue: 0 },
        { name: "totalSize", defaultValue: "0 bytes" },
        { name: "uploadedSize", defaultValue: "0 bytes" },
        { name: "queueWasAborted", defaultValue: null },
        { name: "database", value: "$el.data:sc-databasename" }
    ],
    extendModel: {
      set: function (key, value, options) {      
        var _base = _sc.Definitions.Models.ControlModel;
        if (!_base) {
          _base = Backbone.Model;
        }
        if (!(options && options.initReadonlyValue) && _.isObject(key)) {
          key = _.omit(key, "database");
          _base.prototype.set.apply(this, key, value, options);
        } else if (!(options && options.initReadonlyValue) && key === "database") {
          return;
        }
        _base.prototype.set.call(this, key, value, options);  
      }
    },

    initialize: function() {
      this.totalSize = 0;

      fileSizeExceededErrorMessage = this.$el.data("sc-filesizeexceededtext");
      timeoutErrorMessage = this.$el.data("sc-timeoutext");
      
      if (!hasXMLRequestLevel2) {
        this.$el.find(".drag").hide();        
      }
      this.databaseName = this.$el.data("sc-databasename") ? this.$el.data("sc-databasename") : "core";
      this.model.set("database", this.databaseName, {initReadonlyValue: true});
      this.setUploadUrl();      
      this.model.set("totalFiles", 0);
      this.model.set("uploadedFiles", 0);
      this.datas = [];
      this.app.on("upload-info-deleted", removeFilesFromQueue, this);
      this.app.on("upload-info-updated", updateFromQueue, this);
      this.$preeview = this.$el.find(".sc-uploader-preview");
      this.uploadFile = this.$el.find(".sc-uploader-fileupload");
      this.collection.on("add", this.fileAdded, this);
      this.collection.on("remove", this.refreshNumberFiles(false), this);
      this.refreshNumberFiles(false);
      this.domElements = {
        infoUploadingDataPanels: this.$el.find(".sc-uploader-general-info-data-uploadingData"),
        infoDataPanel: this.$el.find(".sc-uploader-general-info-data"),
        infoProgressBar: this.$el.find(".sc-uploader-general-info-progressbar")        
      },
      
      this.model.on("change:destinationUrl", this.changeDestinationUrl, this);
    },
    
    changeDestinationUrl: function () {      
      this.setUploadUrl();
    },

    setUploadUrl: function () {
      this.url = "/sitecore/shell/api/sitecore/Media/Upload?database=" + this.databaseName;
      this.url += "&sc_content=" + this.databaseName;
      var destination = this.model.get("destinationUrl");
      if (destination !== null) {
        this.url += "&destinationUrl=" + this.model.get("destinationUrl");
      }
      
      this.$el.find(".sc-uploader-fileupload").attr("data-url", this.url);

      _.each(this.datas,
        function (file) {
          file.url = this.url;
        },
        this
      );
      
    },

    getUploadedSize: function () {      
      return bytesToSize(uploadedSize);
    },
    
    getTotalSize: function () {
      var hasFilesToUpload = this.model.get("totalFiles") && this.totalSize < this.model.get("maxRequestLength");

      if (this.model.get("hasFilesToUpload") !== hasFilesToUpload && !this.model.get("queueWasAborted")) {
        this.model.set("hasFilesToUpload", hasFilesToUpload);

        this.setFileSizeExceeded();
      }
      else if (this.model.get("queueWasAborted")) {
        this.model.set("hasFilesToUpload", false);
      }
      
      return bytesToSize(this.totalSize);
    },
    
    setFileSizeExceeded: function () {
      var errorId = "upload-error-fileSizeExceeded";
      
      if (this.totalSize > this.model.get("maxRequestLength")) {
        this.app.trigger("sc-error", [{ id: errorId, Message: fileSizeExceededErrorMessage + " " + bytesToSize(this.model.get("maxRequestLength")) }]);
        this.app.trigger(errorId, this.totalSize);
      } else {
        this.app.trigger("sc-uploader-remove", { id: errorId });
      }
    },

    fileAdded: function (model) {
      this.updateUploadInfo(true, false);
      this.refreshNumberFiles(false);
      this.app.trigger("upload-fileAdded", model);
    },
    
    refreshNumberSize: function (isUploading) {
      if (isUploading) {
        this.model.set("uploadedSize", this.model.get("queueWasAborted") ? this.model.get("uploadedSize") : this.getUploadedSize());
        return;
      }
      
      this.model.set("totalSize", this.getTotalSize());
      this.model.set("uploadedSize", 0);
    },
      
    refreshNumberFiles: function (isUploading) {
      if (isUploading) {
        
        this.model.set("uploadedFiles", this.model.get("queueWasAborted") ? this.model.get("uploadedFiles") : this.model.get("totalFiles") - this.collection.length);
        return;
      }
      
      this.model.set("totalFiles", this.model.get("queueWasAborted") ? 0 : this.collection.length);
      this.model.set("uploadedFiles", 0);
    },

    showDataPanel: function (state) {
      if (state) {
        this.domElements.infoDataPanel.show();
      } else {
        this.domElements.infoDataPanel.hide();
      }
    },
    
    showProgressBar: function (state) {
      if (state) {
        this.domElements.infoProgressBar.show();
      } else {
        this.domElements.infoProgressBar.hide();
      }
    },
    
    showUploadingDataPanel: function (state) {
      if (state) {
        this.domElements.infoUploadingDataPanels.css('display', 'inline-block');
      } else {
        this.domElements.infoUploadingDataPanels.hide();
      }
    },
    
    updateUploadInfo: function (hasFilesToUpload, isUploading, hasCompletedUploading) {
      this.showDataPanel(hasFilesToUpload || isUploading || hasCompletedUploading);
      this.showUploadingDataPanel(isUploading);
      this.showProgressBar(isUploading);
    },

    upload: function () {
      var that = this;      
      this.startUploadTimer(this.datas);      
      this.updateUploadInfo(true, true);

      //for each files - do the upload
      _.each(this.datas, function (data) {
        data.submit().error(function (jqXHR, textStatus, errorThrown) {
          if (jqXHR.status === 401) {
            _sc.Helpers.session.unauthorized();
            return;
          }
          // Triggers error on each model that had an abort
          if (errorThrown === "abort") {
            that.app.trigger("upload-error", { id: data.__id });
          } else {
            var errors = [{ Message: errorThrown }];
            that.app.trigger("sc-error", errors);
            that.app.trigger("upload-error", { id: data.__id, errors: errors });
          } 
        });
      });
    },
    
    // Starts a timer from the setting executionTimeout
    startUploadTimer: function (datas) {
      var errorId = "uploadErrorTimeout",
        executionTimeout = this.model.get("executionTimeout"),
        currentSeconds = 0,
        that = this;
      
      uploadTimer = window.setInterval(function () {
        currentSeconds += 0.1;

        if (currentSeconds > executionTimeout) {
          // Abort each file upload, and triggers an error event with each file
          _.each(datas, function (data) {
            data.abort();
          });

          that.collection.reset();
          
          clearInterval(uploadTimer);
          
          that.app.trigger("sc-error", [{ id: errorId, Message: timeoutErrorMessage }]);

          // To resets the indicator width
          that.model.set("globalPercentage", 0);
          
          // Resets everything
          that.datas = [];
          that.totalSize = 0;
          uploadedSize = 0;
          that.model.set("queueWasAborted", true);
        }
      }, 100);
    },
    
    updateRealImage: function (data, id) {
      model = _.find(this.collection.models, function (model) {
        return model.get("id") === id;
      });

      model.set("image", data.uploadedFileItems[0].Icon);
      model.set("itemId", data.uploadedFileItems[0].ItemId);
      this.app.trigger("upload-fileUploaded", model.toJSON());
    },
    afterRender: function () {
      var that = this;
      this.uploadFile.fileupload({

        add: function (e, data) {
          data.url = that.url;

          // Resets the aborted state
          if (that.model.get("queueWasAborted")) {
            that.app.trigger("sc-uploader-remove", { id: "uploadErrorTimeout" });
            that.model.set("queueWasAborted", false);
            that.collection.reset();
          }
          
          that.model.set("globalPercentage", 0);
          var files = data.files,
              currentNumber = that.model.get("totalFiles") || 0;

          that.model.set("totalFiles", (currentNumber + files.length));

          validateFiles(files);
          setupDataForFiles(that.$preeview, files, that, function (model) {

            /*if (data.form) {
                data.form.__id = model.id;
            } else {*/
            e.target.form.__ids = e.target.form.__ids || [];
            e.target.form.__ids.push(model.id);
            /*}*/

            data.__id = model.id;

            that.datas.push(data);            
            that.refreshNumberSize(false);
          });
        },
        progressall: function (e, data) {
          if (!that.model.get("queueWasAborted")) {
            var percentage = Math.round(data.loaded * 100 / data.total),
                bytesTransfered = bytesToSize(data.total);

            that.model.set("globalPercentage", percentage);
          }
        },
        formData: function (form) {
          var id = form.context.__ids.shift(),
            data = form.serializeArray();

          var token = _sc.Helpers.antiForgery.getAntiForgeryToken();
          data.push({ name: token.formKey, value: token.value });

          return this.getModelData(data, id);
        },

        getModelData: function (data, id) {
          for (var modelIndex in that.collection.models) {
            var model = that.collection.models[modelIndex];
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

        done: function (e, data) {          
          //that.datas = [];
          that.datas.splice(that.datas.indexOf(data), 1);
          
          if (data.jqXHR) {
          data.jqXHR.done(function (res, arg2, arg3) {
            var models = [];
            if (res.errorItems) {
              _.each(res.errorItems, function (error) {
                error.id = data.__id;
              });

              that.app.trigger("sc-error", res.errorItems);
              that.app.trigger("upload-error", { id: data.__id, errors: res.errorItems });

              return undefined;
            }

            that.updateRealImage.call(that, res, data.__id);

            ids = _.pluck(data.files, "__id");

            that.collection.each(function (model) {
              if (_.contains(ids, model.get("id"))) {
                models.push(model);
              }
            });

            _.each(models, function (model) {
              model.set("error", false);
              model.set("percentage", 100);
              that.collection.remove(model);
            }, this);

            uploadedSize += data.files[0].size;
            that.refreshNumberFiles(true);
            that.refreshNumberSize(true);
                            
            if (that.collection.length === 0) {
              that.updateUploadInfo(false, false, true);
              setTimeout(function () {
                 that.model.trigger("uploadCompleted"); 
              }, 1000);                
            }
          });
        }

          if (that.datas.length === 0) {
            clearInterval(uploadTimer);
          }
        },
        autoUpload: false,
        dataType: 'json'
      });

      this.uploadFile.bind("fileuploadprogress", function (e, data) {
        var id = data.files[0].__id;

        var update = _.find(that.collection.models, function (img) {
          return img.get("id") === id;
        }, this);
        if (update) {
          uploadProgress(data, update, function (model) {
            that.trigger("upload-progress", model.toJSON());
          });
        }
      });
    }
  });
});

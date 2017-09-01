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
      totalSize = 0,
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
      prepareData = function (file, oImage) {
        file.__id = _.uniqueId("file_");
        var size = typeof file.size !== 'undefined' ? file.size : 0;
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
      },
      setupDataForFiles = function (preview, files, collection, cb) {
        var that = this;

        _.each(files, function (file) {
          var oImage = preview.clone().get(0),
              modelJSON = prepareData(file);

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
                collection.add(model);
                cb(modelJSON);
              };
            };
            oReader.readAsDataURL(file);
          } else {
            modelJSON.image = "/sitecore/shell/client/Speak/Assets/img/unknown_icon_32.png";
            modelJSON.error = false;
            collection.add(new _sc.Definitions.Models.Model(modelJSON));
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

        totalSize = totalSize - model.get("size");

        this.collection.remove(model);

        if (this.uploadFile.context.forms && this.uploadFile.context.forms.length >= 1 && this.uploadFile.context.forms[0].__ids) {
          this.uploadFile.context.forms[0].__ids.splice(this.uploadFile.context.forms[0].__ids.indexOf(model.id), 1);
        }

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
    name: "ListManagementUploader",
    base: "ControlBase",
    selector: ".sc-listmanagementuploader",
    collection: Files,
    listenTo: {
      "upload": "upload"
    },
    attributes: [
        { name: "destinationUrl", value: "$el.data:sc-destinationurl" },
        { name: "acceptfiletypesregularexpression", value: "$el.data:sc-acceptfiletypesregularexpression" },
        { name: "maxRequestLength", value: "$el.data:sc-maxrequestlength" },
        { name: "hasFilesToUpload", defaultValue: null },
        { name: "executionTimeout", value: "$el.data:sc-executiontimeout" },
        { name: "totalFiles", defaultValue: 0 },
        { name: "uploadedFiles", defaultValue: 0 },
        { name: "globalPercentage", defaultValue: 0 },
        { name: "totalSize", defaultValue: "0 bytes" },
        { name: "uploadedSize", defaultValue: "0 bytes" },
        { name: "queueWasAborted", defaultValue: null }
    ],

    initialize: function () {
      var databaseUri = new _sc.Definitions.Data.DatabaseUri("core"),
        database = new _sc.Definitions.Data.Database(databaseUri);

      if (!hasXMLRequestLevel2) {
        this.$el.find(".drag").hide();
      }
      this.databaseName = this.$el.data("sc-databasename") ? this.$el.data("sc-databasename") : "core";
      this.disablemultiplefilesselect = this.$el.data("sc-disablemultiplefilesselect") ? this.$el.data("sc-disablemultiplefilesselect") : false;
      this.disablemultiplefilesupload = this.$el.data("sc-disablemultiplefilesupload") ? this.$el.data("sc-disablemultiplefilesupload") : false;
      this.disabledraganddrop = this.$el.data("sc-disabledraganddrop") ? this.$el.data("sc-disabledraganddrop") : false;

      this.setUploadUrl();
      this.model.set("totalFiles", 0);
      this.model.set("uploadedFiles", 0);
      this.model.set("uploadedFileItems", []);
      this.datas = [];
      this.app.on("upload-info-deleted", removeFilesFromQueue, this);
      this.app.on("upload-info-updated", updateFromQueue, this);
      this.$preeview = this.$el.find(".sc-uploader-preview");
      this.uploadFile = this.$el.find(".sc-uploader-fileupload");
      this.collection.on("add", this.fileAdded, this);
      this.collection.on("remove", this.refreshNumberFiles(false), this);
      this.refreshNumberFiles(false);

      // Gets translation of messages for error events
      database.getItem("{DF3B5386-EE5B-4EDB-9013-E451BC077C50}", this.setFileSizeExceededErrorMessage);
      database.getItem("{24A1132B-768E-403B-BA37-DB7F235C6D37}", this.setTimeoutErrorMessage);

      this.model.on("change:destinationUrl", this.changeDestinationUrl, this);

      this.model.on("change:acceptfiletypesregularexpression", this.changeAcceptFileTypesRegularExpression, this);
    },
    reset: function () {
      totalSize = 0;
      totalFiles = 0;
      uploadedFiles = 0;
      globalPercentage = 0;
      hasFilesToUpload = null;

      this.totalSize = 0;
      this.collection.off("add", this.fileAdded, this);
      this.collection.off("remove", this.refreshNumberFiles(false), this);

      this.collection.on("add", this.fileAdded, this);
      this.collection.on("remove", this.refreshNumberFiles(false), this);

      this.hasFilesToUpload = null;
      this.model.set("totalFiles", 0);
      this.model.set("uploadedFiles", 0);
      this.model.set("uploadedFileItems", []);
      this.datas = [];
      this.refreshNumberFiles(false);
    },
    changeDestinationUrl: function () {
      this.setUploadUrl();
    },
    changeAcceptFileTypesRegularExpression: function () {
      this.setAcceptFileTypes();
    },
    setAcceptFileTypes: function () {
      this.acceptFileTypes = this.model.get("acceptfiletypesregularexpression") ? this.model.get("acceptfiletypesregularexpression") : undefined;
      this.$el.find(".sc-uploader-fileupload").attr("data-acceptFileTypes", this.acceptFileTypes);
    },
    setUploadUrl: function () {
      this.url = "/sitecore/shell/api/sitecore/Media/Upload" + "?database=" + this.databaseName + "&destinationUrl=" + this.model.get("destinationUrl");
      this.$el.find(".sc-uploader-fileupload").attr("data-url", this.url);
    },

    setTimeoutErrorMessage: function (item) {
      if (typeof item !== "undefined" && item !== null && item.hasOwnProperty("Text")) {
        timeoutErrorMessage = item.Text;
      }
    },
    setFileSizeExceededErrorMessage: function (item) {
      if (typeof item !== "undefined" && item !== null && item.hasOwnProperty("Text")) {
        fileSizeExceededErrorMessage = item.Text;
      }
    },

    getUploadedSize: function () {
      return bytesToSize(uploadedSize);
    },

    getTotalSize: function () {
      var hasFilesToUpload = this.model.get("totalFiles") && totalSize < this.model.get("maxRequestLength");

      if (this.model.get("hasFilesToUpload") !== hasFilesToUpload && !this.model.get("queueWasAborted")) {
        this.model.set("hasFilesToUpload", hasFilesToUpload);

        this.setFileSizeExceeded();
      }
      else if (this.model.get("queueWasAborted")) {
        this.model.set("hasFilesToUpload", false);
      }

      return bytesToSize(totalSize);
    },

    setFileSizeExceeded: function () {
      var errorId = "upload-error-fileSizeExceeded";

      if (totalSize > this.model.get("maxRequestLength")) {
        this.app.trigger("sc-error", [{ id: errorId, Message: fileSizeExceededErrorMessage + " " + bytesToSize(this.model.get("maxRequestLength")) }]);
        this.app.trigger(errorId, totalSize);
      } else {
        this.app.trigger("sc-uploader-remove", { id: errorId });
      }
    },

    fileAdded: function (model) {
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
      this.showBrowseButton(this.collection.length === 0);
    },

    showBrowseButton: function (state) {
      var browseButton = $("#browse-button");
      if (state) {
        browseButton.show();
      } else {
        browseButton.hide();
      }
    },

    upload: function () {
      var that = this;
      this.startUploadTimer(this.datas);

      //for each files - do the upload
      _.each(this.datas, function (data) {
        data.submit().error(function (jqXHR, textStatus, errorThrown) {
          // Triggers error on each model that had an abort or not found
          if (errorThrown === "abort" || jqXHR.status === 404) {
            that.app.trigger("upload-error", { id: data.__id });
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
            that.collection.remove(model);
          });

          clearInterval(uploadTimer);

          that.app.trigger("sc-error", [{ id: errorId, Message: timeoutErrorMessage }]);

          // To resets the indicator width
          that.model.set("globalPercentage", 0);

          // Resets everything
          that.datas = [];
          totalSize = 0;
          uploadedSize = 0;
          that.model.set("queueWasAborted", true);
        }
      }, 100);
    },
    getUploadedFileItems: function () {
      return this.model.get("uploadedFileItems");
    },
    updateRealImage: function (data, id) {
      var model = _.find(this.collection.models, function (themodel) {
        return themodel.get("id") === id;
      });
      if (typeof model != "undefined" && model != null) {
        model.set("image", "/sitecore/shell/client/Speak/Assets/img/unknown_icon_32.png");
        model.set("itemId", data.uploadedFileItems[0].ItemId);
        this.app.trigger("upload-fileUploaded", model.toJSON());
      }
    },
    afterRender: function () {
      var that = this;
      this.uploadFile.fileupload(
          {
            pasteZone: $(".sc-uploader-content"),
            add: function (e, data) {
              data.url = that.url;
              //acceptFileTypes
              var dfd = $.Deferred();
              var file = data.files[0];

              if (that.disablemultiplefilesupload) {
                var currentAmountOfFiles = that.model.get("totalFiles") || 0;
                if (currentAmountOfFiles == 1) {
                  file.error = 'ONLY_ONE_FILE_ALLOWED';
                  dfd.rejectWith(this, [data]);
                  that.app.trigger("upload-fileAdded-error", file);
                  return dfd.promise();
                }
              }

              if (typeof that.acceptFileTypes != "undefined" && that.acceptFileTypes != null) {



                if (that.acceptFileTypes &&
                      !(that.acceptFileTypes.test(file.type) ||
                      that.acceptFileTypes.test(file.name))) {
                  file.error = 'INVALID_FILE_TYPE';
                  dfd.rejectWith(this, [data]);
                  that.app.trigger("upload-fileAdded-error", file);
                  return dfd.promise();
                }
              }

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
              setupDataForFiles(that.$preeview, files, that.collection, function (model) {

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
                    that.model.set("uploadedFileItems", res.uploadedFileItems);
                    that.model.set("hasFilesToUpload", null);
                    that.model.set("totalFiles", 0);
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
          }
      );

      if (this.disabledraganddrop) {
        $(document).on('drop dragover', function (e) {
          e.preventDefault();
        });
        this.uploadFile
            .on('fileuploadpaste', function (e, data) {
              e.preventDefault();
            })
            .on('fileuploaddrop', function (e, data) {
              e.preventDefault();
            })
            .on('fileuploaddragover', function (e, data) {
              e.preventDefault();
            });
      }

      this.uploadFile.on("fileuploadprogress", function (e, data) {
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

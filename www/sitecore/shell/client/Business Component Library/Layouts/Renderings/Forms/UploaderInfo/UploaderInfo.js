define(["sitecore"], function (_sc) {
    var Info = Backbone.LayoutManager.extend({
        events: {
            "click .remove": "remove"
        },
        template: "uploaderInfo-info",
        updateInfo: function () {
            var percentage = this.model.get("percentage"),
            hasError = this.model.get("error");
            
            if (percentage > 0 || hasError) {
              this.$el.find("input").attr("disabled", "disabled");
              this.$el.find("textarea").attr("disabled", "disabled");
            }
          
            if (hasError) {
                //this.$el.find(".remove").removeAttr("disabled");
                //this.$el.find(".remove").remove();
                this.$el.find(".remove").hide();
                this.$el.find(".progress").hide();
                this.$el.find(".ready").addClass("hide");
                this.$el.find(".failed").fadeIn();
                return;
            }
          
            if (percentage === 100) {
                this.model.viewModel.done(true);
                this.$el.find(".remove").removeAttr("disabled");
                this.$el.find(".remove").remove();
                this.$el.find(".progress").hide();
                this.$el.find(".completed").removeClass("hide").fadeIn();                
            } else if (percentage > 0) {
                this.$el.find(".ready").addClass("hide");
                this.$el.find(".progress").removeClass("hide").fadeIn();
                this.$el.find(".remove").attr("disabled", "disabled");
            }
        },
        initialize: function (options) {
            this.parent = options.parent;
            var type = this.model.get("type");
            if (!type) {
                this.model.set("fileSize", "");
                this.model.set("type", "");
            }
            this.model.on("change", this.updateInfo, this);
        },
        afterRender: function () {
            this.sync();
        },
        remove: function (e) {

            this.model.set("deleted", true);
            this.parent.app.trigger("sc-uploader-remove", this.model.toJSON());
            this.collection.remove(this.model);
            this.$el.remove();
        }
    });

    var InfoPanel = Backbone.LayoutManager.extend({
        template: "uploaderInfo",
        initialize: function (options) {
            this.parent = options.parent;
            this.collection.on("add", this.addUploadInfoView, this);
        },
        addUploadInfoView: function (info) {

            info.on("change", this.communicateUpdates, this);
            var info = new Info({ model: info, collection: this.collection, parent: this.parent, serialize: info.toJSON() });
            this.$el.append(info.el);
            info.render();
        },
        communicateUpdates: function (model) {

            if (model.get("deleted")) {
                this.parent.app.trigger("upload-info-deleted", model);
            } else {
                this.parent.app.trigger("upload-info-updated", model);
            }
        }
    });

    var FileInfos = Backbone.Collection.extend({
        model: _sc.Definitions.Models.Model
    });

    _sc.Factories.createBaseComponent({
        name: "UploaderInfo",
        base: "ControlBase",
        collection: FileInfos,
        selector: ".sc-uploaderInfo",
        initialize: function () {
            this.infoPanel = new InfoPanel({ model: this.model, parent: this, collection: this.collection, app: this.app });
            this.app.on("upload-fileAdded", this.addInfo, this);
            this.app.on("upload-progress", this.updateInfo, this);
            this.app.on("upload-error", this.flagFile, this);
            this.$el.append(this.infoPanel.el);
            this.infoPanel.render();
        },
        files: function () {
            return _.map(this.collection.models, function (model) { return model.viewModel; });
        },
        flagFile: function (errorObject) {
            var id = errorObject.id;
            var update = _.find(this.collection.models, function (img) {
                return img.get("id") === id;
            }, this);
            
            update.set("error", true);
        },
        updateInfo: function (info) {
            var update = _.find(this.collection.models, function (img) {
                return img.get("id") === info.id;
            }, this);
            update.viewModel.percentage(info.percentage);
        },
        addInfo: function (info) {
            this.collection.add(info);
        }
    });
});

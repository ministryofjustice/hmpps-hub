define(["sitecore", "/-/speak/v1/contenttesting/RequestUtil.js"], function (sc, requestUtil) {
    var endpointUrl = "/sitecore/shell/api/sitecore/Layout/RenderItem";

    sc.Factories.createBaseComponent({
        name: "ContentTestingDataRepeater",
        base: "ControlBase",
        selector: ".sc-contenttesting-data-repeater",
        attributes: [
            { name: "itemId", defaultValue: null, value: "$el.data:sc-itemid" },
            { name: "database", defaultValue: "core", value: "$el.data:sc-database" },
            { name: "isBusy", defaultValue: false },
            { name: "renderedApps", defaultValue: null },
            { name: "markup", defaultValue: null }
        ],

        extendModel: {
            appendData: function (elements) {
                this.processingData = this.processingData.concat(elements);
            },

            getNextData: function () {
                return this.processingData.shift();
            },

            checkBusy: function () {
                if (this.processingData.length < 1) {
                    this.set("isBusy", false);
                }
            }
        },

        initialize: function () {
            this.model.processingData = [];
            this.model.set("renderedApps", new window.Backbone.Collection());

            this.model.on("change:itemId change:database", this._getMarkup, this);
            this._getMarkup();
        },

        reset: function () {
            var renderedApps = this.model.get("renderedApps");
            renderedApps.each(function (app) {
                app.destroy();
            });

            renderedApps.reset();
            this.$el.empty();
        },

        addData: function (elements) {
            if (!elements || elements.length < 1) {
                return;
            }

            this.model.set("isBusy", true);

            this.model.appendData(elements);
            _.each(elements, this.renderItem, this);
        },

        renderItem: function () {
            if (this.model.get("markup")) {
                this._processPendingItems();
            }
        },

        _getMarkup: function () {
            var itemId = this.model.get("itemId");
            var database = this.model.get("database");

            if (!itemId || !database) {
                return;
            }

            this.model.set("markup", null);

            var url = sc.Helpers.url.addQueryParameters(endpointUrl, {
                "sc_itemid": itemId,
                "sc_database": database
            });

            var lang = $('meta[data-sc-name=sitecoreLanguage]').attr("data-sc-content");
            if (lang) {
                url = sc.Helpers.url.addQueryParameters(url, {
                    "sc_lang": lang
                });
            }

            var ajaxOptions = {
                cache: false,
                url: url,
                context: this,
                success: function (data) {
                    this.model.set("markup", data);
                    this._processPendingItems();
                }
            };

            requestUtil.performRequest(ajaxOptions);
        },

        _insertRendering: function (callback) {
            var self = this;
            this.app.insertMarkups(this.model.get("markup"), _.uniqueId("subapp_"), {
                $el: self.$el
            }, function (app) {
                if (app.ScopedEl.length < 1) {
                    return;
                }

                var data = self.model.getNextData();
                if (data) {
                    self.model.get("renderedApps").add(app);
                    self.model.trigger("subAppLoaded", { app: app, data: data });

                    self.model.checkBusy();
                }

                if (callback) {
                    callback.apply(self);
                }
            });
        },

        _processPendingItems: function() {
            if(this.model.processingData.length >= 1) {
                this._insertRendering(this._processPendingItems);
            }
        }
    });
});
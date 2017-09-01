require.config({
  baseUrl: '/sitecore/shell/client/Applications/ContentTesting/Common/lib'
});

define(["sitecore", "BindingUtil", "VersionInfo", "DataUtil", "IDUtil"], function (Sitecore, bindingUtil, versionInfo, dataUtil, idUtil) {
    var testItemsProperty = "testItemUris";

    var SelectPagesToTest = function (options) {
      var ob = {
        _host: options.hostPage,
        _itemInfo: options.testItemDataSource,
        _testItemUriProperty: options.testItemUriProperty,
        _testItemTemplateIdProperty: options.testItemTemplateProperty,
        _selectItemDialog: options.selectItemDialog,
        _compareTemplates: options.compareTemplates,
        showThumbnails: options.hostPage.showThumbnails,

        init: function () {
          if (this._host.SelectedItemAccordion) {
            this._itemInfo.on("change:name", bindingUtil.propagateChange, {
              source: this._itemInfo,
              sourceProp: "name",
              target: this._host.SelectedItemAccordion,
              targetProp: "header",
              prefix: this._host.SelectedItemAccordion.get("header") + " - "
            });
          }

          if (this._host.ThumbnailImage) {
            this._host.on("change:" + this._testItemUriProperty, bindingUtil.propagateChange, {
              source: this._host,
              sourceProp: this._testItemUriProperty,
              target: this._host.ThumbnailImage,
              targetProp: function (ob, val) {
                var uri = new dataUtil.DataUri(val);
                ob.set({
                  itemId: uri.id,
                  language: uri.lang,
                  version: uri.ver,
                  revision: uri.rev
                });
              }
            });
          }

          if (this._host.SelectedItemName) {
            this._itemInfo.on("change:name", bindingUtil.propagateChange, {
              source: this._itemInfo,
              sourceProp: "name",
              target: this._host.SelectedItemName,
              targetProp: "text"
            });
          }

          if (this._host.SelectedItemVersion) {
            this._itemInfo.on("change:version", bindingUtil.propagateChange, {
              source: this._itemInfo,
              sourceProp: "version",
              target: this._host.SelectedItemVersion,
              targetProp: "text"
            });
          }

          if (this._host.Language) {
            this._itemInfo.on("change:language", bindingUtil.propagateChange, {
              source: this._itemInfo,
              sourceProp: "language",
              target: this._host.Language,
              targetProp: "text"
            });
          }

          if (this._host.Created) {
            this._itemInfo.on("change:created", bindingUtil.propagateChange, {
              source: this._itemInfo,
              sourceProp: "created",
              target: this._host.Created,
              targetProp: "text"
            });
          }

          if (this._host.CreatedBy) {
            this._itemInfo.on("change:createdBy", bindingUtil.propagateChange, {
              source: this._itemInfo,
              sourceProp: "createdBy",
              target: this._host.CreatedBy,
              targetProp: "text"
            });
          }

          if (this._host.LastTest) {
            this._itemInfo.on("change:lastTest", bindingUtil.propagateChange, {
              source: this._itemInfo,
              sourceProp: "lastTest",
              target: this._host.LastTest,
              targetProp: "text"
            });
          }

          if (this._host.LastTestBy) {
            this._itemInfo.on("change:lastTestBy", bindingUtil.propagateChange, {
              source: this._itemInfo,
              sourceProp: "lastTestBy",
              target: this._host.LastTestBy,
              targetProp: "text"
            });
          }

          if (this._host.DailyVisitors) {
            this._itemInfo.on("change:dailyVisitors", bindingUtil.propagateChange, {
              source: this._itemInfo,
              sourceProp: "dailyVisitors",
              target: this._host.DailyVisitors,
              targetProp: "text"
            });
          }

          if (this._host.BounceRate) {
            this._itemInfo.on("change:bounceRate", bindingUtil.propagateChange, {
              source: this._itemInfo,
              sourceProp: "bounceRate",
              target: this._host.BounceRate,
              targetProp: "text"
            });
          }

          if (this._host.AverageDuration) {
            this._itemInfo.on("change:averageDuration", bindingUtil.propagateChange, {
              source: this._itemInfo,
              sourceProp: "averageDuration",
              target: this._host.AverageDuration,
              targetProp: "text"
            });
          }

          if (this._host.LastTestByBorder) {
            this._itemInfo.on("change:lastTestBy", bindingUtil.bindVisibility, {
              source: this._itemInfo,
              sourceProp: "lastTestBy",
              target: this._host.LastTestByBorder
            });

            // if lastTestBy was already null there will not be a change event fired for it.
            this._itemInfo.on("change:lastTest", bindingUtil.bindVisibility, {
              source: this._itemInfo,
              sourceProp: "lastTestBy",
              target: this._host.LastTestByBorder
            });
          }

          if (this._host.LastReportBorder) {
            this._itemInfo.on("change:lastTestBy", bindingUtil.bindVisibility, {
              source: this._itemInfo,
              sourceProp: "lastTestBy",
              target: this._host.LastReportBorder
            });

            this._itemInfo.on("change:lastTest", bindingUtil.bindVisibility, {
              source: this._itemInfo,
              sourceProp: "lastTestBy",
              target: this._host.LastReportBorder
            });
          }

          if (this._host.TestAgainstAccordion) {
            this._host.on("change:" + testItemsProperty, bindingUtil.propagateChange, {
              source: this._host,
              sourceProp: function (obj) { return (obj.get(testItemsProperty) || []).length; },
              target: this._host.TestAgainstAccordion,
              targetProp: "header",
              prefix: this._host.TestAgainstAccordion.get("header") + " (",
              postfix: ")"
            });
          }

          this._host.TestItemsRepeater.on("subAppLoaded", this.bindTestEntry, this);
          this._host.on("change:" + testItemsProperty, this.setTestItemsData, this);
          this._host.on("change:" + testItemsProperty, this._setAddPageOptions, this);
          this._host.on("change:" + this._testItemUriProperty, this._setAddPageOptions, this);
          this._host.on("addNewPageVersionTestItem", this.addNewPageVersionTestItem, this);
          this._host.on("addPreviousPageVersionTestItem", this.addPreviousPageVersionTestItem, this);
		  this._host.AddPreviousVersionComboBox.on("change:selectedItemId" , this.addPreviousPageVersionTestItem, this);
          this._host.on("selectExistingItemTestItem", this.selectExistingItemTestItem, this);
          this._host.on("addExistingItemTest", this.addExistingItemTest, this);          
        },

        loadTest: function(options) {
          this._host.set(testItemsProperty, _.map(options.PageUris, function (str) {
            return new dataUtil.DataUri(str);
          }));
        },

        createTestOptions: function (options) {
          options.PageUris = _.map(this._host.get(testItemsProperty), function (item) {
            return item.toString();
          });
        },

        addPreviousPageVersionTestItem: function () {
		  if(this._host.AddPreviousVersionComboBox.attributes.selectedValue == 0)
			  return;
          var itemUri = this._host.get(this._testItemUriProperty);
          if (!itemUri || itemUri.length === 0) {
            alert(this._host.Texts.get("You must select a page to test"));
            return;
          }

          var uri = new dataUtil.DataUri(itemUri);
          var previousVersionUri = _.clone(uri);
          previousVersionUri.ver = this._host.AddPreviousVersionComboBox.attributes.selectedValue;
          
          if (this._addTestItem(previousVersionUri.id, previousVersionUri.lang, previousVersionUri.ver, "a")) {
            this._host.AddPageDialog.hide();    
          }
        },

        addNewPageVersionTestItem: function () {
          var itemUri = this._host.get(this._testItemUriProperty);
          if (!itemUri || itemUri.length === 0) {
            alert(this._host.Texts.get("You must select a page to test"));
            return;
          }

          var warningText = this._host.NewVersionWarningLabel.get("text");
          if (warningText && confirm(warningText)) {
            var self = this;
            var uri = new dataUtil.DataUri(itemUri);
            versionInfo.addNewVersion({
              id: uri.id,
              lang: uri.lang
            }, function (id, version, revision, lang) {
              if (self._addTestItem(id, lang, version, revision)) {
                self._host.AddPageDialog.hide();
              }
            });
          }
        },

        addPageOptionSelect: function(){
          var sel = this._host.AddPageOptionList.get("selectedItem");
          var click = sel.attributes.Click;
          if (click) {
            this[click]();
          }
        },

        selectExistingItemTestItem: function () {
          this._selectItemDialog.setTitle(this._host.Texts.get("Select page to add to test"));

          // Callback lives on the app; the host page
          this._selectItemDialog.setSelectButtonCallback("addExistingItemTest");
          this._selectItemDialog.setSelectionValidationCallback(this.validateSelection, this);
          this._selectItemDialog.show();
        },

        validateSelection: function () {
          if (this._compareTemplates) {
            var templateId = this._host.get("selectedTemplateId");
            var testItemTemplateId = this._host.get(this._testItemTemplateIdProperty);
            if (!idUtil.areEqual(templateId, testItemTemplateId)) {
              this._selectItemDialog.addWarning(this._host.Texts.get("The selected page has a different template. Please select another page"));
            }
          }

          var itemId = this._host.get("selectedItemId");
          if (itemId) {
            var uri = this._host.get(this._testItemUriProperty);
            if (uri) {
              uri = new dataUtil.DataUri(uri);
            }
            var self = this;
            versionInfo.getLatestVersionNumber({
              id: itemId,
              lang: uri.lang
            }, function (id, version, revision, lang) {
              var selectedUri = new dataUtil.DataUri();
              selectedUri.id = id;
              selectedUri.lang = lang;
              selectedUri.ver = version;
              selectedUri.rev = revision;

              if (self._isItemInThisTest(selectedUri)) {
                self._selectItemDialog.addWarning(self._host.Texts.get("The item has already been added"));
              }
            });
          }

          return null;
        },

        addExistingItemTest: function () {
          var itemId = this._host.get("selectedItemId");
          if (!itemId || itemId.length === 0) {
            alert(this._host.Texts.get("You must select a page to test"));
            return;
          }

          var uri = this._host.get(this._testItemUriProperty);
          if (uri) {
            uri = new dataUtil.DataUri(uri);
          }
          
          if (this._compareTemplates)
          {
            var templateId = this._host.get("selectedTemplateId");
            var testItemTemplateId = this._host.get(this._testItemTemplateIdProperty);
            if (!idUtil.areEqual(templateId, testItemTemplateId))
            {
              alert(this._host.Texts.get("The selected page has a different template. Please select another page"));
              return;
            }
          }          

          var self = this;
          versionInfo.getLatestVersionNumber({
            id: itemId,
            lang: uri.lang
          }, function (id, version, revision, lang) {
            if (self._addTestItem(id, lang, version, revision)) {
              self._selectItemDialog.hide();
            }
          });
        },

        setTestItemsData: function () {
          var items = this._host.get(testItemsProperty);
          var alreadyAdded = [];
          var appsToRemove = [];
          var rep = this._host.TestItemsRepeater;

          var renderedApps = rep.get("renderedApps");
          renderedApps.each(function (app) {
            var appItemId = app.get("itemId");
            var appItemLang = app.get("language");
            var appItemVer = app.get("version");

            if (_.find(items, function (item) { return item.id === appItemId && item.lang === appItemLang && item.ver === appItemVer; }) == undefined) {
              // don't change the collection while enumerating it
              appsToRemove.push(app);
              app.ScopedEl.remove();
            } else {
              alreadyAdded.push({ id: appItemId, lang:appItemLang, ver: appItemVer });
            }
          });

          renderedApps.remove(appsToRemove);
          _.each(appsToRemove, function (app) {
            app.destroy();
          });

          _.each(items, function (item) {
            if (_.find(alreadyAdded, function (addedItem) { return item.equals(addedItem); }) == undefined) {
              rep.viewModel.addData([item]);
            }
          });
        },

        bindTestEntry: function (args) {
          var subapp = args.app;
          var data = args.data;

          if (this.showThumbnails) {
            subapp.PageThumbnail.set({
              itemId: data.id,
              version: data.ver,
              revision: data.rev,
              language: data.lang
            });
          }

          subapp.ItemInfoDataSource.set("itemUri", data.toString());
          subapp.set("itemId", data.id);
          subapp.set("version", data.ver);
          subapp.set("language", data.lang);

          // todo: Investigate why binding isn't working for this.
          subapp.ItemInfoDataSource.on("change:name", bindingUtil.propagateChange, {
            source: subapp.ItemInfoDataSource,
            sourceProp: "name",
            target: subapp.Title,
            targetProp: "text"
          });

          subapp.ItemInfoDataSource.on("change:version", bindingUtil.propagateChange, {
            source: subapp.ItemInfoDataSource,
            sourceProp: "version",
            target: subapp.Version,
            targetProp: "text"
          });

          subapp.ItemInfoDataSource.on("change:warnings", bindingUtil.propagateChange, {
            source: subapp.ItemInfoDataSource,
            sourceProp: "warnings",
            target: subapp,
            targetProp: "warnings"
          });

          subapp.on("removeEntry", this.removeEntry, this);
          subapp.on("editEntry", this.editEntry, this);

          var app = this._host;
          app.on("change:mode", function () {
            subapp.RemoveButton.set("isEnabled", app.get("mode") != "report");
          });
          subapp.RemoveButton.set("isEnabled", app.get("mode") != "report");
        },

        removeEntry: function (subapp) {
          var appItemId = subapp.get("itemId");
          var appItemVer = subapp.get("version");

          // clone the existing array so change events work properly
          var existing = _.clone(this._host.get(testItemsProperty));
          var modified = _.reject(existing, function (item) { return item.id === appItemId && item.ver === appItemVer; });

          this._host.set(testItemsProperty, modified);
        },

        editEntry: function (subapp) {
          var url = Sitecore.Helpers.url.addQueryParameters("/?sc_mode=edit", {
            sc_itemid: subapp.get("itemId"),
            sc_version: subapp.get("version"),
            sc_lang: subapp.get("language")
          });

          var w = window.open(url, "_blank");

          var refresh = function () {
            subapp.ItemInfoDataSource.refresh();
          };

          $(w).on("beforeunload", refresh);
          $(w).unload(refresh);
        },

        _addTestItem: function (id, lang, ver, rev) {
          if (!rev) {
            alert(this._host.Texts.get("The item does not have a version in the current language"));
            return false;
          }

          // store this in the host app to make observation easier
          var toAdd = new dataUtil.DataUri();
          toAdd.id = id;
          toAdd.lang = lang;
          toAdd.ver = ver;
          toAdd.rev = rev;

          if (this._isItemInThisTest(toAdd)) {
            alert(this._host.Texts.get("The item has already been added"));
            return false;
          }

          // clone the existing array so change events work properly
          var existing = _.clone(this._host.get(testItemsProperty));
          var items = existing || [];
          items.push(toAdd);
          this._host.set(testItemsProperty, items);

          return true;
        },

        _isItemInThisTest: function (dataUri) {
          var hostItemUri = new dataUtil.DataUri(this._host.get(this._testItemUriProperty));

          // clone the existing array so change events work properly
          var existing = _.clone(this._host.get(testItemsProperty));
          var items = existing || [];
          var compareItems = items.concat(hostItemUri);

          if (_.find(compareItems, function (item) {
            return dataUri.equals(item);
          }) != undefined) {
            return true;
          }

          return false;
        },

        _setAddPageOptions: function () {
          var hostItemUri = new dataUtil.DataUri(this._host.get(this._testItemUriProperty));
          var allowPreviousVersion = hostItemUri.ver > 1;

          if (allowPreviousVersion) {
            var prevHostItemUri = _.clone(hostItemUri);
            prevHostItemUri.ver = this._host.AddPreviousVersionComboBox.attributes.selectedValue;

            var existing = this._host.get(testItemsProperty);
            var items = existing || [];
            items = items.concat(hostItemUri);

            allowPreviousVersion = _.find(items, function (item) {
              return prevHostItemUri.equals(item);
            }) === undefined;
          }

          this._host.AddPreviousPageVersionLink.set("isEnabled", allowPreviousVersion);

          // todo Check security of the source item to see if author can create a new version
        }
      };

      ob.init();
      return ob;
    };

    return {
      testItemsProperty: testItemsProperty,
      SelectPagesToTest: SelectPagesToTest
    }
  });
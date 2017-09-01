define([
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacySitecore.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacyjQuery.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Utils/ClientBeacon.js"
], function (_scl, $sc, clientBeacon) {

  var FINAL_LAYOUT_FIELD = "{04BF00DB-F5FB-41F7-8AB7-22408372A981}";

  function removePlaceholder() {
    if (!this.chrome || !this.chrome.element) {
      return;
    }

    var placeholderOpenCode = this.chrome.element.prevAll("code[chrometype=placeholder][kind=open]").eq(0);
    if (!placeholderOpenCode) {
      return;
    }

    var key = placeholderOpenCode.attr("key");
    var content = $sc("[placeholderkey='" + key + "']");
    if (content) {
      var display = content.attr("displayAttr");
      content.css("display", display);
      content.removeAttr("dynamic");
      content.removeAttr("displayAttr");
      content.removeAttr("wasselected");
      content.removeAttr("placeholderkey");
    }

    var id = key.split('/')[0];
    var itemUri = new _scl.ItemUri(id, _scl.PageModes.PageEditor.language(), id, 1);
    _scl.PageModes.ChromeManager.setFieldValue(itemUri, FINAL_LAYOUT_FIELD, 'delete');

    if (this.chrome) {
      _scl.PageModes.ChromeManager.hideSelection();

      this.chrome.remove();
      _scl.PageModes.ChromeManager.resetChromes();
    }
  }

  function deleteControl(chrome) {
    var rootPlaceholder = this.resolveRootPlaceholder(chrome);
    if (!rootPlaceholder) {
      return;
    }

    this._deleteControl(chrome);

    var key = rootPlaceholder.attr("key");
    var id = key.split('/')[0];

    var itemUri = new _scl.ItemUri(id, _scl.PageModes.PageEditor.language(), 1, "");
    _scl.PageModes.ChromeManager.setFieldValue(itemUri, FINAL_LAYOUT_FIELD, "updated");
  }

  function resolveRootPlaceholder(chrome) {
    var parent = chrome.parent();
    var done = false;
    while (!done) {
      if (!parent) {
        return null;
      }

      if (parent._openingMarker
        && parent._openingMarker.is("code[chrometype=placeholder][kind=open]")
        && parent._openingMarker.attr("key")
        && this.isFxmPlaceholder(parent._openingMarker.attr("key"))) {
        done = true;
      } else {
        parent = parent.parent();
      }
    }

    return parent._openingMarker;
  }

  function isFxmPlaceholder(key) {
    var placeholders = clientBeacon.placeholders();

    for (var p = 0; p < placeholders.length; p++) {
      if (placeholders[p].toLowerCase() == key.replace("/", "").toLowerCase()) {
        return true;
      }
    }

    return false;
  }

  function addControlResponse(id, openProperties, ds) {

    var options = _scl.PageModes.ChromeTypes.Placeholder.getDefaultAjaxOptions("insert");

    options.context = this;
    options.data.rendering = id;
    options.data.placeholderKey = this.placeholderKey();
    options.data.position = this._insertPosition;
    options.data.url = window.location.href;

    if (ds) {
      options.data.datasource = ds;
    }

    options.success = function (serverData) {
      var data = _scl.PageModes.Utility.parsePalleteResponse(serverData);
      var persistedLayout;

      if (data.layout) {
        var layoutCtrl = $sc("#scLayout");
        persistedLayout = layoutCtrl.val();
        layoutCtrl.val(data.layout);
      }

      var renderingUniqueId;

      if (data.url) {
        renderingUniqueId = $sc.parseQuery(data.url)["sc_ruid"];
      }

      _scl.PageModes.ChromeManager.hideSelection();

      if (data.url != null) {

        var self = this;

        $.ajax({
          url: "/sitecore/api/ssc/experienceeditorcomponent/service/" + id + "/GetRenderingHtml?uniqueId=" + renderingUniqueId + "&placeholder=" + self.placeholderKey() + "&dataSource=" + ds,
          type: "GET",
          headers: {
            "X-RequestVerificationToken": jQuery('[name=__RequestVerificationToken]').val(),
            "X-Requested-With": "XMLHttpRequest"
          }
        }).fail(function (error) {

          if (persistedLayout) {
            $sc("#scLayout").val(persistedLayout).change();
          }

          alert(error);
        }).done(function (response) {

          _scl.PageModes.ChromeManager.select(null);

          var responseHtml = jQuery(response);
          var sublayout = responseHtml.select("#r_" + id);

          var renderingData = { html: sublayout };
          self.insertRendering(renderingData, openProperties);
        });
      } else {
        _scl.PageModes.Utility.tryAddStyleSheets(data.styleSheets);
        _scl.PageModes.Utility.tryAddScripts(data.scripts);
        _scl.PageModes.ChromeManager.select(null);
        this.insertRendering(data, openProperties);
      }
    };

    $sc.ajax(options);
  }

  function editPropertiesResponse(renderingChrome) {
    if (!_scl.LayoutDefinition.readLayoutFromRibbon()) {
      return;
    }

    var commandName = "preview";
    var options = _scl.PageModes.ChromeTypes.Placeholder.getDefaultAjaxOptions(commandName);

    options.data.renderingUniqueId = renderingChrome.type.uniqueId();
    options.data.url = window.location.href;

    this._addAnalyticsOptions(renderingChrome, options);

    if (options.data.variationId) {
      options.data.command += "variation";
    }
    else if (options.data.conditionId) {
      options.data.command += "condition";
    }

    options.context = this;
    options.success = function (serverData) {
      var data = _scl.PageModes.Utility.parsePalleteResponse(serverData);
      var persistedLayout;

      _scl.PageModes.ChromeHighlightManager.stop();

      if (data.url != null) {

        var self = this;

        var id = renderingChrome.type.renderingId();
        var renderingUniqueId = options.data.renderingUniqueId;

        var requestUrl = "/sitecore/api/ssc/experienceeditorcomponent/service/" + id;
        requestUrl = requestUrl + "/UpdateRenderingHtml?uniqueId=" + renderingUniqueId;
        requestUrl = requestUrl + "&deviceId=" + options.data.deviceid;
        requestUrl = requestUrl + "&placeholder=" + self.placeholderKey();

        $.ajax({
          url: requestUrl,
          type: "POST",
          headers: {
            "X-RequestVerificationToken": jQuery('[name=__RequestVerificationToken]').val(),
            "X-Requested-With": "XMLHttpRequest"
          },
          data: "=" + options.data.layout
        }).fail(function (error) {
          alert(error);
        }).done(function (response) {

          _scl.PageModes.ChromeManager.select(null);

          var responseHtml = jQuery(response);
          var sublayout = responseHtml.select("#r_" + id);

          var renderingData = { html: sublayout };

          _scl.PageModes.ChromeManager.select(null);
          self._doUpdateRenderingProperties(renderingChrome, renderingData);
        });
      }
      else {
        _scl.PageModes.ChromeManager.select(null);
        _scl.PageModes.Utility.tryAddStyleSheets(data.styleSheets);
        _scl.PageModes.Utility.tryAddScripts(data.scripts);
        this._doUpdateRenderingProperties(renderingChrome, data.html);
      }
    };

    $sc.ajax(options);
  }

  function handleMessage(message, params) {
    switch (message) {

      case "chrome:placeholder:removeFxmPlaceholder":
        this.removePlaceholder();
        return;
    }

    this._handleMessage(message, params);
  }

  // reassign prototypes
  if (!_scl.PageModes.ChromeTypes.Placeholder.prototype._handleMessage) {
    _scl.PageModes.ChromeTypes.Placeholder.prototype._handleMessage = _scl.PageModes.ChromeTypes.Placeholder.prototype.handleMessage;
    _scl.PageModes.ChromeTypes.Placeholder.prototype.handleMessage = handleMessage;
  }

  _scl.PageModes.ChromeTypes.Placeholder.prototype.removePlaceholder = removePlaceholder;
  _scl.PageModes.ChromeTypes.Placeholder.prototype.addControlResponse = addControlResponse;
  _scl.PageModes.ChromeTypes.Placeholder.prototype.editPropertiesResponse = editPropertiesResponse;
  _scl.PageModes.ChromeTypes.Placeholder.prototype._deleteControl = _scl.PageModes.ChromeTypes.Placeholder.prototype.deleteControl;
  _scl.PageModes.ChromeTypes.Placeholder.prototype.deleteControl = deleteControl;
  _scl.PageModes.ChromeTypes.Placeholder.prototype.resolveRootPlaceholder = resolveRootPlaceholder;
  _scl.PageModes.ChromeTypes.Placeholder.prototype.isFxmPlaceholder = isFxmPlaceholder;
});
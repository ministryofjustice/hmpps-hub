define([
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacySitecore.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacyjQuery.js"
], function (_scl, $sc) {

    function changeCondition(id, sender, preserveCacheUpdating) {

        var fieldId;

        if (sender && sender.key() == "field") {
            fieldId = sender.type.id();
        }

        var conditions = this.getConditions();
        if (!preserveCacheUpdating) {
            this.updateConditionCache($sc.first(conditions, function () { return this.isActive; }));
        }

        _scl.PageModes.ChromeManager.chromeUpdating.fire(this.chrome);
        _scl.PageModes.ChromeOverlay.showOverlay(this.chrome);

        var cachedElements = _scl.PageModes.Personalization.RenderingCache.getCachedCondition(this.chrome, id);
        if (cachedElements) {
            _scl.PageModes.ChromeHighlightManager.stop();
            this.updateOnConditionActivation(id, cachedElements, fieldId);
            _scl.PageModes.ChromeHighlightManager.resume();
            return;
        }

        var options = _scl.PageModes.ChromeTypes.Placeholder.getDefaultAjaxOptions("activatecondition");
        options.data.renderingUniqueId = this.uniqueId();
        options.data.conditionId = $sc.toShortId(id);
        options.data.url = window.location.href;
        options.context = this;
        options.beforeSend = $sc.noop();
        options.complete = $sc.noop();
        options.error = function (xhr, error) {
            console.error(xhr.statusText + ":" + error);
            this._endActivation("changecondition");
            _scl.PageModes.ChromeManager.resetSelectionFrame();
        };

        options.success = function (serverData) {

            var data = _scl.PageModes.Utility.parsePalleteResponse(serverData);
            _scl.PageModes.ChromeHighlightManager.stop();

            if (data.url != null) {

                var deviceId = options.data.deviceid || '';

                var renderingUniqueId = options.data.renderingUniqueId;

                var rendering = _scl.LayoutDefinition.getRendering(renderingUniqueId);
                var renderingId = rendering["@id"];
                var placeholderKey = rendering["@ph"];

                var requestUrl = "/sitecore/api/ssc/experienceeditorcomponent/service/" + renderingId;
                requestUrl = requestUrl + "/UpdateRenderingHtml?uniqueId=" + renderingUniqueId;
                requestUrl = requestUrl + "&deviceId=" + deviceId;
                requestUrl = requestUrl + "&placeholder=" + placeholderKey;

                var layoutData = data.layout;

                var self = this;

                $.ajax({
                    url: requestUrl,
                    type: "POST",
                    headers: {
                        "X-RequestVerificationToken": jQuery('[name=__RequestVerificationToken]').val(),
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    data: "=" + layoutData
                }).fail(function (error) {
                    console.error(error);
                    self._endActivation("changecondition");
                    _scl.PageModes.ChromeManager.resetSelectionFrame();
                }).done(function (response) {

                    var responseHtml = jQuery(response);
                    var sublayout = responseHtml.select("#r_" + id);

                    self.updateOnConditionActivation(id, sublayout, fieldId);
                    _scl.PageModes.ChromeHighlightManager.resume();
                });
            }
            else {
                _scl.PageModes.Utility.tryAddStyleSheets(data.styleSheets);
                _scl.PageModes.Utility.tryAddScripts(data.scripts);
                this.updateOnConditionActivation(id, $sc(data.html), fieldId);
                _scl.PageModes.ChromeHighlightManager.resume();
            }
        };

        $sc.ajax(options);
    }

    // reassign prototypes
    _scl.PageModes.ChromeTypes.Rendering.prototype.changeCondition = changeCondition;
});
var arResComponents;
if (window.location.host && window.location.host !== '') { // launching when address to web-page
    arResComponents = [
                        "/-/speak/v1/contenttesting/TooltipCustom.js",
                        "/-/speak/v1/contenttesting/RequestUtil.js",
                        "/-/speak/v1/contenttesting/DataUtil.js",
                        "/-/speak/v1/assets/moment.min.js"
    ];
}
else { // launching of the code-coverage estemating
    arResComponents = [];
}

define(arResComponents, function (tooltip, requestUtil, dataUtil) {
    var defaultStartUrl = "/sitecore/shell/api/ct/TestThumbnails/StartGetThumbnails";
    var defaultTryFinishUrl = "/sitecore/shell/api/ct/TestThumbnails/TryFinishGetThumbnails";

    return {
        ImageThumbs: function (options) {
            var safeOptions = options || {};
            return {
                dictionary: safeOptions.dictionary || null,

                _tooltip: undefined,

                populateImages: function (items, imgElementLocator, startGetUrl, endGetUrl, itemCallback, finishCallback, width, height) {
                    var self = this;
                    this._tooltip = new TooltipCustom(false);

                    if (items && imgElementLocator) {
                        _.each(items, function (item) {
                            var el = imgElementLocator(item.uId);
                            if (el && el.length > 0) {
                                var infoElem;
                                if (el[0].id.toLowerCase().indexOf("before") >= 0) {
                                    infoElem = el.parent().parent().find("#imgInfoBefore");
                                } else {
                                    infoElem = el.parent().parent().find("#imgInfoAfter");
                                }
                                if (infoElem) {
                                    var content = self.getTooltipContent(item);
                                    self._tooltip.setTarget(infoElem, content);
                                }
                            }
                        });
                    }

                    var data = _.map(items, function (item) {
                        var attrs = item.attrs || {};

                        return {
                            id: attrs.id,
                            version: attrs.version,
                            language: attrs.language,
                            mvvariants: attrs.mvvariants,
                            combination: attrs.combination,
                            rules: attrs.rules,
                            compareVersion: attrs.compareVersion,
                            revision: attrs.revision,
                            uid: item.uId,
                            deviceId: attrs.deviceId,
                            width: width || 0,
                            height: height || 0
                        };
                    });

                    var ajaxOptions = {
                        cache: false,
                        url: startGetUrl || defaultStartUrl,
                        type: "POST",
                        data: "=" + JSON.stringify(data),
                        context: this,
                        success: function (data) {
                            if (data) {
                                if (data.urls) {
                                    _.each(data.urls, function (t) {
                                        self._setImage(t.uid, t.url, imgElementLocator, itemCallback);
                                    });
                                }
                                if (data.handle) {
                                    self._tryFinishPopulateImages({
                                        endGetUrl: endGetUrl || defaultTryFinishUrl,
                                        handle: data.handle,
                                        imgElementLocator: imgElementLocator,
                                        itemCallback: itemCallback,
                                        finishCallback: finishCallback
                                    });
                                }
                                else if (finishCallback) {
                                    finishCallback();
                                }
                            }
                        },
                        error: function (req, status, error) {
                            console.log("ImageThumbs ajax call failed");
                            console.log(status);
                            console.log(error);
                            console.log(req);
                        }
                    };

                    requestUtil.performRequest(ajaxOptions);
                },

                _tryFinishPopulateImages: function (params) {
                    var self = this;

                    var ajaxOptions = {
                        cache: false,
                        url: params.endGetUrl + "?handle=" + params.handle,
                        type: "GET",
                        context: this,
                        success: function (data) {
                            if (data) {
                                if (data.urls) {
                                    _.each(data.urls, function (t) {
                                        self._setImage(t.uid, t.url, params.imgElementLocator, params.itemCallback);
                                    });
                                }
                                if (data.IsDone) {
                                    if (params.finishCallback) {
                                        params.finishCallback();
                                    }
                                }
                                else {
                                    setTimeout(function () {
                                        self._tryFinishPopulateImages(params);
                                    }, 1500);
                                }
                            }
                        },
                        error: function (req, status, error) {
                            console.log("ImageThumbs ajax call failed");
                            console.log(status);
                            console.log(error);
                            console.log(req);
                        }
                    };

                    requestUtil.performRequest(ajaxOptions);
                },

                _setImage: function (uid, url, imgElementLocator, itemCallback) {
                    var el;
                    var updated = true;
                    if (imgElementLocator) {
                        el = imgElementLocator(uid);
                        if (el.attr("src") !== url) {
                            el.attr("src", url);
                        }
                        else {
                            updated = false;
                        }
                    }

                    if (itemCallback && updated) {
                        itemCallback(uid, el, url);
                    }
                },

                getTooltipContent: function (item) {
                    // todo: Skynet: translate
                    var info = "";
                    if (this.dictionary)
                        info = "<span><b>" + this.dictionary.get("Variation information:") + "</b></span></br>";
                    info += this.getVariationInfo(item);
                    return info;
                },

                getVariationInfo: function (item, isStyle) {
                    var infoObj = {};
                    if (!this.dictionary)
                        return "";
                    if (item.testType) {
                        infoObj[this.dictionary.get("Type:")] = this.dictionary.get(item.testType);
                    }
                    if (item.testType === "Content" || item.testType === "Page") {
                        if (item.attrs.path && item.attrs.path !== "")
                            infoObj[this.dictionary.get("Item:")] = item.attrs.path;

                        if (item.attrs.version && item.attrs.version !== "") {
                            var version = item.attrs.version;
                            if (item.attrs.language && item.attrs.language !== "")
                                version += "-" + item.attrs.language;
                            infoObj[this.dictionary.get("Version:")] = version;
                        }

                        if (item.createdDate) {
                            var d = (new Date(item.createdDate));
                            if (d && !isNaN(d)) {
                                var finalDate = moment(d).format("DD-MMM-YYYY");
                                infoObj[this.dictionary.get("Created:")] = finalDate;
                            }
                        }
                    }
                    else if (item.testType === "Component") {
                        if (item.attrs.componentname && item.attrs.componentname !== "") {
                            infoObj[this.dictionary.get("Name:")] = item.attrs.componentname;
                        }
                        if (item.attrs.item && item.attrs.item !== "") {
                            infoObj[this.dictionary.get("Item:")] = item.attrs.item;
                        }
                        if (item.attrs.hidden && item.attrs.hidden !== "") {
                            infoObj[this.dictionary.get("Hidden")] = this.dictionary.get(item.attrs.hidden);
                        }
                    }
                    else if (item.testType === "Personalization") {
                        if (item.attrs.condition && item.attrs.condition !== "") {
                            var condition = decodeURIComponent(item.attrs.condition);
                            condition = condition.replace(/\+/g, " ");
                            infoObj[this.dictionary.get("Condition:")] = condition;
                        }
                        if (item.attrs.componentname && item.attrs.componentname !== "") {
                            infoObj[this.dictionary.get("Name:")] = item.attrs.componentname;
                        }
                        if (item.attrs.personalizedcontent && item.attrs.personalizedcontent !== "") {
                            infoObj[this.dictionary.get("Personalized content:")] = item.attrs.personalizedcontent;
                        }
                        if (item.attrs.hidden && item.attrs.hidden !== "") {
                            infoObj[this.dictionary.get("Hidden") + ": "] = this.dictionary.get(item.attrs.hidden);
                        }

                    }

                    var html = "";
                    if (isStyle) {
                        html = dataUtil.getVariationInfoHTML(infoObj);
                    }
                    else {
                        var keys = _.keys(infoObj);
                        for (var i = 0; i < keys.length; i++) {
                            html += keys[i] + " " + infoObj[keys[i]] + "</br>";
                        }
                    }

                    return html;
                },

                pad: function (number, length) {
                    var str = '' + number;
                    while (str.length < length) {
                        str = '0' + str;
                    }
                    return str;
                }
            }
        },

    }
});
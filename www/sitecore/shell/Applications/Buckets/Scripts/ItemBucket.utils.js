/*********** Global Variables ***********/

var continueSearchViewType = 'ContinueSearch';
var dialogViewType = 'Dialog';
var dataSourceViewType = 'DataSource';
var rteViewType = 'Rte';
var mediaViewType = 'Media';
var indexName;
var databaseName;
var DefaultPageSize = 20;
/*****************************************/

var SC = SC || {};
SC.waitFor = function (testFx, onReady, timeOutMillis) {
  var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 0,
    start = new Date().getTime(),
    condition = false,
    interval = setInterval(function () {
      if (((new Date().getTime() - start < maxtimeOutMillis) || maxtimeOutMillis === 0) && !condition) {
        condition = (typeof (testFx) === "string" ? eval(testFx) : testFx());
      } else {
        if (!condition) {
          console.log("'waitFor()' timeout");
        } else {
          typeof (onReady) === "string" ? eval(onReady) : onReady();
        }

        clearInterval(interval);
      }
    }, 50);
};

function BindItemResult(b) {
    if (window.currentBucketsViewType == window.dataSourceViewType) {
        $j('#ItemLink', parent.document.body).val(b);
    } else if (window.currentBucketsViewType == window.mediaViewType) {
        b = b.replace(window.imageFullPath, "");
        $j('#Filename', parent.document.body).val(b);
        $j('#ItemName', parent.document.body).val(b);
    } else if (window.workBox != "") {
        window.scForm.getParentForm().postRequest('', '', '', 'search:launchresult(url=' + b + ')');
    } else {
        $j('#ItemLink', parent.document.body).val(b);
        jQuery.ajax({
            type: "POST",
            url: "/sitecore/shell/Applications/Buckets/ItemBucket.asmx/GetMediaPath",
            data: "{'id' : '" + b + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (a) {


                var parsedValue = a.d.replace('/sitecore/system/Marketing Center/Test Lab', '').replace('/sitecore/templates', '');

                $j('#TemplateName', parent.document.body).val(a.d);
                $j('#Filename', parent.document.body).val(parsedValue);
                $j('#IconFile', parent.document.body).val(a.d);

                var parsedId = b.replace(/{/g, "").replace(/}/g, "").replace(/-/g, "");
                if ($j('#TemplateLister_Selected', parent.document.body).length > 0) {
                    $j('#TemplateLister_Selected', parent.document.body)[0].value = parsedId;

                }
                if ($j('#Treeview_Selected', parent.document.body).length > 0) {
                    $j('#Treeview_Selected', parent.document.body)[0].value = parsedId;
                }

                var numRand = Math.floor(Math.random() * 101);
                $j('#TreeList_selected', parent.document.body).html($j('#TreeList_selected', parent.document.body).html() + "<option id=\"I" + numRand + "\" value=\"I" + numRand + "|" + b + "\">" + a.d + "</option>");
            }
        });
    }
}

function GetItemPathFromMediaLibrary(id) {
    jQuery.ajax({
        type: "POST",
        url: "/sitecore/shell/Applications/Buckets/ItemBucket.asmx/GetMediaPath",
        data: "{'id' : '" + id + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (a) {
            return a.d;
        }
    });
}

function BindItemResultDatasource() {
  var query = buildQuery();
  query = query.concat(OnlyFacets).filter(function(element) { return !!element; });

  var result = query.map(function(filter) {
    var boolOperation = filter.operation == 'must' ? '+' : filter.operation == 'not' ? '-' : '';
    var sortOperation = filter.operation == 'desc' ? '[desc]' : '';
    return boolOperation + filter.type + ':' + filter.value + sortOperation;
  }).join(';');

  $j('#ItemLink', parent.document.body).val(result);
}

function RetrieveScalabilitySettings() {
    jQuery.ajax({
        type: "POST",
        url: "/sitecore/shell/Applications/Buckets/ItemBucket.asmx/QueryServer",
        data: "",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (a) {
            window.QueryServer = a.d;
        }
    });
}

function GetAllSearchFilters() {
    jQuery.ajax({
        type: "POST",
        url: "/sitecore/shell/Applications/Buckets/ItemBucket.asmx/GetAllSearchFilters",
        data: "",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (a) {
            SC.AllFilters = a.d;
            return a.d;
        }
    });
}

function GetDefaultView() {
    jQuery.ajax({
        type: "POST",
        url: "/sitecore/shell/Applications/Buckets/ItemBucket.asmx/GetDefault",
        data: "",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (a) {
            window.CurrentView = a.d;
        }
    });
}

function GetCurrentCulture() {
    jQuery.ajax({
        type: "POST",
        url: "/sitecore/shell/Applications/Buckets/ItemBucket.asmx/GetCalendarCulture",
        data: "",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (a) {
            window.CurrentCulture = a.d;
        }
    });
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function runQuery(o, pageNumber, onSuccessFunction, onErrorFunction, pageSize) {

  if (pageSize == null || pageSize == 'undefined') {
      pageSize = DefaultPageSize;
  }

  var internalIndexName = indexName != undefined ? indexName : "";
  var dbName = databaseName != undefined ? databaseName : "";
  var parameters = {
    q: __scCleanupProperties(o),
    pageNumber: pageNumber,
    type: "Query",
    pageSize: pageSize,
    version: "1",
    id: getParameterByName("id"),
    indexName: internalIndexName,
    db: dbName
  };

  __includeAdditionalParameters(parameters);
  
  $j.ajax({
        type: "GET",
        url: QueryServer + "/sitecore/shell/Applications/Buckets/Services/Search.ashx?callback=?",
        contentType: "application/json; charset=utf-8",
        dataType: "jsonp",
        cache: false,
        data: parameters,
        responseType: "json",
        success: onSuccessFunction,
        error: onErrorFunction
    });
    if (window.currentBucketsViewType == window.dataSourceViewType) {
        BindItemResultDatasource();
    }
}

function runFacet(o, pageNumber, onSuccessFunction, onErrorFunction, pageSize) {

  var internalIndexName = indexName != undefined ? indexName : "";
    
  if (pageSize == null || pageSize == 'undefined') {
      pageSize = DefaultPageSize;
  }
  
  var parameters = {
    q: __scCleanupProperties(o),
    pageNumber: pageNumber,
    type: "facet",
    pageSize: pageSize,
    version: "1",
    id: getParameterByName("id"),
    indexName: internalIndexName
  };
  
  __includeAdditionalParameters(parameters);
  
  $j.ajax({
        type: "GET",
        url: QueryServer + "/sitecore/shell/Applications/Buckets/Services/Search.ashx?callback=?",
        contentType: "application/json; charset=utf-8",
        dataType: "jsonp",
        cache: false,
        data: parameters,
        responseType: "json",
        success: onSuccessFunction,
        error: onErrorFunction
    });
}

function Meta(a) {
    return a.IsClone ? "opacity:0.4;" : '';
}

function buildQuery() {
  return window.SC.searchBoxViewModel.allFiltersInObjectArray();
}

function findAndRemove(array, property, value) {
    $j.each(array, function (index, result) {
        if (result[property] == value) {
            array.splice(index, 1);
        }
    });
    return array;
}

function findAndAlert(array, property, value) {
    var done = false;
    $j.each(array, function (index, result) {
        if (result[property] == value) {
            done = true;
        }
    });
    return done;
}

function DisableInception() {
    if ($j("#StartButton", parent.parent.parent.document.body).length > 0) {
        if ($j(".scEditorTabIcon", parent.parent.document.body).length > 0) {
            var contextTabs = $j(".scEditorTabIcon", parent.document.body);
            var disableSearch = false;
            $j.each(contextTabs, function () {
                if (this.src.indexOf("view.png") > 0) {
                    disableSearch = true;
                    $j(this.parentNode.parentNode).css("display", "none");
                    $j(this.parentNode.parentNode.nextElementSibling).css("display", "");
                }
                if (this.src.indexOf("view_add.png") > 0) {
                    disableSearch = true;
                    $j(this.parentNode.parentNode).css("display", "none");
                    $j(this.parentNode.parentNode.nextElementSibling).css("display", "");
                }
            });
            $j("#EditorFrames", parent.document.body).children()[0].style.display = "none";
            $j("#FContent", parent.document.body)[0].style.display = "";
        }
    }
}

function establishViews() {
    var a = $j("#ui_element");
    var defaultViews = ["list", "grid"];  //TODO: Hardcoded Logic

    var views;
    jQuery.ajax({
        type: "POST",
        url: "/sitecore/shell/Applications/Buckets/ItemBucket.asmx/GetViews",
        data: "",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (b) {
            views = b.d;
            $j.each(views, function (index, filter) {
                $j("#views").append("<a id=\"" + filter.ViewName + "\" class=\"" + filter.ViewName + " scView\" title=\"" + filter.ToolTip + "\"></a>");
                $j(".scView").click(function () {
                    FacetOn = false;
                    CurrentView = filter.ViewName;
                    CurrentFacetFilter = [];
                    OnlyFacets = [];
                    $j("#views a").removeClass('active');
                });
            });

            $j.each(views, function (index, filter) {
                $j("#" + filter.ViewName).click(function () {
                    CurrentView = filter.ViewName;
                    a.find(".sb_up").click();
                    pageNumber = 0;

                    $j.each(defaultViews, function (subIndex, subfilter) {
                        $j("." + subfilter).removeClass("active");
                    });
                    $j("#" + filter.ID).addClass("active");
                    $j('.content').css({ 'opacity': 1.0 });
                    $j("#ajaxBusy").css({ display: "block" });
                    var n = buildQuery();
                    runQuery(n, pageNumber, h, OnSearchRunFail);
                    runFacet(n, pageNumber, meme, OnSearchRunFail);

                    $j(".navAlpha").html("");
                    $j(".slide-out-div").html("").prepend(LoadGifText);
                    $j("#ajaxBusyFacet").css({
                        display: "none",
                        margin: "0px auto",
                        width: "44px"
                    });
                });
            });

            if (window.CurrentView && window.CurrentView !== "list") {
                $j("#views a").removeClass("active");
                $j("#" + window.CurrentView).addClass("active");
            }
        }
    });
}

function Contains(string, substring) {
    var result = false;

    if (string != null) {
        result = string.toLowerCase().indexOf(substring) >= 0;
    }
    return result;
}

SC.waitFor('window.$j', function () {
  // Copied from the original jQuery "toggle" implementation
  $j.fn.clickToggle = function (fn, fn2) {
    var args = arguments,
      guid = fn.guid || jQuery.guid++,
      i = 0,
      toggler = function (event) {
        var lastToggle = ($j._data(this, "lastToggle" + fn.guid) || 0) % i;
        $j._data(this, "lastToggle" + fn.guid, lastToggle + 1);
        event.preventDefault();
        return args[lastToggle].apply(this, arguments) || false;
      };

    toggler.guid = guid;
    while (i < args.length) {
      args[i++].guid = guid;
    }

    return this.click(toggler);
  };
});

String.prototype.scFormat = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (m, n) { return args[n] || ''; });
};

function scHtmlEscape(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
};

function scHtmlUnescape(value) {
    return String(value)
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#039;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
};

function __includeAdditionalParameters(parameters) {
    var database = scGetURLParameter('sc_content');
    if (database) {
      parameters.sc_content = database;
    }
}

function scGetURLParameter(name, wnd) {
  if (!wnd) {
    wnd = window;
  }
  
  var value = (RegExp(name + '=' + '(.+?)(&|$)').exec(wnd.location.search) || [, null])[1];
  if (value) {
    return value;
  }
  
  if (wnd.top && wnd.top != wnd) {
    return scGetURLParameter(name, wnd.top);
  }

  return null;
}

function __scCleanupProperties(arr) {
  var res = [];
  $j(arr).each(function (indx, elem) {
    res.push({
      type: elem.type,
      value: elem.value,
      operation: elem.operation
    });
  });

  return res;
}
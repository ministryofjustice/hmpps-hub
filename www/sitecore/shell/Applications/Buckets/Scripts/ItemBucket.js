/*
===================================
Invoke Namespace
===================================
*/
var SC = SC || {};

/*
===================================
Initialize
===================================
*/

SC.InitUtils = {
    Init: function () {
        GetDefaultView(); //Set the default view of the search, retrieved off the item
        GetCurrentCulture(); //Get and Set the Current UI Browser Culture
        GetAllSearchFilters(); //Get all Search Types from the content tree e.g. author:
        RetrieveScalabilitySettings(); //This will check if you have designate a URL for all queries to be run from and switch to that. Default is empty. (Local)
        Initialization();
        if (!$j(frameElement).is(':hidden')) {
          SC.searchBoxViewModel.userRawInputHasFocus(true);
          scrollToTop();
        }
    }
};

SC.waitFor('SC.libsAreLoaded', SC.InitUtils.Init);

SC.AllFilters = null;

/*********** Global Variables ***********/
var CurrentFacetFilter;
var OnlyFacets;
var CurrentPage;
var CurrentView = "";
var Expanded = false;
var QueryServer = "";
var FacetOn = false;
var CurrentCulture = '';
var pageNumber = 0;
var scPageAmount = 0;
var maxPageCount = 10;

/*****************************************/

//Detects what is the current search view
function detectViewMode() {
    if (CurrentView != "") {
        return CurrentView;
    }

    return $j("#views").find(".active").attr("id");
}

function launchMultipleTabs(ids) {
    var parsedIds = ids.split("|");
    $j.each(parsedIds, function () {
        window.scForm.getParentForm().postRequest('', '', '', 'contenteditor:launchtab(url=' + this + ')');
        return false;
    });
};

function pad(str, max) {
    return str.length < max ? pad("0" + str, max) : str;
}

function fetchChildren(searchResult) {
  var element = $j(searchResult).parent().parent();
  var isItemExpanded = element.find(".itemchildselector").hasClass("expanded");

  if (isItemExpanded) {
      element.find(".itemchildselector").attr('src', '/sitecore/shell/themes/standard/images/expand15x15.gif');
    element.parent().find(".ItemChild").remove();
    //remove all child references.
    jQuery(".BlogPostArea").css('box-shadow', '1px 1px 8px #EEE');
    element.find(".itemchildselector").removeClass("expanded").addClass("collapsed");
  } else {

    jQuery.ajax({
      type: "POST",
      url: "/sitecore/shell/Applications/Buckets/ItemBucket.asmx/GetChildren",
      data: "{'id' : '" + element.parent().prevObject[0].id + "'}",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (a) {
        if (a.d.length > 0) {
          jQuery(".BlogPostArea").css('box-shadow', '#9B9B9B 1px 1px 4px');
          var dropDownImage = element.find(".itemchildselector");
          dropDownImage.attr('src', '/sitecore/shell/themes/standard/images/collapse15x15.gif');
          dropDownImage.removeClass("collapsed").addClass("expanded");


        }
        $j.each(a.d,
            function () {
              var objectFromCalll = JSON.parse(this);

              if (objectFromCalll.Name != null) {
                  var mediaCommand = "";
                  var languageList = "";
                  var actionList = "";
                  var version = objectFromCalll.Version;
                  var itemId = objectFromCalll.ItemId;
                  var language = objectFromCalll.Language;

                  if (objectFromCalll.Languages != null || objectFromCalll.Languages != undefined) {
                      if (objectFromCalll.Languages.length > 0) {
                          $j.each(objectFromCalll.Languages, function () {
                              languageList += "<a class=\"baketLang\" href=\"\" onclick=\"scForm.browser.clearEvent(event || window.event, true);scForm.getParentForm().postRequest('','','','" + 'contenteditor:launchtab' + "(url=" + itemId + ", la=" + this.split('|')[0] + ", version=" + version + ")'); return false;\">" + this.split('|')[0] + "</a>";
                          });
                      }
                  }

                var imageWidth = "80";
                var imageHeight = "60";


                var resizeTemplateIcon = "";

                var hasChildren = objectFromCalll.HasChildren && SC.enableExpandChildren ? '<span><img class="itemchildselector" src="/sitecore/shell/themes/standard/images/expand15x15.gif"></span>' : '';
                var template = '<li id="' + objectFromCalll.ItemId + '" class="BlogPostArea ItemChild" onclick="{0}" style="margin-bottom: 20px;margin-top: 20px;margin-left:' + InnerItem(objectFromCalll) + '"><div class="BlogPostViews">' + '<a class="ceebox imgcontainer"  title="" href="#"  onclick="{0}"><img onerror="this.onerror=null;this.src=\'../Buckets/images/default.jpg\';" src="' + objectFromCalll.ImagePath + '?w=' + imageWidth + '&h=' + imageHeight + '&db=master" ' + resizeTemplateIcon + '  class="attachment-post-thumbnail wp-post-image" alt="' + objectFromCalll.Name + '" title="' + objectFromCalll.Name + ' - ' + objectFromCalll.Path + '" /></a></div><h5 class="BlogPostHeader"><a href="javascript:void(0);" onclick="{0}">' + objectFromCalll.Name + '</a><span title="This item has">' + "" + '</span></h5><div class="BlogPostContent"><strong>' + templateStub + ': </strong>' + objectFromCalll.TemplateName + ' <strong>' + locationStub + ': </strong>' + objectFromCalll.Bucket + '</div><div class="BlogPostFooter"> <div class="moreiteminfo"><strong>' + versionStub + ': </strong>' + objectFromCalll.Version + ' <strong>' + createdStub + ': </strong>' + objectFromCalll.CreatedDate.substring(0, 10) + ' <strong> ' + byStub + ': </strong> ' + objectFromCalll.CreatedBy + ' <strong> ' + languageStub + ': </strong> ' + objectFromCalll.Language + ' </div><div></div></li>';

                switch (window.currentBucketsViewType) {
                  case window.rteViewType:
                    var resultStr = template.scFormat('toggleSelected(this); scClose(\'~/link.aspx?_id=' + objectFromCalll.ItemId.replace(/{/g, "").replace(/}/g, "").replace(/-/g, "") + '&amp;_z=z\', \'' + objectFromCalll.Name + '\'); return false;');
                    break;
                  case window.dialogViewType:
                  case window.dataSourceViewType:
                    resultStr = template.scFormat('BindItemResult(\'' + objectFromCalll.ItemId + '\');toggleSelected(this);');
                    break;
                  case window.mediaViewType:
                    resultStr = template.scFormat('BindItemResult(\'' + objectFromCalll.Path + '\');toggleSelected(this);');
                    break;
                  default:
                    resultStr = template.scFormat('scForm.getParentForm().postRequest(\'\',\'\',\'\',\'' + '`' + '(url=' + objectFromCalll.ItemId + ', la=' + objectFromCalll.Language + ', datasource=' + objectFromCalll.Datasource + ')\'); return false;');
                }

                element.after(resultStr);

              } else {
                var blur = objectFromCalll.Path == null ? true : false;
                if (blur) {
                  template = '';
                  if ($j.browser.mozilla) {
                    template = '<li id="' + noValue + '" class="BlogPostArea" onclick="{0}" style="text-shadow: 0 0 13px #000000, 0 0 4px #000000;color: transparent;margin-left:' + "" + '"><div class="BlogPostViews">' + '<a class="ceebox imgcontainer"  title="" href="#"  onclick="{0}"><img width="' + "32" + '" onerror="this.onerror=null;this.src=\'../Buckets/images/default.jpg\';" height="' + "32" + '" src="' + "" + '?w=' + "32" + '&h=' + "32" + '&db=master" ' + "" + 'style="text-shadow: 0 0 13px #000000, 0 0 4px #000000;color: transparent;"  class="attachment-post-thumbnail wp-post-image" alt="' + "" + '" title="' + "" + '" /></a></div><h5 class="BlogPostHeader"><a href="javascript:void(0);" onclick="{0}" style="text-shadow: 0 0 13px #000000, 0 0 4px #000000;color: transparent;">' + noValue + '</a><span title="">' + noValue + '</span></h5><div class="BlogPostContent" style="text-shadow: 0 0 13px #000000, 0 0 4px #000000;color: transparent;"><strong>' + noValue + ': </strong>' + noValue + ' <strong>' + noValue + ': </strong>' + noValue + '</div><div class="BlogPostFooter"  style="text-shadow: 0 0 13px #000000, 0 0 4px #000000;color: transparent;">' + noValue + ' <div><strong>' + noValue + ': </strong>' + noValue + ' <strong>' + noValue + ': </strong>' + noValue + ' <strong> ' + noValue + ': </strong> ' + noValue + ' </div><div></div></li>';
                  } else {
                    template = '<li id="' + noValue + '" class="BlogPostArea" onclick="{0}" style="-webkit-filter: grayscale(0.5) blur(10px);margin-left:' + "" + '"><div class="BlogPostViews">' + '<a class="ceebox imgcontainer"  title="" href="#"  onclick="{0}"><img width="' + "32" + '" onerror="this.onerror=null;this.src=\'../Buckets/images/default.jpg\';" height="' + "32" + '" src="' + "" + '?w=' + "32" + '&h=' + "32" + '&db=master" ' + "" + '  class="attachment-post-thumbnail wp-post-image" alt="' + "" + '" title="' + "" + '" /></a></div><h5 class="BlogPostHeader"><a href="javascript:void(0);" onclick="{0}">' + noValue + '</a><span title="">' + noValue + '</span></h5><div class="BlogPostContent"><strong>' + noValue + ': </strong>' + noValue + ' <strong>' + noValue + ': </strong>' + noValue + '</div><div class="BlogPostFooter">' + noValue + ' <div><strong>' + noValue + ': </strong>' + noValue + ' <strong>' + noValue + ': </strong>' + noValue + ' <strong> ' + noValue + ': </strong> ' + noValue + ' </div><div></div></li>';
                  }
                }

                element.after(template);
              }

            });
      }
    });
  }

};

function mergeFilterArrays(filterArray1, filterArray2) {
    var hash = {};
    var union = [];
    var temp = $j.merge([], filterArray1);
    $j.merge(temp, filterArray2);
    $j.each(temp, function (index, value) {
        var key = "_" + value.type + "_" + value.value + "_" + value.operation;
        hash[key] = value;
    });
    $j.each(hash, function (key, value) { union.push(value); });
    return union;
}

function RemoveFacet(key) {
    var o = new Array();
    var existingFilters = buildQuery();
    if (existingFilters) {
        for (var i = 0; i < existingFilters.length; i++) {
            o.push({
                "type": existingFilters[i].type, "value": existingFilters[i].value, "operation": existingFilters[i].operation
            });
        }
        }

    $j("#loadingSection").prepend('<div id="ajaxBusy"></div>');
    $j("#ajaxBusy").css({
    });

    if (CurrentFacetFilter.length == 0) {
        CurrentFacetFilter = o;
        $j.each(CurrentFacetFilter, function (i) {
            if (CurrentFacetFilter[i] != null && CurrentFacetFilter[i] != undefined) {
                if (CurrentFacetFilter[i].value === key) CurrentFacetFilter.splice(i, 1);
            }
        });
    } else {

        o = mergeFilterArrays(o, CurrentFacetFilter);
        CurrentFacetFilter = o;
        $j.each(CurrentFacetFilter, function (i) {
            if (CurrentFacetFilter[i] != null && CurrentFacetFilter[i] != undefined) {
                if (CurrentFacetFilter[i].value === key) CurrentFacetFilter.splice(i, 1);
            }
        });
    }

    OnlyFacets = $j.grep(CurrentFacetFilter, function (e) { return e.type == "custom" && e.isFacet == true; });

    if (CurrentView != "list" && CurrentView != "grid" && CurrentView != "") {
        runQuery(o, 0, h, OnSearchRunFail);
        runFacet(o, 0, meme, OnFacetRunFail);
    } else if (CurrentView == "grid") {
        runQuery(o, 0, h, OnSearchRunFail);
        runFacet(o, 0, meme, OnFacetRunFail);

        renderFacetLoadingAnimation();
    } else {
        runQuery(o, 0, OnComplete, OnSearchRunFail);
        runFacet(o, 0, meme, OnFacetRunFail);
    }

    renderFacetLoadingAnimation();

    if (window.currentBucketsViewType == window.dataSourceViewType) {
        BindItemResultDatasource();
    }
}

function renderFacetLoadingAnimation() {
    $j(".navAlpha").html("");
    $j(".slide-out-div").show().html("").prepend(LoadGifText);
    $j("#ajaxBusyFacet").css({
        margin: "0px auto",
        width: "44px"
    });
}

function meme(a) {
    renderFacetLoadingAnimation();

    if (OnlyFacets != undefined) {
        if (OnlyFacets.length > 0) {
          var facetList = '<div class="sideMask"><div class="side"><div class="sb_filter toggleon">' + currentFilters + '</div><div class="sideFilter"><ul>';
            $j.each(OnlyFacets,
                function () {
                    var escapedText = scHtmlEscape(this.title);
                    var innerText = this.title.length > 16 ? (scHtmlEscape(this.title.substring(0, 16)) + "...") : escapedText;
                    var escapedValue = scHtmlEscape(this.value);
                    facetList += '<li class="filter"><a href="javascript:void(0);" onclick="javascript:RemoveFacet(\'' + escapedValue + '\');" title="' + escapedText + '" class="facetClick facetClickSelected">' + innerText + "</a></li>";
                });
            facetList += "</ul></div></div></div>";
            $j(".navAlpha").append(facetList);
        }
    }

    if (a.facets != null) {
        jQuery.each(a.facets,
         function (index) {
             if (typeof (this[0]) != 'undefined') {

                 var b = '<div class="sideMask"><div class="side"><div class="sb_filter ' + (index > 4 ? "toggleoff" : "toggleon") + '">' + this[0].DisplayName + "<span></span></div><div class=\"sideFilter\" " + (index > 4 ? "style=\"display:none\"" : "") + "><ul>";

                 $j.each(this,
                     function () {
                         var cleanString = scHtmlEscape(this.Template.replace("\\", "~"));
                         var escapedTitle = scHtmlEscape(this.LocalizedName);
                         var innerText = (this.LocalizedName.length > 32 ? (scHtmlEscape(this.LocalizedName.substring(0, 32)) + "...") : escapedTitle);
                         var escapedValue = scHtmlEscape(this.Value);
                         b += '<li class="filter"><a href="javascript:void(0);" title="' + escapedTitle + '" class="facetClick" onclick="javascript:AppendFacet(\'' + this.ID + "','" + cleanString + "','" + this.Custom + "','" + escapedTitle + "');\"><span>" + innerText + "</span> <span>" + escapedValue + "</span>" + "</a></li>";
                     });

                 b += "</ul></div></div></div>";
                 $j(".navAlpha").append(b);
             }
         });
    }

    $j("#ajaxBusyFacet").css({
        display: "none",
        margin: "0px auto",
        width: "32px"
    });

    $j(".side .sb_filter").bind('click',
          function () {
              if ($j(this).hasClass('toggleon')) {
                  $j(this).removeClass('toggleon').addClass('toggleoff');
              } else if ($j(this).hasClass('toggleoff')) {
                  $j(this).removeClass('toggleoff').addClass('toggleon');;
              }

              $j(this).next("div").slideToggle(100);
          });

    $j(this).removeClass("pageClickLoad");

    if ($j(".navAlpha .side").length == 0) {
      var b = '<div class="sideMask"><div class="side"><div class="sb_filter">' + NoFacetsFound + "</div><div class=\"sideFilter\"><ul></ul></div></div></div>";
        $j(".navAlpha").append(b);


    };
}

function AppendFacet(b, c, custom, title) {
    var facetFilters = b.split(',');
    var filterValues = c.split('/');
    var titleValues = title.split('|');
    var o = new Array();
    FacetOn = true;

    for (var i = 0; i < facetFilters.length; i++) {
        var tempValue = filterValues[i];
        if (custom != '') {
            tempValue = tempValue.replace(custom.split(",")[1], custom.split(",")[0]);
        }

        if (filterValues[i].indexOf("|") > 0) {
            tempValue = filterValues[i].split("|")[1];
        }

        o.push({
            type: "custom",
            value: facetFilters[i] + "|" + tempValue,
            operation: "must",
            title: titleValues.length > i ? titleValues[i] : tempValue,
            isFacet: true
        });
    }

    var existingFilters = buildQuery();
    if (existingFilters) {
        for (var i = 0; i < existingFilters.length; i++) {
            o.push({
                "type": existingFilters[i].type, "value": existingFilters[i].value, "operation": existingFilters[i].operation, "title": existingFilters[i].value
            });
        }
        }

    $j("#loadingSection").prepend('<div id="ajaxBusy"></div>');
    $j("#ajaxBusy").css({
    });


    if (CurrentFacetFilter.length == 0) {
        CurrentFacetFilter = o;
    } else {
        o = mergeFilterArrays(o, CurrentFacetFilter);
        
        var newArray = new Array();
        for (var i = 0; i < o.length; i++) {
            var result = $j.grep(newArray, function (e) { return e.type == o[i].type && e.value == o[i].value && e.operation == o[i].operation; });

            if (result.length == 0) {
                newArray.push({
                    "type": o[i].type, "value": o[i].value, "operation": o[i].operation, "title": o[i].title, "isFacet": o[i].isFacet
                });
            }
        }

        CurrentFacetFilter = newArray;

        o = newArray;
    }

    OnlyFacets = $j.grep(CurrentFacetFilter, function (e) { return e.type == "custom" && e.isFacet == true; });

    if (CurrentView != "list" && CurrentView != "grid" && CurrentView != "") {
        runQuery(o, 0, h, OnSearchRunFail);
        runFacet(o, 0, meme, OnFacetRunFail);
    } else if (CurrentView == "grid") {
        runQuery(o, 0, h, OnSearchRunFail);
        runFacet(o, 0, meme, OnFacetRunFail);

        renderFacetLoadingAnimation();
    } else {
        runQuery(o, 0, OnComplete, OnSearchRunFail);
        runFacet(o, 0, meme, OnFacetRunFail);
    }

    renderFacetLoadingAnimation();

    if (window.currentBucketsViewType == window.dataSourceViewType) {
        BindItemResultDatasource();
    }
}

//Error Handlers
function OnSearchRunFail() {
    $j("#ajaxBusy").hide();
    $j("#search-error").fadeIn().delay(10000).fadeOut();
}

function OnFacetRunFail() {
    $j("#ajaxBusyFacet").hide();
    $j("#facet-error").fadeIn().delay(10000).fadeOut();
}

function OnComplete(a) {
    $j("#ajaxBusy").css({
        display: "none",
        margin: "0px auto"
    });

    $j("#results").html("");
    $j("#resultInfoMessage").empty();
    $j("#resultInfoMessage").append(resultInfoMessage.scFormat(a.SearchCount, a.SearchTime, a.Location));
    if ($j("#grid-content").hasClass('mainmargin')) {
        var htmlGridView = renderGridView(a);
        $j("#results").append(htmlGridView);

        $j(".pagination").remove();
        window.scPageAmount = a.PageNumbers;
        var e = renderPagination(a.CurrentPage);
        $j(".selectable").append(e);
        $j("#results").fadeIn("slow");

        $j("#ajaxBusy").hide();
    } else {
        $j(".pagination").remove();
        $j("#results").append('<div id="resultAppendDiv" style="overflow: auto; height: auto;">');
        parseResults(a);

        $j("#results").append("</div>");
        $j(".pagination").remove();
        window.scPageAmount = a.PageNumbers;
        e = renderPagination(a.CurrentPage);
        $j(".selectable").append(e);

    }

    $j("#ajaxBusyFacet").css({
        display: "none",
        margin: "0px auto",
        width: "32px"
    });
}

function renderGridView(data) {
    var htmlData = '<div class="mainmargin" id="grid-content" style="position: relative; width: 100%;overflow-x: hidden; overflow-y: hidden;">';
    $j.each(data.items,
        function () {
            var ifTemplateIcon = this.ImagePath.indexOf('/~/icon/') == 0 || this.ImagePath.indexOf(window.IconsCacheFolder) == 0;
            var imageWidth = ifTemplateIcon ? "48" : "48";
            var imageHeight = ifTemplateIcon ? "48" : "48";
            var resizeTemplateIcon = ifTemplateIcon ? "smallIcon" : "";
            var languageCount = (this.Languages || []).length;

            var template = '<div onclick="{0}" class="post_float rounded" title="' + nameStub + this.Name + contentStub + (this.Content ? (this.Content.length > 180 ? (this.Content.substring(0, 180) + "...") : this.Content) : '') + '" style="' + Meta(this) + '"><a class="ceebox imgcontainer" title="' + this.Name + '" href="#" onclick="{0}"><img onerror="this.onerror=null;this.src=\'../Buckets/images/default.jpg\';" src="' + this.ImagePath + '?w={1}&h={2}&db=master" class="attachment-post-thumbnail wp-post-image {3}" alt="' + this.Name + '" title="' + this.Name + ' - ' + this.Path + '" /></a><h2><a class="ceebox" title="' + this.Name + '" href="" onclick="{0}">' + this.Name + '</a></h2><div class="post_tags"> <strong>' + templateStub + ': </strong>' + this.TemplateName + ' <strong>' + locationStub + ': </strong>' + this.Bucket + "<br/><p>" + (this.Content ? (this.Content.length > 20 ? (this.Content.substring(0, 20) + "...") : this.Content) : '') + "</p> " + (versionStub + ": ").bold() + this.Version + ("<br/> " + createdStub + ": ").bold() + this.CreatedDate.substring(0, 10) + " <strong><br/>" + byStub + ": </strong> " + this.CreatedBy + ' <strong> ' + languageStub + ': </strong> ' + this.Language + "<br/></div></div>";
            switch (window.currentBucketsViewType) {
                case window.rteViewType:
                    htmlData += template.scFormat(' toggleSelected(this); scClose(\'~/link.aspx?_id=' + this.ItemId.replace(/{/g, "").replace(/}/g, "").replace(/-/g, "") + '&amp;_z=z\', \'' + this.Name + '\'); return false;', imageWidth, imageHeight, resizeTemplateIcon);
                    break;
                case window.dialogViewType:
                case window.dataSourceViewType:
                    htmlData += template.scFormat('BindItemResult(\'' + this.ItemId + '\'); toggleSelected(this);return false;', imageWidth, imageHeight, resizeTemplateIcon);
                    break;
                case window.mediaViewType:
                    htmlData += template.scFormat('BindItemResult(\'' + this.Path + '\'); toggleSelected(this); return false;', imageWidth, imageHeight, resizeTemplateIcon);
                    break;
                default:
                  var onClick = 'scForm.getParentForm().postRequest(\'\',\'\',\'\',\'' + data.launchType + '(url=' + this.ItemId + ', la=' + this.Language + ', datasource=' + this.Datasource + ')\'); return false;';
                    htmlData += template.scFormat(onClick, imageWidth, imageHeight, resizeTemplateIcon, (languageCount > 1) ? ' (' + languageCount + ')' : '');
            }
        });

    return htmlData + '</div>';
}

function toggleSelected(element) {

    $j('.post_float, .BlogPostArea').removeClass("highlight");
    $j(element).addClass("highlight");
}

function showTip() {
  $j(".hastip").stop(true).hide().fadeIn(400, function () {
    $j(".hastip").fadeOut(4000);
  });
}

function InnerItem(a) {
    return a.IsClone ? "35px;opacity:0.4;" : "0px;";
}

function h(a) {
    var mode = detectViewMode();
    $j("#results").html("");
    $j("#resultInfoMessage").empty();
    $j("#resultInfoMessage").append(resultInfoMessage.scFormat(a.SearchCount, a.SearchTime, a.Location));

    var modeObject;
    jQuery.ajax({
        type: "POST",
        url: "/sitecore/shell/Applications/Buckets/ItemBucket.asmx/GetView",
        data: "{'viewName' : '" + mode + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (serverResponse) {
            modeObject = serverResponse.d;
            var b = "";
            if (modeObject != undefined && modeObject.HeaderTemplate != "") {

                b = b + modeObject.HeaderTemplate;
                $j.each(a.items,
                    function (serverItem) {
                        if (a.items != 0) {
                            var templateFiller = this.TemplateName;
                            var metaFiller = Meta(this);
                            var launchTypeFiller = a.launchType;
                            var itemIdFiller = this.ItemId;
                            var imagePathFiller = this.ImagePath;
                            var languagesFiller = this.Languages || [];
                            var dynamicFields = this.DynamicFields;
                            var nameFiller = this.Name;
                            var bucketFiller = this.Bucket;
                            var contentFiller = (this.Content ? (this.Content.length > 140 ? (this.Content.substring(0, 140) + "...") : this.Content) : '');
                            var versionFiller = this.Version;
                            var createdFiller = (this.CreatedDate || "").substring(0, 10);
                            var createdbyFiller = this.CreatedBy;
                            var languageList = '';
                            var pathFiller = this.Path;
                            var updatedFiller = this.Updated;

                            if (!!this.Languages) {
                                $j.each(this.Languages, function () {
                                    languageList += this + "^";
                                });
                            }

                            var templateText = modeObject.ItemTemplate;
                            b = b + templateText.replace(/TemplatePlaceholder/g, templateFiller)
                                .replace(/LanguageCount/g, languagesFiller.length)
                                .replace(/LanguageList/g, languageList)
                                .replace(/NamePlaceholder/g, nameFiller)
                                .replace(/MetaPlaceholder/g, metaFiller)
                                .replace(/LaunchTypePlaceholder/g, launchTypeFiller)
                                .replace(/ItemIdPlaceholder/g, itemIdFiller)
                                .replace(/ImagePathPlaceholder/g, imagePathFiller)
                                .replace(/NamePlaceholder/g, nameFiller)
                                .replace(/BucketPlaceholder/g, bucketFiller)
                                .replace(/PathPlaceholder/g, pathFiller)
                                .replace(/ContentPlaceholder/g, contentFiller)
                                .replace(/VersionPlaceholder/g, versionFiller)
                                .replace(/CreatedPlaceholder/g, createdFiller)
                                .replace(/UpdatedPlaceholder/g, updatedFiller)
                                .replace(/CreatedByPlaceholder/g, createdbyFiller);

                            $j.each(dynamicFields, function (key, value) {
                                var dynamicText = value.Key + 'DynamicPlaceholder'; //TODO: Language Issue
                                var re = new RegExp(dynamicText, "gi");
                                b = b.replace(re, value.Value);
                            });
                        }
                    });

                b = b + modeObject.FooterTemplate;
            } else {
                b += renderGridView(a);
            }

            $j("#results").append(b);
            $j(".pagination").remove();
            
            window.scPageAmount = a.PageNumbers;
          
            var e = renderPagination(a.CurrentPage);
            
            $j(".selectable").append(e);
            $j("#results").fadeIn("slow");
            $j("#ajaxBusy").hide();

        },
        error: function (xhr, ajaxOptions, thrownError) {
            OnSearchRunFail(xhr);
        }
    });
}



function renderPagination(currentPage) { //TODO: Language Issue
    if (window.scPageAmount < 2) {
        return '<div class="pagination empty"><div>';
    }

    var c = '<div class="pagination"><ul>';
    var d = Math.floor((currentPage - 1) / maxPageCount) * maxPageCount + 1;
    var e = Math.min(d + maxPageCount - 1, window.scPageAmount);
    if (d > 1) {
    c += '<li class="previous-pages"><a class="pageLink" href="#" onclick="scrollToTop()" data-page="' + (d - 1) + '" ><</a></li>';
    }

    for (var i = d; i <= e; i++) {
        c += "<li " + (i == currentPage ? 'class="active"' : "") + '><a class="pageLink" onclick="scrollToTop()" data-page="' + i + '" href="javascript:void(0)">' + i + "</a></li>";
    }

    if (e < window.scPageAmount) {
    c += '<li class="next-pages"><a class="pageLink" onclick="scrollToTop()" href="#" data-page="' + (e + 1) + '">></a></li>';
    }

    c += "</ul></div>";
    return c;
}

function scrollToTop() {

    $j('html, body, .content').animate({
        scrollTop: $j("#MainPanel").offset().top
    }, 1000);

    return false;
}

function parseResults(resultCallBack) {
    var elementCount = 0;
    $j.each(resultCallBack.items,
        function () {

            if (resultCallBack.ContextDataView.length > 0) {
                $j.each(resultCallBack.ContextDataView, function () {
                    var appendResultContext = "";
                    if (this.Item1 == elementCount) {

                        appendResultContext = appendResultContext + this.Item2.HeaderTemplate;
                        var itemTemplate = this.Item2.ItemTemplate;
                        $j.each(this.Item4,
                            function (serverItem) {
                                if (this.items != 0) {
                                    var templateFiller = this.TemplateName;
                                    var metaFiller = Meta(this);
                                    var launchTypeFiller = resultCallBack.launchType;
                                    var itemIdFiller = this.ItemId;
                                    var imagePathFiller = this.ImagePath;
                                    var languagesFiller = this.Languages || [];
                                    var dynamicFields = this.DynamicFields;
                                    var nameFiller = this.Name;
                                    var bucketFiller = this.Bucket;
                                    var versionFiller = this.Version;
                                    var createdFiller = this.CreatedDate.substring(0, 10);
                                    var createdbyFiller = this.CreatedBy;
                                    var languageList = '';
                                    var pathFiller = this.Path;
                                    var datasourceFiller = this.Datasource;
                                    var updatedFiller = this.Updated;

                                    if (!!this.Languages) {
                                        $j.each(this.Languages, function() {
                                            languageList = languageList + this + "~";
                                        });
                                    }

                                  var templateText = itemTemplate;
                                    appendResultContext = appendResultContext + templateText.replace(/TemplatePlaceholder/g, templateFiller)
                                        .replace(/LanguageCount/g, languagesFiller.length)
                                        .replace(/LanguageList/g, languageList)
                                        .replace(/NamePlaceholder/g, nameFiller)
                                        .replace(/MetaPlaceholder/g, metaFiller)
                                        .replace(/LaunchTypePlaceholder/g, launchTypeFiller)
                                        .replace(/ItemIdPlaceholder/g, itemIdFiller)
                                        .replace(/ImagePathPlaceholder/g, imagePathFiller)
                                        .replace(/NamePlaceholder/g, nameFiller)
                                        .replace(/BucketPlaceholder/g, bucketFiller)
                                        .replace(/PathPlaceholder/g, pathFiller)
                                        .replace(/VersionPlaceholder/g, versionFiller)
                                        .replace(/CreatedPlaceholder/g, createdFiller)
                                        .replace(/UpdatedPlaceholder/g, updatedFiller)
                                        .replace(/DatasourcePlaceholder/g, datasourceFiller)
                                        .replace(/CreatedByPlaceholder/g, createdbyFiller);

                                    $j.each(dynamicFields, function (key, value) {
                                        var dynamicText = value.Key + 'DynamicPlaceholder'; //TODO: Language Issue
                                        var re = new RegExp(dynamicText, "gi");
                                        appendResultContext = appendResultContext.replace(re, value.Value);
                                    });
                                  
                                    var clickPlaceholder = "";
                                    switch (window.currentBucketsViewType) {
                                      case window.rteViewType:
                                        clickPlaceholder = 'toggleSelected(this); scClose(\'~/link.aspx?_id=' + itemIdFiller.replace(/{/g, "").replace(/}/g, "").replace(/-/g, "") + '&amp;_z=z\', \'' + nameFiller + '\'); return false;';
                                        break;
                                      case window.dialogViewType:
                                      case window.dataSourceViewType:
                                        clickPlaceholder = 'BindItemResult(\'' + itemIdFiller + '\');toggleSelected(this);';
                                        break;
                                      case window.mediaViewType:
                                        clickPlaceholder = 'BindItemResult(\'' + pathFiller + '\');toggleSelected(this);';
                                        break;
                                      default:
                                        clickPlaceholder = 'scForm.getParentForm().postRequest(\'\',\'\',\'\',\'' + resultCallBack.launchType + '(url=' + itemIdFiller + ', la=' + this.Language + ', datasource=' + this.Datasource + ')\'); return false;';
                                    }

                                    appendResultContext = appendResultContext.replace("ClickPlaceholder", clickPlaceholder);
                                }
                            });

                        appendResultContext = appendResultContext + this.Item2.FooterTemplate;

                    }
                    $j("#results").append(appendResultContext);
                });

            }

            if (this.Name != null) {
                var languageList = "";
                var version = this.Version;
                var itemId = this.ItemId;
                var language = this.Language;

                if (!!this.Languages) {
                    if (this.Languages.length > 0) {
                        $j.each(this.Languages, function () {
                            languageList += "<a class=\"baketLang\" href=\"\" onclick=\"scForm.browser.clearEvent(event || window.event, true);scForm.getParentForm().postRequest('','','','" + resultCallBack.launchType + "(url=" + itemId + ", la=" + this.split('|')[1] + ", version=" + version + ", datasource=" + this.Datasource + ")'); return false;\">" + this.split('|')[0] + "</a>";
                        });
                    }
                } else {
                    this.Languages = [];
                }

                var ifTemplateIcon = this.ImagePath && (this.ImagePath.indexOf('/~/icon/') == 0 || this.ImagePath.indexOf(window.IconsCacheFolder) == 0);
                var imageWidth = "80";
                var imageHeight = "60";

                switch (window.currentBucketsViewType) {
                  case window.rteViewType:
                  case window.dialogViewType:
                  case window.dataSourceViewType:
                  case window.mediaViewType:
                    languageList = [];
                  default:
                    break;
                }

                var resizeTemplateIcon = ifTemplateIcon ? '' : "";
                var hasChildren = this.HasChildren && SC.enableExpandChildren ? '<span><img class="itemchildselector" src="/sitecore/shell/themes/standard/images/expand15x15.gif"></span>' : '';
               
                if (!this.CreatedDate) { this.CreatedDate = "" }
              
                var template = '<div id="' + this.ItemId + '" class="BlogPostArea" onclick="{0}" style="margin-left:' + InnerItem(this) + '"><div class="BlogPostViews">' + '<a class="ceebox imgcontainer"  title="" href="#"  onclick="{0}"><img onerror="this.onerror=null;this.src=\'../Buckets/images/default.jpg\';" src="' + this.ImagePath + '?w=' + imageWidth + '&h=' + imageHeight + '&db=master" ' + resizeTemplateIcon + '  class="attachment-post-thumbnail wp-post-image" alt="' + this.Name + '" title="' + this.Name + ' - ' + this.Path + '" /></a></div><h5 class="BlogPostHeader"><a href="javascript:void(0);" onclick="scForm.browser.clearEvent(event || window.event, true);{0}">' + this.Name + '</a><span title="This item has ' + (this.Languages && this.Languages.length > 1 ? "" + this.Languages.length + " languages" : " 1 language") + '">' + (this.Languages && this.Languages.length > 1 ? "(" + this.Languages.length + ")" : "") + '</span></h5><div class="BlogPostContent"><strong>' + templateStub + ': </strong>' + this.TemplateName + ' <strong>' + locationStub + ': </strong>' + this.Bucket + '</div><div class="BlogPostFooter">' + (this.Content ? this.Content : '') + ' <div><strong>' + versionStub + ': </strong>' + this.Version + ' <strong>' + createdStub + ': </strong>' + this.CreatedDate.substring(0, 10) + ' <strong> ' + byStub + ': </strong> ' + this.CreatedBy + ' <strong> ' + languageStub + ': </strong> ' + this.Language + ' </div><div></div><div class="fetchChildren" onclick="scForm.browser.clearEvent(event || window.event, true);fetchChildren(this);" style="float: right;padding: 4px 6px;" title="Fetch Child Items">' + hasChildren + '</div></li>';
               
                switch (window.currentBucketsViewType) {
                    case window.rteViewType:
                        var resultStr = template.scFormat('toggleSelected(this); scClose(\'~/link.aspx?_id=' + this.ItemId.replace(/{/g, "").replace(/}/g, "").replace(/-/g, "") + '&amp;_z=z\', \'' + this.Name + '\'); return false;');
                        break;
                    case window.dialogViewType:
                    case window.dataSourceViewType:
                        resultStr = template.scFormat('BindItemResult(\'' + this.ItemId + '\');toggleSelected(this);');
                        break;
                    case window.mediaViewType:
                        resultStr = template.scFormat('BindItemResult(\'' + this.Path + '\');toggleSelected(this);');
                        break;
                    default:
                      var url = "";
                      if (resultCallBack.launchType === 'search:launchresult') {
                        url = "sitecore://" + this.Uri.DatabaseName + "/" + itemId + "?lang=" + this.Language;
                      } else {
                        url = this.ItemId + ", la=" + this.Language;
                      }
                      resultStr = template.scFormat('scForm.getParentForm().postRequest(\'\',\'\',\'\',\'' + resultCallBack.launchType + '(url=' + url + ', datasource=' + this.Datasource + ')\'); return false;');
                }

                $j("#results").append(resultStr);
            }
            else {
              var blur = this.Path == null ? true : false;
              if (blur) {
                template = '<div id="' + noValue + '" class="BlogPostArea grayBlur" onclick="{0}" style=""><div><div class="BlogPostViews">' + '<a class="ceebox imgcontainer"  title="" href="#"  onclick="{0}"><img src="../Buckets/images/default.jpg" class="attachment-post-thumbnail wp-post-image" style="width: 80px; height: 60px; vertical-align:top;" alt="" title="" /></a></div><h5 class="BlogPostHeader"><a href="javascript:void(0);" onclick="{0}">' + noValue + '</a><span title="">' + noValue + '</span></h5><div class="BlogPostContent"><strong>' + noValue + ': </strong>' + noValue + ' <strong>' + noValue + ': </strong>' + noValue + '</div><div class="BlogPostFooter">' + noValue + ' <div><strong>' + noValue + ': </strong>' + noValue + ' <strong>' + noValue + ': </strong>' + noValue + ' <strong> ' + noValue + ': </strong> ' + noValue + ' </div><div></div></div></div>';
              }

              $j("#results").append(template);
            }
            
            
            
            elementCount++;

            
    });
        var b = "";
        $j.each(resultCallBack.ContextData, function () {

            var templateText = "";
            $j(".contextdataarea").html("");
            var view = this.Item1;
            var model = this.Item2;
            templateText = view.ItemTemplate;
            $j.each(model, function (key, value) {

                templateText = templateText.replace(key + 'Placeholder', value);
            });
        
            b = b + templateText;
    });
    
    $j(".contextdataarea").html(b);
    setFieldTitle();
}


function c(resultCallBack) {
    if (resultCallBack.Redirect) {
      window.top.location.href = resultCallBack.Redirect;
      return;
    }

    $j("#results").html("");
    $j(".pagination").remove();
    $j("#results").append('<div id="resultAppendDiv" style="overflow: auto; height: auto;">');
    $j("#resultInfoMessage").empty();
    if (resultCallBack.ErrorMessage !== undefined && resultCallBack.ErrorMessage !== null && resultCallBack.ErrorMessage.length !== 0) {
        $j("#resultInfoMessage").append('<div id="resultInfoMessageError">');
        $j("#resultInfoMessage").append(resultCallBack.ErrorMessage);
        $j("#resultInfoMessage").append("</div>");
        $j("#resultInfoMessage").append('<div id="resultInfoMessageSeeLogFiles">');
        $j("#resultInfoMessage").append(SeeLogFiles);
        $j("#resultInfoMessage").append("</div>");
    } else {
    $j("#resultInfoMessage").append(resultInfoMessage.scFormat(resultCallBack.SearchCount, resultCallBack.SearchTime, resultCallBack.Location));
    }
    

    parseResults(resultCallBack);

    $j("#results").append("</div>");

    $j(".pagination").remove();
    window.scPageAmount = resultCallBack.PageNumbers;
    var currentPage = resultCallBack.CurrentPage;
    var e = renderPagination(currentPage);
    $j(".selectable").append(e);

    $j(".handle").css("right", "-52px");

    $j("#ajaxBusy").hide();
}

function Initialization() {
    $j.datepicker.setDefaults($j.datepicker.regional[CurrentCulture]);

    $j.fn.outerHTML = function (a) {
      return a ? this.before(a).remove() : $j("<p>").append(this.eq(0).clone()).html();
    };

    var a = $j("#ui_element");

  $j("#results").on("mouseover", ".BlogPostArea", function() {
    $j(this).addClass("hover");
  });
  $j("#results").on("mouseout", ".BlogPostArea", function() {
    $j(this).removeClass("hover");
  });
  
  //$j("#facetsBTN").click(function () {
  //        $j("#facets").toggleClass("facetsVis poehali");
  //        $j("#facetsBTN").toggleClass("facetsBTNActive");
  //        return false;
  //  });

    function parseSearchForQuery() {
        var query = buildQuery();
        query = query.concat(OnlyFacets).filter(function (element) { return !!element; });
        var result = query.map(function(filter) {
          var boolOperation = filter.operation == 'must' ? '(must)' : filter.operation == 'not' ? '(not)' : '';
          return boolOperation + filter.type + ':' + filter.value;
        }).join(';');

        return encodeURIComponent(result);
    }

    $j('.sb_dropdown').on("click", ".SearchOperation", function () {
        if (SC.searchBoxViewModel.isSearchEmpty()) {
            alert(searchOperationMessage);
            return false;
        }
        else {
            toggleDropDownUp();
            window.scForm.getParentForm().postRequest('', '', '', this.id + '(url="' + parseSearchForQuery() + '")');
            return false;
        }
    });

    function toggleDropDown() {
        a.find(".sb_down").addClass("sb_up").removeClass("sb_down");
        jQuery.ajax({
            type: "POST",
            url: "/sitecore/shell/Applications/Buckets/ItemBucket.asmx/RunLookup",
            data: "{}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: runLookupSuccessHandler
        });
    }

    function runLookupSuccessHandler(responseData) {
        $j(".sb_dropdown").off("click", ".command");
        var c = responseData.d;
        var e = "";
        $j.each(c, function () {
            var showMe = this.Name.replace(" ", "");
            showMe = showMe.replace(" ", "");

            var commandType = this.Command;
            
            e += '<div title="' + clickToLoad + '" class="sb_filter recent ' + showMe + '">' + this.Name + ' - <span style="font-size:12px;">' + this.DisplayText + '</span></div><div class="' + showMe + 'body" style="display:none"></div>';
            $j(".sb_dropdown").off("click", "." + showMe);
            $j(".sb_dropdown").on("click", "." + showMe,
                function () {
                    var toggled = $j("." + showMe).next("." + showMe + "body").is(":visible");
                    if (!toggled) {
                        jQuery.ajax({
                            type: "POST",
                            url: "/sitecore/shell/Applications/Buckets/ItemBucket.asmx/GenericCall",
                            data: "{'ServiceName' : '" + showMe + "'}",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (b) {
                                var c = b.d;
                                c = c.toString().split(",");
                                var e = "";
                                var scope = this;
                                $j.each(c, function () {
                                    if (this != "") {                                    

                                        var template = '<li><a href="javascript:void(0);" onclick="{0}" id="{1}" title="{3}" class="{4}" {5}>{2}</a></li>',
                                            classValue = 'command ' + commandType,
                                            id = '',
                                            click = '';
                                        if (commandType == "id") { 
                                            var title = clickToLaunchItem;
                                            template = template.scFormat('{0}', '{1}', '{2}', '{3}', classValue);

                                            if (this.indexOf('sed Tab') > 0) { //TODO: Language Issue
                                                var splitMe = this.replace("Closed Tabs (", "").replace(")").split("|");
                                                var textValue = splitMe[0];
                                                id = splitMe[1];
                                                click = 'javascript:launchMultipleTabs("' + splitMe + '")';
                                                title = clickToLaunchItem + ' ' + this;
                                                e += template.scFormat(click, id, textValue, title);
                                            } else {
                                                splitMe = this.split("|");
                                                if (splitMe == undefined) {
                                                    e += template.scFormat();
                                                } else {
                                                    id = splitMe[1];
                                                    textValue = splitMe[0];
                                                    var innerHTML = textValue;
                                                    switch (window.currentBucketsViewType) {
                                                        case window.rteViewType:
                                                            click = 'scClose(\'~/link.aspx?_id=' + splitMe[1].replace(/{/g, "").replace(/}/g, "").replace(/-/g, "") + '&amp;_z=z\', \'' + this.Name + '\'); return false;';
                                                            e += template.scFormat(click, id, innerHTML, title);
                                                            break;
                                                        case window.dialogViewType:
                                                            click = 'BindItemResult(\'' + splitMe[1] + '\'); $j(\'.BlogPostViews\').removeClass(\'BlogPostViewsSelected\'); $j(this).parent().toggleClass(\'BlogPostViewsSelected\'); return false;';
                                                            e += template.scFormat(click, id, innerHTML, title);
                                                            break;
                                                        case window.mediaViewType:
                                                            click = 'BindItemResult(\'' + GetItemPathFromMediaLibrary(splitMe[1]) + '\');';
                                                            e += template.scFormat(click, id, innerHTML, title);
                                                            break;
                                                        default:
                                                            click = 'scForm.getParentForm().postRequest(\'\',\'\',\'\',\'contenteditor:launchtab(url=' + splitMe[1] + ')\'); return false;';
                                                            e += template.scFormat(click, id, innerHTML, title);
                                                    }
                                                }
                                            }
                                        } else if (commandType == "operations") { 
                                            id = this.split("|")[0].toString().replace(/\s/g, '');
                                            classValue = 'SearchOperation ' + this.split('|')[0].toString().replace(/\s/g, '');
                                            textValue = this.split('|')[2];
                                            title = clickToRunOperation;

                                            e += template.scFormat(click, id, textValue, title, classValue);
                                        } else if (commandType == "text") { 
                                            textValue = scHtmlEscape(this);
                                            title = clickToSearch + scHtmlEscape(this);

                                            e += template.scFormat(click, id, textValue, title, classValue);
                                        } else {
                                            textValue = this.split('|')[1];
                                            title = clickToLaunch + '' + this.split("|")[0];

                                            e += template.scFormat(click, id, textValue, title, classValue, 'data-filter="' + this.split("|")[0] + '"');
                                        }
                                    }
                                });

                                $j("." + showMe + "body").html("").append(e).show();
                                $j(".command").first().attr("id", "keySelect");
                            }
                        });
                    } else {
                      $j("." + showMe).next("." + showMe + "body").slideToggle(100);;
                    }
                });
        });
      
        $j(".sb_dropdown").on("click", ".command", function () {
          var $command = $j(this);
          var filter = $command.data('filter');
          if (filter) {
            SC.searchBoxViewModel.userRawInput(filter + ':');
          } else if ($command.text().indexOf(':') > 0) {
            SC.searchBoxViewModel.removeAllFilters();
            SC.searchBoxViewModel.userRawInput($command.text());
            SC.searchBoxViewModel.performSearch();
          }
        });
      
        // IE10 has some troubles with rendering dynamic div with box-shadow. "Append" below fixes the issue..
        $j(".sb_dropdown").html("").append(e).append("<div style='height:1px;position:relative;color:white;width:calc(100% + 20px);left:-10px;'>.</div>").show();
        $j(".sb_dropdown").children().first(".sb_filter.recent").attr("id", "keySelect");
    }

    function toggleDropDownUp() {
      if ($j(".sb_dropdown").is(":hidden")) {
        a.find(".sb_down").click();
      } else {
        $j(".sb_dropdown").stop(true, true);
        $j(".sb_dropdown").hide();
        a.find(".sb_up").addClass("sb_down").removeClass("sb_up");
      }
    };

    setTimeout(function () {
      $j(".sb_down, .sb_up").clickToggle(toggleDropDown, toggleDropDownUp);
    }, 1);

    SC.searchBoxViewModel.startSearchCallback = function() {
      FacetOn = false;
      CurrentFacetFilter = [];
      OnlyFacets = [];
      if (CurrentView != "") {
        $j("." + CurrentView).click();
      } else {
        runClick();
      }
    };

    !SC.searchBoxViewModel.isSearchEmpty() && SC.searchBoxViewModel.startSearchCallback();

    function runClick() {
        pageNumber = 0;
        $j('.content').css({ 'opacity': 1.0 });

        $j(".grid").removeClass("active");
        $j(".list").addClass("active");
        $j("#ajaxBusy").css({ display: "block" });
        var n = buildQuery();
          
        runQuery(n, pageNumber, c, OnSearchRunFail);
        runFacet(n, pageNumber, meme, OnFacetRunFail);

        a.find(".sb_up").click();
        renderFacetLoadingAnimation();
    }

  $j(".list").click(function () {
        FacetOn = false;
        CurrentView = "list";
        CurrentFacetFilter = [];
        OnlyFacets = [];
        $j("#views a").removeClass('active');
        runClick();
    });


  $j("#results").on("click", ".pageLink", function () {
        $j(this).addClass("pageClickLoad");
            a.find(".sb_up").click();
            $j('.content').css({ 'opacity': 1.0 });
            $j("#ajaxBusy").css({ display: "block" });

            var p = buildQuery();
            if (FacetOn) {
                p = CurrentFacetFilter;
            }

            if (CurrentView != "list" && CurrentView != "grid" && CurrentView != "") {
                pageNumber = $j(this).attr("data-page");
                runQuery(p, pageNumber, h, OnSearchRunFail);
            } else if (CurrentView == "grid") {
                pageNumber = $j(this).attr("data-page");
                runQuery(p, pageNumber, h, OnSearchRunFail);
                runFacet(p, pageNumber, meme, OnFacetRunFail);

            renderFacetLoadingAnimation();

            } else {
                pageNumber = $j(this).attr("data-page");
                runQuery(p, pageNumber, c, OnSearchRunFail);
            }

        $j('html,body').animate({ scrollTop: 0 }, 'slow');

    });

    $j(".grid").click(function () {
        FacetOn = false;
        $j("#views a").removeClass('active');
        CurrentView = "grid";
        CurrentFacetFilter = [];
        OnlyFacets = [];

            a.find(".sb_up").click();
            pageNumber = 0;
            $j(".list").removeClass("active");
            $j(".grid").addClass("active");
            $j('.content').css({ 'opacity': 1.0 });

            $j("#ajaxBusy").css({ display: "block" });

            var n = buildQuery();
            runQuery(n, pageNumber, h, OnSearchRunFail);
            runFacet(n, pageNumber, meme, OnFacetRunFail);

            $j(".navAlpha").html("");
            $j(".slide-out-div").html("").prepend(LoadGifText);
            $j("#ajaxBusyFacet").css({
                display: "none",
                margin: "0px auto",
                width: "44px"
            });
    });

    establishViews();

    //Event Bindings

    /* This will fade the dropdown menu away once you lose focus on it (blur) */
    $j(".sb_dropdown").bind("mouseleave",
      function () {
        $j(".sb_dropdown").fadeOut(2500, function() {
          a.find(".sb_up").addClass("sb_down").removeClass("sb_up");
        });
      });

    /* This will stop the fading away of the drop down menu once you have lost focus on it */
    $j(".sb_dropdown").on("mouseenter",
      function () {
        if ($j(".sb_dropdown").is(':animated')) {
          $j(".sb_dropdown").stop(true, true);

        $j(".sb_dropdown").show();
        a.find(".sb_down").addClass("sb_up").removeClass("sb_down");
          }
      });

    a.find(".sb_dropdown").find('label[for="all"]').prev().bind("click",
        function () {
            $j(this).parent().siblings().find(":checkbox").attr("checked", this.checked).attr("disabled", this.checked);
        });

    /* This will hide the loading bar once an item has been loaded */
    $j("#loadingSection").prepend('<div id="ajaxBusy"></div>');
    $j("#ajaxBusy").css({
        display: "none",
    });
}

function setFieldTitle() {
    $j(".buckets-field span").each(function () {
        this.title = this.innerText;
    });
}

scContentEditor.prototype.closeSearch = function(sender, evt) {
    var search = scForm.browser.getControl("SearchResultHolder");
    var tree = scForm.browser.getControl("ContentTreeHolder");

    search.style.display = "none";
    tree.style.display = "";

    scForm.browser.clearEvent(evt, true, false);
};

scContentEditor.prototype.loadNextSearchedItem = function (itemId) {
    var searchResultHolder = scForm.browser.getControl("SearchResultHolder");

    if (!searchResultHolder || searchResultHolder.style.display === "none") {
        return undefined;
    }
   
    var searchLinks = searchResultHolder.getElementsByTagName("A");

    if (!searchLinks) {
        return undefined;
    }

    var editorFrames = scForm.browser.getControl("EditorFrames");

    if (!editorFrames) {
        return undefined;
    } else {
        editorFrames.style.display = "none";
    }

    var i;

    for (i = 0; i < searchLinks.length; i++) {
        var previousLink = searchLinks[i - 1];
        var currentLink = searchLinks[i];
        var nextLink = searchLinks[i + 1];

        if (currentLink.getAttribute("data-item-id") === itemId
          && nextLink && nextLink.getAttribute("data-item-id")
          && nextLink.getAttribute("data-item-longid").indexOf(itemId) === -1) {

            return nextLink.onclick();
        }
        else if (!nextLink
          && previousLink && previousLink.getAttribute("data-item-id")
          && previousLink.getAttribute("data-item-longid").indexOf(itemId) === -1) {
            return previousLink.onclick();
        }
    }

    for (i = 0; i < searchLinks.length; i++) {
        if (searchLinks[i].getAttribute("data-item-id")) {
            return searchLinks[i].onclick();
        }
    }

    return undefined;
};

scContentEditor.prototype.loadSearchedItem = function (itemId) {
    var searchResultHolder = scForm.browser.getControl("SearchResultHolder");

    if (!searchResultHolder || searchResultHolder.style.display === "none") {
        return undefined;
    }

    var searchLinks = searchResultHolder.getElementsByTagName("A");

    if (!searchLinks) {
        return undefined;
    }

    var link, i;

    for (i = 0; i < searchLinks.length; i++) {
        if (searchLinks[i].getAttribute("data-item-id") === itemId) {
            link = searchLinks[i];

            setTimeout(function () {
                return link.onclick();
            }, 500);
            
            break;
        }
    }
    
    for (i = 0; i < searchLinks.length; i++) {
        if (searchLinks[i].getAttribute("data-item-id")) {
            link = searchLinks[i];

            setTimeout(function () {
                return link.onclick();
            }, 500);
            
            break;
        }
    }

    return undefined;
};

scContentEditor.prototype.searchWithSameRoot = function() {
    var searchResultHolder = scForm.browser.getControl("SearchResultHolder");

    if (!searchResultHolder || searchResultHolder.style.display === "none") {
        return undefined;
    }

    var rootId = searchResultHolder.getAttribute("data-root-id");

    return scForm.postEvent(this, event, "SearchTreeByRoot(\"" + rootId + "\")");
};

scContentEditor.prototype.addSearchCriteria = function (sender, evt) {
    var input = $("SearchOptionsAddCriteria");
    var name = input.value;

    if (name == "") {
        return;
    }

    input.value = "";

    var table = $("SearchOptionsList");

    var row = table.insertRow(table.rows.length - 1);

    var cell = $(row.insertCell(0));

    cell.innerHTML = "<div class='scElementHover elementPadding'><a href=\"#\" class=\"scSearchOptionName searchOptionAlignment\" onclick=\"javascript:return scForm.postEvent(this,event,'TreeSearchOptionName_Click',true)\">" + name + " <img src='/sitecore/shell/themes/standard/Images/down_h.png' class='arrowDown' /></a></div>";
    cell.addClassName("scSearchOptionsNameContainer");

    cell = $(row.insertCell(1));

    name = name.replace(/\"/gi, "");

    cell.innerHTML = "<input class=\"scSearchOptionsInput scIgnoreModified\"/><input type=\"hidden\" value=\"" + name + "\"/>";
    cell.addClassName("scSearchOptionsValueContainer");

    this.updateSearchCriteria();

    return false;
};

scContentEditor.prototype.changeSearchCriteria = function (index, name) {
    var imgArrowDown = " <img src='/sitecore/shell/themes/standard/Images/down_h.png' class='arrowDown paddingLeft' />";
    var table = $("SearchOptionsList");

    var searchOptionsName = table.rows[parseInt(index, 10)].cells[0].select("a.scSearchOptionName")[0];
    var searchOptionsValue = table.rows[parseInt(index, 10)].cells[1].select("input[type=hidden]")[0];

    if (searchOptionsName && searchOptionsValue) {

        searchOptionsName.innerHTML = "<div class=\"searchOptionAlignment\"><div class='inlineBlock'>" + name + "</div><div class='inlineBlock'>" + imgArrowDown + "</div></div>";
        searchOptionsValue.value = name;
        this.updateSearchCriteria();
    }

    scForm.browser.closePopups();

    return false;
};

scContentEditor.prototype.removeSearchCriteria = function (index) {
    var table = $("SearchOptionsList");

    var row = table.rows[parseInt(index, 10)];

    row.parentNode.removeChild(row);

    this.updateSearchCriteria();

    scForm.browser.closePopups();

    return false;
};

scContentEditor.prototype.updateSearchCriteria = function () {
    var table = $("SearchOptionsList");

    for (var r = 0; r < table.rows.length - 1; r++) {
        var cell = table.rows[r].cells[0];
        cell.select("a.scSearchOptionName")[0].id = "SearchOptionsControl" + r;

        cell = table.rows[r].cells[1];

        cell.select("input.scSearchOptionsInput")[0].id = "SearchOptionsValue" + r;
        cell.select("input[type=hidden]")[0].id = "SearchOptionsName" + r;
    }
};
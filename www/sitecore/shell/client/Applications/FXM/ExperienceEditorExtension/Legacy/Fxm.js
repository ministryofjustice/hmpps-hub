define([
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacySitecore.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacyjQuery.js"
], function (_scl, $sc) {
  var ctor = function () {
    this.selectedNodeClass = "scFxmSelector";
    this.PlaceholderCapability = "FXM-PL";
    this.PlaceholderRegistryKey = "/Current_User/FXM/Show/Placeholders";
    this.ClientActionCapability = "FXM-CA";
    this.ClientActionRegistryKey = "/Current_User/FXM/Show/ClientActions";
    this.ShowControlsCapability = "FXM-SC";
    this.ShowControlsRegistryKey = "/Current_User/FXM/Show/Controls";
    this.selectorKey = "selector";
    this.placeholderKey = "placeholder";
    this.clientActionKey = "clientAction";
    this.rootNodeId = "FxmWebContent";
    this.filterString = ".scLooseFrameZone, .scWebEditInput, code[type='text/sitecore'][kind='open']:not([chrometype='" + this.selectorKey + "']), [sc-part-of]:not([sc-part-of='" + this.selectorKey + "'])";

    // Deactivate unneeded EE elements
    var pageContext = window.parent;
    pageContext.Sitecore.PageModes.ChromeControls.prototype.usagesPathPatterns.push("/sitecore/system/Marketing Control Panel/FXM/");
    pageContext.Sitecore.PageModes.ChromeControls.prototype.renderExpandCommand = function () { return ""; };

    var restrictedCommands =
    [
      'chrome:rendering:editvariations({command:"webedit:editvariations"})'
    ];

    pageContext.$sc.each(restrictedCommands, function () {
      var command = this.toString();
      if (pageContext.$sc.inArray(command, pageContext.Sitecore.PageModes.Chrome.prototype.restrictedCommands) < 0) {
        pageContext.Sitecore.PageModes.Chrome.prototype.restrictedCommands.push(command);
      }
    });

    this.isSelector = function (key) {
      return key === this.selectorKey;
    }

    //adapted from http://stackoverflow.com/questions/2068272/getting-a-$sc-selector-for-an-element
    this.getChromePath = function (element) {
      var path = "";

      if (element.attr("id")) {
        return "#" + element.attr("id");
      }

      while (element.length) {
        var currentNode = element[0];
        var name = currentNode.localName;
        var id = element.attr('id');
        if (!name) break;

        if (id) {
          if (id === this.rootNodeId) {
            path = "body > " + path;
            break;
          } else {
            path = "#" + id + (path ? ' > ' + path : '');
            break;
          }
        }

        name = name.toLowerCase();
        var parent = element.parent();
        var siblings = parent.children(name);
        if (siblings.length > 1) {
          var index = element.prevAll(name + ':not([sc-part-of])').length;
          name += ':not([sc-part-of]):eq(' + index + ')';
        }

        path = name + (path ? ' > ' + path : '');
        element = parent;
      }

      return path;
    }

    this.convertToEditorChromePath = function (path) {
      var editorPath = path.replace('body > ', 'body > #' + this.rootNodeId + ' > ');

      return editorPath;
    }

    this.isSelectionAllowed = function (node) {
      if (!node || node.length === 0) {
        return false;
      }

      if (node.find(this.filterString).length > 0) {
        return false;
      }
      if (node.closest(this.filterString).length > 0) {
        return false;
      }
      if (node.is(this.filterString + ", body, #" + this.rootNodeId)) {
        return false;
      }

      return !this.isCommandBar(node);
    }

    this.isCommandBar = function (node) {
      return node.parents(".scChromeToolbar").length > 0;
    }

    this.generateShortName = function (node) {
      var tagName = node.get(0).tagName;
      if (node.attr('id')) {
        return tagName + "#" + node.attr('id');
      }

      if (node.attr('class')) {
        return tagName + "." + node.attr('class').replace(" ", ".");
      }

      return tagName;
    }

    this.toggleSelection = function (node) {
      if (!this.isActive()) {
        return;
      }

      if (!this.isSelectionAllowed(node)) {
        this.removeSelector();
        return;
      }

      if (!this.isSelf(node)) {
        this.wrapNode(node, this.selectorKey);
      }

      this.focusChrome(node);
    }

    this.isActive = function (capability) {
      var capabilities = _scl.PageModes.PageEditor.getCapabilities();

      if (!capability) {
        return _.contains(capabilities, this.PlaceholderCapability)
            || _.contains(capabilities, this.ClientActionCapability)
            || _.contains(capabilities, this.ShowControlsCapability);
      } else {
        return _.contains(capabilities, capability);
      }
    }

    this.isSelf = function (node) {
      var selfFilterStr = "code[type='text/sitecore'][chrometype='selector'][kind='open']";
      return node.prev(selfFilterStr).length > 0;
    }

    this.wrapNode = function (node, key, name, displayName) {
      this.removeSelector();
      var startMarker = this.getfxmStartMarker(key);
      var endMarker = this.getfxmEndMarker(key);

      switch (key) {
        case this.clientActionKey:
          this.wrapChromeType(node, startMarker, endMarker, name);
          break;
        case this.placeholderKey:
          var id = name.replace(/\/|-/g, '_');
          var placeholderKey = name;

          this.wrapPlaceholder(node, startMarker, endMarker, id, displayName, placeholderKey);
          node.remove();
          break;
        case this.selectorKey:
          var shortName = this.generateShortName(node);
          this.wrapSelector(node, startMarker, endMarker, shortName);
          break;
      }
    }

    this.wrapChromeType = function (node, startMarker, endMarker, name) {
      startMarker.text(startMarker.text().replace("_displayname_", name));
      endMarker.attr('hintname', name);
      startMarker.attr("id", name);
      startMarker.attr("key", name);
      startMarker.attr("dynamic", "true");
      startMarker.removeClass(this.selectedNodeClass, name);

      node.before(startMarker);
      node.after(endMarker);
    },

    this.wrapPlaceholder = function (node, startMarker, endMarker, id, name, key) {

      startMarker.text(startMarker.text().replace("_displayname_", name));
      endMarker.attr('hintname', name);
      startMarker.attr("id", id);
      startMarker.attr("key", key);
      startMarker.attr("dynamic", "true");
      startMarker.removeClass(this.selectedNodeClass, name);

      node.before(startMarker);
      node.after(endMarker);
    },

    this.wrapSelector = function (node, startMarker, endMarker, name) {

      startMarker.text(startMarker.text().replace("_displayname_", name));
      endMarker.attr('hintname', name);

      node.attr("sc-selector-id", this.selectorKey);
      node.addClass("scEnabledChrome");

      node.before(startMarker);
      node.attr("sc-part-of", this.selectorKey);
      node.after(endMarker);
    },

    this.focusChrome = function (node) {
      _scl.PageModes.ChromeManager.resetChromes();
      var chrome = _scl.PageModes.ChromeManager.getChrome(node);
      if (chrome) {
        setTimeout(function () {
          _scl.PageModes.ChromeHighlightManager.resume();
          _scl.PageModes.ChromeManager.select(chrome);
        }, 200);
      }
    }

    this.getfxmStartMarker = function (key) {
      var text = $sc("#fxmStartMaker_" + key).data('sc-value');
      return $sc(text);
    }

    this.getfxmEndMarker = function (key) {
      var text = $sc("#fxmEndMaker_" + key).data('sc-value');
      return $sc(text);
    }

    this.getSelectingElements = function () {
      var filterValue = this.filterString;
      var elements = $sc("body *").not(filterValue);
      elements = elements.filter(function () {
        return $sc(this).parents(filterValue).length === 0;
      });
      return elements;
    }

    this.bindClick = function (event) {
      event.preventDefault();
      if (!this.isActive(this.ShowControlsCapability)) {
        this.toggleSelection($sc(event.target));
      }
      return false;
    }

    this.onCapabilityChangedHandler = function () {
      var elements = this.getSelectingElements();

      if (this.isActive()) {
        elements.bind("click", $sc.proxy(this.bindClick, this));
      } else {
        var selectedChrome = _scl.PageModes.ChromeManager.selectedChrome();
        if (selectedChrome && this.isSelector(selectedChrome.key())) {
          _scl.PageModes.ChromeManager.hideSelection();
        }
        this.removeSelector();
        elements.unbind("click", $sc.proxy(this.bindClick, this));
      }
    }

    this.removeSelector = function () {
      var self = this;
      var selectors = $sc.grep(_scl.PageModes.ChromeManager.chromes(), function (chrome) {
        return self.isSelector(chrome.key()) && chrome.isEnabled();
      });
      for (var i = 0, len = selectors.length; i < len; i++) {
        selectors[i].remove();
      }
    }

    this.selectChromeByDisplayNameAndType = function (name, type) {
      $sc.grep(_scl.PageModes.ChromeManager.chromes(), function (chrome) {
        if (chrome._displayName === name && chrome.key() === type) {
          _scl.PageModes.ChromeManager.select(chrome);
        }
      });
    }

    this.updateNodeToClientAction = function ($el, itemData, select) {
      if (select === null || select === undefined) {
        select = true;
      }
      // add item uri data
      $el.attr('data-sc-id', itemData.Id);
      $el.attr('data-sc-version', itemData.Version);
      $el.attr('data-sc-revision', itemData.Revision);
      this.wrapNode($el, this.clientActionKey, itemData.Name);
      _scl.PageModes.ChromeManager.resetChromes();
      if (select) {
        this.selectChromeByDisplayNameAndType(itemData.Name, this.clientActionKey);
      }
    }

    this.updateClientAction = function (itemData, select) {
      var key = this.clientActionKey;
      var chromeToUpdate;
      $sc.grep(_scl.PageModes.ChromeManager.chromes(), function (chrome) {
        if (chrome.element.attr("data-sc-id") === itemData.Id && chrome.key() === key) {
          chromeToUpdate = chrome;
        }
      });

      if (!chromeToUpdate) {
        return;
      }

      chromeToUpdate._displayName = itemData.Name;
      chromeToUpdate.data.displayName = itemData.Name;
      chromeToUpdate.data.expandedDisplayName = itemData.Name;
      chromeToUpdate.data.custom.displayName = itemData.Name;
      var chromeElement = chromeToUpdate.element;
      chromeElement.attr('data-sc-revision', itemData.Revision);
      var startMarker = chromeElement.prev();
      var endMarker = chromeElement.next();

      var startMarkerTemplate = this.getfxmStartMarker(key).text();
      startMarker.text(startMarkerTemplate.replace("_displayname_", itemData.Name));
      startMarker.attr("id", itemData.Name);
      startMarker.attr("key", itemData.Name);
      startMarker.removeClass(this.selectedNodeClass, itemData.Name);
      endMarker.attr('hintname', itemData.Name);
      _scl.PageModes.ChromeManager.hideSelection();
      _scl.PageModes.ChromeManager.resetChromes();
      if (select) {
        this.selectChromeByDisplayNameAndType(itemData.Name, this.clientActionKey);
      }
    }

    this.updateNodeToPlaceholder = function ($el, itemData, position) {
      $el.attr('data-sc-id', itemData.Id);
      $el.attr('data-sc-version', itemData.Version);
      $el.attr('data-sc-revision', itemData.Revision);

      var contentId = "content_" + itemData.Id.replace('{', '').replace('}', '');

      switch (position) {
        case '{B8F49EBF-2542-4CB0-B3BB-63858918CE8B}':
          $el.before("<div id='" + contentId + "'><div>");
          break;
        case '{18F0F47F-2214-4F23-B6FA-F2D86A0C9E5A}':
          $el.after("<div id='" + contentId + "'><div>");
          break;
        default:
          $el.after("<div id='" + contentId + "'><div>");

          $el.attr("placeholderKey", itemData.Id);
          var display = $el.css("display");
          $el.attr("displayAttr", display);
          $el.css("display", "none");
          break;
      }
      var pl = $sc("#" + contentId);
      this.wrapNode(pl, this.placeholderKey, itemData.Id, itemData.Name);
      _scl.PageModes.ChromeManager.resetChromes();
      this.selectChromeByDisplayNameAndType(itemData.Name, this.placeholderKey);
    }

    // bind handler
    _scl.PageModes.PageEditor.onCapabilityChanged.observe($sc.proxy(this.onCapabilityChangedHandler, this));
  }

  return new ctor();
})

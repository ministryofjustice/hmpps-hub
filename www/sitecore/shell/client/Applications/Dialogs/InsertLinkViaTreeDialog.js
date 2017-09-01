define(["sitecore"], function(Sitecore) {
  var InsertLinkViaTreeDialog = Sitecore.Definitions.App.extend({
    initialized: function () {

      this.updateCustomUrl();

      this.Target.on("change", function () {
        this.updateCustomUrl();
      }, this);

      // work around an issue in combobox
      this.TargetsDataSource.on("change:items", function () {
        if (this.__firstTime) {
          this.__firstTime = false;
          var local = this;
          var targets = this.TargetLoadedValue.get("text").split(',');
          var targetWindowValue = {};
          targets.forEach(function (target) {
            if (targetWindowValue == undefined || targetWindowValue.$displayName == undefined) {
              local.Target.set("selectedValue", target);
            }
            targetWindowValue = local.Target.get("selectedItem");
          });
        }
      }, this);
    },
      
    updateCustomUrl: function () {

      var emptyOptionID = "{A3C9DB39-1D1B-4AA1-8C68-7B9674D055EE}";
      var customUrlOptionID = "{07CF2A84-9C22-4E85-8F3F-C301AADF5218}";

      var targetWindowValue = this.Target.get("selectedItem");

      if (!targetWindowValue || targetWindowValue.itemId === emptyOptionID) {
        this.CustomUrl.set("isEnabled", false);
        return;
      }

      if (targetWindowValue.itemId === customUrlOptionID) {
        this.CustomUrl.set("isEnabled", true);
      } else {
        this.CustomUrl.set("isEnabled", false);
      }
    },

    insertInternalLinkResult: function () {
      var targetDisplayTextID = this.TextDescription,
      targetPathID = this.TreeView,
      targetPathProperty = "$path",
      targetQueryID = this.QueryString,
      targetAltTextID = this.AltText,
      targetStyleID = this.StyleClass,
      targetWindowID = this.Target,
      customUrlID = this.CustomUrl,
      targetControlID = this.TreeView,
      anchor = this.AnchorText,
      selectedItemsPropertyName = "selectedNode",
      template = '<link text="<%=displayText%>" anchor="<%=anchor%>" linktype="internal" class="<%=styleClass%>" title="<%=alternateText%>" <%=target%> querystring="<%=queryString%>" id="<%=itemId%>" />',
      targetWindowValue,
      path,
      emptyOptionID = "{A3C9DB39-1D1B-4AA1-8C68-7B9674D055EE}",
      htmlEncode = function (str) {
        return str.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      };

      if (!targetDisplayTextID) {
        console.log("Provide at least display text for your link");
        return false;
      }

      targetWindowValue = targetWindowID.get("selectedItem");

      if (!targetWindowValue || targetWindowValue.itemId === emptyOptionID) {
        targetWindowValue = "";
      } else {
        var targetWindow = targetWindowValue.$displayName.trim();

        switch (targetWindow) {
          case 'Active Browser':
            targetWindow = "";
            break;
          case 'New Browser':
            targetWindow = "_blank";
            break;
          case "Custom":
            targetWindow = customUrlID.get("text");
            break;
        }

        targetWindowValue = "target=\"" + targetWindow + "\"";
      }

      if (targetPathID.get(selectedItemsPropertyName) &&
        "rawItem" in targetPathID.get(selectedItemsPropertyName) &&
        targetPathID.get(selectedItemsPropertyName).rawItem[targetPathProperty]) {
        path = targetPathID.get(selectedItemsPropertyName).rawItem[targetPathProperty];
      }

      var itemLink = _.template(template, {
        displayText: htmlEncode(targetDisplayTextID.get("text")),
        alternateText: htmlEncode(targetAltTextID.get("text")),
        itemId: targetControlID.get("selectedItemId"),
        queryString: htmlEncode(targetQueryID.get("text")),
        target: targetWindowValue,
        styleClass: htmlEncode(targetStyleID.get("text")),
        path: path,
        anchor: htmlEncode(anchor.get("text"))
      });

      return this.closeDialog(itemLink);
    },
        
    __firstTime: true

  });

  return InsertLinkViaTreeDialog;
});
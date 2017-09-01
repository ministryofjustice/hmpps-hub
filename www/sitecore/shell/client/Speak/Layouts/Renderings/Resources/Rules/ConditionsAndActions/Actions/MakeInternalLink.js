define([], function () {
  var action = function (context, args) {
    var targetDisplayTextID = context.app[args.targetDisplayTextID],
      targetPathID = context.app[args.targetPathID],
      targetPathProperty = args.targetPathProperty,
      targetQueryID = context.app[args.targetQueryID],
      targetAltTextID = context.app[args.targetAltTextID],
      targetStyleID = context.app[args.targetStyleID],
      targetWindowID = context.app[args.targetWindowID],
      customUrlID = context.app[args.customUrlID],
      targetControlID = context.app[args.targetControlID],
      selectedItemsPropertyName = "selectedItem",
      template = '<link text="<%=displayText%>" linktype="internal" class="<%=styleClass%>" title="<%=alternateText%>" <%=target%> querystring="<%=queryString%>" id="<%=itemId%>" />',
      targetWindowValue, itemLink, path,
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
        default:
          targetWindow = "";
      }

      targetWindowValue = "target=\"" + targetWindow + "\"";
    }

    if (targetPathID.get(selectedItemsPropertyName) &&
      "attributes" in targetPathID.get(selectedItemsPropertyName)) {
      path = targetPathID.get(selectedItemsPropertyName).attributes[targetPathProperty];
    } else {
      console.debug("Unable to get the property to set");
      return;
    }

    itemLink = _.template(template, {
      displayText: htmlEncode(targetDisplayTextID.get("text")),
      alternateText: htmlEncode(targetAltTextID.get("text")),
      itemId: htmlEncode(targetControlID.get("selectedItemId")),
      queryString: encodeURIComponent(targetQueryID.get("text")),
      target: targetWindowValue,
      styleClass: htmlEncode(targetStyleID.get("text")),
      path: path
    });

    context.app.closeDialog(itemLink);
  };

  return action;
});

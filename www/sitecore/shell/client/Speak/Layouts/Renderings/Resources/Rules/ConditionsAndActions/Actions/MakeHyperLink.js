define([], function () {
  var action = function (context, args) {
    var targetDisplayTextID = context.app[args.targetDisplayTextID],
      targetAnchorID = context.app[args.targetAnchorID],
      targetAltTextID = context.app[args.targetAltTextID],
      targetStyleID = context.app[args.targetStyleID],
      targetWindowID = context.app[args.targetWindowID],
      template = '<link text="<%=text%>" linktype="anchor" url="<%=anchor%>" anchor="<%=anchor%>" title="<%=alternateText %>" class="<%=style%>" />',
      targetWindowValue, hyperLink,
      emptyOptionID = "{A3C9DB39-1D1B-4AA1-8C68-7B9674D055EE}",
      htmlEncode = function (str) {
        return str.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      };

    hyperLink = _.template(template, {
      text: htmlEncode(targetDisplayTextID.get("text")),
      style: htmlEncode(targetStyleID.get("text")),
      alternateText: htmlEncode(targetAltTextID.get("text")),
      anchor: htmlEncode(targetAnchorID.get("text")),
      url: targetAnchorID.get("text")
    });

    context.app.closeDialog(hyperLink);
  };  

  return action;
});

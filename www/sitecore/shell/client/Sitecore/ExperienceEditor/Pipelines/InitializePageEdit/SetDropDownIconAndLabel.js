define(["sitecore"], function (Sitecore) {
  var viewData = [];
  return {
    priority: 1,
    execute: function (context) {
      $.each(context.app, function () {
        if (this.attributes === undefined || this.componentName !== "LargeDropDownButton" || this.get("iconLabelRequest") === null || this.get("iconLabelRequest") === "") {
          return;
        }

        var button = this;
        var label, icon;
        var command = button.viewModel.$el.attr("data-sc-command");
        var view = viewData[command];
        if (view != undefined) {
          button.viewModel.setIcon(view.icon);
          button.viewModel.setLabel(view.label);
          return;
        }

        context.currentContext.value = button.viewModel.$el.attr("data-sc-listdatasourceid");
        var iconLabelRequest = this.get("iconLabelRequest");
        if (iconLabelRequest == "") {
          return;
        }
        context.app.postServerRequest(iconLabelRequest, context.currentContext, function (response) {
          if (response.error) {
            context.app.handleResponseErrorMessage(response);
            return;
          }

          var responseObject = !response.value ? response.responseValue.value : response.value;
          if (responseObject.icon !== "") {
            icon = responseObject.icon;
            button.viewModel.setIcon(icon);
          }

          if (responseObject.label !== "") {
            label = responseObject.label;
            button.viewModel.setLabel(label);
          }

          viewData[command] = { icon: icon, label: label };
        });
      });
    }
  };
});
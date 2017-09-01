define(["sitecore"], function (Sitecore) {
  Sitecore.Factories.createBaseComponent({
    name: "LicenseOption",
    base: "InputControlBase",
    selector: ".sc-LicenseOption",
    attributes: [
      { name: "navigateUrl", value: "$el.data:sc-navigateurl" }
    ],
    events: { "click": "follow" },
    initialize: function () {
      this._super();
      console.log(this.model.get("navigateUrl"));
    },
    follow: function () {
      window.location.href = this.model.get("navigateUrl");
      console.log("hej");
    }
  });
});
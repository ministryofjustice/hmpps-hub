define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  function displayTab(tabControl) {
    ExperienceEditor.Common.displayTab(tabControl);
  }
  
  Sitecore.Factories.createBaseComponent({
    name: "Strip",
    base: "ControlBase",
    selector: ".sc-strip",
    attributes: [],

    initialize: function () {
      this.rendernTab(this);
      var currentTab = ExperienceEditor.getCurrentTabId();

      var debugTab = "DebugStrip_ribbon_tab";
      if (ExperienceEditor.Web.getUrlQueryStringValue("sc_debug") == "1"
        && document.getElementById(debugTab) != null) {
        currentTab = debugTab;
      }

      displayTab(document.getElementById(currentTab));
      this._super();
    },
    
    getCookie: function (name) {
      var regexp = new RegExp("(?:^" + name + "|;\s*" + name + ")=(.*?)(?:;|$)", "g");
      var result = regexp.exec(document.cookie);
      return (result === null) ? null : result[1];
    },
    
    rendernTab: function (context) {
      var stripId = context.$el[0].getAttribute("data-sc-id");
      var id = stripId + "_ribbon_tab";
      var tabName = this.$el.find("h3").text();
      var tabSource = "<a id=\"" + id + "\" stripId=\"" + stripId + "\" href=\"#\" class=\"sc-quickbar-item sc-quickbar-tab\">" + tabName + "</a>";
      
      var quickbar = jQuery(".sc-quickbar");
      if (!quickbar) {
        return;
      }
      
      quickbar.append(tabSource);

      var strip = document.getElementById(this.getCookie("sitecore_webedit_activestrip"));
      if (strip) {
        jQuery(strip).show();
      }

      var tab = jQuery("#" + id);
      tab.on("click", function (event) {
        displayTab(event.target);
      });
    },
    
  });
});
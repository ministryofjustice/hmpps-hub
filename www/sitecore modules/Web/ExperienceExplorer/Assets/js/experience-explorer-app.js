var ExpApp = function () {

  var self = this;
  self.model = {};

  self.getModel = function () {
    jQuery.getJSON("/eeapi/experienceexplorer/get", function (data) {
      self.model = data;
      self.bindModel();
    });
  };

  self.updateModel = function () {

    if (self.model.PresetId == undefined) {
      var presetId = $("#currentPresetId").val();
      self.model.PresetId = presetId;
    }

    var currentItemId = $("#currentItem").val();
    self.model.ItemId = currentItemId;

    jQuery.ajax({
      url: "/sitecore modules/web/experienceexplorer/services/service.asmx/Update",
      type: "POST",
      contentType: "application/json",
      data: '{modelDto:' + JSON.stringify(self.model) + '}',
      dataType: "json"
    })

    .done(function () {
      var href = window.parent.location.href.replace(/(\?)sc_preset=.*?($|&)/i, "?").replace(/\?$/i, "");
      if (href.indexOf("?") > 0) {
        href = href.replace("?", "?" + "sc_preset=" + exp.model.PresetId + "&");
      } else {
        href += "?";
        href += "sc_preset=" + exp.model.PresetId;
      }
      var currentLocation = window.parent.location;

      if (currentLocation != href) window.parent.location = href;
      else window.parent.location.reload();
    })
    .fail(function (data) {
      alert(data.responseJSON.Message);
      var btn = jQuery('#btn_apply');
      btn.removeAttr('disabled');
      btn.html(SettingsPanelTranslations.applyText);
    });
  };
};
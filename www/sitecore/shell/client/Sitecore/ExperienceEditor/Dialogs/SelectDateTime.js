define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  var insertPagePageCode = Sitecore.Definitions.App.extend({
    translationContext: null,
    templateId: null,

    initialized: function () {
      this.SelectedDate.viewModel.$el.blur();
      this.setOkButtonClick();
      this.setCancelButtonClick();
      this.setDateTime();
    },
    setDateTime: function () {
      var scDate = ExperienceEditor.Web.getUrlQueryStringValue("sc_date");
      if (!scDate) {
        this.SelectedDate.viewModel.setDate(Date.now());
        this.SelectedTime.set('time', this.SelectedTime.viewModel.convertFormattedTimeToTime(new Date()));
        return;
      }

      this.SelectedDate.set('date', scDate);
      this.SelectedTime.set('time', scDate.substring(scDate.indexOf('T')));
    },
    setOkButtonClick: function () {
      this.on("button:ok", function () {
        this.closeDialog(this.SelectedDate.get("date"));
      }, this);
    },
    setCancelButtonClick: function () {
      this.on("button:cancel", function () {
        this.closeDialog(null);
      }, this);
    },
  });
  return insertPagePageCode;
});
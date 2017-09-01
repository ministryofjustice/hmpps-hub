define(
  [
    "sitecore",
    "/-/speak/v1/ExperienceEditor/ExperienceEditor.js",
    "/-/speak/v1/ExperienceEditor/DOMHelper.js"
  ], function (Sitecore, ExperienceEditor, DOMHelper) {
    var validateFieldsUtil = {
      pageModes: function () {
        return ExperienceEditor.getPageEditingWindow().Sitecore.PageModes;
      },

      validateFields: function (context) {
        ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.FieldsValidation.ValidateFields", function (response) {
          var errors = response.responseValue.value;
          if (!errors || errors.length == 0) {
            return;
          }

          var that = validateFieldsUtil;

          var showErrorText = validateFieldsUtil.pageModes().Texts.ShowError;

          for (var i = 0; i < errors.length; i++) {
            var error = errors[i];
            validateFieldsUtil.setChromesNotValid(error.FieldId, error.DataSourceId, error);
            var notificationId = validateFieldsUtil.formNotificationId(error.FieldId, error.DataSourceId) + "_" + i.toString();
            var notification = ExperienceEditor.getContext().instance.showNotification(validateFieldsUtil.getNotificationType(error), error.Text, true);
            $(notification).append(DOMHelper.getNotificationOption(showErrorText, null, notificationId));
            jQuery("#" + notificationId).click(function (e) {
              var id = jQuery(e.target).attr("id");
              var fieldId = "{" + id.split("_")[0] + "}";
              var dataSource = "{" + id.split("_")[1] + "}";
              that.selectChrome(fieldId, dataSource);
            });
          }
        }).execute(ExperienceEditor.generatePageContext(context, ExperienceEditor.getPageEditingWindow().document));
      },

      getNotificationType: function (error) {
        if (error.Priority < 3) {
          return "notification";
        }

        if (error.Priority == 3) {
          return "warning";
        }

        if (error.Priority > 3) {
          return "error";
        }

        return "warning";
      },

      setChromesNotValid: function (fieldId, dataSourceId, error) {
        if (!fieldId || !dataSourceId) {
          return;
        }

        var chromes = validateFieldsUtil.pageModes().ChromeManager.getChromesByFieldIdAndDataSource(fieldId, dataSourceId);
        for (var c = 0; c < chromes.length; c++) {
          var chrome = chromes[c];
          if (!chrome) {
            continue;
          }

          chrome.setValidStatus(false, error);
        }
      },

      selectChrome: function (fieldId, dataSourceId) {
        var chromes = validateFieldsUtil.pageModes().ChromeManager.getChromesByFieldIdAndDataSource(fieldId, dataSourceId);

        var chrome = chromes[0];
        validateFieldsUtil.pageModes().ChromeManager.scrollChromeIntoView(chrome);
        validateFieldsUtil.pageModes().ChromeManager.select(chrome);
      },

      deactivateValidation: function () {
        var chromes = validateFieldsUtil.pageModes().ChromeManager.chromes();
        for (var c = 0; c < chromes.length; c++) {
          var chrome = chromes[c];

          if (chrome.data.errors) {
            for (var e = 0; e < chrome.data.errors.length; e++) {
              var error = chrome.data.errors[e];
              ExperienceEditor.Common.removeNotificationMessage(error.Text);
            }
          }

          chrome.setValidStatus(true);
        }

        ExperienceEditor.getContext().instance.setHeight();
      },

      formNotificationId: function (fieldId, dataSourceId) {
        var value = fieldId + "_" + dataSourceId;
        return value.replace(/(\{|\})/g, "");
      }
    };

    return validateFieldsUtil;
  });
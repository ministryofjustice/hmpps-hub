define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (_sc, ExperienceEditor) {
  var validator = function (queryDataSource, messageBar) {
    this.queryDataSource = queryDataSource;
    this.messageBar = messageBar;

    this.clear = function () {
      messageBar.removeMessages();
    }

    this.hasMessages = function () {
      return messageBar.get('hasMessages');
    }

    this.showMessageById = function (id, extra) {
      var message = $.grep(this.queryDataSource.get('items'), function (e) {
        return e.itemId === id;
      })[0];

      displayMessage(message, extra);
    }

    this.showRawMessage = function (type, text, isTemp, isClosable) {
      var message = makeMessage(text, isTemp, isClosable, Array[0]);
      messageBar.addMessage(type, message);
    }

    this.showDataValidationErrors = function (data) {
      var self = this;
      var validationData = data.validate();
      var validationKeys = Object.keys(validationData);
      validationKeys.forEach(function (entry) {
        var value = validationData[entry];
        if (!!value) {
          value.forEach(function (error) {
            if (error.type === 'required') {
              var currentContext = ExperienceEditor.generateDefaultContext();
              currentContext.value = error.message;
              ExperienceEditor.Web.postServerRequest("ExperienceEditor.TranslateText", currentContext, function (response) {
                var translatedErrorMessage = response.value || response.responseValue.value;
                self.showRawMessage('error', translatedErrorMessage, true, true);
              });
            } else {
              self.showRawMessage('error', error.message, true, true);
            }
          });
        }
      });
    }

    var makeMessage = function (text, isTemp, isClosable, actions) {
      return {
        temporary: isTemp,
        text: text,
        closable: isClosable,
        actions: actions
      };
    }

    var displayMessage = function (messageItem, extra) {
      var type = 'notification';
      switch (messageItem.$templateId) {
        case '{27F53C6B-04A8-4413-8130-9415223597DC}':
          type = 'error';
          break;
        case '{76C2629E-3B7D-4EEE-82D0-F5DF443B56A5}':
          type = 'notification';
          break;
        case '{622D0279-3D83-4FA7-8C8F-45875615C7D8}':
          type = 'warning';
          break;
      }

      var text = messageItem.Text;
      if (!!extra) {
        text += " - " + extra;
      }

      var message = makeMessage(text, messageItem.IsTemporary, messageItem.IsClosable, Array[0]);

      messageBar.addMessage(type, message);
    }
  }

  return validator;
});
/// <reference path="../../../../../../assets/vendors/JQuery/jquery-1.8.2.min.js" />
/// <reference path="../../../../../../assets/vendors/JQuery/jquery-ui-1.8.23.custom.min.js" />
/// <reference path="../../../../../../assets/vendors/Base/Base.js" />
/// <reference path="../../../../../../assets/vendors/KnockOut/knockout-2.1.0.js" />
/// <reference path="../../../Page/Sitecore.Page.js" />
/// <reference path="../../../../../../assets/lib/Models/Sitecore.Types.Models.js" />
/// <reference path="../../../../../../assets/lib/Models/Sitecore.Types.Views.js" />
/// <reference path="../../../../../../assets/lib/3000 - Sitecore.Invocations.js" />

define(["sitecore", "knockout"], function (Sitecore, ko) {
  var model = Sitecore.Definitions.Models.ControlModel.extend(
    {
      initialize: function () {
        this._super();

        this.temporaryNotification = null;
        this.temporaryNotificationTimeout = null;

        this.set("errors", []);
        this.set("warnings", []);
        this.set("notifications", []);
        this.set("translations", {});
        this.set("expanded", false);
        this.set("fadeVisible", true);
        
        this.set("hasMessages", false);
        this.set("hasNotificationMessages", false);
        this.set("hasWarningMessages", false);
        this.set("hasErrorMessages", false);

        this.set("topMessageClass", "sc-messageBar-head", {
          computed: true,
          read: function () {
            var cssClass = "";
            if (this.errors().length + this.warnings().length + this.notifications().length > 1) {
              if (this.errors().length > 0) {
                cssClass = "sc-messageBar-head alert alert-error";
                return cssClass;
              }
              if (this.warnings().length > 0) {
                cssClass = "sc-messageBar-head alert";
                return cssClass;
              }
              cssClass = "sc-messageBar-head alert alert-info";
              return cssClass;
            } else
              return "sc-messageBar-head";
          }
        });

        this.set("headText", "", {
          computed: true,
          read: function () {
            var result = this.translations()["youHaveFew"] + " ";

            if (this.errors().length + this.warnings().length + this.notifications().length > 1) {
              if (this.errors().length > 0) {
                result += this.translations()["errors"];
              }
              if (this.warnings().length > 0) {
                result += (this.errors().length > 0) ? ", " + this.translations()["warnings"] : this.translations()["warnings"];
              }
              if (this.notifications().length > 0) {
                result += (this.errors().length > 0 || this.warnings().length > 0) ? ", " + this.translations()["notifications"] : this.translations()["notifications"];
              }
              return result + ".";
            } else
              return "";
          }
        });

        //        self.expanded = new ko.observable(true);
        this.set("totalMessageCount", "", {
          computed: true,
          read: function () {           
            return this.errors().length + this.warnings().length + this.notifications().length;
          }
        });

        this.setMessagesStatus();
      },
  
      setMessagesStatus: function () {
        this.set("hasMessages", this.get("totalMessageCount") > 0);
        this.set("hasNotificationMessages", this.get("notifications").length > 0);
        this.set("hasWarningMessages", this.get("warnings").length > 0);
        this.set("hasErrorMessages", this.get("errors").length > 0);
      },

      addMessage: function (type, message) {
        var self = this;
        var messagetoAdd;
        if (!type || !message) {
          throw this.get("translations")["provideTypeAndMessage"];
        }
        if ($.isPlainObject(message) && message["text"] !== '') {
          messagetoAdd = message;
        }
        if (typeof message === "string" || message instanceof String) {
          messagetoAdd = { text: message, actions: [], closable: false };
        }

        if (this.get("totalMessageCount") > 0 && this.temporaryNotification && this.temporaryNotificationTimeout) {
          this.convertToClosable(this.temporaryNotification);
          clearTimeout(this.temporaryNotificationTimeout);
          this.temporaryNotificationTimeout = null;
        }

        switch (type) {
          case 'error':
            self.viewModel.errors.push(messagetoAdd);
            break;
          case 'warning':
            self.viewModel.warnings.push(messagetoAdd);
            break;
          case 'notification':
            this.handleTemporaryNotification(messagetoAdd);
            
            self.viewModel.notifications.push(messagetoAdd);
            break;
        }

        this.setMessagesStatus();
      },
        /*.removeMessage(function(error) { return error.id === id })*/
      removeMessage: function (testFunc) {

        var result = [];
        if (!$.isFunction(testFunc)) {
          throw this.get("translations")["provideFunction"];
        }

        result = result.concat(this.viewModel.errors.remove(testFunc));
        result = result.concat(this.viewModel.warnings.remove(testFunc));
        result = result.concat(this.viewModel.notifications.remove(testFunc));
        
        this.setMessagesStatus();
        return result;        
      },
      removeMessages: function (type) {
        if (type === "error") {
          this.viewModel.errors.removeAll();
        } else if (type === "notification") {
          this.viewModel.notifications.removeAll();
        } else if (type === "warning") {
          this.viewModel.warnings.removeAll();
        } else {
          this.viewModel.errors.removeAll();
          this.viewModel.notifications.removeAll();
          this.viewModel.warnings.removeAll();
        }
        this.setMessagesStatus();
      },
      removeError: function (testFunc) {
        if (!$.isFunction(testFunc)) {
          throw this.get("translations")["provideFunction"];
        }
        var result = this.viewModel.errors.remove(testFunc);
        this.setMessagesStatus();
        return result;
      },

      removeWarning: function (testFunc) {
        if (!$.isFunction(testFunc)) {
          throw this.get("translations")["provideFunction"];
        }
        var result = this.viewModel.warnings.remove(testFunc);
        this.setMessagesStatus();
        return result;
      },

      removeNotification: function (testFunc) {
        if (!$.isFunction(testFunc)) {
          throw this.get("translations")["provideFunction"];
        }

        var result = this.viewModel.notifications.remove(testFunc);
        this.setMessagesStatus();
        return result;
      },

      // Notification can be "temporary" if there is only one notification on MessageBar, otherwise notification will be converted to "closable".
      handleTemporaryNotification: function (notification) {
        if (notification.temporary) {
          if (this.get("totalMessageCount") === 0 || this.get("totalMessageCount") === "") {
            notification.temporary = ko.observable(notification.temporary);
            notification.closable = ko.observable(notification.closable);

            this.temporaryNotification = notification;

            this.temporaryNotificationTimeout = window.setTimeout(_.bind(function () {
              this.removeMessage(function (messageItem) {
                return messageItem === notification;
              });
            }, this), 10000);

          } else {
            this.convertToClosable(notification);

          }
        }
      },

      convertToClosable: function (notification) {
        $.type(notification.temporary) === 'function' ? notification.temporary(false) : notification.temporary = false;
        $.type(notification.closable) === 'function' ? notification.closable(true) : notification.closable = true;
      }
    });

  var view = Sitecore.Definitions.Views.ControlView.extend(
    {
      initialize: function (options) {
        this._super();
        var app = this.app;
        var inpSrc = $("input:hidden", this.$el);
        var initialData = inpSrc.length > 0 ? JSON.parse($("input:hidden", this.$el).val()) : [];
        var model = this.model;

        if (this.$el.attr("data-translations")) {
          this.model.set("translations", JSON.parse(this.$el.attr("data-translations")));
        }
        
        this.model.set("errors", initialData["errors"] || []);
        this.model.set("warnings", initialData["warnings"] || []);

        var notifications = initialData["notifications"] || [];

        // if several temporary notifications is exist in initialData
        if (notifications.length) {
          _.each(notifications, _.bind(function (notification) {
            if (notifications.length > 1) {
              if (notification.temporary) {
                model.convertToClosable(notification);
              }
            } else {
              model.handleTemporaryNotification(notification);
            }
          }, this));
        }
        this.model.set("notifications", initialData["notifications"] || []);

        this.model.setMessagesStatus();

        var $messagesHead = $(".sc-messageBar-head", this.$el);

        $messagesHead.click(function (e) {
          model.set("expanded", (!model.get("expanded")));
        });

        this.$el.on("click", ".sc-messageBar-actionLink", function (e) {
          var clickInvocation = $(this).attr("data-sc-click");

          if (clickInvocation) {            
            return Sitecore.Helpers.invocation.execute(clickInvocation, { app: app });
          }
          return null;
        });

        this.$el.on("click", "button.close", function (e) {
          var context = ko.contextFor(this), item = context.$data;

          if (model.get("errors").indexOf(item) >= 0) {
            model.viewModel.errors.remove(item);
          } else if (model.get("warnings").indexOf(item) >= 0) {
            model.viewModel.warnings.remove(item);
          } else {
            if (model.get("notifications").indexOf(item) >= 0) {
              model.viewModel.notifications.remove(item);
            }
          }

          model.setMessagesStatus();
        });

      }
    });

  Sitecore.Factories.createComponent("MessageBar", model, view, ".sc-messageBar");
});

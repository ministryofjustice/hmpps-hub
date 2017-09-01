(function (Speak) {

  Speak.component(["bclCollection"], function (Collection) {

    var temporaryNotificationTimeout,

      addTemporary = function () {
        clearTimeout(temporaryNotificationTimeout);
        if (this.TotalMessageCount === 1 && this.at(0).Type === "notification" && this.at(0).IsTemporary) {
          temporaryNotificationTimeout = window.setTimeout(_.bind(function () {
            this.reset();
          }, this), 10000);
        }
      },

      getHeadText = function () {
        var text = [];
        this.HasErrorMessages && text.push(this.Translations.Errors);
        this.HasWarningMessages && text.push(this.Translations.Warnings);
        this.HasNotificationMessages && text.push(this.Translations.Notifications);
        return this.Translations.ThereAre + " " + text.join(", ") + ".";
      };

    return Speak.extend({}, Collection.prototype, {
      initialize: function () {
        Collection.prototype.initialize.call(this);

        this.defineProperty("Severity", "");
        this.defineProperty("HeadText", "");
        this.defineProperty("IsOpen", false);
      },
      
      Model: Collection.factory.createCollectionModel("Actions", {
        Type: "notification",
        Actions: [],
        Text: "",
        IsClosable: false,
        IsTemporary: false
      }),

      initialized: function () {
        this.Translations = JSON.parse(this.Translations);

        // Model changes
        this.on("itemsChanged", function () {
          // When only one message remains, the header dissapears which is why we want to reset the state at that point.
          // If you have 2 messages -> remove 1 -> add 1, then the bar should be closed, not open.
          if (this.Items.length <= 1) {
            this.IsOpen = false;
          }

          this.TotalMessageCount = this.Items.length;
          this.HasMessages = this.hasData();
          this.HasErrorMessages = !!this.findWhere({ Type: "error" });
          this.HasWarningMessages = !!this.findWhere({ Type: "warning" });
          this.HasNotificationMessages = !!this.findWhere({ Type: "notification" });
          this.Severity = this.HasErrorMessages ?
            "error" : this.HasWarningMessages ?
              "warning" : this.HasNotificationMessages ?
                "notification" : "";

          this.HeadText = getHeadText.call(this);
          addTemporary.call(this);
          this.trigger("change:Items", this.Items);
        }, this);

        this.Comparator = function (message) {
          message.Type = message.Type.toLowerCase(); // Workaround: Runs before change triggers

          switch (message.Type) {
            case "error":
              return 1;
            case "warning":
              return 2;
            case "notification":
            default:
              return 3;
          }
        };

        //Add click handlers
        var that = this,
          app = that.app;

        $(this.el).on("click", ".sc-messageBar-actionLink", function () {
          var clickInvocation = $(this).attr("data-sc-click");
          if (clickInvocation) {
            return Speak.Helpers.invocation.execute(clickInvocation, { app: app });
          }
          return null;
        });

        $(this.el).on("click", "button.close", function () {
          var clickedItemIndex = $(this).closest(".sc-messageBar-message").index();
          that.removeAt(clickedItemIndex);  
        });

        Collection.prototype.initialized.call(this);
      },

      toggle: function () {
        this.IsOpen = !this.IsOpen;
      }

    });
  }, "MessageBar");

})(Sitecore.Speak);
(function (speakGlobal) {
  speakGlobal.component(["bclCollection"], function (Collection) {

    return speakGlobal.extend({}, Collection.prototype, {

      initialize: function () {
        Collection.prototype.initialize.call(this); // call super
        this.defineProperty("Rows", []);
        this.defineProperty("IsTemplateLoaded", false);
      },
      loadTemplate: function () {
        var self = this;

        if (!this.RepeatedTemplateItem) {
          console.warn("CSDR Component - You do not have any Repeated Template Item property defined");
          return;
        }

        $.get('/sitecore/shell/api/sitecore/Layout/RenderItem?sc_database=core&sc_lang=en&sc_itemid=' + this.RepeatedTemplateItem, function (data) {
          self.ScriptTemplate = data;
          self.IsTemplateLoaded = true;

          self.readyCheck("template");
        });
      },
      initialized: function () {
        Collection.prototype.initialized.call(this); // call super
        this.loadTemplate();
        this.on("reset", this.readyCheck, this);
        this.on("ready", this.renderItems, this);
        this.on("add:Items", function (item, config) {
            this.renderItem(item, config.index);
        }, this);
        this.on("remove:Items", this.removeHtmlForItem);
      },

      readyCheck: function (str) {
        if (this.Items.length && this.IsTemplateLoaded) {
          this.trigger("ready");
        }
      },

      renderItems: function () {
        var self = this;
        self.Rows = [];

        if (this.IsRendering) {
            return;
        }

        this.IsRendering = true;
        $(this.el).hide();
        this.resetHtml();
        this.Items.forEach(this.renderItem, this);
      },
      resetHtml: function(){
          $(this.el).empty();
      },
      removeHtmlForItem: function (item, extraData) {
          this.Rows.splice(extraData.index, 1);
          //filter the DOM element to get only the HTMLDivElements and not any whitespace that could be added by mistake.
          var nodes = Array.prototype.slice.call(this.el.childNodes, 0).filter(function (node) {
              return node.toString() === '[object HTMLDivElement]';
          } );

          var rowToRemove = nodes[extraData.index];
          if (!rowToRemove) {
              console.warn("Cannot find the row to remove");
              return;
          }
          this.app.remove(rowToRemove);
          rowToRemove.remove();
      },
      renderItem: function (item, index) {
        var self = this;
        var HTMLToAppend = ('<div data-sc-component="row" data-sc-id="' + "Row" + index + '" data-sc-hasnested data-sc-presenter>' + this.ScriptTemplate + '</div>');
        var context = {};

        context["Row" + index] = item;

        speakGlobal.app.append({ el: self.el, html: HTMLToAppend, context: { data: context, isScoped: true } }, function () {
            var rowComponent = self.app.findComponent("Row" + index);

            self.Rows.push(rowComponent);

            if (self.Rows.length === self.Items.length) {
                self.IsRendering = false;
                $(self.el).show();
            }
            self.trigger("renderRow", rowComponent);
        });
      }
    });
  }, "ClientSideDataRepeater");
})(Sitecore.Speak);

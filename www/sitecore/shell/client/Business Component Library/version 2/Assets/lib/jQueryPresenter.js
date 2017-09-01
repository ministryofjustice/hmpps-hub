!function (e) { if ("object" == typeof exports) module.exports = e(); else if ("function" == typeof define && define.amd) define(e); else { var f; "undefined" != typeof window ? f = window : "undefined" != typeof global ? f = global : "undefined" != typeof self && (f = self), f.sc = e() } }(function () {
  var define, module, exports; return (function e(t, n, r) { function s(o, u) { if (!n[o]) { if (!t[o]) { var a = typeof require == "function" && require; if (!u && a) return a(o, !0); if (i) return i(o, !0); throw new Error("Cannot find module '" + o + "'") } var f = n[o] = { exports: {} }; t[o][0].call(f.exports, function (e) { var n = t[o][1][e]; return s(n ? n : e) }, f, f.exports, e, t, n, r) } return n[o].exports } var i = typeof require == "function" && require; for (var o = 0; o < r.length; o++) s(r[o]); return s })({
    1: [function (_dereq_, module, exports) {
      (function () {
        var setupOptions = function () {
          if (!this.options) {
            return;
          }

          this.options.forEach(function (optionDescriptor) {
            var value = this[optionDescriptor.name];
            if (value === undefined) {
              value = optionDescriptor.defaultValue;
            }

            this.pluginOptions[optionDescriptor.pluginProperty || optionDescriptor.name] = value;
          }, this);
        },
          setupEvents = function (isOption) {
            if (!this.events) {
              return;
            }

            this.events.forEach(function (eventDescriptor) {
              if (!this.pluginOptions[eventDescriptor.name]) {
                var self = this;
                var func = function (e, data) {
                  raiseEvent.call(self, eventDescriptor, e, data);
                };
                if (!isOption) {
                  self.$el.on(eventDescriptor.name, func);
                } else {
                  this.pluginOptions[eventDescriptor.name] = func;
                }
              }
            }, this);
          },
          setupFunctions = function () {

            if (!this.functions) {
              return;
            }

            this.functions.forEach(function (functionDescriptor) {
              var self = this;
              //setting the control.function to run appropriate one from the widget
              this[functionDescriptor.name] = function () {
                //if there is no method with appropriate name just inside the widget object (like Datepicker)
                //trying to execute it through the $element.widgetName("methodName", parameters), e.g. $(element).datepicker("setDate","01/01/2014")
                if (!self.widget[functionDescriptor.name]) {
                  var func = self.widget;
                  return func.apply(self.$el, [functionDescriptor.name, arguments[0]]);
                }
                //when we have needed method inside the widget instance object - trying to execute it through widgetInstance.methodName(params)
                //this part was initialy implemented for the dynaTree library
                return self.widget[functionDescriptor.name].apply(self.widget, arguments);
              };
            }, this);
          },
          updatePlugin = function () {
            setupOptions.call(this);

            if (this.update) {
              return this.update.call(this, this.pluginOptions);
            }

            return this.$el[this.control]("option", this.pluginOptions);
          },
          raiseEvent = function (eventDescriptor, e, data) {

            if (eventDescriptor.on) {
              this[eventDescriptor.on](e, data);
            }

            this.app.trigger(eventDescriptor.name + ":" + this.id, e, data);
          };

        Sitecore.Speak.presenter({
          name: "jQueryPresenter",
          initialize: function () {
            this.$el = $(this.el);
          },
          initialized: function () {
            this.pluginOptions = {};

            setupOptions.call(this);
            setupEvents.call(this, true);

            this.$el[this.control](this.pluginOptions);
            this.widget = this.$el[this.control];

            this.widget = this.widget || this.$el.data(this.control);
            /*after update to jqeryUI 1.10.1 widget retrieving should be done by calling $el.data("widgetNamespace-widgetName")*/
            this.widget = this.widget || this.$el.data(this.namespace + this.control);

            setupEvents.call(this);
            setupFunctions.call(this);

            /* subscribe to changes */
            this.on("change", updatePlugin, this);
          }
        });
      })();

    }, {}]
  }, {}, [1])
  (1)
});
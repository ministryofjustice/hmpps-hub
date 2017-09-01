define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    base: "InputBase",
    name: "ButtonTextBox",
    selector: ".sc-buttontextbox",
    attributes: [
      { name: "text", value: "$el.attr:value" },
      { name: "isReadOnly", defaultValue: false, value: "$el.data:sc-isreadonly" },
      { name: "isRequired", defaultValue: false, value: "$el.data:sc-isrequired" },
      { name: "maxLength", value: "$el.data:sc-maxlength", defaultValue: 0},
      { name: "clickScript", value: "$el.data:sc-click" },
      { name: "isEnabled", defaultValue: true, value: "$el.data:sc-isenabled" }
    ],
    events: {
      "keypress": "checkEnterKey",
      "click": "preventIfDisable",
      "click .btn": "buttonClicked",
      "keyup input": "keyupPressed"
    },

    extendModel: {
      setText: function (val) {
        var maxLength = this.get("maxLength");

        if (maxLength) {
          val = val.substring(0, maxLength);
        }

        this.set("text", val);
      }
    },

    initialize: function () {           
      this.model.on("change:isEnabled", this.toggleEnable, this);
      this.model.on("change", this.render, this);

      this.toggleEnable();
    },

    keyupPressed: function (e) {
      if (e.keyCode == 13) {
        this.buttonClicked(e);
      }
    },

    buttonClicked: function (e) {
      this.preventIfDisable(e);
      var clickInvocation = this.model.get("clickScript");
      if (clickInvocation) {
         _sc.Helpers.invocation.execute(clickInvocation, { app: this.app });
      }
    },

    toggleEnable: function () {
      var isEnabled = this.model.get("isEnabled");
      if (!isEnabled) {
        this.$el.find("input").attr("disabled", "disabled");
        this.$el.find(".btn").attr("disabled", "disabled");
      } else {
        this.$el.find(".btn").removeAttr("disabled");
        this.$el.find("input").removeAttr("disabled");
      }
    },

    preventIfDisable: function (e) {
      if (e && !this.model.get("isEnabled")) {
        e.preventDefault();
      }
    },
    checkEnterKey: function (e) {
      if (e.keyCode === 13) {
        this.$el.find("input").blur().focus();
      }
    },

    render: function () {
      var input = this.$el.find("input");
   //   console.log(this.model.get("maxLength") || null);
      this.toggleAttr(input, "required", this.model.get("isRequired"));
      this.toggleAttr(input, "readonly", this.model.get("isReadOnly"));
      this.toggleAttr(input, "maxlength", this.model.get("maxLength"));
      input.val(this.model.get("text"));
    },

    toggleAttr: function (target, attrName, value) {
      target.attr(attrName, value || null);
    }
  });
});
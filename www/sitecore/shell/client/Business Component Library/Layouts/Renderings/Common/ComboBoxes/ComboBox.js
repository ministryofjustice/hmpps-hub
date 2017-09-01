define(["sitecore", "/-/speak/v1/business/selectcontrolbase.js"], function (_sc, selectControlBase) {
  
  _sc.Factories.createBaseComponent({
    name: "ComboBox",
    base: "SelectControlBase",
    selector: ".sc-combobox",
    
    attributes: selectControlBase.model.prototype._scAttrs,


    initialize: function () {
      this._super();
    }
  });
});
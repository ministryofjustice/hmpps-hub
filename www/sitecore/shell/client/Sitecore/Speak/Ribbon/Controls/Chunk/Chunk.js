define(["sitecore"], function(Sitecore) {
    Sitecore.Factories.createBaseComponent({
        name: "Chunk",
        base: "ControlBase",
        selector: ".sc-chunk",
        attributes: [
        ],
        initialize: function() {
            this._super();
        }
    });
});
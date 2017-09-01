/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />
require.config({
    paths: {
        modernizr: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/modernizr/modernizr.custom.17475",
        jquerypp: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/jquerypp/jquerypp.custom",
        elastislide: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/elastislide/jquery.elastislide"
    },
    shim: {
        'jquerypp': { deps: ['jquery'] },
        'elastislide': { deps: ['jquerypp'] }
    }
});

define(["sitecore", "modernizr", "jquerypp", "elastislide"], function (_sc) {
    
    var carouselClicked = function (ctx) {
        return function (element, position, evt) {
            if (evt && evt.target) {
                evt.preventDefault();
                ctx.model.set("clickedItemId", { element: element, position: position });
            }
        };
    };

  _sc.Factories.createBaseComponent({
    name: "Carousel",
    base: "BlockBase",
    selector: ".sc-carousel",

    attributes: [
    { name: "minimumTiles", defaultValue:3 , value: "$el.data:sc-minimumtiles" },
    { name: "tileWidth",  defaultValue:200, value: "$el.data:sc-tilewidth" },
    { name: "tileHeight",  defaultValue:150, value: "$el.data:sc-tileheight" },
    { name: "onlyEntireTiles",  defaultValue:true, value: "$el.data:sc-onlyentiretiles" },
    { name: "orientation",  defaultValue:"horizontal", value: "$el.data:sc-orientation" },
    { name: "tilePadding", defaultValue:5, value: "$el.data:sc-tilepadding" },
    { name: "clickedItemId", defaultValue: 0 }
    ],
    afterRender: function () {
        var options = {
            minimumTiles: this.model.get("minimumTiles"),
            tileWidth: this.model.get("tileWidth"),
            tileHeight: this.model.get("tileHeight"),
            onlyEntireTiles: this.model.get("onlyEntireTiles"),
            orientation: this.model.get("orientation"),
            tilePadding: this.model.get("tilePadding"),
            onClick: carouselClicked(this)
        };
        this.$el.find(".elastislide-list").elastislide(options);
    },
  });
});
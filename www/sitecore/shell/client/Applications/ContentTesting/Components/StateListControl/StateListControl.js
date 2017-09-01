/// <reference path="../../../../../../assets/vendors/underscore/underscore.js" />
/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />
/// <reference path="../../../../../../assets/vendors/Backbone/backbone.js" />

var arResComponents;
var scrollbarPath;
if (window.location.host && window.location.host != '') { // launching when address to web-page
  scrollbarPath = "/-/speak/v1/assets/Scrollbar";
  arResComponents = ["sitecore", "Scrollbar"];
}
else { // launching of the code-coverage estemating
  scrollbarPath = clientDir + "/Speak/Assets/lib/ui/1.1/behaviors/Scrollbar";
  arResComponents = ["sitecore"];
}

require.config({
  paths: {
    "Scrollbar": scrollbarPath,
  },
  shim: {
    'Scrollbar': { deps: ['sitecore'] }
  }
});

define(arResComponents, function (sc) {
  /**
  * Detail List View
  * Composite View which uses:
  * - One Header view
  * - One Footer view
  * - One Row view
  */
  var Header = Backbone.LayoutManager.extend({
    template: "header",
    initialize: function (options) {
      this.parent = options.parent;
    },
    tagName: "tr"
  });

  var Footer = Backbone.LayoutManager.extend({
    template: "footer",
    initialize: function (options) {
      this.parent = options.parent;
    },
    tagName: "tr"
  });

  var Row = Backbone.LayoutManager.extend({
    template: "row",
    tagName: "tr",
    events: { "click": "select" },
    initialize: function (options) {
      this.parent = options.parent;
    },
    afterRender: function () {
      this.sync();
    },
    select: function (e) {
      // If user clicks on state image selected/unselected event mustn't be triggered 
      if (e.originalEvent.target.className === 'stateimg') {
        return;
      }

      if (this.$el.hasClass("active")) {
        this.trigger("unselected", this.$el, this.model);
      } else {
        this.trigger("selected", this.$el, this.model);
      }
    }

  });

  var DetailList = Backbone.LayoutManager.extend({
    template: "main",
    events: {
      "click .sc-table-sortable": "sort"
    },

    // Sorting status definitions
    sortingStatus: {
      noSorting: "",
      ascending: "a",
      descending: "d"
    },

    selectRow: function (row, rowModel) {
      this.$el.find(".active").removeClass("active");
      row.addClass("active");

      this.model.set("selectedItem", rowModel);
      this.model.set("selectedItemId", rowModel.get("itemId"));
    },
    initialize: function (options) {
      this.parent = options.parent;
      this.setView(".sc-table thead", new Header({ parent: this.parent }));
      this.setView(".sc-table-footer", new Footer({ parent: this.parent }));
      this.sortingParameters = [];
      this.model.on("change:selectedItemId", function () {
        this.model.get("selectedItemId") === null ? this.unselectRow() : $.noop();
      }, this);

      // Call updateArrows here so user sees immediate change in arrow direction.
      // updateArrows is called again after the ListControl is re-rendered.
      this.model.on("change:sorting", function () {
        this.updateArrows();
      }, this);
    },
    unselectRow: function (row, rowModel) {
      this.$el.find(".active").removeClass("active");
      //      
      //      this.model.set("selectedItems", _.without(this.model.get("selectedItems"), rowModel));
      //      this.model.set("checkedItemIds", _.without(this.model.get("checkedItemIds"), rowModel.get("itemId")));

      this.model.set("selectedItemId", "");
      this.model.set("selectedItem", "");
    },
    insertRow: function (model) {
      if (this.hasEmpty) {
        this.removeEmpty();
        this.hasEmpty = false;
      }
      var row = new Row({ parent: this.parent, model: model, serialize: model.viewModel });
      this.insertView(".sc-table tbody", row);
      row.on("selected", this.selectRow, this);
      row.on("unselected", this.unselectRow, this);
    },
    beforeRender: function () {
      this.collection.each(this.insertRow, this);
    },
    afterRender: function () {
      var numberRow = this.$el.find(".sc-table thead tr th").length;

      if (this.collection.length === 0) {
        this.renderEmpty(numberRow);
      }

      this.formatFooter(numberRow);
      this.updateArrows();
    },
    removeEmpty: function () {
      this.$el.find(".empty").remove();
    },
    updateArrows: function () {
      var sortingArray = [];
      if (this.model.get("sorting")) {
        sortingArray = this.model.get("sorting").split('|');
      }

      $(".sc-table-sortable").removeClass("up").addClass("noDirection");

      for (var index = 0; index < sortingArray.length; ++index) {
        var sortElement = sortingArray[index].trim();
        if (sortElement) {
          var direction = sortElement.charAt(0),
            sortName = sortElement.substr(1),
           $header = this.$el.find("[data-sc-sort-name='" + sortName + "']");

          _.each($header, function (header) {
            if (direction === "d") {
              $(header).removeClass("noDirection");

            } else if (direction === "a") {
              $(header).removeClass("noDirection").addClass("up");
            }
          });
        }
      }
    },
    sort: function (evt) {
      var $source = $(evt.currentTarget),
        sortingAttribute = this.model.get("sorting"),
        sortNameAttribute = $source.attr("data-sc-sort-name").trim(),
        sortingArray = sortingAttribute ? sortingAttribute.split("|") : [],
        isInSortingArray = false;

      for (var i = 0; i < sortingArray.length; i++) {
        var sortElement = sortingArray[i],
          direction = sortElement.charAt(0),
            sortName = sortElement.substr(1);

        if (sortNameAttribute === sortName) {
          if (direction === "a") {
            direction = "d";
          } else if (direction === "d") {
            direction = "";
          }
          sortElement = direction + sortName;
          isInSortingArray = true;
          sortingArray.splice(i, 1);

          if (direction) {
            sortingArray.unshift(sortElement);
          }
        }
      }

      if (!isInSortingArray) {
        sortingArray.unshift("a" + sortNameAttribute);
      }

      if (!this.model.get("allowMultipleColumnSorting")) {
        sortingArray.splice(1);
      }

      this.model.set("sorting", sortingArray.join("|"));
    },
    renderEmpty: function (numberRow) {
      var emptytext = this.model.get("empty") || "",
          html = "<tr class='empty'><td colspan='" + numberRow + "'>{0}</td></tr>";

      html = html.replace("{0}", emptytext);
      this.$el.find(".sc-table tbody").html(html);
      this.hasEmpty = true;
    },
    formatFooter: function (numberRow) {
      //this.$el.find(".sc-table tfoot tr td").attr("colspan", numberRow);
    }
  });

  /**
  * Icon List View
  * Composite View which uses:
  * - Icon view
  */

  var Icon = Backbone.LayoutManager.extend({
    events: {
      "click": "select"
    },
    //template: "icon",
    tagName: "div",
    contentLanguage: "",
    getImage: function () {
      //find Thumbail
      if (this.model.get("__Thumbnail")) {
        var shityHtml = this.model.get("__Thumbnail"),
            extractId = new RegExp(/mediaid="{(.*?)}"/),
            id = shityHtml.match(extractId)[1],
            db = this.model.get("itemUri").databaseUri.databaseName;
        id = id.replace(/-/g, "");

        return "/" + (sc.Resources.Settings["Media.MediaLinkPrefix"] ? sc.Resources.Settings["Media.MediaLinkPrefix"] : "~/media") + "/" + id + ".ashx?bc=Transparent&thn=1t&h=130&w=130&db=" + db + "&la=" + this.contentLanguage;
      } else {
        return this.model.get("$mediaurl");
      }
    },
    className: "sc-iconList-wrap",
    afterRender: function () {
      this.model.set("image", this.getImage());
      this.sync();
    },
    select: function (e) {
      e.preventDefault();
      if (this.$el.hasClass("active")) {
        this.trigger("unselected", this.$el, this.model);
      } else {
        this.trigger("selected", this.$el, this.model);
      }
    }
  });

  var IconList = Backbone.LayoutManager.extend({
    template: "iconList",
    initialize: function (options) {
      this.parent = options.parent;

      this.model.on("change:selectedItemId", function () {

        (this.model.get("selectedItemId") === null || this.model.get("selectedItemId").length === 0) ? this.unselectIcon() : $.noop();
      }, this);
    },
    insertRow: function (model) {
      if (this.hasEmpty) {
        this.removeEmpty();
        this.hasEmpty = false;
      }
      var icon = new Icon({ template: "icon" + this.parent.model.get("name"), model: model, serialize: model.toJSON() });
      icon.on("selected", this.selectIcon, this);
      icon.on("unselected", this.unselectIcon, this);
      icon.contentLanguage = this.model.get("contentLanguage");
      this.insertView(icon);
      if (model.get("itemId") === this.model.get("defaultSelectedItemId")) {
        this.selectIcon(icon.$el, model);
      }
    },
    beforeRender: function () {
      this.collection.each(this.insertRow, this);
    },
    selectIcon: function (icon, iconModel) {
      this.$el.find(".active").removeClass("active");
      icon.addClass("active");

      this.model.set("selectedItem", iconModel);
      this.model.set("selectedItemId", iconModel.get("itemId"));
    },
    unselectIcon: function (icon, iconModel) {
      this.$el.find(".active").removeClass("active");

      this.model.set("selectedItem", "");
      this.model.set("selectedItemId", "");
    },
    afterRender: function () {
      if (this.collection.length === 0) {
        this.renderEmpty();
      }

    },
    removeEmpty: function () {
      this.$el.find(".empty").remove();
    },
    renderEmpty: function (numberRow) {
      var emptyText = this.model.get("empty") || "";
      this.$el.html("<div class='empty'>" + emptyText + "</div>");
      this.hasEmpty = true;
    },
    totalScroll: function () {
      this.collection.each(this.insertRow, this);
    }
  });

  /**
  * ListControl is a Composite view
  * It is wrapper in order to switch the view Mode
  * Sorting parameter is a pipe separated string.
  * prefixed with a, it will be ascending
  * prefixed with d, it will be descending
  */
  var StateListControl = Backbone.LayoutManager.extend({
    template: "listControl",
    initialize: function (options) {
      this.parent = options.parent;
      this.model.on("change:items", this.refresh, this);
      this.model.on("change:view", this.setViewModel, this);
      this.setViewModel();
    },

    appendLanguageParameter: function (item) {
      if (item.$icon && item.$icon.indexOf(".ashx") > 0) {
        item.$icon += "&la=" + this.model.get("contentLanguage");
        item.$mediaurl += "&la=" + this.model.get("contentLanguage");
      }
    },

    refresh: function () {
      var self = this;
      this.collection.reset();
      _.each(this.model.get("items"), function (item) {

        this.appendLanguageParameter(item);

        var itemModel;

        // creating new item from json
        if (item instanceof this.collection.model) {
          itemModel = item;
        } else {
          itemModel = new this.collection.model(item);
        }

        // apply formating
        itemModel.viewModel.formatValue = function (name, format) {

          var val = "";

          //  Checking for this[name]() invokes binding, so make sure this[name] is a function
          if (typeof this[name] === 'function' && name !== "" && typeof this[name]() !== 'undefined') {
            val = this[name]();
          }

          var tempValue = '';
          var additionalValues;
          if (this.$formatedFields) {
            additionalValues = this.$formatedFields();
          }

          if (!isNaN(val) && format && format.substring(0, 1) === "#") {
            val = self.formatNumber(val, format, self.model.get("contextLanguage"));
          } else if (format && format === "short") {
            if (additionalValues) {
              tempValue = additionalValues[name].shortDateValue;
              if (tempValue) val = tempValue;
            }
          }
          else if (format && format === "long") {
            if (additionalValues) {
              tempValue = additionalValues[name].longDateValue;
              if (tempValue) val = tempValue;
            }
          }
          else if (format) {
            var isHtmlTemplate = val === "" && name === "";
            if (isHtmlTemplate) {
              var viewModel = this;
              var getValue = function (fieldname) {
                if (typeof viewModel[fieldname] !== "undefined") {
                  return viewModel[fieldname]();
                }
                return undefined;
              };
              tempValue = sc.Helpers.string.formatByTemplate(format, getValue);

            } else if (sc.Helpers.date.isISO(val)) {
              var dateConverter = sc.Converters.get("date");
              tempValue = dateConverter.toStringWithFormat(val, format);
            }
            if (tempValue) val = tempValue;
          }

          return val;
        };
        this.collection.add(itemModel);
      }, this);

      var parent = this.parent;
      this.render().done(function () {
        parent.afterRender();
        parent.trigger("didRender");
      });
    },

    formatNumber: function (value, format, language) {
      var result;

      if (isNaN(value) || value === "") {
        return value;
      }

      if (format.length < 2) {
        return value;
      }

      var fomatType = format.substring(1, 2);
      if (fomatType !== "P" && fomatType !== "N") {
        return value;
      }

      var digitsNumber = 2;
      if (format.length > 2) {
        digitsNumber = format.substring(2, format.lenght);

        if (isNaN(parseInt(digitsNumber, 10))) {
          digitsNumber = 2;
        }
      }

      result = parseFloat(parseFloat(value).toFixed(digitsNumber)).toLocaleString(language);
      var decimalPosition = Math.max(result.lastIndexOf(","), result.lastIndexOf("."));
      var numberOfDecimals = result.length - 1 - decimalPosition;
      while (numberOfDecimals < digitsNumber) {
        result = result + "0";
        numberOfDecimals++;
      }

      if (result % 1 === 0) {
        result = parseInt(result, 10);
      }

      if (fomatType === "P") {
        result = result + " %";
      }

      return result;
    },

    setViewModel: function () {
      var view = this.model.get("view");

      if (!view || view.toLowerCase() === "DetailList".toLowerCase()) {
        this.$el.empty();
        this.setView(new DetailList({ model: this.model, parent: this.parent, collection: this.collection }));
      }
      else if (view.toLowerCase() === "IconList".toLowerCase()) {
        this.$el.empty();
        this.setView(new IconList({ model: this.model, parent: this.parent, collection: this.collection }));
      }
      else {
        throw "Unknown view mode: " + view;
      }
      this.render();
    }
  });

  /**
  * Collection
  * will be shared among all the Composite view
  */
  var SC_Collection = Backbone.Collection.extend({
    model: sc.Definitions.Models.Model
  });

  var controlModel = sc.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
      this._super();
      this.set("items", []);

      this.set("selectedItem", "");
      this.set("selectedItemId", "");
      this.set("empty", "");
    }
  });

  /**
  * ControlView
  * Object which allows us to exposed the Composite
  */
  var controlView = sc.Definitions.Views.ControlView.extend({
    listen: _.extend({}, sc.Definitions.Views.ControlView.prototype.listen, {
      "detailList:$this": "setDetailListView",
      "icon:$this": "setIconView"
    }),
    initialize: function (options) {
      this._super();
      this.model.set("empty", this.$el.data("sc-empty")); //the empty should be move in the Composite
      this.model.set("view", this.$el.data("sc-viewmode"));
      this.model.set("height", this.$el.data("sc-height"));
      this.model.set("contextLanguage", this.$el.data("sc-contextlanguage"));
      this.model.set("contentLanguage", this.$el.data("sc-contentlanguage"));
      this.model.set("defaultSelectedItemId", this.$el.data("sc-defaultselecteditemsd"));
      this.model.set("sorting", this.$el.attr("data-sc-sorting"));
      this.model.set("allowMultipleColumnSorting", this.$el.data("sc-allowmultiplecolumnsorting"));
      sc.Resources = sc.Resources || {};
      sc.Resources.Settings = sc.Resources.Settings || {};
      sc.Resources.Settings["Media.MediaLinkPrefix"] = this.$el.data("sc-media-link-prefix");
      if (typeof this.collection === "undefined") {
        this.collection = new SC_Collection();
      }
      this.listControl = new StateListControl({ model: this.model, parent: this, collection: this.collection, app: this.app });
      this.$el.empty().append(this.listControl.el);
      this.listControl.render();
    },
    setDetailListView: function () {
      this.model.set("view", "DetailList");
    },
    setIconView: function () {
      this.model.set("view", "IconList");
    },
    afterRender: function () {
    }
  });

  sc.Factories.createComponent("StateListControl", controlModel, controlView, ".sc-statelistcontrol", SC_Collection);
});
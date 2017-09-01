
define(["sitecore"], function (_sc) {

  // model
  var model = _sc.Definitions.Models.ControlModel.extend(
    {
      initialize: function (options) {
        this._super();

        this.set("Minimum", "0");
        this.set("Maximum", "100");
        this.set("Value", "0");

        this.set("ValueAll", "");
        this.set("HeaderBar", "");
        this.set("FooterTitle1", "");
        this.set("FooterTitle2", "");
        
      }
    });

  // view
  var view = _sc.Definitions.Views.ControlView.extend(
  {
    header: "",
    valueAll: "",
    footerTitle1: "",
    footerTitle2: "",

    initialize: function (options) {
      //this._super();

      var minimum = this.$el.data("sc-minimum");
      var maximum = this.$el.data("sc-maximum");
      var value = this.$el.data("sc-value");

      var headerBar = this.$el.data("sc-headerbar");
      var valueAll = this.$el.data("sc-valueall");
      var footerTitle1 = this.$el.data("sc-footertitle1");
      var footerTitle2 = this.$el.data("sc-footertitle2");

      if (typeof minimum !== undefined)
        this.model.set("Minimum", minimum);
      if (typeof maximum !== undefined)
        this.model.set("Maximum", maximum);
      if (typeof value !== undefined)
        this.model.set("Value", value);

      if (typeof headerBar !== undefined)
        this.model.set("HeaderBar", headerBar);
      if (typeof valueAll !== undefined)
        this.model.set("ValueAll", valueAll);
      if (typeof footerTitle1 !== undefined)
        this.model.set("FooterTitle1", footerTitle1);
      if (typeof footerTitle2 !== undefined)
        this.model.set("FooterTitle2", footerTitle2);


      // events
      this.model.on("change:Value", this.valueChanged, this);
      this.model.on("change:Minimum", this.valueChanged, this);
      this.model.on("change:Maximum", this.valueChanged, this);
      

      this.model.on("change:HeaderBar", this.renderElements, this);
      this.model.on("change:ValueAll", this.renderElements, this);
      this.model.on("change:FooterTitle1", this.renderElements, this);
      this.model.on("change:FooterTitle2", this.renderElements, this);


      //
      this.renderElements();

      //
      this.valueChanged();

    },

    // testing options for unit-tests
    setTestingOptions: function (options) {
      this.$el = options.$el;
      this.model = options.model;
    },
    
    renderElements: function (sender) {

      var headerBar = this.model.get("HeaderBar");
      var valueAll = this.model.get("ValueAll");
      var footerTitle1 = this.model.get("FooterTitle1");
      var footerTitle2 = this.model.get("FooterTitle2");


      // header
      var dvHeaderElem = this.$el.find(".scPrBar-dvHeader");
      var spHeaderElem = this.$el.find(".scPrBar-spHeader");
      var dvContentElem = this.$el.find(".scPrBar-dvContent");
      if (typeof headerBar === undefined || headerBar === '') {
        dvHeaderElem.addClass("scPrBar-dvHeaderEmpty");
        spHeaderElem.css("display", "none");
        dvContentElem.addClass("scPrBar-dvContentHeaderEmpty");
        this.$el.addClass("progressbarcustomHeaderEmpty");
      }
      else {
        dvHeaderElem.removeClass("scPrBar-dvHeaderEmpty");
        spHeaderElem.css("display", "block"); 
        dvContentElem.removeClass("scPrBar-dvContentHeaderEmpty");
        this.$el.removeClass("progressbarcustomHeaderEmpty");

        spHeaderElem = this.$el.find(".scPrBar-spHeader");
        spHeaderElem.html("<b>" + headerBar + "</b>");
      }

      // ValueAll
      var dvInfoElem = this.$el.find(".scPrBar-dvInfo");
      var dvFieldElem = this.$el.find(".scPrBar-dvField");
      if (typeof valueAll === undefined || valueAll === '') {
        dvInfoElem.css("display", "none");
        dvFieldElem.addClass("scPrBar-dvFieldNoValueAll");
      }
      else {
        dvInfoElem.css("display", "block");
        dvFieldElem.removeClass("scPrBar-dvFieldNoValueAll");

        var spValueAllElem = this.$el.find(".scPrBar-spValueAll");
        spValueAllElem.html(valueAll);
      }

      // footerTitle1
      var spFooterTitle1Elem = this.$el.find(".scPrBar-spFooterTitle1");
      (typeof footerTitle1 === undefined || footerTitle1 === '') ? spFooterTitle1Elem.html(""): spFooterTitle1Elem.html(footerTitle1);

      // footerTitle2
      var spFooterTitle2Elem = this.$el.find(".scPrBar-spFooterTitle2");
      (typeof footerTitle2 === undefined || footerTitle2 === '') ? spFooterTitle2Elem.html("") : spFooterTitle2Elem.html(footerTitle2);

      
      // #22441 - styles modifying(quick fix!!!)
      //-----------------------------//
      var reachProgressElem = this.$el;
      //var headerElem = reachProgressElem.find(".scPrBar-spHeader");
      //var footerTitle1Elem = reachProgressElem.find(".scPrBar-spFooterTitle1");
      //headerElem.html("<b>" + headerElem.html() + " - " + footerTitle1Elem.html() + "</b>");

      var dvFieldElem = reachProgressElem.find(".scPrBar-dvField");
      var spValueElem = reachProgressElem.find(".scPrBar-spValue");
      spValueElem.remove();
      dvFieldElem.append(spValueElem);

      var footerElem = reachProgressElem.find(".scPrBar-dvFooter");      
      footerElem.css("display", "none");
      //-----------------------------//

    },

    valueChanged: function () {
      var minimum = this.model.get("Minimum");
      var maximum = this.model.get("Maximum");
      var value = this.model.get("Value");
      if (value > maximum)
        value = maximum;
      if (value < minimum)
        value = minimum;

      var diff = Math.abs(minimum - maximum);
      var perc = 0;
      if(diff > 0)
        perc = (Math.abs(value - minimum) / diff) * 100;
      perc = Math.round(perc);

      var dvValueElem = this.$el.find(".scPrBar-dvValue");
      dvValueElem.css("width", perc + "%");

      var spValueElem = this.$el.find(".scPrBar-spValue");
      spValueElem.html(perc + "%");
      
    },
    
  });


  // create component
  _sc.Factories.createComponent("ProgressBarCustom", model, view, ".sc-progressbarcustom");

});
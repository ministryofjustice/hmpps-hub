define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "SliderAdvanced",
    base: "ComponentBase",
    selector: ".sc-SliderAdvanced",
    sliderComponent: null,
    sliderControl: null,
    attributes: [
      { name: "minimum", defaultValue: null, value: "$el.data:sc-minimum" },
      { name: "maximum", defaultValue: null, value: "$el.data:sc-maximum" },
      { name: "countPoints", defaultValue: null, value: "$el.data:sc-countpoints" },
      { name: "selectedValue", defaultValue: null, value: "$el.data:sc-selectedValue" },
      { name: "isRoundValue", defaultValue: true, value: "$el.data:sc-isroundvalue" },
      { name: "isValueBackground", defaultValue: "true", value: "$el.data:sc-isvaluebackground" },

      { name: "items", defaultValue: null, value: "$el.data:sc-items" },

      { name: "titlevaluesuffix", defaultValue: null, value: "$el.data:sc-titlevaluesuffix" }
    ],

    // hasItems - flat of having "items" data
    hasItems: false,

    // flag of slider moving  
    isSliderMove: false,

    // index of current item
    curItemIndex: -1,

    // flag of correction setting
    isCorrectSet: false,

    // flag of changing X coordinate
    isChangeXcoord: false,

    // flat of window resizing
    isWindowResized: false,

    // flag of "clientWidth" of component == 0
    isClientWidthEqual0: false,

    prevTitlePanelWidth: 0,

    // timer's id
    idTimer: -1,

    initialize: function (options) {

      var self = this;

      if (this.model.get("isRoundValue") === "False")
        this.model.set("isRoundValue", false);
      else
        this.model.set("isRoundValue", true);

      this.model.on("change:items", this.initializeParameters, this);
      this.model.on("change:minimum", this.initializeParameters, this);
      this.model.on("change:maximum", this.initializeParameters, this);
      this.model.on("change:countPoints", this.initializeParameters, this);

      this.model.on("change:selectedValue", this.selectedValueChanged, this);
      this.model.on("change:isEnabled", this.isEnabledChanged, this);

      $(window).mouseup(function (event) {
        self.isSliderMove = false;
      });

      $(window).mousemove(function (event) {
        if (self.isSliderMove) {
          self.changeXcoord(event.pageX);
        }
      });

      //
      $(window).resize(function () {
        self.isWindowResized = true;
      });

      //
      this.initializeParameters();

      //
      this.renderComponent();

      // timer - for case when "clientWidth" == 0 or window resize(it's needed to redraw component)
      setInterval(function () {
        //if ((isClientWidthEqual0 && $titlePanel[0].clientWidth != 0) || self.isWindowResized) {
        var $titlePanel = self.$el.find(".sliderAdv-dvTitlePanel");
        if (($titlePanel[0].clientWidth === 0)) {
          self.isClientWidthEqual0 = true;
        }

        if (self.isClientWidthEqual0 && $titlePanel[0].clientWidth !== 0) {
          self.isClientWidthEqual0 = false;
          self.renderComponent();
        }
        else if ($titlePanel[0].clientWidth > 0 && $titlePanel[0].clientWidth !== self.prevTitlePanelWidth) {
          self.prevTitlePanelWidth = $titlePanel[0].clientWidth;
          self.renderComponent();
        }
        else if (self.isWindowResized) {
          self.isWindowResized = false;
          self.renderComponent();
        }
      }, 100);
    },

    // testing options for unit-tests
    setTestingOptions: function (options) {
      this.$el = options.$el;
      this.model = options.model;
    },

    initializeParameters: function () {
      if (this.isCorrectSet) // miss if "isCorrectSet" == true
        return;

      var items = this.model.get("items");
      this.hasItems = (items && items.length > 0);

      // !hasItems
      if (!this.hasItems) {
        var minimum = this.model.get("minimum");
        var maximum = this.model.get("maximum");
        var countPoints = this.model.get("countPoints");

        // correcting parameters
        if (typeof minimum === 'undefined' || minimum == null || typeof maximum === 'undefined' || maximum == null) {
          minimum = 0;
          maximum = 0;
        }

        if (minimum > maximum) {
          minimum = maximum;
          countPoints = 1;
        }
        if (!countPoints) {
          countPoints = 1;
        }
        countPoints += 1;

        this.isCorrectSet = true;
        this.model.set("minimum", minimum);
        this.model.set("maximum", maximum);
        this.model.set("countPoints", countPoints);
        this.isCorrectSet = false;
      }

      //
      this.renderComponent();
    },

    // isEnabled
    isEnabled: function () {
      var isEnabled = this.model.get("isEnabled");
      return (typeof isEnabled == 'undefined' || isEnabled.toString() != "false");
    },

    // rendering Component
    renderComponent: function () {
      var self = this;

      var html = '<div class="sliderAdv-dvTitlePanel"></div>' +
                  '<div class="sliderAdv-dvPanel">' +
                    '<div class="sliderAdv-dvSelectedPanel"></div>' +
                    '<div class="sliderAdv-dvSliderPanel">' +
                      '<div class="sliderAdv-dvSliderHandle round" style="left: 30%;"></div>' +
                    '</div>' +
                   '<span unselectable="on" class="sliderAdv-markValue"></span></div>';


      this.$el.html(html);

      // mousedown on ".sliderAdv-dvPanel"
      var $panel = this.$el.find(".sliderAdv-dvPanel");
      $panel.mousedown(function (event) {        
        if (self.isEnabled())
          self.changeXcoord(event.pageX);
      });

      // mousedown on .sliderAdv-dvSliderHandle
      var $handle = this.$el.find(".sliderAdv-dvSliderHandle");
      $handle.mousedown(function (event) {
        if (self.isEnabled())
          self.isSliderMove = true;
      });

      //
      this.renderTitles();

      // selected value
      var selectedValue = this.model.get("selectedValue");
      if (typeof selectedValue === 'undefined' || selectedValue === null) {
        if (this.hasItems) {
          selectedValue = this.model.get("items")[0].Value;
        }
        else
          selectedValue = this.model.get("minimum");

        this.model.set("selectedValue", selectedValue);
      }
      else
        this.selectedValueChanged();
    },

    // rendering Titles
    renderTitles: function () {

      var $titlePanel = this.$el.find(".sliderAdv-dvTitlePanel");

      // title value suffix
      var titleValueSuffix = this.model.get("titlevaluesuffix");
      if (!titleValueSuffix)
        titleValueSuffix = "";

      var widthPanel = $titlePanel[0].clientWidth;

      var items;

      var minimum = 0;
      var maximum = 0;
      var isRoundValue = true;
      var countPoints = 0;

      var pixelForPoint = 0;
      var stepValue = 0;
      var startValue = 0;

      // hasItems
      if (this.hasItems) {
        items = this.model.get("items");
        countPoints = items.length;
      }
      else {
        minimum = this.model.get("minimum");
        maximum = this.model.get("maximum");
        isRoundValue = this.model.get("isRoundValue");

        countPoints = this.model.get("countPoints");
        if (countPoints === 0)
          countPoints = 1;

        stepValue = Math.abs(maximum - minimum) / (countPoints - 1);
        startValue = 0;
      }

      pixelForPoint = widthPanel / (countPoints - 1);

      // render points
      var htmlPoint;
      for (var i = 0; i < countPoints; i++) {
        if (this.hasItems) {
          var item = items[i];
          var valueContent = '';
          if (item.ImgSrc && item.ImgSrc !== '') {
            valueContent = '<img src="' + item.ImgSrc + '">';
          }
          else
            valueContent = item.Value + titleValueSuffix;

          htmlPoint = '<div unselectable="on" class="sliderAdv-dvTitleBar">' + valueContent + '</div>';
        }
        else {
          startValue = i * stepValue;
          if (i === (countPoints - 1))
            startValue = maximum;

          var roundedVal = 0;
          if (isRoundValue)
            roundedVal = Math.round(startValue);
          else
            roundedVal = this.RoundNumber(startValue, 2);

          var valueStr = roundedVal + titleValueSuffix;
          htmlPoint = '<div unselectable="on" class="sliderAdv-dvTitleBar"><b>' + valueStr + '</b></div>';
        }

        //
        $titlePanel.append(htmlPoint);
        var $titleBar = $titlePanel.children().last();

        var widthElem = $titleBar[0].clientWidth;

        // "left" edge
        var left = 0;
        if (i === (countPoints - 1)) {
          left = widthPanel - widthElem;
        }
        else {
          left = i * pixelForPoint;
          if (i > 0)
            left -= (widthElem / 2);
        }

        $titleBar.css("left", left + "px");
      }

    },

    // getting offset left
    getOffsetLeft: function () {
      var offsetLeft = 0;
      var obj = this.$el[0];
      if (obj.offsetParent) {
        do {
          offsetLeft += obj.offsetLeft;
        } while (obj === obj.offsetParent);
      }
      return offsetLeft;
    },

    // changing of X coordinate(moving of handle)
    changeXcoord: function (curX) {
      var self = this;

      var isRoundValue = self.model.get("isRoundValue");

      //var offsetLeft = self.$el[0].offsetLeft;
      var offsetLeft = self.getOffsetLeft();

      var widthComponent = self.$el[0].offsetWidth;

      // offset
      var pxOffset = curX - offsetLeft;
      var partOffset = pxOffset / widthComponent;

      var selectedVal;

      // hasItems
      if (self.hasItems) {
        var items = self.model.get("items");
        var countPoints = items.length;

        // defining of current point(index)
        var partForPoint = widthComponent / (countPoints - 1);
        var curPoint = Math.round(pxOffset / partForPoint);
        if (curPoint < 0)
          curPoint = 0;
        else if (curPoint > (countPoints - 1))
          curPoint = countPoints - 1;

        selectedVal = items[curPoint].Value;
      }
        // !hasItems
      else {

        var minimum = self.model.get("minimum");
        var maximum = self.model.get("maximum");

        // Selected value
        var valueInterval = maximum - minimum;
        selectedVal = minimum + partOffset * valueInterval;

        if (selectedVal < minimum)
          selectedVal = minimum;
        else if (selectedVal > maximum)
          selectedVal = maximum;
      }

      self.renderHandle(selectedVal);

      self.isChangeXcoord = true;
      this.model.set("selectedValue", Math.round(selectedVal));
      self.isChangeXcoord = false;
    },

    // rendering of handle by value
    renderHandle: function (value) {
      var self = this;

      var isRoundValue = self.model.get("isRoundValue");
      var titleValueSuffix = self.model.get("titlevaluesuffix");

      //var offsetLeft = self.$el[0].offsetLeft;
      var offsetLeft = self.getOffsetLeft();

      var widthComponent = self.$el[0].offsetWidth;

      var $sliderHandle = self.$el.find(".sliderAdv-dvSliderHandle");
      var widthHandle = $sliderHandle[0].clientWidth;

      var $selectedPanel = self.$el.find(".sliderAdv-dvSelectedPanel");

      var leftHandle = -1;
      var percOffset;

      // hasItems
      if (self.hasItems) {
        var items = self.model.get("items");
        var countPoints = items.length;

        // defining of current point(index)
        var partForPoint = widthComponent / (countPoints - 1);
        self.curItemIndex = -1;
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (item.Value && parseInt(item.Value) === parseInt(value)) {
            self.curItemIndex = i;
            break;
          }
        }
        
        // defining "leftHandle"
        if (self.curItemIndex >= 0) {
          leftHandle = offsetLeft + self.curItemIndex * partForPoint;
          if (self.curItemIndex === (countPoints - 1))
            leftHandle -= widthHandle;
          else if (self.curItemIndex > 0)
            leftHandle -= widthHandle / 2;

          // percent of selected panel
          var curItemOffset = (leftHandle + widthHandle / 2) - offsetLeft;
          percOffset = (curItemOffset / widthComponent) * 100;
        }
      }
        // !hasItems
      else {

        var minimum = self.model.get("minimum");
        var maximum = self.model.get("maximum");
        if (value < minimum)
          value = minimum;
        else if (value > maximum)
          value = maximum;

        // defining X-coordinate by "value"
        var valueInterval = maximum - minimum;

        var diffValue = value - minimum;
        var partValue = 0;
        if (valueInterval > 0)
          partValue = diffValue / valueInterval;

        var partOffset = partValue * widthComponent;
        var curX = offsetLeft + partOffset;

        // percent of selected panel
        percOffset = partValue * 100;

        // left for Handle
        leftHandle = curX - widthHandle / 2;
        if (curX < (offsetLeft + widthHandle / 2))
          leftHandle = offsetLeft;
        else if (curX > (offsetLeft + widthComponent - widthHandle / 2))
          leftHandle = offsetLeft + widthComponent - widthHandle;

        //
        if (isRoundValue)
          value = Math.round(value);
        else
          value = self.RoundNumber(value, 2);

        // markValue rendering
        var valueStr = value.toString();
        if (titleValueSuffix)
          valueStr += titleValueSuffix;

        $markValue = this.$el.find(".sliderAdv-markValue");
        $markValue.css("display", "inline");
        var widthMarkValue = 0;
        if ($markValue.length > 0) {
          $markValue.html(valueStr);
          widthMarkValue = $markValue[0].clientWidth;
          if (widthMarkValue === 0) {
            widthMarkValue = 50;
          }
        }
        var leftMarkValue = leftHandle + widthHandle / 2 - widthMarkValue / 2;
        $markValue.html(valueStr);
        $markValue.offset({ left: leftMarkValue });
        $markValue.css({ top: -38 });
      }

      // rendering
      if (leftHandle >= 0) {

        // setting percent       
        if (percOffset < 0)
          percOffset = 0;
        else if (percOffset > 100)
          percOffset = 100;

        var isValueBackground = this.model.get("isValueBackground");
        if (isValueBackground && isValueBackground.toLowerCase() === "false")
          $selectedPanel.css("width", "0%");
        else
          $selectedPanel.css("width", percOffset + "%");

        // setting left
        $sliderHandle.offset({ left: leftHandle });
      }
    },

    // isEnabledChanged
    isEnabledChanged: function () {
      if (this.isEnabled())
        this.$el.removeClass("disabled");
      else
        this.$el.addClass("disabled");
    },

    // selectedValueChanged
    selectedValueChanged: function () {
      var selectedValue = this.model.get("selectedValue");
      if (typeof selectedValue !== 'undefined') {
        if (!this.isChangeXcoord)
          this.renderHandle(selectedValue);
        if (this.hasItems) {
          var items = this.model.get("items");
          if (this.curItemIndex >= 0 && this.curItemIndex < items.length) {
            this.model.set("selectedItem", items[this.curItemIndex]);
            this.model.set("selectedItemText", items[this.curItemIndex].Text || items[this.curItemIndex].Value);
          }
        }
      }
    },

    RoundNumber: function (num, dec) {
      return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    },

  });
});
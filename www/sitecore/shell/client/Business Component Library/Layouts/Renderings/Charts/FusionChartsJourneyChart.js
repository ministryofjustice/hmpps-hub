require.config({
  paths: {
    fusionChartBaseComponent: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/Shared/FusionChartsBaseComponent",
    fusionChartsJourneyChartCss: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/FusionChartsJourneyChart"
  }
});

define(["sitecore", "fusionChartBaseComponent", "css!fusionChartsJourneyChartCss"], function(_sc) {
  _sc.Factories.createBaseComponent({
    name: "FusionChartsJourneyChart",
    base: "FusionChartsBaseComponent",
    selector: ".sc-FusionChartsJourneyChart",
    segmentSelectionAction: {
      noAction: "NoAction",
      drillDown: "DrillDown",
      showDetails: "ShowDetails"
    },
    attributes: [
      { name: "data", defaultValue: null },
      { name: "chartProperties", defaultValue: null },
      { name: "dataRequestParameters", defaultValue: null },
      { name: "segmentSelectedAction", defaultValue: null, value: "$el.data:sc-segmentselectedaction" },
      { name: "isDurationButtonsPanelVisible", defaultValue: null, value: "$el.data:sc-isdurationbuttonspanelvisible" }
    ],

    durationButtonSortOrder: null,
    categoryDataField: null,
    defaultSelectedButton: null,
    buttons: null,
    
    eventName: {
      dataRequested: "dataRequested",
      segmentSelected: "segmentSelected"
    },

    journeyAction: {
      refreshData: "refreshData",
      prevDuration: "prevDuration",
      prevUnit: "prevUnit",
      nextDuration: "nextDuration",
      nextUnit: "nextUnit"
    },
    
    // <summary>
    // Initialize the component.    
    // </summary>    
    initialize: function() {
      this.app = this;
      this.allowsDeselection = true;
      this.buttons = {
          prevDuration:null,
          prevUnit:null,
          nextDuration:null,
          nextUnit:null,
          durationButtons: [],
          drillDown:null,
          drillUp: null,
          selectedSegment: null
      };
      
      this._super();
      this.initializeChart(false);
      this.initializeButtons();
      
      this.durationButtonSortOrder = this.$el.data("sc-durationbuttonssortorder");      
      
      if (this.model.get("isDurationButtonsPanelVisible") === "False") {
        this.$el.find(".sc-navigation-buttons").hide();
      }

      this.setDefaultDatarequrestParameters();      

      this.model.on("change:data", this.dataChanged, this);
    },
    
    // <summary>
    // Segment clicked event handler.    
    // </summary> 
    segmentClicked: function () {
      var selectedSegment = this.Charting.SelectedSegment;

      selectedSegment.action = this.model.get("segmentSelectedAction");

      if (selectedSegment.action === this.segmentSelectionAction.showDetails) {
        if (this.lastSelectedId === selectedSegment.id) {
          this.setSelectedChartColumn(selectedSegment, false, true);
          this.deselectSegment();
        } else {
          this.selectSegment();
        }
        
        this.setDrillButtonsVisibility(this.Charting.SelectedSegment);
      } else if (selectedSegment.action === this.segmentSelectionAction.drillDown) {
        if (this.canDrillDown(this.model.get("dataRequestParameters").unit)) {
          this.drillDown();
        }
      }
    },

    // <summary>
    // Initialize compoennt buttons.    
    // </summary>    
    initializeButtons: function () {
      var scope = this;

      this.buttons.prevDuration = this.$el.find(".sc-navigation-arrow.double.left");
      this.buttons.prevUnit = this.$el.find(".sc-navigation-arrow.single.left");
      this.buttons.nextDuration = this.$el.find(".sc-navigation-arrow.double.right");
      this.buttons.nextUnit = this.$el.find(".sc-navigation-arrow.single.right");
      this.buttons.durationButtons = this.$el.find(".sc-navigation-buttons .sc-togglebutton");
      this.buttons.drillDown = this.$el.find('[data-sc-id="' + this.$el.attr("data-sc-id") + 'DrillDownButton"]'),
      this.buttons.drillUp = this.$el.find('[data-sc-id="' + this.$el.attr("data-sc-id") + 'DrillUpButton"]'),
      this.buttons.selectedSegment = this.$el.find('[data-sc-id="' + this.$el.attr("data-sc-id") + 'SelectedSegmentButton"]');

      this.buttons.durationButtons.on("click", function () {
        scope.buttonClicked($(this));
      });

      this.buttons.prevDuration.on("click", function () {
        scope.doubleArrowClicked($(this), scope.journeyAction.prevDuration);
      });
      this.buttons.nextDuration.on("click", function () {
        scope.doubleArrowClicked($(this), scope.journeyAction.nextDuration);
      });

      this.buttons.prevUnit.on("click", function () {
        scope.arrowClicked($(this), scope.journeyAction.prevUnit);
      });

      this.buttons.nextUnit.on("click", function () {
        scope.arrowClicked($(this), scope.journeyAction.nextUnit);
      });
    },
    
    // <summary>
    // Set default DatarequrestParameters.    
    // </summary>    
    setDefaultDatarequrestParameters:function() {      
      this.defaultSelectedButton = this.buttons.durationButtons.filter('[data-isSelected="True"]');
      if (this.defaultSelectedButton.length === 0) {
        this.defaultSelectedButton = this.buttons.durationButtons.filter('[data-canDrillDown="1"]').first();
      }
      
      this.model.set("dataRequestParameters", {
        startDate: null,
        duration: this.defaultSelectedButton.attr("data-durationValue"),
        unit: this.defaultSelectedButton.attr("data-unitValue"),
        journeyAction: this.journeyAction.refreshData,
        unitStep: this.defaultSelectedButton.attr("data-unitStep")
      });
      
      this.setCurrentDurationButton(this.defaultSelectedButton.attr("data-durationValue"));
    },
          
    // <summary>
    // SelectSegment handler.    
    // </summary>    
    selectSegment: function () {
      var selectedSegment = this.Charting.SelectedSegment;
      this.setSelectedChartColumn(selectedSegment, false, false);
      this.lastSelectedId = selectedSegment.id;
      this.setVisibilityDetailsPanel(true);
      this.model.trigger(this.eventName.segmentSelected, selectedSegment);      
      this.setSelectedSegmentButton(true);
    },

    // <summary>
    // DeselectSegment handler.    
    // </summary>    
    deselectSegment: function() {
      
      if (this.model.get("segmentSelectedAction") === this.segmentSelectionAction.showDetails) {
        this.setVisibilityDetailsPanel(false);
        if (this.lastSelectedId) {
          this.model.trigger(this.eventName.segmentSelected, null);
        }
      }

      this.lastSelectedId = null;
      this.resetSelectedSegment();
      this.setSelectedSegmentButton(false);
    },

    // <summary>
    // Specify whether the duration button allows DrillDown.
    // <param name="duration">The current duration value.</param>
    // <returns>True if the current duration button can drill down</returns>
    // </summary>    
    canDrillDown: function(duration) {
      return this.getDurationButton(duration).attr('data-canDrillDown') === "1";
    },

    // <summary>
    // Specify wheter the duration button allows DrillUp.
    // <param name="duration">The current duration value.</param>
    // <returns>True if the current duration button can drill up</returns>
    // </summary>     
    canDrillUp: function(duration) {
      return this.getDurationButton(duration).attr('data-canDrillUp') === "1";
    },

    // <summary>
    // Shows the current SelectedSegment data page.    
    // </summary>    
    showSelectedSegmentPage: function() {
      this.model.set("dataRequestParameters", JSON.parse(JSON.stringify(this.model.get("selectedSegmentDataRequestParameters"))));
      this.triggerDataRequest(this.model.get("dataRequestParameters"));
    },

    // <summary>
    // Trigger the DataRequest event.
    // <param name="dataRequestParameters">The dataRequestParameters object.</param>
    // </summary>    
    triggerDataRequest: function (dataRequestParameters) {
      this.toggleProgressIndicator(true);
      this.model.trigger(this.eventName.dataRequested, dataRequestParameters);
    },

    // <summary>
    // Set the SelectedSegment button.
    // <param name="status">The status flag.
    // </summary>  
    setSelectedSegmentButton: function(status) {
      var selectedSegmentButton = this.buttons.selectedSegment;
      var drillDownButton = this.buttons.drillDown;
      selectedSegmentButton.toggle(status);
      if (this.Charting.SelectedSegment.dataObject) {
        selectedSegmentButton.attr("title", this.Charting.SelectedSegment.dataObject[this.categoryDataField]);
        drillDownButton.attr("title", this.Charting.SelectedSegment.dataObject[this.categoryDataField]);        
      }
      if (status) {
        this.model.set("selectedSegmentDataRequestParameters", JSON.parse(JSON.stringify(this.model.get("dataRequestParameters"))));
      } else {
        this.model.set("selectedSegmentDataRequestParameters", null);
      }
    },

    // <summary>
    // Set the drill buttons visibility.
    // <param name="selectedSegment">The current selectedSegment object.</param>
    // </summary>    
    setDrillButtonsVisibility: function(selectedSegment) {
      if (!this.canDrillDown(this.model.get("dataRequestParameters").unit) || !selectedSegment.dataObject) {
        this.buttons.drillDown.attr("disabled", "disabled");
      } else {
        this.buttons.drillDown.removeAttr("disabled");
      }

      if (this.canDrillUp(this.model.get("dataRequestParameters").duration)) {
        this.buttons.drillUp.removeAttr("disabled");
      } else {
        this.buttons.drillUp.attr("disabled", "disabled");
      }
    },

    // <summary>
    // Triggers the DrillDown event.
    // <param name="dataRequestParameters">The dataRequestParameters object.</param>
    // </summary>    
    triggerDrillDownEvent: function(dataRequestParameters) {

      dataRequestParameters.duration = this.getDurationButton(dataRequestParameters.duration).attr("data-unitValue");
      dataRequestParameters.unit = this.getDurationButton(dataRequestParameters.duration).attr("data-unitValue");

      if (this.Charting.SelectedSegment.dataObject) {
        dataRequestParameters.startDate = this.Charting.SelectedSegment.dataObject.date;
      } else {
        dataRequestParameters.startDate = null;
      }
        
      dataRequestParameters.journeyAction = this.journeyAction.refreshData;
      this.model.set("dataRequestParameters", dataRequestParameters);      
      this.triggerDataRequest(this.model.get("dataRequestParameters"));
    },

    // <summary>
    // The DrillDown event handler.    
    // </summary>    
    drillDown: function () {
      var segmentSelectedAction = this.model.get("segmentSelectedAction");
      
      if (segmentSelectedAction === this.segmentSelectionAction.drillDown || ( segmentSelectedAction === this.segmentSelectionAction.showDetails && !this.buttons.drillDown.attr("disabled"))) {
        var dataRequestParameters = this.model.get("dataRequestParameters");

        this.triggerDrillDownEvent(dataRequestParameters);
        this.setCurrentDurationButton(dataRequestParameters.duration);        
        this.deselectSegment();
      }
    },

    // <summary>
    // Triggers the DrillUp event.
    // <param name="dataRequestParameters">The dataRequestParameters object.</param>
    // </summary>    
    triggerDrillUpEvent: function (dataRequestParameters) {
      var previusDurationButton;
      if (this.durationButtonSortOrder === "asc") {
        previusDurationButton = this.getDurationButton(dataRequestParameters.duration).next();
      } else {
        previusDurationButton = this.getDurationButton(dataRequestParameters.duration).prev();
      }
      
      if (previusDurationButton) {
        dataRequestParameters.duration = previusDurationButton.attr("data-durationValue");
        dataRequestParameters.unit = previusDurationButton.attr("data-unitValue");
        dataRequestParameters.journeyAction = this.journeyAction.refreshData;
        this.model.set("dataRequestParameters", dataRequestParameters);        
        this.triggerDataRequest(this.model.get("dataRequestParameters"));
      }
    },

    // <summary>
    // The DrillUp event handler.    
    // </summary>    
    drillUp: function() {
      if (!this.buttons.drillUp.attr("disabled")) {
        var dataRequestParameters = this.model.get("dataRequestParameters");

        this.triggerDrillUpEvent(dataRequestParameters);
        this.setCurrentDurationButton(dataRequestParameters.duration);
        this.deselectSegment();
      }
    },

    // <summary>
    // .
    // <param name=""></param>
    // </summary>    
    setVisibilityDetailsPanel: function(status) {
      this.$el.next().toggle(status);
    },

    // <summary>
    // Get the chart selected data plot.
    // <param name="dataSetData">dataSetData</param>
    // <param name="dataIndex">dataIndex</param>
    // <returns>The selected data plot.</returns>
    // </summary>    
    getSelectedDataPlot: function(dataSetData, dataIndex) {
      return dataSetData[dataIndex];
    },

    // <summary>
    // Set selected chart column.
    // <param name="selectedSegment">The current chart selected segment.</param>
    // <param name="isPaging">The isPaging flag. If true sets the selectedSegment button.</param>
    // <param name="deselect">The deselect option. If true the button cahrt segment should be deselected.</param>
    // </summary>    
    setSelectedChartColumn: function(selectedSegment, isPaging, deselect) {
      if (!selectedSegment.dataObject || this.model.get("segmentSelectedAction") === this.segmentSelectionAction.drillDown) {
        return;
      }

      var chartControl = this.model.get("chartControls")[0],
        chartControlJsonData = chartControl.getChartData("json"),
        chartControlData = chartControlJsonData.data,
        chartControlDataLength = chartControlData.length,
        i,
        selectedSegmentIndex = -1;

      if (!deselect) {
        for (i = 0; i < chartControlDataLength; i++) {
          var currentChartData = chartControlData[i],
            label = currentChartData["label"];

          // Removes the color from currentData
          delete currentChartData["color"];

          if (isPaging) {
            if (label === selectedSegment.dataObject[this.categoryDataField]) {
              selectedSegmentIndex = i;
            }
          }
        }

        if (!isPaging) {
          selectedSegmentIndex = selectedSegment.dataIndex;
        }

        if (selectedSegmentIndex >= 0) {
          chartControlData[selectedSegmentIndex].color = this.colorLuminosity(chartControlJsonData.chart.palettecolors, -0.5);
        }
      } else {
        delete chartControlData[selectedSegment.dataIndex]["color"];
      }

      chartControl.setJSONData(chartControlJsonData);
      chartControl.render();
    },

    // <summary>
    // Get selected duration button.
    // <param name="duration">The current duration</param>
    // <returns>The button with the given duration.</returns>
    // </summary>    
    getDurationButton: function(duration) {
      return this.buttons.durationButtons.filter('[data-durationvalue="' + duration + '"]');
    },

    // <summary>
    // Set curernt duration button.
    // <param name="duration">The current duration</param>    
    // </summary>    
    setCurrentDurationButton: function(duration) {
      this.removeCurrentButtonSelection();
      this.getDurationButton(duration).addClass("up");
    },

    // <summary>
    // Remove current button selection.    
    // </summary> 
    removeCurrentButtonSelection: function () {
      this.buttons.durationButtons.filter(".up").removeClass("up");
    },

    // <summary>
    // Data changed event handler.    
    // </summary>    
    dataChanged: function () {
      var data = this.model.get("data");
      if (data) {
        this.categoryDataField = this.model.get("chartProperties").dataMapping.categoryChartField.dataField;
        var drp = this.model.get("dataRequestParameters");
        drp.startDate = data.startDate;
        this.model.set("dataRequestParameters", drp);
        this.enableArrows(data.hasMoreFutureData, data.hasMorePastData);
        this.setDrillButtonsVisibility(this.Charting.SelectedSegment);
        this.$el.find(".sc-currentTimeRangeTitle ").html(data.header);
        this.setSelectedChartColumn(this.Charting.SelectedSegment, true, false);
        this.setArrowsTitle(this.model.get("dataRequestParameters").duration);
      }
    },

    // <summary>
    // Button clicked event handler.
    // <param name="button">The button triggering the click event.</param>
    // </summary>    
    buttonClicked: function(button) {
      if (!button.hasClass("up")) {
        this.removeCurrentButtonSelection();
        button.addClass("up");
        var durationValue = button.attr("data-durationValue");
        var unitValue = button.attr("data-unitValue");
        var unitStep = button.attr("data-unitStep");
        var drp = this.model.get("dataRequestParameters");
        drp.duration = durationValue;
        drp.unit = unitValue;
        drp.unitStep = unitStep;
        drp.journeyAction = this.journeyAction.refreshData;
        this.model.set("dataRequestParameters", drp);        
        this.triggerDataRequest(this.model.get("dataRequestParameters"));
        this.setVisibilityDetailsPanel(false);
        this.deselectSegment();
      }
    },

    // <summary>
    // Double Arrow Clicked event handler.
    // <param name="button">The button triggering the click event.</param>
    // </summary>    
    doubleArrowClicked: function(button, eventName) {
      if (button.hasClass("disabled")) {
        return;
      }

      //var value = button.attr("data-value");
      var drp = this.model.get("dataRequestParameters");
      drp.journeyAction = eventName;
      this.model.set("dataRequestParameters", drp);      
      this.triggerDataRequest(this.model.get("dataRequestParameters"));
    },

    // <summary>
    // Single Arrow Clicked event handler.
    // <param name="button">The button triggering the click event.</param>
    // </summary>    
    arrowClicked: function (button, eventName) {
      if (button.hasClass("disabled")) {
        return;
      }

     // var value = button.attr("data-value");
      var drp = this.model.get("dataRequestParameters");
      drp.journeyAction = eventName;
      this.model.set("dataRequestParameters", drp);      
      this.triggerDataRequest(this.model.get("dataRequestParameters"));
    },

    // <summary>
    // Set chart attributes.
    // <param name="data">The data.</param>
    // <param name="useStandardColors">The useStandardColors flag.</param>
    // <param name="chartControl">The FusionChart control.</param>
    // </summary>    
    setChartAttributes: function(data, useStandardColors, chartControl) {
      "use strict";
      this.setDefaultChartAttributes(data, useStandardColors, chartControl);

      chartControl.setChartAttribute({
        "plotSpacePercent": 10,
        "divLineAlpha": 0,
        "alternateHGridAlpha": 0,
        "xAxisName": "",
        "yAxisName": "",
        "showLabels": 1,
        "slantLabels": 1,
        "numDivlines": 0,
        "labeldisplay": "AUTO",
        "canvaspadding": "50",
        "animation": "0",
        "duration": "5",
        "canvasBottomMargin": 40
      });
    },

    // <summary>
    // Set chart arrows button title.
    // <param name="duration">The current duration.</param>
    // </summary>    
    setArrowsTitle: function(duration) {
      var scope = this,
        databaseUri = new _sc.Definitions.Data.DatabaseUri("core"),
        database = new _sc.Definitions.Data.Database(databaseUri),
        durationButton = this.getDurationButton(duration),
        durationString = durationButton.text().toLowerCase(),
        unit = durationButton.attr("data-unitValue"),
        unitButton = this.getDurationButton(unit),
        unitStep = durationButton.attr("data-unitStep"),
        unitString = unitStep ? unitStep + " " + unitButton.text().toLowerCase() : unitButton.text().toLowerCase();

      database.getItem("{959C27CC-469D-4B48-8D8D-ACCF5FFD77AF}", function(item) {
        scope.buttons.prevUnit.attr("title", item.Text + " " + unitString);
        scope.buttons.prevDuration.attr("title", item.Text + " " + durationString);
      });

      database.getItem("{400DD777-3C5F-492A-89F3-41B80C5CC3E3}", function(item) {
        scope.buttons.nextUnit.attr("title", item.Text + " " + unitString);
        scope.buttons.nextDuration.attr("title", item.Text + " " + durationString);
      });
    },

    // <summary>
    // Enable chart arrows.
    // <param name="hasMoreFutureData">The hasMoreFutureData data value.</param>
    // <param name="hasMorePastData">The hasMorePastData data value</param>
    // </summary>    
    enableArrows: function(hasMoreFutureData, hasMorePastData) {
      this.buttons.nextUnit.toggleClass("disabled", !hasMoreFutureData);
      this.buttons.nextDuration.toggleClass("disabled", !hasMoreFutureData);

      this.buttons.prevDuration.toggleClass("disabled", !hasMorePastData);
      this.buttons.prevUnit.toggleClass("disabled", !hasMorePastData);
    },

    // <summary>
    // Get chart component name.
    // <param name="chartProperties">The chartProperties object.</param>
    // <returns>The FusionChart component name.</returns>
    // </summary>    
    getChartComponentName: function(chartProperties) {

      // force chartProperties for Journey chart (No Series, No Scroll, No Stacking)
      chartProperties.appearance.stackSeries = false;
      chartProperties.appearance.visibleCategoriesRange = 0;      
      chartProperties.seriesChartField = null,
      chartProperties.seriesFilter = null,
      chartProperties.dataType = "SingleSeries";

      return "Column2D";
    }
  });
});
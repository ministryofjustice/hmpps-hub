require.config({
  baseUrl: "/",
  paths: {
    moment: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/moment/moment.min"
  }
});

define(["sitecore", "moment"], function (sc) {
  var app = sc.Definitions.App.extend({

    initialized: function () {
      this.offset = 0;
      this.months = 1;
      this.timeUnitArray = [];
      this.initializeMode();
      this.initializeUI();
      this.initializeListeners();
      this.initializeTestOutcomesDataSources();
      
      if (this.UserComboBox) {
        this.UserComboBox.viewModel.setTestingOptions({ texts: this.Texts });
      }
    },

    initializeMode: function () {
      if (this.ModeKey) {
        //Admin
        this.UserComboBox.set("isVisible", true);
      } else {
        this.UsersIndicatorLabel.set("text", "");
        this.UserComboBox.viewModel.$el.hide();
      }
    },

    initializeListeners: function () {
      for (var i = 0 ; i < 6; i++) {
        this["TestOutcomesDataSource" + i].on("change:isBusy", this.constructPeriodData, this);
      }
      this.on("setview", this.changeTimeResolution, this);
      this.UserComboBox.on("change:selectedItem", this.constructGraph, this);
      this.LineChart.viewModel.toggleProgressIndicator(true);
    },

    changeTimeResolution: function (e) {
      switch (e.periodType) {
        case "month":
          this.months = 1;
          break;
        case "quarter":
          this.months = 3;
          break;
        case "halfyear":
          this.months = 6;
          break;
        case "year":
          this.months = 12;
          break;
      }
      this.offset = 0;
      this.periodChange(0);
    },

    getDataPoint: function (channel, date, obj, average) {
      var value = obj ? obj[channel] : 0;
      return { channel: average ? "Average " + channel : channel, value: value, date: date };
    },

    filterByKPI: function (e) {
      var filter = e.currentTarget.defaultValue;
      var chartProperties = this.LineChart.get("chartProperties");
      if (filter === "All") {
        filter = "{Score;Guess;Effect;Activity}";
      } else {
        filter = "{" + filter + ";Average " + filter + "}";
      }
      chartProperties.dataMapping.seriesFilter = filter;
      this.LineChart.set("chartProperties", chartProperties);
      this.LineChart.trigger("change:data");
    },

    constructGraph: function () {
      if (!this.UserComboBox.get("selectedItem")) {
        this.ProgressIndicator.set("isBusy", false);
        return;
      }
      var user = this.UserComboBox.get("selectedItem").user;
      var chartData = { "localization": { "fields": [{ "field": "channel" }] }, "dataset": [{ "data": [] }] };
      for (var i = 0; i < 6; i++) {
        var date = this.timeUnitArray[i].date;
        var userData = this.timeUnitArray[i].filter(function (userData) {
          return userData.User === user;
        })[0];

        chartData.dataset[0].data.unshift(this.getDataPoint("Score", date, userData, false));
        chartData.dataset[0].data.unshift(this.getDataPoint("Guess", date, userData, false));
        chartData.dataset[0].data.unshift(this.getDataPoint("Effect", date, userData, false));
        chartData.dataset[0].data.unshift(this.getDataPoint("Activity", date, userData, false));

        if (user !== "Average") {
          var averageData = this.timeUnitArray[i].filter(function (averageData) {
            return averageData.User === "Average";
          })[0];
          chartData.dataset[0].data.unshift(this.getDataPoint("Score", date, averageData, true));
          chartData.dataset[0].data.unshift(this.getDataPoint("Guess", date, averageData, true));
          chartData.dataset[0].data.unshift(this.getDataPoint("Effect", date, averageData, true));
          chartData.dataset[0].data.unshift(this.getDataPoint("Activity", date, averageData, true));
        }
      }
      this.LineChart.set("data", chartData);
      this.ProgressIndicator.set("isBusy", false);
    },

    periodChange: function (change) {
      this.ProgressIndicator.set("isBusy", true);
      this.offset += change;
      this.timeUnitArray = []; //Todo -  only get required new 
      this.initializeTestOutcomesDataSources();
    },

    initializeTestOutcomesDataSources: function () {
      for (var i = 0 ; i < 6; i++) {
        var TestOutcomesDataSource = this["TestOutcomesDataSource" + i];
        TestOutcomesDataSource.componentIndex = i;
        TestOutcomesDataSource.set("invalidated", true);
        TestOutcomesDataSource.set("end", "");
        TestOutcomesDataSource.set("start", moment().startOf('month').subtract((i + this.offset) * this.months, 'months').format('YYYY-MM-DD'));
        TestOutcomesDataSource.set("end", moment().startOf('month').subtract((i + this.offset - 1) * this.months, 'months').subtract(1, 'days').format('YYYY-MM-DD'));
        TestOutcomesDataSource.set("invalidated", false);
      }
    },

    constructPeriodData: function (e) {
      if (e.get("isBusy")) {
        return;
      }
      var index = e.componentIndex;
      this.timeUnitArray[index] = e.attributes.items || [];
      this.timeUnitArray[index].date = moment(e.get("start")).format("MMMM YYYY");
      for (var i = 0; i < 6; i++) {
        if (!this.timeUnitArray[i]) {
          return;
        }
      }
      this.populateWithUsers();
    },

    populateWithUsers: function () {
      var uniqueUserFilter = {},
        users = [];
      if (this.ModeKey) {
        for (var p = 0; p < 6; p++) {
          var userCount = this.timeUnitArray[p].length;
          for (var u = 0; u < userCount; u++) {
            var user = this.timeUnitArray[p][u].User;
            if (!uniqueUserFilter[user]) {
              uniqueUserFilter[user] = true;
              users.push({ user: user, itemId: user, name:user });
            }
          }
        }
      } else {
        var user = { user: "You", itemId: "You", name: "You" };
        users.push(user);
        this.UserComboBox.set("selectedItem", user)
      }

      if (users.length === 0) {
        this.LineChart.set("data", { "dataset": [{ "data": [] }] });
        this.ProgressIndicator.set("isBusy", false);
        return;
      }

      var selectedUser = this.UserComboBox.get("selectedItem");

      if (!selectedUser) {
        selectedUser = { user: user, itemId: user, name: user };
      }

      this.UserComboBox.set("items", users);

      // if the current value and new value are the same no change event will fire
      if(this.UserComboBox.get("selectedItem") && this.UserComboBox.get("selectedItem").itemId == selectedUser.itemId){
        this.constructGraph();
      }
      else {
        this.UserComboBox.set("selectedItem",  selectedUser)
      }
    },

    initializeUI: function () {
      this.RadioAll.viewModel.$el.find(".sc-radiobutton-input").prop("checked", true);
      $(".sc-radiobutton-input").click($.proxy(this.filterByKPI, this));
    }
  });

  return app;
});
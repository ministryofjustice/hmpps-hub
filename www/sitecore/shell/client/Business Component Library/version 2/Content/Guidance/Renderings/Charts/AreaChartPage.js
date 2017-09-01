(function (speak) {

    speak.pageCode([], function () {
        var categories = [];
        var dateCategories = [];
        var numberOfXpoints = 7;
        var numberOfSeries = 3;
        var yRange = 20000;
        var onlyPositiveValues = true;

        function getRandomNumber() {
            var plusOrMinus = onlyPositiveValues ? 1 : Math.random() < 0.5 ? -1 : 1;
            return Math.round((Math.random() * yRange * plusOrMinus) + 1, 4);
        }

        function data(seriesNumber, usingDates) {
            return teamWaves(seriesNumber, numberOfXpoints, usingDates).map(function (data, i) {
                return {
                    key: 'Team' + i,
                    values: data
                };
            });
        }

        function intItem(d, i) {
            return { x: categories[i], y: d };
        }

        function dateItem(d, i) {
            return { date: dateCategories[i], visits: d };
        }

        /* Layer generator using gamma distributions. */
        function teamWaves(n, m, usingDates) {
            return d3.range(n).map(function (i) {
                return d3.range(numberOfXpoints).map(function (j) {
                    return getRandomNumber();
                }).map(usingDates ? dateItem : intItem);
            });
        }

        return {
          showPanel:function() {
            this.Border192.IsVisible = true;
          },
          hidePanel: function () {
            this.Border192.IsVisible = false;
          },
          refreshChart: function () {
            this.AreaChart191.refresh();
          },
          setData: function () {
              this.setYRange();                
              categories = this.setCategories();
              dateCategories = this.setDateCategories();
              var dDates = data(numberOfSeries, true);
              var d = data(numberOfSeries, false);

              this.AreaChart171.DynamicData = dDates;
              this.AreaChart174.DynamicData = dDates;
              this.AreaChart176.DynamicData = dDates;
              this.AreaChart177.DynamicData = dDates;
              this.AreaChart160.DynamicData = dDates;
              this.AreaChart162.DynamicData = dDates;
              this.AreaChart180.DynamicData = dDates;
              this.AreaChart141.DynamicData = d;
              this.AreaChart142.DynamicData = d;
              this.AreaChart2.DynamicData = d;
              this.AreaChart3.DynamicData = data(1);                
              this.AreaChart6.DynamicData = d;
              this.AreaChart7.DynamicData = d;
              this.AreaChart72.DynamicData = d;
              this.AreaChart8.DynamicData = d;
              this.AreaChart9.DynamicData = dDates;
              this.AreaChart91.DynamicData = dDates;
              this.AreaChart10.DynamicData = d;
              this.AreaChart121.DynamicData = d;
              this.AreaChart122.DynamicData = d;
              this.AreaChart13.DynamicData = d;
              this.AreaChart191.DynamicData = d;                                          
          },

          setYRange: function () {
              var value = this.Form1.MaxYValue.Value;
              if (value === "") {
                  value = 20000;
                  this.Form1.MaxYValue.Value = 20000;
              }

              yRange = value;
          },

          setCategories: function () {
              var categories = [];                

              for (var i = 0; i < numberOfXpoints; i++) {                    
                  categories.push(i + 1);                    
              }

              return categories;
          },

          setDateCategories: function () {
              var categories = [];                
              for (var i = 0; i < numberOfXpoints; i++) {                    
                  categories.push(new Date(2000 + i, 1, 10, i % 12, i % 60, i % 60, 1));
              }

              return categories;
          },

          initialized: function () {
              this.Form1.MaxYValue.Value = 2000;
              this.setData();

              this.AreaChart171.on("ItemSelected", function (selectedItem) {
                console.log(selectedItem);
              });
          }
        };
    }, "SubAppRenderer");
})(Sitecore.Speak);
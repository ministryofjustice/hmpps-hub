(function (speak) {

    speak.pageCode([], function () {
        var useDates = false;
        var categories = [];
        var dateCategories = [];
        var numberOfXpoints = 7;
        var yRange = 20000;
        var onlyPositiveValues = false;

        function getRandomNumber() {
            var plusOrMinus = onlyPositiveValues ? 1 : Math.random() < 0.5 ? -1 : 1;
            return (Math.random() * yRange * plusOrMinus) + 1;
        }

        function data(seriesNumber, usingDates) {
            useDates = usingDates;
            return teamWaves(seriesNumber, numberOfXpoints, usingDates).map(function (data, i) {
                return {
                    key: 'Team' + i,
                    values: data
                };
            });
        }

        function teamWaves(n, m, usingDates) {
            return d3.range(n).map(function (i) {
                return d3.range(numberOfXpoints).map(function (j) {
                    return getRandomNumber();
                }).map(usingDates ? dateItem : intItem);
            });
        }
        function intItem(d, i) {
            return { x: categories[i], y: d };
        }

        function dateItem(d, i) {
            return { date: dateCategories[i], visits: d };
        }

        return {
            setData: function () {
                useDates = false;
                this.setNumberOfXPoints();
                this.setYRange();
                this.setOnlyPositiveValues();
                categories = this.setCategories();
                dateCategories = this.setDateCategories();
                var dDates = data(3, true);
                var d = data(this.Form1.SeriesNumber.Value, false);
                this.BarChart171.DynamicData = dDates;
                this.BarChart174.DynamicData = dDates;
                this.BarChart176.DynamicData = dDates;
                this.BarChart160.DynamicData = dDates;
                this.BarChart161.DynamicData = dDates;                
                this.BarChart151.DynamicData = d;
                this.BarChart152.DynamicData = d;
                this.BarChart153.DynamicData = d;
                this.BarChart0.DynamicData = d;
                this.BarChart1.DynamicData = d;
                this.BarChart2.DynamicData = d;
                this.BarChart3.DynamicData = data(1);
                this.BarChart6.DynamicData = d;
                this.BarChart7.DynamicData = d;
                this.BarChart72.DynamicData = d;
                this.BarChart8.DynamicData = d;
                this.BarChart9.DynamicData = dDates;
                this.BarChart91.DynamicData = dDates;
                this.BarChart10.DynamicData = d;
                this.BarChart11.DynamicData = d;
                this.BarChart12.DynamicData = d;
                this.BarChart13.DynamicData = data(1);
                this.BarChart14.DynamicData = d;            
            },

            setYRange: function () {
                var value = this.Form1.MaxYValue.Value;
                if (value === "") {
                    value = 20;
                    this.Form1.MaxYValue.Value = 20000;
                }

                yRange = value;
            },

            setNumberOfXPoints: function () {
                var value = this.Form1.CategoriesNumber.Value;
                if (value === "") {
                    value = 7;
                    this.Form1.CategoriesNumber.Value = 7;
                }

                numberOfXpoints = value;
            },

            setOnlyPositiveValues: function () {
                onlyPositiveValues = this.Form1.PositiveValues.IsChecked;
            },

            setCategories: function () {
                var categories = [];

                for (var i = 0; i < numberOfXpoints; i++) {
                    categories.push("Social Marketer " +(i + 1));
                }

                return categories;
            },

            setDateCategories: function () {
                var categories = [];
                for (var i = 0; i < numberOfXpoints; i++) {
                    categories.push(new Date(2000 + i, 1, 10));
                }

                return categories;
            },

            initialized: function () {
              this.setData();
              this.BarChart171.on("ItemSelected", function (selectedItem) {
                console.log(selectedItem);
              });
            }
        };
    }, "SubAppRenderer");
})(Sitecore.Speak);              
                

(function (speak) {

    speak.pageCode([], function () {
        var useDates = false;
        var categories = [];
        var dateCategories = [];
        var numberOfXpoints = 7;
        var yRange = 20;
        var onlyPositiveValues = false;

        function getRandomNumber() {
            var plusOrMinus = onlyPositiveValues ? 1 : Math.random() < 0.5 ? -1 : 1;
            return Math.floor((Math.random() * yRange * plusOrMinus) + 1);
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
                var dDates = data(this.Form1.SeriesNumber.Value, true);
                var d = data(this.Form1.SeriesNumber.Value, false);
                this.LineChart171.DynamicData = dDates;
                this.LineChart174.DynamicData = dDates;
                this.LineChart176.DynamicData = dDates;
                this.LineChart160.DynamicData = dDates;
                this.LineChart161.DynamicData = dDates;
                this.LineChart141.DynamicData = d;
                this.LineChart142.DynamicData = d;
                this.LineChart2.DynamicData = d;
                this.LineChart3.DynamicData = data(1);
                this.LineChart6.DynamicData = d;
                this.LineChart7.DynamicData = d;
                this.LineChart72.DynamicData = d;
                this.LineChart8.DynamicData = d;
                this.LineChart9.DynamicData = dDates;
                this.LineChart91.DynamicData = dDates;
                this.LineChart10.DynamicData = d;
                this.LineChart11.DynamicData = d;
                this.LineChart12.DynamicData = d;               
            },

            setYRange: function () {
                var value = this.Form1.MaxYValue.Value;
                if (value === "") {
                    value = 20;
                    this.Form1.MaxYValue.Value = 20;
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
                    categories.push(i + 1);
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
              this.LineChart171.on("ItemSelected", function (selectedItem) {
                console.log(selectedItem);
              });
            }
        };
    }, "SubAppRenderer");
})(Sitecore.Speak);
                
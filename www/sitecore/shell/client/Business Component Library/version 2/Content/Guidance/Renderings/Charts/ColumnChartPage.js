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
                this.ColumnChart171.DynamicData = dDates;
                this.ColumnChart174.DynamicData = dDates;
                this.ColumnChart176.DynamicData = dDates;
                this.ColumnChart160.DynamicData = dDates;
                this.ColumnChart161.DynamicData = dDates;
                this.ColumnChart151.DynamicData = d;
                this.ColumnChart152.DynamicData = d;
                this.ColumnChart153.DynamicData = d;
                this.ColumnChart2.DynamicData = d;
                this.ColumnChart3.DynamicData = data(1);
                this.ColumnChart0.DynamicData = d;
                this.ColumnChart1.DynamicData = d;
                this.ColumnChart4.DynamicData = d;
                this.ColumnChart5.DynamicData = d;
                this.ColumnChart6.DynamicData = d;
                this.ColumnChart7.DynamicData = d;
                this.ColumnChart72.DynamicData = d;
                this.ColumnChart8.DynamicData = d;
                this.ColumnChart9.DynamicData = dDates;
                this.ColumnChart91.DynamicData = dDates;
                this.ColumnChart10.DynamicData = d;
                this.ColumnChart11.DynamicData = d;
                this.ColumnChart12.DynamicData = data(1);
                this.ColumnChart13.DynamicData = d;                             
            },

            setYRange: function () {
                var value = this.Form1.MaxYValue.Value;
                if (value === "") {
                    value = 20000;
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
              this.ColumnChart171.on("ItemSelected", function (selectedItem) {
                console.log(selectedItem);
              });
            }
        };
    }, "SubAppRenderer");
})(Sitecore.Speak);              
                




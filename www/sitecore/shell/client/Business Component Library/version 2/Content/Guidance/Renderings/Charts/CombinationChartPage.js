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
            return Math.floor((Math.random() * yRange * plusOrMinus) + 1);
        }

        function data(linesNumber, usingDates) {
            useDates = usingDates;
            
            var lines = teamWaves2(linesNumber, numberOfXpoints, usingDates).map(function (data, i) {
                return {
                    key: 'Line' + (i +1),
                    values: data
                };
            });            

            var bars = teamWaves(1, numberOfXpoints, usingDates).map(function (data, i) {
                return {
                    key: 'Bar' + (i +1),
                    bar: true,
                    values: data
                };
            });

            return bars.concat(lines);
        }
       
        /* Layer generator using gamma distributions. */
        function teamWaves(n, m, usingDates) {
            return d3.range(n).map(function (i) {
                return d3.range(numberOfXpoints).map(function (j) {
                    return getRandomNumber();
                }).map(usingDates ? dateItem : intItem);
            });
        }

        /* Layer generator using gamma distributions. */
        function teamWaves2(n, m, usingDates) {
            return d3.range(n).map(function (i) {
                return d3.range(numberOfXpoints).map(function (j) {
                    return getRandomNumber() * 100;
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
                /// <summary>
                /// s this instance.
                /// </summary>
                /// <returns></returns>
                useDates = false;
                this.setNumberOfXPoints();
                this.setYRange();
                this.setOnlyPositiveValues();
                categories = this.setCategories();
                dateCategories = this.setDateCategories();
                var dDates = data(2, true);
                var d = data(this.Form1.LinesNumber.Value, false);
                this.CombinationChart160.DynamicData = dDates;
                this.CombinationChart161.DynamicData = dDates;
                this.CombinationChart170.DynamicData = dDates;
                this.CombinationChart151.DynamicData = d;
                this.CombinationChart152.DynamicData = d;
                this.CombinationChart2.DynamicData = d;
                this.CombinationChart6.DynamicData = d;
                this.CombinationChart7.DynamicData = d;
                this.CombinationChart72.DynamicData = d;
                this.CombinationChart8.DynamicData = d;
                this.CombinationChart9.DynamicData = dDates;
                this.CombinationChart91.DynamicData = dDates;
                this.CombinationChart10.DynamicData = d;
                this.CombinationChart13.DynamicData = d;

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

            setDateCategories2: function () {
                var categories = [];
                var startDate = new Date(2000, 1, 10);
                var currentDate = new Date(2000, 1, 10);

                for (var i = 0; i < numberOfXpoints; i++) {
                    categories.push(currentDate.setFullYear(startDate.getFullYear() + i));
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
              this.CombinationChart160.on("ItemSelected", function (selectedItem) {
                console.log(selectedItem);
              });
            }
        };
    }, "SubAppRenderer");
})(Sitecore.Speak);





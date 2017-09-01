(function (speak) {

    speak.pageCode([], function () {
        var useDates = false;
        var categories = [];
        var numberOfXpoints = 7;
        var yRange = 20;
        var onlyPositiveValues = false;

        function getRandomNumber() {
            var plusOrMinus = onlyPositiveValues ? 1 : Math.random() < 0.5 ? -1 : 1;
            return Math.floor((Math.random() * yRange * plusOrMinus) + 1);
        }

        function data(usingDates) {
            useDates = usingDates;
            return teamWaves(1, numberOfXpoints, .1).map(function (data, i) {
                return {
                    key: 'Team' + i,
                    values: data
                };
            });
        }

        /* Layer generator using gamma distributions. */
        function teamWaves(n, m) {
            return d3.range(n).map(function (i) {
                return d3.range(numberOfXpoints).map(function (j) {
                    return getRandomNumber();
                }).map(teamIndex);
            });
        }

        function teamIndex(d, i) {
            return { x: categories[i], y: d, trafficType: categories[i], visits: d };
        }

        return {

            setData: function () {
                useDates = false;
                this.setNumberOfXPoints();
                this.setYRange();
                this.setOnlyPositiveValues();
                categories = this.setCategories();
                var d = data();
              
                this.DoughnutChart262.DynamicData = d;
                this.DoughnutChart271.DynamicData = d;
                this.DoughnutChart191.DynamicData = d;
                this.DoughnutChart192.DynamicData = d;
                this.DoughnutChart193.DynamicData = d;
                this.DoughnutChart181.DynamicData = d;
                this.DoughnutChart182.DynamicData = d;
                this.DoughnutChart183.DynamicData = d;
                this.DoughnutChart151.DynamicData = d;
                this.DoughnutChart152.DynamicData = d;               
                this.DoughnutChart2.DynamicData = d;
                this.DoughnutChart6.DynamicData = d;
                this.DoughnutChart8.DynamicData = d;
                this.DoughnutChart160.DynamicData = d;
                this.DoughnutChart170.DynamicData = d;
                this.DoughnutChart201.DynamicData = d;
                this.DoughnutChart202.DynamicData = d;
                this.DoughnutChart211.DynamicData = d;
                this.DoughnutChart212.DynamicData = d;
                this.DoughnutChart221.DynamicData = d;
                this.DoughnutChart231.DynamicData = d;
                
            },

            setYRange: function () {
                var value = this.Form1.MaxYValue.Value;
                if (value === "") {
                    value = 20;
                    this.Form1.MaxYValue.Value = 20;
                }

                yRange = value;
            },

            setOnlyPositiveValues: function () {
                onlyPositiveValues = true;
            },

            setNumberOfXPoints: function () {
                var value = this.Form1.CategoriesNumber.Value;
                if (value === "") {
                    value = 7;
                    this.Form1.CategoriesNumber.Value = 7;
                }

                numberOfXpoints = value;

              numberOfXpoints = 2;
            },

            setCategories: function () {
                var categories = [];
                var startDate = new Date(2000, 1, 10);
                var trafficTypes = [
                    "Search Engine",
                    "Search Engine - Organic",
                    "Organic Branded",
                    "Paid",
                    "Email",
                    "Direct",
                    "Campaign",
                    "Referred Blog",
                    "Referred News",
                    "Referred Conversations",
                    "Referred Community",
                    "Referred Wiki",
                    "Referred Analyst",
                    "Custom taffic type"
                ];

                for (var i = 0; i < numberOfXpoints; i++) {
                    if (useDates) {
                        categories.push(startDate.setFullYear(startDate.getFullYear() + i));
                    } else {
                        categories.push(trafficTypes[i % 13]);
                    }
                }

                return categories;
            },

            initialized: function () {
              this.setData();
              this.DoughnutChart262.on("ItemSelected", function (selectedItem) {
                console.log(selectedItem);
              });
            }
        };
    }, "SubAppRenderer");
})(Sitecore.Speak);

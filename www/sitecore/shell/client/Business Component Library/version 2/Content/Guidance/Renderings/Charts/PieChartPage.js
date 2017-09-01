(function (speak) {

    speak.pageCode([], function () {
        var categories = [];
        var numberOfXpoints = 7;
        var yRange = 20000;
        var onlyPositiveValues = false;

        function getRandomNumber() {
            var plusOrMinus = onlyPositiveValues ? 1 : Math.random() < 0.5 ? -1 : 1;
            return Math.round((Math.random() * yRange * plusOrMinus) , 3);
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
                this.setNumberOfXPoints();
                this.setYRange();
                this.setOnlyPositiveValues();
                categories = this.setCategories();
                var d = data();                
                this.PieChart262.DynamicData = d;
                this.PieChart271.DynamicData = d;
                this.PieChart151.DynamicData = d;
                this.PieChart152.DynamicData = d;
                this.PieChart2.DynamicData = d;
                this.PieChart6.DynamicData = d;
                this.PieChart8.DynamicData = d;                             
                this.PieChart11.DynamicData = d;               
                this.PieChart160.DynamicData = d;
                this.PieChart170.DynamicData = d;
                this.PieChart211.DynamicData = d;
                this.PieChart212.DynamicData = d;
                this.PieChart221.DynamicData = d;                
            },

            setYRange: function () {
                var value = this.Form1.MaxYValue.Value;
                if (value === "") {
                    value = 20000;
                    this.Form1.MaxYValue.Value = 20000;
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
            },

            setCategories: function () {
                var categories = [];
           
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
                    categories.push(trafficTypes[i % 13]);                    
                }

                return categories;
            },

            initialized: function () {
              this.setData();
              this.PieChart262.on("ItemSelected", function (selectedItem) {
                console.log(selectedItem);
              });
            }
        };
    }, "SubAppRenderer");
})(Sitecore.Speak);
                
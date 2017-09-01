(function (speak) {
  speak.pageCode([], function () {
    return {
      initialized: function () {
        var data = {
          "dataset": [
			    {
			      "data": [
			        {
			          name: "Visits",
			          value: 100
			        },
              {
                name: "Visits",
                value: 50
              },
              {
                name: "Visits",
                value: 10
              }
			      ]
			    }
          ]          
        };

        this.ValueLabel11.DynamicData = data;
        this.ValueLabel12.DynamicData = data;
        this.ValueLabel13.DynamicData = data;
        this.ValueLabel14.DynamicData = data;
        this.ValueLabel15.DynamicData = data;
        this.ValueLabel16.DynamicData = data;
        this.ValueLabel17.DynamicData = data;

        this.ValueLabel20.DynamicData = data;
        this.ValueLabel21.DynamicData = data;
        this.ValueLabel22.DynamicData = data;

        this.ValueLabel30.DynamicData = data;
        this.ValueLabel31.DynamicData = data;
        this.ValueLabel32.DynamicData = data;
        this.ValueLabel33.DynamicData = data;
        this.ValueLabel34.DynamicData = data;

        this.ValueLabel40.DynamicData = data;
        this.ValueLabel41.DynamicData = data;
        this.ValueLabel42.DynamicData = data;
        this.ValueLabel43.DynamicData = data;
        this.ValueLabel44.DynamicData = data;

        this.ValueLabel50.DynamicData = data;
      }
    };
}, "SubAppRenderer");
})(Sitecore.Speak);
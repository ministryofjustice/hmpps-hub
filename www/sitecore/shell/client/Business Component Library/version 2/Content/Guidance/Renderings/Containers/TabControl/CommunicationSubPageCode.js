(function (speak) {
  speak.pageCode([], function () {
    var subapp1;
    return {
      initialized: function () {
        
        var app = this;
        app.Log.el.innerHTML += "<br/>";

        this.SubTabControl.on("loaded", function (subApp) {
          app.Log.el.innerHTML += "event - <b> loaded</b>, subApp passed - " + subApp.key + " <br/>";
        });

        this.SubTabControl.on("loaded:SubTab1", function (subApp1) {
          app.Log.el.innerHTML += "event - <b> loaded:SubTab1</b>, subApp passed - " + subApp1.key + " <br/>";
          subapp1 = subApp1;
        });
        this.SubTabControl.on("loaded:SubTab2", function (subApp2) {
          app.Log.el.innerHTML += "event - <b> loaded:SubTab2</b>, subApp passed - " + subApp2.key + " <br/>";
        });

        this.SubTabControl.on("loaded:SubTab3", function (subApp3) {
          app.Log.el.innerHTML += "event - <b> loaded:SubTab3</b>, subApp passed - " + subApp3.key + " <br/>";
        });
        
      },

      updateTab1: function() {
        if (this.SubTab1App) {
          this.SubTab1App.TextBox1.Value = "yay! I did that! :)";
        } else {
          alert("You should select the first tab first!");
        }
      }
    };
  }, "CommunicationApp");
})(Sitecore.Speak);
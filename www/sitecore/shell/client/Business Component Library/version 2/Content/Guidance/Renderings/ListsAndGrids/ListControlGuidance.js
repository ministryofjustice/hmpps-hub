(function (Speak) {
  //content collection
  var totals = [100, 155, 200, 300],
    first = ["Jane", "John", "Emily", "Betty", "Gilly", "Max", "Finn"],
    last = ["Oliver", "Adams", "Williams", "Jensen", "Johnson", "Bush"],
    imgpath = "/sitecore/shell/client/Speak/Assets/img/Speak/Common/32x32/dark_gray/",
    images = ["document_empty", "navigate_close", "navigate_down", "navigate_left", "navigate_open", "navigate_right", "navigate_up"],
    links = [{ text: "google.com", url: "http://google.com" }, { text: "yahoo.com", url: "http://yahoo.com" }, { text: "bing.com", url: "http://bing.com" }],
    description = "Lorem ipsum dolor sit amet, vestibulum feugiat purus et varius mauris, in ante pellentesque eleifend vitae conubia, hendrerit sed vivamus tortor erat pellentesque, elit quisque non faucibus suspendisse sapien. Elit eu iaculis nulla aliquam amet aliquam. erat reprehenderit aenean dignissim arcu at adipiscing, suscipit dis eu maecenas posuere nunc, accumsan mi tristique vel facilisis pretium. Est fusce vivamus et integer vitae, mauris sit aliquam hendrerit varius ligula dolor. Malesuada hendrerit dignissim donec in leo ac. Lacus feugiat lectus sed risus adipiscing a, praesent magna aliquam sollicitudin dolor ipsum, eget vivamus veniam mi congue vivamus placerat, vel non sed amet mollis eu. Velit proin pulvinar ornare dui posuere, wisi itaque sed eros donec faucibus, wisi lorem modi orci molestie magna. Sapien vitae quis phasellus cras commodo ipsum, purus quis morbi nec aptent integer, suscipit sed tellus amet nam diam vitae, hendrerit nonummy sem ut posuere quam. Mauris sodales non suspendisse senectus cras amet, massa at suspendisse elit curae phasellus, at class nonummy lacus interdum lobortis, nullam sed vel neque urna fusce senectus. Duis rhoncus erat etiam lectus quis, faucibus vel eget scelerisque sed faucibus, amet nunc maxime sagittis integer lorem praesent, interdum turpis elit sed sed maecenas nascetur. Interdum elit etiam purus ligula pharetra blandit, nam in lorem in curabitur fringilla, integer mus adipiscing et posuere lacus sed, in libero interdum fusce cras duis orci, ligula sagittis nunc egestas dolor urna venenatis. Quis nonummy blandit adipiscing sed diam in, dolor elit euismod non et maecenas, purus eros wisi cras libero elementum lectus, lorem donec fusce ligula odio dolor integer.".split(". "),

    //helper functions
    pad = function (num, length) {
      var s = "000000" + num;
      return s.substr(s.length - length);
    },

    generateItem = function (id) {

      var link = _.sample(links);

      return {
        //TODO: Make Max aware of error concerning type mismatch in checking
        // to reproduce, remove "casting" to string in id
        id: id + "",
        name: _.sample(first) + " " + _.sample(last),
        linkText: link.text,
        linkUrl: link.url,
        percentage: "0." + _.random(10, 99),
        sum: Math.floor(Math.random() * (100 - 0 + 1) + 0),
        total: _.sample(totals),
        description: _.sample(description, _.random(2, 4)).toString(),
        imageAlt: _.sample(first) + "_alt",
        imageUrl: imgpath + _.sample(images) + ".png",
        date: _.random(2013, 2015) + pad(_.random(1, 12), 2) + pad(_.random(1, 28), 2) + "T" + pad(_.random(0, 23), 2) + pad(_.random(0, 59), 2) + pad(_.random(0, 59), 2) + pad(_.random(0, 999), 3)
      };
    },

    generateItems = function (amount) {
      var items = [];

      for (var i = 1, len = amount; i <= len; i = i + 1) {
        items.push(generateItem(i));
      }
      return items;
    };

  Speak.pageCode({
    name: "SubAppRenderer",
    initialized: function () {
      var data3 = generateItems(3);
      var data15 = generateItems(15);

      this.Border7.el.style.height = "400px";
      this.ListControlAssociatedListPage.AssociatedListPage = "http://google.com";

      this.ListControl1.DynamicData = data3;
      this.ListControl4.DynamicData = data3;
      this.ListControl5.DynamicData = data3;
      this.ListControl6.DynamicData = data3;
      this.ListControl7.DynamicData = data15;
      this.ListControlDatesAndTime.DynamicData = data3;
      this.ListControlAssociatedListPage.DynamicData = data3;
      this.ListControlTileListBasic.DynamicData = data3;



    }
  });
})(Sitecore.Speak);


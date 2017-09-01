(function (speak) {
  speak.pageCode([], function () {
    var subapp1,
      dynamicTabCount = 0;
    return {
      initialized: function () {
      },
      showSecondTab: function() {
        this.TabControl1.at(1).IsHidden = "0";
      },
      hideSecondTab: function () {
        this.TabControl1.at(1).IsHidden = "1";
      },
      showFourthTab: function() {
        this.TabControl1.at(3).IsHidden = "0";
      },
      hideFourthTab: function () {
        this.TabControl1.at(3).IsHidden = "1";
      },
      addTab: function () {
        dynamicTabCount++;
        var ids = ["{4819C175-7DDC-4452-8AA1-A877FDA0B211}", "{68F72023-8629-4A89-9781-D87B721598A0}"];
        var itemId = ids[dynamicTabCount%2];
        this.TabControl2.add({
          $itemId: itemId,
          $displayName: "Added tab" + dynamicTabCount
        });
      },
      removeSecondTab: function () {
        //this collection contains 4 items - 2 of them are hidden
        this.TabControl2.remove(this.TabControl2.at(2));
      }
    };
  }, "DynamicApp");
})(Sitecore.Speak);
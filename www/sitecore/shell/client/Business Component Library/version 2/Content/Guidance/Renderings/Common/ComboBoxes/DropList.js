(function(Speak) {

  Speak.pageCode([], function() {
    return {
      initialized: function() {
        this.DropListDynamicData.reset([
          { "$itemId": 1, "description": "lorem ipsum" },
          { "$itemId": 2, "description": "dolor sit amet" }
        ]);
      }
    };
  });

})(Sitecore.Speak);
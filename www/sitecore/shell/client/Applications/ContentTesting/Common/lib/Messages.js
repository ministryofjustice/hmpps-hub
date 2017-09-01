define([], function() {
  return {
    draftTestDeleted: "draft-del",
    testCancelled: "test-cancel",

    getDictionaryKey: function(key) {
      switch(key) {
        case this.draftTestDeleted:
          return "Draft test has been deleted";

        case this.testCancelled:
          return "Test has been cancelled";
      }

      return key;
    }
  };
});
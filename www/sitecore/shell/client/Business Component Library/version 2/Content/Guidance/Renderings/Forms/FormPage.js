(function(speak) {
  speak.pageCode([],function() {
    return {
  
      showFormData: function () {
        alert(JSON.stringify(this.Form.getFormData()));
      },
    };
  }, "SubAppRendererDemo");
})(Sitecore.Speak);
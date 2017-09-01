(function (speak) {
  var collapseOnBodyClick = function (e) {
    if (this.el.contains(e.target) || this.el === e.target)
      return;

    this.IsOpen = false;
  },

  stopPropagation = function (e) {
    e.stopPropagation();
  };

  speak.component([], {
    name: "DropDownButton",

    initialized: function () {
      document.addEventListener("click", collapseOnBodyClick.bind(this));
      this.el.querySelector(".sc-dropdownbutton-contentpanel").addEventListener("click", stopPropagation);
    },

    toggle: function () {
      if (this.IsEnabled) {
        this.IsOpen = !this.IsOpen;
      }
    }
  });
})(Sitecore.Speak);
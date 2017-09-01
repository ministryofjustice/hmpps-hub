_sc.behavior("checkbox", {
  events: {
    "click .sc-cb": "check",
    "click .sc-cball": "checkAll"
  },
  afterRender: function () {
    this.allCheck = [];
    this.$el.find("thead tr").each(this.insertGlobalcheck);
    _.each(this.$el.find("tbody tr"), this.insertcheck, this);
    this.globalCheck = this.$el.find(".sc-cball");
    this.currentSelection = [];
    this.on("addrow", this.addrow);
  },
  addrow: function () {
    this.insertcheck(this.$el.find("tbody tr").last());
  },
  insertGlobalcheck: function () {
    var checkbox = "<th class='cb'><input class='sc-cball' type='checkbox' /></th>";
    $(this).prepend(checkbox);
  },
  insertcheck: function (el) {
    var checkbox = "<td class='cb'><input class='sc-cb' type='checkbox' /></td>";
    $(el).prepend(checkbox);
    this.allCheck.push($(el));
  },
  checkAll: function () {
    if (this.globalCheck.is(":checked")) {
      _.each(this.allCheck, function (el) {
        el.find(".sc-cb").attr("checked", true);
      });
      this.currentSelection = _.map(this.collection.models, function (model) {
        return model.get("id");
      });
    }
    else {
      _.each(this.allCheck, function (el) {
        el.find(".sc-cb").attr("checked", false);
      });
      this.currentSelection = [];
    }
  },
  check: function (evt) {
    var current = $(evt.currentTarget);
    if (current.is(":checked")) {
      this.currentSelection.push(current.closest("tr").data("id"));
    }
    else {
      this.currentSelection = _.without(this.currentSelection, current.closest("tr").data("id"));
    }

    if (this.collection.length === this.currentSelection.length) {
      this.globalCheck.attr("checked", true);
    }
    else {
      this.globalCheck.attr("checked", false);
    }
  }
});

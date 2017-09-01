(function (speak) {

    speak.component(["bclCollection", "bclSelection", "select2"], function (Collection, Selection) {
    var selectValue = function() {
      this.$el.find("select").select2("val", this.SelectedValue);
    },
    
    renderOptions = function(items) {
      return items.map(function(option) {
        return '<option value="' + this.getValue(option) + '">' + this.getDisplayName(option) + '</option>';
      }, this);
    },

    renderGroups = function (items) {
      var groups = _.groupBy(items, this.getGroupName, this);

      var render = [];
      _.each(groups, function(options, groupName) {
        render.push('<optgroup label="' + groupName + '">' + renderOptions.call(this, options).join("") + '</optgroup>');
      }, this);

      return render;
    };

    return speak.extend({}, Collection.prototype, Selection.prototype, {
      name: "SearchableDropList",

      initialized: function () {
        // Super
        Collection.prototype.initialized.call(this);
        Selection.prototype.initialized.call(this);

        this.$el = $(this.el);

        // Initialize select2 plugin and handle user input
        this.$el.find("select")
          .change(function (event) {
            this.selectByValue(event.val);
          }.bind(this))
          .select2({ formatNoMatches: this.$el.data("sc-text-nomatches") })
          .removeClass("hide");

        // Update view
        this.on("itemsChanged", this.render, this);
        this.on("change:SelectedValue", selectValue, this);
      },

      render: function () {
        if (!this.hasData()) {
          this.$el.find("select").empty();
          return;
        }

        var items = this.GroupFieldName ? renderGroups.call(this, this.Items) : renderOptions.call(this, this.Items);
        this.$el.find("select").html(items.join(""));
        selectValue.call(this);
      },

      getGroupName: function (item) {
        return item[this.GroupFieldName];
      }
    });
  }, "SearchableDropList");
})(Sitecore.Speak);
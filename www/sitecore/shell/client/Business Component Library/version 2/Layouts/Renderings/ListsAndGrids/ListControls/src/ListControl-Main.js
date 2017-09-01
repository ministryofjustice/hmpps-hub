(function (Speak) {
  
  Speak.component(["bclCollection", "bclSelection", "bclChecking", "bclScrollable", "ListControl/UserProfile", "ListControl/ViewModel", "ListControl/DetailList", "ListControl/TileList", "ListControl/IconList"], function (Collection, Selection, Checking, Scrollable, UserProfile, ViewModel, DetailList, TileList, IconList) {
    var view,
      viewModel,
      isSelectionRequired,
      

      ValueFieldCollection = Collection.assemble({ ValueFieldName: true }),

      initListeners = function () {
        this.on("change:ViewMode change:EmptyText change:IdFieldName change:ColumnDefinitionItems change:IconFieldName change:IconLinkFieldName change:IconTitleFieldName change:IconSize change:TextAlignment", this.render, this);
        this.on("itemsChanged", this.render, this);
        this.on("change:CheckedItems", function () {
          this.IsSelectionRequired = this.hasCheckedItems() ? false : isSelectionRequired;
          this.select(null);
        }, this);
      };

    return Speak.extend({}, ValueFieldCollection.prototype, Selection.prototype, Checking.prototype, Scrollable.prototype, UserProfile.prototype, {
      initialize: function() {
        Collection.prototype.initialize.call(this);
        Scrollable.prototype.initialize.call(this);
      },

      initialized: function () {

        this.ColumnDefinitionItems = typeof this.ColumnDefinitionItems === "string" ? JSON.parse(this.ColumnDefinitionItems) : JSON.parse(JSON.stringify(this.ColumnDefinitionItems));
        
        viewModel = new ViewModel(this);
        isSelectionRequired = this.IsSelectionRequired;
        
        UserProfile.prototype.initialized.call(this);
        Collection.prototype.initialized.call(this);
        Selection.prototype.initialized.call(this, this.IsSelectionRequired);
        Checking.prototype.initialized.call(this);
        Scrollable.prototype.initialized.call(this);
        initListeners.call(this);
      },

      swapColumns: function (indexA, indexB) {
        var temp = this.ColumnDefinitionItems[indexB];

        this.ColumnDefinitionItems[indexB] = this.ColumnDefinitionItems[indexA];
        this.ColumnDefinitionItems[indexA] = temp;

        this.trigger("change:ColumnDefinitionItems");
      },

      

      render: function () {
        switch (this.ViewMode) {
          case "DetailList":
            view = new DetailList(viewModel, this.el, this.ColumnDefinitionItems);
            break;
          case "TileList":
            view = new TileList(viewModel, this.el);
            break;
          case "IconList":
            view = new IconList(viewModel, this.el);
            break;
          default:
            throw "Cannot find ViewMode " + this.ViewMode;
        }
      }
    });
  }, "ListControl");
})(Sitecore.Speak);
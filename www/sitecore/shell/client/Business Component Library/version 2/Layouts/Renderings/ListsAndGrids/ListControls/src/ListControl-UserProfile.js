(function (Speak) {

  define("ListControl/UserProfile", ["bclUserProfile"], function () {

    var stateProperties = [
      "ViewMode",
      "SelectedValue",
      "CheckedValues",
      "Sorting"
    ];

    function setColumnDefinitionItemsState() {
      var userProfileColumnDefinitionItems = this.UserProfileState["ColumnDefinitionItems"];

      var columnFields = this.ColumnDefinitionItems.map(function(obj) {
         return _.omit(obj, "ColumnStoredWidth", "SortDirection");
      });
      var userProfileColumnFields = userProfileColumnDefinitionItems.map(function(obj) {
        if (obj.HtmlTemplate) {
          obj.HtmlTemplate = _.unescape(obj.HtmlTemplate);
        }

        return _.omit(obj, "ColumnStoredWidth", "SortDirection");
      });
      var columnFieldsMatch = JSON.stringify(columnFields) === JSON.stringify(userProfileColumnFields);

      if (Array.isArray(this.ColumnDefinitionItems)) {
        if (columnFieldsMatch) {
          this.ColumnDefinitionItems = userProfileColumnDefinitionItems;

          return;
        }

        updateState.call(this, stateProperties);
      }
    }

    //Generic implementation below - consider making it into a shared mixin
    var UserProfile = function () { };
    UserProfile.prototype.constructor = UserProfile;
    
    var saveHandler = Speak.module('bclUserProfile'),
    
    getProp = function (prop) {
      return (typeof prop === "object" ? Object.keys(prop)[0] : prop);
    },

    saveState = function(state) {
      if (Array.isArray(state.ColumnDefinitionItems)) {
        state.ColumnDefinitionItems = state.ColumnDefinitionItems.map(function (column) {
          if (column.ColumnType === "htmltemplate" && column.HtmlTemplate) {
            column = _.clone(column);
            column.HtmlTemplate = _.escape(column.HtmlTemplate);
          }

          return column;
        });
      }

      saveHandler.saveState(this.UserProfileKey, state, function () {
        this.UserProfileState = state;
        this.trigger("UserProfileSaved");
      }.bind(this));
    },

    updateState = function (stateProperties) {
      if (this.IsStateDiscarded) return;

      var state = typeof this.UserProfileState == "object" ? Speak.extend({}, this.UserProfileState) : {};

      stateProperties.forEach(function (prop) {
        var key = getProp(prop);
        if (this.hasOwnProperty(key)) {
           state[key] = this[key];
        }
      }, this);

      saveState.call(this, state);
    },

    setInitialState = function (stateProperties) {
      stateProperties.forEach(function (prop) {
        var key = getProp(prop);

        if (typeof prop === 'object' && this.hasOwnProperty(key) && this.UserProfileState[key]) {
          prop[key].call(this, key);
        }

        else if (this.hasOwnProperty(key) && this.UserProfileState[key]) {
          this[key] = this.UserProfileState[key];
        }
      }, this); 
    },

    setListener = function (stateProperties) {
      this.on(stateProperties.map(function (prop) {
        return "change:" + getProp(prop);
      }).join(" "), updateState.bind(this, stateProperties), this);
    };

    UserProfile.prototype.initialized = function () {
      if (this.IsStateDiscarded) return;

      if (!Speak.utils.is.an.array(stateProperties)) {
        throw new Error("Please provide a valid array containing component property names and events");
      }

      if (this.ViewMode === "DetailList") {
        stateProperties.push("ColumnWidths");
        stateProperties.push({ "ColumnDefinitionItems": setColumnDefinitionItemsState });
      }

      if (this.UserProfileState) {
        this.UserProfileState = typeof this.UserProfileState === "string" ? saveHandler.parseState(this.UserProfileState) : this.UserProfileState;
        setInitialState.call(this, stateProperties);
      } else {
        this.UserProfileState = {};
      }

      setListener.call(this, stateProperties);
    };

    UserProfile.prototype.resetState = function () {
      saveState.call(this, {});
    };

    return UserProfile;
  });
})(Sitecore.Speak);
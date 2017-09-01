define([], function() {
  return {
    propagateChange: function() {
      var value = null;

      if (_.isFunction(this.sourceProp)) {
        value = this.sourceProp(this.source);
      } else {
        value = this.source.get(this.sourceProp);
      }

      if (value === null || value === undefined) {
        value = "--";
      }
      else {
        if (this.prefix) {
          value = this.prefix + value;
        }

        if (this.postfix) {
          value = value + this.postfix;
        }
      }

      if (_.isFunction(this.targetProp)) {
        this.targetProp(this.target, value);
      } else {
        this.target.set(this.targetProp, value);
      }
    },

    bindVisibility: function () {
      var value = this.source.get(this.sourceProp);
      var outcome = value != null && (value > 0 || value.length > 0);
      if (this.hide) {
        outcome = !outcome;
      }

      this.target.set("isVisible", outcome);
    }
  };
});
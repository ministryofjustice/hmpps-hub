( function ( speak ) {

    speak.component( ["bclCollection", "bclMultiSelection"], function ( Collection, MultiSelection ) {
        return speak.extend( {}, Collection.prototype, MultiSelection.prototype, {
            initialized: function () {
                Collection.prototype.initialized.call( this );
                MultiSelection.prototype.initialized.call(this);

                // workaround: #68715 - ListBox: Initial databound Selection doesn't trigger
                this.on("itemsChanged", function () {
                  setTimeout(function () {
                    this.trigger("change:SelectedValues", this.SelectedValues);
                  }.bind(this), 0);
                }, this);
            }
        } );
    }, "ListBox" );
} )( Sitecore.Speak );
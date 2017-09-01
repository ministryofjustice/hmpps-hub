(function(Speak) {

    Speak.pageCode({
        name: "SelectionApp",
        initialized: function() {
            this.ListControlBeforeSelectedItem.on("BeforeSelectedItem", function(obj) {
                console.log(obj.item);
                obj.isSelectionAborted = confirm('Do you want to abort the selection?');
            });
        }
    });

})(Sitecore.Speak);
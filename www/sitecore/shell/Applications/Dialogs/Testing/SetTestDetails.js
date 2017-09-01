Sitecore.CollapsiblePanel.newAdded = function (id) {
    this.editName(id);
};

Sitecore.CollapsiblePanel.rename = function (sender, event, id) {
    this.editName(id);
};

Sitecore.CollapsiblePanel.nameChanged = function (element, evt) {
    var nameEdit = $(element);
    if (!nameEdit) {
        return;
    }

    var value = nameEdit.value;
    if (value && !value.blank()) {
        var variationId = nameEdit.readAttribute("data-meta-id");
        if (variationId) {
            scForm.postRequest("", "", "", "variation:rename(variationId=" + variationId + ",name=" + encodeURIComponent(value.escapeHTML().gsub(/"/, '&quot;')) + ")", null, true);
        }
    }
};

function scToggleTestComponentSection() {
    $("Variations").toggleClassName("hide-test-component");
};

function scSearchTermChanged(element, evt, id) {
    var searchTermTextBox = $(element);
    scForm.postEvent(this, event, 'PerformSearch(\"' + searchTermTextBox.value + '\", \"' + id + '\")');
}

function scSearchForContent(element, evt, id) {
    var searchTermTextBox = $(element).getOffsetParent().down('input');
    scForm.postEvent(this, event, 'PerformSearch(\"' + searchTermTextBox.value + '\", \"' + id + '\")');
}

function scSwitchRendering(element, evt, id) {
    scForm.postRequest("", "", "", "ChangeDisplayComponent(\"" + id + "\")");
};


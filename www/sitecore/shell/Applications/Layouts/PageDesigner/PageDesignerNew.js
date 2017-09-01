Sitecore.PageDesignerNew = new function() {
  Sitecore.registerClass(this, "Sitecore.PageDesignerNew");
}

function Treeview_onNodeSelect(sender, eventArgs) {
  var ctl = scForm.browser.getControl("Treeview_Selected");
  ctl.value = eventArgs.get_node().ID;
}

function Treeview_onNodeMouseDoubleClick(sender, eventArgs) {
  scForm.postRequest("", "", "", "OK_Click()");
}

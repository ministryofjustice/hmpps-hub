var tooltipHandler = null;

function showToolTipWithTimeout(elementid, value, manager, timeout) {
  cancelRadTooltip();
  if (!timeout || timeout == 0) {
    showRadToolTip(elementid, value, manager);
    return;
  }

  tooltipHandler = setTimeout(function () { showRadToolTip(elementid, value, manager); }, timeout);
}

function cancelRadTooltip() {
  if (tooltipHandler) {
    try {
      clearTimeout(tooltipHandler);  
    }catch(ex){}

    tooltipHandler = null;
  }
}

function showRadToolTip(elementid, value, manager) {
  var managerId = manager;
  if (!managerId) {
    var managers = $$('div.scRadTooltipManager');
    if (managers && managers.length > 0) {
      managerId = managers[0].id;
    }
  }

  if (!managerId) {
    return;
  }

  var tooltipManager = $find(managerId);
  if (!tooltipManager) {
    return;
  }

  var element = $get(elementid)
  if (!element) {
    alert('element not found');
    return;
  }

  if (!tooltipManager) {
    alert('tooltip manager not found'); return;
  }

  var tooltip = tooltipManager.getToolTipByElement(element);

  if (!tooltip) {
    tooltip = tooltipManager.createToolTip(element);
  }

  try {
    tooltip.set_value(value);
    tooltip.show();
  }
  catch (ex) {
    alert(ex.description);
  }
}
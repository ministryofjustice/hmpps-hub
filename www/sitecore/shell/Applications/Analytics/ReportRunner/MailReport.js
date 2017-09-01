function scMail() {
  return window.parent.scForm.postRequest("","","","analytics:emailreport(report=" + reportFileName + ",id=" + itemId + ")");
}

function HideLoadMessage() {
  reportFrame = document.getElementById("webReportFrame");
  reportTable = reportFrame.contentWindow.document.getElementById("webReportTable");
  loadMessage = document.getElementById("webLoadMessage");
  
  reportFrame.width = "100%";
  reportFrame.height = "100%";
  loadMessage.style.visibility = "hidden";
    
  var element = $("Viewer");
  element = element.down().next();
  element.style.height = "100%";
}

var element = $("Viewer");
element = element.down(6).rows[0];
var cell = new Element("td");
cell.innerHTML = "<div class=\"webMenu\"><a onmouseover=\"this.className='hover'\" onmouseout=\"this.className=null\" onclick=\"javascript:return scMail();\" style=\"width:74px\"><img src=\"/sitecore/shell/Themes/Standard/Reports/MenuMail.gif\" align=\"left\" width=\"16\" height=\"16\" style=\"width:16px;height:16px\" />&nbsp;Mail Report</a></div>";
element.appendChild(cell);

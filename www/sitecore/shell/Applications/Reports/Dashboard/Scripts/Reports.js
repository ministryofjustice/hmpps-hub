var silverlightApplicationLoaded = null;


function OpenDashboard(id) {
  scForm.postEvent(this, {}, 'dashboard:opensinglecampaign(id={' + id + '})');
}

function PluginLoaded(sender, args) {
  silverlightApplicationLoaded = sender.getHost();
 }

 /*
 * Opens a new window with the Referring Site Classification.
 */
 function FacetClassification(trafficType, id, name, url, width, height) {
   var encodeId = encodeURIComponent(id)
   var dialogUrl = url + "?id=" + encodeId + "&name=" + name + "&trafficType=" + trafficType;

   setTimeout(function () {

     // Displaying the dialog.
     var dialogStyle = "dialogWidth: " + width + "px; dialogHeight: " + height + "px; resizable: yes";
     var returnValue = showModalDialog(dialogUrl, null, dialogStyle);

     if (typeof (returnValue) == "undefined") {
       return;
     }

     SetFacetClassified(id);
   }
  , 100);

 }

/*
* Opens a new window with the SearchKeyword Classification.
*/
function SearchKeywordClassification(trafficType, id, name, url) {
  FacetClassification(trafficType, id, name, url, 500, 130);
}

/*
* Opens a new window with the Referring Site Classification.
*/
function ReferringSiteClassification(trafficType, id, name, url) {
  FacetClassification(trafficType, id, name, url, 500, 300);
}


/*
* Sets the referring site as reclassfied
*/
function SetFacetClassified(id) {
  var control = document.getElementById("scSilverlightExecutiveDashboard");
  if (typeof control != 'undefined') {
    control.Content.MinorReport.FacetClassified(id);
  }
}


/*
* Opens a new window with the Stimulsot report control
*/
function OpenReport(url) {
  setTimeout(function () {
    var dialogStyle = "dialogWidth: 600px; dialogHeight: 500px; resizable: yes";
    var returnValue = showModalDialog(url, null, dialogStyle);
  }
  , 100);
}

/*
* Reload.
*/
function Reload() {
  var control = document.getElementById("scSilverlightExecutiveDashboard");
  if (typeof control != 'undefined') {
    control.Content.Dashboard.Reload();
  }
}

/*
* Get report data 
*/
function GetData(url, noCache) {

  var cacheHeaders = "";
  if (noCache == "true") {
    cacheHeaders = "['cache-control','no-cache','pragma','no-cache']";
  }

  new Ajax.Request(
      url,
      {
        requestHeader: cacheHeaders,
        asynchronous: false,
        method: "get",
        onComplete: function (result) {
          DataLoaded(url);
        }
      });
}

function DataLoaded(url) {

  var control = document.getElementById("scSilverlightExecutiveDashboard");
  if (typeof control != 'undefined') {
    control.Content.Dashboard.DataLoaded(url);
  }
}

/*
* Fixes GUID format.
*/
function FixGuid(guid) {
  if ((guid == null) || (guid == "")) {
    return null;
  }

  return "{" + guid.replace("{", "").replace("}", "").toUpperCase() + "}";
}

function KeepAlive() {
}
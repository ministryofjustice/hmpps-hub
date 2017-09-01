if (!Sitecore){
    var Sitecore= new Object();
}

Sitecore.Debug = new function() {
}

Sitecore.Debug.showInformation = function(element, debugInfoID, reportFileName) {
  var iframe = element.childNodes[1];

  if (iframe.src == '') {
    iframe.src = '/sitecore/shell/default.aspx?xmlcontrol=RenderingInfo&id=' + debugInfoID + "&fi=" + reportFileName;
  }
  
  element.style.zIndex = '999';
  
  var offsetLeft = parseInt(Sitecore.Debug.getOffset(element).left);
  var windowWidth = parseInt(Sitecore.Debug.getWindowSize().width);
  var frameWidth = parseInt(iframe.width)
  
  if ((offsetLeft + frameWidth) > windowWidth) {
    iframe.style.position = 'relative'
    iframe.style.left = "-" + (parseInt(iframe.width) + 16) + "px";
  }
  else {
    iframe.style.left = "";
  }
  
  element.childNodes[1].style.display = '';
  return false;
}

Sitecore.Debug.hideInformation = function(element) {
  element.childNodes[1].style.display = 'none'; 
  element.style.zIndex = '';
  return false;
}

Sitecore.Debug.getOffset = function(element) {
	var curleft = curtop = 0;
	
	if (element.offsetParent) {
		curleft = element.offsetLeft
		curtop = element.offsetTop
		
		while (element = element.offsetParent) {
			curleft += element.offsetLeft
			curtop += element.offsetTop
		}
	}
	
	return {left: curleft, top: curtop};
}

Sitecore.Debug.getWindowSize = function() {
  var x,y;
  if (self.innerHeight) // all except Explorer
  {
	  x = self.innerWidth;
	  y = self.innerHeight;
  }
  else if (document.documentElement && document.documentElement.clientHeight)
	  // Explorer 6 Strict Mode
  {
	  x = document.documentElement.clientWidth;
	  y = document.documentElement.clientHeight;
  }
  else if (document.body) // other Explorers
  {
	  x = document.body.clientWidth;
	  y = document.body.clientHeight;
  }
  
  return {width: x, height: y};
}
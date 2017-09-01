scTGallery.prototype.autoAdjustSize = function ()
{
  return false;
}

scForm.browser.attachEvent(window, "onload", function ()
{
  var content = document.getElementById("Children") ||  document.getElementById("NoChildrenTextContainer");

  if (!content)
  {
    return;
  }

  var frame = scForm.browser.getFrameElement(window);

  var contentWidth = content.scrollWidth + 2;
  var contentHeight = content.scrollHeight + 2;

  var windowHeight = frame.ownerDocument.body.clientHeight;
  var frameTop = frame.offsetTop;
  var availableHeight = windowHeight - frameTop;
  var frameHeight = contentHeight < availableHeight ? contentHeight : availableHeight;

  var isVerticalScrolling = contentHeight > frameHeight;  
  var frameWidth = contentWidth;
  if (isVerticalScrolling) {
    try {
      var scrollbarWidth = getScrollbarWidth() || 20;
      frameWidth += scrollbarWidth;
    }
    catch(e) {
      //silent;
    }
  }
  
  frame.height = frameHeight + "px";
  frame.width = frameWidth + "px";
});

function getScrollbarWidth() {
  var element, inner, w1, w2; 
  element = new Element("div");
  element.setStyle({width: "50px", height: "50px", overflow: "hidden", position: "absolute", top: "-200px", left: "-200px"})
  document.body.appendChild(element);
  inner = new Element("div");
  inner.setStyle("height:100px");
  element.appendChild(inner);
  w1 = inner.getWidth();
  element.setStyle({overflow: "auto"});
  w2 = inner.getWidth();
  element.remove();
  return w1 - w2;
}
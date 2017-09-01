var thumbnailsPerRow = 4;
var maxRows = 3;
document.observe("dom:loaded", function() {  
  var thumbnails = $$(".scItemThumbnail"); 
  var thumbnailsCount = thumbnails.length;
  if (thumbnailsCount) {
    var thumbnailElemenet = thumbnails[0];
    thumbnailElemenet.style.display = "block";
    var width = thumbnailElemenet.measure("margin-box-width");
    var height = thumbnailElemenet.measure("margin-box-height");   
    var galleryWidth = Math.min(thumbnailsPerRow, thumbnailsCount) * width;
    var rowCount = Math.ceil(thumbnailsCount  / thumbnailsPerRow);       
    if (rowCount > maxRows) {
      galleryWidth += getScrollBarWidth();  
    }

    var galleryHeight = Math.min(rowCount, maxRows) * height;
    var frame = scForm.browser.getFrameElement(window);
    if (frame) {
      var borderWidth = 2;
      frame.width = galleryWidth + borderWidth + "px";
      frame.height = galleryHeight + borderWidth + "px";
    }

    if (!scForm.browser.isIE) {
      $("Simulators").style.height = galleryHeight + "px";
    }

    $$(".scItemThumbnail").each(function(el) {el.style.display = "block";});
  }
});

function getScrollBarWidth() {  
  var fakeElement = document.createElement("div");      
  var width;
  try {
    document.body.appendChild(fakeElement); 
    if (scForm.browser.isIE) {
      fakeElement.style.width = "50px";
    }

    fakeElement.style.position = "absolute";
    fakeElement.style.top = "-100px";   
    fakeElement.style.overflow = "scroll";       
    var width = fakeElement.offsetWidth - fakeElement.clientWidth;  
    document.body.removeChild(fakeElement);
  }
  catch(err) {
    if (window.top.console) {
      window.top.console.log("Getting scrollbar width error ", err);
    }
  }

  return width || 20;
};
var SitecoreLightbox = Class.create({
  initialize: function(content) {
    this.content = content;
    
    var body = $(document.body);
    this.lightbox = new Element("div", { id: "scLightbox" });
    body.insert(this.lightbox);
    
    this.lightbox.appendChild(this.content);
    if (Prototype.Browser.Gecko) {
      this.lightbox.setStyle({ visibility: "hidden" });
    }
  },
  
  getHeight: function() {
    return this.height;
  },
  
  show: function() {
    this.overlay = new Element("div", { id: "scOverlay" });
    this.overlay.observe("click", this.onHide.bindAsEventListener(this));
    this.overlay.hide();

    var body = $(document.body);
    body.insert(this.overlay);
  
    this.content.hide();
    var pageSize = this.getPageSize();
    
    new Effect.Appear('scOverlay', { duration: 0.4, from: 0.0, to: 0.2 });

    var height = this.content.getHeight() || 250;

    if (height > pageSize[3] - 125) {
      height = pageSize[3] - 125;
      
      if (this.content.nodeName.toLowerCase() == "iframe" && this.content.getAttribute("name")) {
        this.content.height = height;
        var name = this.content.getAttribute("name");
        if (frames[name]) {
          frames[name].document.scParentHeight = height;
        }
      }
    }
    
    this.lightbox.setStyle({
        left: "0px",
        right: "0px",
        margin: "0 auto",
        top: "15px",
        bottom: "15px",
        height: height + 16,
        width: "800px",
        overflow: "auto"
    });

    this.height = height;
    
    if (Prototype.Browser.Gecko) {
      this.lightbox.setStyle({ visibility: "visible" });
    }
    
    this.content.show();
    
    Event.observe(window, "resize", this.onResize.bindAsEventListener(this));
  },
  
  onHide: function() {
    if (this.hideHandler) {
      this.hideHandler(this);
    }
    else {
      this.hide();
    }  
  },
  
  onResize: function() {
  },
  
  hide: function() {
    this.lightbox.remove();
    if (this.overlay) {
      new Effect.Fade('scOverlay', { duration: 0.4 });
    }
  },

  getPageSize: function() {  	
	  var xScroll, yScroll;
  	
	  if (window.innerHeight && window.scrollMaxY) {	
		  xScroll = window.innerWidth + window.scrollMaxX;
		  yScroll = window.innerHeight + window.scrollMaxY;
	  } else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
		  xScroll = document.body.scrollWidth;
		  yScroll = document.body.scrollHeight;
	  } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
		  xScroll = document.body.offsetWidth;
		  yScroll = document.body.offsetHeight;
	  }
  	
	  var windowWidth, windowHeight;
  	
	  if (self.innerHeight) {	// all except Explorer
		  if(document.documentElement.clientWidth){
			  windowWidth = document.documentElement.clientWidth; 
		  } else {
			  windowWidth = self.innerWidth;
		  }
		  windowHeight = self.innerHeight;
	  } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
		  windowWidth = document.documentElement.clientWidth;
		  windowHeight = document.documentElement.clientHeight;
	  } else if (document.body) { // other Explorers
		  windowWidth = document.body.clientWidth;
		  windowHeight = document.body.clientHeight;
	  }	
  	
	  // for small pages with total height less then height of the viewport
	  if(yScroll < windowHeight){
		  pageHeight = windowHeight;
	  } else { 
		  pageHeight = yScroll;
	  }

	  // for small pages with total width less then width of the viewport
	  if(xScroll < windowWidth){	
		  pageWidth = xScroll;		
	  } else {
		  pageWidth = windowWidth;
	  }

	  arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight) 
	  return arrayPageSize;
  }
});
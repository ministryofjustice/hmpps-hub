function scSitecoreSidebar() {
  this.timer = null;
}

scSitecoreSidebar.prototype.expand = function() {
  var frame = scForm.browser.getFrameElement(window);
  
  frame.style.width = "250px";
}

scSitecoreSidebar.prototype.collapse = function() {
  var frame = scForm.browser.getFrameElement(window);  
  
  frame.style.width = "6px";  
}

scSitecoreSidebar.prototype.mouseLeave = function() {
  if (this.timer != null) {
    clearTimeout(this.timer);
    this.timer = null;
  }
  
  this.timer = setTimeout("scSidebar.collapse()", 750);
}

scSitecoreSidebar.prototype.mouseEnter = function() {
  if (this.timer != null) {
    clearTimeout(this.timer);
    this.timer = null;
  }
  
  this.expand();
}

function scSidebarMouseEnter() {
  scSidebar.mouseEnter();
}

function scSidebarMouseLeave() {
  scSidebar.mouseLeave();
}

function scSidebarInitialize() {
  scSidebar = new scSitecoreSidebar();

  if (scForm.browser.isIE) {
    scForm.browser.attachEvent(window.document.body, "onmouseenter", scSidebarMouseEnter);
    scForm.browser.attachEvent(window.document.body, "onmouseleave", scSidebarMouseLeave);
  }
  else {
    scForm.browser.attachEvent(window.document.body, "onmouseover", scSidebarMouseEnter);
    scForm.browser.attachEvent(window.document.body, "onmouseout", scSidebarMouseLeave);
  }
}

scForm.browser.attachEvent(window, "onload", scSidebarInitialize);

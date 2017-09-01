/* Sitecore.Upload */

Sitecore.Upload = new function() {
  Sitecore.Dhtml.attachEvent(window, "onload", function() { Sitecore.Upload.load() } );
  
  this.uniqueId = 0;

  this.load = function () {
    
    if (Prototype.Browser.IE) {
      this.fixFileListSize();
      Event.observe(window, 'resize', this.fixFileListSize);
    }
    
    this.lastFileId = null;

    var tags = document.getElementsByTagName("INPUT");
    
    if (tags != null) {
      for (var n = 0; n < tags.length; n++) {
        if (tags[n].type.toLowerCase() == "file") {
          this.lastFileId = tags[n].id;
          break;
        }
      }
    }
    
    var handle = $("UploadedItemsHandle");
    var error = $("ErrorText");
    var uploadedItems = $("UploadedItems");
    
    if (handle != null && handle.value != "") {
      var frame = window.parent.document.getElementById("Result");
      if (frame != null) {
        frame.src = "Result.aspx?hdl=" + handle.value;
      }
      
      var frame = window.parent.frames["Upload"];
      
      if (frame != null && frame.Sitecore != null && frame.Sitecore.Upload != null) {
        frame.Sitecore.Upload.uploaded(uploadedItems.value, error.value);
      }
    }
    
    Sitecore.Dhtml.attachEvent($("UploadForm"), "onsubmit", function() { Sitecore.Upload.submit() } );
  }

  this.change = function(element) {  
    var filelist = $("FileList");
    
    if (filelist != null) {
      var src = element;
      
      if (src != null && src.id == this.lastFileId && src.value != "") {
        var id = this.getUniqueId();
      
        var ctl = document.createElement("input");
        
        ctl.id = id;
        ctl.name = id;
        ctl.type = "file";
        // ctl.value = "browse";
        ctl.onchange = function() { return Sitecore.Upload.change(this) };
        
        filelist.appendChild(ctl);
        
        this.lastFileId = id;
      }

      if (src != null && src.value == "") {
        Element.remove(src);
      }
    }
  }
  
  this.uploaded = function(uploadedItems, error) {
    $("UploadedItems").value = uploadedItems;
    
    $("FileList").innerHTML = "<input id=\"File0\" name=\"File0\" type=\"file\" value=\"browse\" onchange=\"javascript:return Sitecore.Upload.change(this)\"/>";
    
    this.lastFileId = "File0";
    
    var button = $("Upload");
    
    if (button != null) {
      button.disabled = false;
    }
    
    if (error != null && error != "") {
      alert(error);
    }
  }
  
  this.getUniqueId = function() {
    this.uniqueId++;
    
    return "File" + this.uniqueId;
  }
  
  this.submit = function() {
    $("Upload").disabled = true;
    
    var frame = window.parent.document.getElementById("Result");
    if (frame != null) {
      frame.src = "Uploading.aspx";
    }
  }

  this.fixFileListSize = function () {
    var fileList = $('FileList');
    var h = document.body.offsetHeight;
    if (h > 140 && fileList.h != h - 140) {
      fileList.style.height = fileList.h = (h - 140);
    }
  };
}

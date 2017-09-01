var SitecoreMultiUpload = Class.create({
  init: function () {
    // Clicking on 'Close button' in IE9 will cause an exception in this dialog.
    if ($$('.ie9').length > 0) {
      scForm.hideCloseButton();
    }

    if (Prototype.Browser.Gecko || Prototype.Browser.WebKit) {
      $$("form")[0].observe("submit", function(e) {
        e.stop();
      });
      
      $$("body")[0].addClassName("ff");
    }

    var scUpload = this;

    YUI({ bootstrap: false, logLevel: "error" }).use('uploader', function (y) {

      if (y.UA.ie == "11") {
        y.UA.ie = false;
      }

      scUpload.yUploader = new y.Uploader({
        width: "100%",
        height: "100%",
        swfURL: "/sitecore/shell/controls/lib/YUIupload/uploader/assets/uploader.swf"
      });

      scUpload.yUploader.after("fileselect", scUpload.fileQueued.bind(scUpload));
      scUpload.yUploader.after("uploadstart", scUpload.uploadStart.bind(scUpload));
      scUpload.yUploader.after("fileuploadstart", scUpload.onFileUploadStart.bind(scUpload));
      scUpload.yUploader.after("uploadprogress", scUpload.updateProgress.bind(scUpload));
      scUpload.yUploader.after("uploadcomplete", scUpload.complete.bind(scUpload));
      scUpload.yUploader.after("uploaderror", scUpload.error.bind(scUpload));

      scUpload.yUploader.cancel = function () {
        if (this._swfReference) {
          this._swfReference.callSWF("cancel", [this.get("id")]);
        }

        if (this.currentXhr) {
          this.currentXhr.abort();
        }

        this.fire("uploadcancel");
      };

      scUpload.yUploader.render("#BrowseOverlay");
    });

    Event.observe(window, "unload", function () {
      scUpload.yUploader.cancel();
      scUpload.yUploader.destroy();
    });
  },
  
  cancel: function() {
    this.yUploader.cancel();
    scForm.postRequest("", "", "", "Cancel");
  },
  
  onFileUploadStart: function (event) {
    if (event.xhr) {
      this.yUploader.currentXhr = event.xhr;
    }
  },
  
  complete: function(event) {
    this.uploadedFiles = event.data;
    
    var progress = $$('.progress')[0];    
    progress.setStyle({ background: "none" });

    var progressImage = $$(".progressImage")[0];
    progressImage.hide();
    
    var doneImage = $$(".doneImage")[0];
    doneImage.show();
    
    $("Message").innerHTML = "";
    
    this.close();

    return true;
  },
  
  error: function(event) {
    console.error("upload error: %s" + event.status);
    scForm.postRequest("", "", "", "OnError");
  },
  
  fileQueued: function(event) {
    this.queued = true;
    this.file = event.fileList[0];
  
    scForm.postRequest("", "", "", 'OnQueued("' + this.file.get("name") + '", "' + this.file.get("size") + '")');

    return true;
  },
  
  start: function() {
    if (!this.queued) {
      alert("Please select a file to upload");
      return;
    }
    
    var params = new Object();
    
    params["Mode"] = "simple";
    if (Prototype.Browser.Gecko || Prototype.Browser.WebKit) {      
      params["UploadSessionID"] = $$(".uploadSessionID")[0].value;
      params["UploadSessionID1"] = $$(".uploadSessionID1")[0].value;
    }
        
    this.yUploader.upload(this.file, this.destination, params);
  },
  
  uploadStart: function() {
    var progressImage = $$(".progressImage")[0];
    progressImage.show();
    
    scForm.postRequest("", "", "", "OnUpload");
  
    return true;
  },
  
  updateProgress: function(event) {
    var width = (event.bytesLoaded / event.bytesTotal) * 100;
    var progress = $$('.progress')[0];    
    progress.setStyle({ width: width + "%" });
    
    return true;
  }  
});
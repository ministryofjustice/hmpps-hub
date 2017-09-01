var SitecoreMediaFolder = Class.create({
  load: function() {
    this.idSequence = 0;
    this.uploaders = new Array();

    var simpleButton = $(this.getButton("media:multiupload"));
    var advancedButton = $(this.getButton("media:multiupload", "options=1"));

    if (advancedButton) {
      var id = this.overlayButton(advancedButton);
      this.uploaders.push(new SitecoreMediaUploader(id, false));
    }

    if (simpleButton) {
      var id = this.overlayButton(simpleButton);
      this.uploaders.push(new SitecoreMediaUploader(id, true));
    }
  },

  overlayButton: function(button) {
    button.onclick = function() { return false; };

    var w = button.getWidth();
    var h = button.getHeight();
    
    w = w > 0 ? w : 70;
    h = h > 0 ? h : 70;
    
    var wrapper = new Element("div");
    wrapper.className = "scUploadWrapper";

    $(button.parentNode).insert({ top: wrapper });
    wrapper.appendChild(button);

    var overlay = new Element("div");
    overlay.className = "scUploadOverlay";

    this.idSequence++;
    overlay.id = "Overlay" + this.idSequence;
    wrapper.insert({ top: overlay });

    var container = $$(".scFolderButtons")[0];
    
    var ch = container.getHeight();
    ch = ch > 0 ? ch : 70;

    overlay.setStyle({ width: w + "px", height: Math.min(ch, h) + "px" });

    return overlay.id;
  },

  getButton: function(message, params) {
    var buttons = $$(".scFolderButtons");
    if (!buttons || !buttons.length || buttons.length < 1) {
      return null;
    }

    return $A(buttons[0].childNodes).find(function(button) {
      var onclick = button.getAttribute("onclick").toString();

      var result = onclick.indexOf(message) >= 0;

      if (params) {
        result = result && onclick.indexOf(params) >= 0;
      }
      
      return result;
    });
  },

  initializeUploader: function() {
    this.uploaders.push(new SitecoreMediaUploader("Overlay1", true));
  }
});

var SitecoreMediaUploader = Class.create({
  initialize: function(id, simple) {
    this.simple = simple;
    this.settings = scUploadSettings;
    this.queue = new Array();
    this.cancelledFiles = new Array();
    this.uploadedFiles = "";

    YUI({ bootstrap: false, logLevel: "error" }).use('uploader', function (y) {

      if (y.UA.ie == "11") {
        y.UA.ie = false;
      }

      this.yUploader = new y.Uploader({
        width: "100%",
        height: "100%",
        swfURL: "/sitecore/shell/controls/lib/YUIupload/uploader/assets/uploader.swf",
        multipleFiles: true
      });

      this.yUploader.after("fileselect", this.onFileSelect.bind(this));
      this.yUploader.after("fileuploadstart", this.onFileUploadStart.bind(this));
      this.yUploader.after("uploadprogress", this.onUploadProgress.bind(this));
      this.yUploader.after("uploadcomplete", this.onUploadCompleteData.bind(this));
      this.yUploader.after("uploaderror", this.onUploadError.bind(this));

      this.yUploader.render("#" + id);

      this.yUploader.isFlash = y.Uploader.TYPE !== "html5";

      this.yUploader.cancel = function () {
        if (this._swfReference) {
          this._swfReference.callSWF("cancel", [this.get("id")]);
        }

        if (this.currentXhr) {
          this.currentXhr.abort();
        }

        this.fire("uploadcancel");
      };
    }.bind(this));

    this.destination = "/sitecore/shell/applications/flashupload/advanced/uploadtarget.aspx" + window.location.search + "&uploadID=" + this.settings.uploadID;
  },
  
  onFileSelect: function(event) {
    scMediaFolder.activeUploader = this;

    var files = event.fileList;

    this.processSelectedFiles(files);
    this.updateUI();

    this.showUpload();

    var optionsHeight = $("AdvancedOptions").style.display != "none" ? $("AdvancedOptions").getHeight() + 32 : 0;
    $("Scrollbox").setStyle({ height: this.lightbox.getHeight() - optionsHeight - $("buttons").getHeight() });
  },

  onFileUploadStart: function (event) {
    if (event.xhr) {
      this.yUploader.currentXhr = event.xhr;
    }
  },
  
  onUploadProgress: function(event) {
    var element = this.yUploader.isFlash? $(event.originEvent.id): $(event.details[0].target.id);

    var progress = element.down('.progress');
    progress.setStyle({ visibility: 'visible' });

    var filler = element.down('.filler');
    var width = (event.bytesLoaded / event.bytesTotal) * 160;
    filler.setStyle({ width: width + "px" });

    return true;
  },

  onUploadCompleteData: function(event) {
    var row = this.yUploader.isFlash? $(event.originEvent.id): $(event.details[0].target.id);

    this.uploadedFiles += event.data;
    if (!this.uploadedFiles.endsWith("|")) {
      this.uploadedFiles += "|";
    }

    if (!row.hasClassName("error")) {
      var progress = row.down('.progress');

      progress.down('img').remove();
      progress.setStyle({ backgroundImage: 'none' });
      progress.insert({ bottom: "<img src='/~/icon/Office/16x16/check.png.aspx' alt='Uploaded' />" });

      row.addClassName("completed");
      row.removeClassName("queued");
    }

    this.processNextFile();
  },

  close: function() {
    $("CancelButton").hide();

    if ($("CloseButton")) {
      $("CloseButton").hide();
    }

    $$(".closeProgress")[0].show();
    setTimeout(function() { scForm.postRequest("", "", "", "Done(\"" + this.uploadedFiles + "\")"); } .bind(this), 25);
  },

  onUploadError: function(event) {
    console.warn("upload error. file: %s, message: %s", event.id, event.status);
    this.hadErrors = true;
        
    var row = this.yUploader.isFlash? $(event.originEvent.id): $(event.details[0].target.id);
    row.addClassName("error");
    row.removeClassName("queued");
    var progress = row.down('.progress');

    progress.down('img').remove();
    progress.setStyle({ backgroundImage: 'none' });
    progress.insert({ bottom: new Element("img", { src: '/~/icon/Office/16x16/delete.png.aspx', alt: event.status, title: event.status }) });

    this.processNextFile();
  },
  
  processNextFile: function() {
    if (this.queue.length > 0) {
      this.uploadNextFile();
    }
    else {
      if (!this.hadErrors) {
        this.close();
      }
      else {
        scForm.postRequest("", "", "", "OnCompleteWithErrors");
      }
    }
  },

  processSelectedFiles: function(files) {
    for (var i=0;i<files.length;i++ ) {

      var file = files[i];
      file.size = file.get("size");
      file.name = file.get("name");
      file.id = file.get("id");

      if (file.size > this.uploadLimit()) {
        if (this.simple || file.size > this.uploadFileLimit()) {
          this.cancelledFiles.push(file);
          continue;
        }
        else {
          this.forcedFileUpload = true;
        }
      }

      $("queue").show();

      file.size = (file.size / 1000).toFixed(0) + " KB";

      var html = "<tr id='#{id}' class='queued'><td class='name'>#{name}<span class='progress'><img class='filler' style='width:0px;' src='/sitecore/shell/Themes/Standard/Images/Progress/filler_media.png' alt='' /></span></td><td class='size'>#{size}</td><td class='alt'><input class='scFont alt' type='text' id='#{id}_alt' /></td></tr>".interpolate(file);

      $$("#queue tbody")[0].insert({ bottom: html });
      if (!this.simple) {
        $("UploadButton").show();
      }

      this.queue.push(file);
    }
  },

  updateUI: function() {
    /* Cancelled files are the ones that were rejected from upload queue because of the excessive size (most likely) */
    if (this.cancelledFiles.length > 0) {
      var packet = "";

      this.cancelledFiles.each(function(file) {
        packet += file.name + "|";
      });

      scForm.postRequest("", "", "", 'OnFilesCancelled("' + packet + '")');
    }

    if (this.queue.length == 0) {
      this.cancelUpload();
      return;
    }

    $("buttons").show();
    $("Header").setStyle({ display: "block" });

    /* if one of the files too big to be uploaded in the database, but still smaller than maximum request length, the file-based upload is forced */
    if (this.forcedFileUpload) {
      alert(this.settings.uploadingAsFilesMessage);

      var asFiles = $("AsFiles");
      asFiles.checked = true;
      asFiles.disabled = true;
    }

    /* in simple mode, upload starts automatically as soon as user selects the files in the open dialog */
    if (this.simple) {
      scForm.postRequest("", "", "", "OnStart");
    }
    else {
      $("AdvancedOptions").show();
      $("UploadUI").setStyle({ height: "calc(100% - 305px)" });
    }
  },

  uploadNextFile: function() {
    if (!this.queueReversed) {
      this.queue.reverse();
      this.queueReversed = true;
    }

    var params = new Object();

    params["Mode"] = this.simple ? "simple" : "advanced";

    $$(".options input").each(function(input) {
      params[input.id] = input.checked ? "1" : "0";
      input.disabled = true;
    });

    if (Prototype.Browser.Gecko || Prototype.Browser.WebKit) {
      params["UploadSessionID"] = this.settings.uploadSessionID;
      params["UploadSessionID1"] = this.settings.uploadSessionID1;
    }

    if (this.queue.length == 0) {
      return false;
    }

    var file = this.queue.pop();
    file.id = file.get("id");

    var alt = $(file.id).down("input.alt").value;
    params["Alt"] = alt;

    this.yUploader.upload(file, this.destination, params);
    return true;
  },

  /* window management */
  showUpload: function() {
    var uploadContainer = $("UploadPanel");

    this.lightbox = new SitecoreLightbox(uploadContainer);
    this.lightbox.hideHandler = function() { this.cancelUpload(); } .bind(this);

    this.lightbox.show();
  },

  cancelUpload: function() {
    if (this.yUploader) {
      this.yUploader.cancel();
    }
    if (this.lightbox) {
      this.lightbox.hide();
    }
    location.reload();
  },

  /* settings */
  uploadLimit: function() {
    return parseInt(this.settings.uploadLimit);
  },

  uploadFileLimit: function() {
    return parseInt(this.settings.uploadFileLimit);
  }
});

var scMediaFolder = new SitecoreMediaFolder();
Event.observe(document, "dom:loaded", scMediaFolder.load.bind(scMediaFolder));

window.scDisplose = function () {
  scMediaFolder.uploaders.each(function (item) {
    item.yUploader.cancel();
    item.yUploader.destroy();
  });
}
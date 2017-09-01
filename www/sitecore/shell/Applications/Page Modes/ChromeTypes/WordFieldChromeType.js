// Class defines logic for Word document field in inline edititng mode
Sitecore.PageModes.ChromeTypes.WordField = Sitecore.PageModes.ChromeTypes.Field.extend({  
  load: function() {    
    try {
      var obj = new ActiveXObject("Edraw.OfficeViewer");
    }
    catch(e) {                                                   
      this.activeXAvailable = false;
      // change the style to make all word html visible, not only inside the frame user had defined.
      var wordObj = this.wordObj();
      if (wordObj) {
        wordObj.style.height = "auto";
        wordObj.style.width = "auto";
        this.chrome.element.css({padding:"0px", margin: "0px", height: "auto", width: "auto" });
      }

      return;
    }

    this.activeXAvailable = true;
    this.initWord();
    // Dirty hack. Can we find modified event in .ocx?   
    this.intervalID = setInterval($sc.proxy(this._checkWordFieldModified, this), 1000);
    this.onSaveHandler = $sc.proxy(function() {
      var word = this.wordObj();
      if (word == null) {                            
        return;
      }

      if (!word.IsDirty && !word.fileWasOpened) {
        return;
      }
                                                   
      this.updateWordField();                         
    }, this);

    Sitecore.PageModes.PageEditor.onSave.observe(this.onSaveHandler);       
    this.adjustSize();
    this.base();
  },
  
  adjustSize: function() {
    var width = this.chrome.data.custom.editorWidth;
    var minHeight = this.chrome.data.custom.editorHeight;
    var maxHeight = this.chrome.data.custom.editorMaxHeight;
    if (width > 0 && minHeight > 0 && maxHeight > 0 && maxHeight > minHeight) {
       var wordBorderHeight = 60;
       if(maxHeight <= wordBorderHeight) {
         return;
       }
   
       var word = this.wordObj();
       if (word == null) {
         return;
       }

       var rawHTMLContainer = $sc("<span />").update(word.innerHTML).find(".scWordHtml");       
       if ( rawHTMLContainer.length < 0) return;

       height = this._getHeight(rawHTMLContainer.html(), width, maxHeight - wordBorderHeight) + wordBorderHeight;
   
       if(height <= minHeight) {
         return;
       }
   
       word.style.height = height + "px";
       var topPadding = parseInt(this.chrome.element.css("padding-top"));
       var bottomPadding = parseInt(this.chrome.element.css("padding-bottom"));
       this.chrome.element.css({height: height + topPadding + bottomPadding + "px"});
    }
  },

  handleMessage: function(message, params) {
    switch (message) {      
      case "chrome:field:word:mediainserted":
        this.insertMediaToWord(params.path, params.alt);
        break;
      case "chrome:field:word:insertLink":
        this.insertLinkToWord(params.link, params.text);
        break;
      case "chrome:field:word:toggletoolbar":
        this.toggleWordToolbar();
        break;
      default:
        this.base(message, params);
        break;      
    }
  },

  isEnabled: function() {
    return this.activeXAvailable && this.base();
  },

  initWord: function() {
    this._wordObj = null;
    var word = this.wordObj();
    if (word) {
      WordOCX_Initialize(word);
      setTimeout($sc.proxy(function() {       
        var obj = this.wordObj();
        if (obj == null) return;
        obj.CreateNew("Word.Document");
        obj.currentView = word.ActiveDocument.ActiveWindow.View.Type;        
        if (this.chrome.data.custom.downloadLink) {
          obj.Open(this.chrome.data.custom.downloadLink, "Word.Document");
        } 
        else {
          obj.CreateNew("Word.Document");
        }          
      }, this), 500);
    }
  },

  insertMediaToWord: function(imagePath, alt) {    
    var word = this.wordObj();
    if(word != null) {
      WordOCX_InsertPicture(word, imagePath, alt);  
    }
  },

  insertLinkToWord: function(link, defaultText) {
    var word = this.wordObj();
    if(word != null) {
      WordOCX_InsertLink(word, link, defaultText);  
    }
  },

  hasModifications: function() {
    var obj = this.wordObj();
    return obj && obj.IsOpened != 'undefined' && obj.IsOpened == true && obj.IsDirty == true; 
  },
  
  key: function() {
    return "word field";
  },

  layoutRoot: function() {    
    return this.chrome.element;
  },

  onDelete: function() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
    }

    if (this.onSaveHandler) {
       Sitecore.PageModes.PageEditor.onSave.stopObserving(this.onSaveHandler); 
    }

    if (this._wordObj && this._wordObj.IsOpened) {
      this._wordObj.Close();
    }

    this._wordObj = null;
  },

  onHide: function() {
  },
  
  onMouseDown: function(e) {
  },   

  onShow: function() { 
  },

  toggleWordToolbar: function() {
    var word = this.wordObj();
    if(word != null) {
      WordOCX_ToggleToolbar(word);  
    }
  },

  updateWordField: function() {
     var word = this.wordObj();  
     if (word == null) {
      return;
     }

     var uploadLink = this.chrome.data.custom.uploadLink;
     if(uploadLink && (word.IsDirty || word.fileWasOpened)){
       WordOCX_UploadDocument(word, uploadLink, true);
     }

     var fieldValue = $sc(word).nextAll("input.scWordBlobValue");
     if (fieldValue.length > 0 && fieldValue[0].id.indexOf("flds_") == 0) {
        var blobID = this.chrome.data.custom.blobID;
        if (blobID) {
          fieldValue[0].value = blobID;
        }
     }
     else {
      console.error("word field value input was not found");
     }
  },

  wordObj: function() {        
    if (!this._wordObj) {
      this._wordObj = this.chrome.element.get(0).firstChild;
    }
    
    return this._wordObj;  
  },

  _checkWordFieldModified: function() {    
    if (this.hasModifications()) {
      Sitecore.PageModes.PageEditor.setModified(true);
    }
  },

  _getHeight: function(html, width, maxHeight) {
      if(html == "") {
        return -1;
      }

      var doc = document;

      var element = doc.createElement("span");
      element.innerHTML = html;
      element.firstChild.style.display = "";
  
      if(typeof(maxHeight) == 'undefined') {
        maxHeight = doc.body.offsetHeight;
      }
  
      
      var div = $sc("<div style=\"position:absolute;left:99999;top:99999;width:" + width + "px;height:" + maxHeight + "px\"></div>")
                .appendTo(doc.body);
          
      var span = doc.createElement("span");
      div.append(span);
 
      span.appendChild(element); 
  
      var height = span.offsetHeight;
      div.remove();
  
      if(height > maxHeight) {
        height = maxHeight;
      }
  
      return height;
   }
});
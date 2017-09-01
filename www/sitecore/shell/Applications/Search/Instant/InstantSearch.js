var InstantSearch = Class.create({
  initialize: function(control) {
    if (!control) {
      return; /* index or searchbox is not available */
    }
  
    this.control = $(control);
    this.results = new Array();
    this.popupWidth = 350;
    this.requestVersion = 0;
    this.displayVersion = 0;
    
    this.control.observe("keydown", this.onKeyDown.bindAsEventListener(this), true);
    this.control.observe("keyup", this.onKeyUp.bindAsEventListener(this));
    this.control.observe("focus", function(e) { $(e.target).addClassName("focus"); });
    
    this.control.observe("blur", function(e) { 
      $(e.target).removeClassName("focus"); 
      instantSearch.hide();
    });
    
    Event.observe(window, "resize", this.onResize.bindAsEventListener(this));

    scForm.registerKey("c191", "javascript:instantSearch.focus();");
    
    if (!this.progress) {
      this.progress = new Element("img", { src: "/sitecore/shell/themes/standard/images/progress/globalsearch_progress.gif", alt: "", height: "16", width: "16" });
      this.progress.setStyle({ position: "absolute" });
      this.onResize();
      $('Desktop').insert({ after: this.progress });
      this.progress.hide();
    }
  },

  setTimer: function() {
    this.lastKeyPress = new Date();    
    
    if (!this.timerActive) {
      setTimeout(this.checkTimer.bind(this), "150");
      this.timerActive = true;
    }
  },
  
  checkTimer: function() {
    if (!this.lastKeyPress) {
      return;
    }

    var delta = new Date() - this.lastKeyPress;
    
    if (delta > 200) {
      this.search();
      this.timerActive = false;
    }
    else {
      setTimeout(this.checkTimer.bind(this), "150");
    }
  },
  
  search: function() {
    var query = $F(this.control).strip();
    if (!query || query.length < 2) {
      this.hide();
      return;
    }
    
    this.requestVersion++;
    var url = "/sitecore/shell/applications/search/instant/instantsearch.aspx?q=" + encodeURIComponent(query) + "&v=" + this.requestVersion;
    
    var request = new Ajax.Request(url, {
      onSuccess: function (transport) {
        if (transport.getResponseHeader("SC-Login") == 'true') {
          window.top.location = "/sitecore";
          return;
        }
        
        var version = parseInt(request.getHeader('scVersion'));
        instantSearch.showResults(transport.responseText, version);
      },
      onFailure: function(transport, response) {
          scForm.showModalDialog("/sitecore/shell/controls/error.htm", new Array(transport.responseText), "center:yes;help:no;resizable:yes;scroll:yes;status:no;dialogMinHeight:150;dialogMinWidth:250;dialogWidth:580;dialogHeight:150;header:" + scForm.translate('Error'));
        instantSearch.unregisterProgress();
      }
    });
    
    this.registerProgress(query);
  },
  
  showResults: function(html, version) {
    if (version < this.displayVersion) {
      return;
    }
    else {
      this.displayVersion = version;
    }
  
    if (this.popup && this.popup.parentElement) {
      this.popup.remove();
    }
    
    var div = new Element("div", { id: "InstantResults" });

    div.innerHTML = html;
    
    this.popup = div;
    
    this.onResize();
    
    this.popup.observe("keydown", this.onKeyDown.bindAsEventListener(this), true);
    this.popup.observe("keyup", this.onKeyUp.bindAsEventListener(this));

    $('Desktop').insert({ after: div });

    this.setActiveResult(0);
    
    this.parseResults();

    this.popup.style.visibility = 'visible';    
    
    this.unregisterProgress(version);
    this.showCloseButton();
    
    setTimeout("instantSearch.setActiveResult(0)", 25);
  },
  
  parseResults: function() {
    this.results.clear();
    
    $$("#InstantResults a").each(function(element, index) {
      element.resultIndex = index;
      this.results.push(element);
      
      element.observe("mouseover", function(e) {
        var element = e.target;
        if (element.resultIndex != null) {
          this.setActiveResult(element.resultIndex);
        }
      }.bindAsEventListener(this));
      
      element.observe("mousedown", function(e) {
        e.stop();
        this.launch(e.target.parentElement.href);
      }.bindAsEventListener(this));
      
    }.bind(this));
  },
  
  setActiveResult: function(index) {
    this.results.each(function(result, resultIndex) {
      if (index == resultIndex) {
        result.addClassName("active");
      }
      else {
        result.removeClassName("active");
      }
    });
    
    this.activeResultIndex = index;
  },
  
  hide: function() {
    if (this.popup) {
        this.popup.setStyle({ display: "none"});
    }
    
    this.unregisterProgress();
    this.hideCloseButton();
  },
  
  launch: function(href) {
    if (!href) {
      this.launchClassic();
      this.hide();
      return;
    }
    
    if ($(this.results[0]).hasClassName("empty")) {
      return;
    }
     
    var click = href;
    click = click.substring(click.indexOf("#") + 1);

    if (click.startsWith("javascript:")) {
      click = click.substring("javascript:".length);
      eval(click);
    }
    else {
      var message = "search:launchresult(url=" + click + ")";
      scForm.postRequest("", "", "", message);
    }
    this.hide();
  },
  
  launchClassic: function() {
    var query = $F(this.control).strip();
    var message = "system:search(query=" + query + ")";
    scForm.postRequest("", "", "", message);
  },
  
  nextResult: function() {
    var newIndex = this.activeResultIndex + 1;
    if (newIndex == this.results.length) {
      newIndex = 0;
    }
    
    this.setActiveResult(newIndex);
  },
  
  previousResult: function() {
    var newIndex = this.activeResultIndex - 1;
    if (newIndex < 0) {
      newIndex = this.results.length - 1;
    }
    
    this.setActiveResult(newIndex);
  },
  
  focus: function() {
    this.control.focus();
    this.control.select();
  },
  
  onKeyDown: function(e) {
    switch(e.keyCode) {
      case Event.KEY_DOWN:
        e.stop();
        this.nextResult();        
        break;
      case Event.KEY_UP:
        e.stop();
        this.previousResult();
        break;
      case Event.KEY_RETURN:
        e.stop();
        this.launch();
        break;
      case Event.KEY_ESC:
        this.hide();
        e.stop();
        break;
    }    
  },
  
  onKeyUp: function(e) {
    if (scForm.isFunctionKey(e, false)) {
      return;
    }
    
    var key = e.keyCode;   
    if (key == Event.KEY_RETURN) {
      return;
    }
    
    this.setTimer();
  },
  
  onResize: function() {
    var offset = Position.cumulativeOffset(this.control);
    var controlWidth = this.control.getWidth();
        
    if (this.progress) {
      this.progress.setStyle({ left: offset[0] + controlWidth - 18 + "px", top: offset[1] + 2 + "px" });
    }
    if (this.closeButton) {
      this.closeButton.setStyle({ left: offset[0] + controlWidth - 17 + "px", top: offset[1] + 3 + "px" });
    }
  },
  
  showCloseButton: function() {
    if (!this.closeButton) {
      this.closeButton = new Element("img", { src: "/sitecore/shell/themes/standard/images/progress/globalsearch_close.png", alt: "", height: "16", width: "16" });
      this.closeButton.setStyle({ position: "absolute", cursor: "pointer" });
      this.closeButton.observe("click", function(e) { instantSearch.hide(); });
      this.closeButton.observe("mouseover", function(e) { e.target.src = '/sitecore/shell/themes/standard/images/progress/globalsearch_close_h.png'; });
      this.closeButton.observe("mouseout", function(e) { e.target.src = '/sitecore/shell/themes/standard/images/progress/globalsearch_close.png'; });
            
      this.onResize();
      $('Desktop').insert({ after: this.closeButton });
    }
    
    this.closeButton.show();
  },
  
  hideCloseButton: function() {
    if (this.closeButton) {
      this.closeButton.hide();
    }
  },
  
  registerProgress: function(query) {
    this.hideCloseButton();
    this.progress.show();
  },
  
  unregisterProgress: function(version) {
    if (this.progress) {
      this.progress.hide();
    }
  }
});

var instantSearch = null;
Event.observe(window, "load", function() { instantSearch = new InstantSearch($("SearchBox")); });
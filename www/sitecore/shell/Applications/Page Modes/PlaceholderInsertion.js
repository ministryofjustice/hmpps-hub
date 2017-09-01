Sitecore.PageModes.ChromeTypes.PlaceholderInsertion = Base.extend({
  constructor: function(placeholder) {
    this.placeholder = placeholder;
    this.handles = new Array();
    this.defaultLeftMarginValue = 20;

    this.command = $sc.first(this.placeholder.commands, function() { return this.click.indexOf("chrome:placeholder:addControl") > -1; });

    if (!this.command) {
      this.command = new Object();
      this.command.tooltip = Sitecore.PageModes.Texts.AddNewRenderingToPlaceholder;
      this.command.header = Sitecore.PageModes.Texts.AddToHere;
    }
  },

  activate: function () {
    var placeholderName = this.placeholder._displayName;
    var inserter = this;
    var position = 0;

    var renderings = $sc.grep(this.placeholder.type.renderings(),
      function(rendering) {
        return rendering.type.getPlaceholder && rendering.type.getPlaceholder()._displayName == placeholderName;
    });

    inserter.addTarget('top', this.placeholder, position);

    $sc.each(renderings, function() {
      position++;
      
      if (position == 1) {
        return;
      }

      inserter.addTarget('before', this, position - 1);
    });

    if (renderings.length > 0) {
      inserter.addTarget('after', renderings[renderings.length - 1], position);
    }
   
    var length = this.handles.length;
    if (length > 1) {        
      this.handles[length-1].css("margin-top", -this.handles[length-1].outerHeight() + 4 + "px");
    }
  },

  addTarget: function (where, chrome, insertPosition) {
    var handle = $sc("<div class='scInsertionHandle'></div>").attr("title", this.command.tooltip.replace("{0}", this.placeholder.displayName()));
    $sc("<div class='scInsertionHandleLeft scAddToHere'> </div>").appendTo(handle);  
    $sc("<div class='scInsertionHandleCenter'></div>").append($sc("<span></span>").text(this.command.header)).appendTo(handle);
    $sc("<div class='scInsertionHandleRight'></div>").appendTo(handle);
          
    handle.click($sc.proxy(function(e) {
      e.stop();
      Sitecore.PageModes.ChromeManager.setCommandSender(this.placeholder);
      this.placeholder.type.addControl(insertPosition);
    }, this));

    var offset = chrome.position.offset();
    var top = left = "";

    if (where == 'top') {
      top = offset.top;
      left = this.placeholder.position.offset().left;
    }
    else if (where == 'before') {
      top = offset.top;
      left = offset.left;
    }
    else if (where == 'after') {
      var dimensions = chrome.position.dimensions();

      top = offset.top + dimensions.height;
      left = offset.left;
    }
    
    top = top + "px";
    left = left - Math.min(this.defaultLeftMarginValue, left) + "px";

    handle.css({ top: top, left: left});

    handle.appendTo(document.body);    
    this.handles.push(handle);
  },

  deactivate: function() {
    $sc.each(this.handles, function() {
      this.remove();
    });
  }
});
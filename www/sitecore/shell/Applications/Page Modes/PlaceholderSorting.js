Sitecore.PageModes.ChromeTypes.PlaceholderSorting = Base.extend({
  constructor: function(placeholder, rendering) {
    this.placeholder = placeholder;
    this.rendering = rendering;
    this.handles = new Array();
    this.defaultLeftMarginValue = 20;
  },
  
  activate: function() {
    var sorting = this;
    
    var rendering = this.rendering;
    var renderings = this.placeholder.type.renderings();
    var sortableRenderingPosition = $sc.inArray(rendering, renderings);

    var position = 0;    
    var totalPositionCount = renderings.length + 1;

    if (renderings.length == 0) {
       sorting.insertSortingHandle('before', this.placeholder, position, totalPositionCount);
       return;
    }
    
    $sc.each(renderings, function() {
      if (this != rendering && (sortableRenderingPosition < 0 || sortableRenderingPosition != position - 1)) {
        sorting.insertSortingHandle('before', this, position, totalPositionCount);
      }

      position++;
    });

    // if sortable rendering is not the last rendering in the placeholder
    if (renderings.length > 0 && renderings[renderings.length - 1] != rendering) {
      sorting.insertSortingHandle('after', renderings[renderings.length - 1], position, totalPositionCount);
    }
    
    //this.handles[length-1].css("margin-top", -this.handles[length-1].outerHeight() + 2 + "px");
  },
  
  deactivate: function() {
    $sc.each(this.handles, function() {
      this.remove();
    });
  },
    
  insertSortingHandle: function(where, chrome, insertPosition, positionCount) {
    var title = Sitecore.PageModes.Texts.MoveToPositionInPlaceholder.replace("{0}", insertPosition + 1).replace("{1}", positionCount).replace("{2}", this.placeholder.displayName());
    var handle = $sc("<div class='scSortingHandle'></div>").attr("title", title);
    
    $sc("<div class='scInsertionHandleLeft scMoveToHere'> </div>").appendTo(handle);    
    $sc("<div class='scInsertionHandleCenter'></div>").append($sc("<span></span>").text(Sitecore.PageModes.Texts.MoveToHere)).appendTo(handle);    
    $sc("<div class='scInsertionHandleRight'></div>").appendTo(handle);
                
    handle.click($sc.proxy(function(e) {
      e.stop();
      Sitecore.PageModes.DesignManager.sortingEnd();
      Sitecore.PageModes.DesignManager.moveControlTo(this.rendering, this.placeholder, insertPosition);
      Sitecore.PageModes.ChromeManager.scrollChromeIntoView(this.rendering);
    }, this));
           
    var offset = chrome.position.offset();
    var top = left = "";

    if (where == 'before') {
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

    handle.css({ left: left, top: top});

    handle.appendTo(document.body);        
    this.handles.push(handle);
  }
});
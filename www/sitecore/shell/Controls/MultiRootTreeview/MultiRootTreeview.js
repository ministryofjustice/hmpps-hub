if (typeof(Sitecore) != "undefined" || Sitecore.Treeview) {  
  Sitecore.Treeview.getDataContext = function(node) {
    var startIdx = node.id.indexOf("_");
    var endIdx = node.id.lastIndexOf("_");
    if (endIdx <= startIdx) {
      return null;
    }

    var dataContextId = node.id.substring(startIdx + 1, endIdx);
    var dataContextLowered;
    if (dataContextId) {
      dataContextLowered = dataContextId.toLowerCase();
    }

    var datacontexts = node.up().previous(".scDataContexts");    
    if (!datacontexts) {
      return null;
    }

    var r = datacontexts.childElements().find(function(e) {
      var id = e.readAttribute("data-context-id");
      return id && id.toLowerCase() === dataContextLowered; 
    });

    if (!r) {
      return null;
    }

    return {id: dataContextId, parameters: r.value || ""};
  };

  Sitecore.Treeview.onTreeGlyphClick = function(node, treeElement, id) {
    var glyph = node.down();
    var isMultiRoot = false;
    if (glyph.src.indexOf("treemenu_collapsed") >= 0 && glyph.src.indexOf("noexpand15x15") == -1) {
      this.setGlyph(glyph, "/sc-spinner16.gif");
    
      var content = $F(treeElement.id + "_Database");
      var dataContext = this.getDataContext(node);    
      body = treeElement.id + "_Selected=" + escape($F(treeElement.id + "_Selected")) + "&" + treeElement.id + "_Parameters=";
      if (dataContext) {
        isMultiRoot = true;
        body += escape(dataContext.parameters);
        if (dataContext.id) {
          body += "&" + treeElement.id + "_cur_datacontext=" + escape(dataContext.id);
        }
      }
      else {
        body += escape($F(treeElement.id + "_Parameters"));
      }

      var templateIDs = $(treeElement.id + "_templateIDs");   
      if (templateIDs) {
        body += "&" + treeElement.id + "_templateIDs=" + escape(templateIDs.value);
      }

      var displayFieldName = $(treeElement.id + "_displayFieldName");
      if (displayFieldName) {
        body += "&" + treeElement.id + "_displayFieldName=" + escape(displayFieldName.value);
      }

      if (window.scCSRFToken && window.scCSRFToken.key && window.scCSRFToken.value) {
        body += "&" + window.scCSRFToken.key + "=" + window.scCSRFToken.value;
      }

      new Ajax.Request("/sitecore/shell/Controls/TreeviewEx/TreeviewEx.aspx?treeid=" + encodeURIComponent(treeElement.id) + "&id=" + encodeURIComponent(id) + (content != null ? "&sc_content=" + content : "") + (isMultiRoot ? "&mr=1" : ""), {
          method:"post",
          postBody: body,
          onSuccess: function(transport) { Sitecore.Treeview.expandTreeNode(node, transport.responseText) },
          onException: function(request, ex){ alert(ex) },
          onFailure: function(request){ alert("Failed") }
        });
    }
    else if (glyph.src.indexOf("treemenu_expanded") >= 0) {
      this.collapseTreeNode(node);
    }
  
    return false;
  };

  Sitecore.Treeview.onTreeNodeClickEx = Sitecore.Treeview.onTreeNodeClick;
  Sitecore.Treeview.onTreeNodeClick = function(node, treeElement, evt, id, click) {
      var dataContext = this.getDataContext(node);
      if (!dataContext) {
        return this.onTreeNodeClickEx(node, treeElement, evt, id, click);
      }

      if (dataContext.id) {
        var dataContextField = $(treeElement.id + "_cur_datacontext");
        if (dataContextField) {
          dataContextField.value = dataContext.id;
        }
      }

      if (dataContext.parameters) {
        var dataParametersField = $(treeElement.id + "_Parameters");
        if (dataParametersField) {
          dataParametersField.value = dataContext.parameters;
        }
      }
      
      return this.onTreeNodeClickEx(node, treeElement, evt, id, click);
  }
}



Sitecore.PageModes.ChromeControls = Base.extend({
  constructor: function () {
    var cssClass = Sitecore.PageModes.PageEditor.languageCssClass() + (Sitecore.PageModes.Utility.isIE ? " ie" : "");
    this.toolbar = $sc("<div class='scChromeToolbar " + cssClass + "'></div>"); 
   
    // we need this element to calculate real dimensions of toolbar. Since
    // the toolbar will change the position (top and left) on the page 
    // it's dimensions may be calculated incorrectly when it is docked to the page's border. 
    this.dummy = this.toolbar.clone().attr("id", "scDummyToolbar");
    this.dummy.prependTo(document.body);
    
    this.commands = $sc("<div class='scChromeControls'></div>");
    this._overlay = $sc("<div class='scControlsOverlay'></div>")
                    .click(function(e) {e.stop();})
                    .hide()
                    .appendTo(this.toolbar);

    this.commands.hide().click($sc.proxy(function (e) {
        this.hideDsCommands();
        this.hideWorkflowCommands();
        this.hideMoreCommands();
        this.hideAncestors();
        this.triggerEvent("click");
        e.stop();        
      }, this));
                                      
    this.toolbar.append(this.commands);
    this.toolbar.appendTo(document.body);

    this.ancestorList = $sc("<div class='scChromeDropDown " + cssClass + "'></div>");
    this.ancestorList.hide().prependTo(document.body);

    this.workflowCommands = $sc("<div class='scChromeDropDown " + cssClass + "'></div>");
    this.workflowCommands.hide().prependTo(document.body);

    this.dsCommands = $sc("<div class='scChromeDropDown " + cssClass + "'></div>");
    this.dsCommands.hide().prependTo(document.body);

    this.moreCommands = $sc("<div class='scChromeDropDown " + cssClass + "'></div>");
    this.moreCommands.hide().prependTo(document.body);            
    
    this.positioningManager = new Sitecore.PageModes.PositioningManager();    
    Sitecore.PageModes.PageEditor.onWindowScroll.observe($sc.proxy(this.scrollHandler, this));
    Sitecore.PageModes.ChromeManager.chromeUpdating.observe($sc.proxy(function() {
        $sc(".scToolbarIndicator", this.commands)
          .delay(Sitecore.PageModes.ChromeOverlay.animationStartDelay)
          .fadeTo(0, 1);
        this.showOverlay();
    }, this));

    Sitecore.PageModes.ChromeManager.chromeUpdated.observe($sc.proxy(function() {
        $sc(".scToolbarIndicator", this.commands).stop(true).fadeTo(0, 0)       
        this.hideOverlay();        
    }, this));
        
    this.eventDispatcher = $sc({});
  },
  
  activate: function() {
    this.toolbar.removeClass("scInvisible");
  },

  deactivate: function() {
    this.toolbar.addClass("scInvisible");
  },

  usagesPathPatterns: [],

  getCommandRenderer: function(click, chrome) {
    try {
      var command = Sitecore.PageModes.Utility.parseCommandClick(click);
      if (command && command.message) {
        var key = chrome.key() + ":" + command.message;
        var renderer = Sitecore.PageModes.ChromeControls.commandRenderers[key];
        if (renderer) {
          return renderer;
        }

        return Sitecore.PageModes.ChromeControls.commandRenderers[command.message];
      }
    }
    catch(e) {
      return null;
    }
  },
    
  hide: function() {
    this.chrome = null;
    this.dimensions = null;
    this.commands.hide();
    this.hideDsCommands();
    this.hideWorkflowCommands();
    this.hideMoreCommands();
    this.hideAncestors();
    this.triggerEvent("hide");
    this.hideOverlay();
  },

  hideAncestors: function() {
    if (this.ancestorList.is(":visible")) {
      this.ancestorList.hide();
      this.commands.find(".scChromeComboButton").removeClass("scDdExpanded");      
    }     
  },

  hideDsCommands: function () {
    if (this.dsCommands.is(":visible")) {
      this.dsCommands.hide();
      this.commands.find(".scChromeDsSection").removeClass("scDdExpanded");
    }
  },

  hideWorkflowCommands: function () {
    if (this.workflowCommands.is(":visible")) {
      this.workflowCommands.hide();
      this.commands.find(".scChromeWorkflowSection").removeClass("scDdExpanded");
    }
  },

  hideMoreCommands: function() {
    if (this.moreCommands.is(":visible")) {
      this.moreCommands.hide();
      this.commands.find(".scChromeMoreSection").removeClass("scDdExpanded");      
    }  
  },

  observe: function(eventName, handler) {
    this.eventDispatcher.bind(Sitecore.PageModes.ChromeControls.eventNameSpace + eventName, handler);
  },

  stopObserving: function(eventName, handler) {
    this.eventDispatcher.unbind(Sitecore.PageModes.ChromeControls.eventNameSpace + eventName, handler);
  },

  triggerEvent: function(eventName) {
    this.eventDispatcher.trigger(Sitecore.PageModes.ChromeControls.eventNameSpace + eventName);
  },
  
  showAncestors: function() {
    if (!this.ancestorList.is(":visible")) {
      this.ancestorList.show();
      this.commands.find(".scChromeComboButton").addClass("scDdExpanded");      
    }
  },

  showDsCommands: function () {
    if (!this.dsCommands.is(":visible")) {
      this.hideMoreCommands();
      this.hideWorkflowCommands();
      this.dsCommands.show();
      this.commands.find(".scChromeDsSection").addClass("scDdExpanded");
    }
  },

  showWorkflowCommands: function () {
    if (!this.workflowCommands.is(":visible")) {
      this.hideDsCommands();
      this.hideMoreCommands();
      this.workflowCommands.show();
      this.commands.find(".scChromeWorkflowSection").addClass("scDdExpanded");
    }
  },

  showMoreCommands: function() {
    if (!this.moreCommands.is(":visible")) {
      this.hideDsCommands();
      this.hideWorkflowCommands();
      this.moreCommands.show();
      this.commands.find(".scChromeMoreSection").addClass("scDdExpanded");      
    }  
  },

  renderAncestors: function() {  
    this.ancestorList.update("");
    var ancestors = this.chrome.ancestors();
    for(var i = ancestors.length - 1; i >= 0; i--) {
      if(!ancestors[i].isFake()) {
        var level = ancestors.length - i - 1;
        this.ancestorList.append(this.renderAncestor(ancestors[i], level));
      }
    }

    return this.ancestorList;
  },

  renderAncestor: function(ancestor, level) {    
    var paddingValue = 16;
    var row = $sc("<a class='scChromeDropDownRow' href='#'></a>");
    if (level > 0) {          
      var levelConnection = $sc("<img src='/sitecore/shell/themes/standard/images/pageeditor/corner.gif' class='scLevelConnection' />");
      levelConnection.css("padding-left", (level - 1) * paddingValue + "px");      
      row.append(levelConnection);
    }   
       
    $sc("<img class='scChromeAncestorIcon' />").attr("src", ancestor.icon()).appendTo(row);                
    $sc("<span></span>").text(ancestor.displayName()).appendTo(row);
              
    row.mouseenter(function() {
      ancestor.showHover("ancestor menu mouseenter");
    });

    row.mouseleave(function() {
      ancestor.hideHover("ancestor menu mouseleave");
    });

    row.click($sc.proxy(function(e) {
      e.stop();      
      this.hideAncestors();
      Sitecore.PageModes.ChromeManager.select(ancestor);
    }, this));
    
    return row;
  },

  /*
  command:
    -- click
    -- header
    -- tooltip
    -- icon
  */
  renderCommand: function(command, chrome, isMoreCommand /*Defines if commnad appears in More dropDown*/ ) {           
    var renderer = this.getCommandRenderer(command.click, chrome.type);
    if (renderer) {
      var result = renderer.call(chrome.type, command, isMoreCommand, this);
      if (result) {
        return result;
      }

      if (result === null) {
        return null;
      }
    }

    return this.renderCommandTag(command, chrome, isMoreCommand);
  },

  renderCommandTag: function(command, chrome, isMoreCommand /*Defines if commnad appears in 'More' dropDown*/) {
    var tag = $sc("<a href='#' ></a>").attr("title", command.tooltip);
    tag.addClass(isMoreCommand ? "scChromeDropDownRow" : "scChromeCommand");
    var isDisabled = (chrome.isReadOnly() || command.disabled) && !command.alwaysEnabled;
    if (!command.click) {
      isDisabled = true;
    }
    var icon = !isDisabled ? command.icon : command.disabledIcon;
    $sc("<img />").attr({ src: icon, alt: command.tooltip }).appendTo(tag);    
    if (isMoreCommand) {
      $sc("<span></span>").text(command.header ? command.header : command.tooltip).appendTo(tag);      
    }

    if (isDisabled) {
      tag.addClass("scDisabledCommand");      
      return tag;
    }

    if (command.click.indexOf("chrome:") == 0) {
      var click = Sitecore.PageModes.Utility.parseCommandClick(command.click);
      if (command.type == "common" || command.type == "datasourcesmenu" || command.type == "workflow") {
        tag.click(function(e) {       
          Sitecore.PageModes.ChromeManager.setCommandSender(chrome);
          Sitecore.PageModes.ChromeManager.handleCommonCommands(chrome, click.message, click.params);
          if (command.click.indexOf("chrome:rendering:sort") > -1) {
            e.stop();
          }
        });
      }
      else {
        tag.click(function(e) {       
          Sitecore.PageModes.ChromeManager.setCommandSender(chrome);
          chrome.handleMessage(click.message, click.params);
          if (command.click.indexOf("chrome:rendering:sort") > -1) {
            e.stop();
          }
        });
      }
    }
    else if (command.click.indexOf("javascript:") == 0) {      
      if ($sc.util().isNoStandardsIE()) {
        tag.get(0).onclick = new Function(command.click.replace("javascript:",""));
      }
      else {
        tag.get(0).setAttribute("onclick", command.click);
      }

      tag.mouseup(function(e) {        
        Sitecore.PageModes.ChromeManager.setCommandSender(chrome);        
      });
    }
    else {
      tag.click( function(e) {       
        Sitecore.PageModes.ChromeManager.setCommandSender(chrome);
        eval(command.click);        
      });
    }
    
    return tag;
  },

  renderDatasourceUsagesCommand: function () {
    var container = $sc("<a href='#' class='scChromeCommand scChromeMoreSection'></a>");
    var tag = $sc("<span class='scChromeCommandText'></span>");
    var experienceEditor = Sitecore.PageModes.PageEditor.ExperienceEditor();
    var context = experienceEditor.generateDefaultContext();
    var itemId = this.getItemId();
    var database = context.currentContext.database;
    var version = this.getItemVersion();
    context.currentContext.itemId = itemId;
    context.currentContext.value = this.usagesPathPatterns.join("|");
      experienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Datasources.GetDatasourceUsagesCount", function (response) {
      var result = response.responseValue.value;
      var count = result ? result.length : 1;
      tag.text(Sitecore.PageModes.Texts.Usage + " " + count);
      container.attr("title", Sitecore.PageModes.Texts.TheNumberOfWebpagesIncludingThisOneWhereThisAssociatedContentIsUsed.replace("{0}", count));
    }).execute(context);

    tag.click($sc.proxy(function (e) {
      e.stop();

      this.hideAncestors();    
      this.hideDsCommands();
      this.hideWorkflowCommands();
      this.hideMoreCommands();

      experienceEditor.Dialogs.showModalDialog("/sitecore/client/Applications/ExperienceEditor/Dialogs/ContentUsage/?itemId=" + itemId + "&db=" + database + "&version=" + version);
    }, this));

    container.append(tag);
    return container;
  },

  renderExpandCommand: function() {
    var excludeFakeParents = true;

    var parent = this.chrome.parent(excludeFakeParents);

    if (!parent) {
      return;
    }

    var container = $sc("<span class='scChromeComboButton' ></span>");

    var tag = $sc("<a href='#' class='scChromeCommand'></a>").attr("title", Sitecore.PageModes.Texts.SelectParentElement.replace("{0}", parent.displayName()) );    
    tag.mouseenter(function() {
      parent.showHover("ancestor menu mouseenter");
    });

    tag.mouseleave(function() {
      parent.hideHover("ancestor menu mouseleave");
    });

    tag.click($sc.proxy(function(e) {
      e.stop();
      this.chrome.expand();
    }, this));

    var icon = $sc("<img />").attr({ src: "/sitecore/shell/~/icon/Office/16x16/elements_tree.png.aspx", alt: parent.displayName() });
    tag.append(icon);

    container.append(tag);
    container.append(this.renderExpandDropdown());

    return container;
  },

  renderExpandDropdown: function() {
    var tag = $sc("<a class='scChromeCommand scExpandDropdown' href='#' ></a>").attr("title", Sitecore.PageModes.Texts.ShowAncestors);

    tag.click($sc.proxy(function(e) {
      e.stop();

      var sender = $sc(e.currentTarget);            
      var offset = sender.offset();
      var height = sender.outerHeight(); 
      this.showAncestorList({top: offset.top + height, left: offset.left});
    }, this));

    $sc("<img src='/sitecore/shell/Themes/Standard/Images/menudropdown_black9x8.png' />")
      .attr("alt", Sitecore.PageModes.Texts.ShowAncestors )
      .appendTo(tag);
   
    return tag;
  },

  renderDsSection: function () {
    var hasDs = Sitecore.PageModes.ChromeManager.selectedChrome().data.contextItemUri.indexOf(Sitecore.PageModes.PageEditor.itemID()) == -1;
    var description = hasDs ? Sitecore.PageModes.Texts.ChangeAssociatedContent : Sitecore.PageModes.Texts.AddAssociatedContent;
    var imageSrc = "/sitecore/shell/client/Sitecore/Speak/Ribbon/Assets/Images/SitecoreIcons/16x16/data_" + (hasDs ? "check" : "plus") + ".png";

    Sitecore.PageModes.Utility.replaceCommandsAttributes(this.dsCommands.find("a"), "title", "{dsTooltip}", description);
    Sitecore.PageModes.Utility.replaceCommandsAttributes(this.dsCommands.find("span"), null, "{dsHeader}", description);
    Sitecore.PageModes.Utility.replaceCommandsAttributes(this.dsCommands.find("img"), "alt", "{dsTooltip}", description);
    Sitecore.PageModes.Utility.replaceCommandsAttributes(this.dsCommands.find("img"), "src", "/temp/IconCache/Office/16x16/data.png", imageSrc);

    var template = [
      "<a href='#' class='scChromeCommand scChromeDsSection' title='${tooltip}'>",
      "  <img src='${dsIcon}' alt='${tooltip}' />",
      "  <img src='/sitecore/shell/Themes/Standard/Images/menudropdown_black9x8.png' alt='${tooltip}' />",
      "</a>"
    ].join("\n");

    var tag = $sc.util().renderTemplate("sc-renderDsSection", template, {
      tooltip: Sitecore.PageModes.Texts.AddOrChangeTheAssociatedContentForThisComponent,
      dsIcon: imageSrc
    });

    tag.click($sc.proxy(function (e) {
      e.stop();
      var sender = $sc(e.currentTarget);

      var offset = sender.offset();
      var height = sender.outerHeight();
      this.showDsCommandsList({ top: offset.top + height, left: offset.left });
    }, this));

    return tag;
  },

  renderWorkflowSection: function () {
    var hasCommands = this.workflowCommands.children().length > 0;
    var hasWorkflow = this.chrome.hasWorkflow;
    var workflowState = Sitecore.PageModes.Texts.No;
    if (hasWorkflow) {
      workflowState = this.chrome.isFinalWorkflowStep ? Sitecore.PageModes.Texts.Final : Sitecore.PageModes.Texts.NotFinal;
    }

    var workflowDescription = hasWorkflow ? this.chrome.workflowDescription : Sitecore.PageModes.Texts.TheAssociatedContentDoesNotHaveAnAssignedWorkflow;
    var template = [
      "<a href='#' class='scChromeCommand scChromeWorkflowSection' title='${workflowDescription}'>",
      "  <span class='scChromeCommandText'>${texts.Workflow}: ${workflowState}</span>",
      "  <img src='/sitecore/shell/Themes/Standard/Images/menudropdown_black9x8.png' alt='${texts.Workflow}' style='visibility:${visible}' />",
      "</a>"
    ].join("\n");

    var tag = $sc.util().renderTemplate("sc-renderWorkflowSection", template, {
      texts: Sitecore.PageModes.Texts,
      workflowDescription: workflowDescription,
      workflowState: workflowState,
      visible: hasCommands ? "visible" : "hidden"
    });

    tag.click($sc.proxy(function (e) {
      e.stop();
      var sender = $sc(e.currentTarget);

      var offset = sender.offset();
      var height = sender.outerHeight();
      if (hasCommands) {
        this.showWorkflowCommandsList({ top: offset.top + height, left: offset.left });
      }
    }, this));

    return tag;
  },

  renderMoreSection: function() {
    var template = [
      "<a href='#' class='scChromeCommand scChromeMoreSection' title='${texts.ShowMoreCommands}'>",
      "  <span class='scChromeCommandText'>${texts.More}</span>",
      "  <img src='/sitecore/shell/Themes/Standard/Images/menudropdown_black9x8.png' alt='${texts.ShowMoreCommands}' />",
      "</a>"
    ].join("\n");

    var tag = $sc.util().renderTemplate("sc-renderMoreSection", template, {
      texts: Sitecore.PageModes.Texts
    });

    tag.click($sc.proxy(function(e) {
      e.stop();
      var sender = $sc(e.currentTarget);
                  
      var offset = sender.offset();
      var height = sender.outerHeight();     
      this.showMoreCommandsList({top: offset.top + height, left:offset.left});
    }, this));
    
    return tag;
  },
   
  renderTitle: function() {
    var container = $sc("<div class='scChromeName'></div>");

    var tooltip = this.chrome.data.expandedDisplayName || this.chrome.displayName();

    var displayName = this.chrome.displayName();
    
    var isReadOnly = this.chrome.isReadOnly();

    var title = $sc("<span class='scChromeText'></span>")     
      .text($sc.truncate(displayName, this._maxDisplayNameLength))
      .appendTo(container);

    if (isReadOnly) {
      $sc("<span class='scReadonlyText'></span>").text("["+ Sitecore.PageModes.Texts.ReadOnly +"]").appendTo(container);
    }
    else {
      title.attr("title", tooltip);
    }

    $sc("<img class='scToolbarIndicator' src='/sitecore/shell/Themes/Standard/Images/PageEditor/toolbar_progress.gif' />")
      .css({opacity : 0.0})
      .appendTo(container);
            
    return container;
  },

  renderSeparator: function() {
    return $sc("<span class='scChromeCommandSectionDelimiter'>|</span>");
  },

  canRenderWorkflowCommands: function () {
    return Sitecore.PageModes.ChromeManager.selectedChrome().data.contextItemUri.indexOf(Sitecore.PageModes.PageEditor.itemID()) == -1;
  },

  updateCommands: function() {
    if (this.startedUpdateCommands) {
      return;
    }

    this.startedUpdateCommands = true;

    this.hideOverlay();
    this.commands.show();    
    this.commands.update("");

    this.hideDsCommands();
    this.dsCommands.update("");

    this.hideWorkflowCommands();
    this.workflowCommands.update("");
    
    this.hideMoreCommands();
    this.moreCommands.update("");

    /* first row - icon and name */   
    this.commands.append(this.renderTitle());

    /* second row - commands */
    var commandsRow = $sc("<div id='commandRow'></div>").appendTo(this.commands);
    var parent = this.chrome.parent();

    var hasCommands = false;
    var commandsCounter = 0;
    
    var commonCommands = [], commands = [], stickyCommands = [];
    var workflowCommands = this.getWorkflowCommands();
    this.chrome.hasWorkflow = workflowCommands || (workflowCommands != null && workflowCommands.commands);
    if (this.chrome.hasWorkflow && workflowCommands != true) {
      this.chrome.workflowDescription = workflowCommands.description;
      commonCommands = workflowCommands.commands || commonCommands;
      this.chrome.isFinalWorkflowStep = workflowCommands.isFinalWorkflowStep;
    }
    $sc.each(this.chrome.commands(), function () { 
      if (this.type == "common" || this.type == "datasourcesmenu" || this.type == "workflow") {
        commonCommands.push(this);
        return;
      }

      if (this.type == "sticky") {
        stickyCommands.push(this);
        return;
      }
        
      commands.push(this);        
    });

    var insertionIdx = this._maxToolbarCommands - stickyCommands.length;
    var nonSeparatorsCount = 0;
    var ii = 0;
    for (ii; ii < commands.length; ii++) {
      if (commands[ii].type === "separator") {
        continue;
      }
      
      if (++nonSeparatorsCount >  insertionIdx) {        
        break;
      }
    }

    var args = [ii, 0].concat(stickyCommands);
    Array.prototype.splice.apply(commands, args);
               
    if (parent != null && parent.key() == "field") {
      var parentCommandsAdded = false;
      var commandClicks = $sc.map(commands, function() { return this.click; });

      $sc.each(parent.commands(), $sc.proxy(function(idx, command) {
        if (command.type != "common" && command.type != "datasourcesmenu" && command.type != "workflow" && $sc.inArray(command.click, commandClicks) < 0) {
          var res = this._addCommand(command, parent, commandsCounter);
          commandsCounter = commandsCounter + res;
          hasCommands = hasCommands || res;
          parentCommandsAdded = true;
        }
      }, this));

      if (parentCommandsAdded 
            && commands.length > 0 
            && commandsCounter < this._maxToolbarCommands /*at least one command will be added to toolbar*/ 
            && this._isSeparatorAcceptible()) {
        commandsRow.append(this.renderSeparator());
      }
    }
   
    $sc.each(commands, $sc.proxy(function(idx, command) {
      if (command.hidden) {
        return;
      }
     
      var res = this._addCommand(command, this.chrome, commandsCounter);
      commandsCounter = commandsCounter +  res;
      hasCommands = hasCommands || res;
    }, this));
        
    var isDatasourceUsagesCommand = false;
    var isAncestorsRendered = false;
    /*The "more" section */
    $sc.each(commonCommands, $sc.proxy(function (i, c) {
      var idx = this._maxToolbarCommands;/*The command should appear in "More" dropdown */
      this._addCommand(c, this.chrome, idx); 
    }, this));

    if (this._hasDsCommands()) {
      if (hasCommands && this._isSeparatorAcceptible()) {
        commandsRow.append(this.renderSeparator());
      }

      commandsRow.append(this.renderDsSection());
    }

    if (this.canRenderWorkflowCommands()) {
      if (hasCommands && this._isSeparatorAcceptible()) {
        commandsRow.append(this.renderSeparator());
      }

      commandsRow.append(this.renderWorkflowSection());
    }

    if (!isDatasourceUsagesCommand) {
      /* The "datasource usages" section */
      isDatasourceUsagesCommand = true;
      var datasourceUsagesCommand = this.renderDatasourceUsagesCommand();
      if (datasourceUsagesCommand) {
        if (hasCommands && this._isSeparatorAcceptible()) {
          commandsRow.append(this.renderSeparator());
        }

        commandsRow.append(datasourceUsagesCommand);
        hasCommands = true;
      }
    }

    if (!isAncestorsRendered) {
      /* The "expand" section */
      isAncestorsRendered = true;
      var expandCommand = this.renderExpandCommand();
      if (expandCommand) {
        if (hasCommands && this._isSeparatorAcceptible()) {
          commandsRow.append(this.renderSeparator());
        }

        commandsRow.append(expandCommand);
        hasCommands = true;
      }
    }

    if (this._hasMoreCommands()) {
      if (hasCommands && this._isSeparatorAcceptible()) {
        commandsRow.append(this.renderSeparator());
      }

      commandsRow.append(this.renderMoreSection());
    }

    if (commandsRow.children().length > 0) {
      commandsRow.append($sc("<div class='scClearBoth'></div>"));      
    }

    this.startedUpdateCommands = false;   
  },

  getItemId: function () {
    var contextUriArray = this.chrome.data.contextItemUri.split("/");
    return  contextUriArray[contextUriArray.length - 1].split("?")[0];
  },

  getItemVersion: function() {
    var contextItemUri = this.chrome.data.contextItemUri;
    var fragments = contextItemUri.split("/")[contextItemUri.split("/").length - 1].split("?");
    if (!fragments
      || fragments.length === 0) {
      return "";
    }
    var verFragments = fragments[1].split(";ver=");
    if (!verFragments
      || verFragments.length === 0) {
      return "";
    }

    return verFragments[1];
  },

  getWorkflowCommands: function () {
    var experienceEditor = Sitecore.PageModes.PageEditor.ExperienceEditor();
    var context = experienceEditor.generateDefaultContext();
    context.currentContext.itemId = this.getItemId();
    var result = null;
      experienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Workflow.GetWorkFlowCommands", function (response) {
      result = response.responseValue.value;
    }).execute(context);

    if (result == null) {
      return null;
    }

    if (result.commands == null) {
      return result;
    }

    var workflowCommands = [];
    $sc.each(result.commands, function () {
      this.click = "javascript:Sitecore.PageModes.PageEditor.postRequest('" + this.click + "',null,false)";
      workflowCommands.push(this);
    });

    return { commands: workflowCommands, description: result.description, isFinalWorkflowStep: result.isFinalWorkflowStep };
  },

  scrollHandler: function() {
    if (!this.commands.is(":visible") || this.chrome == null) return;
    this.triggerEvent("scroll");
    this.hideDsCommands();
    this.hideWorkflowCommands();
    this.hideMoreCommands();
    this.hideAncestors();          
    var fixedPosition = this.positioningManager.getFixedChromeRelativeElementPosition(this.dimensions == null ? { height: this.toolbar.outerHeight(), width: this.toolbar.outerWidth() } : this.dimensions, this.chrome);
    this.toolbar.css({ left: fixedPosition.left + 'px', top: fixedPosition.top + 'px' });    
  },

  show: function(chrome, duration) {
    if (this.chrome != chrome) {
      this.chrome = chrome;
      Sitecore.PageModes.ChromeManager.select(chrome);
      this.updateCommands();      
      this.dummy.update(this.toolbar.get(0).innerHTML);
      this.dimensions = {height : this.dummy.outerHeight(), width: this.dummy.outerWidth()};      
    }
        
    this.hideAncestors();
                
    var toolbarDimensions = this.dimensions == null ? 
                              {height: this.toolbar.outerHeight(), width: this.toolbar.outerWidth()} : null;
    var fixedPosition;
    if (duration) {          
      fixedPosition = this.positioningManager.getFixedChromeRelativeElementPosition(this.dimensions == null ? toolbarDimensions : this.dimensions, chrome);            
      this.toolbar.stop(true).animate({ left: fixedPosition.left + "px", top: fixedPosition.top + "px"}, duration);
    }
    else {
      this.commands.show();
      fixedPosition = this.positioningManager.getFixedChromeRelativeElementPosition(this.dimensions == null ? toolbarDimensions : this.dimensions, chrome);                        
      this.toolbar.css({ left: fixedPosition.left + "px", top: fixedPosition.top + "px" });      
    }

    this.triggerEvent("show");
  },

  showAncestorList: function(position) {
    if (this.ancestorList.is(":visible")) return;
    this.triggerEvent("dropdownshown");
    this.renderAncestors();
    this.showAncestors();
    this.hideDsCommands();
    this.hideWorkflowCommands();
    this.hideMoreCommands();
                  
    var fixedPosition = this.positioningManager.getFixedElementPosition(position.top, position.left, this.ancestorList);    
    this.ancestorList.css({ top: fixedPosition.top + 'px', left: fixedPosition.left + 'px' });     
  },

  showDsCommandsList: function (position) {
    this.showDsCommands();
    this.triggerEvent("dropdownshown");
    var fixedPosition = this.positioningManager.getFixedElementPosition(position.top, position.left, this.dsCommands);
    this.dsCommands.css({ top: fixedPosition.top + 'px', left: fixedPosition.left + 'px' });
    this.hideAncestors();
  },

  showWorkflowCommandsList: function (position) {
    this.showWorkflowCommands();
    this.triggerEvent("dropdownshown");
    var fixedPosition = this.positioningManager.getFixedElementPosition(position.top, position.left, this.workflowCommands);
    this.workflowCommands.css({ top: fixedPosition.top + 'px', left: fixedPosition.left + 'px' });
    this.hideAncestors();
  },

  showMoreCommandsList: function(position) {                  
    this.showMoreCommands();           
    this.triggerEvent("dropdownshown");
    var fixedPosition = this.positioningManager.getFixedElementPosition(position.top, position.left, this.moreCommands);    
    this.moreCommands.css({ top: fixedPosition.top + 'px', left: fixedPosition.left + 'px' });       
    this.hideAncestors();
  },
 
  _addCommand: function(command, chrome, index) {
    var isMoreCommand;

    if (command.type == "separator") {
      if (index < this._maxToolbarCommands && this._isSeparatorAcceptible()) {
        $sc("#commandRow", this.commands).append(this.renderSeparator());
      }

      return false;      
    }

    if (index >= this._maxToolbarCommands ) {
      isMoreCommand = true;
      var c = this.renderCommand(command, chrome, isMoreCommand);
      if (c) {
        if (command.type == "datasourcesmenu") {
          this.dsCommands.append(c);
          return true;
        }

        if (command.type == "workflow") {
          this.workflowCommands.append(c);
          return true;
        }

        this.moreCommands.append(c);
        return true;
      }
    }
    else {
      isMoreCommand = false;
      var c = this.renderCommand(command, chrome, isMoreCommand);
      if (c) {
        $sc("#commandRow", this.commands).append(c);
        return true;
      }      
    }

    return false;
  },

  _isSeparatorAcceptible: function() {    
    var commandsRow = $sc("#commandRow", this.commands);
    return commandsRow.length > 0
            && commandsRow.children().length > 0 
            && commandsRow.children(".scChromeCommandSectionDelimiter:last-child").length == 0; 
  },

  _maxToolbarCommands: 9,

  _maxDisplayNameLength: 70,

  _hasDsCommands: function () {
    return this.dsCommands.children().length > 0;
  },

  _hasMoreCommands: function() {
    return this.moreCommands.children().length > 0;
  },

  hideOverlay: function() {
    this._overlay.hide();
  },

  showOverlay: function(dimensions) {
    var dims = dimensions;
    if (!dims) {
      dims = {};
      dims.height = this.commands.innerHeight();
      dims.width = this.commands.innerWidth();
    }
    
    this._overlay.css({width: dims.width + "px", height: dims.height + "px"});
    this._overlay.show();    
  }
},
{
  commandRenderers: {},
  eventNameSpace: "chromecontrols.",
  registerCommandRenderer: function(commandName, renderer, chromeType) {
    var key = chromeType != null ? chromeType.key() + ":" + commandName : commandName;
    Sitecore.PageModes.ChromeControls.commandRenderers[key] = renderer;
  }
});
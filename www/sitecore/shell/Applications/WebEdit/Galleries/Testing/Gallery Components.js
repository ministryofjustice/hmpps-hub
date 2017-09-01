document.observe("dom:loaded", function() {
 var element = $$(".testing-components")[0];
 var testingComponents = Sitecore.PageEditorProxy.getTestingComponents();    
 window.componentsGrid = new scTestingComponentsGrid(element, {data : testingComponents, onVariationChange: scChangeVariation, isTestRunning: window.isTestRunning});    
});

function scLoadCombinations() {    
  var url = "/sitecore/shell/Applications/WebEdit/TestCombinations.ashx";
  var layout = Sitecore.PageEditorProxy.layout();
  var device = Sitecore.PageEditorProxy.deviceId();
  var itemId = Sitecore.PageEditorProxy.itemId();
  var lang = Sitecore.PageEditorProxy.language();
  url += "?itemID=" + itemId;
  url += "&deviceID=" +  device;
  url += "&lang=" + lang;
  url += "&stat=" + (window.isTestRunning ? "1" : "0"); 
  // Prevent caching 
  url += "&r="+ Math.random();  
  var body = "layout=" + escape(layout);
  var combinationsContainer = $("Combinations");
  new Ajax.Request(url, {
  method: "POST",
  postBody: body,
  onSuccess: function(transport) {
    var response = transport.responseJSON;
    var headers = ["#"];
    response.components.each(function(c) {
      headers.push(c.name);
    });
    
    if (window.isTestRunning) {
      headers.push(scTranslations.Value);
    }

    var options = {      
      headers: headers,
      components: response.components,
      combinations: response.combinations,
      onCombinationChange: window.scOnCombinationChange,
      id: "combinationsGrid",
      showValue: window.isTestRunning 
    };
   
    combinationsContainer.removeClassName("scWait");
    window.combinationsGrid = new Sitecore.CombinationsGrid(combinationsContainer, options);
    var combination = window.componentsGrid.getSelectedCombination();
    if (combination) {
      window.combinationsGrid.setSelectedCombination(combination);
    }
        
    var sorting = [[0,0]];
    if (window.isTestRunning) {
      sorting = [[headers.length -1, 1]];
    }

    jQuery("#combinationsGrid").tablesorter({ sortList: sorting, widgets: ["zebra"] });  
  },

  onFailure: function() {
   combinationsContainer.removeClassName("scWait");
   combinationsContainer.innerHTML = "<div style='padding:8px; text-align:center;'>" + scTranslations.ErrorOcurred + "</div>";
  }
 });
};

function scChangeVariation(evt, variationId, componentId) {
  evt.stop();
  var combination = {};
  combination[componentId] = variationId;
  Sitecore.PageEditorProxy.changeVariations(combination, true);
};

function scOnCombinationChange(evt, combination) {
  evt.stop();
  Sitecore.PageEditorProxy.changeVariations(combination, false);  
};

function scTabChanged(tabIndex) {
  var combination = null;
  if (scForm.browser.initializeFixsizeElements) {
     scForm.browser.initializeFixsizeElements();
  }

  if (tabIndex == 1) {
    if (window.combinationsGrid == null) {      
      scLoadCombinations();
      return;
    }

    combination = window.componentsGrid.getSelectedCombination();
    if (combination) {
      window.combinationsGrid.setSelectedCombination(combination);
    }

    return;
  }
  
  if (!window.combinationsGrid) {
    return;
  }
  combination = window.combinationsGrid.getSelectedCombination(combination);
  if (combination) {
    window.componentsGrid.setSelectedCombination(combination);
  }
};
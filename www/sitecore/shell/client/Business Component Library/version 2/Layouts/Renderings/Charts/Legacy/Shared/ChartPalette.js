define(function() {
  var chartPalette = {

    // fixed facets colors
    facetColors: {
      "value":            "#88BB5D", 
      "visits":           "#6AC0E2", 
      "valuepervisit":    "#FCE179", 
      "allfacets":        "#a6a6a6", 
      "otherfacets":      "#e3e3e3", 
      "avgvisitduration": "#E5DDB3", 
      "bouncerate":       "#D4C4D0", 
      "bounce":           "#B497AD", 
      "conversionrate":   "#CAE1B7", 
      "conversion":       "#A2CA81", 
      "avgpagecount":     "#D09F62", 
      "avgvisitcount":    "#E8CFB0", 
      "pageviews":        "#FB9851", 
      "avgvisitpageviews":"#AADBEE", 
      "timeonsite":       "#D1C47A", 
      "avgcountvalue":    "#FAD338", 
      "count":            "#D6AB76", 
    },

    selectedSegmentColor: "#185F7B",

    // standardColors: used in all charts, based on Harvard theme DataPalette    
    standardColors: [
      //L65% - Default
      "#6AC0E2", //sky
      "#FCE179", //banana 
      "#FB9851", //carot
      "#B497AD", //eggplant      
      "#D1C47A", //sand
      "#A2CA81", //grass
      "#D6AB76", //wood
      "#EA6962", //tomato
      
      //L89% - XXLight
      "#D0EBF6", //sky
      "#FEF3C8", //banana      
      "#FEDFC8", //carot
      "#E7DEE5", //eggplant
      "#F1EDD5", //sand
      "#E2EED7", //grass
      "#F2E4D4", //wood
      "#F8D0CE", //tomato

      //L45% - XXDark
      "#2694C0", //sky
      "#E0B406", //banana
      "#E06106", //carot
      "#85607C", //eggplant      
      "#AB9A3B", //sand
      "#6EA244", //grass
      "#B17935", //wood
      "#CA241C", //tomato

      //L60% - Dark
      "#55B7DD", //sky
      "#FAD338", //banana      
      "#FA8938", //carot
      "#A989A1", //eggplant
      "#CBBC67", //sand
      "#95C36F", //grass
      "#D09F62", //wood
      "#E7534B", //tomato

      //L80% - XLight
      "#AADBEE", //sky
      "#FCE99C", //banana      
      "#FCC49C", //carot
      "#D4C4D0", //eggplant
      "#E5DDB3", //sand
      "#CAE1B7", //grass
      "#E8CFB0", //wood
      "#F3A9A5", //tomato

      //L36% -XXXDark
      "#A21D16", //sky
      "#B39005", //banana      
      "#B34D05", //carot
      "#6A4D63", //eggplant
      "#897B2F", //sand
      "#588136", //grass
      "#8D612A", //wood
      "#A21D16", //tomato

      //L73% - Light
      "#8CCEE8", //sky
      "#FCE179", //banana      
      "#FCAF79", //carot
      "#C5AFC0", //eggplant
      "#DCD298", //sand
      "#B7D69E", //grass
      "#DFBE95", //wood
      "#EE8B86", //tomato

      //L95% - XXXLight
      "#EAF6FB", //sky
      "#FEFAE6", //banana      
      "#FEF0E6", //carot
      "#F4F0F3", //eggplant
      "#F8F7EC", //sand
      "#F2F7ED", //grass
      "#F9F3EB", //wood
      "#FCEAE9", //tomato

      //L55% - XDark
      "#3FAED9", //sky
      "#F9CE1F", //banana      
      "#F97A1F", //carot
      "#9F7A95", //eggplant
      "#C4B454", //sand
      "#88BB5D", //grass
      "#CA924E", //wood
      "#E33E35" //tomato
    ],
    
    // comparisonColors: used in Maps, from green to red
    comparisonColors: [
      "#588136",
      "#6EA244",
      "#88BB5D",
      "#95C36F",
      "#B7D69E",
      "#CAE1B7",
      "#F3A9A5",
      "#EE8B86",
      "#EA6962",
      "#E7534B",
      "#E33E35",
      "#CA241C"
    ]      
  };

  return chartPalette;
});
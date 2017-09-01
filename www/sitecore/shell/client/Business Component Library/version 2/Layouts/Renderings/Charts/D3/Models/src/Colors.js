(function (models) {
    models.colors = {
        otherColor: ["#CCCCCC"], //sky
        singleColor: ["#6AC0E2"], //sky
        singleNegativeColor: ["#EA6962"], //sky

        // fixed facets colors
        facetColors: {
            "value": "#88BB5D",
            "visits": "#6AC0E2",
            "valuepervisit": "#FCE179",
            "allfacets": "#a6a6a6",
            "otherfacets": "#e3e3e3",
            "avgvisitduration": "#E5DDB3",
            "bouncerate": "#D4C4D0",
            "bounce": "#B497AD",
            "conversionrate": "#CAE1B7",
            "conversion": "#A2CA81",
            "avgpagecount": "#D09F62",
            "avgvisitcount": "#E8CFB0",
            "pageviews": "#FB9851",
            "avgvisitpageviews": "#AADBEE",
            "timeonsite": "#D1C47A",
            "avgcountvalue": "#FAD338",
            "count": "#D6AB76"
        },

        selectedSegmentColor: "#185F7B",

        // standardColors: used in all charts, based on Harvard theme DataPalette    
        standardColors: [
            //L60% - Dark
            "#55B7DD", //sky
            "#95C36F", //grass
            "#FAD338", //banana      
            "#FA8938", //carot
            "#E7534B", //tomato
            "#A989A1", //eggplant
            "#CBBC67", //sand        
            "#D09F62", //wood

            //L65% - Default
            "#6AC0E2", //sky
            "#A2CA81", //grass
            "#FCE179", //banana 
            "#FB9851", //carot
            "#EA6962", //tomato
            "#B497AD", //eggplant      
            "#D1C47A", //sand        
            "#D6AB76", //wood

            //L73% - Light
            "#8CCEE8", //sky
            "#B7D69E", //grass
            "#FCE179", //banana      
            "#FCAF79", //carot
            "#EE8B86", //tomato
            "#C5AFC0", //eggplant
            "#DCD298", //sand        
            "#DFBE95", //wood 

            //L80% - XLight
            "#AADBEE", //sky
            "#CAE1B7", //grass
            "#FCE99C", //banana      
            "#FCC49C", //carot
            "#F3A9A5", //tomato
            "#D4C4D0", //eggplant
            "#E5DDB3", //sand        
            "#E8CFB0", //wood        

            //L89% - XXLight
            "#D0EBF6", //sky
            "#E2EED7", //grass
            "#FEF3C8", //banana      
            "#FEDFC8", //carot
            "#F8D0CE", //tomato
            "#E7DEE5", //eggplant
            "#F1EDD5", //sand        
            "#F2E4D4", //wood

            //L95% - XXXLight
            "#EAF6FB", //sky
            "#F2F7ED", //grass
            "#FEFAE6", //banana      
            "#FEF0E6", //carot
            "#FCEAE9", //tomato
            "#F4F0F3", //eggplant
            "#F8F7EC", //sand        
            "#F9F3EB", //wood

            //L55% - XDark
            "#3FAED9", //sky
            "#88BB5D", //grass
            "#F9CE1F", //banana      
            "#F97A1F", //carot
            "#9F7A95", //eggplant
            "#C4B454", //sand        
            "#CA924E", //wood
            "#E33E35", //tomato    

            //L45% - XXDark
            "#2694C0", //sky
            "#6EA244", //grass
            "#E0B406", //banana
            "#E06106", //carot
            "#CA241C", //tomato
            "#85607C", //eggplant      
            "#AB9A3B", //sand        
            "#B17935", //wood       

            //L36% -XXXDark
            "#1E7699", //sky
            "#588136", //grass
            "#B39005", //banana      
            "#B34D05", //carot
            "#A21D16", //tomato
            "#6A4D63", //eggplant
            "#897B2F", //sand        
            "#8D612A" //wood          
        ],

        // shadedSkyColors: used in chart taht show a shade of colors   
        shadedSkyColors: [
        //Sky
        "#1E7699", //sky
        "#2694C0", //sky
        "#3FAED9", //sky
        "#55B7DD", //sky
        "#6AC0E2", //sky
        "#8CCEE8", //sky
        "#AADBEE", //sky
        "#D0EBF6", //sky
        "#EAF6FB" //sky        
        ],

        /**
        * Gets the palette.
        * @param {bool} isColorPaletteShaded - Defines whether the palette is shaded.
        * @param {int} numberOfItems - The number of items..
        * @param {int} maxNumberOfSegments -The max Nnmber of segments.
        */
        getPalette: function (isColorPaletteShaded, numberOfItems, maxNumberOfSegments) {
            var palette = isColorPaletteShaded ? models.colors.getShadedPalette(numberOfItems) : models.colors.standardColors;
            if (maxNumberOfSegments > 0 && maxNumberOfSegments < numberOfItems) {
                var newPalette = models.data.clone(palette);
                newPalette[maxNumberOfSegments] = models.colors.otherColor;
                return newPalette;
            }
            return palette;
        },

        /**
        * Set the chart colors.
        * @param {object} chartElement - The chartElement.
        * @param {bool} isSingleSeries -  Defines whether the data is single series.
        * @param {bool} isColorPaletteShaded - Defines whether the palette is shaded.
        * @param {int} palette - The palette.
        */
        setChartColors: function (chartElement, isSingleSeries, isColorPaletteShaded, palette) {
            if (isSingleSeries && isColorPaletteShaded) {
                chartElement.barColor(palette);
            } else {
                chartElement.color(palette);
            }
        },

        /**
        * Sets the shaded palette.
        * @param {int} seriesNumber - The seriesNumber.
        */
        getShadedPalette: function (seriesNumber) {
            var shadedColors = models.colors.shadedSkyColors;
            if (seriesNumber >= 5 && seriesNumber <= 8) {
                shadedColors = models.colors.shadedSkyColors.slice(1);
            }

            if (seriesNumber < 5) {
                shadedColors = [
                    models.colors.shadedSkyColors[1],
                    models.colors.shadedSkyColors[3],
                    models.colors.shadedSkyColors[5],
                    models.colors.shadedSkyColors[7]
                ];
            }
            return shadedColors;
        },

        /**
        * Gets a palette color by index using the module.
        * @param {object} palette - The palette.  
        * @param {int} index - The index.  
        */
        getPaletteColor: function (palette, index) {
            return palette[index % palette.length];
        }
    }
}(Sitecore.Speak.D3.models));
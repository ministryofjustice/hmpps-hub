
define(["sitecore", "jqueryui"], function (_sc) {

  // model
  var model = _sc.Definitions.Models.ControlModel.extend(
    {
      initialize: function (options) {
        this._super();

        this.set("items", []);
        this.set("LegendItems", []);
        this.set("MinimumScaleValue", "");
        this.set("MaximumScaleValue", "");
        this.set("TitleChart", "");
        this.set("IsLegendVisible", false);
        this.set("NoDataText", "");

        this.set("selectedItem", "");
      }
    });

  // view
  var view = _sc.Definitions.Views.ControlView.extend(
  {
    selectedItemElem: null,
    hoveredItem: null,

    starImgSrc: "/sitecore/shell/client/Applications/ContentTesting/Assets/star.png",

    defaultColor: "#000000",

    minimumScaleValue: 0,
    maximumScaleValue: 100,
    middleScaleValue: 0,


    initialize: function (options) {
      //this._super();

      // TitleChart
      var titleChart = this.$el.data("sc-titlechart");
      this.model.set("TitleChart", titleChart);

      // NoDataText
      var noDataText = this.$el.data("sc-nodatatext");
      this.model.set("NoDataText", noDataText);

      // minimumScaleValue
      var valStr = this.$el.data("sc-minimumscalevalue");
      this.model.set("MinimumScaleValue", valStr);
      
      // maximumScaleValue
      valStr = this.$el.data("sc-maximumscalevalue");
      this.model.set("MaximumScaleValue", valStr);

      // IsLegendVisible
      var valBool = this.$el.data("sc-islegendvisible");
      this.model.set("IsLegendVisible", valBool);


      //
      this.scaleChanged();

      // "legenditems"
      var legendItems = this.$el.data("sc-legenditems");
      if (typeof legendItems === "string")
        legendItems = eval(legendItems);

      this.model.set("LegendItems", legendItems);

      // "items"
      var itemsGroups = this.$el.data("sc-items");
      if (typeof itemsGroups === "string")
        itemsGroups = eval(itemsGroups);

      this.model.set("items", itemsGroups);

      // events
      this.model.on("change:items", this.populate, this);
      this.model.on("change:LegendItems", this.renderComponent, this);

      this.model.on("change:MinimumScaleValue", this.scaleChanged, this);
      this.model.on("change:MaximumScaleValue", this.scaleChanged, this);
      
      this.model.on("change:selectedItem", this.highLightSelected, this);

      //
      this.populate();
    },
    
    highLightSelected: function()
    {
      var selectedItem = this.model.get("selectedItem");
      if (selectedItem !== undefined && selectedItem != null)
      {
        var id = selectedItem.guid;
        this.$el.find("div.scExp-dvExperienceSelected").each(function()
        {
          $(this).removeClass("scExp-dvExperienceSelected");
          $(this).addClass("scExp-dvExperienceWhite");
        });

        var parentElem;
        // if "GroupName" is defined - find it's html-elem(parent for items)
        if (selectedItem.GroupId && selectedItem.GroupId != null && selectedItem.GroupId != '') {
          parentElem = this.$el.find("[id='" + selectedItem.GroupId + "']");
          if (parentElem.length == 0) {
            parentElem = this.$el;
          }
        }
        else if (selectedItem.GroupName && selectedItem.GroupName != null && selectedItem.GroupName != '') {
          parentElem = this.$el.find("[groupName='" + selectedItem.GroupName + "']");
          if (parentElem.length == 0) {
            parentElem = this.$el;
          }
        }
        else {
          parentElem = this.$el;
        }        

        var selected = parentElem.find("#" + id);
        selected.addClass("scExp-dvExperienceSelected").removeClass("scExp-dvExperienceWhite");
        this.selectedItemElem = selected[0];
      }      
    },

    scaleChanged: function () {
      // minimumScaleValue
      var valStr = this.model.get("MinimumScaleValue");
      this.minimumScaleValue = parseInt(valStr, 10);
      if (_.isNaN(this.minimumScaleValue))
        this.minimumScaleValue = 0;

      // maximumScaleValue
      valStr = this.model.get("MaximumScaleValue");
      this.maximumScaleValue = parseInt(valStr, 10);
      if (_.isNaN(this.maximumScaleValue))
        this.maximumScaleValue = 100;

      // middleScaleValue
      this.middleScaleValue = (this.maximumScaleValue + this.minimumScaleValue) / 2;

      //
      this.renderComponent();
    },

    // populate 
    populate: function () {

      this.renderComponent();
    },

    // renderComponent
    renderComponent: function () {

      var groups = this.model.get("items");
      var legendItems = this.model.get("LegendItems");

      // NO DATA
      if (!legendItems || legendItems.length === 0 || !groups || groups.length === 0) {
        this.renderNoData();
        return;
      }
      else {
        this.$el.removeClass("scExp-noData");
      }


      this.$el.html("");

      var html = "";
      html += '<div class="scExp-dvListContent scrollCustom"></div>';
      this.$el.append(html);
      var $dvListContentElem = this.$el.children().last();

      for (var i = 0; i < groups.length; i++) {
        this.renderGroup($dvListContentElem, groups[i], (i === 0));
      }

      // Legend render
      var isLegendVisible = this.model.get("IsLegendVisible");
      if(isLegendVisible)
        this.renderLegendList(this.$el);
    },

    // rendering of the legend
    renderLegendList: function (parentElem) {
      var legendItems = this.model.get("LegendItems");

      var html = "";
      html += '<div class="scExp-dvLegendItems"></div>';

      parentElem.append(html);
      var $dvLegendItemsElem = parentElem.children().last();

      var hashLegendGroups = {};
      var listLegendGroups = [];
      for (var i = 0; i < legendItems.length; i++) {
        var legend = legendItems[i];
        if (typeof legend.groupLegend !== 'undefined') {
          if (typeof hashLegendGroups[legend.groupLegend] === 'undefined') {
            hashLegendGroups[legend.groupLegend] = [];
          }
          hashLegendGroups[legend.groupLegend].push(legend.color);

          if (listLegendGroups.indexOf(legend.groupLegend) < 0)
            listLegendGroups.push(legend.groupLegend);
        }
      }

      html = "";
      html += '<table class="scExp-tbGroups">';
      for (i = 0; i < listLegendGroups.length; i++) {
        var legendGroup = listLegendGroups[i];
        var listColors = hashLegendGroups[legendGroup];

        html += '<tr>';
        html += '<td><table><tbody><tr>';

        for(var j = 0; j< listColors.length; j++){
          var color = listColors[j];
          html += '<td class="scExp-tdLegend"><div style="background-color:' + color + '"></div></td>';
        }

        html += '</tr></tbody></table></td>';
        html += '<td class="scExp-tdGroup">' + legendGroup + '</td>';
        html += '</tr>';
      }
      html += '</table>';
      $dvLegendItemsElem.append(html);
    },

    // rendering "NO DATA"
    renderNoData: function (parentElem) {
      var noDataText = this.model.get("NoDataText");
      if (noDataText == undefined || noDataText == '') {
        noDataText = "NO DATA";
      }

      var html = '';
      html += '<div class="scExp-dvNoData">' +
                '<div>' +
                    '<span>' + noDataText + '</span>' +
                '</div>' +
              '</div>';

      this.$el.html(html);
      this.$el.addClass("scExp-noData");
    },

    renderGroup: function (parentElem, group, isFirstGroup) {
      var html = "";

      var titleChart = this.model.get("TitleChart");
      if (typeof titleChart === 'undefined')
        titleChart = "";

      var visibility = 'hidden';
      if (group.name !== undefined && group.name !== "" && group.name != null)
        visibility = 'visible';
      
      html +=

          '<div id="' + group.Guid + '" groupName="' + group.name + '" class="dvGroup">' +
            '<div class="scExp-dvGroupTitle" >' +
              '<span class="spGroupInfo" style="visibility: ' + visibility + '; ">' + group.name + '</span>';

      if (isFirstGroup) {
        html += '<span class="spGroupTitle" >' + titleChart + '</span>';
      }
      html +=
            '</div>' +
          '</div>';

      parentElem.append(html);
      var groupElem = parentElem.children().last();
      if (group.items && group.items.length > 0) {
        for (var i = 0; i < group.items.length; i++) {
          var item = group.items[i];
          this.renderItem(groupElem, item, (isFirstGroup && i === 0), i + 1);
        }
      }

      return groupElem;
    },


    // rendering of the item
    renderItem: function (parentElem, item, isFirstItem, index) {
      var self = this;

      var html = "";
      var idItem = "";
      if (item.guid && item.guid !== '')
        idItem += 'id="' + item.guid.replace("{", "").replace("}", "") + '"';

      // 
      html +=
          "<div " + idItem + " class='scExp-dvExperience scExp-dvExperienceWhite'>" +
              "<table>" +
                "<tr class='scExp-trRow'>";


      // First Column
      html +=                   
          "<td class='scExp-tdColumnMain scExp-tdFirstColumn'>" +
            "<table>" +
              "<tr>" +
                "<td class='tdFirstSubColumn'>" +
                  "<span class='spFirstSubColumn'>" + index + "</span>" +
                "</td>" +
                "<td class='tdSecondSubColumn'>" +
                  "<span class='spSecondSubColumn'>" + item.title + "</span>" +
                  "<div class='scExp-dvColumnBorder'></div>" +
                "</td>" +
              "</tr>" +
            "</table>" +
          "</td>" +
          "<td class='scExp-tdColumnMain' >";      

      // minimumScaleValue
      if (isFirstItem) {
        html += "<span class='scExp-spScale scExp-spScaleMininum'>" + this.minimumScaleValue + "</span>";
      }

      // Second Column
      html += "</td><td class='scExp-tdColumnMain'></td>";

      // Third Column
      html += "<td class='scExp-tdColumnMain'>";
      
      // middleScaleValue
      if (isFirstItem) {
        html += "<span class='scExp-spScale scExp-spScaleMiddle'>" + this.middleScaleValue + "</span>";
      }

      // Fourth Column
      html += "</td><td class='scExp-tdColumnMain'>";

      // Fifth Column
      html += "</td><td class='scExp-tdColumnMain scExp-tdLastColumn'>";

      // maximumScaleValue
      if (isFirstItem) {
        html += "<span class='scExp-spScale scExp-spScaleMaximum'>" + this.maximumScaleValue + "</span>";
      }

      // winner Icon
      if (item.isWinner) {
        html += "<div class='scExp-dvWinner'>" +
                  "<img src='" + this.starImgSrc + "' />" +
                "</div>";
      }

      html += "</td>" +
                "</tr>" +
              "</table>";

      //
      // Rendering of value indicators
      //
      // color-value
      
      if (item.NoData)
      {
        var noDataText = this.model.get("NoDataText");
        if (noDataText == undefined || noDataText == "") {
          noDataText = "NO DATA";
        }
        
        html += "<div class='scExp-dvIndicator'>" +
                    "<span>"+ noDataText + "</span>" +
                "</div>";
      }
      else
      {
        html = this.renderIndicators(item, html);
      }
   
      html += "</div>" +
              "</div>";

      // appending of the elem
      parentElem.append(html);
      var itemElem = parentElem.children().last();

      // mouse move on item-elem
      itemElem.mousemove(function (event) {
        if (self.hoveredItem && self.hoveredItem !== self.selectedItemElem) {
          $(self.hoveredItem).removeClass("scExp-dvExperienceSelected scExp-dvExperienceHover");
          $(self.hoveredItem).addClass("scExp-dvExperienceWhite");
        }
        $(this).removeClass("scExp-dvExperienceWhite");
        $(this).addClass("scExp-dvExperienceSelected scExp-dvExperienceHover");

        self.hoveredItem = event.currentTarget;
      });
      // mouse leave on item-elem
      itemElem.mouseleave(function (event) {
        $(this).removeClass("scExp-dvExperienceHover");
        if (this && this !== self.selectedItemElem) {
          $(this).removeClass("scExp-dvExperienceSelected");
          $(this).addClass("scExp-dvExperienceWhite");
        }
      });
      // mouse down on item-elem
      itemElem.mousedown(function (event) {
        if (self.selectedItemElem) {
          $(self.selectedItemElem).removeClass("scExp-dvExperienceSelected scExp-dvExperienceHover");
          $(self.selectedItemElem).addClass("scExp-dvExperienceWhite");
        }
        self.selectedItemElem = event.currentTarget;
        $(event.currentTarget).removeClass("scExp-dvExperienceHover").addClass("scExp-dvExperienceSelected");

        var groupName, groupGuid;
        var parElem = $(self.selectedItemElem).parent();
        if (parElem.length > 0) {
          if (parElem[0].id && parElem[0].id != '') {
            groupGuid = parElem[0].id;
          }
          else if ($(parElem[0]).attr("groupName") && $(parElem[0]).attr("groupName") != '') {
            groupName = $(parElem[0]).attr("groupName");
          }
        }
          
        var findItem;
        if (groupGuid)
          findItem = self.findItemById(self.selectedItemElem.id, groupGuid);
        else
          findItem = self.findItemById(self.selectedItemElem.id, null, groupName);
        if (findItem)
          self.model.set("selectedItem", findItem);
          self.model.trigger("click:entry");
      });

      return itemElem;
    },
    
    renderIndicators: function(item , html)
    {
      var indTop = 20;
      var indTop2;
      var legendColor = this.getColorByLegendIndex(item.legendIndex);
      var legendColor2;

      // 3 indicators
      if (item.valuePerc && item.valuePerc2 && item.valuePerc3) {
        indTop = 8;
        indTop2 = indTop + 10;
        var indTop3 = indTop2 + 10;

        var legendColor3 = this.getColorByLegendIndex(item.legendIndex3);
        legendColor2 = this.getColorByLegendIndex(item.legendIndex2);
        //html += '<div class="scExp-dvIndicator" style="top:' + indTop + 'px;">' +
        //          '<div style="width: ' + item.valuePerc + '%; background-color:' + legendColor + '" ></div>' +
        //        '</div>';

        //html += '<div class="scExp-dvIndicator" style="top:' + indTop2 + 'px;">' +
        //          '<div style="width: ' + item.valuePerc2 + '%; background-color:' + legendColor2 + '" ></div>' +
        //        '</div>';

        //html += '<div class="scExp-dvIndicator" style="top:' + indTop3 + 'px;">' +
        //          '<div style="width: ' + item.valuePerc3 + '%; background-color:' + legendColor3 + '" ></div>' +
        //        '</div>';

        html += this.renderIndicator(item.valuePerc, indTop, legendColor);
        html += this.renderIndicator(item.valuePerc2, indTop2, legendColor2);
        html += this.renderIndicator(item.valuePerc3, indTop3, legendColor3);
      }
      // 2 indicators
      else if (item.valuePerc && item.valuePerc2) {
        indTop = 14;
        indTop2 = indTop + 10;

        legendColor2 = this.getColorByLegendIndex(item.legendIndex2);
        //html += '<div class="scExp-dvIndicator" style="top:' + indTop + 'px;">' +
        //          '<div style="width: ' + item.valuePerc + '%; background-color:' + legendColor + '" ></div>' +
        //        '</div>';

        //html += '<div class="scExp-dvIndicator" style="top:' + indTop2 + 'px;">' +
        //          '<div style="width: ' + item.valuePerc2 + '%; background-color:' + legendColor2 + '" ></div>' +
        //        '</div>';

        html += this.renderIndicator(item.valuePerc, indTop, legendColor);
        html += this.renderIndicator(item.valuePerc2, indTop2, legendColor2);
      }
      // 1 indicator
      else if (item.valuePerc) {

        //html += '<div class="' + className + '" style="top:' + indTop + 'px;">' +
        //          '<div style="width: ' + item.valuePerc + '%; background-color:' + legendColor + '" ></div>' +
        //        '</div>';
        html += this.renderIndicator(item.valuePerc, indTop, legendColor);
      }
      
      return html;
    },

    renderIndicator: function (valuePerc, indTop, legendColor) {

      var valuePerc = parseInt(valuePerc);
      var className = "scExp-dvIndicator";
      if (this.minimumScaleValue < 0) {
        if (valuePerc < 0) {
          className += " negative";
        }
        else if (valuePerc > 0)
          className += " positive";
        else {
          className += " neutral";
          valuePerc = 100;
        }
      }

      if (valuePerc < 0)
        valuePerc = Math.abs(valuePerc);
      else if (valuePerc == 0)
        valuePerc = 0.2;

      if (valuePerc > 100)
        valuePerc = 100;

      var indHtml = '<div class="' + className + '" style="top:' + indTop + 'px;">' +
                '<div style="width: ' + valuePerc + '%; background-color:' + legendColor + '" ></div>' +
              '</div>';

      return indHtml;
    },

    // finding item by id
    findItemById: function (id, groupId, groupName) {
      var groups = this.model.get("items");

      var findItem = null;
      for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        
        if (groups.length > 1)
        {
          if (groupId && group.Guid && groupId != '' && group.Guid != '' && groupId != group.Guid) {
            continue;
          }
          else if (groupName && groupName != '' && group.name != '' && groupName != group.name) {
            continue;
          }
        }
        
        for (var j = 0; j < group.items.length; j++) {
          var item = group.items[j];
          if (item.guid && item.guid !== '' && item.guid === id) {
            findItem = item;
            break;
          }
        }
      }

      return findItem;
    },

    // getting color by legend-index
    getColorByLegendIndex: function (index) {
      var legendItems = this.model.get("LegendItems");
      if (!legendItems)
        return;

      var color = this.defaultColor;
      for (var i = 0; i < legendItems.length; i++) {
        var item = legendItems[i];
        if (item.index === index) {
          color = item.color;
          break;
        }
      }

      return color;
    },

  });


  // create component
  _sc.Factories.createComponent("ExperienceIndicator", model, view, ".scExp-dvExperienceList");

});
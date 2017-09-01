(function(Speak) {

  Speak.component(["sitecore", "extensions", "moment", "timeline", "hammerjs", "jqueryhammer"], function(_sc) {

    var to,
      toHide,

      getColumnShift = function (peak) {
          var shift = isNaN(peak.value) * - 7 + isNaN(peak.revenue) * + 7;
          if (!isNaN(peak.duration)) {
            shift = shift / 2;
          }
          return shift;
        },

      getPeak = function(originalData) {
        return {
          "value": Math.max.apply(Math, originalData.map(function(o) { return o.EngagementValue; })),
          "duration": Math.max.apply(Math, originalData.map(function(o) { return o.Duration; })),
          "revenue": Math.max.apply(Math, originalData.map(function(o) { return o.MonetaryValue; }))
        }
      },

      getBars = function(originalItem, peak) {
        return {
          "value": originalItem.EngagementValue ? originalItem.EngagementValue / peak.value : null,
          "duration": originalItem.Duration ? originalItem.Duration / peak.duration : null,
          "revenue": originalItem.MonetaryValue ? originalItem.MonetaryValue / peak.revenue : null
        }
      },

      getContent = function(bars) {
        var content = bars.value ? "<div class='bar bar1' style='height:" + Math.round(bars.value * 100) + "%'></div>" : "";
        content += bars.duration ? "<div class='bar bar2' style='height:" + Math.round(bars.duration * 100) + "%'></div>" : "";
        content += bars.revenue ? "<div class='bar bar3' style='height:" + Math.round(bars.revenue * 100) + "%'></div>" : "";
        if (!content) {
          return content;
        }

        var barLeft = this.ColumnShift ? " style=left:" + this.ColumnShift + "px" : "";
        return "<div class='bars'" + barLeft + ">" + content + "</div>";
      },

      getImageWithPath = function(imageUrl) {
        if (!imageUrl) {
          return "";
        }
        return imageUrl.indexOf('/') !== -1 ? imageUrl : "/sitecore/shell/client/Speak/Assets/img/Speak/Timeline/" + imageUrl;
      },

      getIcons = function(originalItem) {
        var icons = [],
          features = [];
        for (var i = 1; i <= 2; i++) {
          var image = originalItem["IndicatorImagePath" + i];
          if (image) {
            var icon = { "title": "" };
            icon.src = getImageWithPath.call(this, image);
            icons.push(icon);
            var feature = { "title": "" };
            feature.body = "";
            feature.icon = image;
            features.push(feature);
          }
        }
        return { features: features, icons: icons };
      },

      getImageContent = function(item) {
        var content = "<div class='icon-panel'>";
        for (var j = 0; j < item.icons.length; j++) {
          content += "<img src='" + item.icons[j].src + "' />";
        }
        content += "</div>";
        return content;
      },

      getImageElement = function(imageUrl) {
        return "<img src='" + getImageWithPath.call(this, imageUrl) + "'>";
      },

      clearEras = function() {
        this.$el.find(".timeline-eras").html('');
        this.Timeline.options.eras = [];
      },

      addFeaturesByEventType = function(item) {
        if (item.interactionData.EventType === "Quantifiable") {
          //Bar item
          var iconImages = getIcons.call(this, item.interactionData);
          item.features = iconImages.features;
          item.icons = iconImages.icons;
          item.content = getContent.call(this, item.bars) + getImageContent(item) + getImageElement.call(this, item.interactionData.ImageUrl);
          item.cssClass = "bar-item";
          item.clusterGroup = "bar-item";
          item.noStack = true;
        } else if (item.interactionData.EventType === "EraChange") {
          //EraChange
          item.clusterGroup = "EraChange";
          item.content = getImageElement.call(this, item.interactionData.ImageUrl);
          item.cssClass = "normal-event";
          var eraLength = this.Timeline.options.eras.length;
          if (eraLength >= 1) {
            this.Timeline.options.eras[eraLength - 1].end = item.start;
          }
          this.Timeline.options.eras.push({ start: item.start, content: item.interactionData.EraText, cssClass: "era-" + this.Timeline.options.eras.length % 10 });
        } else {
          //Stick item
          item.clusterGroup = item.interactionData.ImageUrl;
          item.content = getImageElement.call(this, item.interactionData.ImageUrl);
          item.cssClass = "normal-event small-event";
        }
        return item;
      },

      createDataSet = function() {
        var originalData = this.DynamicData.dataSet.journey,
          processedData = [],
          peak = getPeak(originalData),
          uniqueTimes = {};

        this.ColumnShift = getColumnShift(peak);
        clearEras.call(this);

        for (var i = 0; i < originalData.length; i++) {
          var originalItem = originalData[i];
          var item = { interactionData: originalItem };
          item.eventType = getImageWithPath.call(this, item.interactionData.ImageUrl);

          //For visual purposes, separate simultaneous events 
          var dateTime = new Date(item.interactionData.DateTime);
          while (uniqueTimes[dateTime]) {
            dateTime = dateTime.setTime(dateTime.getTime() + 1);
          }
          uniqueTimes[dateTime] = true;
          item.start = dateTime;

          item.bars = getBars.call(this, item.interactionData, peak);
          item = addFeaturesByEventType.call(this, item);
          processedData.push(item);
        }
        this.Timeline.setData(processedData);
        this.Timeline.setVisibleChartRangeAuto();
      },

      //Right aligned icons (Goal, Campaign etc.)
      createIconPanel = function(icons) {
        icons.sort(function(x, y) { return x.src < y.src ? -1 : x.src > y.src ? 1 : 0; });

        if (icons && icons.length) {
          var html = ["<div class='icon-panel'>"];
          var htIcons = {};
          for (var i = 0; i < icons.length; i++) {
            htIcons[icons[i].src] = true;
          }
          for (var s in htIcons) {
            html.push("<img src='" + s + "' />");
          }
          html.push("</div>");
          return html.join("");
        }
        return "";
      },

      updateBars = function(el, vals) {
        for (var i = 0; i < vals.length; i++) {
          var v = Math.max(1, Math.round(100 * vals[i]));
          $(".bar" + (i + 1), el).css("height", v + "%");
        }
      },

      createBars = function(vals) {
        var barLeft = "";
        if (this.ColumnShift) {
          barLeft = " style=left:" + this.ColumnShift + "px";
        }
        var html = ["<div class='bars'" + barLeft + ">"];
        for (var k = 0; k < vals.length; k++) {
          html.push("<div class='bar bar" + (k + 1) + "' style='height:" + Math.round(100 * vals[k]) + "%'></div>");
        }
        html.push("</div>");
        return html.join("");
      },

      updateMax = function(items, weightStart, weightEnd, interval, start, end, max) {
        if (items) {
          items.forEach(function(item) {
            var point = 1 * item.start;
            if (item.cluster == null && point >= weightStart && point <= weightEnd) {
              var weight = point < start ? (point - weightStart) / interval : point > end ? (weightEnd - point) / interval : 1;
              for (var s in item.data.bars) {
                max = Math.max(max, weight * item.data.bars[s]);
              }
            }
          });
        }
        return max;
      },

      levelValues = function (items, weightStart, weightEnd, max) {
        if (items) {
          items.forEach(function(item) {
            if (item.dom && item.isVisible(new Date(weightStart), new Date(weightEnd))) {
              var ps = {};
              for (var s in item.data.bars) {
                ps[s] = max ? item.data.bars[s] / max : 0;
              }
              updateBars.call(this, item.dom, [ps["value"], ps["duration"], ps["revenue"]]);
            }
          });
        }
      },

      initializeResizeListener = function () {
        $(window).resize(function() {
          clearTimeout(to);
          to = setTimeout(function() {
            this.Timeline.checkResize();
          }.bind(this), 1);
        }.bind(this));
      },

      initializeHammerListener = function() {
        var that = this;
        this.$el.hammer().on("tap", ".timeline-event-cluster", function() {
          var clusterItem = $(this).data("timeline-event"),
            sel = that.Timeline.getSelection(),
            selItem = clusterItem.items[0];
          for (var i = 0; i < clusterItem.items.length; i++) {
            if (clusterItem.items[i] == sel) {
              selItem = clusterItem.items[i];
              break;
            }
          }
          setTimeout(function () {
            that.Timeline.selectItem(selItem);
            onSelect.call(that);
          }.bind(this), 1);
         decluster.call(that, selItem, 0);
        });
      },

      decluster = function (selItem, zoomSpeed) {
        zoomSpeed = Math.min(1, zoomSpeed + 0.01 );
        this.Timeline.zoom(zoomSpeed, selItem.start);
        if (selItem.cluster) {
          setTimeout(function() {
            decluster.call(this, selItem, zoomSpeed);
          }.bind(this), 1);
        } 
      },

      onSelect = function () {
        clearTimeout(toHide);
        var sel = this.Timeline.getSelection();
        if (sel) {
          this.SelectedSegment = this.Timeline.selection.data.interactionData;
          setTimeout(function() {
            this.Timeline.setStart(sel.start, true);
          }.bind(this), 0);
        }
      },

      getOptions = function () {

        var minDate = this.MinDate ? Speak.utils.date.parseISO(this.MinDate) : new Date(2000, 0, 1);
        var maxDate = this.MaxDate ? Speak.utils.date.parseISO(this.MaxDate) : new Date(2050, 0, 1);
  
        // Timeline options
        var options = {
          width: '100%',
          height: "160px",
          groupMinHeight: 127,
          min: minDate,
          max: maxDate,
          animationSpeed: 400,
          animationEasing: "swing",
          cluster: true,
          maxStackHeight: 100,
          stackOverflow: 5,
          editable: false,
          eventMarginX: -1,
          eventMarginAxis: 40,
          eventMargin: 0,
          eras: [],
          animateZoom: true,
          showCurrentTime: false,
          showMarkerLine: false,
          showCustomTime: false,
          clusterFormatter: function(cluster) {

            if (cluster.data.clusterGroup === "bar-item") {
              var bars = {},
                type = null,
                icons = [];
              for (var i = 0; i < cluster.items.length; i++) {
                type = i > 0 && cluster.items[i].data.eventType != type ? "multi" : cluster.items[i].data.eventType;

                for (var s in cluster.items[i].data.bars) {
                  bars[s] = (bars[s] || 0) + cluster.items[i].data.bars[s];
                }

                var itemIcons = cluster.items[i].data.icons;
                if (itemIcons) {
                  for (var j = 0; j < itemIcons.length; j++) {
                    icons.push(itemIcons[j]);
                  }
                }
              }
              cluster.data.bars = bars;
              cluster.data.noStack = true;
              cluster.data.cssClass = "bar-item";

              var content = createBars.call(this, [bars["value"], bars["duration"], bars["revenue"]])
                + "<div class='cluster-number'>" + cluster.items.length + "</div>"
                + createIconPanel.call(this, icons);
              if (type != "multi") {
                content += "<img src='" + type + "' />";
              } else {
                cluster.data.cssClass += " no-icon";
              }
              return content;
            } else {
              cluster.data.noStack = false;
              cluster.data.cssClass = cluster.items[0].data.cssClass;
              return cluster.items[0].data.content + "<div class='small-cluster-number'>" + cluster.items.length + "</div>";
            }
          },

          itemProcessor: function(items, clusters, timeline) {
            //Update items and clusters when scrolling etc. to make the height of the bars relative to the min/max values in the viewport.
            var start = 1 * timeline.start,
              end = 1 * timeline.end,
              interval = (end - start),
              weightStart = start - interval,
              weightEnd = end + interval,
              max = 0;

            max = updateMax.call(this, items, weightStart, weightEnd, interval, start, end, max);
            max = updateMax.call(this, clusters, weightStart, weightEnd, interval, start, end, max);
            levelValues.call(this, items, weightStart, weightEnd, max);
            levelValues.call(this, clusters, weightStart, weightEnd, max);

          },
          stackEvents: true,
          animate: false,

          locale: this.Language, //'en',
          MONTHS: JSON.parse(this.Months), //["xJanuary", "xFebruary", "xMarch", "xApril", "xMay", "xJune", "xJuly", "xAugust", "xSeptember", "xOctober", "xNovember", "xDecember"],
          MONTHS_SHORT: JSON.parse(this.MonthsShort), //["xJan", "xFeb", "xMar", "xApr", "xMay", "xJun", "xJul", "xAug", "xSep", "xOct", "xNov", "xDec"],
          DAYS: JSON.parse(this.Days), //["xSunday", "xMonday", "xTuesday", "xWednesday", "xThursday", "xFriday", "xSaturday"],
          DAYS_SHORT: JSON.parse(this.DaysShort) //["xSun", "xMon", "xTue", "xWed", "xThu", "xFri", "xSat"]
        };

        return options;
      }

    return {
      name: "Timeline",

      selectSegmentId: function(timelineEventId) {
        this.Timeline.setSelection(null, true, timelineEventId);
        if (this.Timeline.selection) {
          this.SelectedSegment = this.Timeline.selection.data.interactionData;
        }
      },

      selectNextSegment: function() {
        if (this.Timeline.selection) {
          this.Timeline.setSelection(null, true, null, 1);
          if (this.Timeline.selection) {
            this.SelectedSegment = this.Timeline.selection.data.interactionData;
          }
        }
      },

      selectPreviousSegment: function() {
        if (this.Timeline.selection) {
          this.Timeline.setSelection(null, true, null, -1);
          if (this.Timeline.selection) {
            this.SelectedSegment = this.Timeline.selection.data.interactionData;
          }
        }
      },

      initialized: function() {
        this.$el = $(this.el);
        this.on("change:DynamicData", createDataSet, this);
        initializeResizeListener.call(this);
        initializeHammerListener.call(this);

        this.Timeline = new links.Timeline(this.el, getOptions.call(this));
        links.events.addListener(this.Timeline, 'select', function() {
          onSelect.call(this);
        }.bind(this));
      }

    }
  }, "Timeline");
})(Sitecore.Speak);


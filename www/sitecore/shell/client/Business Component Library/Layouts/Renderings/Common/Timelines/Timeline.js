require.config({
  baseUrl: "/",
  paths: {
    extensions: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/jqueryExtensions/jquery.extensions",
    moment: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/moment/moment.min",
    timeline: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/timeline/timeline",
    hammerjs: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/hammer/hammer.min",
    jqueryhammer: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/hammer/jquery.hammer.min"
  }
});

define(["sitecore", "extensions", "moment", "timeline", "hammerjs", "jqueryhammer"], function (_sc) {

  _sc.Factories.createBaseComponent({
    name: "Timeline",
    base: "ComponentBase",
    selector: ".sc-timeline",
    attributes: [
      { name: "isVisible", value: "$el.data:sc-isvisible" },
      { name: "data", defaultValue: null },
      { name: "timeline", defaultValue: null },
      { name: "selectedSegment", defaultValue: null },
      { name: "height", defaultValue: "Default" },
      { name: "months", value: "$el.data:sc-months" },
      { name: "monthsShort", value: "$el.data:sc-monthsshort" },
      { name: "days", value: "$el.data:sc-days" },
      { name: "daysShort", value: "$el.data:sc-daysshort" },
      { name: "language", value: "$el.data:sc-language" }              
    ],

    getPeak: function (originalData) {
      var d = 0, r = 0, v = 0;
      var barsMax = { "value": 0, "duration": 0, "revenue": 0 };
      for (var i = 0; i < originalData.length; i++) {
        if (originalData[i].Duration) {
          barsMax.duration = Math.max(barsMax.duration, originalData[i].Duration);
          d = 4;
        }
        if (originalData[i].MonetaryValue) {
          barsMax.revenue = Math.max(barsMax.revenue, originalData[i].MonetaryValue);
          r = 1;
        }
        if (originalData[i].EngagementValue) {
          barsMax.value = Math.max(barsMax.value, originalData[i].EngagementValue);
          v = 2;
        }
      }
      this.setShift((d + r + v));
      return barsMax;
    },

    getBars: function (originalItem, peak) {
      var bars = {};
      if (originalItem.EngagementValue) {
        bars.value = originalItem.EngagementValue / peak.value;
      }
      if (originalItem.Duration) {
        bars.duration = originalItem.Duration / peak.duration;
      }
      if (originalItem.MonetaryValue) {
        bars.revenue = originalItem.MonetaryValue / peak.revenue;;
      }
      return bars;
    },

    getContent: function (bars) {
      var content = "";
      if (bars.value) {
        content += "<div class='bar bar1' style='height:" + Math.round(bars.value * 100) + "%'></div>";
      }
      if (bars.duration) {
        content += "<div class='bar bar2' style='height:" + Math.round(bars.duration * 100) + "%'></div>";
      }
      if (bars.revenue) {
        content += "<div class='bar bar3' style='height:" + Math.round(bars.revenue * 100) + "%'></div>";
      }
      if (content) {
        var barLeft;
        if (this.model.get("columnShift")) {
          barLeft = " style=left:" + this.model.get("columnShift") + "px";
        }
        content = "<div class='bars'" + barLeft + ">" + content + "</div>";
      }
      return content;
    },

    getImageWithPath: function (imageUrl) {
      if (!imageUrl) {
        return "";
      }
      return imageUrl.indexOf('/') !== -1 ? imageUrl : "/sitecore/shell/client/Speak/Assets/img/Speak/Timeline/" + imageUrl;
    },

    getIcons: function (originalItem) {
      var icons = [];
      var features = [];
      for (var i = 1; i <= 2; i++) {
        var image = originalItem["IndicatorImagePath" + i];
        if (image) {
          var icon = { "title": "" };
          icon.src = this.getImageWithPath(image);
          icons.push(icon);
          var feature = { "title": "" };
          feature.body = "";
          feature.icon = image;
          features.push(feature);
        }
      }
      return { features: features, icons: icons };
    },

    getImageContent: function (item) {
      var content = "<div class='icon-panel'>";
      for (var j = 0; j < item.icons.length; j++) {
        content += "<img src='" + item.icons[j].src + "' />";
      }
      content += "</div>";
      return content;
    },

    getImageElement: function (imageUrl) {
      return "<img src='" + this.getImageWithPath(imageUrl) + "'>";
    },

    clearEras: function () {
      this.$el.find(".timeline-eras").html('');
      this.model.timeline.options.eras = [];
    },

    createDataSet: function () {
      var originalData = this.model.get("data").dataSet.journey;
      var i;
      var processedData = [];
      var peak = this.getPeak(originalData);

      this.clearEras();
      var uniqueTimes = {};
      for (i = 0; i < originalData.length; i++) {
        var originalItem = originalData[i];
        var item = { interactionData: originalItem };
        item.eventType = this.getImageWithPath(originalItem.ImageUrl);

        var dateTime = new Date(originalItem.DateTime);
        //For visual purposes, separate simulataneous events 
        while (uniqueTimes[dateTime]) {
          dateTime = dateTime.setTime(dateTime.getTime() + 1);
        }
        uniqueTimes[dateTime] = true;
        item.start = dateTime;

        item.bars = this.getBars(originalItem, peak);

        if (originalItem.EventType === "Quantifiable") {
          //Bar item
          var iconImages = this.getIcons(originalItem);
          item.features = iconImages.features;
          item.icons = iconImages.icons;
          item.content = this.getContent(item.bars, peak.layout) + this.getImageContent(item) + this.getImageElement(originalItem.ImageUrl);
          item.cssClass = "bar-item";
          item.clusterGroup = "bar-item";
          item.noStack = true;
        } else if (originalItem.EventType === "EraChange") {
          //EraChange
          item.clusterGroup = "EraChange";
          item.content = this.getImageElement(originalItem.ImageUrl);
          item.cssClass = "normal-event";
          var eraLength = this.model.timeline.options.eras.length;
          if (eraLength >= 1) {
            this.model.timeline.options.eras[eraLength - 1].end = item.start;
          }
          this.model.timeline.options.eras.push({ start: item.start, content: originalItem.EraText, cssClass: "era-" + this.model.timeline.options.eras.length % 10});
        } else {
          //Stick item
          item.clusterGroup = originalItem.ImageUrl;
          item.content = this.getImageElement(originalItem.ImageUrl);
          item.cssClass = "normal-event small-event";
        }
        processedData.push(item);
      }
      this.model.timeline.setData(processedData);
      this.model.timeline.setVisibleChartRangeAuto();
    },

    setShift: function (shift) {
      var pix = 0;
      switch (shift) {
      case 1:
        pix = -7;
        break;
      case 2:
        pix = 7;
        break;
      case 5:
        pix = -3;
        break;
      case 6:
        pix = 3;
        break;
      }
      this.model.set("columnShift", pix);
    },

    selectSegmentId: function (timelineEventId) {
      this.model.timeline.setSelection(null, true, timelineEventId);
      if (this.model.timeline.selection) {
        this.model.set("selectedSegment", this.model.timeline.selection.data.interactionData);
      }
    },

    selectNextSegment: function () {
      if (this.model.timeline.selection) {
        this.model.timeline.setSelection(null, true, null, 1);
        if (this.model.timeline.selection) {
          this.model.set("selectedSegment", this.model.timeline.selection.data.interactionData);
        }
      }
    },

    selectPreviousSegment: function () {
      if (this.model.timeline.selection) {
        this.model.timeline.setSelection(null, true, null, -1);
        if (this.model.timeline.selection) {
          this.model.set("selectedSegment", this.model.timeline.selection.data.interactionData);
        }
      }
    },

    initialize: function () {
      this._super();
      var target = this.$el;
      var that = this;

      this.model.on("change:data", this.createDataSet, this);

      $(target).hammer().on("tap", ".timeline-event-cluster", function(ev) {
        var timeline = that.model.timeline;
        var clusterItem = $(this).data("timeline-event");
        var sel = that.model.timeline.getSelection();
        var selItem = clusterItem.items[0];
        for (var i = 0; i < clusterItem.items.length; i++) {
          if (clusterItem.items[i] == sel) {
            selItem = clusterItem.items[i];
            break;
          }
        }
        //Keep zooming until the item is no longer clustered
        while (selItem.cluster) {
          timeline.zoom(0.25, selItem.start);
        }
        setTimeout(function () {
          that.model.timeline.selectItem(selItem);
          onSelect();
        }, 1);
      });

      var to;
      $(window).resize(function () {
        clearTimeout(to);
        to = setTimeout(function () { that.model.timeline.checkResize(); }, 1);
      });

      var toHide = null;
      function onSelect(animation) {
        clearTimeout(toHide);
        var sel = that.model.timeline.getSelection();
        if (sel) {
          that.model.set("selectedSegment", that.model.timeline.selection.data.interactionData);
          setTimeout(function () {
            that.model.timeline.setStart(sel.start, animation || true);
          }, 0);

        }
      }

      //Right aligned icons (Goal, Campaign etc.)
      function createIconPanel(icons) {
        icons.sort(function (x, y) { return x.src < y.src ? -1 : x.src > y.src ? 1 : 0; });

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
      }

      function updateBars(el, vals) {
        for (var i = 0; i < vals.length; i++) {
          var v = Math.max(1, Math.round(100 * vals[i]));
          $(".bar" + (i + 1), el).css("height", v + "%");
        }
      }

      // Timeline options
      var height;
      if (this.model.get("height") === "Default") {
        height = "160px";
      } else {
        height = "245px";
      }
      var options = {
        width: '100%',
        height: height,
        groupMinHeight: 127,
        min: null,
        max: null,
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
        clusterFormatter: function (cluster) {

          //Group the data from the items in the cluster
          //Value and duration bars

          function createBars(vals) {
            var barLeft;
            if (that.model.get("columnShift")) {
              barLeft = " style=left:" + that.model.get("columnShift") + "px";
            }
            var html = ["<div class='bars'" + barLeft + ">"];
            for (var i = 0; i < vals.length; i++) {
              html.push("<div class='bar bar" + (i + 1) + "' style='height:" + Math.round(100 * vals[i]) + "%'></div>");
            }
            html.push("</div>");
            return html.join("");
          }

          if (cluster.data.clusterGroup === "bar-item") {
            var bars = {};
            var type = null;
            var icons = [];
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

            var content = createBars([bars["value"], bars["duration"], bars["revenue"]])
              + "<div class='cluster-number'>" + cluster.items.length + "</div>"
              + createIconPanel(icons);
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

        itemProcessor: function (items, clusters, timeline) {
          //This updates items and clusters when scrolling etc.
          //The purpose is to make the height of the bars relative to the min/max values in the viewport.

          var start = 1 * timeline.start, end = 1 * timeline.end;

          //Add weighted values from bars outside the interval
          var interval = (end - start);
          var weightStart = start - interval;
          var weightEnd = end + interval;

          var max = 0;
          function updateMax(items) {
            if (items) {
              items.forEach(function (item) {
                var point = 1 * item.start;
                if (item.cluster == null && point >= weightStart && point <= weightEnd) {
                  var weight = point < start ? (point - weightStart) / interval : point > end ? (weightEnd - point) / interval : 1;
                  for (var s in item.data.bars) {
                    max = Math.max(max, weight * item.data.bars[s]);
                  }
                }
              });
            }
          }

          function levelValues(items) {
            if (items) {
              items.forEach(function (item) {
                if (item.dom && item.isVisible(new Date(weightStart), new Date(weightEnd))) {
                  var ps = {};
                  for (var s in item.data.bars) {
                    ps[s] = max ? item.data.bars[s] / max : 0;
                  }
                  updateBars(item.dom, [ps["value"], ps["duration"], ps["revenue"]]);
                }
              });
            }
          }

          updateMax(items);
          updateMax(clusters);

          levelValues(items);
          levelValues(clusters);
        },
        stackEvents: true,
        animate: false,

        locale: this.model.get("language"),
        MONTHS: this.model.get("months"), 
        MONTHS_SHORT: this.model.get("monthsShort"), 
        DAYS: this.model.get("days"),
        DAYS_SHORT: this.model.get("daysShort")       
      };

      this.model.timeline = new links.Timeline(this.$el[0], options);
      links.events.addListener(this.model.timeline, 'select', onSelect);
    }
  });
});
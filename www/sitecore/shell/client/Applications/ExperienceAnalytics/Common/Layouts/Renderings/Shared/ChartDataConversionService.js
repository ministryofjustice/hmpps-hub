define([], function () {

  function ChartDataConversionService() {
  };

  _.extend(ChartDataConversionService.prototype, {
    convert: function (apiData, translations, chartParameters) {

      var converted = [];
      if (chartParameters.chartName == "BarChart") {
        var groupByFieldName = chartParameters.seriesChartField.segmentField;

        converted = _.chain(apiData[0].data)
          .groupBy(groupByFieldName)
                    .map(function (series, index) {
                      return {
                        key: translations[index] || index,
                        values: _(series).map(function (dataPoint) {
                          return {
                            x: translations[dataPoint.key] || dataPoint.key,
                            y: dataPoint[chartParameters.metrics[0].dataField]
                          };
                        })
                      };
                    }).value();

      }
      else if (chartParameters.chartName == "PieChart") {

        if (chartParameters.metrics.count == 0) return converted;

        var fieldName = chartParameters.isKeyGroupingCollapsed ? chartParameters.seriesChartField.segmentField : (chartParameters.numOfSegments > 1 ? chartParameters.seriesChartField.cartesianKeyField : chartParameters.seriesChartField.keyField);

        converted =
        [{
          values:
              _.chain(apiData[0].data)
    .filter(function (dataObject) {
      return dataObject[chartParameters.metrics[0].dataField] > 0;
    })
              .map(function (dataObject) {
                return {
                  x: translations[dataObject[fieldName]] || dataObject[fieldName],
                  y: dataObject[chartParameters.metrics[0].dataField]
                }
              }).value()
        }];
      }
      else if (chartParameters.chartName == "KpiChart") {
          if (chartParameters.metrics.count == 0) return converted;

          var aggregated = {};
          _(['visits', 'value', 'conversions', 'bounces', 'timeOnSite', 'count', 'pageViews']).each(function (metricName) {
              aggregated[metricName] = _(apiData[0].data).pluck(metricName).reduce(function (a, b) { return a + b; });
          });

          aggregated.valuePerVisit = aggregated.visits == 0 ? 0 : aggregated.value / aggregated.visits;
          aggregated.conversionRate = aggregated.visits == 0 ? 0 : aggregated.conversions / aggregated.visits;
          aggregated.bounceRate = aggregated.visits == 0 ? 0 : aggregated.bounces / aggregated.visits;
          aggregated.avgVisitDuration = aggregated.visits == 0 ? 0 : aggregated.timeOnSite / aggregated.visits;
          aggregated.avgPageCount = aggregated.pageViews == 0 ? 0 : aggregated.count / aggregated.pageViews;
          aggregated.avgVisitCount = aggregated.visits == 0 ? 0 : aggregated.count / aggregated.visits;
          aggregated.avgVisitPageViews = aggregated.visits == 0 ? 0 : aggregated.pageViews / aggregated.visits;
          aggregated.avgCountValue = aggregated.count == 0 ? 0 : aggregated.value / aggregated.count;

          converted = _(chartParameters.metrics).map(function (metric) {
              var result = {
                  metricName: metric.dataField,
                  metricValue: aggregated[metric.dataField],
                  numberScale: metric.numberScale
              }
              return result;
          });
      }
            else if (chartParameters.chartName == "LineChart" && chartParameters.metrics.length > 1) {
                // CombinationChart

                if (chartParameters.metrics.length == 0) return converted;

                var firstSegmentId = "";
                var firstKeyId = "";

                if (apiData[0].data.length > 0) {
                    firstSegmentId = apiData[0].data[0].segment;
                    firstKeyId = apiData[0].data[0].key;
                }

                var firstSegmentData = apiData[0].data.filter(function(o) {
                    return o.segment == firstSegmentId && o.key == firstKeyId;
                });

                for (var i = 0; i < 2; i++) {
                    converted = converted.concat(_.chain(firstSegmentData)
                        .groupBy("metric")
                        .map(function(series, key) {
                            return {
                                bar: i==0,
                                key: chartParameters.metrics[i].headerText || key,
                                values: _(series).map(function(dataPoint) {
                                    return {
                                        x: new Date(dataPoint['date']),
                                        y: dataPoint[chartParameters.metrics[i].dataField],
                                        dateLabel: dataPoint['dateLabel']
                                    };
                                })
                            };
                        })
                        .value());
                }
            }
            else if (chartParameters.chartName == "AreaChart" || chartParameters.chartName == "LineChart") {
        if (chartParameters.metrics.count == 0) return converted;

        groupByFieldName = chartParameters.isKeyGroupingCollapsed ? chartParameters.seriesChartField.segmentField : (chartParameters.numOfSegments > 1 ? chartParameters.seriesChartField.cartesianKeyField : chartParameters.seriesChartField.keyField);

        converted =
          _.chain(apiData[0].data)
          .groupBy(groupByFieldName)
          .map(function (series, key) {
            return {
              key: translations[key] || key,
              values: _(series).map(function (dataPoint) {
                return {
                  x: new Date(dataPoint['date']),
                  y: dataPoint[chartParameters.metrics[0].dataField],
                  dateLabel: dataPoint['dateLabel']
                };
              })
            };
          })
          .value();
      }
      return converted;
    },
  });

  return new ChartDataConversionService();
});
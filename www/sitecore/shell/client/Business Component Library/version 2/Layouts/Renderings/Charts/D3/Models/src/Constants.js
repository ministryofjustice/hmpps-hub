var globalizeDataTypes = {
    date: "date",
    datetime: "datetime",
    time: "time",
    number: "number",
    currency: "currency",
    text: "text"
};

var mediumDateFormat = "medium";

Sitecore.Speak.D3.models.constants =
{
  animations: {
    none: 0,
    veryFast: 50,
    fast: 150,
    medium: 250,
    quiteSlow: 400,
    slow: 500,
    verySlow: 1000
  },

  chartType: {
    bar: 0,
    column: 1,
    line: 2,
    area: 3,
    pie: 4,
    doughnut: 5,
    combination: 6
  },

  legend: {
    iconSize: 12,
    gapIconText: 5,
    textPosition: 12 + 5,
    legendItemHeight: 20,
    legendItemsMargin: 20
  },

  yAxisLabelHeight: 18,
  chartTitleHeight: 48,

  categoryInformation: {
    legend: "Legend",
    calloutLabels: "Callout Labels",
    none: "None"
  },

  eventType: {
    mouseClick: 0,
    mouseOver: 1,
    mouseOut: 2
  },

  legendState: {
    checked: 0,
    unchecked: 1,
    disengaged: 2,
    hover: 3
  },

  legendMode: {
    exclusiveCheck: 0,
    multipleCheck: 1
  },

  visualizationMode: {
    standard: 0,
    notVisible: 1,
    emphasized: 2,
    deemphasized: 3
  },

  dataFormatType: globalizeDataTypes,

  defaultDateFormat: mediumDateFormat,
  defaultDateType: globalizeDataTypes.date,

  defaultDateDataFormatting: {
    prefix: "",
    suffix: "",
    formatCustom: "",
    fieldType: globalizeDataTypes.date,
    formatPreset: {
      type: globalizeDataTypes.date,
      value: mediumDateFormat
    }
  },

  defaultNumberDataFormatting: {
    prefix: "",
    suffix: "",
    fieldType: globalizeDataTypes.number,
    isPercentage: false,
    roundingMethod: "round",
    numberOfDecimals: -1, //not applied
    isThousandSeparated: true
  },

  defaultCurrencyDataFormatting: {
    currency: "USD",
    style: "symbol",
    prefix: "",
    suffix: "",
    fieldType: globalizeDataTypes.number,
    isPercentage: false,
    roundingMethod: "round",
    numberOfDecimals: -1, //not applied
    isThousandSeparated: true
  },


  defaultNumberDataFormattingForPercentages: {
    prefix: "",
    suffix: "",
    fieldType: globalizeDataTypes.number,
    isPercentage: true,
    roundingMethod: "round",
    numberOfDecimals: 2,
    isThousandSeparated: true
  },
  pieLabelsVisibilityThreshold: 200,

  darkerLayerOpacity: 0.4,
  brighterLayerOpacity: 0.8,
  legendItemBrighterLayerOpacity: 0.2,
  doughnutLabelsVisibilityThreshold: 125,
  doughnutRadio: 0.52,
  pieLabelAngleThreshold: 0.1,
  idSelector: "data-sc-id",
  darkLayerColor: "black",
  brightLayerColor: "white",
  darkLabelColor: "black",
  brightLabelColor: "white",
  trimFromStart: "TrimFromStart",
  allSeries: "all"
};
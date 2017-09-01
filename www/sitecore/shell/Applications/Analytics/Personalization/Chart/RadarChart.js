if (typeof (Sitecore) == "undefined") {
  Sitecore = new Object();
}

Sitecore.PersonalizationRadarChart = function(controlId) {
  this.series = { label: '', data: [] };
  this.ticksAxis = [];
  this.serieses = [this.series];
  this.minumumValue = 0;
  this.maximumValue = 10;
  this.tickLength = 2;
  this.controlId = controlId;
}

Sitecore.PersonalizationRadarChart.prototype.changeSeriesData = function(index, newValue) {
  if (this.series.data.length <= index) {
    alert('Invalid index');
    return;
  }

  this.series.data[index][1] = newValue;
  this.redraw();
}

Sitecore.PersonalizationRadarChart.prototype.redraw = function () {
  if (this.serieses.length <= 0) {
    return;
  }

  if (this.serieses.length == 1) {
    if (this.serieses[0].data.length == 0) {
      return;
    }
  }

  this.recalculateData();

  if (this.serieses[0].data.length == 2) {
    this.maximumValue = parseFloat(this.maximumValue) + parseFloat(this.maximumValue) * 0.05;
    var f = Flotr.draw($(this.controlId), this.serieses, {
      shadowSize: 0,
      bars: { show: true, barWidth: 0.5 },
      legend: { show: false },
      yaxis: { min: this.minumumValue, max: this.maximumValue, minorTickFreq: this.tickLength },
      xaxis: { ticks: this.ticksAxis }
    });
    return;
  }

  if (this.serieses[0].data.length == 1) {
    this.serieses[0].data[0][0] = 1;
    this.maximumValue = parseFloat(this.maximumValue) + parseFloat(this.maximumValue) * 0.05;
    var f = Flotr.draw($(this.controlId), this.serieses, {
      shadowSize: 0,
      bars: { show: true, barWidth: 0.25 },
      legend: { show: false },
      yaxis: { min: this.minumumValue, max: this.maximumValue, minorTickFreq: this.tickLength },
      xaxis: { ticks: this.ticksAxis }
    });
    return;
  }

  var f = Flotr.draw($(this.controlId), this.serieses, {
    radar: { show: true },
    legend: { show: false },
    grid: { circular: true, minorHorizontalLines: true },
    yaxis: { min: this.minumumValue, max: this.maximumValue, minorTickFreq: this.tickLength },
    xaxis: { ticks: this.ticksAxis }
  });
}

Sitecore.PersonalizationRadarChart.prototype.recalculateData = function () {
  if (this.serieses.length <= 0) {
    this.minumumValue = 0;
    this.maximumValue = 10;
    this.tickLength = 2;
    return;
  }

  this.minimumValue = 0;
  this.maximumValue = 0;
  if ((this.serieses[0].data.length > 0) && (this.serieses[0].data[0].length > 1)) {
    this.maximumValue = this.serieses[0].data[0][1];
  }

  for (var i = 0; i < this.serieses.length; i++) {
    for (var j = 0; j < this.serieses[i].data.length; j++) {
      if (this.maximumValue < this.serieses[i].data[j][1]) {
        this.maximumValue = this.serieses[i].data[j][1];
      }
    }
  }

  /*
  if (this.minumumValue > 0) {
  this.minumumValue = 0;
  }
  else {
  this.minumumValue = this.minumumValue - this.tickLength;
  }
  */
}
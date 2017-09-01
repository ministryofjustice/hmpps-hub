/* =========================================================
 * bootstrap-slider.js v2.0.0
 * http://www.eyecon.ro/bootstrap-slider
 * =========================================================
 * Copyright 2012 Stefan Petre
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Sitecore comments:
 * We have removed the vertical visualization
 * ========================================================= */

!function ($) {

  var Slider = function (element, options) {
    this.element = $(element);
    this.picker = $('<div class="slider">' +
							'<div class="slider-track">' +
								'<div class="slider-selection"></div>' +
								'<div class="slider-handle"></div>' +
								'<div class="slider-handle"></div>' +
							'</div>' +
							'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>' +
						'</div>')
							.insertBefore(this.element)
							.append(this.element);

    this.id = this.element.attr('data-slider-id') || options.id;
    if (this.id) {
      this.picker[0].id = this.id;
    }

    if (typeof Modernizr !== 'undefined' && Modernizr.touch) {
      this.touchCapable = true;
    }

    var tooltip = this.element.attr('data-slider-tooltip') || options.tooltip;
    
    if (options.hideTooltip) {
        tooltip = "hide";
    }

    this.tooltip = this.picker.find('.tooltip');
    this.tooltipInner = this.tooltip.find('div.tooltip-inner');

    this.picker.addClass('slider-horizontal');       
    this.orientation = 'horizontal';
    this.stylePos = 'left';
    this.mousePos = 'pageX';
    this.sizePos = 'offsetWidth';
    
    var tooltipTopFactor = -this.tooltip.outerHeight() - 14 + 'px';
    if (options.isTitleBar) {
      tooltipTopFactor = -this.tooltip.outerHeight() - 31 + 'px';
    }
    this.tooltip.addClass('top')[0].style.top = tooltipTopFactor;

    this.min = options.min;
    this.max = options.max;
    this.step = options.step;
    if (this.step === 0) {
      this.step = 1;
    }
    this.titleValuesStep = options.titleValuesStep;
    if (this.titleValuesStep === 0) {
      this.titleValuesStep = 1;
    }
    if (this.titleValuesStep === 1 && this.step > 1) {
      this.titleValuesStep = this.step;
    }

    this.value = isNaN(options.sliderValue) ? options.sliderValue.split(";") : options.sliderValue;
    if (this.value[0] === "") {
      this.value = options.min;
    }
    if (this.value.length > 1) {
      if (this.value[0] === "0" && this.value[1] === "0") {
        this.value[0] = this.min;
        this.value[1] = this.max;
      }

      this.range = true;
    }

    this.selection = parseFloat(this.element.attr('data-slider-selection')) || options.selection;
    this.selectionEl = this.picker.find('.slider-selection');
    if (this.selection === 'none') {
      this.selectionEl.addClass('hide');
    }
    this.selectionElStyle = this.selectionEl[0].style;

    this.handle1 = this.picker.find('.slider-handle:first');
    this.handle1Stype = this.handle1[0].style;
    this.handle2 = this.picker.find('.slider-handle:last');
    this.handle2Stype = this.handle2[0].style;

    var handle = this.element.attr('data-slider-handle') || options.handle;
    switch (handle) {
      case 'round':
        this.handle1.addClass('round');
        this.handle2.addClass('round');
        break;
      default:
        this.handle1.addClass('rectangle');
        this.handle2.addClass('rectangle');
        break;
    }

    if (this.range) {
      this.value[0] = Math.max(this.min, Math.min(this.max, this.value[0]));
      this.value[1] = Math.max(this.min, Math.min(this.max, this.value[1]));
    } else {
      this.value = [Math.max(this.min, Math.min(this.max, this.value))];
      this.handle2.addClass('hide');
      if (this.selection == 'after') {
        this.value[1] = this.max;
      } else {
        this.value[1] = this.min;
      }
    }
    this.diff = this.max - this.min;
    this.percentage = [
			(this.value[0] - this.min) * 100 / this.diff,
			(this.value[1] - this.min) * 100 / this.diff,
			this.step * 100 / this.diff
    ];
    
    this.offset = this.picker.offset();   
    this.formater = options.formater;   

    var titleBarElement = $(this.element).parent().parent().find(".titleBar");

    if (!options.isTitleBar) {
      titleBarElement.addClass("hide");
    }
    else {
      this.getImageUrl = options.getImageUrl;

      var titleLabels = "";
      var diff = Math.abs(this.max - this.min);
      var countPoint = 1 + (diff / this.titleValuesStep);
      var widthPerc = 100 / countPoint;
 
      var isImgPresent = false;
      for (var i = this.min; i <= this.max; i += this.titleValuesStep) {
        var val = '';
        var imgSrc;
        if (this.range)
          val = i;
        else {
          imgSrc = this.getImageUrl(i);
          if (!imgSrc || typeof imgSrc == 'undefined' || imgSrc == '')
            val = this.formater(i);
          else
            isImgPresent = true;
        }        

        if (i == this.max) {  
          if (this.range)
            val = this.formater(this.max);
          else {
            imgSrc = this.getImageUrl(this.max);
            if (!imgSrc || typeof imgSrc == 'undefined' || imgSrc == '')
              val = this.formater(this.max);
          }         
        }

        titleLabels += '<div class="childVal" style="width:' + widthPerc + '%">';
        if (imgSrc && imgSrc != '') {          
          titleLabels += '<img src="' + imgSrc + '" />';                         
        } else {
              
          titleLabels += '<span>' + val + '</span>';              
        }         
        
        titleLabels += '</div>';        
      }
      
      if (titleBarElement) {
        if (isImgPresent) {
          titleBarElement.addClass("imageBar");
        }
        titleBarElement.html(titleLabels);

        var slider = $(this.element).parent();
        slider.css("width", 100 - widthPerc + "%");
        slider.css("margin-left", widthPerc/2 + "%");
      }
    }

    this.size = this.picker[0][this.sizePos];
    this.layout();

    if (this.touchCapable) {
      // Touch: Bind touch events:
      this.picker.on({
        touchstart: $.proxy(this.mousedown, this)
      });
    } else {
      this.picker.on({
        mousedown: $.proxy(this.mousedown, this)
      });
    }

    if (tooltip === 'show') {
      this.picker.on({
        mouseenter: $.proxy(this.showTooltip, this),
        mouseleave: $.proxy(this.hideTooltip, this)
      });
    } else {
      this.tooltip.addClass('hide');
    }

    if (isImgPresent) {
      this.tooltip.addClass('withImg');
    }

  };

  Slider.prototype = {
    constructor: Slider,

    over: false,
    inDrag: false,
    showTooltip: function () {
      if (this.element[0].disabled) {
        return;
      }
      this.tooltip.addClass('in');
      this.over = true;
    },

    hideTooltip: function () {
      if (this.inDrag === false) {
        this.tooltip.removeClass('in');
      }
      this.over = false;
    },

    layout: function () {      

      this.handle1Stype[this.stylePos] = this.percentage[0] + '%';
      this.handle2Stype[this.stylePos] = this.percentage[1] + '%';

      this.selectionElStyle.left = Math.min(this.percentage[0], this.percentage[1]) + '%';
      this.selectionElStyle.width = Math.abs(this.percentage[0] - this.percentage[1]) + '%';

      if (this.range) {
        this.tooltipInner.text(
					this.formater(this.value[0]) +
					' : ' +
					this.formater(this.value[1])
				);
        this.tooltip[0].style[this.stylePos] = this.size * (this.percentage[0] + (this.percentage[1] - this.percentage[0]) / 2) / 100 - (this.tooltip.outerWidth() / 2) + 'px';
      } else {
        this.tooltipInner.text(
					this.formater(this.value[0])
				);
        this.tooltip[0].style[this.stylePos] = this.size * this.percentage[0] / 100 - (this.tooltip.outerWidth() / 2) + 'px';
      }
    },

    mousedown: function (ev) {
      if (this.element[0].disabled) {
        return false;
      }

      // Touch: Get the original event:
      if (this.touchCapable && ev.type === 'touchstart') {
        ev = ev.originalEvent;
      }

      this.offset = this.picker.offset();
      this.size = this.picker[0][this.sizePos];

      var percentage = this.getPercentage(ev);
      
      if (this.range) {
        var diff1 = Math.abs(this.percentage[0] - percentage);
        var diff2 = Math.abs(this.percentage[1] - percentage);
        this.dragged = (diff1 < diff2) ? 0 : 1;
      } else {
        this.dragged = 0;
      }

      this.percentage[this.dragged] = percentage;

      var val = this.calculateValue();

      this.layout();

      if (this.touchCapable) {
        // Touch: Bind touch events:
        $(document).on({
          touchmove: $.proxy(this.mousemove, this),
          touchend: $.proxy(this.mouseup, this)
        });
      } else {
        $(document).on({
          mousemove: $.proxy(this.mousemove, this),
          mouseup: $.proxy(this.mouseup, this)
        });
      }

      this.inDrag = true;

      this.element.trigger({
        type: 'slideStart',
        value: val
      }).trigger({
        type: 'slide',
        value: val
      });
      return false;
    },

    mousemove: function (ev) {
      if (this.element[0].disabled) {
        return false;
      }

      // Touch: Get the original event:
      if (this.touchCapable && ev.type === 'touchmove') {
        ev = ev.originalEvent;
      }

      var percentage = this.getPercentage(ev);
      if (this.range) {
        if (this.dragged === 0 && this.percentage[1] < percentage) {
          this.percentage[0] = this.percentage[1];
          this.dragged = 1;
        } else if (this.dragged === 1 && this.percentage[0] > percentage) {
          this.percentage[1] = this.percentage[0];
          this.dragged = 0;
        }
      }
      this.percentage[this.dragged] = percentage;

      this.layout();
      var val = this.calculateValue();

      this.element
				.trigger({
				  type: 'slide',
				  value: val
				})
				.attr('data-value', val)
				.prop('value', val);
      return false;
    },

    mouseup: function (ev) {
      if (this.element[0].disabled) {
        return false;
      }

      if (this.touchCapable) {
        // Touch: Bind touch events:
        $(document).off({
          touchmove: this.mousemove,
          touchend: this.mouseup
        });
      } else {
        $(document).off({
          mousemove: this.mousemove,
          mouseup: this.mouseup
        });
      }

      this.inDrag = false;
      if (this.over == false) {
        this.hideTooltip();
      }

      var val = this.calculateValue();

      this.element
				.trigger({
				  type: 'slideStop',
				  value: val
				})
				.attr('data-value', val)
				.prop('value', val);
      return false;
    },

    calculateValue: function () {
      var val;
      if (this.range) {
        val = [
					(this.min + Math.round((this.diff * this.percentage[0] / 100) / this.step) * this.step),
					(this.min + Math.round((this.diff * this.percentage[1] / 100) / this.step) * this.step)
        ];
        this.value = val;
      } else {
        val = (this.min + Math.round((this.diff * this.percentage[0] / 100) / this.step) * this.step);
        this.value = [val, this.value[1]];
      }
      return val;
    },

    getPercentage: function (ev) {
      if (this.touchCapable) {
        ev = ev.touches[0];
      }
      var percentage = (ev[this.mousePos] - this.offset[this.stylePos]) * 100 / this.size;
      percentage = Math.round(percentage / this.percentage[2]) * this.percentage[2];
      return Math.max(0, Math.min(100, percentage));
    },

    getValue: function () {
      if (this.range) {
        return this.value;
      }
      return this.value[0];
    },

    setValue: function (val) {            
      this.value = isNaN(val) ? val.split(";") : val;
      
      if (this.range) {
        this.value[0] = Math.max(this.min, Math.min(this.max, this.value[0]));
        this.value[1] = Math.max(this.min, Math.min(this.max, this.value[1]));
      } else {
        this.value = [Math.max(this.min, Math.min(this.max, this.value))];
        this.handle2.addClass('hide');
        if (this.selection == 'after') {
          this.value[1] = this.max;
        } else {
          this.value[1] = this.min;
        }
      }
      this.diff = this.max - this.min;
      this.percentage = [
				(this.value[0] - this.min) * 100 / this.diff,
				(this.value[1] - this.min) * 100 / this.diff,
				this.step * 100 / this.diff
      ];
      this.layout();
    }
  };

  $.fn.sliderCustom = function (option, val) {
    return this.each(function () {
      var $this = $(this),
	      data = $this.attr('data-slider'),
	      options = typeof option === 'object' && option;

      
      $this.data('slider', (data = new Slider(this, $.extend({}, $.fn.sliderCustom.defaults, options))));

      if (typeof option == 'string') {
        data[option](val);
      }
    });
  };

  $.fn.sliderCustom.defaults = {
    min: 0,
    max: 10,
    step: 1,
    value: 10,
    selection: 'before',
    tooltip: 'show',
    handle: 'round',
    formater: function (value) {
      return value;
    },
    getImageUrl: function (value) {
      return value;
    }

  };

  $.fn.sliderCustom.Constructor = Slider;

}(window.jQuery);
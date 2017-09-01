(function (Speak) {
  define("ListControl/TemplateHelper", ["handlebars", "bclImageHelper"], function (handlebars, imageHelper) {
    var getFixedNumber = function (value) {
      //http://stackoverflow.com/a/12830454/2833684
      return +(value).toFixed(2);
    },

      getRoundedPercentage = function (dataObj, columnDefinitionItem) {
        var denominator = 0,
          progressValue = dataObj[columnDefinitionItem.ProgressFieldName];

        if (columnDefinitionItem.IsPreCalculated) {
          return getFixedNumber(progressValue * 100);
        }

        denominator = (columnDefinitionItem.IsDividedByFixedValue) ? columnDefinitionItem.DivideByValue : dataObj[columnDefinitionItem.DivideByFieldName];
        return getFixedNumber((progressValue / denominator) * 100);
      },

      getColumnFieldValue = function (dataObj, prop) {
        if (!dataObj.hasOwnProperty(this[prop]) && Speak.isDebug() === "1") {
          console.warn(prop + ' "' + this[prop] + '" was not found in: ', dataObj);
        }
        return dataObj[this[prop]];
      },

      getFieldValue = function (prop) {
        if (!this.hasOwnProperty(prop) && Speak.isDebug() === "1") {
          console.warn(prop + ' "' + this[prop] + '" was not found in: ', JSON.stringify(this.__properties));
        }
        return this[prop];
      };

    var compiledHtmlTemplate = {};

    var TemplateHelper = function () {};

    TemplateHelper.prototype.throwError = function (message) {
      throw "ListControl error: " + message;
    };

    TemplateHelper.prototype.setupTemplates = function (el) {
      // querySelectorAll returns a NodeList, which needs to be converted into an Array
      var templates = Array.prototype.slice.call(el.querySelectorAll("script[type='text/x-handlebars-template']"));

      handlebars.templates = handlebars.templates || {};

      templates.forEach(function (item) {
        handlebars.templates[item.id] = handlebars.compile(item.innerHTML);
      });

      handlebars.partials = handlebars.templates;

      this.setupTemplateHelpers();
    };

    TemplateHelper.prototype.render = function (viewMode, internalData, el) {
      el.querySelector(".sc-listcontrol-content").innerHTML = handlebars.templates["template-" + viewMode](internalData);
    };

    // TODO: REMOVE THIS DEBUG HELPER WHEN NOT NEEDED!
    // THIS IS NOT FOR PRODUCTION!
    // {{debug}}
    TemplateHelper.prototype.debug = function (optionalValue) {
      console.log("Current Context");
      console.log("====================");
      console.log(this);

      if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
      }
    };

    TemplateHelper.prototype.buildConditionalString = function (settings, dataObj) {
      if (arguments.length === 2) {
        dataObj = this;
      }

      var stringArr = [],
        settingsObj = {},
        placeholderChar = "{VALUE}",
        i = 0;

      settingsObj = JSON.parse(settings);

      for (i in settingsObj) {
        if (settingsObj.hasOwnProperty(i) && (dataObj[i] || dataObj[i] === 0)) {
          var option = settingsObj[i];
          if (option.indexOf(placeholderChar) > 0) {
            option = option.replace(new RegExp(placeholderChar, "g"), dataObj[i]).toLowerCase();
          }
          stringArr.push(option);
        }
      }
      return stringArr.join(" ");
    };

    TemplateHelper.prototype.conditionalWrap = function (settings, dataObj, options) {
      if (arguments.length === 2) {
        options = dataObj;
        dataObj = this;
      }

      var output = options.fn(this).trim(),
        settingsArr = null,
        i = 0;

      settingsArr = JSON.parse(settings);

      if (!Array.isArray(settingsArr)) {
        return "";
      }

      settingsArr.reverse().forEach(function (item) {
        var key = Object.keys(item)[0];
        if (dataObj[key]) {
          output = "<" + item[key] + ">" + output + "</" + item[key] + ">";
        }
      });

      return new handlebars.SafeString(output);
    };

    TemplateHelper.prototype.repeatBlock = function (n, options) {
      var accum = "";
      for (var i = 0; i < n; i = i + 1)
        accum += options.fn();
      return accum.trim();
    };

    TemplateHelper.prototype.reverseStripes = function (items) {
      return (items.length % 2 || items.length === 0) ? "sc-reverse-stripes" : "";
    };

    TemplateHelper.prototype.getColumnPartial = function (context, item, options) {
      var columnType = this.ColumnType.toLowerCase(),
        name = "nodata";

      if (columnType === "htmltemplate" || item[this.ImageFieldName] != null || item[this.LinkTextFieldName] != null || item[this.ProgressFieldName] != null || item[this.DataFieldName] != null) {
        name = columnType;
      }
      
      var templateName = "template-detaillist-column-" + name;

      context = JSON.parse(JSON.stringify(context));
      context.ValueItem = item;

      return handlebars.partials[templateName](context, options);
    };

    TemplateHelper.prototype.getProgressPercentage = function (dataObj) {
      return getRoundedPercentage(dataObj, this);
    };

    TemplateHelper.prototype.compilePartial = function (source, data) {
      if (!compiledHtmlTemplate.hasOwnProperty(this.ColumnFieldId)) {
        compiledHtmlTemplate[this.ColumnFieldId] = handlebars.compile(source);
      }

      var template = compiledHtmlTemplate[this.ColumnFieldId];

      return template(data);
    };

    TemplateHelper.prototype.getColumnFieldValue = getColumnFieldValue;

    TemplateHelper.prototype.getFieldValue = getFieldValue;

    TemplateHelper.prototype.getTileTemplate = function (id, data) {
      var template = handlebars.templates["template-tilelist-" + id] ? handlebars.templates["template-tilelist-" + id](data) : "";

      return template;
    };


    TemplateHelper.prototype.ifDataMissingForDetailList = function (dataObj, options) {
      if (arguments.length === 1) {
        options = dataObj;
        dataObj = this;
      }
      var hasItems = (Array.isArray(dataObj.Items) && dataObj.Items.length > 0) ? true : false,
        hasColumnDefinitionItems = (typeof dataObj.Settings.DetailList.ColumnDefinitionItems === "object") ? true : false;
      return (hasColumnDefinitionItems && hasItems) ? options.inverse(this) : options.fn(this);
    };

    TemplateHelper.prototype.getImageUrl = function (dataObj, prop) {
      var image;

      if (typeof dataObj === "string") {
        prop = dataObj;
        dataObj = this;
        image = dataObj[prop];
      } else {
        image = getColumnFieldValue.call(this, dataObj, prop);
      }

      if (image.indexOf("<image") !== -1) {
        var dbString = dataObj.hasOwnProperty("$database") ? dataObj["$database"] : "";
        image = imageHelper.getUrl(image, dbString);
      }

      return image;
    };

    TemplateHelper.prototype.getImageAlt = function (dataObj, altProp, imageProp) {
      var dataObjIsString = (typeof dataObj === "string"),
        alt = dataObjIsString ? this[dataObj] : getColumnFieldValue.call(this, dataObj, altProp),
        image = dataObjIsString ? this[altProp] : getColumnFieldValue.call(this, dataObj, imageProp);

      if (alt) {
        return alt;
      } else if (image.indexOf("<image") !== -1) {
        return imageHelper.getAlt(image);
      }

      return "";
    };

    TemplateHelper.prototype.getColumnFieldDateTimeValue = function (dataObj, prop) {
      var rawValue = handlebars.helpers["ListControl:GetColumnFieldValue"].call(this, dataObj, prop);

      if (rawValue == null) {
        return "";
      }

      var dateFormatterObject = {};
      dateFormatterObject[this.DateFormat.Type] = this.DateFormat.Value;

      var dateFormatter = Speak.globalize.dateFormatter(dateFormatterObject);

      return dateFormatter(Speak.utils.date.parseISO(rawValue));
    };

    TemplateHelper.prototype.getHeaderTitle = function(dataObj) {
      var title = this.ColumnTitle;
      var sorted = this.SortDirection ? dataObj.data.root.Settings.Texts.Sorted[this.SortDirection] : null;

      return sorted ? title + " - " + sorted : title;
    };

    TemplateHelper.prototype.setupTemplateHelpers = function () {
      handlebars.registerHelper("debug", this.debug);
      handlebars.registerHelper("ListControl:GetColumnFieldDateTimeValue", this.getColumnFieldDateTimeValue);
      handlebars.registerHelper("ListControl:ifDataMissingForDetailList", this.ifDataMissingForDetailList);
      handlebars.registerHelper("ListControl:GetColumnFieldValue", getColumnFieldValue);
      handlebars.registerHelper("ListControl:GetFieldValue", getFieldValue);
      handlebars.registerHelper('ListControl:ConditionalWrap', this.conditionalWrap);
      handlebars.registerHelper("ListControl:Classes", this.buildConditionalString);
      handlebars.registerHelper("ListControl:Styles", this.buildConditionalString);
      handlebars.registerHelper("ListControl:GetColumnPartial", this.getColumnPartial);
      handlebars.registerHelper("ListControl:CompilePartial", this.compilePartial);
      handlebars.registerHelper("ListControl:Progress", this.getProgressPercentage);
      handlebars.registerHelper("ListControl:ReverseStripes", this.reverseStripes);
      handlebars.registerHelper("ListControl:Repeat", this.repeatBlock);
      handlebars.registerHelper("ListControl:ImageUrl", this.getImageUrl);
      handlebars.registerHelper("ListControl:GetTileTemplate", this.getTileTemplate);
      handlebars.registerHelper("ListControl:ImageAlt", this.getImageAlt);
      handlebars.registerHelper("ListControl:GetHeaderTitle", this.getHeaderTitle);
    };

    return TemplateHelper;
  });
})(Sitecore.Speak);
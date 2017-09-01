define(["sitecore"], function (sc)
{
  var cintelTableNameProperty = "cintelTableName";
  var cintelQueryParametersProperty = "cintelQueryParameters";
  var cintelMessageBarProperty = "cintelMessageBar";
  var pageNumberProperty = "pageNumber";
  var pageSizeProperty = "pageSize";
  var originalPageSizeProperty = "originalPageSize";
  var hasErrorProperty = "hasError";
  var hasMoreDataProperty = "hasMoreData";
  var dataBackupProperty = "dataBackup";
  var cidataProperty = "cidata";
  var hasErrorHandlerProperty = "hasErrorHandler";
  var addTransformerKey = false;
  
  var sortParam = "sort";
  var asc = "asc";
  var desc = "desc";

  var pageAddedEvent = "pageAdded";

  var transformerArray = [];

  var beforeSend = function(xhr, options)
  {
    if (options.url.toLowerCase().indexOf("/sitecore/api/ao/v1/") < 0)
    {
      return;
    }

    var language = $('meta[name=language]').attr("content");
    xhr.setRequestHeader("Accept-Language", language ? language : '');

    xhr.setRequestHeader("X-SC-TimezoneOffset", new Date().getTimezoneOffset()*(-1));

    if (!transformerArray)
    {
      return;
    }

    for (var i = 0; i < transformerArray.length; i++)
    {
      var transformer = transformerArray[i];
      if (options.url.indexOf(transformer.urlKey) >= 0)
      {
        xhr.setRequestHeader("X-SC-CintelTransformerClientName", "speakClient");
        xhr.setRequestHeader("X-SC-CintelTransfomerKey", transformer.headerValue);
        break;
      }
    }
	
	if (addTransformerKey === true)
    {
        xhr.setRequestHeader("X-SC-CintelTransformerClientName", "speakClient");
        xhr.setRequestHeader("X-SC-CintelTransfomerKey", "default");
		addTransformerKey = false;
    }

  };

  return {
    setupHeaders: function (transformers)
    {
      if (transformers)
      {
        transformerArray = transformerArray.concat(transformers);
      }

      $.ajaxSetup({ beforeSend: beforeSend });
    },

    initProvider: function (provider, tableName, url, messageBar)
    {
      provider.set(cintelTableNameProperty, tableName);
      provider.set("dataUrl", url);

      provider.set(cintelQueryParametersProperty, {});
      
      this.addErrorHandler(provider);
      
      if (messageBar)
      {
        provider.set(cintelMessageBarProperty, messageBar);
      }

      var helper = this;
      provider.nextListData = function()
      {
        this.set(pageNumberProperty, this.get(pageNumberProperty) + 1);
        helper.requestPage(this);
      };
    },
    
    setDefaultSorting: function(provider, column, isDescending)
    {
      var order = isDescending ? desc : asc;
      this.addQueryParameter(provider, sortParam, column + "%20" + order);
    },
    
    updateSortingFromList: function (provider, listControl)
    {
      var sorting = listControl.get("sorting");
      if (sorting.length < 2) return;

      var sort = sorting.split("|")[0],
          direction = (sort[0] == 'd') ? asc : desc, // values are reverted as a temporal workaround to ListControl issue #3064
          providerSort = sort.substring(1) + "%20" + direction;

      this.addQueryParameter(provider, sortParam, providerSort);
    },
    
    subscribeSorting: function (provider, listControl)
    {
      listControl.on("change:sorting", function ()
      {
        var pageNumber = provider.get(pageNumberProperty);
        if (pageNumber > 1)
        {
          var originalPageSize = provider.get(pageSizeProperty);
          provider.set(pageSizeProperty, originalPageSize * pageNumber);
          provider.set(originalPageSizeProperty, originalPageSize);
        }

        this.updateSortingFromList(provider, listControl);
        
        this.getListData(provider);
      }, this);
    },
    
    subscribeAccordionHeader: function (provider, accordion)
    {
      var headerProperty = "header";
      var initialHeader = accordion.get(headerProperty);
      accordion.set(headerProperty, initialHeader + " (0)");
      
      provider.on(pageAddedEvent, function (newData)
      {
        var count = provider.get("totalRecordCount");
        count = count ? count : 0;
        accordion.set(headerProperty, initialHeader + " (" + count + ")");
      });
    },

    getListData: function (provider)
    {
      provider.set(pageNumberProperty, 1);
      this.requestPage(provider);
    },

    getMoreListData: function (provider, increasePagesSizeStep) {
        var newPageSize = provider.get(pageSizeProperty) + increasePagesSizeStep;
        provider.set(pageSizeProperty, newPageSize);
        this.requestPage(provider);
    },

    getData: function (provider, onSuccessHandler)
    {
      var helper = this;
      var requestOptions =
      {
        url: provider.get("cintelUrl"),
        onSuccess: function(jsonData)
        {
          provider.set(hasErrorProperty, false);
          onSuccessHandler(jsonData);
          helper.showSuccessMessages(provider);
        }
      };

      provider.viewModel.getData(requestOptions);
    },

    addQueryParameter: function (provider, name, value) {
      var queryParameters = provider.get(cintelQueryParametersProperty);
      queryParameters[name] = value;
    },

    getQueryParameters: function (provider) {
      var query = "";
      var queryParameters = provider.get(cintelQueryParametersProperty);

      var separator = "";
      _.each(queryParameters, function(value, name)
      {
        query += separator + name + "=" + value;
        separator = "&";
      });
      return query;
    },
    
    setupDataRepeater: function(provider, repeater)
    {
      provider.on(pageAddedEvent, repeater.viewModel.addData);
    },
    
    requestPage: function (provider)
    {
      provider.set("queryParameters", this.getQueryParameters(provider));
      this.getData(
        provider,
        $.proxy(function (jsonData)
        {
          var hasMoreData = (jsonData.pageNumber * jsonData.pageSize) < jsonData.totalRecordCount;
          provider.set(hasMoreDataProperty, hasMoreData);
          
          if (jsonData.totalRecordCount < 1)
          {
            provider.set("hasData", false);
            provider.set("hasNoData", true);
          }
          
          var oldData = provider.get(pageNumberProperty) > 1 ? provider.get(dataBackupProperty) : [];
          var newData = jsonData.data.dataSet[provider.get(cintelTableNameProperty)];

          if (!newData)
          {
            return;
          }

          this.setItemId(newData, oldData.length);
          var data = oldData.concat(newData);

          provider.set(cidataProperty, data);
          //provider.set("data", data);
          provider.set(dataBackupProperty, data);
          
          var originalPageSize = provider.get(originalPageSizeProperty);
          if (originalPageSize)
          {
            var pageSize = provider.get(pageSizeProperty);
            provider.set(pageSizeProperty, originalPageSize);
            provider.set(pageNumberProperty, pageSize / originalPageSize);
            provider.unset(originalPageSizeProperty);
          }
          
          provider.trigger(pageAddedEvent, newData);
        }, this)
      );
    },
    
    showSuccessMessages: function (provider)
    {
      var messages = provider.get("messages");
      var messageBar = provider.get(cintelMessageBarProperty);
      if (messageBar && messages)
      {
        for (var i = 0; i < messages.length; i++)
        {
          // filter duplicates here if necessary

          var curMessage = messages[i];
          messageBar.addMessage(curMessage.messageType.toLocaleLowerCase(), curMessage.text);
        }
      }
    },
  
    addErrorHandler: function (provider)
    {
      if (provider.get(hasErrorHandlerProperty)) return;

      provider.set(hasErrorProperty, false);

      provider.on("error", function (error)
      {
        error.response.status == 401 ? document.location.reload() : $.noop();
        provider.set(hasMoreDataProperty, false);
        provider.set("isBusy", false);
        provider.set(cidataProperty, null);
        //provider.set("data", null);

        provider.set(hasErrorProperty, true);

        var errorMessage = error.response.responseJSON.Message;
        var messageBar = provider.get(cintelMessageBarProperty);
        if (messageBar)
        {
          messageBar.addMessage('error', errorMessage);
        } else
        {
          provider.set("errorMessage", errorMessage);
        }
      });

      provider.set(hasErrorHandlerProperty, true);
    },
    
    setItemId: function (items, lenght)
    {
      $.each(items, function (index)
      {
        this.itemId = index + 1 + lenght;
      });
    },

    addDefaultTransformerKey: function() {
        addTransformerKey = true;
    }
	
  };
});
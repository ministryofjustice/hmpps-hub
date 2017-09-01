define(['jquery-ui', 'knockout'], function($, ko) {
  return [
    {
      name: 'text',
      enterKey: function (filter, evt, context) {
        filter.endEdit() && context.$parent.performSearch();
      }
    },
    {
      name: 'check box',
      checked: function ($data) {
        return ko.computed({
          read: function() {
            return $data.value() == 'true';
          },
          write: function(newValue) {
            $data.value(newValue ? 'true' : 'false');
          }
        });
      },
      enterKey: function (filter, evt, context) {
        filter.endEdit() && context.$parent.performSearch();
      }
    },
    {
      name: 'auto suggest list',
      source: function(request, response) {
        $.ajax({
          type: 'POST',
          url: '/sitecore/shell/Applications/Buckets/' + this.filterType.webMethod,
          dataType: "json",
          data: JSON.stringify({ tagChars: request.term }),
          contentType: "application/json; charset=utf-8",
          success: function(data) {
            response(data.d.map(function (item) {
              var result;
              if (item + '' === item) {
                result = { label: item, value: item };
              } else if (item.Id && item.Name && item.Path  ) {
                result = { label: item.Name + '|' + item.Id, value: item.Name + '|' + item.Id, id: item.Id, name: item.Name, path: item.Path };
              } else if (item.DisplayText && item.DisplayValue) {
                result = { label: item.DisplayText + '|' + item.DisplayValue, value: item.DisplayText + '|' + item.DisplayValue };
              } else {
                result = { label: 'unknown', value: 'unknown' };                
              }

              return result;
            }));
          }
        });
      },
      select: function (evt, ui) {
        if (this.filterType.clientSideHook.name == 'custom') {
          this.value(ui.item.value + '|');
        } else {
          this.value(ui.item.value);
        };
        
        this.startEdit();
        return false;
      },
      enterKey: function(filter, evt, context) {
        filter.endEdit() && context.$parent.performSearch();
      }
    },
    {
      name: 'calendar',
      onSelect: function(date) {
        this.value(date);
      },
      beforeShow: function() {
        this._calendarIsShown = true;
      },
      onClose: function() {
        this._calendarIsShown = false;
        this.editing(false);

        // It was necessary to fix an issue in IE when datepicker opened again after selecting a date
        $('.hasDatepicker').datepicker('disable');
        setTimeout(function() {
          $('.hasDatepicker').datepicker('enable');
        }, 200);
      },
      hasFocus: function ($data) {
        return ko.computed({
          read: function() {
            return $data.editing();
          },
          write: function(newValue) {
            (newValue || !$data._calendarIsShown) && $data.editing(newValue);
          }
        });
      },
      enterKey: function(filter, evt, context) {
        $('.hasDatepicker').datepicker('hide');
        filter.endEdit() && context.$parent.performSearch();
      },
    }
  ];
});
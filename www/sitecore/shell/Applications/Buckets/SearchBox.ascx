<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="SearchBox.ascx.cs" Inherits="Sitecore.Buckets.Module.SearchBox" %>

<!-- "Filter" template -->
<script type="text/html" id="filterTemplate">
  <div class="filter" data-bind="css: { readonly: readOnly }, stopBubble: true">
    <div class="icon unselectable" data-bind="
      click: toggleOperation,
      css: operation,
      style: { backgroundImage: 'url(' + iconPath() + ')' },
      attr: { title: window.scTranslations.toggleThisSearchFilter }">
    </div>
    <div class="display-name" data-bind="text: displayName"></div><!--
 --><div class="display-name semicolon">:</div>
    <div class="value" data-bind="style: { maxWidth: getValueMaxWidth($element) }">
      <pre class="hidden-raw-value" data-bind="
        text: filterType.controlType.name != 'check box' ? value : '',
        style: { minWidth: filterType.controlType.name != 'check box' ? null : '5px' },
        visible: editing"></pre>
      <!-- ko template: { name: filterType.controlType.name, afterRender: onAfterRender} -->
      <!-- /ko -->
      <div class="display-value" data-bind="
        text: displayValue,
        visible: !editing(),
        click: startEdit,
        css: { invalid: !isValid() },
        attr: { title: window.scTranslations.edit + ': ' + value() }">
      </div>
    </div><!--
 --><div class="remove unselectable" data-bind="
      event: { mousedown: $parent.removeFilter },
      visible: !readOnly,
      attr: { title: window.scTranslations.removeSearchFilter }"></div>
  </div>
</script>
  
<!-- "Text" control template -->
<script type="text/html" id="text">
  <input type="text" class="raw-value scIgnoreModified" data-bind="
    value: value,
    visible: editing,
    hasFocus: editing,
    enterKey: filterType.controlType.enterKey,
    backspaceKey: $parent.onBackspaceKeyInFilter,
    event: { focus: setCursorToEnd },
    attr: { title: value() },
    valueUpdate: 'afterkeydown'" />
</script>
     
<!-- "Check box" control template --> 
<script type="text/html" id="check box">
  <input type="checkbox" class="raw-value checkbox scIgnoreModified" data-bind="
    checked: filterType.controlType.checked($data),
    visible: editing,
    hasFocus: editing,
    enterKey: filterType.controlType.enterKey" />
</script>

<!-- "Auto Suggest List" control template -->
<script type="text/html" id="auto suggest list">
  <input type="text" class="raw-value scIgnoreModified" data-bind="autocomplete: {
    source: filterType.controlType.source.bind($data),
      select: filterType.controlType.select.bind($data),
      minLength: 0,
      delay: 200
    },
    value: value,
    visible: editing,
    hasFocus: editing,
    enterKey: filterType.controlType.enterKey,
    backspaceKey: $parent.onBackspaceKeyInFilter,
    event: { focus: setCursorToEnd },
    attr: { title: value() },
    valueUpdate: 'afterkeydown'" />
</script>
  
<!-- "Calendar" control template -->
<script type="text/html" id="calendar">
  <input type="text" class="raw-value scIgnoreModified" data-bind="datepicker: {
      onSelect: filterType.controlType.onSelect.bind($data),
      beforeShow: filterType.controlType.beforeShow.bind($data),
      onClose: filterType.controlType.onClose.bind($data),
      showAnim: ''
    },
    value: value,
    visible: editing,
    hasFocus: filterType.controlType.hasFocus($data),
    enterKey: filterType.controlType.enterKey,
    backspaceKey: $parent.onBackspaceKeyInFilter,
    valueUpdate: 'afterkeydown'" />
</script>

<div class="search-box">
  <div class="btn sb_down" data-bind="attr: { title: window.scTranslations.moreSearchOptions }"></div>
  <div class="filters-container" data-bind="style: { backgroundImage: baseItemIconPath ? 'url(~/icon/' + baseItemIconPath + ')' : 'none' }, click: function () { userRawInputHasFocus(true); }">
    <div class="filters" data-bind="template: { name: 'filterTemplate', foreach: filters }">
    </div>
    <input type="text" id="raw-user-input" class="raw-user-input scIgnoreModified" data-bind="value: userRawInput, hasFocus: userRawInputHasFocus, valueUpdate: 'afterkeydown',
      autocomplete: { source: allSearchFilterNames, select: onFilterSelect, autoFocus: true, minLength: 0, delay: 0 }, enterKey: performSearch" />
  </div>
  <div class="clear-search-box">
    <div class="btn btn-clear hidden" data-bind="click: removeAllFilters, css: { hidden: couldSearchBeCleared() }, attr: { title: window.scTranslations.clear }"></div><!--
  --><div class="btn btn-search" data-bind="click: performSearch, attr: { title: window.scTranslations.search }"></div>
  </div>
</div>
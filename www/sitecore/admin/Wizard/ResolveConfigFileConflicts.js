var showConflict = function() {
  var $txtSource = window.jQuery('input[id$=SourceFile]');
  var $txtTarget = window.jQuery('input[id$=TargetFile]');
  var diffoutputdiv = window.jQuery('div[id$=diffcontainer]');

  if ($txtSource.length > 0 && $txtTarget.length > 0 && diffoutputdiv.length > 0) {
    var $source = difflib.stringAsLines($txtSource[0].value);
    var $target = difflib.stringAsLines($txtTarget[0].value);

    var sm = new difflib.SequenceMatcher($source, $target);
    var opcodes = sm.get_opcodes();

    while (diffoutputdiv.firstChild) {
      diffoutputdiv.removeChild(diffoutputdiv.firstChild);
    }

    diffoutputdiv[0].appendChild(
      diffview.buildView({
        baseTextLines: $source,
        newTextLines: $target,
        opcodes: opcodes,
        viewType: 1,
        showTitle: false
      }));
  }
};
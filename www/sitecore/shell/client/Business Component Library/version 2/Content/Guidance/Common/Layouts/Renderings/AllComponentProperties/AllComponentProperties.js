(function (Speak) {
  Speak.pageCode(["/sitecore/shell/client/Business Component Library/version 2/Assets/lib/deps/ExcelExport/jquery.battatech.excelexport.js"], function () {
    
    return {    
      exportToExcel: function() {
        var uri = $("#tblExport").battatech_excelexport({
          containerid: "tblExport",
          datatype: 'table'
        });

        $(this.ExportButton.el).attr('download', 'AllComponentsList.xls').attr('href', uri).attr('target', '_blank');
      }
    }
  });
})(Sitecore.Speak);
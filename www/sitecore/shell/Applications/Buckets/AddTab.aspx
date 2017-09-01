<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AddTab.aspx.cs" Inherits="Sitecore.Buckets.Module.AddTab" %>

<%@ Import Namespace="Sitecore" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
    <script type="text/javascript" src="./libs/jquery/jquery-1.10.2.min.js"></script>
    <script type="text/javascript" src="./libs/jquery/jquery-migrate-1.2.1.js"></script>
    <script type="text/javascript" src="./Scripts/jquery.noconflict.js"></script>

    <script type="text/javascript" src="/sitecore/shell/controls/lib/prototype/prototype.js"></script>
    <script type="text/javascript" src="/sitecore/shell/controls/Browser.js"></script>
    <script type="text/javascript" src="/sitecore/shell/controls/Sitecore.js"></script>

    <script type="text/javascript">
        $j(document).ready(function () {

            var firstLoad = true;

            $j(".scRibbonEditorTabNormal", parent.document.body).click(function () {
                var icon = $j('.scEditorTabHeaderActive', parent.document.body)[0].firstChild;
                var filter = icon.style.filter;
                var src = icon.src;
                var iconPath = "Applications/16x16/view_add.png";
                if (src.indexOf(iconPath) != -1 || filter.indexOf(iconPath) != -1) {
                    window.scForm.getParentForm().postRequest('', '', '', 'contenteditor:launchblanktab(url=' + '' + ')');
                    firstLoad = false;
                }
            });
        });

    </script>
</head>
<body>
    <form id="form1" runat="server">
        <div>
        </div>
    </form>
</body>
</html>

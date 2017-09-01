<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SupportPackage.aspx.cs" Inherits="Sitecore.ExperienceContentManagement.Administration.SupportPackage" %>

<%@ Import Namespace="Sitecore.ExperienceContentManagement.Administration.Helpers.SupportPackage.Utility" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
  <title>Sitecore Support Package Generator</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge;chrome=1" />

  <link href="/sitecore/shell/themes/standard/default/WebFramework.css" rel="Stylesheet" />
  <link href="/sitecore/admin/Wizard/UpdateInstallationWizard.css" rel="Stylesheet" />
  <link href="/sitecore/shell/Themes/Standard/Default/WebFramework.css" rel="Stylesheet" />
  <link rel="Stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css" />

  <script type="text/javascript" src="/sitecore/shell/Controls/lib/jQuery/jquery.js"></script>
  <script type="text/javascript" src="/sitecore/shell/controls/webframework/webframework.js"></script>
  <script src="//code.jquery.com/jquery-1.10.2.js"></script>
  <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>

  <style>
    table, th, tr, td {
      border: 1px solid #ccc;
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background: gray;
      color: white;
    }

    .categoryColumn {
      width: 70%;
      padding-left: 5px;
    }

    .testCountColumn {
      text-align: center;
      width: 15%;
    }

    .error {
      color: red;
    }

    .warning {
      color: darkorange;
    }

    table.noBorders,
    table.noBorders tr,
    table.noBorders td {
      border: 0;
    }

      table.noBorders td {
        padding-bottom: 9px;
      }
  </style>

  <script>

    var flag = false;

    function selectAll() {
      var collectors = $(":checkbox");

      collectors.each(function () {
        if (($(this)[0].id.toLowerCase().indexOf("basiccollectorsrepeater") === 0 ||
					$(this)[0].id.toLowerCase().indexOf("advancedcollectorsrepeater") === 0) &&
					$(this)[0].disabled !== true) {
          $(this)[0].checked = true;
        }
        categoryChanged();
      });
    }

    function getSelectedCollectors() {
      if ($("#CollectorsContainer").css('display') === 'block') {
        var selected = [];
        $('#CollectorsContainer input:checked').each(function () {
          selected.push($(this).attr('value'));
        });
        var selectedCollectors = $("#SelectedCollectors");
        selectedCollectors.val(selected.join("|"));
      }
    }

    function uploadToFTP() {
      var uploadButton = $("#UploadToFTPButton");
      var saveButton = $("#SavePackageButton");
      var restartButton = $("#RestartButton");
      uploadButton.attr("disabled", true);
      saveButton.attr("disabled", true);
      restartButton.attr("disabled", true);
      $("#additionalInfo").append("<br/><br/>Uploading package to Sitecore Support File Server... ");
      $('div#additionalInfo')[0].scrollTop = $('div#additionalInfo')[0].scrollHeight;

      $.ajax({
        type: "POST",
        url: "/sitecore/admin/supportpackage.aspx/UploadToFTP",
        data: JSON.stringify({ "sessionGuid": $('input#SessionGuid').val() }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (msg) {
          $("#additionalInfo").append(msg.d);
          uploadButton.attr("disabled", false);
          saveButton.attr("disabled", false);
          restartButton.attr("disabled", false);
          $('div#additionalInfo')[0].scrollTop = $('div#additionalInfo')[0].scrollHeight;
        }
      });
    }


    function selectNone() {
      var categories = $(":checkbox");
      categories.each(function () {
        if ($(this)[0].id.toLowerCase().indexOf("basiccollectorsrepeater") === 0 ||
          $(this)[0].id.toLowerCase().indexOf("advancedcollectorsrepeater") === 0) {
          $(this)[0].checked = false;
        }
        categoryChanged();
      });
    }

    function showMoreInfo() {
      var moreInfo = $('div#additionalInfo');
      if (moreInfo.hasClass("hidden")) {
        moreInfo.removeClass("hidden");
        $("#moreInformationImage").attr("src", "/sitecore/shell/Themes/Standard/Images/Progress/more_expanded.png");
        moreInfo.slideDown("slow");
      } else {
        moreInfo.addClass("hidden");
        $("#moreInformationImage").attr("src", "/sitecore/shell/Themes/Standard/Images/Progress/more_collapsed.png");
        moreInfo.slideUp("slow");
      }
    }

    function updateProgress() {
      $.ajax({
        type: "POST",
        url: "/sitecore/admin/supportpackage.aspx/GetProgressStatus",
        data: JSON.stringify({ "sessionGuid": $('input#SessionGuid').val() }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (msg) {
          var percentage = msg.d.Percentage;
          var code = msg.d.Code;
          var currentStatus = msg.d.CurrentState;

          $("#progressBar").width(percentage + "%");

          if (code === 0) {
            $("#updatingText").text(currentStatus);
            $("#additionalInfo").html(msg.d.AdditionalInformation.join(""));
            $('div#additionalInfo')[0].scrollTop = $('div#additionalInfo')[0].scrollHeight;
            setTimeout(updateProgress, 100);
          }

          if (code === 1) {
            if (flag === false) {
              $("#updatingText").text(currentStatus);
              $("#additionalInfo").html(msg.d.AdditionalInformation.join(""));
              flag = true;
            }
            setTimeout(updateProgress, 500);
          }

          if (code === 2) {
            $("#updatingText").text(currentStatus);
            $("#additionalInfo").html(msg.d.AdditionalInformation.join(""));
            $('#SavePackageButton').attr("disabled", false);
            $('#UploadToFTPButton').attr("disabled", false);
            $('#RestartButton').attr("disabled", false);
          }

          if (code === 3) {
            $("#updatingText").text(currentStatus);
            $("#updatingText").addClass("error");
            $("#additionalInfo").html(msg.d.AdditionalInformation.join(""));
            $('#RestartButton').attr("disabled", false);
          }

          $('div#additionalInfo')[0].scrollTop = $('div#additionalInfo')[0].scrollHeight;
        }
      });
    }

    function categoryChanged() {
      $.grep($(":checkbox"), function (c) {
        return (c.checked === true);
      }).length > 0 ? $('#NextButton').attr("disabled", false) : $('#NextButton').attr("disabled", true);
    }

    $(document).ready(function () {
      $("#updatingText").removeClass("error");

      if ($('#progress').css('display') === "block") {
        $('p.wf-more').css("display", "block");
        setTimeout(updateProgress, 100);
      } else {
        $('p.wf-more').css("display", "none");
        $("#additionalInfo").html("");
      }

      var sessionId = $('input#SessionGuid');
      if (sessionId.val() === "") sessionId.val(Math.floor(Math.random() * 10001));

      $("#startDate").datepicker({
        dateFormat: 'dd-M-y',
        numberOfMonths: 1,
        onSelect: function (selected) {
          $("#endDate").datepicker("option", "minDate", selected);
        }
      });

      $("#endDate").datepicker({
        dateFormat: 'dd-M-y',
        numberOfMonths: 1,
        onSelect: function (selected) {
          $("#startDate").datepicker("option", "maxDate", selected);
        }
      });

      if ($("#startDate").datepicker().datepicker('getDate') === null) {
        $("#startDate").datepicker().datepicker('setDate', -1);
        $('.ui-datepicker-current-day').click();
        $("#endDate").datepicker().datepicker('setDate', +1);
        $('.ui-datepicker-current-day').click();
      }
    });

  </script>

</head>
<body>
  <form id="form1" runat="server" class="wf-container">
    <input type="hidden" runat="server" id="SessionGuid" />
    <input type="hidden" runat="server" id="SelectedCollectors" />


    <%-- Main content --%>

    <div class="wf-content">

      <%-- Header --%>

      <h1 runat="server" id="Header"><a href="/sitecore/admin/">Administration Tools</a> - Sitecore Support Package Generator</h1>
      <br />
      <label id="headerDetails" runat="server">
        This application creates a package with important information about your Sitecore installation. Sending such package to Sitecore Support reduces the time it takes to diagnose and resolve Sitecore issues.<br />
        <br />
        Please enter the package information:</label>

      <%-- End of Header --%>

      <%-- Enter metadata --%>

      <div id="MetadataContainer" runat="server" style="margin-top: 15px;" visible="True">
        <table class="noBorders">
          <tr>
            <td>
              <label>Package name:</label></td>
            <td>
              <asp:TextBox runat="server" Width="373" ID="PackageNameTextbox" /></td>
          </tr>
          <tr>
            <td>
              <label>Support ticket ID (optional):</label></td>
            <td>
              <asp:TextBox runat="server" Width="373" ID="IdTextbox" /></td>
          </tr>
          <tr>
            <td>
              <label>Log start date:</label></td>
            <td>
              <span>
                <input type="text" id="startDate" runat="server" readonly="readonly" style="width: 146px;" />
                <label style="margin-left: 15px;">End date:</label>
                <input type="text" id="endDate" runat="server" readonly="readonly" style="width: 148px; float: right" />
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <label>Comments (optional):</label></td>
            <td>
              <asp:TextBox runat="server" Width="373" ID="CommnetsTextbox" /></td>
          </tr>
        </table>
      </div>

      <%-- End of Enter metadata --%>


      <%-- Select contents --%>

      <div id="CollectorsContainer" runat="server" style="margin-top: 10px;" visible="False">

        <a onclick="selectAll();" style="text-decoration: underline; cursor: pointer;">All</a>
        <a onclick="selectNone();" style="text-decoration: underline; cursor: pointer;">None</a>

        <%-- Basic information --%>

        <asp:Repeater ID="BasicCollectorsRepeater" runat="server">
          <HeaderTemplate>
            <table style="width: 100%; margin-top: 10px;">
              <tr>
                <th style="width: 100%; padding-left: 5px; text-align: left;">Basic information:</th>
              </tr>
          </HeaderTemplate>
          <ItemTemplate>
            <tr>
              <td class="CollectorCollumn">
                <label>
                  <input type="checkbox" onchange="categoryChanged();" runat="server" id="CollectorCheckbox" value="<%# ((CollectorDatasourceItem) Container.DataItem).CollectorId %>" checked="<%# ((CollectorDatasourceItem) Container.DataItem).IsChecked %>" />
                  <%# ((CollectorDatasourceItem) Container.DataItem).Description %><label />
              </td>
            </tr>
          </ItemTemplate>
          <FooterTemplate>
            </table>
          </FooterTemplate>
        </asp:Repeater>

        <%-- End of Basic information --%>

        <%-- Advanced information --%>

        <asp:Repeater ID="AdvancedCollectorsRepeater" runat="server">
          <HeaderTemplate>
            <table style="width: 100%; margin-top: 15px;">
              <tr>
                <th style="width: 100%; padding-left: 5px; text-align: left;">Advanced information:</th>
              </tr>
          </HeaderTemplate>
          <ItemTemplate>
            <tr>
              <td class="CollectorCollumn">
                <label>
                  <input type="checkbox" onchange="categoryChanged();" runat="server" id="CollectorCheckbox" value="<%# ((CollectorDatasourceItem) Container.DataItem).CollectorId %>" checked="<%# ((CollectorDatasourceItem) Container.DataItem).IsChecked %>" />
                  <%# ((CollectorDatasourceItem) Container.DataItem).Description %><label />
              </td>
            </tr>
          </ItemTemplate>
          <FooterTemplate>
            </table>
          </FooterTemplate>
        </asp:Repeater>

        <%-- End of Advanced information --%>
      </div>

      <%-- End of Select contents --%>

      <%-- Progress bar --%>

      <div runat="server" id="progress" class="wf-progress" style="padding: 2em 0; display: none;">
        <div class="wf-progress-bar" id="progressBarContainer">
          <p runat="server" id="updatingText">
          </p>
          <div class="wf-progress-background">
            <div style="width: 353px; position: relative;">
              <div runat="server" class="wf-progress-filler" id="progressBar">
              </div>
            </div>
          </div>
        </div>
      </div>

      <%-- End of Progress bar --%>

      <%-- "More information" section --%>

      <p class="wf-more" onclick="showMoreInfo();">
        <a>
          <img id="moreInformationImage" alt="More Information" src="/sitecore/shell/Themes/Standard/Images/Progress/more_expanded.png" />
        </a>
      </p>
      <div id="additionalInfo" runat="server" style="display: none; height: 300px; overflow-y: scroll; border: 1px solid #ccc; padding: 5px;"></div>

      <%-- End of "More information" section --%>
    </div>
    <%-- End of Main content --%>

    <%-- Buttons --%>

    <div class="wf-footer" style="margin-top: 15px; clear: both;">
      <asp:Button runat="server" ID="BackButton" OnClick="BackButtonClick" Text="Back" Visible="False" />
      <asp:Button runat="server" ID="RestartButton" OnClick="RestartButtonClick" Text="Start over" Visible="False" />
      <asp:Button runat="server" ID="NextButton" OnClientClick="getSelectedCollectors()" OnClick="NextButtonClick" Text="Next" />
      <asp:Button runat="server" ID="SavePackageButton" OnClick="DownloadPackageButtonClick" Text="Download package" Visible="False" />
      <input type="button" runat="server" id="UploadToFTPButton" onclick="uploadToFTP()" value="Upload to FTP" style="display: none;" />
    </div>

    <%-- End of Buttons --%>
  </form>
</body>
</html>

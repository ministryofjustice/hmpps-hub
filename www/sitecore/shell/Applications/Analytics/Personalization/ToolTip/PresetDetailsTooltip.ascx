<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="PresetDetailsTooltip.ascx.cs"
  Inherits="Sitecore.Shell.Applications.Analytics.Personalization.PresetDetailsTooltip" %>
<div style="margin: 15px; font: normal 8pt tahoma;">
  <div style="height: 20px; position: relative;">
    <asp:Image runat="server" Style="float: right; position: absolute; top: -7px; right: -7px;
      cursor: pointer;" ID="CloseIcon" />
    <asp:Label runat="server" ID="ProfileNameLabel" Style="font-weight: bold; font-color: Black" />
    <asp:Label runat="server" ID="HeaderSeparator" Text=" - " Style="font-color: #090909;" />
    <asp:Label runat="server" ID="ProfileDetailsHeader" Style="font-color: #090909;" /></div>
  <div style="width: 100%; height: 148px; overflow-y: auto; border-top: 1px solid #eaeaea;
    border-bottom: 1px solid #eaeaea;">
    <style type="text/css">
      .row .label
      {
        float: left;
        color: #909090;
        width: 80px;
        vertical-align: top;
      }
      
      .row .value
      {
        width: auto;
        margin-left: 85px;
        text-align: left;
        margin-right: 5px;
      }
      
      .row .value .img
      {
        float: right;
        margin: 0 0 5px 5px;
        width: 48px;
        height: 48px;
        top: -9px;
        right: -1px;
        position: relative;
      }
    </style>
    <div class="row" style="margin-top: 14px;">
      <div class="label">
        <asp:Label ID="leadName" runat="server" />
      </div>
      <div class="value">
        <asp:Image ID="Portrait" runat="server" class="img" Style="border: 1px solid #b9b9b9;" />
        <asp:Label ID="lblName" runat="server" Style="font-weight: bold;" Text="" />
      </div>
    </div>
    <div runat="server" id="TitleRow" class="row">
      <div class="label">
        <asp:Label ID="leadTitle" runat="server" />
      </div>
      <div class="value">
        <asp:Label ID="lblTitle" runat="server" Text="" />
      </div>
    </div>
    <div runat="server" id="DetailsRow" class="row">
      <div class="label">
        <asp:Label ID="leadDetails" runat="server" />
      </div>
      <div class="value">
        <asp:Label ID="lblDetails" runat="server" Text="" />
      </div>
    </div>
    <div runat="server" id="DescriptionRow" class="row">
      <div class="label">
        <asp:Label ID="leadDescription" runat="server" />
      </div>
      <div class="value">
        <asp:Label ID="lblDescription" runat="server" Text="" />
      </div>
    </div>
    <div runat="server" id="AgeRow" class="row">
      <div class="label">
        <asp:Label ID="leadAge" runat="server" />
      </div>
      <div class="value">
        <asp:Label ID="lblAge" runat="server" Text="" />
      </div>
    </div>
    <div runat="server" id="EducationRow" class="row">
      <div class="label">
        <asp:Label ID="leadEducation" runat="server" />
      </div>
      <div class="value">
        <asp:Label ID="lblEducation" runat="server" Text="" />
      </div>
    </div>
    <div runat="server" id="FamilyRow" class="row">
      <div class="label">
        <asp:Label ID="leadFamily" runat="server" />
      </div>
      <div class="value">
        <asp:Label ID="lblFamily" runat="server" Text="" />
      </div>
    </div>
    <div runat="server" id="InterestsRow" class="row">
      <div class="label">
        <asp:Label ID="leadInterests" runat="server" />
      </div>
      <div class="value">
        <asp:Label ID="lblInterests" runat="server" Text="" />
      </div>
    </div>
    <div runat="server" id="DayOfMyLifeRow" class="row">
      <div class="label">
        <asp:Label ID="leadDayOfMyLife" runat="server" />
      </div>
      <div class="value">
        <asp:Label ID="lblDayOfMyLife" runat="server" Text="" />
      </div>
    </div>
    <div runat="server" id="OrganizationRow" class="row">
      <div class="label">
        <asp:Label ID="leadOrganization" runat="server" />
      </div>
      <div class="value">
        <asp:Label ID="lblOrganization" runat="server" Text="" />
      </div>
    </div>
    <div runat="server" id="EnvironmentRow" class="row">
      <div class="label">
        <asp:Label ID="leadEnvironment" runat="server" />
      </div>
      <div class="value">
        <asp:Label ID="lblEnvironment" runat="server" Text="" />
      </div>
    </div>
    <div runat="server" id="GoalRow" class="row">
      <div class="label">
        <asp:Label ID="leadGoal" runat="server" />
      </div>
      <div class="value">
        <asp:Label ID="lblGoal" runat="server" Text="" />
      </div>
    </div>
    <div runat="server" id="ResponsibilityRow" class="row">
      <div class="label">
        <asp:Label ID="leadResponsibility" runat="server" />
      </div>
      <div class="value">
        <asp:Label ID="lblResponsibility" runat="server" Text="" />
      </div>
    </div>
    <div runat="server" id="PsychographicsRow" class="row">
      <div class="label">
        <asp:Label ID="leadPsychographics" runat="server" />
      </div>
      <div class="value">
        <asp:Label ID="lblPsychographics" runat="server" Text="" />
      </div>
    </div>
  </div>
</div>

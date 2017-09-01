<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="CreateNewUser.aspx.cs" Inherits="Sitecore.Shell.Applications.Security.CreateNewUser.CreateNewUser" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" TagPrefix="sc" %>
<!DOCTYPE html>
<html>
<head runat="server">
  <title>Sitecore</title>
  <sc:Stylesheet Src="Default.css" DeviceDependant="true" runat="server" />
  <sc:Stylesheet Src="Dialogs.css" DeviceDependant="true" runat="server" />
  <script type="text/javascript">
    window.name="modal";

    function onClose() {
      var openEditor = document.getElementById('OpenUserEditor');

      if (openEditor && openEditor.checked) {
        var dialogReturnValue = 'user:' + document.getElementById('CreateUserWizard_CompleteStepContainer_UserNameHiddenField').value;
        window.returnValue = dialogReturnValue;
        window.top.returnValue = dialogReturnValue;
      }

      window.top.dialogClose();
    }

    function onCancel() {
      window.top.dialogClose();
      window.event.cancelBubble = true;
      return false;
    }
    
    function onValidationSummaryChange() {
      var flexie = window.Flexie;
      if (flexie) flexie.updateInstance();
    }

    function fixWindowHight() {
      scForm.autoIncreaseModalDialogHeight(document.querySelector('.scCreateNewUserContent'));
      setTimeout(function () {
        document.querySelector('.scFormDialogFooter').style.position = 'relative';
        setTimeout(function () {
          document.querySelector('.scFormDialogFooter').style.position = 'fixed';
        }, 1);
      }, 1);
    }
    
    function DoValidation(validationGroup) {
        var isValid = Page_ClientValidate(validationGroup);
        if (!isValid) {
            fixWindowHight();
        }
    }

  </script>

  <style type="text/css">
    ul { padding: 0 0 0 15px; margin: 0; }
   
    .scCreateNewUserContent {
      position:absolute; 
      top: 60px; 
      bottom: 56px; 
      left: 0;
      right: 0;
      overflow: auto;
    }

    .scCreateNewUserValidator {
        color: #ca241c;
    }

    .scCreateNewUserValidatorContainer {
      width: 6px;
      white-space: nowrap;
      overflow: hidden;
    }

    .scWizardStepAndNavigationContainer {
      width: 100%;
      overflow: auto;
    }

    .scCreateNewUserFormRow, .scCreateNewUserFormRowWithSelect, .scCreateNewUserFormRowAutoHeight {
      position: relative;
      vertical-align: middle;
      padding-bottom: 10px;
    }

    .scCreateNewUserFormRowWithSelect {
      height: auto;
      min-height: 90px;
    }

    .scCreateNewUserFormRowAutoHeight {
      height: auto;
      min-height: 0;
      padding-bottom: 0;
    }

    .scCreateNewUserFormDescriptionColumn {
      width: auto;
      display: inline-block;
      text-align: left;
      vertical-align: middle;
      line-height: 36px;
    }
    
    .lang_ja_jp .scCreateNewUserFormDescriptionColumn {
      width: 130px;      
    }

    .lang_ja_jp .scCreateNewUserFormContentColumn {
      left: 124px;
    }

    .scCreateNewUserFormContentColumn {
      display: inline-block;
      left: 120px;
      right: 15px;
      position: absolute;
      padding: 2px;
      vertical-align: middle;
      height: 100%;
    }
    
    .scCreateNewUserFormValidationColumn {
      display: inline-block;
      width: 10px;
      padding: 2px;
      white-space: nowrap;
      overflow: hidden;
      position: absolute;
      right: 0;
      vertical-align: middle;
    }

    .scCreateNewUserFormValidationSummaryColumn {
      padding: 2px 2px 2px 107px;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
    }

    .scBorderBox {
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }

    .scFormDialogFooter {
      position: fixed;
      right: 0;
      left: 0;
      bottom: 0;
    }
  </style>
</head>
<body onload="fixWindowHight()" style="overflow:hidden">
  <form id="MainForm" runat="server" target="modal">
    <sc:AjaxScriptManager runat="server" />
    <sc:ContinuationManager runat="server" />
    <input type="hidden" id="RolesValue" runat="server" />
    <div class="scFormDialogHeader">
          <div class="DialogHeader">
            <sc:Literal Text="Create a New User" runat="server" />
          </div>
          <div class="DialogHeaderDescription">
            <sc:Literal Text="Enter information about the user." runat="server" />
          </div>
          <div class="scHorizontalLine"></div>
      </div>
      <div class="scCreateNewUserContent">
        <asp:Panel ID="ErrorPanel" runat="server" class="scMessageBar scWarning" Visible="False">
          <div class="scMessageBarIcon"></div>
          <div class="scMessageBarTextContainer">
              <sc:Literal Class="scMessageBarText" runat="server" Text="The default provider is configured to require question and answer. Set requiresQuestionAndAnswer='false' to use this wizard."/>
          </div>
        </asp:Panel>
        <asp:CreateUserWizard ID="CreateUserWizard" runat="server"
          RequireEmail="false" Height="100%"
          Width="100%" LoginCreatedUser="false"
          FinishDestinationPageUrl="javascript:onClose()"
          CreateUserButtonText="Create"
          CancelButtonText="Cancel"          
          OnCreatingUser="CreateUserWizard_CreatingUser"
          OnCreatedUser="CreateUserWizard_CreatedUser" OnCreateUserError="CreateUserWizard_CreateUserError">
            <WizardSteps>
              <asp:CreateUserWizardStep ID="CreateUserWizardStep" runat="server">
                <ContentTemplate>
                  <div class="scCreateNewUserFormRow">
                    <div class="scCreateNewUserFormDescriptionColumn scBorderBox">
                      <asp:Label ID="UserNameLabel" runat="server" AssociatedControlID="UserName"><sc:Literal ID="litUserName" Text="User name:" runat="server"/></asp:Label>
                    </div>
                    <div class="scCreateNewUserFormContentColumn scBorderBox">
                      <asp:TextBox ID="UserName" runat="server" Width="100%" CssClass="scIgnoreModified"></asp:TextBox>
                    </div>
                    <div class="scCreateNewUserFormValidationColumn scBorderBox">
                      <asp:RequiredFieldValidator ID="UserNameRequired" runat="server" ToolTip="User name is required." ErrorMessage="User name is required." ValidationGroup="CreateUserWizard1" ControlToValidate="UserName" CssClass="scCreateNewUserValidator" SetFocusOnError="True">*</asp:RequiredFieldValidator>
                      <asp:CustomValidator ID="DomainValidation" runat="server" ValidationGroup="CreateUserWizard1" ControlToValidate="UserName" ToolTip="User name is not valid in the selected domain." ErrorMessage="User name is not valid in the selected domain." OnServerValidate="OnValidateUserNameInDomain">*</asp:CustomValidator>
                    </div>
                  </div>
                  <div class="scCreateNewUserFormRow">
                    <div class="scCreateNewUserFormDescriptionColumn scBorderBox">
                      <asp:Label ID="DomainLabel" runat="server" AssociatedControlID="Domain"><sc:Literal ID="litDomain" Text="Domain:" runat="server" /></asp:Label>
                    </div>
                    <div class="scCreateNewUserFormContentColumn scBorderBox">
                      <asp:DropDownList ID="Domain" runat="server" Width="100%" CssClass="scIgnoreModified"></asp:DropDownList>
                    </div>
                    <div class="scCreateNewUserFormValidationColumn scBorderBox"></div>
                  </div>
                  <div class="scCreateNewUserFormRow">
                    <div class="scCreateNewUserFormDescriptionColumn scBorderBox">
                      <asp:Label ID="FullNameLabel" runat="server" AssociatedControlID="FullName"><sc:Literal ID="Literal1" Text="Full name:" runat="server"/></asp:Label></td>
                    </div>
                    <div class="scCreateNewUserFormContentColumn scBorderBox">
                      <asp:TextBox ID="FullName" runat="server" Width="100%" CssClass="scIgnoreModified"></asp:TextBox>
                    </div>
                    <div class="scCreateNewUserFormValidationColumn scBorderBox"></div>
                  </div>
                  <div class="scCreateNewUserFormRow">
                    <div class="scCreateNewUserFormDescriptionColumn scBorderBox">
                      <label for="Email"><sc:Literal ID="Literal2" Text="Email:" runat="server"/></label></td>
                    </div>
                    <div class="scCreateNewUserFormContentColumn scBorderBox">
                      <asp:TextBox ID="Email" Width="100%" runat="server" CssClass="scIgnoreModified"></asp:TextBox>
                    </div>
                    <div class="scCreateNewUserFormValidationColumn scBorderBox">
                      <asp:RequiredFieldValidator ControlToValidate="Email" ErrorMessage="Email is required." ID="EmailRequired" runat="server" ValidationGroup="CreateUserWizard1" CssClass="scCreateNewUserValidator" SetFocusOnError="True">*</asp:RequiredFieldValidator>
                      <asp:RegularExpressionValidator ControlToValidate="Email" ID="EmailValidity" runat="server" ValidationGroup="CreateUserWizard1" CssClass="scCreateNewUserValidator" SetFocusOnError="True">*</asp:RegularExpressionValidator>
                    </div>
                  </div>
                  <div class="scCreateNewUserFormRow">
                    <div class="scCreateNewUserFormDescriptionColumn scBorderBox">
                      <asp:Label ID="DescriptionLabel" runat="server" AssociatedControlID="Description"><sc:Literal ID="Literal3" Text="Comment:" runat="server"/></asp:Label></td>
                    </div>
                    <div class="scCreateNewUserFormContentColumn scBorderBox">
                      <asp:TextBox ID="Description" runat="server" Width="100%" CssClass="scIgnoreModified"></asp:TextBox>
                    </div>
                    <div class="scCreateNewUserFormValidationColumn scBorderBox"></div>
                  </div>
                  <div class="scCreateNewUserFormRow">
                    <div class="scCreateNewUserFormDescriptionColumn scBorderBox">
                      <asp:Label ID="PasswordLabel" runat="server" AssociatedControlID="Password"><sc:Literal ID="Literal4" Text="Password:" runat="server"/></asp:Label></td>
                    </div>
                    <div class="scCreateNewUserFormContentColumn scBorderBox">
                      <asp:TextBox ID="Password" runat="server" TextMode="Password" Width="100%" autocomplete="off" CssClass="scIgnoreModified"></asp:TextBox>
                    </div>
                    <div class="scCreateNewUserFormValidationColumn scBorderBox">
                      <asp:RequiredFieldValidator ID="PasswordRequired" runat="server" ValidationGroup="CreateUserWizard1" ControlToValidate="Password" CssClass="scCreateNewUserValidator" SetFocusOnError="True">*</asp:RequiredFieldValidator>
                    </div>
                  </div>
                  <div class="scCreateNewUserFormRow">
                    <div class="scCreateNewUserFormDescriptionColumn scBorderBox">
                      <asp:Label ID="ConfirmPasswordLabel" runat="server" AssociatedControlID="ConfirmPassword"><sc:Literal ID="Literal5" Text="Confirm password:" runat="server" /></asp:Label>
                    </div>
                    <div class="scCreateNewUserFormContentColumn scBorderBox">
                      <asp:TextBox ID="ConfirmPassword" runat="server" TextMode="Password" Width="100%" CssClass="scIgnoreModified"></asp:TextBox>
                    </div>
                    <div class="scCreateNewUserFormValidationColumn scBorderBox">
                      <asp:RequiredFieldValidator ID="ConfirmPasswordRequired" runat="server" ValidationGroup="CreateUserWizard1" ControlToValidate="ConfirmPassword" CssClass="scCreateNewUserValidator" SetFocusOnError="True">*</asp:RequiredFieldValidator>
                    </div>
                  </div>
                  <div class="scCreateNewUserFormRowWithSelect scFlexContent">
                    <div class="scCreateNewUserFormDescriptionColumn scBorderBox">
                      <asp:Label ID="RolesLabel" runat="server" AssociatedControlID="Roles"><sc:Literal ID="Literal6" Text="Roles:" runat="server" /></asp:Label>
                    </div>
                    <div class="scCreateNewUserFormContentColumn scBorderBox">
                      <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" >
                          <tr>
                            <td height="100%" width="100%" valign="top" style="padding-right: 10px;">
                              <select ID="Roles" runat="server" style="height:80px;width:100%" Size="4" class="scIgnoreModified"></select>
                            </td>
                            <td style="padding:0px 0px 0px 4px; vertical-align: top">
                              <asp:Button ID="AddRoles" CssClass="scButton" OnClientClick="javascript:return scForm.postRequest('','','','AddRoles_Click')" runat="server" />
                            </td>
                          </tr>
                        </table>
                    </div>
                    <div class="scCreateNewUserFormValidationColumn scBorderBox"></div>
                  </div>
                  <div class="scCreateNewUserFormRowWithSelect scFlexContent">
                    <div class="scCreateNewUserFormDescriptionColumn scBorderBox">
                      <asp:Label ID="ProfileLabel" runat="server" AssociatedControlID="Profile"><sc:Literal ID="Literal7" Text="User Profile:" runat="server" /></asp:Label>
                    </div>
                    <div class="scCreateNewUserFormContentColumn scBorderBox">
                      <asp:ListBox ID="Profile" runat="server" Width="100%" Height="80px" CssClass="scIgnoreModified"></asp:ListBox>
                    </div>
                    <div class="scCreateNewUserFormValidationColumn scBorderBox">
                      <asp:RequiredFieldValidator ID="ListboxRequired" runat="server" ValidationGroup="CreateUserWizard1" ControlToValidate="Profile" CssClass="scCreateNewUserValidator">*</asp:RequiredFieldValidator>
                    </div>
                  </div>
                  <div class="scCreateNewUserFormRowAutoHeight" style="height: 4px">
                    <div class="scCreateNewUserFormDescriptionColumn scBorderBox"></div>
                    <div class="scCreateNewUserFormContentColumn scBorderBox"></div>
                    <div class="scCreateNewUserFormValidationColumn scBorderBox">
                      <asp:CompareValidator ID="PasswordCompare" runat="server" ValidationGroup="CreateUserWizard1" ControlToValidate="ConfirmPassword" ControlToCompare="Password" Display="None"></asp:CompareValidator>
                    </div>
                  </div>
                  <div class="scCreateNewUserFormRowAutoHeight">
                    <div class="scCreateNewUserFormValidationSummaryColumn scBorderBox" style="color: #ca241c; text-align: left" onresize="onValidationSummaryChange();">
                      <asp:Literal ID="AdditionalErrors" runat="server" EnableViewState="False"></asp:Literal>
                      <asp:ValidationSummary ID="ValidationSummary1" ValidationGroup="CreateUserWizard1" runat="server" DisplayMode="BulletList" />
                    </div>
                  </div>
                </ContentTemplate>
                <CustomNavigationTemplate>
                  <div class="scFormDialogFooter">
                    <div class="footerOkCancel">
                      <asp:Button
                        runat="server"
                        ID="btnMoveNext"
                        CssClass="scButton scButtonPrimary"
                        CommandArgument="MoveNext"
                        CommandName="MoveNext"
                        ValidationGroup="CreateUserWizard1"
                        OnPreRender="MoveButton_PreRender" OnClientClick="DoValidation('CreateUserWizard1');"/>
                      <asp:Button
                        runat="server"
                        ID="btnCancel"
                        CssClass="scButton"
                        CommandName="Cancel"
                        OnClientClick="onCancel();"
                        OnPreRender="CancelButton_PreRender"/>
                    </div>
                  </div>
                </CustomNavigationTemplate>
              </asp:CreateUserWizardStep>

              <asp:CompleteWizardStep ID="CompleteWizardStep" runat="server">
                <ContentTemplate>
                  <script type="text/javascript">
                    scForm.setModified(false);
                  </script>
                    <div class="scDialogContentContainer">
                  <table height="100%" width="100%" border="0" style="padding-left: 8px; padding-right: 8px">
                    <tr height="100%" valign="top">
                      <td>
                        <b>
                          <sc:Literal Text="The user has been successfully created." runat="server" />
                          <asp:HiddenField runat="server" id="UserNameHiddenField" />
                        </b><br />

                        <sc:Space Height="16px" runat="server" />

                        <div>
                          <input type="checkbox" id="OpenUserEditor" />
                          <label for="OpenUserEditor"><sc:Literal Text="Open the User Editor" runat="server" /></label>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td>
                         <div class="scFormDialogFooter">
                           <div class="footerOkCancel">
                              <button id="Finish" class="scButton" onclick="javascript:onClose();" type="button"><sc:Literal Text="Close" runat="server" /></button>
                            </div>
                         </div>
                      </td>
                    </tr>
                  </table>
                        </div>
                </ContentTemplate>
              </asp:CompleteWizardStep>
            </WizardSteps>

            <SideBarStyle BackColor="#5D7B9D" BorderWidth="0px" VerticalAlign="Top" />
            <SideBarButtonStyle BorderWidth="0px" Font-Names="Verdana" ForeColor="White" />
            <NavigationButtonStyle Font-Size="8pt" />
            <HeaderStyle BackColor="#5D7B9D" BorderStyle="Solid" Font-Bold="True" ForeColor="White" HorizontalAlign="Left" />
            <CreateUserButtonStyle Font-Size="8pt" Width="75" Height="21" />
            <CancelButtonStyle Font-Size="8pt" Width="75" Height="21" />
            <ContinueButtonStyle Font-Size="8pt" />
            <StepStyle BorderWidth="0px" />
            <TitleTextStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
            <LabelStyle Font-Size="9pt" Font-Names="verdana" />
            <TextBoxStyle Font-Bold="true" Font-Size="9pt" Font-Names="verdana" />
          
          <LayoutTemplate>
            <div style="display: none">
              <asp:PlaceHolder ID="headerPlaceHolder" runat="server" />
            </div>
            <div style="display: none">
              <asp:PlaceHolder ID="sideBarPlaceHolder" runat="server" />
            </div>

            <div class="scDialogContentContainer scFlexColumnContainer">
              <asp:PlaceHolder ID="WizardStepPlaceHolder" runat="server" />
              <div>
                <asp:PlaceHolder ID="navigationPlaceHolder" runat="server" />
              </div>
            </div>
          </LayoutTemplate>

        </asp:CreateUserWizard>
      </div>
  </form>
</body>
</html>

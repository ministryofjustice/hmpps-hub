// -----------------------------------------------------------------------------------------------------
// <copyright file="SocialCenter.js" company="Sitecore A/S">
//   Copyright (C) 2014 by Sitecore
// </copyright>
// -----------------------------------------------------------------------------------------------------

var scsocSocialCenter = {};

scsocSocialCenter.getDivMessage = function (messageItemId) {
  return jQuery('div[data-message-item-id="' + messageItemId + '"].scsocMessage');
};

scsocSocialCenter.handleError = function (friendlyHttpStatusText, jsonRequestArgs) {
  alert(friendlyHttpStatusText);

  if (jQuery('body').hasClass('scsocLoading')) {
    jQuery('body').removeClass('scsocLoading');
    jQuery('.scsocModal').attr('title', '');
  }

  var requestArgs = JSON.parse(jsonRequestArgs);

  var divMessage = scsocSocialCenter.getDivMessage(requestArgs.args.messageItemId);
  if (divMessage.length == 0) return;

  if (scsocSocialCenter.isMessageControlsDisabled(divMessage)) {
    scsocSocialCenter.enableMessageControls(divMessage);
    scsocSocialCenter.hideProgressAnimation(divMessage, '.scsocRefreshingAnimation');
    scsocSocialCenter.hideProgressAnimation(divMessage, '.scsocMessageContentRefreshingAnimation');
  }
};

// -----------------------------------------------------------------------------------------------------
// Expand messages list
// -----------------------------------------------------------------------------------------------------
scsocSocialCenter.expandMessageListBeginAsync = function (currentContentItemUri, postingConfigurationName, nextPageNumber, pageSize, tooltip) {
  jQuery('body').addClass('scsocLoading');
  jQuery('.scsocModal').attr('title', tooltip);

  setTimeout(function () {
    var socialApi = new SocialAPI();
    socialApi.Message.expandMessageList(currentContentItemUri, postingConfigurationName, nextPageNumber, pageSize, scsocSocialCenter.expandMessageListEndAsync, scsocSocialCenter.handleError);  
  }, 500);
};

scsocSocialCenter.expandMessageListEndAsync = function (actionResult) {
  jQuery('body').removeClass('scsocLoading');
  jQuery('.scsocModal').attr('title', '');

  var showMoreLink = jQuery('.scsocShowMoreMessages');
  if (showMoreLink.length == 0) return;

  var showMoreContent = jQuery(actionResult.MessageListMarkup);

  showMoreLink.replaceWith(showMoreContent);
  
  setTimeout(function () {
    eval("jQuery(function() { jQuery(\".scsocMessageWorkflowState a\").click(function() { var menu = jQuery(this).parent().prev().children().first().show(); jQuery(document).one(\"click\", function () { menu.hide(); }); return false; });  });");
    jQuery('#' + actionResult.PageAnchorId).focus();
    //jQuery('html, body').animate({ scrollTop: jQuery('#' + actionResult.PageAnchorId).offset().top }, 1);
  }, 100);
};

// -----------------------------------------------------------------------------------------------------
// Edit, delete, Post message
// -----------------------------------------------------------------------------------------------------

scsocSocialCenter.editMessage = function (messageItemId, networkName, postingConfiguration) {
  var divMessage = scsocSocialCenter.getDivMessage(messageItemId);
  if ((divMessage.length == 0) || scsocSocialCenter.isMessageControlsDisabled(divMessage)) return false;

  return window.parent.scForm.postEvent(this, event, 'social:message:edit(messageItemId=' + messageItemId + ',networkName=' + networkName + ',postingConfiguration=' + postingConfiguration + ')');
};

scsocSocialCenter.deleteMessage = function (messageItemId, postingConfiguration, confirmMsg) {
  var divMessage = scsocSocialCenter.getDivMessage(messageItemId);
  if ((divMessage.length == 0) || scsocSocialCenter.isMessageControlsDisabled(divMessage)) return false;

  if (confirm(confirmMsg)) {
    return window.parent.scForm.postEvent(this, event, 'social:message:delete(messageItemId=' + messageItemId + ',postingConfiguration=' + postingConfiguration + ')');
  }
  else {
    return false;
  }
};

scsocSocialCenter.postMessage = function (messageItemId, postingConfigurationName, confirmMsg, tooltip) {
  var divMessage = scsocSocialCenter.getDivMessage(messageItemId);
  if ((divMessage.length == 0) || scsocSocialCenter.isMessageControlsDisabled(divMessage)) return false;

  jQuery('body').addClass('scsocLoading');
  jQuery('.scsocModal').attr('title', tooltip);
  if (confirm(confirmMsg)) {
    return window.parent.scForm.postEvent(this, event, 'social:message:post(messageItemId=' + messageItemId + ',postingConfiguration=' + postingConfigurationName + ')');
  }
  else {
    jQuery('body').removeClass('scsocLoading');
    jQuery('.scsocModal').attr('title', '');

    return false;
  }
};

scsocSocialCenter.executeMessageWorkflowCommand = function (messageItemId, messageWorkflowId, messageWorkflowCommandId, suppressComment, tooltip) {
  var divMessage = scsocSocialCenter.getDivMessage(messageItemId);
  if ((divMessage.length == 0) || scsocSocialCenter.isMessageControlsDisabled(divMessage)) return false;

  jQuery('body').addClass('scsocLoading');
  jQuery('.scsocModal').attr('title', tooltip);

  var comment = "";
  if (!suppressComment) {
    comment = prompt("Enter a comment:");
    if (comment == null) {
        jQuery('body').removeClass('scsocLoading');
        jQuery('.scsocModal').attr('title', '');

        return false;
    }
  }

  return window.parent.scForm.postEvent(this, event, 'social:message:executeWorkflowCommand(messageItemId=' + messageItemId + ',messageWorkflowId=' + messageWorkflowId + ',messageWorkflowCommandId=' + messageWorkflowCommandId + ',comment=' + comment + ')');
};

// -----------------------------------------------------------------------------------------------------
// Expand, refresh message
// -----------------------------------------------------------------------------------------------------
scsocSocialCenter.expandMessageBeginAsync = function (messageItemId, postingConfigurationName, tooltip) {
  var divMessage = scsocSocialCenter.getDivMessage(messageItemId);
  if ((divMessage.length == 0) || scsocSocialCenter.isMessageControlsDisabled(divMessage)) return;

  scsocSocialCenter.disableMessageControls(divMessage);
  scsocSocialCenter.showProgressAnimation(divMessage, tooltip, '.scsocMessageContentRefreshingAnimation');

  var socialApi = new SocialAPI();
  socialApi.Message.expandMessage(messageItemId, postingConfigurationName, scsocSocialCenter.expandMessageEndAsync, scsocSocialCenter.handleError);
};

scsocSocialCenter.expandMessageEndAsync = function (actionResult) {
  var divMessage = scsocSocialCenter.getDivMessage(actionResult.MessageItemId);
  if (divMessage.length == 0) return;

  scsocSocialCenter.enableMessageControls(divMessage);
  scsocSocialCenter.hideProgressAnimation(divMessage, '.scsocMessageContentRefreshingAnimation');

  var divMessageContent = divMessage.find('.scsocMessageContent');
  if (divMessageContent.length != 0) {
    divMessageContent.html(actionResult.MessageContentMarkup);
  }
};

scsocSocialCenter.refreshMessageBeginAsync = function (messageItemId, currentContentItemUri, postingConfigurationName, tooltip) {
  var divMessage = scsocSocialCenter.getDivMessage(messageItemId);
  if ((divMessage.length == 0) || scsocSocialCenter.isMessageControlsDisabled(divMessage)) return;

  if (!jQuery('body').hasClass('scsocLoading')) {
    jQuery('body').addClass('scsocLoading');
  }

  jQuery('.scsocModal').attr('title', tooltip);

  setTimeout(function() {
    var socialApi = new SocialAPI();
    socialApi.Message.refreshMessage(messageItemId, currentContentItemUri, postingConfigurationName, scsocSocialCenter.refreshMessageEndAsync, scsocSocialCenter.handleError);
  }, 500);
};

scsocSocialCenter.refreshMessageEndAsync = function (actionResult) {
  jQuery('body').removeClass('scsocLoading');
  jQuery('.scsocModal').attr('title', '');

  var divMessage = scsocSocialCenter.getDivMessage(actionResult.MessageItemId);
  if (divMessage.length == 0) return;


  divMessage.replaceWith(actionResult.MessageMarkup);

  setTimeout(function () {
    eval("jQuery(function() { jQuery(\"div[data-message-item-id='" + actionResult.MessageItemId + "'].scsocMessage .scsocMessageWorkflowState a\").click(function() { var menu = jQuery(this).parent().prev().children().first().show(); jQuery(document).one(\"click\", function () { menu.hide(); }); return false; });  });");
    scsocSocialCenter.getDivMessage(actionResult.MessageItemId).find('.scsocMessageAnchor').focus();
    //jQuery('html, body').animate({ scrollTop: scsocSocialCenter.getDivMessage(actionResult.MessageItemId).find('.scsocMessageAnchor').offset().top }, 1);
  }, 100);
};

// -----------------------------------------------------------------------------------------------------
// Refresh statistics
// -----------------------------------------------------------------------------------------------------

scsocSocialCenter.refreshStatisticsBeginAsync = function (tooltipText, messageItemId) {
  var divMessage = scsocSocialCenter.getDivMessage(messageItemId);
  if ((divMessage.length == 0) || scsocSocialCenter.isMessageControlsDisabled(divMessage)) return;

  scsocSocialCenter.disableMessageControls(divMessage);
  scsocSocialCenter.showProgressAnimation(divMessage, tooltipText, '.scsocRefreshingAnimation');

  var divMessageStatistics = divMessage.find('.scsocMessageStatistics');
  if (divMessageStatistics.length == 0) return;

  if (divMessageStatistics.hasClass('scsocMessageStatisticsUpdateFailed')) {
    divMessageStatistics.removeClass('scsocMessageStatisticsUpdateFailed').attr('title', '');
  }

  var socialApi = new SocialAPI();
  socialApi.Message.refreshStatistics(messageItemId, scsocSocialCenter.refreshStatisticsEndAsync, scsocSocialCenter.handleError);
};

scsocSocialCenter.refreshStatisticsEndAsync = function (actionResult) {
  var divMessage = scsocSocialCenter.getDivMessage(actionResult.MessageItemId);
  if (divMessage.length == 0) return;

  scsocSocialCenter.enableMessageControls(divMessage);
  scsocSocialCenter.hideProgressAnimation(divMessage, '.scsocRefreshingAnimation');

  var divMessageStatistics = divMessage.find('.scsocMessageStatistics');
  if (divMessageStatistics.length == 0) return;

  if (actionResult.IsFailed == '1') {
    divMessageStatistics.addClass('scsocMessageStatisticsUpdateFailed');
  }

  divMessageStatistics.attr('title', actionResult.StatisticsToolTip);

  var divStatisticsList = divMessageStatistics.find('.scsocStatiticsList');
  if (divStatisticsList.length == 0) return;

  divStatisticsList.html(actionResult.StatisticsMarkup);
};

// -----------------------------------------------------------------------------------------------------
// Campaign reports toggle.
// -----------------------------------------------------------------------------------------------------

scsocSocialCenter.toggleCampaignReports = function (messageItemId) {
  var divMessage = scsocSocialCenter.getDivMessage(messageItemId);
  if ((divMessage.length == 0) || scsocSocialCenter.isMessageControlsDisabled(divMessage)) return;

  divMessage.find('.scsocCampaignReports').toggle();
  divMessage.find('.scsocCampaignReportsSwitcher a').toggle();
};

scsocSocialCenter.getInlineCampaignIndicatorsBeginAsync = function (messageItemId, campaignId, tooltip) {
  var divMessage = scsocSocialCenter.getDivMessage(messageItemId);
  if ((divMessage.length == 0) || scsocSocialCenter.isMessageControlsDisabled(divMessage)) return;

  scsocSocialCenter.disableMessageControls(divMessage);
  scsocSocialCenter.showProgressAnimation(divMessage, tooltip, '.scsocRefreshingAnimation');

  var socialApi = new SocialAPI();
  socialApi.Message.getInlineCampaignIndicators(messageItemId, campaignId, scsocSocialCenter.getInlineCampaignIndicatorsEndAsync, scsocSocialCenter.handleError);
};

scsocSocialCenter.getInlineCampaignIndicatorsEndAsync = function (actionResult) {
  var divMessage = scsocSocialCenter.getDivMessage(actionResult.MessageItemId);
  if (divMessage.length == 0) return;

  scsocSocialCenter.enableMessageControls(divMessage);
  scsocSocialCenter.hideProgressAnimation(divMessage, '.scsocRefreshingAnimation');

  var divCampaignStatsContainer = divMessage.find('.scsocCampaignStatsContainer');
  if (divCampaignStatsContainer.length == 0) return;

  divCampaignStatsContainer.html(actionResult.IndicatorsMarkup);

  scsocSocialCenter.toggleCampaignReports(actionResult.MessageItemId);
};

// -----------------------------------------------------------------------------------------------------
// Accounts group toggle.
// -----------------------------------------------------------------------------------------------------
scsocSocialCenter.toggleAccountGroup = function (accountGroupLink, accountListUid) {
  jQuery(accountGroupLink).hasClass('scsocAccountsGroupExpanded')
    ? jQuery(accountGroupLink).removeClass('scsocAccountsGroupExpanded')
    : jQuery(accountGroupLink).addClass('scsocAccountsGroupExpanded');

  var ulAccountList = jQuery('ul[data-account-list-uid="' + accountListUid + '"].scsocAccountList');
  if (ulAccountList.length == 0) return;

  ulAccountList.toggle();
};

// -----------------------------------------------------------------------------------------------------
// Enable/disable message controls.
// -----------------------------------------------------------------------------------------------------

scsocSocialCenter.disableMessageControls = function (divMessage) {
  // message content expander
  var messageExpander = divMessage.find('.scsocMessageExpander');
  if (messageExpander.length != 0) {
    messageExpander.addClass('scsocDisabled');
  }

  // content buttons
  divMessage.find('.scsocContentButton').removeClass('scsocContentButton').addClass('scsocContentButtonDisabled').blur();

  // statistics
  divMessage.find('.scsocStatsCounter').addClass('scsocDisabled');
  divMessage.find('.scsocStatsCounterTitle').addClass('scsocDisabled');

  // campaign reports toggle
  divMessage.find('.scsocCampaignReportsSwitcher a').addClass('scsocDisabled');

  // buttons
  divMessage.find('input:enabled').addClass('scsocDisabled').attr('disabled', 'disabled');
};

scsocSocialCenter.enableMessageControls = function (divMessage) {
  // message content expander
  var messageExpander = divMessage.find('.scsocMessageExpander');
  if (messageExpander.length != 0) {
    messageExpander.removeClass('scsocDisabled');
  }

  // content buttons
  divMessage.find('.scsocContentButtonDisabled:not(.aspNetDisabled)').removeClass('scsocContentButtonDisabled').addClass('scsocContentButton');

  // statistics
  divMessage.find('.scsocStatsCounter').removeClass('scsocDisabled');
  divMessage.find('.scsocStatsCounterTitle').removeClass('scsocDisabled');

  // campaign reports toggle
  divMessage.find('.scsocCampaignReportsSwitcher a').removeClass('scsocDisabled');

  // buttons
  divMessage.find('input.scsocDisabled').removeClass('scsocDisabled').removeAttr("disabled");
};

scsocSocialCenter.isMessageControlsDisabled = function (divMessage) {
  return (divMessage.find('.scsocContentButtonDisabled:not(.aspNetDisabled)').length > 0) || (divMessage.find('.scsocDisabled').length > 0);
};

// -----------------------------------------------------------------------------------------------------
// Show/hide progress animation.
// -----------------------------------------------------------------------------------------------------

scsocSocialCenter.showProgressAnimation = function (divMessage, animationToolTip, animationClass) {
  var animation = divMessage.find(animationClass);
  if (animation.length != 0) {
    animation.show().attr('title', animationToolTip);
  }
};

scsocSocialCenter.hideProgressAnimation = function (divMessage, animationClass) {
  var animation = divMessage.find(animationClass);
  if (animation.length != 0) {
    animation.hide().attr('title', '');
  }
};
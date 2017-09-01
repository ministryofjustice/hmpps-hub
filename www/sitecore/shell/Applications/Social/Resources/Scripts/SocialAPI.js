var AjaxMixin = new function () {
  this.post = function (controller, action, args, callback, onerror) {
    if (!this._ajax) {
      this._ajax = new SocialAjax();
    }

    this._ajax.post(controller, action, args, callback, onerror);
  };
};
SocialAPI = Class.extend([AjaxMixin], {
  init: function () {
    this.Message.parent = this;
  },
  Message: {
    refreshStatistics: function (messageItemId, callback, onerror) {
      this.parent.post('MessageController', 'RefreshStatistics', { messageItemId: messageItemId }, callback, onerror);
    },
    getInlineCampaignIndicators: function (messageItemId, campaignId, callback, onerror) {
      this.parent.post('MessageController', 'GetInlineCampaignIndicators', { messageItemId: messageItemId, campaignId: campaignId }, callback, onerror);
    },
    expandMessage: function (messageItemId, postingConfigurationName, callback, onerror) {
      this.parent.post('MessageController', 'ExpandMessage', { messageItemId: messageItemId, postingConfigurationName: postingConfigurationName }, callback, onerror);
    },
    expandMessageList: function (currentContentItemUri, postingConfigurationName, nextPageNumber, pageSize, callback, onerror) {
      this.parent.post('MessageController', 'ExpandMessageList', { currentContentItemUri: currentContentItemUri, postingConfigurationName: postingConfigurationName, nextPageNumber: nextPageNumber, pageSize: pageSize }, callback, onerror);
    },
    refreshMessage: function (messageItemId, currentContentItemUri, postingConfigurationName, callback, onerror) {
      this.parent.post('MessageController', 'RefreshMessage', { messageItemId: messageItemId, currentContentItemUri: currentContentItemUri, postingConfigurationName: postingConfigurationName }, callback, onerror);
    }
  }
});
define(["/-/speak/v1/FXM/BaseEntityService.js"], function (service) {
  var instance = service("pagematcher/service");

  return {
    instance: instance,
    create: function (parentId) {
      return instance.create()
          .then(function (data) {
            data.ParentId = parentId;
            data.MatchRuleType = 0;
            if (!data.GoaldIds) data.GoalIds = [];
            if (!data.EventIds) data.EventIds = [];
            if (!data.CampaignIds) data.CampaignIds = [];
            if (!data.ProfileIds) data.ProfileIds = [];
            if (!data.OutcomeIds) data.OutcomeIds = [];

            return data;
          });
    }
  }
});
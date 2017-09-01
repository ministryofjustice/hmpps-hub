define(["sitecore"], function (Sitecore) {
  if (!Sitecore) {
    Sitecore = {};
  }

  Sitecore.ExperienceEditor = Sitecore.ExperienceEditor || {};

  var context = {
    isModified: false,

    instance: null,

    isFrameLoaded: false,

    isRibbonRendered: false,

    canDebug: null,

    openedFullContentIframe: null,
  };

  Sitecore.ExperienceEditor.Context = Sitecore.ExperienceEditor.Context || context;

  return Sitecore.ExperienceEditor.Context;
});
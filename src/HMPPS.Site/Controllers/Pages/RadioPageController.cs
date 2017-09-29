using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using HMPPS.Models.Cms;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;
using Sitecore.Data;
using Sitecore.Data.Items;

namespace HMPPS.Site.Controllers.Pages
{
    public class RadioPageController : BaseController
    {
        private RadioPageViewModel _rpvm;
        public ActionResult Index(string episodeId = "")
        {
            BuildViewModel(Sitecore.Context.Item, episodeId);

            return View("/Views/Pages/RadioPage.cshtml", _rpvm);
        }

        private void BuildViewModel(Item contextItem, string currentEpisodeShortId)
        {
            _rpvm = new RadioPageViewModel();

            _rpvm.BreadcrumbItems = BreadcrumbItems;

            var allRadioEpisodeItems =
                contextItem.Axes.GetDescendants().Where(d => d.TemplateName == "Radio Episode").ToList();//todo: cache this list/ retrieve from search index?

            var allRadioEpisodes = new List<RadioEpisode>();

            foreach (var i in allRadioEpisodeItems)
            {
                var episode = BuildRadioEpisode(i, contextItem);
                allRadioEpisodes.Add(episode);
            }

            allRadioEpisodes = allRadioEpisodes.OrderByDescending(e => e.Date).ToList();

            //get the "current" episode URL
            var currentEpisodeId = ID.Null;
            if (!string.IsNullOrEmpty(currentEpisodeShortId))
                currentEpisodeId = new ID(currentEpisodeShortId);
            var currentEpisode = new RadioEpisode();
            if (currentEpisodeId != ID.Null)
            {
                var currentEpisodeItem = Sitecore.Context.Database.GetItem(currentEpisodeId);
                currentEpisode = BuildRadioEpisode(currentEpisodeItem, contextItem);
            }
            else
            {
                currentEpisode = allRadioEpisodes.FirstOrDefault();
            }
            _rpvm.CurrentEpisodeUrl = currentEpisode?.FileUrl;

            //get the most recent previous 5 episodes
            _rpvm.PreviousEpisodes = allRadioEpisodes.Take(5).ToList();
        }

        private RadioEpisode BuildRadioEpisode(Item episodeItem, Item contextItem)
        {
            return new RadioEpisode()
            {
                Title = episodeItem["Radio Episode Title"],
                Date = Utilities.SitecoreHelper.FieldMethods.GetDateFieldValue(episodeItem, "Date", DateTime.MinValue),
                FileUrl = Utilities.SitecoreHelper.FieldMethods.GetFileUrl(episodeItem, "Radio Episode MP3 File"),
                RadioPageUrl = Sitecore.Links.LinkManager.GetItemUrl(contextItem) + "?episodeId=" + episodeItem.ID.ToShortID()
            };
        }


    }
}

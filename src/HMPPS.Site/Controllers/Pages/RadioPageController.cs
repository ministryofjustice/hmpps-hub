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
            ID validEpisodeId;
            try
            {
                validEpisodeId = new ID(episodeId);
            }
            catch
            {
                validEpisodeId = ID.Null;
            }

            BuildViewModel(Sitecore.Context.Item, validEpisodeId);
            return View("/Views/Pages/RadioPage.cshtml", _rpvm);
        }

        private void BuildViewModel(Item contextItem, ID currentEpisodeId)
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

            allRadioEpisodes = allRadioEpisodes.OrderBy(e => e.Date).ToList();

            //get the "current" episode URL
            RadioEpisode currentEpisode;
            if (currentEpisodeId != ID.Null)
            {
                var currentEpisodeItem = Sitecore.Context.Database.GetItem(currentEpisodeId);
                currentEpisode = BuildRadioEpisode(currentEpisodeItem, contextItem);
            }
            else
            {
                currentEpisode = allRadioEpisodes.LastOrDefault();
            }
            _rpvm.CurrentEpisode = currentEpisode;

            //get 3 most recent previous episodes and 3 next episodes excluding the current episode
            const int episodesToShow = 7; //includes current episode removed later
            var currentEpisodeIndex = allRadioEpisodes.FindIndex(e => currentEpisode != null && e.Id == currentEpisode.Id);
            var startIndex = currentEpisodeIndex - 3 < 0 ? 0 : currentEpisodeIndex - 3;
            var lastIndex = (startIndex + episodesToShow > allRadioEpisodes.Count) ? allRadioEpisodes.Count : startIndex + episodesToShow;
            if (lastIndex - startIndex < episodesToShow)
                startIndex = lastIndex - episodesToShow < 0 ? 0 : lastIndex - episodesToShow;
            _rpvm.NeighbourEpisodes = allRadioEpisodes.Skip(startIndex).Take(lastIndex).ToList();
            currentEpisodeIndex = _rpvm.NeighbourEpisodes.FindIndex(e => currentEpisode != null && e.Id == currentEpisode.Id);
            if (currentEpisodeIndex >= 0)
                _rpvm.NeighbourEpisodes.RemoveAt(currentEpisodeIndex);
        }

        private RadioEpisode BuildRadioEpisode(Item episodeItem, Item contextItem)
        {
            return new RadioEpisode()
            {
                Id = episodeItem.ID.Guid,
                Title = episodeItem["Radio Episode Title"],
                Date = Utilities.SitecoreHelper.FieldMethods.GetDateFieldValue(episodeItem, "Radio Episode Date", DateTime.MinValue),
                FileUrl = Utilities.SitecoreHelper.FieldMethods.GetFileUrl(episodeItem, "Radio Episode MP3 File"),
                RadioPageUrl = Sitecore.Links.LinkManager.GetItemUrl(contextItem) + "?episodeId=" + episodeItem.ID.ToShortID()
            };
        }

    }
}

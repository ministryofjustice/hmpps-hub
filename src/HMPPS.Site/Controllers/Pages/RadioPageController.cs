using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using HMPPS.Models.Cms;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;
using Sitecore.Data.Items;
using HMPPS.Utilities.Interfaces;
using HMPPS.Utilities.Helpers;
using Sitecore.Globalization;

namespace HMPPS.Site.Controllers.Pages
{
    public class RadioPageController : BaseController
    {

        private readonly ICacheService _cacheService;

        public RadioPageController(ICacheService cacheService)
        {
            _cacheService = cacheService;
        }

        private RadioPageViewModel _rpvm;

        public ActionResult Index()
        {
            BuildViewModel(Sitecore.Context.Item);
            return View("/Views/Pages/RadioPage.cshtml", _rpvm);
        }

        private void BuildViewModel(Item contextItem)
        {
            _rpvm = new RadioPageViewModel();

            _rpvm.BreadcrumbItems = BreadcrumbItems;

            var radioSeriesRoot = GetSeriesRoot(contextItem);

            var allRadioEpisodes = PopulateEpisodeList(radioSeriesRoot);

            var currentEpisode = GetCurrentEpisode(contextItem, allRadioEpisodes);
            var currentEpisodeItem = GetCurrentEpisodeItem(contextItem, currentEpisode);

            _rpvm.CurrentEpisode = currentEpisode;

            _rpvm.NeighbourEpisodes = GetNeighbourEpisodes(currentEpisode, allRadioEpisodes);

            _rpvm.RadioShowPreviousEpisodesUrl = currentEpisodeItem == null
                ? null
                : Sitecore.Links.LinkManager.GetItemUrl(currentEpisodeItem.Parent);
            _rpvm.RadioShowPosterImage = Utilities.SitecoreHelper.FieldMethods.GetMediaItemUrl(radioSeriesRoot, "Poster Image", 630);
            _rpvm.IsLatestEpisode = currentEpisodeItem != null &&
                                    allRadioEpisodes.LastOrDefault()?.Id == currentEpisode.Id;
            _rpvm.LatestEpisodePrefixText = Translate.Text("Latest Episode Prefix");
            _rpvm.RadioShowName = radioSeriesRoot["Page Title"];
        }

        private List<RadioEpisode> PopulateEpisodeList(Item seriesRoot)
        {
            var cacheKey = seriesRoot.ID.ToString();
            if (_cacheService.Contains(cacheKey))
            {
                return _cacheService.Get<List<RadioEpisode>>(cacheKey);
            }

            var allRadioEpisodeItems =
                seriesRoot.Axes.GetDescendants().Where(d => d.TemplateName == "Radio Episode").ToList();

            var allRadioEpisodes = new List<RadioEpisode>();

            foreach (var i in allRadioEpisodeItems)
            {
                var episode = BuildRadioEpisode(i);
                allRadioEpisodes.Add(episode);
            }
            allRadioEpisodes = allRadioEpisodes.OrderBy(e => e.Date).ToList();

            var expirationTime = ExpirationHelper.GetExpirationTime(HMPPS.Utilities.Settings.RadioEpisodesCacheTime);
            _cacheService.Store(cacheKey, allRadioEpisodes, expirationTime);

            return allRadioEpisodes;
        }

        private Item GetSeriesRoot(Item contextItem)
        {
            if (contextItem.TemplateName == "Radio Page")
                return contextItem;
            var seriesRoot = contextItem.Axes.GetAncestors().FirstOrDefault(a => a.TemplateName == "Radio Page");
            return seriesRoot;
        }

        private RadioEpisode GetCurrentEpisode(Item contextItem, List<RadioEpisode> allRadioEpisodes)
        {
            if (contextItem.TemplateName == "Radio Episode")
                return BuildRadioEpisode(contextItem);

            return allRadioEpisodes.LastOrDefault();
        }

        private Item GetCurrentEpisodeItem(Item currentItem, RadioEpisode currentEpisode)
        {
            if (currentItem.TemplateName == "Radio Episode")
                return currentItem;

            return currentEpisode == null ? null : Sitecore.Context.Database.GetItem(new Sitecore.Data.ID(currentEpisode.Id));
        }

        private RadioEpisode BuildRadioEpisode(Item episodeItem)
        {
            return new RadioEpisode()
            {
                Id = episodeItem.ID.Guid,
                Title = episodeItem["Radio Episode Title"],
                Date = Utilities.SitecoreHelper.FieldMethods.GetDateFieldValue(episodeItem, "Radio Episode Date", DateTime.MinValue),
                FileUrl = Utilities.SitecoreHelper.FieldMethods.GetFileUrl(episodeItem, "Radio Episode MP3 File"),
                RadioEpisodeUrl = Sitecore.Links.LinkManager.GetItemUrl(episodeItem)
            };
        }


        private List<RadioEpisode> GetNeighbourEpisodes(RadioEpisode currentEpisode, List<RadioEpisode> allRadioEpisodes)
        {
            if (currentEpisode == null || allRadioEpisodes == null || !allRadioEpisodes.Any())
            {
                return null;
            }
            //get 3 most recent previous episodes and 3 next episodes excluding the current episode
            const int episodesToShow = 7; //includes current episode removed later
            var currentEpisodeIndex = allRadioEpisodes.FindIndex(e => currentEpisode != null && e.Id == currentEpisode.Id);
            var startIndex = Math.Max(currentEpisodeIndex - 3, 0);
            var lastIndex = Math.Min(currentEpisodeIndex + 3, allRadioEpisodes.Count - 1);
            startIndex = Math.Min(startIndex, lastIndex - episodesToShow + 1);

            var neighbourEpisodes = allRadioEpisodes.Skip(startIndex).Take(lastIndex-startIndex + 1).ToList();
            currentEpisodeIndex = neighbourEpisodes.FindIndex(e => currentEpisode != null && e.Id == currentEpisode.Id);
            if (currentEpisodeIndex >= 0)
                neighbourEpisodes.RemoveAt(currentEpisodeIndex);

            neighbourEpisodes.Reverse();

            return neighbourEpisodes;
        }
    }
}

using System.Collections.Generic;
using System.Web.Mvc;
using Sitecore.Data.Items;
using HMPPS.Models.Cms;
using HMPPS.Site.Controllers.Base;
using HMPPS.Site.ViewModels.Pages;
using System.Linq;

namespace HMPPS.Site.Controllers.Pages
{
    public class RadioFolderPageController : BaseController
    {
        private RadioFolderPageViewModel _rfpvm;
        private List<RadioFolder> _rmloy;
        private List<RadioEpisode> _relom;

        private void BuildViewModel(Item contextItem)
        {
            _rfpvm = new RadioFolderPageViewModel();

            _rfpvm.BreadcrumbItems = BreadcrumbItems;
        }

        private void BuildMonthListOfYear(Item contextItem)
        {
            if (contextItem.TemplateName != "Radio Folder Year")
            {
                return;
            }

            _rmloy = new List<RadioFolder>();
            foreach (var c in contextItem.Children.ToList())
            {
                var radioFolder = new RadioFolder();
                radioFolder.FolderName = c.Fields["Folder Name"].GetValue(true);
                radioFolder.FolderUrl = Sitecore.Links.LinkManager.GetItemUrl(c);
                radioFolder.IsCurrent = c.ID.Guid.Equals(Sitecore.Context.Item.ID.Guid);
                _rmloy.Add(radioFolder);
            }
        }

        private void BuildEpisodeListOfMonth(Item contextItem)
        {
            if (contextItem.TemplateName != "Radio Folder Month")
            {
                return;
            }

            _relom = new List<RadioEpisode>();
            foreach (var c in contextItem.Children.ToList())
            {
                var radioEpisode = new RadioEpisode();
                radioEpisode.Title = c.Fields["Radio Episode Title"].GetValue(true);
                radioEpisode.RadioEpisodeUrl = Sitecore.Links.LinkManager.GetItemUrl(c);
                var radioEpisodeDateField = c.Fields["Radio Episode Date"];
                if (radioEpisodeDateField != null && ((Sitecore.Data.Fields.DateField)radioEpisodeDateField) != null)
                {
                    radioEpisode.Date = ((Sitecore.Data.Fields.DateField)radioEpisodeDateField).DateTime;
                }
                _relom.Add(radioEpisode);
            }
            _relom.OrderByDescending(c => c.Date);
        }

        public ActionResult Index()
        {
            BuildViewModel(Sitecore.Context.Item);
            return View("/Views/Pages/RadioFolderPage.cshtml", _rfpvm);
        }

        public ActionResult EpisodeListOfMonth()
        {
            BuildEpisodeListOfMonth(Sitecore.Context.Item);
            return View("/Views/Modules/RadioFolder/EpisodeListOfMonth.cshtml", _relom);
        }

        public ActionResult MonthListOfYear()
        {
            if (Sitecore.Context.Item.TemplateName == "Radio Folder Year")
            {
                BuildMonthListOfYear(Sitecore.Context.Item);
            }
            else if (Sitecore.Context.Item.TemplateName == "Radio Folder Month")
            {
                BuildMonthListOfYear(Sitecore.Context.Item.Parent);
            }
            return View("/Views/Modules/RadioFolder/MonthListOfYear.cshtml", _rmloy);
        }

    }
}

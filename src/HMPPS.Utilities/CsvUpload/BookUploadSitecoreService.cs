using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CsvHelper;
using HMPPS.Models.Csv;
using Sitecore;
using Sitecore.Data;
using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using Sitecore.Publishing;
using Sitecore.SecurityModel;

namespace HMPPS.Utilities.CsvUpload
{
    public class BookUploadSitecoreService
    {
        private readonly string _bookContentRootPath = "/sitecore/content/Home/Passing The Time/Books/ImportedDec2017";
        private readonly string _bookImageRootPath = "/sitecore/media library/Images/HMPPS/Pages/Books/Thumbnails/ImportedDec2017";
        private readonly string _bookFileRootPath = "/sitecore/media library/Files/HMPPS/Books/ImportedDec2017";
        private readonly Database _database;
        private readonly Item _bookContentRootItem;
        private readonly Item _bookImageRootItem;
        private readonly Item _bookFileRootItem;
        private readonly TemplateItem _bookPageTemplate;
        private readonly TemplateItem _bookSectionPageTemplate;
        private readonly Dictionary<int, string> _missingStuff = new Dictionary<int, string>();

        public BookUploadSitecoreService(Database database, TemplateItem bookPageTemplate,
            TemplateItem bookSectionPageTemplate)
        {
            this._database = database;
            this._bookPageTemplate = bookPageTemplate;
            this._bookSectionPageTemplate = bookSectionPageTemplate;
            _bookContentRootItem = _database.GetItem(_bookContentRootPath);
            _bookImageRootItem = _database.GetItem(_bookImageRootPath);
            _bookFileRootItem = _database.GetItem(_bookFileRootPath);
        }

        #region page functions

        public virtual Dictionary<int, string> GetAvailableYears()
        {
            ConcurrentDictionary<int, string> years = new ConcurrentDictionary<int, string>();
            Parallel.ForEach(_bookContentRootItem.Children, (yearFolder) =>
            {
                if (yearFolder.TemplateID == _folderTemplate.ID)
                {
                    years.TryAdd(int.Parse(yearFolder.Name), yearFolder.Name);
                }
            });
            return years.OrderByDescending(i => i.Key).ToDictionary(pair => pair.Key, pair => pair.Value);
        }

        public virtual Dictionary<int, string> GetAvailableMonths(int year)
        {
            var yearFolder = _bookContentRootItem.Children[year.ToString()];
            if (yearFolder == null)
            {
                return null;
            }
            ConcurrentDictionary<int, string> months = new ConcurrentDictionary<int, string>();

            Parallel.ForEach(yearFolder.GetChildren(), (month) =>
            {
                if (month.TemplateID == _bookPageTemplate.ID)
                {
                    months.TryAdd(DateTime.ParseExact(month.Name, "MMMM", CultureInfo.InvariantCulture).Month,
                        month.Name);
                }
            });
            return months.OrderBy(i => i.Key).ToDictionary(pair => pair.Key, pair => pair.Value);
        }

        public virtual IEnumerable<Item> GetArticles(int year, int month = 0)
        {
            var yearFolder = _bookContentRootItem.Children[year.ToString()];
            if (yearFolder == null)
            {
                return null;
            }

            if (month == 0)
            {
                return yearFolder.GetChildren().OrderByDescending(o => o.Fields["Date Published"].Value);
            }

            return new[]
            {
                yearFolder.Children[month.ToString()]
            };
        }

        #endregion page functions

        #region Import

        public void CreateSitecoreItems(List<BookCsvRow> archiveIssues)
        {
            Item archiveRoot = _database.GetItem(_bookRootId);
            if (archiveRoot == null)
            {
                //TODO: log that the rot can not be found    
            }
            using (new SecurityDisabler())
            {
                foreach (BookCsvRow issue in archiveIssues)
                {
                    try
                    {
                        string year = issue.IssueDate.Year.ToString();
                        Item yearFolder = GetOrCreateChild(archiveRoot, year, _folderTemplate, 0);
                        Item issueItem = GetOrCreateChild(yearFolder, issue.IssueDate.ToString("MMMM"),
                            _bookPageTemplate,
                            0);
                        SetImportIssueData(issueItem, issue);
                        PublishItem(issueItem);
                    }
                    catch (Exception ex)
                    {
                        RecordMissingImportData(issue.IssueNumber, $" {issue.IssueDate:yyyy-MM-dd} - {ex.Message}");
                        RecordMissingImportData(issue.IssueNumber, $" {issue.IssueDate:yyyy-MM-dd} - {ex.StackTrace}");
                    }
                }
                if (_missingStuff.Count > 0)
                {
                    StringBuilder sb = new StringBuilder();
                    foreach (var issue in _missingStuff.OrderBy(i => i.Key))
                    {
                        sb.AppendLine($"issue: {issue.Key} , {issue.Value}");
                    }
                    File.WriteAllText($"c:\\temp\\missingNavyNews_{DateTime.Now:yyyy-MM-dd}_{DateTime.Now:hh-mm}.txt",
                        sb.ToString());
                }
            }
        }

        public Item GetSitecoreImageItem(BookCsvRow issue)
        {
            string imageDecadeFolderName = $"{issue.IssueDate.Year.ToString("D").Substring(0, 3)}0s";
            Item imageDecadeFolder = GetChildByName(_bookFileRootItem, imageDecadeFolderName);
            Item imageFolder = GetChildByName(imageDecadeFolder, issue.IssueDate.Year.ToString());
            Item imageItem = GetChildByName(imageFolder,
                $"Navy News {issue.IssueDate:MMMM} {issue.IssueDate.Year} Issue {issue.IssueNumber} thumbnail");
            return imageItem;
        }

        public Item GetSitecorePdfItem(BookCsvRow issue)
        {
            string pdfDecadeFolderName = $"{issue.IssueDate.Year.ToString("D").Substring(0, 3)}0s";
            Item pdfDecadeFolder = GetChildByName(_bookImageRootItem, pdfDecadeFolderName);
            Item pdfFolder = GetChildByName(pdfDecadeFolder, issue.IssueDate.Year.ToString());
            Item pdfItem = GetChildByName(pdfFolder,
                $"Navy News {issue.IssueDate:MMMM} {issue.IssueDate.Year} Issue {issue.IssueNumber}");
            return pdfItem;
        }

        private void SetImportIssueData(Item issueItem, BookCsvRow issue)
        {
            using (new EditContext(issueItem))
            {
                Item pdfItem = GetSitecorePdfItem(issue);
                Item imageItem = GetSitecoreImageItem(issue);
                if (imageItem == null)
                {
                    RecordMissingImportData(issue.IssueNumber,
                        $"{issue.IssueDate:yyyy-MM-dd} - image missing or bad naming");
                }
                else
                {
                    ((ImageField) issueItem.Fields["Thumbnail Image"]).MediaID = imageItem.ID;
                }
                if (pdfItem == null)
                {
                    RecordMissingImportData(issue.IssueNumber,
                        $"{issue.IssueDate:yyyy-MM-dd} - pdf missing or bad naming");
                }
                else
                {
                    ((FileField) issueItem.Fields["PDF Document"]).MediaID = pdfItem.ID;
                    ((FileField) issueItem.Fields["PDF Document"]).Src = pdfItem.Paths.MediaPath;
                }

                ((DateField) issueItem.Fields["Date Published"]).Value = DateUtil.ToIsoDate(issue.IssueDate);
                issueItem.Fields["Issue Number"].Value = issue.IssueNumber.ToString();
                issueItem.Fields["Title"].Value = issue.Title;
                issueItem.Fields["Summary"].Value = issue.Summary;
            }
        }

        private void RecordMissingImportData(int issueNumber, string whatsMissing)
        {
            if (_missingStuff.ContainsKey(issueNumber))
            {
                _missingStuff[issueNumber] += $"\r\n             - {whatsMissing}";
            }
            else
            {
                _missingStuff.Add(issueNumber, $"- {whatsMissing}");
            }
        }

        private Item GetChildByName(Item item, string itemName)
        {
            Item child = item?.Children[itemName];
            return child;
        }

        private Item GetOrCreateChild(Item parent, string childName, TemplateItem template, int sortOrder)
        {
            Item child = parent.Children[childName];

            if (child == null)
            {
                child = parent.Add(childName, template);

                using (new EditContext(child))
                {
                    child[FieldIDs.Sortorder] = sortOrder.ToString();
                }

                PublishItem(child);
            }

            return child;
        }

        private void PublishItem(Item item, bool deep = false, bool publishParentItems = false)
        {
            if (Sitecore.Configuration.Factory.GetDatabase("web") != null)
            {
                PublishItem(item, Sitecore.Configuration.Factory.GetDatabase("web"), deep, publishParentItems);
            }
        }

        private void PublishItem(Item item, Database database, bool deep = false, bool publishParentItems = false)
        {
            if (publishParentItems && item.Parent != null)
            {
                Item parent = item.Parent;
                Item publishedItem = database.GetItem(item.ID);
                if (publishedItem == null)
                {
                    PublishItem(parent, database, false, true);
                }
            }

            foreach (var language in item.Languages)
            {
                PublishOptions publishOptions = new PublishOptions
                (
                    item.Database,
                    database,
                    PublishMode.SingleItem,
                    language,
                    DateTime.Now
                );

                publishOptions.Deep = deep;

                Publisher publisher = new Publisher(publishOptions);
                publisher.Options.RootItem = item;
                publisher.Publish();
            }
        }

        #endregion Import
    }
}

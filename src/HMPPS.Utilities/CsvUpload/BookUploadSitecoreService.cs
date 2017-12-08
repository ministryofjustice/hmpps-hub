using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
            _database = database;
            _bookPageTemplate = bookPageTemplate;
            _bookSectionPageTemplate = bookSectionPageTemplate;
            _bookContentRootItem = _database.GetItem(_bookContentRootPath);
            _bookImageRootItem = _database.GetItem(_bookImageRootPath);
            _bookFileRootItem = _database.GetItem(_bookFileRootPath);
        }


        public void CreateSitecoreItems(List<BookCsvRow> bookRows)
        {
            var bookRoot = _database.GetItem(_bookContentRootPath);
            if (bookRoot == null)
            {
                return;
            }
            using (new SecurityDisabler())
            {
                foreach (var bookRow in bookRows)
                {
                    try
                    {

                        PublishItem(issueItem);
                    }
                    catch (Exception ex)
                    {
                        //RecordMissingImportData(bookRow.IssueNumber, $" {bookRow.IssueDate:yyyy-MM-dd} - {ex.Message}");\a);
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
            var dot = '.';
            var startIndex = 0;
            var endIndex = issue.ImageFilename.LastIndexOf(dot);
            var length = endIndex - startIndex + 1;
            return _bookImageRootItem.Axes.GetDescendant(issue.ImageFilename.Substring(startIndex, length));
        }

        public Item GetSitecoreFileItem(BookCsvRow issue)
        {
            var dot = '.';
            var startIndex = 0;
            var endIndex = issue.BookFilename.LastIndexOf(dot);
            var length = endIndex - startIndex + 1;
            return _bookFileRootItem.Axes.GetDescendant(issue.BookFilename.Substring(startIndex, length));
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
    }
}

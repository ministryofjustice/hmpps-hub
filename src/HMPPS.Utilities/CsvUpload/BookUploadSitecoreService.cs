using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using HMPPS.Models.Csv;
using Sitecore.Data;
using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using Sitecore.Publishing;
using Sitecore.SecurityModel;

namespace HMPPS.Utilities.CsvUpload
{
    public class BookUploadSitecoreService
    {
        private readonly string _bookContentImportRootPath = "/sitecore/content/Home/Passing The Time/Books/ImportedDec2017";
        private readonly string _bookImageImportRootPath = "/sitecore/media library/Images/HMPPS/Pages/Books/Thumbnails/ImportedDec2017";
        private readonly string _bookImageRootPath = "/sitecore/media library/Images/HMPPS/Pages/Books/Thumbnails";
        private readonly string _bookFileImportRootPath = "/sitecore/media library/Files/HMPPS/Books/ImportedDec2017";
        private readonly Database _database;
        private readonly Item _bookContentImportRootItem;
        private readonly Item _bookImageImportRootItem;
        private readonly Item _bookImageRootItem;
        private readonly Item _bookFileImportRootItem;
        private readonly TemplateItem _bookPageTemplate;
        private readonly TemplateItem _bookSectionPageTemplate;
        private readonly Dictionary<string, string> _missingStuff = new Dictionary<string, string>();
        private const string SafeItemNameRegex = "[^A-Za-z0-9 _]";
        private const string CategoryGenericImageName = "entertainment";

        public BookUploadSitecoreService(Database database, TemplateItem bookPageTemplate,
            TemplateItem bookSectionPageTemplate)
        {
            _database = database;
            _bookPageTemplate = bookPageTemplate;
            _bookSectionPageTemplate = bookSectionPageTemplate;
            _bookContentImportRootItem = _database.GetItem(_bookContentImportRootPath);
            _bookImageImportRootItem = _database.GetItem(_bookImageImportRootPath);
            _bookImageRootItem = _database.GetItem(_bookImageRootPath);
            _bookFileImportRootItem = _database.GetItem(_bookFileImportRootPath);
        }

        private string GetSafeItemName(string name)
        { 
            return Regex.Replace(name, SafeItemNameRegex, " ");
        }
        private string RemoveHtml(string value)
        {
            var step1 = Regex.Replace(value, @"<[^>]+>|&nbsp;", "").Trim();
            var step2 = Regex.Replace(step1, @"\s{2,}", " ");
            return step2;
        }
        public void CreateSitecoreItems(List<BookCsvRow> bookRows)
        {
            var bookRoot = _database.GetItem(_bookContentImportRootPath);
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
                        var categoryGenericImage = GetDescendantByName(_bookImageRootItem, CategoryGenericImageName);

                        var category1Item = GetOrCreateChild(_bookContentImportRootItem, bookRow.Category1,
                            _bookSectionPageTemplate, out var category1Created);
                        if (category1Created)
                            EditBookCategory(category1Item, bookRow.Category1, categoryGenericImage);

                        var category2Item = GetOrCreateChild(category1Item, bookRow.Category2,
                            _bookSectionPageTemplate, out var category2Created);
                        if (category2Created)
                            EditBookCategory(category2Item, bookRow.Category2, categoryGenericImage);

                        var bookImageItem = GetChildByName(_bookImageImportRootItem, bookRow.Id);
                        var bookFileItem = GetChildByName(_bookFileImportRootItem, bookRow.Id);

                        var bookPageItem = GetOrCreateChild(category2Item, bookRow.Title,
                            _bookPageTemplate, out var bookPageCreated);
                        if (bookPageCreated)
                            EditBookPage(bookPageItem, bookRow, bookImageItem, bookFileItem);

                        //PublishItem(bookPageItem);
                    }
                    catch (Exception ex)
                    {
                        RecordMissingImportData(bookRow.Id, $" {bookRow.Title} - {ex.Message}");
                    }
                }
                if (!_missingStuff.Any())
                    return;
                var sb = new StringBuilder();
                foreach (var issue in _missingStuff.OrderBy(i => i.Key))
                {
                    sb.AppendLine($"issue: {issue.Key} , {issue.Value}");
                }
                //File.WriteAllText($"c:\\temp\\missingNavyNews_{DateTime.Now:yyyy-MM-dd}_{DateTime.Now:hh-mm}.txt",
                //  sb.ToString());
            }
        }

        public Item GetSitecoreImageItem(BookCsvRow issue)
        {
            var dot = '.';
            var startIndex = 0;
            var endIndex = issue.ImageFilename.LastIndexOf(dot);
            var length = endIndex - startIndex + 1;
            return _bookImageImportRootItem.Axes.GetDescendant(issue.ImageFilename.Substring(startIndex, length));
        }

        public Item GetSitecoreFileItem(BookCsvRow issue)
        {
            var dot = '.';
            var startIndex = 0;
            var endIndex = issue.BookFilename.LastIndexOf(dot);
            var length = endIndex - startIndex + 1;
            return _bookFileImportRootItem.Axes.GetDescendant(issue.BookFilename.Substring(startIndex, length));
        }

        private void RecordMissingImportData(string id, string whatsMissing)
        {
            if (_missingStuff.ContainsKey(id))
            {
                _missingStuff[id] += $"\r\n             - {whatsMissing}";
            }
            else
            {
                _missingStuff.Add(id, $"- {whatsMissing}");
            }
        }

        private Item GetChildByName(Item item, string itemName)
        {
            var child = item?.Children[itemName];
            return child;
        }

        private Item GetDescendantByName(Item item, string itemName)
        {
            var safeName = GetSafeItemName(itemName);
            var child = item?.Axes.GetDescendant(safeName);
            return child;
        }

        private Item GetOrCreateChild(Item parent, string childName, TemplateItem template, out bool itemCreated)
        {
            var childSafeName = GetSafeItemName(childName);
            var child = parent.Children[childSafeName];

            if (child != null)
            {
                itemCreated = false;
                return child;
            }
            child = parent.Add(childSafeName, template);

            PublishItem(child);

            itemCreated = true;
            return child;
        }

        private void EditBookCategory(Item categoryItem, string name, Item image)
        {
            using (new EditContext(categoryItem))
            {
                categoryItem.Fields["Page Title"].Value = name;
                ((ImageField) categoryItem.Fields["Thumbnail Image"]).MediaID = image.ID;
            }
        }

        private void EditBookPage(Item bookItem, BookCsvRow bookRow, Item image, Item file)
        {
            using (new EditContext(bookItem))
            {
                bookItem.Fields["Page Title"].Value = bookRow.Title;
                ((ImageField)bookItem.Fields["Thumbnail Image"]).MediaID = image.ID;

                ((FileField)bookItem.Fields["Book File"]).MediaID = file.ID;
                ((FileField)bookItem.Fields["Book File"]).Src = file.Paths.MediaPath;

                bookItem.Fields["Page Description"].Value = RemoveHtml(bookRow.Description);
                bookItem.Fields["Source ID"].Value = bookRow.Id;
                bookItem.Fields["Author"].Value = bookRow.Author;
                bookItem.Fields["Subtitle"].Value = bookRow.Subtitle;
                bookItem.Fields["Publisher"].Value = bookRow.Publisher;

            }
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

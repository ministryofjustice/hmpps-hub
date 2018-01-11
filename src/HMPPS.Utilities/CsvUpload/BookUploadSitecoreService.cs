using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using HMPPS.Models.Csv;
using Sitecore.Data;
using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using Sitecore.SecurityModel;

namespace HMPPS.Utilities.CsvUpload
{
    public class BookUploadSitecoreService
    {
        private readonly string _bookContentImportRootPath;
        private readonly string _bookImageImportRootPath;
        private readonly string _bookImageRootPath;
        private readonly string _bookFileImportRootPath;
        private readonly Database _database;
        private readonly Item _bookContentImportRootItem;
        private readonly Item _bookImageImportRootItem;
        private readonly Item _bookImageRootItem;
        private readonly Item _bookFileImportRootItem;
        private readonly TemplateItem _bookPageTemplate;
        private readonly TemplateItem _bookSectionPageTemplate;
        private readonly Dictionary<string, string> _errors = new Dictionary<string, string>();
        private const string SafeItemNameRegex = "[^A-Za-z0-9 _]";
        private const string CategoryGenericImageName = "entertainment";

        public BookUploadSitecoreService(Database database, TemplateItem bookPageTemplate,
            TemplateItem bookSectionPageTemplate, string bookContentImportRootPath, string bookImageImportRootPath, string bookImageRootPath, string bookFileImportRootPath)
        {
            _database = database;
            _bookPageTemplate = bookPageTemplate;
            _bookSectionPageTemplate = bookSectionPageTemplate;

            _bookContentImportRootPath = bookContentImportRootPath;
            _bookFileImportRootPath = bookFileImportRootPath;
            _bookImageImportRootPath = bookImageImportRootPath;
            _bookImageRootPath = bookImageRootPath;

            _bookContentImportRootItem = _database.GetItem(_bookContentImportRootPath);
            _bookImageImportRootItem = _database.GetItem(_bookImageImportRootPath);
            _bookImageRootItem = _database.GetItem(_bookImageRootPath);
            _bookFileImportRootItem = _database.GetItem(_bookFileImportRootPath);
        }

        private string GetSafeItemName(string name)
        { 
            return Regex.Replace(name, SafeItemNameRegex, " ").Trim();
        }
        private string RemoveHtml(string value)
        {
            var step1 = Regex.Replace(value, @"<[^>]+>|&nbsp;", "").Trim();
            var step2 = Regex.Replace(step1, @"\s{2,}", " ");
            return step2;
        }

        public string CreateSitecoreItems(List<BookCsvRow> bookRows)
        {
            var bookRoot = _database.GetItem(_bookContentImportRootPath);
            if (bookRoot == null)
            {
                return "Error: cannot find book content root item " + _bookContentImportRootPath;
            }
            var categoryGenericImage = GetDescendantByName(_bookImageRootItem, CategoryGenericImageName);
            if (categoryGenericImage == null)
                return "Error: cannot find book category generic image: " + _bookImageRootPath + "/" +
                       CategoryGenericImageName;
            using (new SecurityDisabler())
            {
                foreach (var bookRow in bookRows)
                {
                    try
                    {
                        var category1Item = GetOrCreateChild(bookRow.Id, _bookContentImportRootItem, bookRow.Category1,
                            _bookSectionPageTemplate, out var category1Created);
                        if (category1Created)
                            EditBookCategory(category1Item, bookRow.Category1, categoryGenericImage);

                        var category2Item = GetOrCreateChild(bookRow.Id, category1Item, bookRow.Category2,
                            _bookSectionPageTemplate, out var category2Created);
                        if (category2Created)
                            EditBookCategory(category2Item, bookRow.Category2, categoryGenericImage);

                        var bookImageItem = GetDescendantByName(_bookImageImportRootItem, bookRow.Id);
                        var bookFileItem = GetDescendantByName(_bookFileImportRootItem, bookRow.Id);

                        if (bookFileItem == null)
                        {
                            RecordMissingImportData(bookRow.Id, $" {bookRow.Id} {bookRow.Title} - Missing book file");
                            continue;
                        }
                        if (bookImageItem == null)
                        {
                            RecordMissingImportData(bookRow.Id, $" {bookRow.Id} {bookRow.Title} - Missing image file");
                            continue;
                        }


                        var bookPageItem = GetOrCreateChild(bookRow.Id, category2Item, bookRow.Title,
                            _bookPageTemplate, out var bookPageCreated);
                        if (bookPageCreated)
                            EditBookPage(bookPageItem, bookRow, bookImageItem, bookFileItem);

                    }
                    catch (Exception ex)
                    {
                        RecordMissingImportData(bookRow.Id, $" {bookRow.Id} {bookRow.Title} - {ex.Message}");
                    }
                }
                if (!_errors.Any())
                    return
                        "Upload successful. Please publish the content and media items manually after moving and checking them.";
                var sb = new StringBuilder();
                foreach (var error in _errors.OrderBy(i => i.Key))
                {
                    sb.AppendLine($"error: {error.Key} , {error.Value}");
                }
                return "Errors found: <br />" + sb;
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
            if (_errors.ContainsKey(id))
            {
                _errors[id] += $"<br />             - {whatsMissing}";
            }
            else
            {
                _errors.Add(id, $"- {whatsMissing}");
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

        private Item GetOrCreateChild(string id, Item parent, string childName, TemplateItem template, out bool itemCreated)
        {
            var childSafeName = GetSafeItemName(childName);
            if (string.IsNullOrEmpty(childSafeName))
            {
                RecordMissingImportData(id, $" {id} {childName} - Empty item safe name : " + childSafeName);
                itemCreated = false;
                return null;
            }
            var child = parent.Children[childSafeName];

            if (child != null)
            {
                itemCreated = false;
                return child;
            }
            child = parent.Add(childSafeName, template);

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
                bookItem.Fields["Book Author"].Value = bookRow.Author;
                bookItem.Fields["Book Subtitle"].Value = bookRow.Subtitle;
                bookItem.Fields["Book Publisher"].Value = bookRow.Publisher;

            }
        }

       
    }
}

using System;
using HMPPS.Models.Csv;
using CsvHelper.Configuration;

namespace HMPPS.Utilities.CsvUpload
{
    public sealed class BookCsvRowMap : ClassMap<BookCsvRow>
    {
        public BookCsvRowMap()
        {
            int _row = -1;
            try
            {
                Map(m => m.Id).Name("id");
                Map(m => m.Publisher).Name("publisher");
                Map(m => m.BookFilename).Name("sample");
                Map(m => m.ImageFilename).Name("cover");
                Map(m => m.Author).Name("author");
                Map(m => m.Title).Name("title");
                Map(m => m.Description).Name("description");
                Map(m => m.Subtitle).Name("subtitle");
                Map(m => m.Category1).Name("category1");
                Map(m => m.Category2).Name("category2");
            }
            catch (Exception ex)
            {
                throw new Exception($"There was a problem importing item on row {_row}", ex);
            }
        }
    }
}

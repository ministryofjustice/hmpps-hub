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
                Map(m => m.Id);
                Map(m => m.Publisher);
                Map(m => m.BookFilename);
                Map(m => m.ImageFilename);
                Map(m => m.Author);
                Map(m => m.Title);
                Map(m => m.Description);
                Map(m => m.Subtitle);
                Map(m => m.Category1);
                Map(m => m.Category2);
            }
            catch (Exception ex)
            {
                throw new Exception($"There was a problem importing item on row {_row}", ex);
            }
        }
    }
}

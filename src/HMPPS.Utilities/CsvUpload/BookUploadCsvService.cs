using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using CsvHelper;
using HMPPS.Models.Csv;

namespace HMPPS.Utilities.CsvUpload
{
    public class BookUploadCsvService : IDisposable
    {
        private readonly CsvReader _reader;
        public bool IsLoaded = false;

        public BookUploadCsvService(string fileLocation)
        {
            FileInfo fi = new FileInfo(fileLocation);
            if (!fi.Exists)
            {
                throw new FileNotFoundException($"The file specified can not be found at the location: {fileLocation}");
            }
            _reader = LoadCsvFile(fileLocation);
            IsLoaded = true;
            _reader.Configuration.RegisterClassMap<BookCsvRowMap>();
            _reader.Configuration.Delimiter = ",";
            _reader.Configuration.HasHeaderRecord = true;
            _reader.Configuration.Quote = '"';
        }
        public List<BookCsvRow> GetAllRows()
        {
            return _reader.GetRecords<BookCsvRow>().ToList();
        }

        public BookCsvRow GetRow(int rowIndex)
        {
            _reader.Read();
            while (_reader.Context.Row != rowIndex)
            {
                _reader.Read();
            }
            return _reader.GetRecord<BookCsvRow>();
        }



        internal CsvReader LoadCsvFile(string path)
        {
            TextReader reader = new StreamReader(path);
            return LoadCsvFile(reader);
        }

        internal CsvReader LoadCsvFile(TextReader reader)
        {
            return new CsvReader(reader);
        }

        public void Dispose()
        {
            _reader?.Dispose();
        }
    }
}

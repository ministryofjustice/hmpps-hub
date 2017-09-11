using HMPPS.Models.Common;

namespace HMPPS.Models.Cms
{
    public class Book
    {
        public string Title { get; set; }
        public Link Link { get; set; }
        public Image Image { get; set; }
        public bool OpenEreader { get; set; }

        public Book()
        {
            Link = new Link();
            Image = new Image();
        }
    }
}

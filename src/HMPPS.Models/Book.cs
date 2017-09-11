using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMPPS.Models
{
    public class Book
    {
        public string Title { get; set; }
        public string Url { get; set; }

        public bool NewWindow { get; set; }

        public Image Image { get; set; }
    }
}

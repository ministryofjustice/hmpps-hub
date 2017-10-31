using System.Text;
using Sitecore.Diagnostics;
using Sitecore.IO;
using System.Xml.Schema;
using System.Xml;
using Sitecore.Layouts;
using Sitecore.Shell.Controls.RichTextEditor.Pipelines.SaveRichTextContent;

namespace HMPPS.Utilities.Pipelines
{
    class RichTextEditorAddParagraphs
    {
        private StringBuilder _stringBuilder;

        public void Process(SaveRichTextContentArgs args)
        {
            _stringBuilder = new StringBuilder();
            Assert.ArgumentNotNull(args, "args");
            string body;

            var trimmed = args.Content.Trim();

            // don't wrap P if RTE already has a block level element which should not be placed inside P - http://reference.sitepoint.com/html/block-level
            if ((args.Content != string.Empty) && !args.Content.Contains("</p>") &&
                    !trimmed.StartsWith("<ul>") &&
                    !trimmed.StartsWith("<ol>") &&
                    !trimmed.StartsWith("<table>") &&
                    !trimmed.StartsWith("<pre>") &&
                    !trimmed.StartsWith("<p>") &&
                    !trimmed.StartsWith("<h1>") &&
                    !trimmed.StartsWith("<h2>") &&
                    !trimmed.StartsWith("<h3>") &&
                    !trimmed.StartsWith("<h4>") &&
                    !trimmed.StartsWith("<h5>") &&
                    !trimmed.StartsWith("<h6>") &&
                    !trimmed.StartsWith("<dl>") &&
                    !trimmed.StartsWith("<div>") &&
                    !trimmed.StartsWith("<blockquote>") &&
                    !trimmed.StartsWith("<address>"))
            {
                body = "<p>" + args.Content + "</p>";
            }
            else
            {
                return;
            }
            try
            {
                var schemaUri = FileUtil.MapPath("/sitecore/shell/schemas/xhtml.xsd");
                var set = new XmlSchemaSet();
                set.Add(null, schemaUri);
                var settings = new XmlReaderSettings();
                settings.ValidationEventHandler += ValidationEventHandler;
                settings.ValidationFlags |= XmlSchemaValidationFlags.ReportValidationWarnings;
                settings.ValidationType = ValidationType.Schema;
                settings.Schemas = set;
                settings.DtdProcessing = DtdProcessing.Parse;
                settings.XmlResolver = new CachedXmlUrlResolver();
                if (_stringBuilder.ToString() == string.Empty)
                {
                    args.Content = body;
                }
            }
            catch
            {
                // ignored
            }
        }

        private void ValidationEventHandler(object sender, ValidationEventArgs args)
        {
            _stringBuilder.Append("Validation error: " + args.Message + "<br>");
        }
    }
}

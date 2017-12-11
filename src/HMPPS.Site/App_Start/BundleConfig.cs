using System.Web.Optimization;

namespace HMPPS.Site
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/bundles/hmpps.css").Include(
                "~/hmppsAssets/css/hmpps.css"));
            bundles.Add(new StyleBundle("~/bundles/govuk-template.css").Include(
                "~/hmppsAssets/css/govuk-template.css"));
            bundles.Add(new StyleBundle("~/bundles/govuk-template-print.css").Include(
                "~/hmppsAssets/css/govuk-template-print.css"));
            bundles.Add(new StyleBundle("~/bundles/fonts.css").Include(
                "~/hmppsAssets/css/fonts.css"));

            //some JS files are already minified, we just want to bundle them, that is why we are using Bundle instead of ScriptBundle
            bundles.Add(new Bundle("~/bundles/application.js").Include(
                "~/hmppsAssets/js/application.js"
            ));
            bundles.Add(new Bundle("~/bundles/chess-scripts.js").Include(
                "~/hmppsAssets/js/src/third-party/lib/jquery-3.2.1.min.js",
                "~/hmppsAssets/js/src/third-party/lib/chessboard-0.3.0.min.js",
                "~/hmppsAssets/js/src/third-party/lib/chess.min.js",
                "~/hmppsAssets/js/src/third-party/lib/stockfish.js"
            ));
            bundles.Add(new ScriptBundle("~/bundles/sudoku-scripts.js").Include(
                "~/hmppsAssets/js/src/third-party/lib/jquery-3.2.1.min.js",
                "~/hmppsAssets/js/src/third-party/lib/sudokuJS.js"
            ));
            bundles.Add(new Bundle("~/bundles/book-scripts.js").Include(
                "~/hmppsAssets/js/src/third-party/lib/jszip.min.js",
                "~/hmppsAssets/js/src/third-party/lib/epub.min.js",
                "~/hmppsAssets/js/src/third-party/lib/mime-types.js"
            ));
            BundleTable.EnableOptimizations = true;
        }
    }
}

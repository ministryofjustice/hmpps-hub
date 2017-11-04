using System.Web.Optimization;

namespace HMPPS.Site
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            //work in progress, bundles not yet used in views as FE need to make some amends first
            //more bundles to be created for the govuk css files in head
            bundles.Add(new StyleBundle("~/bundles/hmpps.css").Include(
                "~/hmppsAssets/css/hmpps.css"));
            bundles.Add(new StyleBundle("~/bundles/hmpps-ie6.css").Include(
                "~/hmppsAssets/css/hmpps-ie6.css"));
            bundles.Add(new StyleBundle("~/bundles/hmpps-ie7.css").Include(
                "~/hmppsAssets/css/hmpps-ie7.css"));
            bundles.Add(new StyleBundle("~/bundles/hmpps-ie8.css").Include(
                "~/hmppsAssets/css/hmpps-ie8.css"));


            bundles.Add(new ScriptBundle("~/bundles/application.js").Include(
                "~/hmppsAssets/js/application.js"
            ));
            bundles.Add(new ScriptBundle("~/bundles/chess-scrips.js").Include(
                "~/hmppsAssets/js/src/third-party/lib/jquery-3.2.1.min.js",
                "~/hmppsAssets/js/src/third-party/lib/chessboard-0.3.0.min.js",
                "~/hmppsAssets/js/src/third-party/lib/chess.min.js",
                "~/hmppsAssets/js/src/third-party/lib/stockfish.js"
            ));
            bundles.Add(new ScriptBundle("~/bundles/sudoku-scripts.js").Include(
                "~/hmppsAssets/js/src/third-party/lib/jquery-3.2.1.min.js",
                "~/hmppsAssets/js/src/third-party/lib/sudokuJS.js"
            ));
            bundles.Add(new ScriptBundle("~/bundles/book-scripts.js").Include(
                "~/hmppsAssets/js/src/third-party/lib/jszip.min.js",
                "~/hmppsAssets/js/src/third-party/lib/epub.min.js",
                "~/hmppsAssets/js/src/third-party/lib/mime-types.js"
            ));
            BundleTable.EnableOptimizations = true;
        }
    }
}

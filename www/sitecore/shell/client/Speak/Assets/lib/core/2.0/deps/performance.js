define( ["Sitecore"], function ( sc ) {
    return {
        enablePerformanceTracking: function () {
            sc.on( 'beforeParsing', function () {
                window.beforeParsing = performance.now();
            });

            sc.on( 'afterParsing', function () {
                window.afterParsing = performance.now();
            });

            sc.on( 'beforeLoading', function () {
                window.beforeLoading = performance.now();
            });

            sc.on( 'afterLoading', function () {
                window.afterLoading = performance.now();
            });

            sc.on( 'apps:loaded', function () {
                window.all = performance.now();
                window.parsingTime = window.afterParsing - window.beforeParsing;

                console.log("Parsing Time ms");
                console.log(window.parsingTime);

                window.loadingTime = afterLoading - beforeLoading;

                console.log("Component & PageCode Loading Time ms (NOT Primary files)");
                console.log(window.loadingTime);

                window.overallTime = all - startTime;

                console.log("Overall Time ms");
                console.log(window.overallTime);
            });
        }
    };
});
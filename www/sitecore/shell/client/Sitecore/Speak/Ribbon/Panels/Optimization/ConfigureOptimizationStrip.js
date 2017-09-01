require.config({
    paths: {
        activeTestState: "/sitecore/shell/client/Sitecore/ContentTesting/ActiveTestState"
    }
});

define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js", "activeTestState"], function (Sitecore, ExperienceEditor, ActiveTestState) {
    // IE9 bug-fix
    Sitecore.ExperienceEditor = Sitecore.ExperienceEditor || {};
    Sitecore.ExperienceEditor.Hooks = Sitecore.ExperienceEditor.Hooks || [];

    var optimizationTabId = "TestingStrip_ribbon_tab";
    var testSummaryRetryLimit = 30;
    var testSummaryRetryCounter = 0;

    function removeCtElements() {
        var statusChunkElement = $("[data-sc-id='StatusChunk']");
        statusChunkElement.remove();

        var pageReportChunkElement = $("[data-sc-id='PageReports']");
        pageReportChunkElement.remove();

        var listsChunkElement = $("[data-sc-id='Lists']");
        listsChunkElement.remove();

        var createChunkElement = $("[data-sc-id='Create']");
        createChunkElement.remove();

        var el = $("#" + optimizationTabId);
        var indicatorExists = el.find("div.optimization-indicator").length > 0;

        if (indicatorExists) {
            el.find("div.optimization-indicator").remove();
        }
    }

    function setTestIndicator(hasTest) {
        var el = $("#" + optimizationTabId);
        var indicatorExists = el.find("div.optimization-indicator").length > 0;

        if (!hasTest) {
            el.find("div.optimization-indicator").remove();
        } else if (!indicatorExists) {
            el.prepend("<div class='optimization-indicator'></div>");
        }
    }

    function updateOptimizationTab(context) {
        var isEnabled;
        var hasTest = false;
        if (ActiveTestState) {
            hasTest = ActiveTestState.hasActiveTest(context);
        }

        ExperienceEditor.PipelinesUtil.generateRequestProcessor("Optimization.IsContentTestingEnabledRequest", function (response) {
            isEnabled = response.responseValue.value;
        }, context.currentContext).execute(context);

        if (!isEnabled) {
            removeCtElements();
            return;
        }

        setTestIndicator(hasTest);
    }

    function renderTestSummary() {
        var topwindow = window;
        while (topwindow.location.href !== topwindow.parent.location.href) {
            topwindow = topwindow.parent;
        }

        if (topwindow.scIsDialogsInitialized) {
            if (window.scForm && window.scForm.postRequest) {
                window.scForm.postRequest("", "", "", "test:summary");
            }
        } else if (testSummaryRetryCounter < testSummaryRetryLimit) {
            testSummaryRetryCounter++;
            window.setTimeout(renderTestSummary, 1000);
        }
    }

    Sitecore.ExperienceEditor.Hooks.push({
        execute: function (context) {
            var layout = window.top.document.getElementById("scLayout");
            if (layout) {
                layout.onchange = function() { updateOptimizationTab(context); };
            }

            updateOptimizationTab(context);
            renderTestSummary();
        }
    });
});
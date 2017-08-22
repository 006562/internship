uiManager = function () {
    var getUIContext = function () {
        var uiContext = {};
        uiContext.viewTask = "viewTask";
        uiContext.viewEC = "viewEC";
        uiContext.viewECMainList = "viewECMainList";
        uiContext.viewECWorkArea = "viewECWorkArea";

        return uiContext;
    };

    var regisUiEvents = function () {
        $("#studioTabs").tabs();

        $('#solutionBar').live("mouseover", function () {
            $(this).find("div").eq(0).css("background-color", "#5B7199");
        });
        $('#solutionBar').live("mouseleave", function () {
            $(this).find("div").eq(0).css("background-color", "#364E6F");
        });
        $('#solutionBar').live("click", function () {
            var baseLeft = $('#solutionBar').offset().left;
            $("#viewSolution").css("left", (baseLeft + 33) + "px");
            $("#viewSolution").toggle();
            $("#viewSolution").resizable({ handles: 'e', ghost: true });
        });
        
    };

    return {
        getUIContext: getUIContext,
        regisUiEvents: regisUiEvents
    };
}();
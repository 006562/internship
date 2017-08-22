uiManager = function () {
    var getUIContext = function () {
        var uiContext = {};
        uiContext.viewXmlDivId = "viewXml";
        uiContext.viewFormDivId = "viewForm";
        uiContext.viewSessionDivId = "viewSession";
        uiContext.appDomain = getParameterByName("appDomain") == "" ? "task" : getParameterByName("appDomain");
        //...
        return uiContext;
    };

    var regisUiEvents = function () {
        $("#tabs").tabs();
        $("#fullScreen").click(function () {
            var src = $(this)[0].src;
            if (src.indexOf("up.gif") > 0)
                $(this).attr("src","../img/down.gif");
            else
                $(this).attr("src", "../img/up.gif");

            $("#taskIndicatorArea").toggle();
        });
    };

    return {
        getUIContext: getUIContext,
        regisUiEvents: regisUiEvents
    };
} ();
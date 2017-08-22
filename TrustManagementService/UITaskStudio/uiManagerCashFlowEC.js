uiManagerCashFlowEC = function () {
    var getUIContext = function () {
        var uiContext = {};
        uiContext.viewXmlDivId = "viewECXml";
        uiContext.viewFormDivId = "viewECForm";
        uiContext.viewECWCFDivId = "viewECWCF";
        uiContext.viewECVerifyDivId = "viewECVerify";
        uiContext.appDomain = getParameterByName("appDomain") == "" ? "task" : getParameterByName("appDomain");
        //...
        return uiContext;
    };

    var regisUiEvents = function () {
        $("#tabs").tabs();
        $("#fullScreen").click(function () {
        });
    };

    return {
        getUIContext: getUIContext,
        regisUiEvents: regisUiEvents
    };
} ();
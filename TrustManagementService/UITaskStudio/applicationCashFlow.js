// WCF deployment test

applicationCashFlow = function () {

    var init = function () {
        var uiContext = uiManagerCashFlow.getUIContext();
        var taskController = new controllerCashFlow(uiContext);
        taskController.init();
    };

    return {
        init: init
    };
} ();
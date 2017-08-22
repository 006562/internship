// WCF deployment test

applicationCashFlowEC = function () {

    var init = function () {
        var uiContext = uiManagerCashFlowEC.getUIContext();
        var taskController = new controllerCashFlowEC(uiContext);
        taskController.init();
    };

    return {
        init: init
    };
} ();
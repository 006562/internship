// WCF deployment test

application = function () {

    var init = function () {
        //var uiContext = uiManager.getUIContext();
        var globalObj = new globalCashFlowStudio();
        var taskController = new controller(globalObj);
        taskController.init();
    };

    return {
        init: init
    };
}();
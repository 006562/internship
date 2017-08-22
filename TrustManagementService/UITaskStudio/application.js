// WCF deployment test

application = function () {

    var init = function () {
        var uiContext = uiManager.getUIContext();
        var taskController = new controller(uiContext);
        taskController.init();
    };

    return {
        init: init
    };
} ();
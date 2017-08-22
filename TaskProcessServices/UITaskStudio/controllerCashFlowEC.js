controllerCashFlowEC = function (uiContext) {
    var views = [];
    var viewContext = uiContext;
    var localStorage = new storage();

    var init = function () {
        viewContext.model = localStorage.getObj();

        var vXml = new viewECXML(viewContext);
        vXml.onModelUpdate(updateObj);
        var vForm = new viewFormCashFlowEC(viewContext);
        vForm.onModelUpdate(updateObj);
        var vWCF = new viewECWCF(viewContext);
        vWCF.onModelUpdate(updateObj);
        var vVerify = new viewFormCashFlowECVerify(viewContext);
        vVerify.onModelUpdate(updateObj);

        views.push(vXml);
        views.push(vForm);
        views.push(vWCF);
        views.push(vVerify);
        showViews();
    };

    var showViews = function () {
        for (var i = 0; i < views.length; i++) {
            views[i].render();
        };
    };

    var updateObj = function (objContext) {
        if (localStorage.checkLocker(objContext.locker)) {

            localStorage.setLocker(objContext.locker);

            localStorage.setObj(objContext.obj);

            sync();
            localStorage.setLocker("");
        }
        else {
            alert("Can't update, storage is locked by " + currentView.getName());
        }
    };

    var sync = function () {

        viewContext.model = localStorage.getObj();
        for (var i = 0; i < views.length; i++) {
            views[i].refresh(viewContext);
        };
    };

    return {
        init: init
    };
};



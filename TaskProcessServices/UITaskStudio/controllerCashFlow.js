controllerCashFlow = function (uiContext) {
    var views = [];
    var viewContext = uiContext;
    var localStorage = new storage();

    var init = function () {
        viewContext.model = localStorage.getObj();

        var vXml = new viewXML(viewContext);
        vXml.onModelUpdate(updateObj);
        var vForm = new viewFormCashFlow(viewContext);
        vForm.onModelUpdate(updateObj);
        var vSimpleForm = new viewFormCashFlowSimple(viewContext);
        vSimpleForm.onModelUpdate(updateObj);
        var vWCF = new viewWCF(viewContext);
        vWCF.onModelUpdate(updateObj);

        views.push(vXml);
        views.push(vForm);
        views.push(vSimpleForm);
        views.push(vWCF);

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



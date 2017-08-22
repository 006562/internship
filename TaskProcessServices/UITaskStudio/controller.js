controller = function (uiContext) {
    var views = [];
    var viewContext = uiContext;
    var localStorage = new storage();

    var init = function () {
        viewContext.model = localStorage.getObj();

        var vSession = new viewSession(viewContext);
        var vXml = new viewXML(viewContext);
        vXml.onModelUpdate(updateObj);
        var vForm = new viewForm(viewContext);
        vForm.onModelUpdate(updateObj);

        views.push(vSession);
        views.push(vXml);
        views.push(vForm);

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



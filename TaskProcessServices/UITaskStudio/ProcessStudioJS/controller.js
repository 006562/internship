controller = function (globalObj) {
    var views = [];
    var viewGlobalObj = globalObj;
    //var localStorage = new storage();

    var init = function () {
        var vTask = new viewFormCashFlowStudioTask(viewGlobalObj);
        vTask.onXmlUpdate(onXmlUpdate);
        var vTaskActions = new viewFormCashFlowStudioTaskActions(viewGlobalObj);
        vTaskActions.onXmlUpdate(onXmlUpdate);
        var vTaskMethods = new viewFormCashFlowStudioTaskMethods(viewGlobalObj);
        vTaskMethods.onXmlUpdate(onXmlUpdate);
        var vTaskWork = new viewFormCashFlowStudioTaskWork(viewGlobalObj);
        vTaskWork.onXmlUpdate(onXmlUpdate);
        var vTaskTools = new viewFormCashFlowStudioTaskTools(viewGlobalObj);
        vTaskTools.onXmlUpdate(onXmlUpdate);
        var vTaskXml = new viewFormCashFlowStudioTaskXml(viewGlobalObj);
        vTaskXml.onXmlUpdate(onXmlUpdate);
        //var vEC = new viewFormCashFlowStudioEC(viewGlobalObj);
        //vEC.onXmlUpdate(onXmlUpdate);
        //var vECMains = new viewFormCashFlowStudioECMains(viewGlobalObj);
        //vECMains.onXmlUpdate(onXmlUpdate);
        //var vECWork = new viewFormCashFlowStudioECWork(viewGlobalObj);
        //vECWork.onXmlUpdate(onXmlUpdate);
        //var vECTools = new viewFormCashFlowStudioECTools(viewGlobalObj);
        //vECTools.onXmlUpdate(onXmlUpdate);
        //var vECVariables = new viewFormCashFlowStudioECVariables(viewGlobalObj);
        //vECVariables.onXmlUpdate(onXmlUpdate);
        //var vECXml = new viewFormCashFlowStudioECXml(viewGlobalObj);
        //vECXml.onXmlUpdate(onXmlUpdate);
        var vSimpleTaskWork = new viewFormCashFlowStudioSimpleTaskWork(viewGlobalObj);
        vSimpleTaskWork.onXmlUpdate(onXmlUpdate);
        var vSessionVariables = new viewFormSessionVariables(onXmlUpdate);
        vSessionVariables.onXmlUpdate(onXmlUpdate);
        var vObjectExplorer = new viewFormObjectExplorer(viewGlobalObj);
        vObjectExplorer.onXmlUpdate(onXmlUpdate);

        views.push(vTask);
        views.push(vTaskActions);
        views.push(vTaskMethods);
        views.push(vTaskWork);
        views.push(vTaskTools);
        views.push(vTaskXml);
        //views.push(vEC);
        //views.push(vECMains);
        //views.push(vECWork);
        //views.push(vECTools);
        //views.push(vECVariables);
        //views.push(vECXml);
        views.push(vSimpleTaskWork);
        views.push(vSessionVariables);
        views.push(vObjectExplorer);
        showViews();
    };

    var getViewIndex = function (viewName) {
        switch (viewName) {
            case ("TaskActions"):
                return 1;
                break;
            case ("TaskMethods"):
                return 2;
                break;
            case ("TaskWork"):
                return 3;
                break;
            case ("TaskXml"):
                return 5;
                break;
            //case ("ECMains"):
            //    return 7;
            //    break;
            //case ("ECTools"):
            //    return 9;
            //    break;
            //case ("ECWork"):
            //    return 8;
            //    break;
            //case ("ECVariables"):
            //    return 10;
            //    break;
            //case ("ECXml"):
            //    return 11;
            //    break;
            case ("SimpleTaskWork"):
                return 6;
                break;
            case ("SessionVariable"):
                return 7;
                break;
            default:
                return -1;
        }
    }

    var showViews = function () {
        for (var i = 0; i < views.length; i++) {
            views[i].render();
        };
    };

    var onXmlUpdate = function (globalObj, updateView) {
        viewGlobalObj = globalObj;
        for (var i = 0; i < views.length; i++) {
            views[i].refreshGlobalObj(viewGlobalObj);
        };
        for (var i = 0; i < updateView.length; i++) {
            var j = getViewIndex(updateView[i]);
            if (j > -1) {
                views[j].refreshViews();
            }
        };
    }
   
    return {
        init: init
    };
};



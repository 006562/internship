viewFormSessionArrays = function (viewGlobalObj) {
    var viewTemplate = "<div id=\"divRibon\" style='height:30px;border:1px solid #808080;border-bottom:none'>" +
                           "<div id='ribbon_SaveArray' class='ribbon' title='Save'><div class='bigicons bigdisk'></div></div>" +
                           "<div id='ribbon_RefreshArray' class='ribbon' title='Refresh'><div class='bigicons bigrefresh'></div></div>" +
                       "</div>" +
                       "<div id=\"divArrayTable\" style='height:100%;marging:0;border:1px solid #808080;padding:0;overflow: auto;'></div>";

    var regisUiEvents = function () {
       
        riboonTool();

        $("#ribbon_SaveArray").live("click", function () {
            var $container = $("#divArrayTable");
            var handsontable = $container.data('handsontable');
            var data = handsontable.getData();
            saveProcessTaskArray(viewGlobalObj.appDomain, viewGlobalObj.taskCode, retArrays(data));
        });

        $("#ribbon_RefreshArray").live("click", function () {
            getProcessTaskArrayByTaskCode(viewGlobalObj.appDomain, viewGlobalObj.taskCode, showArrays);
        });
        
    };

    this.render = function () {
        var content = viewTemplate;
        $("#divArrayPannel").empty();
        $("#divArrayPannel").append(content);
        postRender();
    };

    var postRender = function () { 
        if (viewGlobalObj != undefined && viewGlobalObj.taskCode != "") {
            getProcessTaskArrayByTaskCode(viewGlobalObj.appDomain, viewGlobalObj.taskCode, showArrays);
            regisUiEvents();
        } else {
            showArrays();
        }
        
    };
};



viewFormRangeAddInExcel = function () {
    var viewTemplate = "<div style='margin-top:3px;'>" +
                            "<div id='ribbon_GetRange' class='ribbon' title='Get Ranges'><div class='bigicons bigtotable'></div></div>" +
                            "<div id='ribbon_rangeToExcel' class='ribbon' title='Export range to excel'><div class='bigicons bigtoexcel'></div></div>" +
                            "<div id='ribbon_SaveRange' class='ribbon' title='Save ranges'><div class='bigicons bigdisk'></div></div>" +
                        "</div></br></br>" +
                        "<div id=\"divArrayTable\" style='marging:0;padding:0;'></div>" +
                        "<div id='divMsg' style='display:block'></div>";

    var regisUiEvents = function () {
        renderArrayTable();
        $("#ribbon_GetRange").live("click", function () {
            getRangeFormExcel(showArrays);
        });

        $("#ribbon_SaveRange").live("click", function () {
            var $containerArray = $("#divArrayTable");
            var handsontableArray = $containerArray.data('handsontable');
            var dataArray = handsontableArray.getData();
            saveProcessTaskArray($("#txtAppDomain").val(), $("#txtTaskCode").val(), retArrays(dataArray));
        });

        $("#ribbon_rangeToExcel").live("click", function () {
            exportRangeFromGridToExcel(rebuiltArrayData);
        });
    };

    this.render = function () {
        var content = viewTemplate;
        $("#viewFormRange").empty();
        $("#viewFormRange").append(content);
        postRender();
    };

    var postRender = function () { 
        regisUiEvents(); 
    };
};



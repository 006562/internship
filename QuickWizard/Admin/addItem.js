var HaveDoneAction = false;
var innerAlias ;
var categoryAlias ;
var itemId;
var pageId;
var ItemList = [];
winHeight = $(window.parent.document).height();
winWidth = $(window.parent.document).width();
$(function () {
    var db = getQueryString("db");
    var sc = getQueryString("sc");
    AdminOperate.dbName = db;
    AdminOperate.schema = sc;
    pageId = getQueryString("pageId");
    $("#pageId").val(pageId);
    AdminOperate.GetItemSelect(pageId, function (data) {
        $.each(data, function (i, d) {
            ItemList.push(d);
        });
        MultiSelect(ItemList);
    }); 
    registerEvent();
});
function registerEvent() {
    $('#btnSave').click(function () {
        var multiSelect = $("#itemId").data("kendoMultiSelect");
        var pass = validation();
        if (!pass) {
            return;
        }
        var ItemIds = multiSelect.value();
        var options = $("#dataType option:selected");
        var dataType = options.text();
        var isCompulsory = getRadioValue("isCompulsory");
        var bit01 = getRadioValue("bit01");
        var bit02 = getRadioValue("bit02");
        var bit03 = getRadioValue("bit03");
        var sequenceNo = $("#sequenceNo").val();
        var xml = '<Items>';
        if (ItemIds.length > 0) {
            for (var i = 0; i < ItemIds.length; i++) {
                xml += '<Item><ItemId>' + ItemIds[i] + '</ItemId><PageId>' + pageId + '</PageId><DataType>' + dataType + '</DataType><IsCompulsory>' + isCompulsory + '</IsCompulsory>';
                xml += '<Bit01>' + bit01 + '</Bit01><Bit02>' + bit02 + '</Bit02><Bit03>' + bit03 + '</Bit03><SequenceNo>' + sequenceNo + '</SequenceNo> </Item>';
            }
        }
        xml += "</Items>"
        var exml = encodeURIComponent(xml);
        AdminOperate.addPageItem(exml, callback)
        function callback(r) {
            if (r == 1) {
                alertMsg('Save Successfull!');
                refreshSelect();
                HaveDoneAction = true;
            }
            else { alertMsg('Failed：' + r, 'icon-warning'); }
        }
    });
}
function getRadioValue(elementName) {
    var isWorkingDay;
    var obj;
    obj = document.getElementsByName(elementName);
    if (obj != null) {
        var i;
        for (i = 0; i < obj.length; i++) {
            if (obj[i].checked) {
                isWorkingDay = i;
                return isWorkingDay;
            }
        }
    }
}
function validation() {
    var pass = true;
    var detail = $("#item").find("input");
    pass = validControls(detail);
    return pass;
}
function closeWindow() {
    $('#modal-close').trigger('click');
}

function MultiSelect(data) {
    $("#itemId").kendoMultiSelect({
        dataTextField: "Text",
        dataValueField: "Value",
        dataSource: data
    });

}


function refreshSelect() {
    ItemList.length = 0;
    AdminOperate.GetItemSelect(pageId, function (data) {
        $.each(data, function (i, d) {
            ItemList.push(d);
        });
        //刷新数据
        $("#itemId").data('kendoMultiSelect').dataSource.read();
        $("#itemId").data('kendoMultiSelect').refresh();
    });
}
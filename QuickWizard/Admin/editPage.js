var HaveDoneAction = false;
var flag;
var pageId;
$(function () {
    var db = getQueryString("db");
    var sc = getQueryString("sc");
    AdminOperate.dbName = db;
    AdminOperate.schema = sc;
    flag = getQueryString("flag");
    pageId = getQueryString("PageId");
    if (flag == "2" && pageId != null) {
        AdminOperate.getPageDetailById(pageId, function (d) {
            if (d != null) {
                $('#pageId').val(d[0].PageId);
                $('#pageCode').val(d[0].PageCode);
                $('#pageTitle').val(d[0].PageTitle);
                $('#pageDescription').val(d[0].PageDescription);
            }
        })
    }
    $('#btnSave').click(function () {
        var pass = validation();
        if (!pass) {
            return;
        }
        var pageId = $("#pageId").val();
        var pageCode = $("#pageCode").val();
        var pageTitle = $("#pageTitle").val();
        var pageDescription = $("#pageDescription").val();
        var xml = '<Items>';
        xml += '<Item><PageId>' + pageId + '</PageId><PageCode>' + pageCode + '</PageCode><PageTitle>' + pageTitle + '</PageTitle><PageDescription>' + pageDescription + '</PageDescription></Item>';
        xml += "</Items>"
        var exml = encodeURIComponent(xml);
        AdminOperate.savePageById(exml, flag, callback)
        function callback(r) {
            if (r == 1) {
                alertMsg('Add Successfull!');
                HaveDoneAction = true;
                //setTimeout(function () { parent.closeWindow(); }, 1000);
            }
            if (r == 2) {
                alertMsg('Update Successfull!');
                HaveDoneAction = true;
                //setTimeout(function () { parent.closeWindow(); }, 1000);
            }
            else { alertMsg('Failed：' + r, 'icon-warning'); }
        }
    });
});

function validation() {
    var pass = true;
    var detail = $("#page").find("input");
    pass = validControls(detail);
    return pass;
}

var HaveDoneAction = false;//用于父页面是否需要刷新,子页面如果有Save操作会给它赋值
var flag = 0; 
var ApplicationId = null;

$(function () {
    flag = getQueryString("flag");
    ApplicationId = getQueryString("appId");
    GetAppInfo(ApplicationId);

});


function GetAppInfo(ApplicationId) {
    if (ApplicationId != null) {
        RoleOperate.getAppInfoById(ApplicationId, function (data) {
            $("#appName").val(data[0].ApplicationName);
            $("#appDes").val(data[0].Description);
        });
    }
}


function saveItems() {
    var pass = validation();
    if (!pass) {
        return;
    }
    var ApplicationName = $("#appName").val();
    var Description = $("#appDes").val();
    //if (ApplicationName == '' || Description == '') {
    //    alert('请将应用信息填写完整！');
    //}
    //else {
        var xml = '<item><ApplicationName>' + ApplicationName + '</ApplicationName><Description>' + Description + '</Description></item>'
            xml = encodeURIComponent(xml);
            RoleOperate.saveApplicationData(xml, flag, ApplicationId, callback);
            function callback(r) {
                if (r == '1') {                   
                    alert("已添加过此应用名称,请勿重复添加！");

                }                   
                else if (r == '2') {
                    alert("保存成功！");
                    window.parent.refreshGrid();
                }
                else if (r == '3') {  //编辑页面保存后                  
                     alert("应用名称重复！请重新命名！");
                }
                else if (r == '4') {
                    alert('编辑成功！')
                    window.parent.refreshGrid();
                    
                }
                else { alert(r); }
            }
        //} 
}

function validation() {
    var inputs = $("#ItemDiv").find("input");
    var textareas = $("#ItemDiv").find("textarea");
    var pass1 = validControls(inputs);
    var pass2 = validControls(textareas);
    if (pass1 && pass2) {
        return true;
    }
    else {
        return false;
    }

}




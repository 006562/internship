var roleId;
var flag;

//用于父页面是否需要刷新,子页面如果有Save操作会给它赋值
var HaveDoneAction = false;

$(function () {
    roleId = getQueryString("roleId");
    flag = getQueryString("flag");
    if (flag=="1"&&roleId != null) {
        RoleOperate.getRoleById(roleId, function (d) {
            if (d != null) {
                $('#RoleName').val(d.RoleName);
                $('#Description').val(d.Description);
            }
        })
        
    }
});



 
function saveData() {
    var pass = validation();
    if (!pass) {
        return;
    }

    var roleName = $("#RoleName").val();
    var description = $("#Description").val();
    var xml = '<Item><RoleId>' + roleId + '</RoleId><RoleName>' + roleName + '</RoleName><Description>' + description + '</Description></Item>'
    xml = encodeURIComponent(xml);
    RoleOperate.saveRolesData(xml, flag, function (result) {
        if (!isNaN(result)) {
            if (result == "1") {
                alert("添加成功！");
                window.parent.refreshGrid();
            }
            else if (result == "2") {
                alert("编辑成功");
                window.parent.refreshGrid();
            }
            else if (result == "-1") {
                alert("角色已经存在");
            }
        }
        else {
            alertMsg("Error:" + result, 'icon-warning');
        }
    });

}


function validation() {
    var inputs = $("#roleDiv").find("input");
    var textareas = $("#roleDiv").find("textarea");
    var pass1 = validControls(inputs);
    var pass2 = validControls(textareas);
    if (pass1 && pass2) {
        return true;
    }
    else {
        return false;
    }

}
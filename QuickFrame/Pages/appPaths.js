var winHeight = 500;
var winWidth = 500;
var set = "zh-CN";
var ApplicationId = null;

$(function () {
    ApplicationId = getQueryString("appId");//'F8D681BC-A289-43A8-AC06-0E538EB0A92E';//
    winHeight = $(window.parent.document).height();
    winWidth = $(window.parent.document).width();
    registerEvent();
    runderGrid();
});

function registerEvent() {
    $("#btnPathAdd").click(function () {
        saveItems();
        runderGrid();            
    });
}

function saveItems() {
    var pathName = $("#pathName").val();
    var Description = $("#Description").val();
    var path = $("#path").val();
    if (pathName == '') {
        alert('菜单名称不能为空!');
        $("#pathName").focus();
        return false
    }
    if (path.indexOf('#') != 0) {
        path = path.split('#')[0];
    }
    var xml = '<item><pathName>' + pathName + '</pathName><Description>' + Description + '</Description><path>' + path + '</path></item>'
    xml = encodeURIComponent(xml);
    RoleOperate.savePath(xml, ApplicationId, callback);
    function callback(r) {
        if (r == '1') {
            alert("已添加过此菜单！");
        }
        else if (r == '2') {
            runderGrid();                
            $("#pathName,#path,#Description").val('');
            alertMsg("添加成功！");
        }
    }
}

function runderGrid()
{
    var html = '';
    RoleOperate.getPath(ApplicationId, function (data) {
        console.log(data)
        $.each(data, function (i, d) {
            html += '<tr><td>' + d.PathName + '</td><td>' + d.Description + '</td><td><a href="' + d.Path + '">' + d.Path + '</a></td><td><button class="btn btn-delete btn-danger" id="' + d.PathId + '" onclick="deletePath(this)"  type="button">删除</button></td></tr>';
        });
        $('#list').html(html);
    });
}

function toPage(obj){
    var Path = $(obj).attr('id');
    window.open(Path);
}

function deletePath(obj) {
    var PathId = $(obj).attr('id');
    if (confirm("确定删除这个菜单？")) {
        RoleOperate.deletePathById(PathId, function (r) {
            if (r == '0') {
                //alertMsg('删除成功');
                runderGrid();
            } else {
                alertMsg('Error:' + r);
            }
        });
    }
}







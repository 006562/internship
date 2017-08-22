 
$(function () {

    $(document).keydown(function(event){ 
        if(event.keyCode == 13){ //绑定回车 
            $("#login").click(); 
        } 
    }); 
    $("#login").click(function () {
        var UserName = $("#username").val();
        var Password = $.md5($("#password").val());
        RoleOperate.isExistUsername(UserName, function (r) {
            if (r == '0') {
                $('.alert-msg').show().text("用户名不存在");
            }
            else if (r == '-1') {
                $('.alert-msg').show().text("用户名被禁用");
            }
            else {
                RoleOperate.isExistPassword(UserName, Password, function (r) {
                    if (r == '1') {
                        RoleOperate.cookieNameCreate(UserName);
                        RoleOperate.updateLastLoginDate(UserName);
                        window.location.href = 'index.html#/post-1-1';
                    } else {
                        $('.alert-msg').show().text("密码错误");
                    }
                });
            }
        });
    });
    $('.form').keydown(function (event) {
        if (event.keyCode == 13) {
            $("#login").click();
        }
    })
})

 

function closeWindow() {
    $('#modal-close').trigger('click');
}
var HaveDoneAction = false;
$(function () {
    var set = getQueryString("set");
    var userId = getQueryString("UserId");
    setDatePlugins();
    var questionId=1;  
    var password;
   
    RoleOperate.getUserDetailById(userId, callback)
    function callback(d) {
        $.each(d, function (index, item) {
            // $('#password').val(item.Password);
            password = item.Password;
            $('#userName').val(item.UserName);
            var lastActiveDate = getStringDate(item.LastActiveDate).dateFormat("yyyy-MM-dd");
            $('#lastActiveDate').val(lastActiveDate);
            var isAnonymous = item.IsAnonymous;
            if (isAnonymous == true) {
                $("#isAnonymousYes").attr("checked", "checked");
            }
            else { $("#isAnonymousNo").attr("checked", "checked") }
            $('#email').val(item.Email);
            // $('#passwordQuestion').val(item.PasswordQuestion);
            questionId = item.QuestionId;
            bindQuestionDropDown(questionId);
            $('#passwordAnswer').val(item.PasswordAnswer);
            var isApproved = item.IsApproved;
            if (isApproved == true) {
                $("#isApprovedYes").attr("checked", "checked");
            }
            else { $("#isApprovedNo").attr("checked", "checked") }
            var isLockedOut = item.IsLockedOut;
            if (isLockedOut == true) {
                $("#isLockedOutYes").attr("checked", "checked");
            }
            else { $("#isLockedOutNo").attr("checked", "checked") }
           
            var createDate ;
            var lastLoginDate ;
            var lastPasswordChangedDate ;
            var lastLockoutDate ;
            if (item.CreateDate == null) { createDate = '' }
            else { createDate = getStringDate(item.CreateDate).dateFormat("yyyy-MM-dd"); }
            if (item.LastLoginDate == null) { lastLoginDate = '' }
            else { lastLoginDate = getStringDate(item.LastLoginDate).dateFormat("yyyy-MM-dd"); }
            if (item.LastPasswordChangedDate == null) { lastPasswordChangedDate = '' }
            else { lastPasswordChangedDate = getStringDate(item.LastPasswordChangedDate).dateFormat("yyyy-MM-dd"); }
            if (item.LastLockoutDate == null) { lastLockoutDate = '' }
            else { lastLockoutDate = getStringDate(item.LastLockoutDate).dateFormat("yyyy-MM-dd"); }
            $('#createDate').val(createDate);
            $('#lastLoginDate').val(lastLoginDate);
            $('#lastPasswordChangedDate').val(lastPasswordChangedDate);
            $('#lastLockoutDate').val(lastLockoutDate);
            $('#comment').val(item.Comment);
        });
    }
    
    $('#btnSave').click(function () {
        var pass = validation2();
        if (!pass) {
            return;
        }
        var newPassword = $("#password").val();
        if (newPassword == "") {
            newPassword = password;
        }
        else {
            newPassword = $.md5($("#password").val());
        }
        var userName = $("#userName").val();
        var loweredUserName = userName.toLocaleLowerCase();
        var lastActiveDate = $("#lastActiveDate").val();
        var isAnonymous = getRadioValue("isAnonymous");
        var email = $("#email").val();
        var loweredEmail = email.toLocaleLowerCase();
        var options = $("#passwordQuestion option:selected");
        var passwordQuestion = options.text();
        var questionId = options.val();
        var passwordAnswer = $("#passwordAnswer").val();
        var isApproved = getRadioValue("isApproved");
        var isLockedOut = getRadioValue("isLockedOut");
        var createDate = $("#createDate").val();
        var lastLoginDate = $("#lastLoginDate").val();
        var lastPasswordChangedDate = $("#lastPasswordChangedDate").val();
        var lastLockoutDate = $("#lastLockoutDate").val();
        var comment = $("#comment").val();
        var xml = '<item>';
        xml += '<UserName>' + userName + '</UserName><UserId>'+userId+'</UserId><LoweredUserName>' + loweredUserName + '</LoweredUserName><IsAnonymous>' + isAnonymous + '</IsAnonymous>';
        xml += '<LastActiveDate>' + lastActiveDate + '</LastActiveDate><Password>' + newPassword + '</Password><Email>' + email + '</Email>';
        xml += '<LoweredEmail>' + loweredEmail + '</LoweredEmail><PasswordQuestion>' + passwordQuestion + '</PasswordQuestion><PasswordAnswer>' + passwordAnswer + '</PasswordAnswer><QuestionId>' + questionId + '</QuestionId>';
        xml += '<IsApproved>' + isApproved + '</IsApproved><IsLockedOut>' + isLockedOut + '</IsLockedOut><CreateDate>' + createDate + '</CreateDate><LastLoginDate>' + lastLoginDate + '</LastLoginDate>';
        xml += '<LastPasswordChangedDate>' + lastPasswordChangedDate + '</LastPasswordChangedDate><LastLockoutDate>' + lastLockoutDate + '</LastLockoutDate><Comment>' + comment + '</Comment></item>';
        var exml = encodeURIComponent(xml);
        RoleOperate.addUser(exml, callback)
        function callback(r) {
            if (r==1) {
                alertMsg('Update Successful!');
                window.parent.refreshGrid();
                //setTimeout(function () { parent.closeWindow(); }, 1000);
            }
            else { alertMsg('Failed：' + r, 'icon-warning'); }
        }
    });
    
});
function bindQuestionDropDown(questionId,callback) {
    RoleOperate.getQuestion(function (d) { 
        $("#passwordQuestion").find('option').remove();
        $.each(d, function (index, item) {
            var option = '<option value=' + item.QuestionId + ' >' + item.Question + '</option>';
            if (item.QuestionId == questionId) {
                option = '<option value=' + item.QuestionId + ' " selected = "selected">' + item.Question + '</option>';
            }
            $("#passwordQuestion").append(option);
        });
        if (callback) {
            callback();
        }
    });
}
function setDatePlugins() {
    $("#ItemDiv").find('.date-plugins').date_input();
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
function validation2() {
    var pass = true;
    var detail = $("#ItemDiv").find("input");
    pass = validControls2(detail);
    return pass;
}
var HaveDoneAction = false;
$(function () {
    setDatePlugins();
    bindQuestionDropDown();
    var myDate = new Date(); 
    var currentDate = myDate.dateFormat("yyyy-MM-dd");
    $("#createDate").val(currentDate);
    $('#btnSave').click(function () {
        var pass = validation();
        if (!pass)
        {
            return;
        }
        var userName = $("#userName").val();
        var propertyNames = "FirstName;LastName;Age";      
        var firstName = $("#firstName").val();
        var lastName = $("#lastName").val();
        var age = $("#age").val();
        var propertyValues = firstName + ';' + lastName + ';' + age ;
        var loweredUserName = userName.toLocaleLowerCase();
        var isAnonymous = getRadioValue("isAnonymous");
        var lastActiveDate = $("#lastActiveDate").val();
        var password = $.md5($("#password").val());
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
        var lastLockoutDate = $("#lastLockoutDate").val();
        var lastPasswordChangedDate = $("#lastPasswordChangedDate").val();
        var comment = $("#comment").val();
        var xml = '<item>';
        xml += '<UserName>' + userName + '</UserName><PropertyNames>' + propertyNames + '</PropertyNames><PropertyValues>' + propertyValues + '</PropertyValues><LoweredUserName>' + loweredUserName + '</LoweredUserName>';
        xml += '<IsAnonymous>' + isAnonymous + '</IsAnonymous><LastActiveDate>' + lastActiveDate + '</LastActiveDate><Password>' + password + '</Password><Email>' + email + '</Email>';
        xml += '<LoweredEmail>' + loweredEmail + '</LoweredEmail><PasswordQuestion>' + passwordQuestion + '</PasswordQuestion><PasswordAnswer>' + passwordAnswer + '</PasswordAnswer><QuestionId>'+questionId+'</QuestionId>';
        xml += '<IsApproved>' + isApproved + '</IsApproved><IsLockedOut>' + isLockedOut + '</IsLockedOut><CreateDate>' + createDate + '</CreateDate><LastLoginDate>' + lastLoginDate + '</LastLoginDate>';
        xml += '<LastPasswordChangedDate>' + lastPasswordChangedDate + '</LastPasswordChangedDate><LastLockoutDate>' + lastLockoutDate + '</LastLockoutDate><Comment>' + comment + '</Comment></item>';
        var exml = encodeURIComponent(xml);
        RoleOperate.addUser(exml, callback)
        function callback(r) {
            if (r==2) {
                alert('更新成功！');
                window.parent.refreshGrid();
                //setTimeout(function () { parent.closeWindow(); }, 1000);
            }
            else { alertMsg('Failed：' + r, 'icon-warning'); }
        }
    });
});
function bindQuestionDropDown(callback) {
    RoleOperate.getQuestion(function (d) {
        $("#passwordQuestion").find('option').remove();
        $.each(d, function (index, item) {
            var option = '<option value=' + item.QuestionId + ' >' + item.Question + '</option>';
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

function validation() {
    var pass = true;
    var detail = $("#ItemDiv").find("input");
    pass = validControls(detail);
    return pass;
}
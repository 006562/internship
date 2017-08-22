$(function () {
    var set = getQueryString("set");
    var userId = getQueryString("UserId");
    setDatePlugins();
    RoleOperate.getProfileById(userId, callback)
    function callback(d) {
        $.each(d, function (index, item) {
            var strs = new Array(); 
            strs = item.PropertyValues.split(";"); //字符分割 
            $('#firstName').val(strs[0]);
            $('#lastName').val(strs[1]);
            $('#age').val(strs[2]);
            var lastUpdatedDate;
            if (item.LastUpdatedDate == null) { lastUpdatedDate = '' }
            else { lastUpdatedDate = getStringDate(item.LastUpdatedDate).dateFormat("yyyy-MM-dd"); }  
            $('#lastUpdatedDate').val(lastUpdatedDate);
        });
    }
    $('#btnSave').click(function () {
        var firstName = $("#firstName").val();
        var lastName = $("#lastName").val();
        var age = $("#age").val();
        var lastUpdatedDate = $("#lastUpdatedDate").val();
        var propertyNames = "FirstName;LastName;Age";
        var propertyValues = firstName + ';' + lastName + ';' + age;
        var xml = '<item>';
        xml += '<UserId>' + userId + '</UserId><PropertyNames>' + propertyNames + '</PropertyNames><PropertyValues>' + propertyValues + '</PropertyValues><LastUpdatedDate>' + lastUpdatedDate + '</LastUpdatedDate></item>';
        var exml = encodeURIComponent(xml);
        RoleOperate.updateProfile(exml, callback)
        function callback(r) {
            if (r==1) {
                alert('更新成功！');
                window.parent.popup.closePopup();
                //setTimeout(function () { parent.closeWindow(); }, 1000);
            }
            else { alertMsg('Failed：' + r, 'icon-warning'); }
        }
    });
});
function setDatePlugins() {
    $("#ItemDiv").find('.date-plugins').date_input();
}
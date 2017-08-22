var DataOperate = {

    wizardService: 'https://poolcutwcf/QuickWizardService/WizardService.svc/',

    /*根据ItemId，获取Item多语言*/
    getItemAliasById: function (itemId, callback) {
        var item = null;
        var sContent = "{'SPName':'usp_GetItemAliasById','Params':{" +
                 "'ItemId':'" + itemId + "'" +
                 "}}";
        var serviceUrl = DataOperate.wizardService + "GetWizardData?appDomain=QuickWizard&json=" + sContent;
        $.ajax({
            url: serviceUrl,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "jsonp",
            //async: (false),
            beforeSend: function () {

            },
            success: function (data) {
                var items = jQuery.parseJSON(data);
                callback(items);
            },
            error: function (error) {
                alert("error:" + error);
            }
        });
        return item;
    },

    /*单条数据的创建，更新，删除，数据格式如下*/
    /*{AppDomain:xxx,SPName:xxxx,Params:{A:xx,B:xx,C:xx}}*/
    singleDataCUD: function (json, callback) {
        json = "<SessionContext>{0}</SessionContext>".format(json);
        var serviceUrl = DataOperate.wizardService + "SingleDataCUD";
        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: json,
            beforeSend: function () {
                //$('#loading').fadeIn();

            },
            success: function (response) {
                //$('#loading').fadeOut();
                callback(response);
            },
            error: function (response) {
                alert("error is :" + response);
            }
        });
    },
}
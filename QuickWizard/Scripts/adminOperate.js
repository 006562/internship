function siteApp() {
    var curWwwPath = window.document.location.href;
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    var siteApp = pathName.substring(1, pathName.substr(1).indexOf('/') + 1);
    return siteApp;
}
var AdminOperate = {
    schema: '',
    dbName: '',
    siteAppUrl: location.protocol + "//" + location.host + '/' + siteApp(),
    wizardService: location.protocol + "//" + location.host + '/' + siteApp() + '/WizardService.svc/',

    deletePageById: function (pageId, callback) {
        var json = "{'DBName':'" + AdminOperate.dbName + "','Schema':'" + AdminOperate.schema + "','SPName':'usp_Admin_DeletePageById','Params':{'PageId':'" + pageId + "'}}";
        json = "<SessionContext>{0}</SessionContext>".format(json);
        var serviceUrl = AdminOperate.wizardService + "DataCUD";
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
                if (callback) {
                    callback(response)
                };
            },
            error: function (response) {
                alert("error is :" + response);
            }
        });
    },
    deletePageItem: function (pageId,itemId, callback) {
        var json = "{'DBName':'" + AdminOperate.dbName + "','Schema':'" + AdminOperate.schema + "','SPName':'usp_Admin_DeletePageItem','Params':{" +
          "'PageId':'" + pageId + "'," +
          "'ItemId':'" + itemId + "'" +
          "}}";
        json = "<SessionContext>{0}</SessionContext>".format(json);
        var serviceUrl = AdminOperate.wizardService + "DataCUD";
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
    getPageDetailById: function (pageId, callback) {
        var sContent = "{'SPName':'usp_Admin_GetPageDetailById','Params':{'PageId':'" + pageId + "'}}";
        var serviceUrl = AdminOperate.wizardService + "DataRead?dbName=" + AdminOperate.dbName + "&schema=" + AdminOperate.schema + "&json=" + sContent;
        $.ajax({
            url: serviceUrl,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "jsonp",
            crossDomain: true,
            success: function (data) {
                var json = jQuery.parseJSON(data);
                callback(json);
            },
            error: function (error) {
                alert("error:" + error);
            }
        });
    },
    savePageById: function (xml, flag, callback) {
        var json = "{'DBName':'" + AdminOperate.dbName + "','Schema':'" + AdminOperate.schema + "','SPName':'usp_Admin_SavePageById','Params':{'Items':'" + xml + "','Flag':'" + flag + "'}}";
        json = "<SessionContext>{0}</SessionContext>".format(json);
        var serviceUrl = AdminOperate.wizardService + "DataCUD";
        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: json,
            beforeSend: function () {
            },
            success: function (result) {
                callback(result);
            },
            error: function (response) {
                alert("error is :" + response);
            }
        });
    },
    addPageItem: function (xml, callback) {
        var json = "{'DBName':'" + AdminOperate.dbName + "','Schema':'" + AdminOperate.schema + "','SPName':'usp_Admin_AddPageItem','Params':{'Items':'" + xml + "'}}";
        json = "<SessionContext>{0}</SessionContext>".format(json);
        var serviceUrl = AdminOperate.wizardService + "DataCUD";
        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: json,
            beforeSend: function () {
            },
            success: function (result) {
                callback(result);
            },
            error: function (response) {
                alert("error is :" + response);
            }
        });
    },
    getItemsByPageId: function (pageId, callback) {
        var sContent = "{'SPName':'usp_Admin_GetItemsByPageId','Params':{" +
                      "'PageId':'" + pageId + "'" +
                      "}}";
        var serviceUrl = AdminOperate.wizardService + "DataRead?dbName=" + AdminOperate.dbName + "&schema=" + AdminOperate.schema + "&json=" + sContent;
        $.ajax({
            url: serviceUrl,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "jsonp",
            crossDomain: true,
            //async: (false),
            beforeSend: function () {
                //$('#loading').fadeIn();
            },
            success: function (data) {
                // $('#loading').fadeOut();
                var json = jQuery.parseJSON(data);
                callback(json);
            },
            error: function (error) {
                alert("error:" + error);
            }
        });
    },
    UpdateItemCategory: function (xml,callback) {
        var json = "{'DBName':'" + AdminOperate.dbName + "','Schema':'" + AdminOperate.schema + "','SPName':'usp_Admin_UpdateItemCategory','Params':{'item':'" + xml + "'}}";
        json = "<SessionContext>{0}</SessionContext>".format(json);
        var serviceUrl = AdminOperate.wizardService + "DataCUD";
        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: json,
            success: function (r) {
                if (callback) {
                    callback(r)
                };
            },
            error: function (response) {
                alert("error is :" + response);
            }
        });
    },

    DeleteItemCategory: function (cid,callback) {
        var json = "{'DBName':'" + AdminOperate.dbName + "','Schema':'" + AdminOperate.schema + "','SPName':'usp_Admin_DeleteItemCategory','Params':{'CategoryId':'" + cid + "'}}";
        json = "<SessionContext>{0}</SessionContext>".format(json);
        var serviceUrl = AdminOperate.wizardService + "DataCUD";
        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: json,
            success: function (r) {
                if (callback) {
                    callback(r)
                };
            },
            error: function (response) {
                alert("error is :" + response);
            }
        });
    },

    GetItemCategoryById: function (cid,callback) {
        var sContent = "{'SPName':'usp_Admin_GetItemCategoryById','Params':{'cid':'" + cid + "'}}";
        var serviceUrl = AdminOperate.wizardService + "DataRead?dbName=" + AdminOperate.dbName + "&schema=" + AdminOperate.schema + "&json=" + sContent;
        $.ajax({
            url: serviceUrl,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "jsonp",
            crossDomain: true,
            success: function (data) {
                var pages = jQuery.parseJSON(data);
                callback(pages);
            },
            error: function (error) {
                alert("error:" + error);
            }
        });
    },

    GetAllItemCategory: function (callback) {
        var sContent = "{'SPName':'usp_Admin_GetAllItemCategory','Params':{}}";
        var serviceUrl = AdminOperate.wizardService + "DataRead?dbName=" + AdminOperate.dbName + "&schema=" + AdminOperate.schema + "&json=" + sContent;
        $.ajax({
            url: serviceUrl,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "jsonp",
            crossDomain: true,
            success: function (data) {
                var pages = jQuery.parseJSON(data);
                callback(pages);
            },
            error: function (error) {
                alert("error:" + error);
            }
        });
    },

    UpdateItemAlias: function (xml,callback) {
        var json = "{'DBName':'" + AdminOperate.dbName + "','Schema':'" + AdminOperate.schema + "','SPName':'usp_Admin_UpdateItemAlias','Params':{'item':'" + xml + "'}}";
        json = "<SessionContext>{0}</SessionContext>".format(json);
        var serviceUrl = AdminOperate.wizardService + "DataCUD";
        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: json,
            success: function (r) {
                if (callback) {
                    callback(r)
                };
            },
            error: function (response) {
                alert("error is :" + response);
            }
        });
    },

    DeleteItem: function (iaid,callback) {
        var json = "{'DBName':'" + AdminOperate.dbName + "','Schema':'" + AdminOperate.schema + "','SPName':'usp_Admin_DeleteItem','Params':{'ItemAliasId':'" + iaid + "'}}";
        json = "<SessionContext>{0}</SessionContext>".format(json);
        var serviceUrl = AdminOperate.wizardService + "DataCUD";
        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: json,
            success: function (r) {
                if (callback) {
                    callback(r)
                };
            },
            error: function (response) {
                alert("error is :" + response);
            }
        });
    },

    GetItemByAid: function (iaid, callback) {
        var sContent = "{'SPName':'usp_Admin_GetItemByAid','Params':{'ItemAliasId':'" + iaid + "'}}";
        var serviceUrl = AdminOperate.wizardService + "DataRead?dbName=" + AdminOperate.dbName + "&schema=" + AdminOperate.schema + "&json=" + sContent;
        $.ajax({
            url: serviceUrl,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "jsonp",
            crossDomain: true,
            success: function (data) {
                var pages = jQuery.parseJSON(data);
                callback(pages);
            },
            error: function (error) {
                alert("error:" + error);
            }
        });
    },

    IsExistCategoryId: function (cid,callback) {
        var json = "{'DBName':'" + AdminOperate.dbName + "','Schema':'" + AdminOperate.schema + "','SPName':'usp_Admin_IsExistCategoryId','Params':{'CategoryId':'" + cid + "'}}";
        json = "<SessionContext>{0}</SessionContext>".format(json);
        var serviceUrl = AdminOperate.wizardService + "DataCUD";
        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: json,
            success: function (r) {
                if (callback) {
                    callback(r)
                };
            },
            error: function (response) {
                alert("error is :" + response);
            }
        });
    },
    IsExistItemId: function (tid, callback) {
        var json = "{'DBName':'" + AdminOperate.dbName + "','Schema':'" + AdminOperate.schema + "','SPName':'usp_Admin_IsExistItemId','Params':{'ItemId':'" + tid + "'}}";
        json = "<SessionContext>{0}</SessionContext>".format(json);
        var serviceUrl = AdminOperate.wizardService + "DataCUD";
        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: json,
            success: function (r) {
                if (callback) {
                    callback(r)
                };
            },
            error: function (response) {
                alert("error is :" + response);
            }
        });
    },

    GetItemSelect: function (pageid,callback) {
        var sContent = "{'SPName':'usp_Admin_GetItemSelect','Params':{'PageId':'" + pageid + "'}}";
        var serviceUrl = AdminOperate.wizardService + "DataRead?dbName=" + AdminOperate.dbName + "&schema=" + AdminOperate.schema + "&json=" + sContent;
        $.ajax({
            url: serviceUrl,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "jsonp",
            crossDomain: true,
            success: function (data) {
                var pages = jQuery.parseJSON(data);
                callback(pages);
            },
            error: function (error) {
                alert("error:" + error);
            }
        });
    }
}
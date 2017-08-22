(function () {

    var DataProcessServiceUrl = GlobalVariable.SslHost + 'TrustManagementService/DataProcessService.svc/jsAccessEP/';
    var svcUrl = DataProcessServiceUrl;

    var userName = '';

    RoleOperate.getAllUsers(function (res) {
        var $userSelect = $('#UserSelect');
        var option = '<option>--</option>';
        $.each(res, function (i,d) {
            option += '<option value="' + d.UserName + '">' + d.UserName + '</option>';
        });
        $userSelect.html(option);
        $userSelect.change(function (e) {
            userName = $(this).val();
            $('.checkbox').prop("checked", false);
            ExecuteGetData(false, svcUrl + "CommonExecuteGet?", 'dbo', {
                SPName: 'usp_GetUserOperations', SQLParams: [
                    { name: 'AuditorUserName', value: userName, DBType: 'string' }
                ]
            }, function (res) {
                $.each(res, function (i, v) {
                    var id = (v.ObjectType + '-' + v.ObjectId).toLocaleLowerCase();
                    $('#' + id).prop("checked", true);
                })
            });
        });
    });
    
    var operation = ExecuteGetData(false, svcUrl + "CommonExecuteGet?", 'dbo', { SPName: 'usp_GetAllOperation' });

    var AssetPoolHtml = '', TrustListHtml = '';

    $.each(operation, function (i, d) {
        if (d.ObjectType == 'Pool') {
            AssetPoolHtml += '<div class="check-box">'+
                                '<input class="checkbox" id="pool-' + d.ObjectId + '" type="checkbox" value="Pool-' + d.ObjectId + '" data-username="' + d.UserName + '"/>' +
                                '<label for="pool-' + d.ObjectId + '"> '+ d.TrustName + '</label>' +
                                '<div class="checkbox-inner">创建人: ' + d.UserName + '&nbsp;资产池标识: ' + d.ObjectId + '</div>' +
                             '</div>';
        } else if (d.ObjectType == 'Trust') {
            TrustListHtml += '<div class="check-box">' +
                                '<input class="checkbox" id="trust-' + d.ObjectId + '" type="checkbox" value="Trust-' + d.ObjectId + '" data-username="' + d.UserName + '"/>' +
                                '<label for="trust-' + d.ObjectId + '">' + d.TrustName + '</label>' +
                                '<div class="checkbox-inner">创建人: ' + d.UserName + '&nbsp;产品代码: '+d.TrustCode+'</div>' +
                             '</div>';
        }
    });

    $('#AssetPool').html(AssetPoolHtml);
    $('#TrustList').html(TrustListHtml);

    $('.checkbox').click(function (e) {
        var $this = $(this); CreatorName = $this.data('username');
        if (CreatorName.toLocaleLowerCase() === userName.toLocaleLowerCase()) {
            alert('不能选择创建人自己的项目为审批人!');
            e.preventDefault();
        }
    })

    $('#saveOperation').click(function () {
        if (!userName) {
            alert('请选择审批人');
            return false;
        }
        var items = '<items>{0}</items>',
            itemTemplate = '<item><objectType>{0}</objectType><objectId>{1}</objectId></item>',
            item = '';
        $('.checkbox:checked').each(function () {
            (function (v) {
                if (v.indexOf('-') != 0) {
                    var obj = v.split("-");
                    item += itemTemplate.format(obj[0], obj[1]);
                }
            })($(this).val());
        });
        items = items.format(item);
        ExecutePostData(true, svcUrl + "CommonExecutePost?", 'dbo', {
            SPName: 'usp_SaveUserOperation', SQLParams: [
                { name: 'userName', value: userName, DBType: 'string' },
                { name: 'items', value: items, DBType: 'xml' }
            ]
        });
        alert('保存成功!');
    })
})();
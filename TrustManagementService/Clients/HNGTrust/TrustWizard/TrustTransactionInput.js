var trustId_ = getQueryString('tid');

var TrustTransactionInput = (function () {
    var svcUrl = GlobalVariable.DataProcessServiceUrl + "CommonExecuteGet?";

    var dataModel = {
        DataList: []
        , UnDataList: []
    };
    var viewModel = {};
    function init() {
        initDatePlugins();
        if (trustId_ != 0) {
            initMetaData();
            initData();
            $('#TrustTransactionInputDiv .form-control').change(function () {
                Validation.ValidControlValue($(this));
            });
        }
    }
    function initDatePlugins() {
        $("#TrustTransactionInputDiv").find('.date-plugins').date_input();
    }
    function initMetaData() {
        var list = getFilterMetaData();
        if (list) {
            var html = '';//'<option value="all">所有</option>';
            //sortData(list, 'OptionValue');
            $.each(list, function (i, item) {
                html += '<option value="' + item.OptionValue + '">' + item.OptionText + '</option>';
            });
            $('#TransactionDate').html(html);
        }
    }
    function sortData(datalist, column) {
        datalist = datalist.sort(function (b, a) {
            return a[column] - b[column];
        });
    }
    function getFilterMetaData() {
        var executeParam = {
            SPName: 'usp_GetTrustTransactionInputFilterMetaData', SQLParams: [
                { Name: 'TrustId', value: trustId_, DBType: 'string' }
            ]
        };
        return executeRemoteData(executeParam);
    }
    function initData() {
        var listData = getSourceData();
        dataModel.DataList = [];
        dataModel.UnDataList = [];

        if (listData && listData.length > 0)
            $("#InputSource").val(listData[0].InputSource);
        if ($("#InputSource").val().length <= 0)
            // 将“招商证券”修改为空格
            $("#InputSource").val(" ");

        var listNode = document.getElementById('TrustTransactionInputDiv');
        for (var i = 0; i < listData.length; i++) {
            //数据源处理...
            if (listData[i].IsCompulsory || listData[i].IsHaveData)
                dataModel.DataList.push(listData[i]);
            else
                dataModel.UnDataList.push(listData[i]);
        }

        ko.unapplyBindings($(listNode), false);
        //ko.unapplyBindings($("TrustTransactionInputTarget,#TrustTransactionInputTarget1"), false);
        //$("#TrustTransactionInputTarget").empty();
        $("#TrustTransactionInputTarget1").html($("#TrustTransactionInputTemplate1").html());
        $("#TrustTransactionInputTarget").html($("#TrustTransactionInputTemplate").html());


        viewModel = ko.mapping.fromJS(dataModel);
        ko.applyBindings(viewModel, listNode);
        initDatePlugins();
    }
    ko.unapplyBindings = function ($node, remove) {
        // unbind events
        $node.find("*").each(function () {
            $(this).unbind();
        });
        // Remove KO subscriptions and references
        if (remove) {
            ko.removeNode($node[0]);
        } else {
            ko.cleanNode($node[0]);
        }
    };
    function getSourceData() {
        var executeParam = {
            SPName: 'usp_GetTrustTransactionInput', SQLParams: [
                { Name: 'TrustId', value: trustId_, DBType: 'int' },
                { Name: 'TransactionDate', value: $("#TransactionDate").val(), DBType: 'string' },
            ]
        };
        return executeRemoteData(executeParam);
    }
    function executeRemoteData(executeParam) {
        var executeParams = encodeURIComponent(JSON.stringify(executeParam));
        var sourceData = [];

        $.ajax({
            cache: false,
            type: "GET",
            async: false,
            url: svcUrl + 'appDomain=TrustManagement&executeParams=' + executeParams + '&resultType=commom',
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: {},
            success: function (response) {
                if (typeof response === 'string') { sourceData = JSON.parse(response); }
                else { sourceData = response; }
            },
            error: function (response) { alert('Error occursed while requiring the remote source data!'); }
        });
        return sourceData;
    }
    function saveTransactionInputClick() {
        var haveError = false;
        $('#TrustTransactionInputDiv .form-control').each(function () {
            var $this = $(this);
            if (!Validation.ValidControlValue($this)) { haveError = true; }
        });
        if (haveError) return;

        var transactionDate = $("#TransactionDate").val();
        var inputSource = $("#InputSource").val();
        dataModel = ko.mapping.toJS(viewModel);
        var items = '<items>';
        var regexp = /,/g;
        $.each(dataModel.DataList, function (i, v) {
            items += '<item>';
            items += '<Code>' + v.Code + '</Code>';
            items += '<Name>' + v.Name + '</Name>';
            items += '<Amount>' + v.Amount.toString().replace(regexp, '') + '</Amount>';
            items += '<ToPaid>' + (v.ToPaid ? v.ToPaid : false) + '</ToPaid>';
            items += '</item>';
        });
        items += '</items>';
        console.log(items);
        var executeParam = {
            SPName: 'usp_UpdateTrustTransactionInput', SQLParams: [
                { Name: 'trustId', value: trustId_, DBType: 'string' },
                { Name: 'transactionDate', value: transactionDate, DBType: 'string' },
                { Name: 'inputSource', value: inputSource, DBType: 'string' },
                { Name: 'items', value: items, DBType: 'xml' }
            ]
        };
        var result = executeRemoteData(executeParam);
        if (result[0].Result) {
            alert('保存成功！');
        } else {
            alert('数据提交保存时出现错误！');
        }
    }
    function addTransaction(obj) {
        var pDom = $(obj).parent().prev().find("option:checked");
        if (pDom.length <= 0) return;
        var pIndex = pDom.attr("dataIndex");
        var item = viewModel.UnDataList()[pIndex];
        item.IsHaveData(true);
        viewModel.DataList.push(item);
        viewModel.UnDataList.remove(item);
    }
    function removeTransaction(obj) {
        var pIndex = $(obj).parent().parent().parent().attr("dataIndex");
        var item = viewModel.DataList()[pIndex];
        item.IsHaveData(false);
        viewModel.UnDataList.push(item);
        viewModel.DataList.remove(item);
    }

    function syfpjs(){
        showDialogPage(GlobalVariable.TrustManagementServiceHostURL + 'Clients/HNGTrust/TrustWizard/TrustCollectionPicker.html?TrustId=' + trustId_ + '&TrustCode=' + trustCode + '&taskCode=TrustWaterfall&IsDlg=1&random=' + Math.random(), '交易现金流', 600, 300);
        //GSDialog.Open('交易现金流', GlobalVariable.TrustManagementServiceHostURL + 'Clients/HNGTrust/TrustWizard/TrustCollectionPicker.html?TrustId=' + trustId_ + '&taskCode=TrustWaterfall&IsDlg=1&random=' + Math.random(), { a: 1, b: 2 }, function (res) {
        //    //alert(res);
        //}, 768, 300);
    }

    return {
        Init: init,
        InitData: initData,
        RemoveTransaction: removeTransaction,
        AddTransaction: addTransaction,
        SaveTransactionInputClick: saveTransactionInputClick,
        Syfpjs:syfpjs
    }
})();
var Validation = (function () {
    var TrustMngmtRegxCollection = {
        int: /^([-]?[1-9]+\d*$|^0)?$/,
        //decimal: /^([-]?[1-9]+\d*(\.{1}\d+){0,1}$|^[-]{1}0\.\d*[1-9]\d*$|^0(\.\d+)?)?$/,
        decimal: /^[-]?(\d){1,3}((,\d{3})*|(\d)*)(\.\d+)?$/,
        date: /^((\d{4})-(\d{2})-(\d{2}))?$/,
        datetime: /^((\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2}))?$/
    };
    function validControlValue(obj) {
        var $this = $(obj);
        var objValue = $this.val();
        var valids = $this.attr('data-valid');

        //无data-valid属性，不需要验证
        if (!valids || valids.length < 1) { return true; }

        //如果有必填要求，必填验证
        if (valids.indexOf('required') >= 0) {
            if (!objValue || objValue.length < 1) {
                $this.addClass('red-border');
                return false;
            } else {
                $this.removeClass('red-border');
            }
        }
        //暂时只考虑data-valid只包含两个值： 必填和类型
        var dataType = valids.replace('required', '').toLocaleLowerCase().trim();

        //通过必填验证，做数据类型验证
        var regx = TrustMngmtRegxCollection[dataType];
        if (!regx) { return true; }

        if (!regx.test(objValue)) {
            $this.addClass('red-border');  
            return false;
        } else {
            $this.removeClass('red-border');
        }
        return true;
    }
    return { ValidControlValue: validControlValue }
})();
$(function () {
    TrustTransactionInput.Init();
});
//@ sourceURL=viewTrustWizard.js
//add above line to enable chrome debugging
Number.prototype.formatMoney = function(decPlaces, thouSeparator, decSeparator) {
    var n = this,
        decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
        decSeparator = decSeparator == undefined ? "." : decSeparator,
        thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
        sign = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
};

(function ($) {

    var tmsDataProcessBase = GlobalVariable.DataProcessServiceUrl;
    var tmsSessionServiceBase = GlobalVariable.TrustManagementServiceUrl;
    var arrProvider = null;
    var step = 0,
        trustId = null,
        titleText = ['产品信息','日期信息','分层信息', '附属信息'],
        template = [],
        date = new Date(),
        today = (date.getFullYear()) + '-' + (date.getMonth() + 1) + '-' + date.getDate();



    // 模板
    template[0] = ''+
        '<div class="form-group">'+
            '<label>产品代码</label>'+
            '<input type="text" name="TrustCode" dataget="true" TypeCode="Trust" class="form-control get"/>' +
        '</div>'+
        '<div class="form-group">'+
            '<label>产品名称</label>'+
            '<input type="text" name="TrustName" dataget="true" TypeCode="Trust" class="form-control get" />' +
        '</div>'+
        '<div class="form-group">'+
            '<label>发行机构代码</label>' +
            '<input type="text" name="OrganisationName" dataget="true" TypeCode="Trust" class="form-control get" />' +
        '</div>'+
        '<div class="form-group">'+
            '<label>发行规模(元)</label>'+
            '<input type="text" name="IssueAmount" class="form-control get"/>' +
        '</div>'+
        '<div class="form-group">'+
            '<label>资产池名称</label>'+
            '<input type="text" name="DataLocation" class="form-control get"/>' +
        '</div>'+
        '<div class="form-group" style="display:none">'+
            '<label>初始起算日</label>'+
            '<input type="text" name="SaleDate" dataget="true" TypeCode="Trust" class="form-control date get" value="' + today + '"/>' +
        '</div>'+
        '<div class="form-group" style="display:none">' +
            '<label>信托设立日</label>'+
            '<input type="text" name="SettlementDate" class="form-control date get" value="' + today + '"/>' +
        '</div>'+
        //'<div class="form-group">'+
        //    '<label>法定到期日</label>'+
        //    '<input type="text" name="ClosureDate" dataget="true" TypeCode="Trust" class="form-control date get" value="' + today + '"/>' +
        //'</div>'+
        '<div class="form-group">' +
            '<label>信息披露频率</label>' +
            '<select name="RemittanceFrequency" dropClass="" class="form-control get">' +
                '<option>每月</option>' +
                '<option>每季度</option>' +
            '</select>' +
            //'<label>信息披露频率</label>'+
            //'<input type="text" name="RemittanceFrequency" class="form-control get"/>' +
        '</div>'+
        '<div class="form-group">'+
            '<label>账户管理类型</label>'+
            '<input type="text" class="form-control get"/>'+
        '</div>'+
        '<div class="form-group">'+
            '<label>费用优先支付上线(元)</label>'+
            '<input type="text" class="form-control get"/>'+
        '</div>'+
        '<div class="form-group">'+
            '<label>流动性储备初始余额(元)</label>'+
            '<input type="text" class="form-control get"/>'+
        '</div>'+
        '<div class="form-group">'+
            '<label>再投资收益率(%)</label>'+
            '<input type="text" class="form-control get"/>'+
        '</div>'+
        '<div class="form-group">'+
            '<label>流动性储备账户启用</label>'+
            '<input type="checkbox" name="checkbox1" class="get"/>'+
        '</div>'+
        '<div class="form-group">'+
            '<label>包含已销售资产</label>'+
            '<input type="checkbox" name="IsSoldLoanAvailable" dataget="true" TypeCode="Trust" class="get" checked>' +
        '</div>'+
        '<div class="form-group">'+
            '<label>支持循环结构</label>'+
            '<input type="checkbox" name="IsTopUpAvailable" dataget="true" TypeCode="Trust" class="get" checked>' +
        '</div>';
    template[1] = '' +
        '<div class="form-group">' +
            '<label>封包日（基准日)</label>' +
            '<input type="text" name="PoolCloseDate" dataget="true" TypeCode="Trust" class="form-control date get" value="' + today + '"/>' +
        '</div>' +
        '<div class="form-group">' +
            '<label>专项设立日</label>' +
            '<input type="text" name="TrustStartDate" class="form-control date get" value="' + today + '"/>' +
        '</div>' +
        '<div class="form-group">' +
            '<label>资产收益回收计算日</label>' +
            '<input type="text" name="CollectionDate" dataget="true" TypeCode="Trust" class="form-control date get" value="' + today + '"/> <b>(R)</b> ' +       
        '</div>' +
        '<div class="form-group">' +
            '<label>兑付日</label>' +
            '<input type="text" name="PaymentDate" dataget="true" TypeCode="Trust" class="form-control date get" value="' + today + '"/> <b>(T)</b>' +
        '</div>' +
        '<div class="form-group">'+
            '<label>法定到期日</label>'+
            '<input type="text" name="ClosureDate" dataget="true" TypeCode="Trust" class="form-control date get" value="' + today + '"/>' +
        '</div>' +
        '<hr style="margin:16px 0 16px 0;border:0.5px solid #ddd">' +
        '<div class="form-group" style="display:block;width:60%">' +
            '<label>资产服务机构报告日</label>' +
            '<input type="text" name="AssetProviderReportDate" dataget="" TypeCode="" disabled class="form-control" value="' + today + '"/>' +
            ' <b>  ( 距离 R </b> <input type="text" class="form-control  get" style="width:25px;" name="Days_APR" dataget="true" TypeCode="TrustExt" value="9" /> <b>个工作日 )</b>' +
            '<input type="text" class="form-control get" style="width:25px;display:none" name="Date_APR" dataget="true" TypeCode="TrustExt" value="CollectionDate" />' +
        '</div>'+
            '<div class="form-group" style="display:block;width:60%">' +
            '<label>托管银行报告日</label>' +
            '<input type="text" name="BankTrusteeReportDate" dataget="" TypeCode="" disabled class="form-control" value="' + today + '"/>' +
            ' <b>  ( 距离 R </b> <input type="text" class="form-control  get" style="width:25px;" name="Days_BT" dataget="true" TypeCode="TrustExt" value="10"/> <b>个工作日 )</b>' +
            '<input type="text" class="form-control get" style="width:25px;display:none" name="Date_BT" dataget="true" TypeCode="TrustExt" value="CollectionDate" />' +
        '</div>'+
            '<div class="form-group" style="display:block;width:60%">' +
            '<label>计划管理人报告日</label>' +
            '<input type="text" name="ServicerReportDate" dataget="" TypeCode="" disabled class="form-control" value="' + today + '"/>' +
            ' <b>  ( 距离 T </b> <input type="text" class="form-control  get" style="width:25px;" name="Days_S" dataget="true" TypeCode="TrustExt" value="-5"/> <b>个工作日 )</b>' +
            '<input type="text" class="form-control get" style="width:25px;display:none" name="Date_S" dataget="true" TypeCode="TrustExt" value="PaymentDate" />' +
        '</div>'+
            '<div class="form-group" style="display:block;width:60%">' +
            '<label>计划管理人分配日</label>' +
            '<input type="text" name="ServicerAllocationDate" dataget="" disabled TypeCode="" class="form-control" value="' + today + '"/>' +
            ' <b>  ( 距离 T </b> <input type="text" class="form-control  get" style="width:25px;" name="Days_SA" dataget="true" TypeCode="TrustExt" value="-2" /> <b>个工作日 )</b>' +
            '<input type="text" class="form-control get" style="width:25px;display:none" name="Date_SA" dataget="true" TypeCode="TrustExt" value="PaymentDate" />' +
        '</div>'+
            '<div class="form-group" style="display:block;width:60%">' +
            '<label>托管银行划款日</label>' +
            '<input type="text" name="TrusteePaymentReportDate" dataget="" disabled TypeCode="" class="form-control" value="' + today + '"/>' +
            ' <b>  ( 距离 T </b> <input type="text" class="form-control  get" style="width:25px;" name="Days_TPR" dataget="true" TypeCode="TrustExt" value="-2" /> <b>个工作日 )</b>' +
            '<input type="text" class="form-control get" style="width:25px;display:none" name="Date_TPR" dataget="true" TypeCode="TrustExt" value="PaymentDate" />' +
        '</div>' +
        '</div>' +
        '<div class="form-group" style="display:block;width:60%">' +
            '<label>提醒日</label>' +
            '<input type="text" name="NotificationDate" dataget="" disabled TypeCode="" class="form-control" value="' + today + '"/>' +
            ' <b>  ( 距离 T </b> <input type="text" class="form-control  get" style="width:25px;" name="Days_N" value="-15" /> <b>个工作日 )</b>' +
            '<input type="text" class="form-control get" style="width:25px;display:none" name="Date_N" dataget="true" TypeCode="TrustExt" value="PaymentDate" />' +
        '</div>';
    template[2]=''+
    '<form id="TrustBond" style="margin-top:-15px;">' +
    '<button type="button" id="editPaymentSequence" class="btn btn-primary btn-sm" style="float:right;margin-bottom:4px;">维护分层偿付顺序</button><br/>' +
    '<table class="table">' +
            '<thead>' +
                '<tr>' +
                    '<th>证劵代码</th>' +
                    '<th>证劵简称</th>' +
                    '<th style="display:none">证劵名称</th>' +
                    '<th>证劵评级</th>' +
                    '<th>募集规模</th>' +
                    '<th style="display:none">发行币种</th>' +
                    '<th>发行日期</th>' +
                    '<th>法定到期日</th>' +
                    '<th style="display:none">每份面值</th>' +
                    '<th style="display:none">利率形式</th>' +
                    '<th>预期收益率</th>' +
                    '<th style="display:none">评级机构</th>' +
                    '<th>还本付息方式</th>' +
                    '<th style="display:none">还本计划</th>' +
                    '<th style="display:none">分期单位</th>' +
                    '<th width="30">操作</th>' +
                '</tr>' +
            '</thead>' +
            '<tbody id="result">' +
            '</tbody>' +
        '</table>' +
        '<hr style="margin-bottom:12px;border:1px solid #ddd">' +
        '<button type="button" id="addList" class="btn btn-primary btn-sm" style="float:right"><i class="icon icon-plus"></i><span>添加</span></button>'+
        '<ul class="tabs">'+
            '<li role="presentation" class="active"><a href="#TrustBondAdd">添加分层</a></li>'+
        '</ul>'+
        '<div id="TrustBondAdd" class="tab-body">' +
            '<div class="form-group">' +
                '<label>证劵代码</label>' +
                '<input type="text" name="SecurityExchangeCode" TypeCode="TrustBond" class="form-control get"/>' +
            '</div>' +
            '<div class="form-group">' +
                '<label>证劵简称</label>' +
                '<input type="text" name="ShortName" TypeCode="TrustBondRating" class="form-control get"/>' +
            '</div>' +
            '<div class="form-group">'+
                '<label>证劵名称</label>'+
                '<input type="text" name="ClassName" TypeCode="TrustBond" class="form-control get"/>' +
            '</div>'+
            '<div class="form-group">'+
                '<label>证劵评级</label>' +
                '<input type="text" name="TrustBondRating" TypeCode="TrustBondRating" class="form-control get"/>' +
            '</div>'+
            '<div class="form-group">'+
                '<label>募集规模</label>' +
                '<input type="text" name="OfferAmount" data-money="true" TypeCode="TrustBond" class="form-control get"/>' +
            '</div>'+
            '<div class="form-group">'+
                '<label>发行币种</label>'+
                '<input type="text" name="CurrencyOfIssuance" TypeCode="TrustBond" class="form-control get"/>' +
            '</div>'+
            '<div class="form-group">'+
                '<label>发行日期</label>'+
                '<input type="text" name="IssueDate" class="form-control date get" TypeCode="TrustBond" value="' + today + '"/>' +
            '</div>'+
            '<div class="form-group">'+
                '<label>法定到期日</label>'+
                '<input type="text" name="LegalMaturityDate" class="form-control date get" TypeCode="TrustBond" value="' + today + '"/>' +
            '</div>'+
            '<div class="form-group">'+
                '<label>每份面值</label>'+
                '<input type="text" name="Denomination" TypeCode="TrustBond" class="form-control get" value="100"/>' +
            '</div>'+
            '<div class="form-group">'+
                '<label>利率形式</label>'+
                '<select name="CouponPaymentReference" class="form-control get">' +
                    '<option>固定利率</option>'+
                '</select>'+
            '</div>'+
            '<div class="form-group">'+
                '<label>预期收益率</label>'+
                '<input type="text" name="CouponBasis" TypeCode="TrustBond" class="form-control get"/>' +
            '</div>'+
            '<div class="form-group">'+
                '<label>评级机构</label>'+
                '<select name="ServiceProvider" dropClass="Provider" TypeCode="TrustBondRating" class="form-control get">' +
                '</select>' +
            '</div>'+
            '<div class="form-group">'+
                '<label>还本付息方式</label>'+
                '<select name="PaymentConvention" TypeCode="TrustBond" class="form-control get">' +
                    '<option>一次性还本付息</option>'+
                    '<option>计划还本，按期付息</option>'+
                    '<option>过手型，按期付息</option>' +
                    '<option>按期等额本金</option>' +
                    '<option>按期等额本息</option>' +
                '</select>'+
            '</div>' +
            '<div class="form-group" id="PrincipalPaymentSchedule">' +
                '<label>还本计划</label>' +
                '<textarea rows="3" name="PrincipalPaymentSchedule" TypeCode="TrustBond" title="还本计划格式 2016-01-01:100000000;2016-02-01:150000000;" class="form-control get"/>' +
            '</div>' +
            '<div class="form-group" id="PaymentPeriod">' +
                '<label>分期单位</label>' +
                '<select name="PaymentPeriod" TypeCode="TrustBond" class="form-control get">' +
                    '<option>按月</option>' +
                    '<option>按季</option>' +
                    '<option>按半年</option>' +
                    '<option>按年</option>' +
                '</select>' +
            '</div>' +
        '</div>'+

    '</form>';
    template[3]=''+
    '<div class="form-group" style="width:40%">' +
        '<label>托管人</label>' +
        '<select type="select" name="AccountProvider" dropClass="Provider" class="form-control get" style="width:55%">' +
        '</select>' +
    '</div>'+
    '<div class="form-group" style="width:30%">' +
        '<label>费率</label>'+
        '<input type="text" name="fee_AccountProvider" class="form-control get"/>' +
    '</div>' +
    '<div class="form-group" style="width:30%">' +
        '<label>账户</label>' +
        '<input type="text" name="account_AccountProvider" class="form-control get"/>' +
    '</div>' +
    '<div class="form-group" style="width:40%">' +
        '<label>原始权益人</label>'+
        '<select type="select" name="Originator" dropClass="Provider" class="form-control get" style="width:55%">' +
        '</select>' +
    '</div>'+
    '<div class="form-group" style="width:30%">' +
        '<label>费率</label>'+
        '<input type="text" name="fee_Originator" class="form-control get"/>' +
    '</div>' +
    '<div class="form-group" style="width:30%">' +
        '<label>账户</label>' +
        '<input type="text" name="account_Originator" class="form-control get"/>' +
    '</div>' +
    '<div class="form-group" style="width:40%">' +
        '<label>登记结算机构</label>' +
        '<select type="select" name="ClearingSystem" dropClass="Provider" class="form-control get" style="width:55%">' +
        '</select>' +
    '</div>'+
    '<div class="form-group" style="width:30%">' +
        '<label>费率</label>'+
        '<input type="text" name="fee_ClearingSystem" class="form-control get"/>' +
    '</div>' +
    '<div class="form-group" style="width:30%">' +
        '<label>账户</label>' +
        '<input type="text" name="account_ClearingSystem" class="form-control get"/>' +
    '</div>' +
    '<div class="form-group" style="width:40%">' +
        '<label>交易所</label>' +
        '<select type="select" name="ExchangeListing" dropClass="Provider" class="form-control get" style="width:55%">' +
        '</select>' +
    '</div>' +
    '<div class="form-group" style="width:30%">' +
        '<label>费率</label>' +
        '<input type="text" name="fee_ExchangeListing" class="form-control get"/>' +
    '</div>' +
    '<div class="form-group" style="width:30%">' +
        '<label>账户</label>' +
        '<input type="text" name="account_ExchangeListing" class="form-control get"/>' +
    '</div>' +
    '<div class="form-group" style="width:40%">' +
        '<label>计划管理人</label>' +
        '<select type="select" name="Seller" dropClass="Provider" class="form-control get" style="width:55%">' +
        '</select>' +
    '</div>'+
    '<div class="form-group" style="width:30%">' +
        '<label>费率</label>'+
        '<input type="text" name="fee_Seller" class="form-control get"/>' +
    '</div>' +
    '<div class="form-group" style="width:30%">' +
        '<label>账户</label>' +
        '<input type="text" name="account_Seller" class="form-control get"/>' +
    '</div>' +
    '<div class="form-group" style="width:40%">' +
        '<label>资产服务机构</label>' +
        '<select type="select" name="Servicer" dropClass="Provider" class="form-control get" style="width:55%">' +
        '</select>' +
    '</div>'+
    '<div class="form-group" style="width:30%">' +
        '<label>费率</label>'+
        '<input type="text" name="fee_Servicer" class="form-control get"/>' +
    '</div>' +
    '<div class="form-group" style="width:30%">' +
        '<label>账户</label>' +
        '<input type="text" name="account_Servicer" class="form-control get"/>' +
    '</div>' +
    '<div class="form-group" style="width:40%">' +
        '<label>评级机构</label>' +
        '<select type="select" name="RatingAgency" dropClass="Provider" class="form-control get" style="width:55%">' +
        '</select>' +
    '</div>'+
    '<div class="form-group" style="width:30%">' +
        '<label>费率</label>'+
        '<input type="text" name="fee_RatingAgency" class="form-control get"/>' +
    '</div>' +
    '<div class="form-group" style="width:30%">' +
        '<label>账户</label>' +
        '<input type="text" name="account_RatingAgency" class="form-control get"/>' +
    '</div>' +
    '<div class="form-group" style="width:40%">' +
        '<label>法律顾问</label>' +
        '<select type="select" name="LawFirm" dropClass="Provider" class="form-control get" style="width:55%">' +
        '</select>' +
    '</div>' +
    '<div class="form-group" style="width:30%">' +
        '<label>费率</label>'+
        '<input type="text" name="fee_LawFirm" class="form-control get"/>' +
    '</div>' +
    '<div class="form-group" style="width:30%">' +
        '<label>账户</label>' +
        '<input type="text" name="account_LawFirm" class="form-control get"/>' +
    '</div>' +
    '<div class="form-group" style="width:40%">' +
        '<label>会计/税务顾问</label>' +
        '<select type="select" name="AccoutingFirm" dropClass="Provider" class="form-control get" style="width:55%">' +
        '</select>' +
    '</div>' +
    '<div class="form-group" style="width:30%">' +
        '<label>费率</label>' +
        '<input type="text" name="fee_AccoutingFirm" class="form-control get"/>' +
    '</div>' +
    '<div class="form-group" style="width:30%">' +
        '<label>账户</label>' +
        '<input type="text" name="account_AccoutingFirm" class="form-control get"/>' +
    '</div>' +
    '<div class="form-group" style="width:40%">' +
        '<label>财务顾问</label>' +
        '<select type="select" name="RoleArranger" dropClass="Provider" class="form-control get" style="width:55%">' +
        '</select>' +
    '</div>' +
    '<div class="form-group" style="width:30%">' +
        '<label>费率</label>' +
        '<input type="text" name="fee_RoleArranger" class="form-control get"/>' +
    '</div>'+
    '<div class="form-group" style="width:30%">' +
        '<label>账户</label>' +
        '<input type="text" name="account_RoleArranger" class="form-control get"/>' +
    '</div>' ;
    // 初始化
    function Init() {
        $.getScript("./showModalDialog.js");
        clearData();
        getAllServiceProvider();
        trustId = getUrlParam('tid');
        if (trustId != null) {
            getTrustInfoByTrustId(getPageDataByResponse);
        } else {
            render(step);
        }
        $("#prev-step").click(function () {
            toNum();
            Controller(step);
            step--;
            render(step);
        });

        $("#next-step").click(function () {
            toNum();
            Controller(step);
            
            if(step<$(".step-box ul>li").length-1){
                step++;
            } else {
                var sessionContext = postAllData();
                sessionContext = "<SessionContext>[{0}]</SessionContext>".format(sessionContext);
                saveWorkingSessionContext(sessionContext, popupTaskProcessIndicator);
            }

            render(step);
        });

        //切换导航
        $(".step-box ul>li").click(function () {
            Controller(step);
            step=$(this).index();
            render(step);
        });
    }
    // @dom $('.form-group .get')
    // @callback function
    function getInputValue(dom){
        var data = [] , ItemValue;
        $(dom).each(function (i) {
            var _this = $(this);
            if(_this.attr('type')=='checkbox'){
                ItemValue = (_this.attr("checked"))?1:0
            }else{
                ItemValue = _this.val();
            }
            var ItemName = _this.attr('name');
            data.push({name:ItemName,value:ItemValue});
        });
        return data;
    }
    // 获取本地已存储数据并写入到表单中
    function getLocalData(){

        var readStep = readData("store"+step);
        if(readStep){
            if (step!=2) {
                $(".form-group .get").each(function (index) {
                    var data = readStep[index];
                    if($(this).attr('type')=='checkbox'){
                        $(this).attr('checked', (data.value == 0) ? false : true);
                    } else if ($(this).attr('type') == 'select') {
                        $(this).attr('value', data.value);
                    }else{
                        $(this).val(data.value);
                    }
                });
            }else{
                $.each(readStep,function(index){
                    $('#result').append(readlist(readStep[index]));
                });
                writeProviderDropDownList();
                $('.table-select').each(function(){
                    var _this = $(this), id = _this.attr('data-id');
                    _this.val(id);
                });
                $("tr>td button").click(function () {
                    $(this).closest('tr').remove();
                });
                
                //alert($(this).children()[1].innerText);
                handleRowEvent();
            }
        }
    }

    var handleRowEvent = function (row) {
        $("#result tr").click(function () {
            var stepValue = [];
            $(this).children().each(function () {
                if ($(this).attr('stype') == 'select') {
                    stepValue.push($(this).find(".table-select").val());
                } else {
                    stepValue.push($(this).find("span").text());
                }
            });
            writeStep(stepValue);

            formatNum();

            updateButtonAndTabName(false);
            paymentConventionChange($('#TrustBondAdd').find("select[name=PaymentConvention]"));
            
        });


        //$("input[name='issuedate']").click(function () {
        //    alert("issuedate");
        //});
    }

    var formatNum = function () {
        $("input[data-money=true]").each(function () {
            $(this).val(parseNum($(this).val()).formatMoney(0, ',', '.'));
        });
        $("span[data-money=true]").each(function () {
            $(this).text(parseNum($(this).text()).formatMoney(0, ',', '.'));
        });
    }

    var toNum = function () {
        $("input[data-money=true]").each(function () {
            $(this).val(parseNum($(this).val()));
        });
        $("span[data-money=true]").each(function () {
            $(this).text(parseNum($(this).text()));
        });
    }

    var parseNum = function (numStr) {
        return Number(numStr.replace(/\,/g, ''));
    }

    var writeStep = function (stepValue) {
        $('#TrustBondAdd .get').each(function (i) {
            $(this).val(stepValue[i]);
        });
    }
    var updateButtonAndTabName = function (isNewName) {
        $("#addList span").text(isNewName ? "添加" : "更新");
        $("#addList i").attr("class", isNewName ? "icon icon-plus" : "icon icon-list");
        $(".tabs li:nth-child(1) a").text(isNewName ? "添加分层" : "更新分层");
    };

    var checkTrustBondName = function (newName) {
        var foundIndex = -1;
        $(".table tr td:nth-child(2)").each(function (index) {
            if ($(this).text() == newName) {
                foundIndex = index;
            }
        });
        return foundIndex;
    }

    var paymentConventionChange = function (selectObj) {
        if (selectObj.val() == "计划还本，按期付息") {
            $("#PrincipalPaymentSchedule").show();
        }
        else {
            $("#PrincipalPaymentSchedule").hide();
        }
        if (selectObj.val() == "一次性还本付息") {
            $("#PaymentPeriod").hide();
        }
        else {
            $("#PaymentPeriod").show();
        }
    }

    // 渲染
    function render(step){

        var $title = $('.main>h3'),
            $forms = $('.main>.form'),
            $stepBox = $(".step-box ul>li");

        $title.text(titleText[step]);
        $stepBox.removeClass('active').eq(step).addClass("active");
        $forms.html(template[step]);
        $('.date').date_input();
        (step>0)?$('#prev-step').show():$('#prev-step').hide();
        $("#next-step").text((step < $stepBox.length - 1) ? '下一步' : '完成');

        writeProviderDropDownList();
        
        // 获取本地数据并写入表单
        getLocalData();

        //calculated dates events
        caculateDates();


        formatNum();


        // 动态模板事件绑定
        $("input[data-money=true]").change(function () {
            $(this).val(parseNum($(this).val()).formatMoney(0, ',', '.'));
        });
        $("span[data-money=true]").change(function () {
            $(this).text(parseNum($(this).text()).formatMoney(0, ',', '.'));
        });

        $('#addList').click(function(){
            var InputValue = [];
            var trustBondName = $('#TrustBondAdd .get').eq(1).val();
            if (!trustBondName) {
                alert('请填写证券简称!');
                $('#TrustBondAdd .get').eq(1).focus();
                return false;
            }
            $('#TrustBondAdd .get').each(function (i) {
                InputValue.push($(this).val());
            });

            var trustBondIndex = checkTrustBondName(trustBondName);
            if (trustBondIndex==-1) {
                $('#result').append(readlist(InputValue));
            }
            else {
                $('#result tr').eq(trustBondIndex).replaceWith(readlist(InputValue));
            }
            writeProviderDropDownList();
            document.getElementById('TrustBond').reset();
            $("tr>td button").click(function () {
                $(this).closest('tr').remove();
            });
            $('.table-select').each(function(){
                var _this = $(this), id = _this.attr('data-id');
                _this.val(id);
            });
            updateButtonAndTabName(true);
            handleRowEvent();
            paymentConventionChange($('#TrustBondAdd').find("select[name=PaymentConvention]"));
        });


   

        $('#TrustBondAdd').find("input[name=ShortName]").blur(function () {
            var isNewName = checkTrustBondName($(this).val())==-1;
            //alert(isNewName ? "添加" : "更新");
            updateButtonAndTabName(isNewName);
        });

        $('#TrustBondAdd').find("select[name=PaymentConvention]").change(function () {
            var item = $(this);
            paymentConventionChange(item);
        })

        paymentConventionChange($('#TrustBondAdd').find("select[name=PaymentConvention]"));

        if (trustId == null) {
            $("#editPaymentSequence").hide();
        }
        else {
            $("#editPaymentSequence").click(function () {
                var url = 'TrustContentForm.html?uiid=3&tid=' + trustId;

                $.showModalDialog({
                    title:'维护分层偿付顺序',
                    url: url,
                    height: 400,
                    width: 900,
                    scrollable: false
                    //, onClose: function () { var returnedValue = this.returnValue; }
                });
            });
        }
    }

    function calculateRSeries() {
        var dDate = caculateDate('CollectionDate', $("input[name='Days_APR']").val());
        $("input[name='AssetProviderReportDate']").val(dDate);
        $("input[name='Date_APR']").val("CollectionDate");
        dDate = caculateDate('CollectionDate', $("input[name='Days_BT']").val());
        $("input[name='BankTrusteeReportDate']").val(dDate);
        $("input[name='Date_BT']").val("CollectionDate");
    }

    function calculateTSeries() {
        var dDate = caculateDate('PaymentDate', $("input[name='Days_S']").val());
        $("input[name='ServicerReportDate']").val(dDate);
        $("input[name='Date_S']").val("PaymentDate");
        dDate = caculateDate('PaymentDate', $("input[name='Days_SA']").val());
        $("input[name='ServicerAllocationDate']").val(dDate);
        $("input[name='Date_SA']").val("PaymentDate");
        dDate = caculateDate('PaymentDate', $("input[name='Days_TPR']").val());
        $("input[name='TrusteePaymentReportDate']").val(dDate);
        $("input[name='Date_TPR']").val("PaymentDate");
        dDate = caculateDate('PaymentDate', $("input[name='Days_N']").val());
        $("input[name='NotificationDate']").val(dDate);
        $("input[name='Date_N']").val("PaymentDate");
    }

    function caculateDates() {

        //intialiazation
        calculateRSeries();
        calculateTSeries();
       
        //regis events
        $("input[name='CollectionDate']").change(function () {
            calculateRSeries();
        });

        $("input[name='PaymentDate']").change(function () {
            calculateTSeries();
        });
        
        $("input[name='Days_APR']").change(function () {
            var dDate = caculateDate('CollectionDate', $(this).val());
            $("input[name='AssetProviderReportDate']").val(dDate);
        });

        $("input[name='Days_BT']").change(function () {
            var dDate = caculateDate('CollectionDate', $(this).val());
            $("input[name='BankTrusteeReportDate']").val(dDate);
        });

        $("input[name='Days_S']").change(function () {
            var dDate = caculateDate('PaymentDate', $(this).val());
            $("input[name='ServicerReportDate']").val(dDate);
        });

        $("input[name='Days_SA']").change(function () {
            var dDate = caculateDate('PaymentDate', $(this).val());
            $("input[name='ServicerAllocationDate']").val(dDate);
        });

        $("input[name='Days_TPR']").change(function () {
            var dDate = caculateDate('PaymentDate', $(this).val());
            $("input[name='TrusteePaymentReportDate']").val(dDate);
        });

        $("input[name='Days_N']").change(function () {
            var dDate = caculateDate('PaymentDate', $(this).val());
            $("input[name='NotificationDate']").val(dDate);
        });
    }

    function caculateDate(source, num) {
        var sDateStr = $("input[name='" + source + "']").val();
        if (typeof(sDateStr) == 'undefined')
            return "";
        
        var sDateParts = sDateStr.split("-");
        //var parsedDate =  Date.parse(sDateStr); 
                
        var sDate = new Date(sDateParts[0], sDateParts[1] - 1, sDateParts[2]);

        var position = num >= 0 ? 1 : 5;
        var days = Math.floor((parseInt(num) + parseInt(sDate.getDay() - position)) / 5) * 2;
        days = days < 0 ? days + 2 : days;
        sDate.setTime(sDate.getTime() + (parseInt(num) + days) * 86400000);

        var dDateStr = (sDate.getFullYear()) + '-' + (sDate.getMonth() + 1) + '-' + sDate.getDate();

        return dDateStr;
    }

    function step1(){
        // 写入表单数据到本地缓存
        writeData('store0',getInputValue('.form-group .get'));
    }
    function step2() {
        writeData('store1', getInputValue('.form-group .get'));
    }
    function step3(){
        var tableValue = [];  
        if($("#result>tr").length){
            for(var i=0; i<$("#result>tr").length; i++){
                var storeTr = [];
                $("#result>tr:eq("+i+")>td").not(":last").each(function () {
                    if($(this).attr('stype')=='select'){
                        storeTr.push($(this).find(".table-select").val());
                    }else{
                        storeTr.push($(this).find("span").text());
                    }
                });
                tableValue.push(storeTr);
            }
        }
        writeData("store2",tableValue);
    }

    function step4() {
        // 获取页面上的所有数据
        writeData('store3',getInputValue('.form-group .get'));
    }
    function Controller(step){
        switch(step){
            case 0:
                step1();
                break;
            case 1:
                step2();
                break;
            case 2:
                step3();
                break;
            case 3:
                step4();
            break;
        }
    }
    // 读取数据
    function readData(key){
        return JSON.parse(localStorage.getItem(key));
    }
    // 写入数据
    function writeData(key,value){
        return localStorage.setItem(key,JSON.stringify(value));
    }
    // 清理缓存
    function clearData(){
        localStorage.clear();
    }
    function readlist(res) {
        var columnsToHide = [2,5,8,9,11,13,14];
        var html = '';
        html+='<tr>';
        $.each(res, function (index) {
            var hiddenOrNot = "";
            if (columnsToHide.indexOf(index) >= 0)
            {
                hiddenOrNot = 'style="display:none"';
            }
            if(index==9){
                html += '<td ' + hiddenOrNot + ' stype="select"><select class="table-select" data-id="' + (res[index]) + '"><option>固定利率</option></select></td>';
            }else if(index==11){
                html += '<td ' + hiddenOrNot + ' stype="select"><select class="table-select" dropClass="Provider" data-id="' + (res[index]) + '"></select></td>';
            }else if(index==12){
                html += '<td ' + hiddenOrNot + ' stype="select"><select class="table-select" data-id="' + (res[index]) + '">' +
                    '<option>一次性还本付息</option>'+
                    '<option>计划还本，按期付息</option>'+
                    '<option>过手型，按期付息</option>' +
                    '<option>按期等额本金</option>' +
                    '<option>按期等额本息</option>' +
                    '</select>'+
                    '</td>';
            } else if (index == 4) {
                html += '<td ' + hiddenOrNot + ' stype="text"><span role="edit" data-money="true"  contenteditable="true">' + (res[index]) + '</span></td>';
            }
            else {
                html += '<td ' + hiddenOrNot + ' stype="text"><span role="edit" contenteditable="true">' + (res[index]) + '</span></td>';
            }
        });
        html+= '<td>'+
                    '<button type="button" class="btn btn-sm">删除</button>'+
               '</td>'+
             '</tr>';
        return html;
    };
    //格式化字符串
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
        });
    };
    //获取URL参数
    var getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }
    //加载下拉列表框
    var writeProviderDropDownList = function () {
        if (arrProvider != null) {
            var slectTamplate = "<option value='{0}'>{1}</option>";
            var content = "";
            for (var i = 0; i < arrProvider.length; i++) {
                content += slectTamplate.format(arrProvider[i].ServiceProviderId, arrProvider[i].ServiceProviderName);
            };
            $('[dropClass="Provider"]').each(function (i) {
                $(this).html(content)
            })
        }
    }
    //读取ServiceProvider列表
    var getAllServiceProvider = function () {
        var serviceUrl = tmsDataProcessBase + "GetAllServiceProvider";
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                arrProvider = response;
            },
            error: function (response) { alert("load task objects error."); }
        });
    }
    //保存信息到working.SessionContext中
    var saveWorkingSessionContext = function (sessionContext, callback) {
        var serviceUrl = tmsDataProcessBase + "SaveWorkingSessionContextPlus";

        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: sessionContext,
            success: function (response) {
                callback(response);
            },
            error: function (response) { alert("error is :" + response); }
        });
    }
    //任务处理

    var getValueByNameInStore = function (storeName, name) {
        var store = readData(storeName);

        for (var i = 0; i < store.length; i++) {
            if (store[i].name == name)
                return store[i].value;
        }

        return "";
    }

    var popupTaskProcessIndicator = function (sessionId) {
        var trustCode = getValueByNameInStore("store0", "TrustCode");
        
        var wProxy = new webProxy();
        var sContext = {
            appDomain: "Task",
            sessionVariables: "<SessionVariables>" 
                + "<SessionVariable><Name>WorkSessionId</Name><Value>" + sessionId + "</Value><DataType>UniqueIdentifier</DataType><IsConstant>0</IsConstant><IsKey>0</IsKey><KeyIndex>0</KeyIndex></SessionVariable>" 
                + "<SessionVariable><Name>TrustCode</Name><Value>" + trustCode + "</Value><DataType>UniqueIdentifier</DataType><IsConstant>0</IsConstant><IsKey>0</IsKey><KeyIndex>0</KeyIndex></SessionVariable>"
                + "</SessionVariables>",
            taskCode: "TrustWizard"
        };

        wProxy.createSessionByTaskCode(sContext, function (response) {
            isSessionCreated = true;
            sessionID = response;
            taskCode = "TrustWizard";
            IndicatorAppDomain = "Task";

            if (IsSilverlightInitialized) {
                PopupTaskProcessIndicator();
                InitParams();
            }
            else {
                PopupTaskProcessIndicator();
            }
        });
        //alert(sessionId);
    }
    //组合数据并最终提交  
    var postAllData = function () {
        var finishData = "";
        var arrTrustItem = ["TrustCode", "TrustName", "OrganisationName", "IsSoldLoanAvailable", "IsTopUpAvailable", "SaleDate", "ClosureDate", "RemittanceFrequency", "SettlementDate", "DataLocation", "IssueAmount", "PoolCloseDate", "TrustStartDate", "CollectionDate", "PaymentDate"];
        var arrTrustExtitem = ["Days_APR", "Days_BT", "Days_S", "Days_SA", "Days_TPR", "Days_N", "Date_APR", "Date_BT", "Date_S", "Date_SA", "Date_TPR", "Date_N"];
        var strRowTemplate = '{"RowId":"{0}","TypeCode":"{1}","ItemName":"{2}","ItemValue":"{3}"},';
        var readStep = readData("store0");
        if (readStep) {
            $(readStep).each(function (i) {
                var data = readStep[i];
                if ($.inArray(data.name, arrTrustItem) > -1) {
                    finishData += strRowTemplate.format("1", "Trust", data.name, data.value);
                }
            })
        }
        var readStep = readData("store1");
        if (readStep) {
            $(readStep).each(function (i) {
                var data = readStep[i];
                if ($.inArray(data.name, arrTrustItem) > -1) {
                    finishData += strRowTemplate.format("1", "Trust", data.name, data.value);
                }
                if ($.inArray(data.name, arrTrustExtitem) > -1) {
                    finishData += strRowTemplate.format("1", "TrustExt", data.name, data.value);
                }
            })
        }
        readStep = readData("store2");
        if (readStep) {
            $(readStep).each(function (i) {
                finishData += strRowTemplate.format(i, "TrustBond", "TrustBondId", i);
                finishData += strRowTemplate.format(i, "TrustBond", "SecurityExchangeCode", readStep[i][0]);
                finishData += strRowTemplate.format(i, "TrustBond", "ShortName", readStep[i][1]);
                finishData += strRowTemplate.format(i, "TrustBond", "ClassName", readStep[i][2]);
                finishData += strRowTemplate.format(i, "TrustBond", "OfferAmount", readStep[i][4]);
                finishData += strRowTemplate.format(i, "TrustBond", "CurrencyOfIssuance", readStep[i][5]);
                finishData += strRowTemplate.format(i, "TrustBond", "IssueDate", readStep[i][6]);
                finishData += strRowTemplate.format(i, "TrustBond", "LegalMaturityDate", readStep[i][7]);
                finishData += strRowTemplate.format(i, "TrustBond", "Denomination", readStep[i][8]);
                finishData += strRowTemplate.format(i, "TrustBond", "CouponPaymentReference", readStep[i][9]);
                finishData += strRowTemplate.format(i, "TrustBond", "CouponBasis", readStep[i][10]);
                finishData += strRowTemplate.format(i, "TrustBond", "PaymentConvention", readStep[i][12]);
                finishData += strRowTemplate.format(i, "TrustBond", "PrincipalPaymentSchedule", readStep[i][13]);
                finishData += strRowTemplate.format(i, "TrustBond", "PaymentPeriod", readStep[i][14]);
                finishData += strRowTemplate.format(i, "TrustBond", "OriginalCreditRating", readStep[i][3]);
                finishData += strRowTemplate.format(i, "TrustBondRating", "TrustBondId", i);
                finishData += strRowTemplate.format(i, "TrustBondRating", "ServiceProviderId", readStep[i][11]);
                finishData += strRowTemplate.format(i, "TrustBondRating", "TrustBondRating", readStep[i][3]);
            })
        }
        readStep = readData("store3");
        if (readStep) {
            $(readStep).each(function (i) {
                if (i % 3 == 0) {
                    finishData += strRowTemplate.format(parseInt(i / 3), "TrustServiceProvider", "ServiceProviderRole", readStep[i].name);
                    finishData += strRowTemplate.format(parseInt(i / 3), "TrustServiceProvider", "ServiceProviderId", readStep[i].value);
                    finishData += strRowTemplate.format(parseInt(i / 3), "TrustServiceProvider", "Fee", readStep[i + 1].value);

                    finishData += strRowTemplate.format(parseInt(i / 3), "TrustServiceProvider_Account", "ServiceProviderRole", readStep[i].name);
                    finishData += strRowTemplate.format(parseInt(i / 3), "TrustServiceProvider_Account", "ServiceProviderId", readStep[i].value);
                    finishData += strRowTemplate.format(parseInt(i / 3), "TrustServiceProvider_Account", "NameofAccount", readStep[i + 2].value);
                }
            })
        }
        finishData.substr(0, finishData.length - 1);
        return finishData;
    }
    var getTrustInfoByTrustId = function (callBack) {
        var sContent = "{'SPName':'usp_GetTrustInfoFromWizard','Params':{" +
                        "'TrustId':'" + trustId +
                        "'}}";
        var serviceUrl = tmsSessionServiceBase + "GetItemsPlus?applicationDomain=TrustManagement&contextInfo=" + sContent;
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "jsonp",
            crossDomain: true,
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callBack(response);
            },
            error: function (response) { alert("error:" + response); }
        });
    }

    var getPageDataByResponse = function (response) {
        var trustItems = $.grep(response, function (trustItem) {
            return trustItem.DataType == "Trust";
        })
        var trustArr = [];
        trustArr.push({ name: "TrustCode", value: getItemValueFromArray(trustItems, "TrustCode") });
        trustArr.push({ name: "TrustName", value: getItemValueFromArray(trustItems, "TrustName") });
        trustArr.push({ name: "OrganisationName", value: getItemValueFromArray(trustItems, "OrganisationName") });
        trustArr.push({ name: "IssueAmount", value: getItemValueFromArray(trustItems, "IssueAmount") });
        trustArr.push({ name: "DataLocation", value: getItemValueFromArray(trustItems, "DataLocation") });
        trustArr.push({ name: "SaleDate", value: getItemValueFromArray(trustItems, "SaleDate") });
        trustArr.push({ name: "SettlementDate", value: getItemValueFromArray(trustItems, "SettlementDate") });
        //trustArr.push({ name: "ClosureDate", value: getItemValueFromArray(trustItems, "ClosureDate") });
        trustArr.push({ name: "RemittanceFrequency", value: getItemValueFromArray(trustItems, "RemittanceFrequency") });
        trustArr.push({ name: "", value: "" });
        trustArr.push({ name: "", value: "" });
        trustArr.push({ name: "", value: "" });
        trustArr.push({ name: "", value: "" });
        trustArr.push({ name: "", value: "0" });
        trustArr.push({ name: "IsSoldLoanAvailable", value: getItemValueFromArray(trustItems, "IsSoldLoanAvailable") });
        trustArr.push({ name: "IsTopUpAvailable", value: getItemValueFromArray(trustItems, "IsTopUpAvailable") });
        writeData('store0', trustArr);
        
        var trustArr1 = [];
        trustArr1.push({ name: "PoolCloseDate", value: getItemValueFromArray(trustItems, "PoolCloseDate") });
        trustArr1.push({ name: "TrustStartDate", value: getItemValueFromArray(trustItems, "TrustStartDate") });
        trustArr1.push({ name: "CollectionDate", value: getItemValueFromArray(trustItems, "CollectionDate") });
        trustArr1.push({ name: "PaymentDate", value: getItemValueFromArray(trustItems, "PaymentDate") });
        trustArr1.push({ name: "ClosureDate", value: getItemValueFromArray(trustItems, "ClosureDate") });

        trustArr1.push({ name: "Days_APR", value: getItemValueFromArray(trustItems, "Days_APR") });
        trustArr1.push({ name: "Date_APR", value: getItemValueFromArray(trustItems, "Date_APR") });
        trustArr1.push({ name: "Days_BT", value: getItemValueFromArray(trustItems, "Days_BT") });
        trustArr1.push({ name: "Date_BT", value: getItemValueFromArray(trustItems, "Date_BT") });
        trustArr1.push({ name: "Days_S", value: getItemValueFromArray(trustItems, "Days_S") });
        trustArr1.push({ name: "Date_S", value: getItemValueFromArray(trustItems, "Date_S") });
        trustArr1.push({ name: "Days_SA", value: getItemValueFromArray(trustItems, "Days_SA") });
        trustArr1.push({ name: "Date_SA", value: getItemValueFromArray(trustItems, "Date_SA") });
        trustArr1.push({ name: "Days_TPR", value: getItemValueFromArray(trustItems, "Days_TPR") });
        trustArr1.push({ name: "Date_TPR", value: getItemValueFromArray(trustItems, "Date_TPR") });
        trustArr1.push({ name: "Days_N", value: getItemValueFromArray(trustItems, "Days_N") });
        trustArr1.push({ name: "Date_N", value: getItemValueFromArray(trustItems, "Date_N") });

        writeData('store1', trustArr1);

        var trustBondArr = [];
        trustItems = $.grep(response, function (trustItem) {
            return (trustItem.DataType == "TrustBond" && trustItem.ItemCode == "ClassName");
        })
        for (var i = 0; i < trustItems.length; i++) {
            var trustBondId = trustItems[i].ItemId;
            var trustBond = [];
            var trustBondItems = $.grep(response, function (trustBondItem) {
                return (trustBondItem.DataType == "TrustBond" && trustBondItem.ItemId == trustBondId);
            })
            var trustBondRatingItems = $.grep(response, function (trustBondRatingItem) {
                return (trustBondRatingItem.DataType == "TrustBondRating" && trustBondRatingItem.ItemId == trustBondId);
            })
            trustBond.push(getItemValueFromArray(trustBondItems, "SecurityExchangeCode"));
            trustBond.push(getItemValueFromArray(trustBondItems, "ShortName"));
            trustBond.push(getItemValueFromArray(trustBondItems, "ClassName"));
            trustBond.push(getItemValueFromArray(trustBondRatingItems, "TrustBondRating"));
            trustBond.push(getItemValueFromArray(trustBondItems, "OfferAmount"));
            trustBond.push(getItemValueFromArray(trustBondItems, "CurrencyOfIssuance"));
            trustBond.push(getItemValueFromArray(trustBondItems, "IssueDate"));
            trustBond.push(getItemValueFromArray(trustBondItems, "LegalMaturityDate"));
            trustBond.push(getItemValueFromArray(trustBondItems, "Denomination"));
            trustBond.push(getItemValueFromArray(trustBondItems, "CouponPaymentReference"));
            trustBond.push(getItemValueFromArray(trustBondItems, "CouponBasis"));
            trustBond.push(getItemValueFromArray(trustBondRatingItems, "ServiceProviderId"));
            trustBond.push(getItemValueFromArray(trustBondItems, "PaymentConvention"));
            trustBond.push(getItemValueFromArray(trustBondItems, "PrincipalPaymentSchedule"));
            trustBond.push(getItemValueFromArray(trustBondItems, "PaymentPeriod"));
            trustBondArr.push(trustBond);
        }
        writeData('store2', trustBondArr);

        var trustProviderArr = [];
        trustItems = $.grep(response, function (trustItem) {
            return (trustItem.DataType == "TrustServiceProvider");
        })
        var trustSecItems = $.grep(response, function (trustItem) {
            return (trustItem.DataType == "TrustServiceProvider_Account");
        })
        

        trustProviderArr.push({ name: "AccountProvider", value: getItemIdFormArray(trustItems, "AccountProvider") });
        trustProviderArr.push({ name: "fee_AccountProvider", value: getItemValueFromArray(trustItems, "AccountProvider") });
        trustProviderArr.push({ name: "account_AccountProvider", value: getItemValueFromArray(trustSecItems, "AccountProvider") });

        trustProviderArr.push({ name: "Originator", value: getItemIdFormArray(trustItems, "Originator") });
        trustProviderArr.push({ name: "fee_Originator", value: getItemValueFromArray(trustItems, "Originator") });
        trustProviderArr.push({ name: "account_Originator", value: getItemValueFromArray(trustSecItems, "Originator") });

        trustProviderArr.push({ name: "ClearingSystem", value: getItemIdFormArray(trustItems, "ClearingSystem") });
        trustProviderArr.push({ name: "fee_ClearingSystem", value: getItemValueFromArray(trustItems, "ClearingSystem") });
        trustProviderArr.push({ name: "account_ClearingSystem", value: getItemValueFromArray(trustSecItems, "ClearingSystem") });

        trustProviderArr.push({ name: "ExchangeListing", value: getItemIdFormArray(trustItems, "ExchangeListing") });
        trustProviderArr.push({ name: "fee_ExchangeListing", value: getItemValueFromArray(trustItems, "ExchangeListing") });
        trustProviderArr.push({ name: "account_ExchangeListing", value: getItemValueFromArray(trustSecItems, "ExchangeListing") });

        trustProviderArr.push({ name: "Seller", value: getItemIdFormArray(trustItems, "Seller") });
        trustProviderArr.push({ name: "fee_Seller", value: getItemValueFromArray(trustItems, "Seller") });
        trustProviderArr.push({ name: "account_Seller", value: getItemValueFromArray(trustSecItems, "Seller") });

        trustProviderArr.push({ name: "Servicer", value: getItemIdFormArray(trustItems, "Servicer") });
        trustProviderArr.push({ name: "fee_Servicer", value: getItemValueFromArray(trustItems, "Servicer") });
        trustProviderArr.push({ name: "account_Servicer", value: getItemValueFromArray(trustSecItems, "Servicer") });

        trustProviderArr.push({ name: "RatingAgency", value: getItemIdFormArray(trustItems, "RatingAgency") });
        trustProviderArr.push({ name: "fee_RatingAgency", value: getItemValueFromArray(trustItems, "RatingAgency") });
        trustProviderArr.push({ name: "account_RatingAgency", value: getItemValueFromArray(trustSecItems, "RatingAgency") });

        trustProviderArr.push({ name: "LawFirm", value: getItemIdFormArray(trustItems, "LawFirm") });
        trustProviderArr.push({ name: "fee_LawFirm", value: getItemValueFromArray(trustItems, "LawFirm") });
        trustProviderArr.push({ name: "account_LawFirm", value: getItemValueFromArray(trustSecItems, "LawFirm") });

        trustProviderArr.push({ name: "AccoutingFirm", value: getItemIdFormArray(trustItems, "AccoutingFirm") });
        trustProviderArr.push({ name: "fee_AccoutingFirm", value: getItemValueFromArray(trustItems, "AccoutingFirm") });
        trustProviderArr.push({ name: "account_AccoutingFirm", value: getItemValueFromArray(trustSecItems, "AccoutingFirm") });

        trustProviderArr.push({ name: "RoleArranger", value: getItemIdFormArray(trustItems, "RoleArranger") });
        trustProviderArr.push({ name: "fee_RoleArranger", value: getItemValueFromArray(trustItems, "RoleArranger") });
        trustProviderArr.push({ name: "account_RoleArranger", value: getItemValueFromArray(trustSecItems, "RoleArranger") });


        writeData('store3', trustProviderArr);

        render(step);
    }
    var getItemIdFormArray = function (arrInput, itemCode) {
        var arrResult = $.grep(arrInput, function (item) {
            return item.ItemCode == itemCode;
        })
        if (arrResult.length > 0) {
            return arrResult[0].ItemId;
        } else {
            return "";
        }
    }
    var getItemValueFromArray = function (arrInput, itemCode) {
        var arrResult = $.grep(arrInput, function (item) {
            return item.ItemCode == itemCode;
        })
        if (arrResult.length > 0) {
            return arrResult[0].ItemValue;
        } else {
            return "";
        }
    }
    Init();
})(jQuery)
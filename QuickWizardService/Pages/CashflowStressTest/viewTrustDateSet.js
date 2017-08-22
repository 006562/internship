/// <reference path="../Scripts/jquery.min.js" />
/// <reference path="../Scripts/common.js" />
/// <reference path="../Scripts/common.js" />

String.prototype.startWith = function (str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
}
String.prototype.endWith = function (str) {
    var reg = new RegExp(str + "$");
    return reg.test(this);
}

//自然日  就叫 NaturalDay吧
//工作日和交易日   WorkingDay  TradingDay
//BeginingOfMonth	             月初
//EndOfMonth                     月末
//向前 -1  向后 1  不调整 0
//基准条件 选中值为 1 不选中值为0

var DataProcessServiceUrl = location.protocal+"//"+location.host+ "/TrustManagementService/DataProcessService.svc/jsAccessEP/"

var DateSetModel = (function () {
    var viewModel;
    var PageCode = "TrustExtensionItem";
    var RListRule = { Math: /^R_/ }, RVListRule = { Math: /^R_V_/ }, BListRule = { Math: /^[B]_/ }, BVListRule = { Math: /^[B]_V_/ };
    var calcDateType = { date: 'date', foreach: 'foreach' };
    var vShowOrHideValue = { date: true, foreach: true };
    var PublicHolidays = { DateItems: [], NoWorkDayItems: [] };
    var PublicTradingdays = { DateItems: [], NoWorkDayItems: [] };
    //===初始化相关===

    function viewModelObject() {
        this.BaseInfo = {
            HaveDataList: [
                //singleColumn("PoolCloseDate", "资产池封包日", "2016-4-25", "date", false),
            ],
            NoHaveDataList: []
        };
        this.ForEachPeriod = {
            HaveDataList: [
                //baseDateColumn("AssetProviderReportDate", "资产服务机构报告日", "2016-4-25", "PoolCloseDate", "2",true),
            ],
            NoHaveDataList: []
        };
        this.ForEachPeriodCalculateDate = {
            HaveDataList: [
                //singleColumn("PoolCloseDate", "循环购买计算频率", "2016-4-25", "date", false),
            ],
            NoHaveDataList: []
        }
        this.AmortizationPeriod = {
            HaveDataList: [
                //循环购买，计算日
                //tableColumn("AssetProviderReportDate", "资产服务机构报告日", "2016-4-25", "PoolCloseDate", "2",true),
            ],
            NoHaveDataList: []
        }
        this.AmortizationPeriodCalculateDate = {
            HaveDataList: [
                //singleColumn("PoolCloseDate", "循环购买计算频率", "2016-4-25", "date", false),
            ],
            NoHaveDataList: []
        }
        this.CompareTargetArry = [];
        this.ForEachCompareTargetArry = [];
        this.CalendarType = [
            { Value: 'WorkingDay', Text: '工作日' }
            , { Value: 'TradingDay', Text: '交易日' }
        ];
        this.ConditionCalendarType = [
            { Value: 'WorkingDay', Text: '工作日' }
            , { Value: 'TradingDay', Text: '交易日' }
            , { Value: 'NaturalDay', Text: '自然日' }
        ];
        this.ConditionTargetType = [
            { Value: 'BeginingOfMonth', Text: '月初' }
            , { Value: 'EndOfMonth', Text: '月末' }
        ];
        this.GetCompareTargetName = GetCompareTargetName;
    }

    //---start  注册事件等
    function subscribeR() {
        viewModel.ForEachPeriod.HaveDataList.subscribe(function (newArray) {
            CompareTargetUpdate(newArray, viewModel.ForEachCompareTargetArry);
        });
        viewModel.AmortizationPeriod.HaveDataList.subscribe(function (newArray) {
            CompareTargetUpdate(newArray, viewModel.CompareTargetArry);
        });
    }

    function CompareTargetUpdate(newArray, obj) {
        obj.removeAll();
        $.each(newArray, function (i, n) {
            obj.push(n);
        });
    }

    function GetCompareTargetName(ItemCode, type) {
        var list = [];
        if (type == calcDateType.foreach) list = viewModel.ForEachPeriod.HaveDataList();
        else list = viewModel.AmortizationPeriod.HaveDataList();
        var tmpArray = $.grep(list, function (n, i) {
            return n.ItemCode() == ItemCode;
        });
        if (tmpArray.length > 0) {
            return tmpArray[0].ItemAliasValue();
        }
        return ItemCode;
    }

    function getDateSetListByCode(type, keycode, valuecode) {//FundTransferDate
        if (type == 1)
            var sourcearray = viewModel.BaseInfo.HaveDataList();
        else if (type == 2) {
            var sourcearray = viewModel.AmortizationPeriodCalculateDate.HaveDataList();
        }
        else
            return "";

        var tmparray = $.grep(sourcearray, function (n) {
            return n.ItemCode() == keycode;
        });

        valuecode = (valuecode == null || typeof valuecode == "undefined" ? "ItemValue" : valuecode);
        if (tmparray != null && typeof tmparray != "undefined" && tmparray.length > 0)
            return tmparray[0][valuecode]();
        else
            return "";
    }
    //---end 

    var BusinessIdentifier, Sessionids, chose;
    function init() {
        var allDatas = [];
        trustId = BusinessIdentifier = getQueryString("id");
        //var set;
        //set = getQueryString("set");
        var allDatas;

        var executeParam = { SPName: 'TrustManagement.usp_GetTrustDateSet', SQLParams: [] };
        executeParam.SQLParams.push({ Name: 'TrustId', Value: BusinessIdentifier, DBType: 'int' });
        //executeParam.SQLParams.push({ Name: 'ItemAliasSetName', Value: set, DBType: 'string' });
        var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        CallWCFSvc(serviceUrl, false, 'GET', function (data) {
            allDatas = data;
            //callback(data);
        });

        viewModel = new viewModelObject();
        //var data = $.grep(allDatas, function (item) { return item.Category = 'TrustExtensionItem'; });
        initViewModel(allDatas);
        viewModel = ko.mapping.fromJS(viewModel);
        var node = document.getElementById('TrustExtensionDiv');
        ko.applyBindings(viewModel, node);
        subscribeR();
        CompareTargetUpdate(viewModel.AmortizationPeriod.HaveDataList(), viewModel.CompareTargetArry);
        CompareTargetUpdate(viewModel.ForEachPeriod.HaveDataList(), viewModel.ForEachCompareTargetArry);
        InitPublicTradingdays();
        dateSetType();
        toogleForeachSet();

        $('#loading').fadeOut();
    }

    function initViewModel(data) {
        viewModel.ForEachPeriod.HaveDataList = [];
        viewModel.ForEachPeriod.NoHaveDataList = [];
        var bvlist = {}, blist = {}, rvlist = {}, rlist = {};
        $.each(data, function (i, n) {
            if (RVListRule.Math.test(n.ItemCode)) {//循环期-相对部分
                SetVDateObjArr(rvlist, n);
            } else if (RListRule.Math.test(n.ItemCode)) {//循环期-基准日部分
                SetBaseDateObjArr(rlist, n);

            } else if (BVListRule.Math.test(n.ItemCode)) {//摊还期-相对部分
                SetVDateObjArr(bvlist, n);

            } else if (BListRule.Math.test(n.ItemCode)) {//摊还期-基准日部分
                SetBaseDateObjArr(blist, n);
            }
            else {//基本信息
                SetHaveAndNoData(n, viewModel.BaseInfo.HaveDataList,
                    viewModel.BaseInfo.NoHaveDataList);
            }
        });
        SetBaseDateHaveAndNoData(rlist, viewModel.ForEachPeriod.HaveDataList, viewModel.ForEachPeriod.NoHaveDataList);
        SetVDateHaveAndNoData(rvlist, viewModel.ForEachPeriodCalculateDate.HaveDataList, viewModel.ForEachPeriodCalculateDate.NoHaveDataList);
        SetBaseDateHaveAndNoData(blist, viewModel.AmortizationPeriod.HaveDataList, viewModel.AmortizationPeriod.NoHaveDataList);
        SetVDateHaveAndNoData(bvlist, viewModel.AmortizationPeriodCalculateDate.HaveDataList, viewModel.AmortizationPeriodCalculateDate.NoHaveDataList);

        function SetVDateObjArr(list, n) {
            var itemcode, itemtype;
            if (n.IsPrimary == true || n.IsPrimary == "True") {
                itemcode = n.ItemCode;
                itemtype = "main";
            } else {
                itemcode = n.ItemCode.substring(0, n.ItemCode.lastIndexOf("_"));
                itemtype = n.ItemCode.substr(n.ItemCode.lastIndexOf("_") + 1);
            }
            var tmp = list[itemcode];
            if (tmp == null || typeof tmp == "undefined") {
                tmp = tableColumn(n.ItemId, itemcode, "", "", "", "", "", true);
            }
            if (itemtype == "main") {
                tmp.DisplayName = n.ItemAliasValue;
                tmp.ItemValue = n.ItemValue;
            } else if (itemtype == "CT") {
                tmp.CompareTarget = n.ItemValue;
            } else if (itemtype == "DC") {
                tmp.DateCount = n.ItemValue;
            } else if (itemtype == "CD") {
                tmp.CalendarType = n.ItemValue;
            }
            tmp.ItemId = n.ItemId;
            list[itemcode] = tmp;
        }
        function SetBaseDateObjArr(list, n) {
            var code, type, value;
            if (n.ItemCode.endWith('_FirstDate') || n.ItemCode.endWith('_Frequency') || n.ItemCode.endWith('_WorkingDateAdjustment') || n.ItemCode.endWith('_Calendar')
                || n.ItemCode.endWith('_Condition') || n.ItemCode.endWith('_ConditionTarget') || n.ItemCode.endWith('_ConditionDay') || n.ItemCode.endWith('_ConditionCalendar')) {
                code = n.ItemCode.substring(0, n.ItemCode.lastIndexOf("_"));
                type = n.ItemCode.substr(n.ItemCode.lastIndexOf("_") + 1);
                value = (n.ItemCode.endWith('_Condition') ? (n.ItemValue == 'True') : n.ItemValue);
            }
            else {
                code = n.ItemCode;
                type = 'ItemAliasValue';
                value = n.ItemAliasValue;
            }
            if (!list[code]) {
                list[code] = baseDateColumn(n.ItemId, code, '', '', '', '', '', '', '', '', '', '');
            }

            list[code][type] = value;
        }

        function SetBaseDateHaveAndNoData(list, arr1, arr2) {
            $.each(list, function (i, n) {
                if (n.FirstDate)
                    arr1.push(n);
                else
                    arr2.push(n);
            })
        }
        function SetVDateHaveAndNoData(list, arr1, arr2) {
            $.each(list, function (i, n) {
                if (n.DateCount)
                    arr1.push(n);
                else
                    arr2.push(n);
            })
        }
        function SetHaveAndNoData(n, arr1, arr2) {
            //ItemCode, ItemAliasValue, ItemValue, dataType, showExStr, CanDel
            var CanDel = (n.IsCompulsory == false || n.IsCompulsory.toString().toLocaleLowerCase() == "false");
            var singledata = singleColumn(n.ItemId, n.ItemCode, n.ItemAliasValue, n.ItemValue, n.DataType, CanDel, n.IsCompulsory, n.UnitOfMeasure, n.Precise);

            var isShow = (n.IsCompulsory == true || n.IsCompulsory.toString() == "True" || n.ItemValue);
            if (isShow)
                arr1.push(singledata);
            else
                arr2.push(singledata);
        }
    }

    function update() {
        var TEResult = [];

        if (viewModel.BaseInfo.HaveDataList().length > 0) {
            $.each(viewModel.BaseInfo.HaveDataList(), function (i, n) {
                TEResult.push(GetTEResultTemplate(n.ItemCode(), n.ItemValue(), n.DataType(), n.UnitOfMeasure(), n.Precise()));
            });
        }
        if (viewModel.ForEachPeriod.HaveDataList().length > 0) {
            $.each(viewModel.ForEachPeriod.HaveDataList(), function (i, n) {
                getBaseDate(i, n, TEResult);
            });
        }
        if (viewModel.ForEachPeriodCalculateDate.HaveDataList().length > 0) {
            $.each(viewModel.ForEachPeriodCalculateDate.HaveDataList(), function (i, n) {
                getJsr(i, n, TEResult);
            });
        }
        if (viewModel.AmortizationPeriod.HaveDataList().length > 0) {
            $.each(viewModel.AmortizationPeriod.HaveDataList(), function (i, n) {
                getBaseDate(i, n, TEResult);
            });
        }
        if (viewModel.AmortizationPeriodCalculateDate.HaveDataList().length > 0) {
            $.each(viewModel.AmortizationPeriodCalculateDate.HaveDataList(), function (i, n) {
                getJsr(i, n, TEResult);
            });
        }
        function getBaseDate(i, n, TEResult) {
            TEResult.push(GetTEResultTemplate(n.ItemCode(), "", "", ""));
            $.each(n, function (code, item) {
                if (code != 'ItemAliasValue' && code != 'ItemCode' && code != 'ItemValue' && code != 'ItemId') {
                    TEResult.push(GetTEResultTemplate(n.ItemCode() + "_" + code, n[code](), "", ""));
                }
            })
        }
        function getJsr(i, n, TEResult) {
            var ivalue = n.ItemValue();
            //if (ivalue && $.trim(ivalue).length > 0) {
            TEResult.push(GetTEResultTemplate(n.ItemCode(), ivalue, "", ""));
            TEResult.push(GetTEResultTemplate(n.ItemCode() + "_CT", n.CompareTarget(), "", ""));
            TEResult.push(GetTEResultTemplate(n.ItemCode() + "_DC", n.DateCount(), "", ""));
            TEResult.push(GetTEResultTemplate(n.ItemCode() + "_CD", n.CalendarType(), "", ""));
            //}
        }
        return TEResult;
    }

    function GetTEResultTemplate(ItemCode, ItemValue, DataType, UnitOfMeasure, Precise) {
        return getTemplate(PageCode, "", "", "", "", "", ItemCode, ItemValue, DataType, UnitOfMeasure, Precise);
    }

    function getTemplate(Category, SPId, SPCode, SPRItemCode, TBId, ItemId, ItemCode, ItemValue, DataType, UnitOfMeasure, Precise) {
        return { "Category": Category, "SPId": SPId, "SPCode": SPCode, "SPRItemCode": SPRItemCode, "TBId": TBId, "ItemId": ItemId, "ItemCode": ItemCode, "ItemValue": ItemValue, "DataType": DataType, "UnitOfMeasure": UnitOfMeasure, "Precise": Precise };
    }

    function preview() {
        /*
        // 整体布局 {0} 标题 {1} 内容
        var print_tpl = '<div class="ItemBox"><h3 class="h3">{0}</h3><div class="ItemInner">{1}</div></div>';
        // 内容样式 {0} 是key {1} 是value 
        var print_content = '<div class="Item"><label>{0}</label><span></span></div>';
        // 复杂的内容样式 针对多条数据展示
        var print_item = '<div class="ItemContent"><div class="ItemTitle">{0}：{1}</div>{2}</div>';
        // 举栗子
        // <div class="ItemContent">
        //     <div class="ItemTitle">原始权益人：北京市律师所</div>
        //     <div class="Item">
        //         <label>账户名称</label>
        //         <span>JD201502</span>
        //     </div>
        //     <div class="Item">
        //         <label>费率</label>
        //         <span>JD201502</span>
        //     </div>
        // </div>
        */

        var TETemplate = '<div class="ItemBox"><h3 class="h3">{0}</h3><div class="ItemInner">{1}</div></div>';
        var TERTemplate = "<div class='Item'><label>{0}</label><span>{1}</span></div>";
        TERTmp = "";
        if (viewModel.BaseInfo.HaveDataList().length > 0) {
            $.each(viewModel.BaseInfo.HaveDataList(), function (i, n) {
                if (n.ItemAliasValue() == '计息期间') {
                    var svcUrl = DataProcessServiceUrl + "CommonExecuteGet?";
                    var executeParam = { SPName: 'usp_GetItemAliasByCode', SQLParams: [] };
                    executeParam.SQLParams.push({ Name: 'itemCode', value: n.ItemValue(), DBType: 'string' });
                    var executeParams = encodeURIComponent(JSON.stringify(executeParam));
                    var sourceData = {};
                    $.ajax({
                        cache: false,
                        type: "GET",
                        async: false,
                        url: svcUrl + 'appDomain=TrustManagement&executeParams=' + executeParams + '&resultType=commom',
                        dataType: "json",
                        contentType: "application/xml;charset=utf-8",
                        success: function (response) {
                            if (typeof response === 'string') { sourceData = JSON.parse(response); }
                            else { sourceData = response; }
                            TERTmp += TERTemplate.format(n.ItemAliasValue(), sourceData[0].ItemAliasValue);
                        },
                        error: function (response) { alertMsg('Error occursed while requiring the ItemAliasName!', 1); }
                    });
                }
                else {
                    TERTmp += TERTemplate.format(n.ItemAliasValue(), n.ItemValue());
                }
            });
        }

        var TrustId = getQueryString("tid");

        GetCalendarByTrustId(TrustId, 'usp_GetCalendarSettingsByTrustId');
        GetCalendarByTrustId(TrustId, 'usp_GetCalendarListByTrustId');

        //if (viewModel.ForEachPeriod.HaveDataList().length > 0) {
        //    $.each(viewModel.ForEachPeriod.HaveDataList(), function (i, n) {
        //        TERTmp += TERTemplate.format(n.ItemAliasValue(), n.ItemValue());
        //    });
        //}
        //if (viewModel.ForEachPeriodCalculateDate.HaveDataList().length > 0) {
        //    $.each(viewModel.ForEachPeriodCalculateDate.HaveDataList(), function (i, n) {
        //        if (n.ItemValue) {
        //            TERTmp += TERTemplate.format(n.DisplayName(), n.ItemValue());
        //        }
        //    });
        //}
        return TETemplate.format("日期设置", TERTmp);
    }

    //获取CalendarList
    function GetCalendarByTrustId(TrustId, SPName) {
        var CalendarTemplate = "<div class='CalendarItem'><label>{0}</label><span>{1}</span></div>";
        var svcUrl = DataProcessServiceUrl + "CommonExecuteGet?";
        var executeParam = { SPName: SPName, SQLParams: [] };
        executeParam.SQLParams.push({ Name: 'TrustId', value: TrustId, DBType: 'string' });
        var executeParams = encodeURIComponent(JSON.stringify(executeParam));
        var sourceData = {};
        $.ajax({
            cache: false,
            type: "GET",
            async: false,
            url: svcUrl + 'appDomain=TrustManagement&executeParams=' + executeParams + '&resultType=commom',
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            success: function (response) {
                if (typeof response === 'string') { sourceData = JSON.parse(response); }
                else { sourceData = response; }
                var length = sourceData.length;
                for (var i = 0; i < length; i++) {
                    TERTmp += CalendarTemplate.format(sourceData[i].Name, sourceData[i].Value);
                }
            },
            error: function (response) { alertMsg('Error occursed while requiring the CalendarList!', 1); }
        });
    }

    //---获取Calendar---
    function GetCalendarDate(params, callback) {
        var GetHolidaysUrl = DataProcessServiceUrl + "GetPublicHolidays/TrustManagement/" + params.startdatestr + "/" + params.areaname;
        $.ajax({
            type: "GET",
            url: GetHolidaysUrl,
            dataType: "jsonp",
            crossDomain: true,
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                if (callback)
                    callback(response);
            },
            error: function (response) {
                alertMsg("GetCalendarDate Error!", 1);
                if (callback)
                    callback(response);
            }
        });
    }
    //初始化PublicHolidays
    function InitPublicHolidays() {
        var myDate = new Date();
        var startdatestr = (myDate.getFullYear() - 1) + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();//"2016-04-26";
        var areaname = "中国大陆法定非工作日";
        GetCalendarDate({ startdatestr: startdatestr, areaname: areaname }, function (response) {
            if (response && response.length > 0) {
                //PublicHolidays.NoWorkDayItems = $.map(response, function (n) {
                //    return self.GetDate(n.Date).getTime();
                //});
            }
            else {
                NoCalendarTypeSet('WorkingDay');
            }

            InitPublicTradingdays(function () {
                //calculateDateInitSet();
                //self.PublicHolidaysHasGet = true;
            });
        });
    }
    function InitPublicTradingdays(callback) {
        var self = TrustExtensionNameSpace;

        var myDate = new Date();
        var startdatestr = (myDate.getFullYear() - 1) + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();//"2016-04-26";
        var areaname = "中国大陆法定非交易日";
        GetCalendarDate({ startdatestr: startdatestr, areaname: areaname }, function (response) {
            if (response && response.length > 0) {
                //PublicTradingdays.NoWorkDayItems = $.map(response, function (n) {
                //    return self.GetDate(n.Date).getTime();
                //});
            } else {
                NoCalendarTypeSet('TradingDay');
            }

            if (callback)
                callback();
        });
    }
    function NoCalendarTypeSet(TypeName) {
        RemoveCalendarType(TypeName);
        ChangeToFirstCalendarType(TypeName);

        //batchToReCalculate();
        //batchToReCalculateForEach();
    }
    function RemoveCalendarType(typename) {
        $.each(viewModel.CalendarType(), function (i, n) {
            if (n.Value() == typename) {
                viewModel.CalendarType.remove(n);
                return false;
            }
        });
        $.each(viewModel.ConditionCalendarType(), function (i, n) {
            if (n.Value() == typename) {
                viewModel.ConditionCalendarType.remove(n);
                return false;
            }
        });
    }
    function ChangeToFirstCalendarType(typename) {
        //相对日期CalendarType
        var defalutTypeName = viewModel.CalendarType()[0].Value();
        Tmp(viewModel.AmortizationPeriodCalculateDate.HaveDataList, 'CalendarType', typename, defalutTypeName);
        Tmp(viewModel.ForEachPeriodCalculateDate.HaveDataList, 'CalendarType', typename, defalutTypeName);

        //基准日Calendar
        var defalutTypeName = viewModel.ConditionCalendarType()[0].Value();
        Tmp(viewModel.AmortizationPeriod.HaveDataList, 'Calendar', typename, defalutTypeName);
        Tmp(viewModel.ForEachPeriod.HaveDataList, 'Calendar', typename, defalutTypeName);

        //基准日ConditionCalendar
        //var defalutTypeName = viewModel.ConditionCalendarType()[0].Value();
        Tmp(viewModel.AmortizationPeriod.HaveDataList, 'ConditionCalendar', typename, defalutTypeName);
        Tmp(viewModel.ForEachPeriod.HaveDataList, 'ConditionCalendar', typename, defalutTypeName);

        function Tmp(koTmp, columnName, typename, defaulttypename) {
            $.each(koTmp(), function (i, n) {
                if (n[columnName]() == typename) {
                    n[columnName](defaulttypename);
                }
            })
        }
    }


    //字段列实体
    function baseDateColumn(ItemId, ItemCode, ItemValue, ItemAliasValue, FirstDate, Frequency, WorkingDateAdjustment, Calendar, Condition, ConditionTarget, ConditionDay, ConditionCalendar) {
        return { ItemId: ItemId, ItemCode: ItemCode, ItemValue: ItemValue, ItemAliasValue: ItemAliasValue, FirstDate: FirstDate, Frequency: Frequency, WorkingDateAdjustment: WorkingDateAdjustment, Calendar: Calendar, Condition: Condition, ConditionTarget: ConditionTarget, ConditionDay: ConditionDay, ConditionCalendar: ConditionCalendar };
    }

    function singleColumn(ItemId, ItemCode, ItemAliasValue, ItemValue, DataType, CanDel, IsCompulsory, UnitOfMeasure, Precise) {
        return { ItemId: ItemId, "ItemCode": ItemCode, "ItemAliasValue": ItemAliasValue, "ItemValue": ItemValue, "DataType": DataType, "CanDel": CanDel, "IsCompulsory": IsCompulsory, "UnitOfMeasure": UnitOfMeasure, "Precise": Precise };
    }

    function tableColumn(ItemId, ItemCode, DisplayName, ItemValue, CompareTarget, DateCount, CalendarType, IsShow) {
        return {
            ItemId: ItemId,
            ItemCode: ItemCode,
            DisplayName: DisplayName,
            ItemValue: ItemValue,
            CompareTarget: CompareTarget,
            DateCount: DateCount,
            CalendarType: CalendarType,
            IsShow: IsShow
        };
    }

    //===页面事件操作相关===

    function addBase(obj) {
        var _obj = $(obj).parent().parent();
        var dvcode = _obj.find(".form-control:eq(0) option:selected");
        var index0 = dvcode.attr('dataIndex');

        if (viewModel.BaseInfo.NoHaveDataList().length > parseInt(index0)) {
            var oNew = viewModel.BaseInfo.NoHaveDataList()[index0];

            viewModel.BaseInfo.NoHaveDataList.remove(oNew);
            viewModel.BaseInfo.HaveDataList.push(oNew);
            dateSetType();

        } else {
            return false;
        }
    }

    function deleteBase(obj) {
        var rowindex = $(obj).attr('dataIndex');
        var item = viewModel.BaseInfo.HaveDataList()[rowindex];
        viewModel.BaseInfo.HaveDataList.remove(item);
        viewModel.BaseInfo.NoHaveDataList.push(item);
    }

    function addR(obj, _type) {
        var _obj = $(obj).parent().parent();
        var dvcode = _obj.find(".form-control:eq(0) option:selected");
        var index0 = dvcode.attr('dataIndex');
        if (_type == calcDateType.foreach && viewModel.ForEachPeriod.NoHaveDataList().length > parseInt(index0)) {
            var oNew = viewModel.ForEachPeriod.NoHaveDataList()[index0];

            viewModel.ForEachPeriod.NoHaveDataList.remove(oNew);
            viewModel.ForEachPeriod.HaveDataList.push(oNew);
        } else if (_type == calcDateType.date && viewModel.AmortizationPeriod.NoHaveDataList().length > parseInt(index0)) {
            var oNew = viewModel.AmortizationPeriod.NoHaveDataList()[index0];

            viewModel.AmortizationPeriod.NoHaveDataList.remove(oNew);
            viewModel.AmortizationPeriod.HaveDataList.push(oNew);
        }
        else {
            return false;
        }
        dateSetType();
    }

    function deleteR(obj, _type) {
        var rowindex = $(obj).attr('dataIndex');
        if (_type == calcDateType.foreach) {
            var item = viewModel.ForEachPeriod.HaveDataList()[rowindex];
            var itemName = item.ItemAliasValue();
            var beingTargeted = false;
            $('.foreachset .compare-target').each(function () {
                var $this = $(this);
                if ($this.html() === itemName) {
                    beingTargeted = true;
                    return false;
                }
            });
            if (beingTargeted) {
                alertMsg('当前日期参与计算，无法移除', 1); return;
            }
            viewModel.ForEachPeriod.HaveDataList.remove(item);
            viewModel.ForEachPeriod.NoHaveDataList.push(item);
        } else if (_type == calcDateType.date) {
            var item = viewModel.AmortizationPeriod.HaveDataList()[rowindex];
            var itemName = item.ItemAliasValue();
            var beingTargeted = false;
            $('.calculateTHQ .compare-target').each(function () {
                var $this = $(this);
                if ($this.html() === itemName) {
                    beingTargeted = true;
                    return false;
                }
            });
            if (beingTargeted) {
                alertMsg('当前日期参与计算，无法移除', 1); return;
            }
            viewModel.AmortizationPeriod.HaveDataList.remove(item);
            viewModel.AmortizationPeriod.NoHaveDataList.push(item);
        }
    }

    function dateSetType() {
        $('.date-plugins').date_input();
    }

    function toogleForeachSet() {
        //获取产品页 支持循环结构是否选中 ,ItemCode:IsTopUpAvailable
        toogleForeach();

        $('#TrustIsTopUpAvaliable').click(function () {
            toogleForeach();
        });
    };
    function toogleForeach() {
        var isShowForeach = $('#TrustIsTopUpAvaliable').is(':checked');
        var dom = $(".foreachset");
        if (isShowForeach)
            dom.show();
        else
            dom.hide();
    };

    function addJsr(_this, _type) {
        var jsrList = [];
        if (_type == calcDateType.foreach) {
            jsrList = viewModel.ForEachPeriodCalculateDate;//循环期
        }
        else {
            jsrList = viewModel.AmortizationPeriodCalculateDate;//摊还期
        }

        if (jsrList.NoHaveDataList().length <= 0)
            return;
        var value = [];
        var _obj = $(_this).parent().parent();
        _obj.find('.form-control').each(function () {
            value.push($(this).val());
        });
        if (!value[2]) {
            alertMsg("请选择距离的基准日期", 1);
            return;
        }
        if (typeof value[3] == "undefined" || parseInt(value[3]) != value[3]) {
            alertMsg("请输入正确的距离天数", 1);
            return;
        }
        //if (typeof value[1] == "undefined" || DataSetTools.RQcheck(value[1]) == false) {
        //    alert("请填写" + GetCompareTargetName(value[2], _type));
        //    return;
        //}
        var dvcode = _obj.find(".form-control:eq(0) option:selected");
        var index0 = dvcode.attr('dataIndex'); //.index();

        if (_type == calcDateType.foreach) {
            var oNew = viewModel.ForEachPeriodCalculateDate.NoHaveDataList()[index0];
        }
        else {
            var oNew = viewModel.AmortizationPeriodCalculateDate.NoHaveDataList()[index0];
        }

        var newData = oNew;
        newData.DisplayName(value[0]);
        newData.ItemValue(value[1]);
        newData.CompareTarget(value[2]);
        newData.DateCount(value[3]);
        newData.CalendarType(value[4]);

        if (_type == calcDateType.foreach) {
            viewModel.ForEachPeriodCalculateDate.NoHaveDataList.remove(oNew);
            viewModel.ForEachPeriodCalculateDate.HaveDataList.push(newData);
        }
        else {
            viewModel.AmortizationPeriodCalculateDate.NoHaveDataList.remove(oNew);
            viewModel.AmortizationPeriodCalculateDate.HaveDataList.push(newData);
        }

        ShowOrHideJsrRightButton(_type);
        ShowOrHideJsrRightAllSet(_type);
    }

    function deleteJsr(_this, _type) {
        var index = $(_this).attr("dataIndex");

        var datalist = {};
        if (_type == calcDateType.foreach) datalist = viewModel.ForEachPeriodCalculateDate;
        else datalist = viewModel.AmortizationPeriodCalculateDate;

        var oNew = datalist.HaveDataList()[index];
        datalist.HaveDataList.remove(oNew);

        oNew.ItemValue("");
        oNew.CompareTarget("");
        oNew.DateCount("");
        oNew.CalendarType('');
        datalist.NoHaveDataList.push(oNew);

        ShowOrHideJsrRightButton(_type);
        ShowOrHideJsrRightAllSet(_type);
    }

    function ShowOrHideJsrRightButton(_type) {
        if (_type == calcDateType.foreach) {
            if ($("#TrustExtensionDiv").find("#TrustExtensionJSRListHaveDataList").children().length > 0)
                $("#setautohide").show();
            else
                $("#setautohide").hide();
        } else {
            var self = TrustExtensionNameSpace;
            if ($("#TrustExtensionDiv").find("#TrustExtensionForEachJSRListHaveDataList").children().length > 0)
                $("#setautohideforeach").show();
            else
                $("#setautohideforeach").hide();
        }
    }

    function conditionChanged(_this) {
        var ul = $(_this).parent().parent().parent();
        if (!_this.checked) {
            $.each(ul.find('.form-control[conditiongroup="Condition"]'), function (i, n) {
                $(n).val('');
                $(n).removeClass('red-border');
            });
        }
    }

    function vShowOrHide(_this, _type) {
        var b;
        if (_type == calcDateType.foreach) {
            b = vShowOrHideValue.foreach = !vShowOrHideValue.foreach;

        }
        else {
            b = vShowOrHideValue.date = !vShowOrHideValue.date;
        }
        ShowOrHideJsrRightAllSet(_type);

        if (b == true) {
            $(_this).find("i").removeClass("icon-bottom").addClass("icon-top");
            $(_this).find("span").text(" 点击隐藏");
        }
        else if (b == false) {
            $(_this).find("i").removeClass("icon-top").addClass("icon-bottom");
            $(_this).find("span").text(" 点击显示");
        }
    }

    function ShowOrHideJsrRightAllSet(_type) {
        if (_type == calcDateType.foreach) {
            var autohides = $("#TrustExtensionForEachJSRListHaveDataList div[name='autohide']");
            autohides.css("display", vShowOrHideValue.foreach == true ? "block" : "none");
        } else {
            var autohides = $("#TrustExtensionJSRListHaveDataList div[name='autohide']");
            autohides.css("display", vShowOrHideValue.date == true ? "block" : "none");
        }
    }

    //===排序===
    function SortDateFunction() {
        var self = TrustExtensionNameSpace;
        //指定排序顺序，点一下降序
        var sortOrder = true;
        $("#sortDate").click(function () {
            self.sortDate(self, sortOrder, self.calcDateType.date);
            sortOrder = !sortOrder;
            //这里要加这个函数右边显示区域保留当前状态
            self.ShowOrHideJsrRightAllSet();
            if (sortOrder == false) {
                $("#sortDate i").removeClass("icon-bottom").addClass("icon-top");
                $("#sortDate span").text(" 升序排序");
            }
            else if (sortOrder == true) {
                $("#sortDate i").removeClass("icon-top").addClass("icon-bottom");
                $("#sortDate span").text(" 降序排序");
            }
        });
        var sortOrderForEach = true;
        $("#sortDateforeach").click(function () {
            self.sortDate(self, sortOrderForEach, self.calcDateType.foreach);
            sortOrderForEach = !sortOrderForEach;
            //这里要加这个函数右边显示区域保留当前状态
            self.ShowOrHideJsrRightAllSet_Foreach();
            if (sortOrderForEach == false) {
                $("#sortDateforeach i").removeClass("icon-bottom").addClass("icon-top");
                $("#sortDateforeach span").text(" 升序排序");
            }
            else if (sortOrderForEach == true) {
                $("#sortDateforeach i").removeClass("icon-top").addClass("icon-bottom");
                $("#sortDateforeach span").text(" 降序排序");
            }
        });
    }
    //默认升序排序
    function initSortDate(type) {
        var self = TrustExtensionNameSpace;
        self.sortDate(self, false, type);
    }
    function sortDate(self, order, type) {
        var temp = new Array();
        var datalist = {};
        if (type == self.calcDateType.foreach) datalist = self.TrustExtensionData.ForEachSetJSRList;
        else datalist = self.TrustExtensionData.JSRList;

        var temptwo = self.SortDateByOrder(temp.concat(datalist.HaveDataList()), order);
        //先全部删除再重新添加的方式重新渲染
        datalist.HaveDataList.removeAll();
        $.each(temptwo, function (i, n) {
            datalist.HaveDataList.push(n);
        })
    }
    function SortDateByOrder(tempArr, sortOrder) {
        var self = TrustExtensionNameSpace;
        var length = tempArr.length;
        //暴力排序,sortOrder=false 降序排序                          
        for (var i = 0; i < length - 1; i++) {
            for (var j = 0; j < length - 1; j++) {
                if (self.ComPareDate(tempArr[j].ItemValue(), tempArr[j + 1].ItemValue(), sortOrder)) {
                    var test = tempArr[j + 1];
                    tempArr[j + 1] = tempArr[j];
                    tempArr[j] = test;
                }
            }
        }
        return tempArr;
    }
    //比较两个日期的大小，如果大于返回true
    function ComPareDate(date1, date2, option) {
        var temp1 = this.TansferDateToInt(date1);
        var temp2 = this.TansferDateToInt(date2);
        if (option) {
            return temp1 < temp2;
        }
        else {
            return temp1 > temp2;
        }
    }
    //转换日期，进行比较
    function TansferDateToInt(date) {
        var tempArr = [];
        var temp = "";
        tempArr = date.split("-");
        for (var i = 0; i < tempArr.length; i++) {
            temp += tempArr[i];
        }
        return parseInt(temp);
    }

    function saveTrustDateSet() {
        if (!validStepControlsBeforeLeaving()) {
            return;
        }

        var svcUrl = DataProcessServiceUrl + "CommonExecuteGet?";
        var sessionContext = '', sessionContextArray = [];
        var updateArray = [];

        updateArray = update();//.concat(self.METHODS[stepId - 1].update.apply(self.api));                    

        $.each(updateArray, function (i, n) {
            if (!(n == "" || n == 'undifined' || n == null)) {
                //n.ItemValue = self.ConvertDataByUtil("get", n.DataType, n.ItemValue, n.UnitOfMeasure, n.Precise);
                if (!n.ItemValue) n.ItemValue = "";
                sessionContextArray.push(getShotTemplate(n));
            }
        });
        sessionContext = JSON.stringify(sessionContextArray);
        sessionContext = "<SessionContext>{0}</SessionContext>".format(sessionContext);
        saveWorkingSessionContext(sessionContext, function (sessionId) {
            var executeParam = { SPName: 'TrustManagement.usp_SaveTrustDateSet', SQLParams: [] };
            executeParam.SQLParams.push({ Name: 'TrustId', Value: BusinessIdentifier, DBType: 'int' });
            executeParam.SQLParams.push({ Name: 'WorkSessionId', Value: sessionId, DBType: 'string' });
            var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
            var pop = mac.wait("Data Saving");
            CallWCFSvc(serviceUrl, false, 'GET', function (data) {
                //alert('保存成功!');
                if (pop != null) {
                    pop.close();
                    pop = mac.complete("Saved Successfully!");
                }

                //var isRevolving = $('#TrustIsTopUpAvaliable').is(':checked');
                //var tpi = new TaskProcessIndicatorHelper();
                //tpi.AddVariableItem('TrustId', trustId, 'String');
                //tpi.AddVariableItem('IsRevolving', isRevolving, 'String');
                //tpi.ShowIndicator('Task', 'TrustWizard_CashflowStressTest', function () { });
            });
        });

    }
    function GenerateCashflowModel() {
        var isRevolving = $('#TrustIsTopUpAvaliable').is(':checked');
        var tpi = new TaskProcessIndicatorHelper();
        tpi.AddVariableItem('TrustId', trustId, 'String');
        tpi.AddVariableItem('IsRevolving', isRevolving, 'String');
        tpi.ShowIndicator('Task', 'TrustWizard_CashflowStressTest', function () { });

    }
    function ShowCashflowModel() {
        var executeParam = { SPName: 'TrustManagement.usp_GetCashflowTaskByTrustId', SQLParams: [] };
        executeParam.SQLParams.push({ Name: 'TrustId', Value: BusinessIdentifier, DBType: 'int' });
        var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
        CallWCFSvc(serviceUrl, false, 'GET', function (data) {
            var tcode = data[0]['CashflowTaskCode'];
            window.open(GlobalVariable.CashflowStudioURL + "&taskCode=" + tcode, '_blank');
        });

    }
    function getShotTemplate(arr) {
        return {
            "Category": arr.Category, "SPId": arr.SPId, "SPCode": arr.SPCode, "SPRItemCode": arr.SPRItemCode, "TBId": arr.TBId, "ItemId": arr.ItemId, "ItemCode": arr.ItemCode, "ItemValue": arr.ItemValue
        };
    }

    //验证
    var TrustMngmtRegxCollection = {
        //int: /^[-]{0,1}[1-9]{1,}[0-9]{0,}$/,
        int: /^[-]?[1-9]+\d*$|^0$/,
        //decimal: /^[-]?[1-9]+\d*(\.{1}\d+){0,1}$/,
        decimal: /^[-]?[1-9]+\d*(\.{1}\d+){0,1}$|^[-]{1}0\.\d*[1-9]\d*$|^0(\.\d+)?$/,
        date: /^(\d{4})-(\d{2})-(\d{2})$/,
        datetime: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/
    };
    function validControlValue(obj) {
        var $this = $(obj);
        var objValue = $this.val();
        var valids = $this.attr('data-valid');

        //无data-valid属性，不需要验证
        if (!valids || valids.length < 1) {
            return true;
        }

        //如果有必填要求，必填验证
        if (valids.indexOf('Required') >= 0) {
            if (!objValue || objValue.length < 1) {
                $this.addClass('red-border');
                return false;
            } else {
                $this.removeClass('red-border');
            }
        }
        //暂时只考虑data-valid只包含两个值： 必填和类型
        var dataType = valids.replace('Required', '').toLocaleLowerCase().trim();

        //通过必填验证，做数据类型验证
        var regx = TrustMngmtRegxCollection[dataType];
        if (!regx) {
            return true;
        }

        if (!regx.test(objValue)) {
            $this.addClass('red-border');
            return false;
        } else {
            $this.removeClass('red-border');
        }
        return true;
    }

    function validControls(obj) {
        var validPass = true;
        $(obj).each(function () {
            var $this = $(this);
            if (!validControlValue($this)) {
                validPass = false;
            }
        });
        return validPass;
    }

    function validation() {
        //验证
        return validControls("#TrustExtensionDiv input[data-valid]:enabled:visible");
    }

    function validStepControlsBeforeLeaving() {
        return validation();
    }

    // end 验证

    //保存信息到working.SessionContext中
    function saveWorkingSessionContext(sessionContext, callback) {
        var serviceUrl = DataProcessServiceUrl + "SaveWorkingSessionContextPlus";

        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: sessionContext,
            success: function (response) {
                callback(response);
            },
            error: function (response) { alertMsg("Saving Error", 1); }
        });
    }


    return {
        Init: init
        , SaveTrustDateSet: saveTrustDateSet
        , GenerateCashflowModel: GenerateCashflowModel
        , ShowCashflowModel: ShowCashflowModel
        , CalcDateType: calcDateType
        , AddR: addR
        , DeleteR: deleteR
        , AddBase: addBase
        , DeleteBase: deleteBase
        , AddJsr: addJsr
        , DeleteJsr: deleteJsr
        , ConditionChanged: conditionChanged
        , VShowOrHide: vShowOrHide
        , GetDateSetListByCode: getDateSetListByCode
        , test: function () {
        }
    }
})();
var TrustExtensionNameSpace = {
    GetDateSetListByCode: DateSetModel.GetDateSetListByCode
};

var trustId;
$(function () {

    DateSetModel.Init();

});

var DataSetTools = {
    RQcheck: function (RQ) {
        var date = RQ;
        var result = date.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);

        if (result == null)
            return false;
        var d = new Date(result[1], result[3] - 1, result[4]);
        return (d.getFullYear() == result[1] && (d.getMonth() + 1) == result[3] && d.getDate() == result[4]);
    }
}

var DataTemplate = {
    SaveAsTemplate: function () {
        top.GSDialog.Prompt('保存模板', '模板名称：', null, 'text', function (action, val) {
            if (action != 'ok') return;
            Loading.Show('正在保存模板...');
            var executeParam = { SPName: 'Template.usp_SaveCashflowSettingsTemplate', SQLParams: [] };
            executeParam.SQLParams.push({ Name: 'TrustId', Value: trustId, DBType: 'int' });
            executeParam.SQLParams.push({ Name: 'TemplateName', Value: val, DBType: 'string' });
            var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustTemplate&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
            CallWCFSvc(serviceUrl, true, 'GET', function (d) {
                Loading.Close();
                alertMsg('保存成功！');
                top.GSDialog.Close(0);
            });
        });

    },

    ChooseTemplate: function () {
        var dialogPage = '/QuickWizardService/Pages/CashflowStressTest/ViewTrustDateSet_Dialog.html?trustId=' + trustId + '&templateType=CashflowSettings';
        parent.qwFrame.ReloadStep('fee');
        parent.qwFrame.ReloadStep('sequence');
        //return;
        top.GSDialog.Open('选择模板', dialogPage, {}, function (val) {
            if (!val) { return; }
            Loading.Show('正在应用模板...');
            var executeParam = { SPName: 'Template.usp_ApplyCashflowSettingsTemplate', SQLParams: [] };
            executeParam.SQLParams.push({ Name: 'TrustId', Value: trustId, DBType: 'int' });
            executeParam.SQLParams.push({ Name: 'TemplateID', Value: val, DBType: 'string' });
            var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustTemplate&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
            CallWCFSvc(serviceUrl, true, 'GET', function (d) {
                Loading.Close();
                parent.qwFrame.ReloadStep('fee');
                parent.qwFrame.ReloadStep('sequence');
                parent.qwFrame.ReloadStep('prepaid');
                parent.qwFrame.ReloadStep('stress');
				
                window.location.reload();
            });

        }, 500, 200);
    }
};
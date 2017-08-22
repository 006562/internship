var TrustExtensionNameSpace = {
    //---------------------页面信息----------------------
    TrustExtensionPage: {
        Code: "TrustExtensionItem"
    },
    TEShowInfo: [],
    TrustExtensionData: {},
    isFirst: true,
    //---------------------获取页面显示信息逻辑----------------------
    //根据获取到的字符串，处理生成页面逻辑所需对象TrustExtensionData
    TEShowInit: function () {
        var self = TrustExtensionNameSpace;
        if (self.TEShowInfo.length > 0) {
            self.TrustExtensionData.DateSetList.HaveDataList = [];
            self.TrustExtensionData.DateSetList.NoHaveDataList = [];
            self.TrustExtensionData.JSRList.HaveDataList = [];
            self.TrustExtensionData.JSRList.NoHaveDataList = [];
            var jsrListTmp = {};

            $.each(self.TEShowInfo, function (i, n) {
                //ItemCode, ItemAliasValue, ItemValue, dataType,IsDisplay
                var singledata = self.singleColumn(n.ItemCode, n.ItemAliasValue, n.ItemValue, n.DataType, n.IsDisplay, n.IsKey);
                self.TrustExtensionData.DateSetList.HaveDataList.push(singledata);
            });
        }
    },
    //---------------------页面保存逻辑----------------------
    //根据TrustExtensionData对象，生成最终保存所需结果字符串
    //TESaveInfo，处理TEResult出最终结果ko.mapping.toJSON(TEResult)为最终结果
    TESaveInfo: function () {
        var self = TrustExtensionNameSpace;
        var TEResult = [];

        if (self.TrustExtensionData.DateSetList.HaveDataList().length > 0) {
            $.each(self.TrustExtensionData.DateSetList.HaveDataList(), function (i, n) {
                TEResult.push(self.GetTEResultTemplate(n.ItemCode(), n.ItemValue()));
            });
        }
        return TEResult;
    },
    GetTEResultTemplate: function (ItemCode, ItemValue) {
        return TRUST.api.getTemplate(ItemCode, ItemValue);
    },
    //---------------------页面逻辑----------------------
    //TrustExtensionData：页面操作对象
    //单字段对象
    singleColumn: function (ItemCode, ItemAliasValue, ItemValue, DataType, IsDisplay, IsKey) {
        var self = TrustExtensionNameSpace;
        return {
            "ItemCode": ItemCode,
            "ItemAliasValue": ItemAliasValue,
            "ItemValue": ItemValue,
            "DataType": DataType,
            "IsCompulsory": "0",
            "IsDisplay": IsDisplay,
            "IsKey": IsKey,
            "cls": self.GetCss(DataType)
        };
    },
    GetCss: function (DataType) {
        if (DataType == null || typeof DataType == "undefined")
            return "form-control";
        else {
            DataType = DataType.toLocaleLowerCase();
            if (DataType == "string")
                return "form-control";
            else if (DataType == "date")
                return "form-control date-plugins";
            else
                return "form-control";
        }
    },
    //JSON数据
    TrustExtensionFunc: function () {
        var self = TrustExtensionNameSpace;
        this.DateSetList = {
            HaveDataList: [
                //singleColumn("PoolCloseDate", "资产池封包日", "2016-4-25", "date", false),
            ],
            NoHaveDataList: []
        };
        this.JSRList = {
            HaveDataList: [
                //tableColumn("AssetProviderReportDate", "资产服务机构报告日", "2016-4-25", "PoolCloseDate", "2",true),
            ],
            NoHaveDataList: []
        }
    },
    GetDateSetListByCode: function (type, keycode, valuecode) {
        var self = TrustExtensionNameSpace;
        return self.TrustExtensionData.GetDateSetListByCode(type, keycode, valuecode);
    },
    GetTestData: function () {
        var httt = $.ajax({
            async: false,
            url: "viewTrustExtensionJson.txt",
            contentType: "application/json;charset=utf-8"
        });

        return JSON.parse(httt.responseText);
    },
    testUtil: function () {
        var self = TrustExtensionNameSpace;
        var temparray = self.TrustExtensionElement.update();
        $.each(temparray, function (i, n) {
            n.ItemValue = TRUST.ConvertDataByUtil("get", n.DataType, n.ItemValue, n.UnitOfMeasure, n.Precise);
        });

        $("#TemText").val(JSON.stringify(temparray));
    },
    ArraySort: function (array, sortno, sorttype) {
        if (array == null || typeof array == "undefined" || array.length <= 0 || sortno == null || typeof sortno == "undefined")
            return array;
        if (sorttype == null || typeof sorttype == "undefined" || $.trim(sorttype).length == 0)
            sorttype = "asc";

        var myObservableArray = ko.observableArray(array);

        myObservableArray.sort(function (left, right) {
            if (typeof left[sortno] == "undefined" || typeof right[sortno] == "undefined" || parseInt(right[sortno]) != right[sortno] || parseInt(left[sortno]) != left[sortno])
                return 0;
            else {
                var l = parseInt(left[sortno]);
                var r = parseInt(right[sortno])
                return l == r ? 0 : (l > r ? 1 : -1);
            }
        })

        array = myObservableArray();
        return array;
    },
    //日期对象初始化
    TrustExtensionElement: {
        init: function () {
            console.log("TrustExtensionElement init ... ");
            var self = TrustExtensionNameSpace;
            //debugger;
            if (self.isFirst) {
                var node = document.getElementById('TrustExtensionDiv');

                self.TrustExtensionData = new self.TrustExtensionFunc();
                //try {
                //    var data = self.GetTestData();
                //}
                //catch (ex) {
                //    var data = this.getCategoryData('TrustExtensionItem');
                //}
                //TRUST.SetDataArrayByUtil(data);
                var data = this.getCategoryData();

                //self.ArraySort(data, "SequenceNo"); //外侧已统一排序，这里暂时注释
                //$("#TemText").val(JSON.stringify(data));
                //console.log(data);
                self.TEShowInfo = data;//获取到的数据
                self.TEShowInit();//调用TEShowInfo给TrustExtensionData赋值
                self.TrustExtensionData = ko.mapping.fromJS(self.TrustExtensionData);
                ko.applyBindings(self.TrustExtensionData, node);

                self.isFirst = false;

                self.dateSetType();
            }
        },
        update: function () {
            var self = TrustExtensionNameSpace;
            var result = self.TESaveInfo();
            return result;
        },
        validation: function () {
            //验证
            return this.validControls("#TrustExtensionDiv input[data-valid]");
        }
    },
    //日期空间挂钩子
    dateSetType: function () {
        $("#TrustExtensionDiv").find('.date-plugins').date_input();
    }
};

TRUST.registerMethods(TrustExtensionNameSpace.TrustExtensionElement);

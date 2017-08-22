

var TrustItemModule = (function () {

    var viewModel = null;

    var wcfdata = [
        //{ Category: "TrustItem", ItemId: "", ItemCode: "TrustCode", ItemValue: "JD1001", ItemAliasValue: "产品代码", IsCompulsory: true, DataType: "txt", },
        //{ Category: "TrustItem", ItemId: "", ItemCode: "Trustname", ItemValue: "", ItemAliasValue: "信息披露频率", IsCompulsory: true, DataType: "Select", },
        //{ Category: "TrustItem", ItemId: "", ItemCode: "TrustCode", ItemValue: "京东金融", ItemAliasValue: "产品名称", IsCompulsory: true, DataType: "txt", },
        //{ Category: "TrustItem", ItemId: "", ItemCode: "TrustCode", ItemValue: "", ItemAliasValue: "支持循环结构", IsCompulsory: false, DataType: "bool", },
        //{ Category: "TrustWaterFall", ItemId: "", ItemCode: "TrustWaterFallCode", ItemValue: "20170212,10000,12%|20170312,10000,13%|20170412,10000,15%", ItemAliasValue: "信托现金流", iscompulsory: true, DataType: "Date", },
        //{ Category: "TrustWaterFall", ItemId: "", ItemCode: "TrustWaterFallCode", ItemValue: "20170212,,|20160712,10000,8%", ItemAliasValue: "信托现金流", IsCompulsory: true, DataType: "Date", }
    ];

    var itemidtemp = "";
    var itemcodetemp = "";
    var Categorytemp = "";
    var datatypetemp = "";

    var wcfsavedata = [];

    var trustitemdata = {
        displayFields: [], optionalFields: [], BondFields: [], ZXFields: [],
        logkeyup: function (place, event) {
            //self.lastInterest(place.price());
            var number = new FormatNumber();
            number.checkNumberFunc({}, event, place.ItemValue);

        },
        formatp: function (p) {
            var number = new FormatNumber();

            if (parseFloat(p) == p) {
                var ret = number.convertNumberN(1, p);
                return ret;
            }
            //else
               // return p == "" ? "0.00" : (p == null ? "0.00" : p);
        }
    };


    var initArgs = function (data) {
        wcfdata = data;
    };

    function Trustjson(obj) {
        var json = {
            Category: obj.Category,
            ItemId: obj.ItemId,
            ItemCode: obj.ItemCode,
            ItemAliasValue: obj.ItemAliasValue,
            ItemValue: obj.ItemValue,
            DataType: obj.DataType,
            IsCompulsory: obj.IsCompulsory,
            SPId: obj.SPId,
            SPCode: obj.SPCode,
            SPRItemCode: obj.SPRItemCode,
            TBId: obj.TBId,
            UnitOfMeasure: obj.UnitOfMeasure,
            Precise: obj.Precise
        };
        if (obj.DataType == "Select") {
            //json.RemittanceFrequencyOptionValues = getOptionsSource(obj.ItemCode);
            // if(obj.ItemCode=="RemittanceFrequency")
            //   json.RemittanceFrequencyOptionValues = ['每月', '每季度', '每年'];
            //  else if (obj.ItemCode == "OrganisationName")
            //    json.RemittanceFrequencyOptionValues = ['CMS'];
            //  else if (obj.ItemCode == "ExchangeCenter")
            //   json.RemittanceFrequencyOptionValues = ['深圳交易所', '上海交易所'];
        }
        else if (obj.DataType == "bool") {
            json.ItemValue = obj.ItemValue == 1 || obj.ItemValue.toLowerCase() == "true";
        }
        else if (obj.DataType == "Date") {
            if (obj.ItemValue == "") {
                var myDate = new Date();
                json.ItemValue = DateToString(myDate);
            }
            else {
                json.ItemValue = DateToString(GetDate(obj.ItemValue));
            }
        }
        else if (obj.DataType == "Int") {
            if (obj.ItemValue == "") {
                json.ItemValue = 0;
            }
        }
        return json;
    }


    var GetDate = function (datestr) {
        if (datestr != null && typeof datestr != "undefined")
            return new Date(datestr.split("-")[0], datestr.split("-")[1] - 1, datestr.split("-")[2])
        else
            return null;
    }

    var DateToString = function (date) {
        var month = (date.getMonth() + 1).toString();
        var dom = date.getDate().toString();
        if (month.length == 1) month = "0" + month;
        if (dom.length == 1) dom = "0" + dom;
        return date.getFullYear() + "-" + month + "-" + dom;
    }


    function TrustJsonSave(obj) {
        var jsonsave = { Category: obj.Category, ItemId: obj.ItemId, ItemCode: obj.ItemCode, ItemValue: obj.ItemValue };
        return jsonsave;
    }

    var addNew = function () {
        var index = document.getElementById('selOptionalFields').value;
        if (index != "" && index > -1) {
            var oNew = viewModel.optionalFields()[index];
            viewModel.optionalFields.remove(oNew);
            viewModel.displayFields.push(oNew);
        }

        dateSetType();
    }


    function removeLi(obj) {
        var $obj = $(obj);
        if ($obj.hasClass('dataRequired')) {
            return
        }
        var index = $obj.attr('dataIndex');
        var oNew = viewModel.displayFields()[index];
        viewModel.displayFields.remove(oNew);
        viewModel.optionalFields.push(oNew);
    }


    var addZXItem = function () {
        var json = {
            Category: "TrustInfoExtensionItem",
            ItemId: itemidtemp,
            ItemCode: itemcodetemp,
            ItemAliasValue: "",
            ItemValue: "",
            DataType: datatypetemp,
            IsCompulsory: true,
            SPId: "",
            SPCode: "",
            SPRItemCode: "",
            TBId: "",
            UnitOfMeasure: "",
            Precise: ""
        }

        viewModel.ZXFields.push(ko.mapping.fromJS(json));
    }

    function removeZXItem(obj) {
        var $obj = $(obj);

        var index = $obj.attr('dataIndex');
        var oNew = viewModel.ZXFields()[index];
        viewModel.ZXFields.remove(oNew);


    }

    function TrustInfoExtensionjson(obj) {
        var temp = obj.ItemValue.split('|')
        Categorytemp = obj.Category;
        itemidtemp = obj.ItemId;
        itemcodetemp = obj.ItemCode;
        datatypetemp = obj.DataType;
        if (temp == "")
            return;
        for (var i = 0; i < temp.length; i++) {
            var json = {
                Category: "TrustInfoExtensionItem",
                ItemId: obj.ItemId,
                ItemCode: obj.ItemCode,
                Specialplanname: obj.ItemAliasValue,
                ItemValue: temp[i],
                DataType: obj.DataType,
                IsCompulsory: true,
                SPId: "",
                SPCode: "",
                SPRItemCode: "",
                TBId: "",
                UnitOfMeasure: "",
                Precise: ""
            }
            trustitemdata.ZXFields.push(ko.mapping.fromJS(json));
        }
    }



    function viwModelBinding() {
        console.log(trustitemdata);
        var obj = eval(wcfdata);
        for (var i = 0; i < obj.length; i++) {
            var oNew = "";
            switch (obj[i].Category) {
                case "TrustItem":
                    oNew = Trustjson(obj[i]);
                    if (obj[i].IsCompulsory.toLowerCase() == "true" || obj[i].ItemValue != "")
                        trustitemdata.displayFields.push(oNew);
                    else
                        trustitemdata.optionalFields.push(oNew);
                    break;
                case "TrustWaterFall":

                    break;
                case "TrustInfoExtensionItem":
                    oNew = Trustjson(obj[i]);
                    if (obj[i].IsCompulsory.toLowerCase() == "true" || obj[i].ItemValue != "") {
                        if (obj[i].ItemCode.endWith("_T")) {
                            trustitemdata.BondFields.push(oNew);
                        }
                        else if (obj[i].ItemCode.endWith("_ZX")) {
                            TrustInfoExtensionjson(obj[i]);
                            // trustitemdata.ZXFields.push(oNew);
                        }
                        else {
                            trustitemdata.displayFields.push(oNew);
                        }
                    }
                    else {
                        if (obj[i].ItemCode.endWith("_T")) {
                            trustitemdata.BondFields.push(oNew);
                        }
                        else if (obj[i].ItemCode.endWith("_ZX")) {

                            TrustInfoExtensionjson(obj[i]);
                            // trustitemdata.ZXFields.push(oNew);
                        }
                        else {
                            trustitemdata.optionalFields.push(oNew);
                        }
                    }
                    break;
            }
        }
        console.log("trustitemdata:" + trustitemdata);
        console.log(trustitemdata);
        var node = document.getElementById('TrustItemDiv');
        viewModel = ko.mapping.fromJS(trustitemdata);

        ko.applyBindings(viewModel, node);
        ismark = true;
        trustitemdata = viewModel;


    }

    function dateSetType() {
        $("#TrustItemDiv").find('.date-plugins').date_input();
    }

    String.prototype.endWith = function (endStr) {
        var d = this.length - endStr.length;
        return (d >= 0 && this.lastIndexOf(endStr) == d)
    }

    function ShowIndex(index) {
        return parseInt(index) + 1;
    }

    function ReturnviewModel() {
        return viewModel;
    }


    function preview() {
        var mm = TrustItemModule.ReturnviewModel();
        var jsontemp = ko.mapping.toJSON(mm);
        var obj = eval('(' + jsontemp + ')');

        var print_tpl = '<div class="ItemBox"><h3 class="h3">{0}</h3><div class="ItemInner">{1}</div></div>';

        var lable = "";
        $.each(obj.displayFields, function (i, n) {
            // this指向问题
            var s = n.DataType == "bool" ? (n.ItemValue ? "是" : "否") : n.ItemValue;
            if (n.ItemCode == "IssueAmount") {
                if (n.ItemValue == "" || n.ItemValue == null)
                    s = "0.00";
            }
            if (n.DataType == "Select") {
                s = getCodeDictionaryValue(n.ItemCode, n.ItemValue);
            }
            lable += "<div class=\"Item\"><label>" + n.ItemAliasValue + "</label><span>" + s + "</span></div>";
        })


        $.each(obj.BondFields, function (i, n) {
            // this指向问题
            var s = n.DataType == "bool" ? (n.ItemValue ? "是" : "否") : n.ItemValue;
            if (n.ItemCode == "IssueAmount") {
                if (n.ItemValue == "" || n.ItemValue == null)
                    s = "0.00";
            }
            if (n.DataType == "Select") {
                s = getCodeDictionaryValue(n.ItemCode, n.ItemValue);
            }
            lable += "<div class=\"Item\"><label>" + n.ItemAliasValue + "</label><span>" + s + "</span></div>";
        })



        $.each(obj.ZXFields, function (i, n) {
            // this指向问题
            var s = n.DataType == "bool" ? (n.ItemValue ? "是" : "否") : n.ItemValue;
            if (n.ItemCode == "IssueAmount") {
                if (n.ItemValue == "" || n.ItemValue == null)
                    s = "0.00";
            }
            if (n.DataType == "Select") {
                s = getCodeDictionaryValue(n.ItemCode, n.ItemValue);
            }
            lable += "<div class=\"Item\"><label>" + "增信措施" + "</label><span>" + s + "</span></div>";

        })

        console.log(print_tpl.format("产品信息", lable));
        return print_tpl.format("产品信息", lable);
    }

    function getCodeDictionaryValue(categoryCode, valueShort) {
        //OptionSource 在viewTrustWizard.js里全局变量
        if (OptionSource != null) {
            var items = $.grep(OptionSource, function (item) {
                return item.CategoryCode == categoryCode && item.ValueShort == valueShort;
            });
            if (items.length > 0) {
                return items[0].Value;
            }
        }
        else {
            return "";
        }
    }


    function getItemValuebyItemCode(obj) {
        var itemvalue = "";
        //   obj = "OrganisationName";
        var mm = TrustItemModule.ReturnviewModel();
        var jsontemp = ko.mapping.toJSON(mm);
        var data = eval('(' + jsontemp + ')');

        $(data.displayFields).each(function (index, item) {
            if (item.ItemCode == obj)
                itemvalue = item.ItemValue;
        });//index是元素的索引，item是该元素
        console.log(itemvalue);
        return itemvalue;
    }

    //金额格式化显示
    function fmoney(obj, s, n) {
        if (s == "") {
            $(obj).val("0.00");
            setCursorPosition(obj, 1);
            return;
        }
        n = n > 0 && n <= 20 ? n : 2;
        s = s.replace(",", "");
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
        t = "";
        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }


        $(obj).val(t.split("").reverse().join("") + "." + r);
        //return t.split("").reverse().join("") + "." + r;

        setCursorPosition(obj, 1);
        //var obj = document.getElementById('input');
        //obj.focus();
        //var a = $(obj).createTextRange();
        //a.moveStart('character', 1);
        //a.collapse(true);
        //a.select();
    }

    /*
 * 设置输入域(input/textarea)光标的位置
 * @param {HTMLInputElement/HTMLTextAreaElement} elem
 * @param {Number} index
 */
    function setCursorPosition(elem, index) {
        var val = elem.value
        var len = val.length

        // 超过文本长度直接返回
        if (len < index) return
        setTimeout(function () {
            elem.focus()

            if (elem.setSelectionRange) { // 标准浏览器
                elem.setSelectionRange(len - 3, len - 3)
            } else { // IE9-
                var index1 = range.selectionStart;
                alert(index1)
                var range = elem.createTextRange()
                range.moveStart("character", -len)
                range.moveEnd("character", -len)
                range.moveStart("character", len - 3)
                range.moveEnd("character", 0)
                range.select()
            }
        }, 10)
    }

    //金额格式化还原
    function rmoney(s) {
        return parseFloat(s.replace(/[^\d\.-]/g, ""));
    }

    function getItemValueByCode(code) {
        var result = null;
        $.each(trustitemdata.displayFields(), function (i, n) {
            if (n.ItemCode() == code){
                result = n.ItemValue();
                return false;
            }
        });
        return result;
    }

    return {
        initArgs: initArgs,
        viwModelBinding: viwModelBinding,
        AddItem: addNew,
        RemoveItem: removeLi,
        ReturnviewModel: ReturnviewModel,
        preview: preview,
        getItemValuebyItemCode: getItemValuebyItemCode,
        fmoney: fmoney,
        dateSetType: dateSetType,
        addZXItem: addZXItem,
        removeZXItem: removeZXItem,
        getItemValueByCode: getItemValueByCode
    };
})();



var TrustItem = {
    // init 和 update 为必须
    init: function () {
        // 初始化绑定数据
        var data = this.getCategoryData('TrustItem');
        data1 = this.getCategoryData('TrustInfoExtensionItem');
        Array.prototype.push.apply(data, data1);

        // 这里用于绑定数据后赋值给全局变量
        TrustItemModule.initArgs(data);

        console.log(TrustItemModule);

        TrustItemModule.viwModelBinding();
        TrustItemModule.dateSetType();
        //this.registControlsValueChange(':input');
    },
    // 上传数据 
    update: function () {
        // 将数据转换成字符串并拼接

        var self = this;
        var mm = TrustItemModule.ReturnviewModel();
        var jsontemp = ko.mapping.toJSON(mm);

        var obj = eval('(' + jsontemp + ')');
        var tpl = [];
        var datastring = "";
        var Category = "TrustInfoExtensionItem";
        var itemcode = "";
        var itemid = "";
        var spid = "";
        var spcode = "";
        var spritemcode = "";
        var TBId = "";
        var DataType = "";
        var UnitOfMeasure = "";
        var Precise = "";


        $.each(obj.displayFields, function (i, n) {
            // this指向问题
            //  tpl += self.template.format(n.Category, n.SPId, n.SPCode, n.SPRItemCode, n.TBId, n.ItemId, n.ItemCode, n.ItemValue);
            var objtemp = TRUST.api.getTemplate(n.Category, n.SPId, n.SPCode, n.SPRItemCode, n.TBId, n.ItemId, n.ItemCode, n.ItemValue, n.DataType, n.UnitOfMeasure, n.Precise);
            tpl.push(objtemp);
        })



        $.each(obj.BondFields, function (i, n) {
            // this指向问题
            //  tpl += self.template.format(n.Category, n.SPId, n.SPCode, n.SPRItemCode, n.TBId, n.ItemId, n.ItemCode, n.ItemValue);
            var objtemp = TRUST.api.getTemplate(n.Category, n.SPId, n.SPCode, n.SPRItemCode, n.TBId, n.ItemId, n.ItemCode, n.ItemValue, n.DataType, n.UnitOfMeasure, n.Precise);
            tpl.push(objtemp);
        })

        var datastring = '';
        $.each(obj.ZXFields, function (i, n) {
            // this指向问题
            //  tpl += self.template.format(n.Category, n.SPId, n.SPCode, n.SPRItemCode, n.TBId, n.ItemId, n.ItemCode, n.ItemValue);

            Category = n.Category;
            itemcode = n.ItemCode;
            itemid = n.ItemId;
            spid = n.SPId;
            spcode = n.SPCode;
            spritemcode = n.SPRItemCode;
            TBId = n.TBId;
            DataType = n.DataType;
            UnitOfMeasure = n.UnitOfMeasure;
            Precise = n.Precise;
            datastring += n.ItemValue + "|";
        })
        var objtemp = TRUST.api.getTemplate(Category, spid, spcode, spritemcode, TBId, itemid, itemcode, datastring.substring(0, datastring.length - 1), DataType, UnitOfMeasure, Precise);
        tpl.push(objtemp);

        console.log(tpl);
        return tpl;
    },
    //预览
    preview: function () {
        return TrustItemModule.preview();
    },
    validation: function () {
        // return this.validControls('#TrustItemDiv');
        return this.validControls('#TrustItemDiv input[data-valid]');
    }
}

// 注册我的方法
TRUST.registerMethods(TrustItem);


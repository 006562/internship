/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/jquery.min.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/App.Global.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/common.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/knockout-3.4.0.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/knockout.mapping-latest.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/TaskIndicatorScript.js" />
/// <reference path="E:\TFS-Local\SFM\Source\JD_UAT\QuickWizardService\QuickWizard\Scripts/asyncBoxDialog.js" />

document.write("<script language=javascript src='../../Scripts/common.js'></script>");
document.write("<script language=javascript src='../../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../../Scripts/renderControl.js'></script>");

var BusinessCode = GlobalVariable.Business_Trust;
var BusinessIdentifier;
var set;

var viewModel;

var dataModel = {
    'zh-CN': {
        Title1: '违约率设置 (Default Timing)',
        Title2: '回收分布设置 (Recovery Timing)',
        Title3: '还款分布设置 (Amortisation Vector)',
        Fields1: [
            { Text: '常数值', Code: 'ConstantValue1', UIType: 'Input', Value: '', Disabled: false },
            { Text: '期数', Code: 'Periods1', UIType: 'Input', Value: '12', Disabled: false }
        ],
        Fields2: [
            { Text: '常数值', Code: 'ConstantValue2', UIType: 'Input', Value: '', Disabled: false },
            { Text: '期数', Code: 'Periods2', UIType: 'Input', Value: '3', Disabled: false }
        ],
        Fields3: [
            { Text: '常数值', Code: 'ConstantValue3', UIType: 'Input', Value: '', Disabled: false },
            { Text: '期数', Code: 'Periods3', UIType: 'Input', Value: '12', Disabled: false }
        ],
        DisplayText: {
            Refresh: "刷新曲线", Save: "保存数据", AmortisationVector: '还款分布曲线', DefaultTimingCurve: '违约时间分布曲线', RecoveryTimingCurve: '预估回收分布曲线',
            Percent: '百分比(%)', Clear: '清除', Show: '生成'
        }
    },
    'en-US': {
        Fields: [
            { Text: 'Constant', Code: 'ConstantValue3', UIType: 'Input', Value: '', Disabled: false },
            { Text: 'Periods', Code: 'Periods', UIType: 'Input', Value: '6', Disabled: false }
        ],
        DisplayText: {
            Refresh: "Refresh Curve", Save: "Save Data", PreCurve: 'Prediction Default Curve', Percent: 'Percent(%)', Clear: 'Clear'
        }
    }
};
var viewModel;
var currentPeriod1 = 12;
var currentPeriod2 = 3;
var currentPeriod3 = 12;
var currentValue1 = '0,0,0,0,0,0,0,0,0,0,0,0';
var currentValue2 = '0,0,0';
var currentValue3 = '0,0,0,0,0,0,0,0,0,0,0,0';

$(function () {
    var allDatas;
    set = getLanguageSet();
    BusinessIdentifier = getQueryString("id");

    var executeParam = { SPName: 'TrustManagement.Project.usp_GetStressTestData', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'TrustId', Value: BusinessIdentifier, DBType: 'int' });
    executeParam.SQLParams.push({ Name: 'PageStep', Value: 'stress', DBType: 'string' });
    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
        allDatas = data;
        //callback(data);
    });
    var DefaultTimingItem = $.grep(allDatas, function (item) { return item.ItemCode == 'DefaultTiming'; });
    var RecoveryTimingVector = $.grep(allDatas, function (item) { return item.ItemCode == 'RecoveryTiming'; });
    var AmortisationVectorItem = $.grep(allDatas, function (item) { return item.ItemCode == 'AmortisationVector'; });

    var DefaultTimingItemValue = DefaultTimingItem[0].ItemValue;
    var RecoveryTimingItemValue = RecoveryTimingVector[0].ItemValue;
    var AmortisationVectorItemValue = AmortisationVectorItem[0].ItemValue;

    //var itemCode = 'PP';
    //var itemValue = '1,1,1,1';

    //dataModel[set].Fields1[1].Value = DefaultTimingItemValue;
    //dataModel[set].Fields2[1].Value = AmortisationVectorItemValue;
    //dataModel[set].Fields3[1].Value = RecoveryTimingItemValue;

    viewModel = ko.mapping.fromJS(dataModel[set]);
    ko.applyBindings(viewModel, $('#page_main_container').get(0));

    currentPeriod1 = chartOperation1.Init(DefaultTimingItemValue, currentPeriod1);
    currentPeriod2 = chartOperation2.Init(RecoveryTimingItemValue, currentPeriod2);
    currentPeriod3 = chartOperation3.Init(AmortisationVectorItemValue, currentPeriod3);

    viewModel.Fields1()[1].Value(currentPeriod1);
    viewModel.Fields2()[1].Value(currentPeriod2);
    viewModel.Fields3()[1].Value(currentPeriod3);

    $('#loading').fadeOut();
});

var StressTestModule1 = (function () {
    var refreshCurve = function () {

        var rateValue = '';
        
        rateValue = [];
        $('#tblRates1 tbody tr td').each(function () {
            rateValue.push($(this).text());
        });
        //chartOperation1.DrawChart();
        chartOperation1.Init(rateValue.join(','), currentPeriod1);
        //console.log(currentValue1);
    }

    var save = function () {
        //var pop = mac.wait("Data Saving");
        var itemValue = currentValue1;
        //saveData(itemValue, 16001);
		saveData(itemValue, "DefaultTiming");
        //if (pop != null) {
        //    pop.close();
        //    pop = mac.complete("Saved Successfully!");
        //}
    }

    var clear =  function() {
        //alter(obj.Title2);
        //viewModel.Fields1()[1].Disabled(false);
        //viewModel.Fields1()[1].Value(0);
        chartOperation1.Init('0', currentPeriod1);
    }

    var generate = function () {
        var constantValue = $('#ConstantValue1').val();
        if (constantValue == '') {
            $('#ConstantValue1').addClass('red-border');
            return;
        }
        $('#ConstantValue1').removeClass('red-border');
        
        //viewModel.Fields1()[1].Value(0);
        currentPeriod1 = $('#Periods1').val();
        chartOperation1.Init(constantValue, currentPeriod1);
    }

    return {
        RefreshCurve1: refreshCurve,
        Save1: save,
        Clear1: clear,
        Generate1: generate
    };
})();

var StressTestModule2 = (function () {
    var refreshCurve = function () {

        var rateValue = '';

        rateValue = [];
        $('#tblRates2 tbody tr td').each(function () {
            rateValue.push($(this).text());
        });
        //chartOperation1.DrawChart();
        chartOperation2.Init(rateValue.join(','), currentPeriod2);
        //console.log(currentValue2);
    }

    var save = function () {
        //var pop = mac.wait("Data Saving");
        var itemValue = currentValue2;
        //saveData(itemValue, 16002);
		saveData(itemValue, "RecoveryTiming");
        //if (pop != null) {
        //    pop.close();
        //    pop = mac.complete("Saved Successfully!");
        //}
    }

    var clear = function () {
        //alter(obj.Title2);
        //viewModel.Fields2()[1].Disabled(false);
        //viewModel.Fields2()[1].Value(0);
        chartOperation2.Init('0', currentPeriod2);
    }
    
    var generate = function () {
        var constantValue = $('#ConstantValue2').val();
        if (constantValue == '') {
            $('#ConstantValue2').addClass('red-border');
            return;
        }
        $('#ConstantValue2').removeClass('red-border');

        //viewModel.Fields2()[1].Value(0);
        currentPeriod2 = $('#Periods2').val();
        chartOperation2.Init(constantValue, currentPeriod2);
    }

    return {
        RefreshCurve2: refreshCurve,
        Save2: save,
        Clear2: clear,
        Generate2: generate
    };

    
})();

var StressTestModule3 = (function () {
    var refreshCurve = function () {
        var rateValue = '';

        rateValue = [];
        $('#tblRates3 tbody tr td').each(function () {
            rateValue.push($(this).text());
        });
        //chartOperation1.DrawChart();
        chartOperation3.Init(rateValue.join(','), currentPeriod3);
        //console.log(currentValue3);


        //var $period = $('#Periods3');
        //if ($period.val() == '') {
        //    $period.addClass('red-border');
        //    return;
        //}
        //$way.removeClass('red-border');
        //$period.removeClass('red-border');

        //var rateValue = '';
        //$way = $('#ArgsGenerateWay3');
        //if (currentWay3 != $way.val() || currentPeriod3 != $period.val()) {
        //    rateValue = $('#tblRates3 tbody tr td:first').text();

        //    currentPeriod3 = chartOperation3.Init(rateValue, $period.val(), $way.val());
        //    currentWay3 = $way.val();
        //} else {
        //    rateValue = [];
        //    $('#tblRates3    tbody tr td').each(function () {
        //        rateValue.push($(this).text());
        //    });
        //    chartOperation3.Init(rateValue.join(','), currentPeriod3, currentWay3);
        //}
    }

    var save = function () {
        //var pop = mac.wait("Data Saving");
        var itemValue = currentValue3;
        //saveData(itemValue, 16003);
		saveData(itemValue, "AmortisationVector");
        //if (pop != null) {
        //    pop.close();
        //    pop = mac.complete("Saved Successfully!");
        //}
    }

    var clear = function () {
        //viewModel.Fields3()[1].Disabled(false);
        //viewModel.Fields3()[1].Value(0);
        chartOperation3.Init('0', currentPeriod3);
    }

    var generate = function () {
        var constantValue = $('#ConstantValue3').val();
        if (constantValue == '') {
            $('#ConstantValue3').addClass('red-border');
            return;
        }
        $('#ConstantValue3').removeClass('red-border');

        //viewModel.Fields3()[1].Value(0);
        currentPeriod3 = $('#Periods3').val();
        chartOperation3.Init(constantValue, currentPeriod3);
    }

    return {
        RefreshCurve3: refreshCurve,
        Save3: save,
        Clear3: clear,
        Generate3: generate
    };
})();

var chartOperation1 = {
    ChartData: [],
    Periods: 0,

    Init: function (rateValue, dftPeriods, way) {
        
        this.Periods = dftPeriods;
        this.ChartData = rateValue.split(',');

        if (this.ChartData.length > 1) {//已保存数组
            this.Periods = this.ChartData.length;
        } else {//尚未保存数组，仅为单个值
            this.DataFill(rateValue, way);
        }

        this.TableInit();
        this.DrawChart();
        currentValue1 = this.ChartData.join(',');
        return this.Periods;
    }
    , DataFill: function (rate, way) {
        this.ChartData = [];
        if (way == 'Exponent') {
            for (var i = 0; i < this.Periods; i++) {/*方法二：次方概率*/
                var localRate = (1 - Math.pow(1 - (rate / this.Periods), i + 1)).toFixed(3);
                this.ChartData.push(localRate);
            }
        } else {
            for (var i = 0; i < this.Periods; i++) {/*方法一：衡定概率*/
                var localRate = parseFloat(rate).toFixed(3);
                this.ChartData.push(localRate);
            }
        }
    }
    , TableInit: function () {
        var tblThs = [];
        var tblCol = {};

        for (var i = 0; i < this.Periods; i++) {
            var fieldName = "ColumnValue_" + i;

            var th = { field: fieldName, title: i + 1, align: 'center' }
            tblThs.push(th);
            tblCol[fieldName] = this.ChartData[i];
        }

        $('#tblRates1').bootstrapTable('destroy');
        $('#tblRates1').bootstrapTable({
            editable: true,//开启编辑模式
            clickToSelect: false,
            columns: tblThs,
            data: [tblCol]
        });
        //$('#tblRates1').bootstrapTable("refresh");
    }
    , DrawChart: function () {
        var self = this;
        var cates = [];
        var seriesData = [];
        for (var i = 0; i < self.Periods; i++) {
            cates.push(i + 1);
            var y = parseFloat(self.ChartData[i]);
            seriesData.push(y)
        }
        $('#divRatesChart1').highcharts({
            chart: { type: 'line' },
            title: { text: dataModel[set].DisplayText.DefaultTimingCurve },
            subtitle: { text: '' },
            xAxis: { categories: cates },
            yAxis: { title: { text: dataModel[set].DisplayText.Percent } },
            tooltip: {
                enabled: false,
                formatter: function () {
                    return '<b>' + this.series.name + '</b>' + this.x + ': ' + this.y;
                }
            },
            plotOptions: { line: { dataLabels: { enabled: true }, enableMouseTracking: false } },
            series: [{ name: ' ', data: seriesData }]
        });
    }
};

var chartOperation2 = {
    ChartData: [],
    Periods: 0,

    Init: function (rateValue, dftPeriods, way) {
        this.Periods = dftPeriods;
        this.ChartData = rateValue.split(',');

        if (this.ChartData.length > 1) {//已保存数组
            this.Periods = this.ChartData.length;
        } else {//尚未保存数组，仅为单个值
            this.DataFill(rateValue, way);
        }

        this.TableInit();
        this.DrawChart();
        currentValue2 = this.ChartData.join(',');
        return this.Periods;
    }
    , DataFill: function (rate, way) {
        this.ChartData = [];
        if (way == 'Exponent') {
            for (var i = 0; i < this.Periods; i++) {/*方法二：次方概率*/
                var localRate = (1 - Math.pow(1 - (rate / this.Periods), i + 1)).toFixed(3);
                this.ChartData.push(localRate);
            }
        } else {
            for (var i = 0; i < this.Periods; i++) {/*方法一：衡定概率*/
                var localRate = parseFloat(rate).toFixed(3);
                this.ChartData.push(localRate);
            }
        }
    }
    , TableInit: function () {
        var tblThs = [];
        var tblCol = {};

        for (var i = 0; i < this.Periods; i++) {
            var fieldName = "ColumnValue_" + i;

            var th = { field: fieldName, title: i + 1, align: 'center' }
            tblThs.push(th);
            tblCol[fieldName] = this.ChartData[i];
        }

        $('#tblRates2').bootstrapTable('destroy');
        $('#tblRates2').bootstrapTable({
            editable: true,//开启编辑模式
            clickToSelect: false,
            columns: tblThs,
            data: [tblCol]
        });
        //$('#tblRates1').bootstrapTable("refresh");
    }
    , DrawChart: function () {
        var self = this;
        var cates = [];
        var seriesData = [];
        for (var i = 0; i < self.Periods; i++) {
            cates.push(i + 1);
            var y = parseFloat(self.ChartData[i]);
            seriesData.push(y)
        }
        $('#divRatesChart2').highcharts({
            chart: { type: 'line' },
            title: { text: dataModel[set].DisplayText.RecoveryTimingCurve },
            subtitle: { text: '' },
            xAxis: { categories: cates },
            yAxis: { title: { text: dataModel[set].DisplayText.Percent } },
            tooltip: {
                enabled: false,
                formatter: function () {
                    return '<b>' + this.series.name + '</b>' + this.x + ': ' + this.y;
                }
            },
            plotOptions: { line: { dataLabels: { enabled: true }, enableMouseTracking: false } },
            series: [{ name: ' ', data: seriesData }]
        });
    }
};

var chartOperation3 = {
    ChartData: [],
    Periods: 0,

    Init: function (rateValue, dftPeriods, way) {
        this.Periods = dftPeriods;
        this.ChartData = rateValue.split(',');

        if (this.ChartData.length > 1) {//已保存数组
            this.Periods = this.ChartData.length;
        } else {//尚未保存数组，仅为单个值
            this.DataFill(rateValue, way);
        }

        this.TableInit();
        this.DrawChart();
        currentValue3 = this.ChartData.join(',');
        //$('#SpecificRate3').val(this.ChartData.join(','));
        return this.Periods;
    }
    , DataFill: function (rate, way) {
        this.ChartData = [];
        if (way == 'Exponent') {
            for (var i = 0; i < this.Periods; i++) {/*方法二：次方概率*/
                var localRate = (1 - Math.pow(1 - (rate / this.Periods), i + 1)).toFixed(3);
                this.ChartData.push(localRate);
            }
        } else {
            for (var i = 0; i < this.Periods; i++) {/*方法一：衡定概率*/
                var localRate = parseFloat(rate).toFixed(3);
                this.ChartData.push(localRate);
            }
        }
    }
    , TableInit: function () {
        var tblThs = [];
        var tblCol = {};

        for (var i = 0; i < this.Periods; i++) {
            var fieldName = "ColumnValue_" + i;

            var th = { field: fieldName, title: i + 1, align: 'center' }
            tblThs.push(th);
            tblCol[fieldName] = this.ChartData[i];
        }

        $('#tblRates3').bootstrapTable('destroy');
        $('#tblRates3').bootstrapTable({
            editable: true,//开启编辑模式
            clickToSelect: false,
            columns: tblThs,
            data: [tblCol]
        });
        //$('#tblRates1').bootstrapTable("refresh");
    }
    , DrawChart: function () {
        var self = this;
        var cates = [];
        var seriesData = [];
        for (var i = 0; i < self.Periods; i++) {
            cates.push(i + 1);
            var y = parseFloat(self.ChartData[i]);
            seriesData.push(y)
        }
        $('#divRatesChart3').highcharts({
            chart: { type: 'line' },
            title: { text: dataModel[set].DisplayText.AmortisationVector },
            subtitle: { text: '' },
            xAxis: { categories: cates },
            yAxis: { title: { text: dataModel[set].DisplayText.Percent } },
            tooltip: {
                enabled: false,
                formatter: function () {
                    return '<b>' + this.series.name + '</b>' + this.x + ': ' + this.y;
                }
            },
            plotOptions: { line: { dataLabels: { enabled: true }, enableMouseTracking: false } },
            series: [{ name: ' ', data: seriesData }]
        });
    }
};

$(window).bind("keydown", function () { cellkeydown1(event); });
$(window).bind("keydown", function () { cellkeydown2(event); });
$(window).bind("keydown", function () { cellkeydown3(event); });
function cellkeydown1(event) {
    if (event.ctrlKey && event.keyCode == 86) {
        var $el = $(event.srcElement);
        if ($el.parents('#tblRates1').length < 1) {
            return;
        }

        var ss = document.getElementById("textArea");
        ss.focus();
        ss.select();
        setTimeout("dealwithData1()", 50);
    }
}
function dealwithData1(event) {
    var ss = document.getElementById("textArea");
    ss.blur();

    var str = ss.value;
    var rows = str.split(/[\n\f\r]/)
    var rowCells;
    if (rows && rows.length > 0) {
        rowCells = rows[0].split(/[\t]/);
    }
    //for (i = 0; i < arr.length; i++) {
    //    rowCells = arr[i].split(/[\t]/);
    //}

    if (rowCells && rowCells.length) {
        $.each(rowCells, function (i, v) {
            var selector = '#tblRates1 .editable-select input[type="text"]:nth(' + i + ')';
            $(selector).val(v);
        });
    }
}

function cellkeydown2(event) {
    if (event.ctrlKey && event.keyCode == 86) {
        var $el = $(event.srcElement);
        if ($el.parents('#tblRates2').length < 1) {
            return;
        }

        var ss = document.getElementById("textArea");
        ss.focus();
        ss.select();
        setTimeout("dealwithData2()", 50);
    }
}
function dealwithData2(event) {
    var ss = document.getElementById("textArea");
    ss.blur();

    var str = ss.value;
    var rows = str.split(/[\n\f\r]/)
    var rowCells;
    if (rows && rows.length > 0) {
        rowCells = rows[0].split(/[\t]/);
    }
    //for (i = 0; i < arr.length; i++) {
    //    rowCells = arr[i].split(/[\t]/);
    //}

    if (rowCells && rowCells.length) {
        $.each(rowCells, function (i, v) {
            var selector = '#tblRates2 .editable-select input[type="text"]:nth(' + i + ')';
            $(selector).val(v);
        });
    }
}

function cellkeydown3(event) {
    if (event.ctrlKey && event.keyCode == 86) {
        var $el = $(event.srcElement);
        if ($el.parents('#tblRates3').length < 1) {
            return;
        }

        var ss = document.getElementById("textArea");
        ss.focus();
        ss.select();
        setTimeout("dealwithData3()", 50);
    }
}
function dealwithData3(event) {
    var ss = document.getElementById("textArea");
    ss.blur();

    var str = ss.value;
    var rows = str.split(/[\n\f\r]/)
    var rowCells;
    if (rows && rows.length > 0) {
        rowCells = rows[0].split(/[\t]/);
    }
    //for (i = 0; i < arr.length; i++) {
    //    rowCells = arr[i].split(/[\t]/);
    //}

    if (rowCells && rowCells.length) {
        $.each(rowCells, function (i, v) {
            var selector = '#tblRates3 .editable-select input[type="text"]:nth(' + i + ')';
            $(selector).val(v);
        });
    }
}

function saveData(ItemValue, ItemCode) {
    var executeParam = { SPName: 'TrustManagement.Project.usp_SaveStressTestData', SQLParams: [] };
    executeParam.SQLParams.push({ Name: 'TrustId', Value: BusinessIdentifier, DBType: 'int' });
    executeParam.SQLParams.push({ Name: 'PageStep', Value: 'stress', DBType: 'string' });
    executeParam.SQLParams.push({ Name: 'ItemCode', Value: ItemCode, DBType: 'string' });
    executeParam.SQLParams.push({ Name: 'ItemValue', Value: ItemValue, DBType: 'string' });
    var serviceUrl = GlobalVariable.QuickWizardServiceUrl + 'CommonGetWithConnName?connName=TrustManagement&exeParams=' + encodeURIComponent(JSON.stringify(executeParam));
    CallWCFSvc(serviceUrl, false, 'GET', function (data) {
        //callback(data);        
        alertMsg('保存成功！');
    });
}

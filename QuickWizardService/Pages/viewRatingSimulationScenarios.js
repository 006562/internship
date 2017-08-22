document.write("<script language=javascript src='../Scripts/common.js'></script>");
document.write("<script language=javascript src='../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../Scripts/renderControl.js'></script>");

var bid;
var mid;
var pid;
var set;
var tid;
var ServiceHostURL = "https://poolcutwcf/TaskProcessServices/";
var sessionContext = '', sessionContextArray = [],tmpArray = [];
var configService="https://poolcutwcf/TaskProcessServices/TrustManagementService.svc/jsAccessEP/";

var viewTemplate1="<table class=\"imagetable\"> <h2 align=\"center\";>加权平均</h2>"+
"<tr>"+
	"<th>情景</th><th>概率</th><th>总现金流</th><th>转出部分</th><th>自持部分</th>"+
"</tr>";
var viewTemplate2="<table class=\"imagetable\"> <h2 align=\"center\";>方差</h2>"+
"<tr>"+
	"<th>情景</th><th>概率</th><th>总现金流</th><th>转出部分</th><th>自持部分</th>"+
"</tr>";
var contentTemplate="<tr>"+
	"<td>$ScenarioId$</td><td>$Probability$</td><td>$TotalCashflow_NPV$</td><td>$OutgoingCashflow_NPV$</td><td>$RetainedCashflow_NPV$</td>"+
"</tr>";

var viewModel;
var myModel = {
    GridView: [],//ko.observableArray(),
    Detail: [],// ko.observableArray(),
    SelectCompulsory: [],//ko.observableArray(),
    Language: {},
}

function getLanguage(set) {
    var zh_CN = { Title01: "分层信息", Title02: "添加分层", Title03: "更新分层", 
                    Header: "操作", BtnSave: "保存信息", BtnAdd: "添加", BtnEdit: "编辑", 
                    BtnUpdate: "更新", BtnDelete: "删除", BtnClear: "清空" ,BtnRun: "运行", 
                    BtnLook: "查看结果"};
    var en_US = { Title01: "Layer Information", Title02: "Add Layer", Title03: "Update Layer", 
                    Header: "Operate", BtnSave: "Save Data", BtnAdd: "Add", BtnEdit: "Edit", 
                    BtnUpdate: "Update", BtnDelete: "Delete", BtnClear: "Clear" ,BtnRun: "Run",
                    BtnLook:"Result"};
    switch (set) {
        case "zh-CN":
            return zh_CN;
        case "en-US":
            return en_US;
    }
}

var gridColumns = [];
var getItemId = {};

$(function () {
    mid = getQueryString("mid");
    pid = getQueryString("pid");
    bid = getQueryString("bid");
    set = getQueryString("set");
    tid = getQueryString("tid");
    myModel.Language = getLanguage(set);
    $('#loading').fadeIn();
    DataOperate.getPageData(mid, pid, bid, set, getCreditRating);
    DataOperate.getArrearsRange(tid,showArrearsRange);

});

function getCreditRating(items) {
    databind(items);
    registerEvent();
    $('#loading').fadeOut();
}


function databind(items) {
    var go = true;
    var rowId = 0;
    var details = null;
    while (go) {
        var row = $.grep(items, function (trustItem) {
            return trustItem.GroupId01 == rowId;
        })

        if (row.length == 0) {
            //当tbid=0时，row.length == 0，说明返回的只有模板
            if (details == null) {
                details = items;
            }
            go = false;
        }
        else {
            //将第一组数据作为Detial模板
            if (details == null) {
                details = row;
            }


            //排序
            row = row.sort(function (a, b) {
                return parseInt(a.SequenceNo) - parseInt(b.SequenceNo)
            });

            var gridItem = {};
            $.each(row, function (i, d) {
                gridItem[d.ItemCode] = d.ItemValue;
                if (d.DataType == "Select") {
                    var item = DataOperate.getItemById(parseInt(d.ItemValue), set);
                    gridItem[d.ItemCode + "_Text"] = item.ItemAliasValue;
                }
                else if (d.DataType == "Decimal") {
                    gridItem[d.ItemCode + "_Text"] = getMoneyText(d.ItemValue, d.ItemAliasSetName);
                }
            });
            myModel.GridView.push(gridItem);
        }
        rowId++;

    }

    $.each(details, function (i, d) {
        d['IsDisplay'] = false;
        d['IsNew'] = false;
        d.ItemValue = "";
        if (d.IsCompulsory) {
            d.IsDisplay = true;
        }
        else {
            d.IsDisplay = false;
            myModel.SelectCompulsory.push(d);
        }

        if (d.Bit01) {
            gridColumns.push(d);
        }
        getItemId[d.ItemCode] = d.ItemId;
        myModel.Detail.push(d);
    });
    console.log(myModel);
    viewModel = ko.mapping.fromJS(myModel);
    ko.applyBindings(viewModel);
};


function registerEvent() {
    // $.getScript("./showModalDialog.js");

    $("#tb_Add").click(function () {
        if (istbAdd) { creditRating_Add(); }
        else { creditRating_Update(); }
    });
    $("#tb_Clear").click(function () {
        clear();
    });

    setDatePlugins();
};

function setDatePlugins() {
    $("#TransferScenariosDiv").find('.date-plugins').date_input();
}


ko.bindingHandlers.renderGridHeader = {
    init: function (element, valueAccessor) {
        var header = valueAccessor();
        var html = '';
        $.each(gridColumns, function (i, item) {
            html += '<th>' + item.ItemAliasValue + '</th>';
        });

        html += '<th>' + header + '</th>';
        $(html).appendTo($(element));
    }
}

ko.bindingHandlers.renderGridColumn = {
    init: function (element, valueAccessor) {
        var language = valueAccessor();
        var html = '';
        $.each(gridColumns, function (i, item) {
            var code = item.ItemCode;
            if (item.DataType == "Select" || item.DataType == "Decimal") {
                code = code + "_Text";
            }

            html += '<td  data-bind="text: ' + code + '"></td>';
        });
        html += '<td class="btn-group-sm">';
        html += '<input type="button" id="tb_edit" class="btn btn-primary btn-sm" data-bind="attr: { dataIndex: $index }" onclick="creditRating_Detail(this)" value="' + language.BtnEdit() + '"/> &nbsp;';
		html += '<input type="button" id="tb_run" class="btn btn-primary byn-sm" data-bind="attr: { dataIndex: $index }" onclick="creditRating_Run(this)" value="'+ language.BtnRun() + '"/> &nbsp;';
		html += '<input type="button" id="tb_View" class="btn btn-primary byn-sm" data-bind="attr: { dataIndex: $index }" onclick="creditRating_View(this)" value="'+ language.BtnLook() + '"/> &nbsp;';
        html += '<input type="button" id="tb_delete" class="btn btn-danger btn-sm" data-bind="attr: { dataIndex: $index }" onclick="creditRating_Delete(this)" value="' + language.BtnDelete() + '"//>';
        html += '</td>';
        $(html).appendTo($(element));
    }
}







//创建一个动态字段
function createCompulsory() {
    var itemCode = $('#tb_CompulsoryDDL').val();
    if (itemCode != null) {
        var detail = viewModel.Detail();
        var itemT;
        $.each(detail, (function (i, item) {
            if (item.ItemCode() == itemCode) {
                item.IsDisplay(true);
                item.IsNew(true);
                itemT = item;
            }

        }));
        viewModel.Detail.remove(itemT);
        viewModel.Detail.push(itemT);
    }
};

//删除动态字段
function removeCompulsory(obj) {
    var itemCode = $(obj).attr('itemCode');
    var detail = viewModel.Detail();
    $.each(detail, (function (i, item) {
        if (item.ItemCode() == itemCode) {
            item.ItemValue("");
            item.IsDisplay(false);
            item.IsNew(false);
        }
    }));
};

var editIndex = 0;//编辑时设置index
var istbAdd = true;
//添加新分层
function creditRating_Add() {
    var pass = validation();
    if (pass) {
        var detail = viewModel.Detail();
        var newItem = {};
        $.each(detail, function (i, item) {
            if (item.DataType() == "Select") {
                var text = $("#dropDown_" + item.ItemId()).find("option:selected").text();
                newItem[item.ItemCode() + '_Text'] = text;
            }
            else if (item.DataType() == "Decimal") {
                newItem[item.ItemCode() + '_Text'] = getMoneyText(item.ItemValue(), item.ItemAliasSetName());
            }

            newItem[item.ItemCode()] = item.ItemValue();

        });

        //转换成knockout需要的
        newItem = ko.mapping.fromJS(newItem);
        //这样item里包含模板的所有字段,写入Grid
        viewModel.GridView.push(newItem);
        //初始化Detail为最初状态
        initDetail();
        //清空已有显示内容
        clear();
        istbAdd = true;//状态为添加
    }
};

//点击编辑获取详情页
function creditRating_Detail(obj) {
    istbAdd = false;
    initDetail(); //初始化Detail为最初状态
    clear();//清空已有显示内容

    editIndex = $(obj).attr('dataIndex');
    var item = viewModel.GridView()[editIndex];
    for (var key in item) {
        //key就是ItemCode
        var detail = viewModel.Detail();
        $.each(detail, function (i, d) {
            if (d.ItemCode() == key) {
                var itemValue = item[key]();
                if (itemValue != "") {
                    d.ItemValue(itemValue);
                    if (d.IsCompulsory() == false) {
                        d.IsDisplay(true);
                        d.IsNew(true);
                    }
                }
            }
        })

    }

    setDatePlugins();

    $("#tb_Add").val(viewModel.Language.BtnUpdate());
    $("#tb_name").html(viewModel.Language.Title03());
};

function creditRatingAll_Run(){
    var serviceUrl = ServiceHostURL + "/SessionManagementService.svc/jsAccessEP/CreateSessionByTaskCode";

    _taskCode = 'CreditRatingWithParams';

	var ArrearsRange=$('#ArrearsRange').val();
    var reportName = 'CreditRating_Trust_' + tid;
    var staticPoolReportName = 'StaticPool_Trust_' + tid;

    var documentUrl = 'https://poolcutsp/poolcutoperationcenter/' + reportName + '.xls';
    var staticPoolDocumentUrl = 'https://poolcutsp/poolcutoperationcenter/' + staticPoolReportName + '.xls';

    var assetType = 'ConsumerLoan';
    var ratingAgency = 'MOODY';

    sessionVariables_p = '<SessionVariables>' +
								'<SessionVariable>'+
									'<Name>BusinessId</Name>'+
									'<Value>'+ bid +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
                            '<SessionVariable>' +
                                '<Name>TrustId</Name>' +
	                            '<Value>' + tid + '</Value>' +
	                            '<DataType>Int</DataType>' +
	                            '<IsConstant>0</IsConstant>' +
	                            '<IsKey>0</IsKey>' +
	                            '<KeyIndex>0</KeyIndex>' +
	                        '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>DimOrganisationId</Name>' +
     	                     '<Value>2</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>AssetType</Name>' +
     	                     '<Value>' + assetType + '</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>RatingAgency</Name>' +
     	                     '<Value>' + ratingAgency + '</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>ArrearsRange</Name>' +
     	                     '<Value>' + ArrearsRange + '</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>ReportName</Name>' +
     	                     '<Value>' + reportName + '</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>StaticPoolReportName</Name>' +
     	                     '<Value>' + staticPoolReportName + '</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>Document_URL</Name>' +
     	                     '<Value>' + documentUrl + '</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>StaticPoolDocument_URL</Name>' +
     	                     '<Value>' + staticPoolDocumentUrl + '</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>StartPeriod</Name>' +
     	                     '<Value>0</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>EndPeriod</Name>' +
     	                     '<Value>-1</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                         '</SessionVariables>';
    sessionVariables_p = encodeURIComponent(sessionVariables_p);

    serviceUrl = serviceUrl + "?applicationDomain=" + 'Task' + "&sessionVariable=" + sessionVariables_p + "&taskCode=" + _taskCode;
    jQuery.support.cors = true;
    //$(".s4-wpcell").removeAttr('onkeyup').removeAttr('onmouseup');
    clientName = 'CashFlowProcess';
    IndicatorAppDomain = 'Task';
    $.ajax(
        {
            type: "GET",
            url: serviceUrl,
            dataType: "jsonp",
            crossDomain: "true",
            contentType: "application/json;charset=utf-8",
            success: function(response){CreateSessionCompleted(response); $.cookie('sessionid_creditrating',response,{expires: 7}); },
			error: function (response) { alert("error is :" + response); }
        }
)
	
}

//更新新分层
function creditRating_Update() {
    var pass = true;// validation();
    if (pass) {
        var item = viewModel.GridView()[editIndex];//里面包含所有属性
        var detail = viewModel.Detail();
        $.each(detail, function (i, d) {
            var code = d.ItemCode();
            item[code](d.ItemValue());
            if (d.DataType() == "Select") {
                var text_s = $("#dropDown_" + d.ItemId()).find("option:selected").text();
                item[d.ItemCode() + '_Text'](text_s);
            }
            else if (d.DataType() == "Decimal") {
                var text_d = getMoneyText(d.ItemValue(), d.ItemAliasSetName());
                item[d.ItemCode() + '_Text'](text_d);
            }
        })


        $("#tb_Add").val(viewModel.Language.BtnAdd());
        $("#tb_name").html(viewModel.Language.Title02());
        initDetail(); //初始化Detail模板
        clear();//清空
        istbAdd = true;//状态变为添加
    }
};

//删除一个分层
function creditRating_Delete(obj) {
    var index = $(obj).attr('dataIndex');
    var oNew = viewModel.GridView()[index];
    viewModel.GridView.remove(oNew);
    //状态为添加
    istbAdd = true;
    initDetail(); //初始化Detail模板
    clear();//清空
    $("#tb_Add").val(viewModel.Language.BtnAdd());
    $("#tb_name").html(viewModel.Language.Title02());
};

function clear() {
    var detail = viewModel.Detail();
    $.each(detail, function (i, item) {
        var dataType = item.DataType().toLocaleLowerCase();
        if (dataType == "bool") {
            item.ItemValue("0");
        }
        else {
            if (dataType != "select") {
                item.ItemValue("");
            }
        }
    });



}

//删除所有动态字段从Detail模板,初始化状态
function initDetail(obj) {
    var detail = viewModel.Detail();

    $.each(detail, function (i, item) {
       if (item.DataType() == "Date") {
            item.ItemValue("");
        }

        if (item.IsNew()) {
            item.IsNew(false);
            item.IsDisplay(false);
        }
    });


    setDatePlugins();
    $("#tb_Add").val(viewModel.Language.BtnAdd());
    $("#tb_name").html(viewModel.Language.Title02());
}


function validation() {
    var pass = true;
    var detail = $("#TrustItem_Detail").find("input");
    pass = validControls(detail);
    return pass;
}

function saveItems() {

    var pop = mac.wait("Data Saving");
    DataOperate.savePageDataTrustConfig(function () {
        var array = [];
        $.each(viewModel.GridView(), function (i, d) {
            for (key in d) {
                if (key != "__ko_mapping__") {
                    var index = key.indexOf("_Text");
                    if (index < 0) {
                        var value = d[key]();
                        var id = getItemId[key];
                        var item = new DataOperate.DataItem();
                        item.BusinessId = bid;
                        item.ModelId = mid;
                        item.PageId = pid;
                        item.ItemId = id;
                        item.ItemValue = value;
                        item.GroupId01 = i;
                        array.push(item);
                    }
                }
            }

        })
        DataOperate.savePageData(array, function (result) {
            if (pop != null) {
                pop.close();
                pop = mac.complete("Saved Successfully!");
            }
        });
    });
	
	//$.cookie('businessid',bid,{expires: 7});
}

function saveWithoutInfo(){
	// var pop = mac.wait("Data Saving");
    var array = [];
    $.each(viewModel.GridView(), function (i, d) {
        for (key in d) {
            if (key != "__ko_mapping__") {
                var index = key.indexOf("_Text");
                if (index < 0) {
                    var value = d[key]();
                    var id = getItemId[key];
                    var item = new DataOperate.DataItem();
                    item.BusinessId = bid;
                    item.ModelId = mid;
                    item.PageId = pid;
                    item.ItemId = id;
                    item.ItemValue = value;
                    item.GroupId01 = i;
                    array.push(item);
                }
            }
        }

    })
    DataOperate.savePageData(array, function (result) {
        // if (pop != null) {
            // pop.close();
            // pop = mac.complete("Saved Successfully!");
        // }
    });
}

function runItems(){
	saveWithoutInfo();
	creditRatingAll_Run();
}

function lookItems(){
	//alert(sessionID);
	sessionID=$.cookie('sessionid');
	//sessionID='320650FC-2182-439A-9F7B-C3916D22DA36'
	
	if(sessionID !== undefined)
	{
	  var _url = "https://poolcutwcf/TaskProcessServices/TrustManagementService.svc/jsAccessEP/GetDataPublishContent?contextInfo={'DataRequest':'{0}','Params':{'SessionId':'{1}'}}";
	  var FName = 'GETRESULT';
	  var Type='RawValue';
	  var str;
	   _url=_url.replace("{0}",FName);
	   _url=_url.replace("{1}",sessionID);
	  // _url=_url.replace("{2}",Type);
	   $.ajax({
                type: 'get',
                cache: false,
                url: _url,
                dataType: 'html',
                success: Show
            });
	}
	else
	{
		alert("请先运行");
	}
}
	
function CreateSessionCompleted(response) {
    sessionID = response;
	
	
	//$.cookie('sessionid',response,{expires: 7});
	
    //alert("sessionID: " + sessionID );
    //alert("task Code: " + taskCode );
    PopupTaskProcessIndicator();
    if (IsSilverlightInitialized) {
        InitParams();
    }
	//alert(sessionID);
}

function Show(response){
	var rs;
	var TotalCash
	var OutCash
	var RetainedCash
	var repl=document.getElementById('RawValue');
	var repp=document.getElementById("Variance");
	var reps=document.getElementById("ShowResult");
	$(repl).empty();
	$(repp).empty();
	$(reps).empty();
	var showResult=''
	var html='';
	var html2='';
	var flag=1;
	html=html+viewTemplate1;
	html2=html2+viewTemplate2;
	var contentHtml;
	var json =response;
	var obj = eval(json );			//字符串转化为 数组
	
	for( var i=0;i<obj.length;i++)
	{
		var dataJson = obj[i].DataJson;	//取出JSON字符串
		var dataArray=eval(dataJson);	//转化为数组
		for(var k=0;k<dataArray.length;k++)
		{
			contentHtml=contentTemplate;	//获取模板
			var dataJsonObj = eval( dataArray[k]);	//转化为JSON对象
			for(j in dataJsonObj)
			{
				contentHtml=contentHtml.replace('$'+j+'$',dataJsonObj[j]);
				if(dataJsonObj[j]=='Variance'||dataJsonObj[j]=='Variance_WeighedAverage'||dataJsonObj[j]=='SD')
					{
						html2+=contentHtml;
						if(dataJsonObj[j]=='Variance_WeighedAverage'){
							TotalCash=dataJsonObj['TotalCashflow_NPV'];
							OutCash=dataJsonObj['OutgoingCashflow_NPV'];
							RetainedCash=dataJsonObj['RetainedCashflow_NPV'];
						}
						//html2+='<br />';
					}
				else if(dataJsonObj[j]=='RawValue'||dataJsonObj[j]=='RawValue_WeighedAverage')
					{
						html+=contentHtml;
						//html+='<br />';
					}
				else 
					flag=0;
			}	
		}
		html+='</table><br /><br />'
		html2+='</table><br /><br />'
		
	}
	rs=(0.5+(OutCash-RetainedCash)/(2*TotalCash))*100;
	showResult+='<h3 style="text-align:center">风险报酬转移:'+rs.toFixed(2)+'%'+'</h3><br /><br /><br /><br />'
	$(html).appendTo($(repl));
	$(html2).appendTo($(repp));
	$(showResult).appendTo($(reps));
	
}

var showArrearsRange=function(response){
	var jsonObject;
	var jsonArray=eval(response);
	for(var i=0;i<jsonArray.length;i++)
	{
		jsonObject=jsonArray[i];
		$('#ArrearsRange').append("<option value='"+jsonObject.ArrearsRange+"'>"+jsonObject.ArrearsRange+"</option>"); 
	}
}

function creditRating_Run(obj){
	saveWithoutInfo();
    
    var serviceUrl = ServiceHostURL + "/SessionManagementService.svc/jsAccessEP/CreateSessionByTaskCode";

    _taskCode = 'CreditRatingWithParams';

    var reportName = 'CreditRating_Trust_' + tid;

    var documentUrl = 'https://poolcutsp/poolcutoperationcenter/' + reportName + '.xls';

    var assetType = 'ConsumerLoan';
    var ratingAgency = 'MOODY';

    sessionVariables_p = '<SessionVariables>' +
								'<SessionVariable>'+
									'<Name>BusinessId</Name>'+
									'<Value>'+ bid +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
                            '<SessionVariable>' +
                                '<Name>TrustId</Name>' +
	                            '<Value>' + tid + '</Value>' +
	                            '<DataType>Int</DataType>' +
	                            '<IsConstant>0</IsConstant>' +
	                            '<IsKey>0</IsKey>' +
	                            '<KeyIndex>0</KeyIndex>' +
	                        '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>DimOrganisationId</Name>' +
     	                     '<Value>2</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>AssetType</Name>' +
     	                     '<Value>' + assetType + '</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>RatingAgency</Name>' +
     	                     '<Value>' + ratingAgency + '</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>ReportName</Name>' +
     	                     '<Value>' + reportName + '</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>Document_URL</Name>' +
     	                     '<Value>' + documentUrl + '</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>StartPeriod</Name>' +
     	                     '<Value>0</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                             '<SessionVariable>' +
                              '<Name>EndPeriod</Name>' +
     	                     '<Value>-1</Value>' +
     	                     '<DataType>Int</DataType>' +
     	                     '<IsConstant>1</IsConstant>' +
     	                     '<IsKey>0</IsKey>' +
     	                     '<KeyIndex>0</KeyIndex>' +
     	                     '</SessionVariable>' +
                         '</SessionVariables>';
    sessionVariables_p = encodeURIComponent(sessionVariables_p);

    serviceUrl = serviceUrl + "?applicationDomain=" + 'Task' + "&sessionVariable=" + sessionVariables_p + "&taskCode=" + _taskCode;
    jQuery.support.cors = true;
    //$(".s4-wpcell").removeAttr('onkeyup').removeAttr('onmouseup');
    clientName = 'CashFlowProcess';
    IndicatorAppDomain = 'Task';
    $.ajax(
        {
            type: "GET",
            url: serviceUrl,
            dataType: "jsonp",
            crossDomain: "true",
            contentType: "application/json;charset=utf-8",
            success: function(response){CreateSessionCompleted(response); $.cookie('sessionid_Bond'+editIndex,response,{expires: 7}); },
			error: function (response) { alert("error is :" + response); }
        }
)
}

// function creditRating_View(obj){
		// window.open("https://poolcutwcf/TaskProcessServices/UITaskStudio/CashFlowRunResult.html?TrustId=998")
// }

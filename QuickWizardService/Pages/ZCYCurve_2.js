document.write("<script language=javascript src='../Scripts/common.js'></script>");
document.write("<script language=javascript src='../Scripts/dataOperate.js'></script>");
document.write("<script language=javascript src='../Scripts/renderControl.js'></script>");
var tid;
var bid;
var mid;
var pid;
var set;
var ServiceHostURL = "https://poolcutwcf/TaskProcessServices/";
var sessionContext = '', sessionContextArray = [],tmpArray = [];
var configService="https://poolcutwcf/TaskProcessServices/TrustManagementService.svc/jsAccessEP/";

var viewModel;
var myModel = {
    GridView: [],//ko.observableArray(),
    Detail: [],// ko.observableArray(),
    SelectCompulsory: [],//ko.observableArray(),
    Language: {},
}


var gridColumns = [];
var getItemId = {};

function getLanguage(set) {
    var zh_CN = { 
					TrustID: "专项计划ID", 
					YTM: "预期收益率%（年化）",
					Cashflows: "现金流名称",
					InvestedAmount: "投资金额（元）", 
                    YieldCurve: "参考利率曲线", 
					AccruedInterestDays: "距离上次付息天数",
					RiskPremium: "风险溢价（bps）", 
					DayCountConvention: "计日规则",
					InterpolationMethod: "插值方式",
                    FaceValue: "面值", 
					Coupon: "年化票面利率%",
					Frequency: "年付息次数", 
                    Maturity: "期限（年）",
					BtnRunPricing: "计算现金流定价", 
					BtnViewPricingResult: "查看结果",
					BtnRunBondPricing: "计算债券定价", 
					BtnViewBondPricingResult: "查看结果",
					BtnChooseFile: "选择文件", 
					BtnUploadFile: "上传文件",
					option: [{Method: "Linear", Alias: "线性插值"},
                        {Method: "Cubic", Alias: "立方插值"},
                        {Method: "MCS", Alias: "单调三次样条插值"}]
				};
    var en_US = { 
					TrustID: "Trust ID", 
					YTM: "YTM",
					Cashflows: "Cashflows",
					InvestedAmount: "Invested Amount", 
                    YieldCurve: "Yield Curve", 
					AccruedInterestDays: "Accrued Interest Days",
					RiskPremium: "Risk Premium(bps)", 
					DayCountConvention: "Day Count Convention",
					InterpolationMethod: "Interpolation Method",
                    FaceValue: "Face Value", 
					Coupon: "Coupon Rate",
					Frequency: "Coupon Frequency", 
                    Maturity: "Maturity(year)",
					BtnRunPricing: "Run", 
					BtnViewPricingResult: "Result",
					BtnRunBondPricing: "Run", 
					BtnViewBondPricingResult: "Result",
					BtnChooseFile: "Choose File", 
					BtnUploadFile: "Upload File",
					option: [{Method: "Linear", Alias: "Linear"},
                        {Method: "Cubic", Alias: "Cubic"},
                        {Method: "MCS", Alias: "MCS"}]
				};
    switch (set) {
        case "zh-CN":
            return zh_CN;
        case "en-US":
            return en_US;
    }
}


$(function () {
    mid = getQueryString("mid");
    pid = getQueryString("pid");
    bid = getQueryString("bid");
    set = getQueryString("set");
    tid = getQueryString("tid");
	myModel.Language = getLanguage(set);
    DataOperate.getPageData(mid, pid, bid, set, getTrustBond);
	DataOperate.getZCYCurveData('D',showZCYCurveList);
	DataOperate.getCashflows('D',showCashflows);
	DataOperate.getTrusts('D',showTrusts);
	$('#loading').fadeIn();
	$.fn.zTree.init($("#treeDemo"), setting, zNodes);
	$("#addLeaf").bind("click", { isParent: false },add);
});

//显示该页下拉列表
//已修改dataOperation.js文件
var showZCYCurveList=function(response){
	var jsonObject;
	var jsonArray=eval(response);
	for(var i=0;i<jsonArray.length;i++)
	{
		jsonObject=jsonArray[i];
		$('#BondPricing_YieldCurve').append("<option value='"+jsonObject.CurveName+"'>"+jsonObject.CurveName+"</option>"); 
		$('#YieldCurve').append("<option value='"+jsonObject.CurveName+"'>"+jsonObject.CurveName+"</option>"); 
	}
}
var showCashflows=function(response){
	var jsonObject;
	var jsonArray=eval(response);
	for(var i=0;i<jsonArray.length;i++)
	{
		jsonObject=jsonArray[i];
		$('#Cashflows').append("<option value='"+jsonObject.CashflowName+"'>"+jsonObject.CashflowName+"</option>"); 
	}
}
var showTrusts=function(response){
	var jsonObject;
	var jsonArray=eval(response);
	for(var i=0;i<jsonArray.length;i++)
	{
		jsonObject=jsonArray[i];
		$('#TrustID').append("<option value='"+jsonObject.TrustID+"'>"+jsonObject.TrustID+"</option>"); 
	}
}


function getTrustBond(items) {
	databind(items);
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

// function runBootStrapping(){
	// trustBond_Run();
// }

// function viewBootStrappingResult(){
	// window.open("https://poolcutwcf/TaskProcessServices/UITaskStudio/CashFlowRunResult.html?TrustId=1005")
// }
	
function CreateSessionCompleted(response) {
    sessionID = response;
    PopupTaskProcessIndicator();
    if (IsSilverlightInitialized) {
        InitParams();
    }
}

function runPricing(){
	var InstrumentName=$('#Cashflows').val();
	var YTM=$('#YTM').val();
	var YieldCurve=$('#YieldCurve').val();
	var AccruedInterestDays=$('#AccruedInterestDays').val();
	var RiskPremium=$('#RiskPremium').val();
	var TrustID=$('#TrustID').val();
	
	var serviceUrl = ServiceHostURL + "SessionManagementService.svc/jsAccessEP/CreateSessionByTaskCode";
	indicatorAppDomain_p = "Task";
	var sessionVariables_p= '<SessionVariables>'+
	
															
								'<SessionVariable>'+
									'<Name>InstrumentName</Name>'+
									'<Value>'+ InstrumentName +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								
								'<SessionVariable>'+
									'<Name>YTM</Name>'+
									'<Value>'+ YTM +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+				
								'<SessionVariable>'+
									'<Name>TrustID</Name>'+
									'<Value>'+ TrustID +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+				
								'<SessionVariable>'+
									'<Name>YieldCurve</Name>'+
									'<Value>'+ YieldCurve +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								'<SessionVariable>'+
									'<Name>AccruedInterestDays</Name>'+
									'<Value>'+ AccruedInterestDays +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								'<SessionVariable>'+
									'<Name>RiskPremium</Name>'+
									'<Value>'+ RiskPremium +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								
							'</SessionVariables>';
	sessionVariables_p=encodeURIComponent(sessionVariables_p);
	var taskCode="CashflowPricing";
	serviceUrl = serviceUrl + "?applicationDomain=" + indicatorAppDomain_p + "&sessionVariable=" + sessionVariables_p + "&taskCode=" + taskCode;
	jQuery.support.cors = true;
	//alert(sessionVariables_p);
	$.ajax(
		{
			type:"GET",
			url:serviceUrl,
			dataType:"jsonp",
			crossDomain:"true",
			contentType: "application/json;charset=utf-8",
			success: CreateSessionCompleted,
			error: function (response) { alert("error is :" + response); }
		}
	)
	
}

function viewPricingResult(){
	window.open("https://poolcutwcf/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&TrustId=1006");

	//window.open("https://poolcutwcf/TaskProcessServices/UITaskStudio/CashFlowRunResult.html?TrustId=1006")
}

function runBondPricing(){
	var FaceValue=$('#BondPricing_FaceValue').val();
	var Coupon=$('#BondPricing_Coupon').val();
	var YieldCurve=$('#BondPricing_YieldCurve').val();
	var YTM=$('#BondPricing_YTM').val();
	var Frequency=$('#BondPricing_Frequency').val();
	var RiskPremium=$('#BondPricing_RiskPremium').val();
	var Maturity=$('#BondPricing_Maturity').val();
	
	var serviceUrl = ServiceHostURL + "SessionManagementService.svc/jsAccessEP/CreateSessionByTaskCode";
	indicatorAppDomain_p = "Task";
	var sessionVariables_p= '<SessionVariables>'+
	
															
								'<SessionVariable>'+
									'<Name>FaceValue</Name>'+
									'<Value>'+ FaceValue +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								
								'<SessionVariable>'+
									'<Name>Coupon</Name>'+
									'<Value>'+ Coupon +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+				
								'<SessionVariable>'+
									'<Name>YieldCurve</Name>'+
									'<Value>'+ YieldCurve +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								'<SessionVariable>'+
									'<Name>YTM</Name>'+
									'<Value>'+ YTM +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								'<SessionVariable>'+
									'<Name>Frequency</Name>'+
									'<Value>'+ Frequency +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								'<SessionVariable>'+
									'<Name>Maturity</Name>'+
									'<Value>'+ Maturity +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								'<SessionVariable>'+
									'<Name>RiskPremium</Name>'+
									'<Value>'+ RiskPremium +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								
							'</SessionVariables>';
	sessionVariables_p=encodeURIComponent(sessionVariables_p);
	var taskCode="BondPricing";
	serviceUrl = serviceUrl + "?applicationDomain=" + indicatorAppDomain_p + "&sessionVariable=" + sessionVariables_p + "&taskCode=" + taskCode;
	jQuery.support.cors = true;
	//alert(sessionVariables_p);
	$.ajax(
		{
			type:"GET",
			url:serviceUrl,
			dataType:"jsonp",
			crossDomain:"true",
			contentType: "application/json;charset=utf-8",
			success: CreateSessionCompleted,
			error: function (response) { alert("error is :" + response); }
		}
	)
	
}

function viewBondPricingResult(){
	window.open("https://poolcutwcf/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&TrustId=1006");

	//window.open("https://poolcutwcf/TaskProcessServices/UITaskStudio/CashFlowRunResult.html?TrustId=1006")
}

//上传文件--------------


var zNodes = [];

var setting = {
    view: {
        selectedMulti: false
    },
    edit: {
        enable: true,
        showRemoveBtn: true,
        showRenameBtn: false
    },
    data: {
        keep: {
            parent: true,
            leaf: true
        },
        simpleData: {
            enable: true
        }
    },
    callback: {
         beforeRemove: beforeRemove,
         onRemove: onRemove
    }
};




function getTreeICON(nodeName)
{
    var index = nodeName.lastIndexOf('.');
    var type= nodeName.substr(index + 1);
    switch (type)
    {
        case "xls":
        case "xlsx":
            return "../Scripts/zTree/css/zTreeStyle/img/xls.gif";
        case "doc":
        case "docx":
            return "../Scripts/zTree/css/zTreeStyle/img/doc.gif";
        case "ppt":
        case "pptx":
            return "../Scripts/zTree/css/zTreeStyle/img/ppt.gif";
        case "html":
        case "htm":
        case "aspx":
            return "../Scripts/zTree/css/zTreeStyle/img/html.gif";
        case "txt":
            return "../Scripts/zTree/css/zTreeStyle/img/txt.gif";
        case "pdf":
            return "../Scripts/zTree/css/zTreeStyle/img/pdf.png";
        default:
            return "../Scripts/zTree/css/zTreeStyle/img/default.gif";
    }
}


function add(e) {
   var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    var isParent = e.data.isParent;
    var nodeName = "";
   var nodes = zTree.getSelectedNodes();
   var  treeNode = nodes[0];

    if (isParent) {
        nodeName = $("#folder").val();
        if (nodeName == null || nodeName == "")
        {
            mac.alert("文件夹名称不能为空.");
            return;
        }
    }
    else {
        var file = $("#file").val();
        nodeName = getFileName(file);
        if (nodeName == null || nodeName == "") {
            mac.alert("请添加要上传的文件.");
            return;
        }
    }
     
    if (treeNode) {
        if (isParent) {
            DataOperate.CreateFolder(bid, treeNode.id, nodeName, function (nId) {
                if (nId == -1) {
                    mac.alert("文件夹：" + nodeName + " 已经存在了。");
                }
                else if (nId == -3) {
                    mac.alert("文件夹数据库操作异常。");
                }
                else {
                    treeNode = zTree.addNodes(treeNode, { id: parseInt(nId), pId: treeNode.id, isParent: isParent, name: nodeName});
					//调用Task
                }
            })
        }
        else {
            var fileData = document.getElementById("file").files[0];
            DataOperate.UploadFileOverride(bid, treeNode.id, nodeName,fileData, function (nId) {
                if (nId == -1) {
                    mac.alert("文件：" + nodeName + " 已经存在了。");
                }
                else if (nId == -2)
                {
                    mac.alert("文件创建异常。");
                }
                else if (nId == -3) {
                    mac.alert("文件数据库操作异常。");
                }
                else {
                    treeNode = zTree.addNodes(treeNode, { id: parseInt(nId), pId: treeNode.id, isParent: isParent, name: nodeName, icon: getTreeICON(nodeName) });
                }
            })
        }
       
    } else {
        if (isParent) {
            DataOperate.CreateFolder(bid, 0, nodeName, function (nId) {
                if (nId == -1) {
                    mac.alert("文件夹：" + nodeName + " 已经存在了。");
                }
                else if (nId == -3) {
                    mac.alert("文件夹数据库操作异常。");
                }
                else {
                    treeNode = zTree.addNodes(null, { id: parseInt(nId), pId: 0, isParent: isParent, name: nodeName });
                }
            })
        }
        else {
            var fileData = document.getElementById("file").files[0];
            DataOperate.UploadFileOverride(bid, 0, nodeName, fileData,function (nId) {
                if (nId == -1) {
                    mac.alert("文件：" + nodeName + " 已经存在了。");
                }
                else if (nId == -2) {
                    mac.alert("文件创建异常。");
                }
                else if (nId == -3) {
                    mac.alert("文件数据库操作异常。");
                }
                else {
						treeNode = zTree.addNodes(null, { id: parseInt(nId), pId: 0, isParent: isParent, name: nodeName, icon: getTreeICON(nodeName) });
						var nodeId = treeNode[0].id;
						
						
						//Call Task
								var FilePath='E:\\TSSWCFServices\\QuickWizardUpload\\'+bid+'\\';
								var FileName=nodeName;
								var serviceUrl = ServiceHostURL + "SessionManagementService.svc/jsAccessEP/CreateSessionByTaskCode";
								indicatorAppDomain_p = "Task";
								var sessionVariables_p= '<SessionVariables>'+
																			
												'<SessionVariable>'+
													'<Name>FilePath</Name>'+
													'<Value>'+ FilePath +'</Value>'+
													'<DataType>String</DataType>'+
													'<IsConstant>0</IsConstant>'+
													'<IsKey>0</IsKey>'+
													'<KeyIndex>0</KeyIndex>'+
												'</SessionVariable>'+
												
												'<SessionVariable>'+
													'<Name>FileName</Name>'+
													'<Value>'+ FileName +'</Value>'+
													'<DataType>String</DataType>'+
													'<IsConstant>0</IsConstant>'+
													'<IsKey>0</IsKey>'+
													'<KeyIndex>0</KeyIndex>'+
												'</SessionVariable>'+
												
											'</SessionVariables>';
								sessionVariables_p=encodeURIComponent(sessionVariables_p);
								var taskCode="BondPricing";
								serviceUrl = serviceUrl + "?applicationDomain=" + indicatorAppDomain_p + "&sessionVariable=" + sessionVariables_p + "&taskCode=" + taskCode;
								jQuery.support.cors = true;
								//alert(sessionVariables_p);
								$.ajax(
									{
										type:"GET",
										url:serviceUrl,
										dataType:"jsonp",
										crossDomain:"true",
										contentType: "application/json;charset=utf-8",
										success: CreateSessionCompleted,
										error: function (response) { alert("error is :" + response); }
									}
								)
								
								//DataOperate.DocumentDelete(bid, nodeId, 'false');
					}
            })
        }
        
    }
    if (treeNode) {
        zTree.editName(treeNode[0]);
    } else {
        //alert("叶子节点被锁定，无法增加子节点");
    }
};



function getFileName(o) {
    var pos = o.lastIndexOf("\\");
    return o.substring(pos + 1);
}

function onRemove(e, treeId, treeNode) {
    var nodeId = treeNode.id;
    var isFolder = treeNode.isParent;
    DataOperate.DocumentDelete(bid, nodeId, isFolder);
}

 
// function remove(e) {
    // var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
    // nodes = zTree.getSelectedNodes(),
    // treeNode = nodes[0];
    // if (nodes.length == 0) {
        // mac.alert("请先选择一个文件夹或者文件");
        // return;
    // }

    // var callbackFlag = $("#callbackTrigger").attr("checked");
    // zTree.removeNode(treeNode, callbackFlag);

    // var nodeId = treeNode.id;
    // var isFolder = treeNode.isParent;
    // //DataOperate.DocumentDelete(bid, nodeId, isFolder);

// };
// var className = "dark";
// function beforeRemove(treeId, treeNode) {
    // className = (className === "dark" ? "" : "dark");
    // var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    // zTree.selectNode(treeNode);
    // return  confirm("确认删除  -- " + treeNode.name + " 吗？");
// }
//上传文件--------------//


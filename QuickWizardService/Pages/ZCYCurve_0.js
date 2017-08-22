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
var CashFlowStudioServiceBase = location.protocol + "//" + location.host + "/TaskProcessServices/CashFlowStudioService.svc/jsAccessEP/";

var viewModel;
var myModel = {
    GridView: [],//ko.observableArray(),
    Detail: [],// ko.observableArray(),
    SelectCompulsory: [],//ko.observableArray(),
    Language: {},
}

var appDomain;
var trustId;
var sessionId;

var currentChartType= 'column';
var currentChartTypeName = "柱状图";
var cashFlowPeriodList=[];

function getLanguage(set) {
    var zh_CN = { Title01: "分层信息", Title02: "添加分层", Title03: "更新分层", Header: "操作", BtnSave: "保存信息", 
					BtnAdd: "添加", BtnEdit: "编辑", BtnUpdate: "更新", BtnDelete: "删除", BtnClear: "清空",
					BtnRun: "运行", BtnLook: "查看结果", BtnLoadSHIBOR: "下载最新SHIBOR数据", 
					BtnViewSHIBOR:"查看SHIBOR曲线", BtnViewHistoricalSHIBOR: "查看SHIBOR历史数据",
					BtnChooseFile: "选择文件", BtnUploadFile: "上传文件", BtnLoadChinaBond: "下载最新中债数据", 
					BtnViewChinaBond:"查看中债曲线", BtnViewHistoricalChinaBond: "查看中债历史数据",
					BtnLoadABS: "下载最新ABS数据", BtnViewHistoricalABS: "查看ABS历史数据", BtnViewABS: "查看ABS曲线"};
    var en_US = { Title01: "Layer Information", Title02: "Add Layer", Title03: "Update Layer", Header: "Operate", 
					BtnSave: "Save Data", BtnAdd: "Add", BtnEdit: "Edit", BtnUpdate: "Update", BtnDelete: "Delete", 
					BtnClear: "Clear" ,BtnRun: "Run",BtnLook:"Result",BtnLoadSHIBOR:"Load SHIBOR", 
					BtnViewSHIBOR:"View SHIBOR", BtnViewHistoricalSHIBOR: "View Historical SHIBOR", 
					BtnChooseFile: "Choose File", BtnUploadFile: "Upload File", BtnLoadChinaBond: "Load ChinaBond", 
					BtnViewChinaBond:"View ChinaBond", BtnViewHistoricalChinaBond: "View Historical ChinaBond",
					BtnLoadABS: "Load ABS", BtnViewHistoricalABS: "View Historical ABS", BtnViewABS: "View ABS"};
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
	ko.applyBindings(myModel);
	$.fn.zTree.init($("#treeDemo"), setting, zNodes);
	$("#addLeaf").bind("click", { isParent: false ,ID:'file'},add);
	$("#addLeafCHINABOND").bind("click", { isParent: false ,ID:'fileCHINABOND'},add);
    $("#addLeafCHINABOND_ABS").bind("click", { isParent: false ,ID:'fileCHINABOND_ABS'},add);
});


	
function CreateSessionCompleted(response) {
    sessionID = response;
    PopupTaskProcessIndicator();
    if (IsSilverlightInitialized) {
        InitParams();
    }
	//alert(sessionID);
}

function viewCurves(){
	window.open("https://poolcutwcf/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&TrustId=1005");
	// window.open("https://poolcutwcf/TaskProcessServices/UITaskStudio/CashFlowRunResult.html?TrustId=1005");
	// var tt = $('.radioChart');
	// tt[0].checked=true;
	// $('#viewChart').show();
	// appDomain='Task';
	// trustId=1005;
	// getTaskCodeAndSessionIdFromTrustId(appDomain, trustId, function (response) {
		// var arrayObj = new viewFormCashFlowResult("Task", jQuery.parseJSON(response).SessionId, jQuery.parseJSON(response).TaskCode);
		// arrayObj.render('综合曲线');
	// });		//得到TaskCode & SessionId
}


function viewHistoricalSHIBOR(){
	window.open("https://poolcutwcf/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&TrustId=1003");
	// window.open("https://poolcutwcf/TaskProcessServices/UITaskStudio/CashFlowRunResult.html?TrustId=1003");
	// var tt = $('.radioChart');
	// tt[0].checked=true;
	// $('#viewChart').show();
	// appDomain='Task';
	// trustId=1003;
	// getTaskCodeAndSessionIdFromTrustId(appDomain, trustId, function (response) {
		// var arrayObj = new viewFormCashFlowResult("Task", jQuery.parseJSON(response).SessionId, jQuery.parseJSON(response).TaskCode);
		// arrayObj.render('SHIBOR历史数据');
	// });		//得到TaskCode & SessionId
	
}
function viewHistoricalCHINABOND(){
	window.open("https://poolcutwcf/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&TrustId=1004");
	// window.open("https://poolcutwcf/TaskProcessServices/UITaskStudio/CashFlowRunResult.html?TrustId=1004");
	// var tt = $('.radioChart');
	// tt[0].checked=true;
	// $('#viewChart').show();
	// appDomain='Task';
	// trustId=1004;
	// getTaskCodeAndSessionIdFromTrustId(appDomain, trustId, function (response) {
		// var arrayObj = new viewFormCashFlowResult("Task", jQuery.parseJSON(response).SessionId, jQuery.parseJSON(response).TaskCode);
		// arrayObj.render('中债历史数据');
	// });		//得到TaskCode & SessionId
}
function viewHistoricalCHINABOND_ABS(){
	window.open("https://poolcutwcf/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=Task&TrustId=1010");
	// window.open("https://poolcutwcf/TaskProcessServices/UITaskStudio/CashFlowRunResult.html?TrustId=1010");
	// var tt = $('.radioChart');
	// tt[0].checked=true;
	// $('#viewChart').show();
	// appDomain='Task';
	// trustId=1010;
	// getTaskCodeAndSessionIdFromTrustId(appDomain, trustId, function (response) {
		// var arrayObj = new viewFormCashFlowResult("Task", jQuery.parseJSON(response).SessionId, jQuery.parseJSON(response).TaskCode);
		// arrayObj.render('ABS历史数据');
	// });		//得到TaskCode & SessionId
}

function loadSHIBOR(){
	
	var serviceUrl = ServiceHostURL + "SessionManagementService.svc/jsAccessEP/CreateSessionByTaskCode";
	indicatorAppDomain_p = "Task";
	var sessionVariables_p= '<SessionVariables>'+
	
															
								'<SessionVariable>'+
									'<Name>BusinessId</Name>'+
									'<Value>'+ bid +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								
							'</SessionVariables>';
	sessionVariables_p=encodeURIComponent(sessionVariables_p);
	var taskCode="LoadExcel_Shibor";
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

function loadCHINABOND(){
	
	var serviceUrl = ServiceHostURL + "SessionManagementService.svc/jsAccessEP/CreateSessionByTaskCode";
	indicatorAppDomain_p = "Task";
	var sessionVariables_p= '<SessionVariables>'+
	
															
								'<SessionVariable>'+
									'<Name>BusinessId</Name>'+
									'<Value>'+ bid +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								
							'</SessionVariables>';
	sessionVariables_p=encodeURIComponent(sessionVariables_p);
	var taskCode="LoadExcel_ChinaBond";
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

function loadCHINABOND_ABS(){
	
	var serviceUrl = ServiceHostURL + "SessionManagementService.svc/jsAccessEP/CreateSessionByTaskCode";
	indicatorAppDomain_p = "Task";
	var sessionVariables_p= '<SessionVariables>'+
	
															
								'<SessionVariable>'+
									'<Name>BusinessId</Name>'+
									'<Value>'+ bid +'</Value>'+
									'<DataType>String</DataType>'+
									'<IsConstant>0</IsConstant>'+
									'<IsKey>0</IsKey>'+
									'<KeyIndex>0</KeyIndex>'+
								'</SessionVariable>'+
								
							'</SessionVariables>';
	sessionVariables_p=encodeURIComponent(sessionVariables_p);
	var taskCode="LoadExcel_ChinaBond_ABS";
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


var getCaskFlowRunResultBySessionId = function (appDomain, sessionId, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "GetCaskFlowRunResultBySessionId/" + appDomain + "/" + sessionId + "?r=" + Math.random() * 150;;

        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) {
                alert("load CaskFlow run result error.");
            }
        });
};



var getTaskCodeAndSessionIdFromTrustId = function (appDomain, trustId, callback) {
	var serviceUrl = CashFlowStudioServiceBase + "GetTaskCodeAndSessionIdFromTrustId/" + appDomain + "/" + trustId + "?r=" + Math.random() * 150;;

	$.ajax({
		type: "GET",
		url: serviceUrl,
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (response) {
			callback(response);
		},
		error: function (response) {
			alert("load TaskCode And SessionId From TrustId error.");
		}
	});
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
        // beforeRemove: beforeRemove,
        // onRemove: onRemove
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
	var id=e.data.ID;
   var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    var isParent = e.data.isParent;
    var nodeName = "";
   var nodes = zTree.getSelectedNodes();
   var  treeNode = nodes[0];
   var taskCode;

    if (isParent) {
        nodeName = $("#folder").val();
        if (nodeName == null || nodeName == "")
        {
            mac.alert("文件夹名称不能为空.");
            return;
        }
    }
    else {
        var file = $("#"+id).val();
        nodeName = getFileName(file);
        if (nodeName == null || nodeName == "") {
            mac.alert("请添加要上传的文件.");
            return;
        }
        if(id == "file") {
            taskCode = "LoadExcel_Shibor";
        }
        else if(id == "fileCHINABOND") {
            taskCode = "LoadExcel_ChinaBond";
        }
        else if(id == "fileCHINABOND_ABS") {
            taskCode = "LoadExcel_ChinaBond_ABS";
            var re = new RegExp("([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))");
            var ReportingDate = nodeName.match(re);
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
            var fileData = document.getElementById(id).files[0];
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
            var fileData = document.getElementById(id).files[0];
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
													'<Name>SourcePath</Name>'+
													'<Value>'+ FilePath +'</Value>'+
													'<DataType>String</DataType>'+
													'<IsConstant>0</IsConstant>'+
													'<IsKey>0</IsKey>'+
													'<KeyIndex>0</KeyIndex>'+
												'</SessionVariable>'+
												
												'<SessionVariable>'+
													'<Name>SourceName</Name>'+
													'<Value>'+ FileName +'</Value>'+
													'<DataType>String</DataType>'+
													'<IsConstant>0</IsConstant>'+
													'<IsKey>0</IsKey>'+
													'<KeyIndex>0</KeyIndex>'+
												'</SessionVariable>'+

											'</SessionVariables>';
                                if(taskCode == "LoadExcel_ChinaBond_ABS") {
                                    sessionVariables_p= '<SessionVariables>'+
																			
												'<SessionVariable>'+
													'<Name>SourcePath</Name>'+
													'<Value>'+ FilePath +'</Value>'+
													'<DataType>String</DataType>'+
													'<IsConstant>0</IsConstant>'+
													'<IsKey>0</IsKey>'+
													'<KeyIndex>0</KeyIndex>'+
												'</SessionVariable>'+
												
												'<SessionVariable>'+
													'<Name>SourceName</Name>'+
													'<Value>'+ FileName +'</Value>'+
													'<DataType>String</DataType>'+
													'<IsConstant>0</IsConstant>'+
													'<IsKey>0</IsKey>'+
													'<KeyIndex>0</KeyIndex>'+
												'</SessionVariable>'+

                                                '<SessionVariable>'+
													'<Name>ReportingDate</Name>'+
													'<Value>'+ ReportingDate[0] +'</Value>'+
													'<DataType>String</DataType>'+
													'<IsConstant>0</IsConstant>'+
													'<IsKey>0</IsKey>'+
													'<KeyIndex>0</KeyIndex>'+
												'</SessionVariable>'+
												
											'</SessionVariables>';
                                }
								sessionVariables_p=encodeURIComponent(sessionVariables_p);
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

//上传文件--------------//

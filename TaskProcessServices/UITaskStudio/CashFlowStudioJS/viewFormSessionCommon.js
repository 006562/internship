//viewFormSessionCommon = function () {
    var minRows = 24, minCols = 82;

    var CashFlowStudioServiceBase = location.protocol + "//" + location.host + "/TaskProcessServices/CashFlowStudioService.svc/jsAccessEP/";
    
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
        });
    };

    Array.prototype.remove = function (dx) {
        if (isNaN(dx) || dx > this.length) { return false; }
        for (var i = 0, n = 0; i < this.length; i++) {
            if (this[i] != this[dx]) {
                this[n++] = this[i]
            }
        }
        this.length -= 1
    }

    var getRangeFormExcel = function (callback) {
        Office.context.document.getSelectedDataAsync(Office.CoercionType.Matrix,
            { valueFormat: "unformatted", filterType: "all" },
            function (asyncResult) {
                var error = asyncResult.error;
                if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                    //write(error.name + ": " + error.message);
                    return;
                }
                else {
                    // Get selected data.
                    var RangeData = asyncResult.value;
                    var strArray = "";
                    if (RangeData.length > 0) {
                        for (var i = 0; i < RangeData.length; i++) {
                            strArray = strArray + " {\"ItemName\":\"" + RangeData[i][0] + "\",\"ItemValue\":[   ";
                            for (var j = 1; j < RangeData[i].length; j++) {
                                strArray = strArray + "\"" + RangeData[i][j] + "\",";
                            }
                            strArray = strArray.substr(0, strArray.length - 1) + "]},";
                        }
                        strArray = "[" + strArray.substr(0, strArray.length - 1) + "]";
                        var temp = eval("(" + strArray + ")");
                        callback(temp);
                    }
                }
              

            });
    }

    var getVariableFormExcel = function (callback) {
        Office.context.document.getSelectedDataAsync(Office.CoercionType.Matrix,
          { valueFormat: "unformatted", filterType: "all" },
          function (asyncResult) {
              var error = asyncResult.error;
              if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                  write(error.name + ": " + error.message);
                  return;
              }
              else {
                  // Get selected data.
                  var arrayData = asyncResult.value;
                  var cJson = "";
                  if (arrayData.length == 2) {
                      for (var i = 0; i < arrayData[0].length; i++) {
                          cJson += "{\"ItemName\":\"" + arrayData[0][i] + "\",\"ItemValue\":\"" + arrayData[1][i] + "\"},";
                      }
                  }
                  else if (arrayData[0].length == 2) {
                      for (var i = 0; i < arrayData.length; i++) {
                          cJson += "{\"ItemName\":\"" + arrayData[i][0] + "\",\"ItemValue\":\"" + arrayData[i][1] + "\"},";
                      }
                  }
                  cJson = "[" + cJson.substr(0, cJson.length - 1) + "]";
                  var temp = eval("(" + cJson + ")");
                  callback(temp);
              }
          });
    }
 
    var getProcessTaskArrayByTaskCode = function (appDomain, taskCode, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "GetProcessTaskArrayByTaskCode/" + appDomain + "/" + taskCode + "?r=" + Math.random() * 150;;

        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {

                callback(response);
            },
            error: function (response) {
                alert("load ProcessTaskArray objects error.");
            }
        });
    };

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

    var getTaskSessionContextByTaskCode = function (appDomain, taskCode, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "GetTaskSessionContextByTaskCode/" + appDomain + "/" + taskCode + "?r=" + Math.random() * 150;
    
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            beforeSend: function (XMLHttpRequest) {
             
            },
            success: function (response) {
                callback(response);
            },
            error: function (response) {
                alert("load SessionContext objects error.");
            }
        });
    };

    var saveProcessTaskArray = function (appDomain, taskCode, sessionContext) {
        var serviceUrl = CashFlowStudioServiceBase + "SaveProcessTaskArray/" + appDomain + "/" + taskCode + "?r=" + Math.random() * 150;
        
        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: sessionContext == "" ? "<SessionArrays>Empty</SessionArrays>" : "<SessionArrays>{0}</SessionArrays>".format(sessionContext),
            success: function (response) {
                alert("Successfully saved.");
                //$('#divMsg').Modal({
                //    width: 200, // 弹出框宽度
                //    height: 100, // 弹出框高度
                //    title: 'Message', // 弹出框标题
                //    html: '<div style="text-align:center;line-height:40px;font-size:14px;">Successfully saved</div>', //弹出框内容
                //    open: true, //是否自动打开弹窗
                //    callback: function () { } //弹出框回调函数 (用于弹出后执行某些代码)
                //});
            },
            error: function (response) {
                alert("save ProcessTaskArray objects error.");
            }
        });
    }

    var saveTaskSessionVariable = function (appDomain, taskCode, sessionContext) {
        var serviceUrl = CashFlowStudioServiceBase + "SaveSessionContextByPost/" + appDomain + "/" + taskCode + "?r=" + Math.random() * 150;

        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: sessionContext == "" ? "<SessionVariables></SessionVariables>" : sessionContext,
            success: function (response) {
                //$('#divMsg').Modal({
                //    width: 200, // 弹出框宽度
                //    height: 100, // 弹出框高度
                //    title: 'Message', // 弹出框标题
                //    html: '<div style="text-align:center;line-height:40px;font-size:14px;">Saved successfully</div>', //弹出框内容
                //    open: true, //是否自动打开弹窗
                //    callback: function () { } //弹出框回调函数 (用于弹出后执行某些代码)
                //});
            },
            error: function (response) {
                alert("save SessionVariable objects error.");
            }
        });
    }

    var saveProcessTaskContext = function (appDomain, taskCode, sessionContext) {
        var serviceUrl = CashFlowStudioServiceBase + "SaveProcessTaskContext/" + appDomain + "/" + taskCode + "?r=" + Math.random() * 150;

        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: sessionContext == "" ? "<SessionVariables></SessionVariables>" : sessionContext,
            success: function (response) {
                alert("Saved successfully.");
            },
            error: function (response) {
                alert("save SessionVariable objects error.");
            }
        });
    }

    var saveSessionContextArray = function (appDomain, sessionId, sessionContext, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "SaveSessionContextArray/" + appDomain + "/" + sessionId + "?r=" + Math.random() * 150;
        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: sessionContext == "" ? "<SessionVariables>Empty</SessionVariables>" : sessionContext,
            success: function (response) {
                callback(response);
            },
            error: function (response) {
                alert("save Session Array objects error.");
            }
        });
    }

    var getTaskCodeListByTaskType = function (appDomain, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "GetTaskCodeListByTaskType/" + appDomain + "/CashFlow" + "?r=" + Math.random() * 150;;

        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) { alert("load TaskCodeList objects error."); }
        });
    }

    var getCriteriaSetListByAppDomain = function (appDomain, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "GetECListByAppDomain/" + appDomain + "?r=" + Math.random() * 150;
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) { alert("load CriteriaSet objects error."); }
        });
    }

    var criteriaSetObjects = function (response) {
        if (response.length > 0) {
            var content = "";
            response.sort(
                function (a, b) {
                    if (a.CriteriaSetTypeCode < b.CriteriaSetTypeCode) return -1;
                    if (a.CriteriaSetTypeCode > b.CriteriaSetTypeCode) return 1;
                    return 0;
                }
            );
            for (var i = 0; i < response.length; i++) {
                criteriaSetList[i] = response[i].CriteriaSetTypeCode;
            };
        }
    }

    var taskObjects = function (response) {
        if (response.length > 0) {
            var content = "";
            response.sort(
                function (a, b) {
                    if (a.CodeDictionaryCode < b.CodeDictionaryCode) return -1;
                    if (a.CodeDictionaryCode > b.CodeDictionaryCode) return 1;
                    return 0;
                }
            );
            for (var i = 0; i < response.length; i++) {
                taskCodeList[i] = { label: response[i].CodeDictionaryCode, value: response[i].CriteriaSetCode };
            };
        }
    }

    var showVariables = function (response) {
        var cVariable = response;
        var VariableData = [[]];
        for (var i = 0; i < cVariable.length; i++) {
            VariableData[i] = new Array();
            VariableData[i][0] = cVariable[i].ItemName;
            VariableData[i][1] = cVariable[i].ItemValue;
        }
        renderVariableTable(VariableData);
    }

    var showVariableByXml = function (response) {
        var cStr = response;
        if (cStr != "" && cStr != undefined) {
            var ArrayData = [[]];
            var variableXml = $.parseXML(cStr);
            var i = 0;
            $(variableXml).find("SessionVariable").each(function (key, value) {
                var sname = ($($(this).find("Name"))).text() == null ? "" : ($($(this).find("Name"))).text();
                var svalue = ($($(this).find("Value"))).text() == null ? "" : ($($(this).find("Value"))).text();
                ArrayData[i] = new Array();
                ArrayData[i][0] = sname;
                ArrayData[i][1] = svalue;
                ++i;
            });
            renderVariableTable(ArrayData);
        }
    }

    var showVariablesXML = function (response) {
        var cVariable = response;
        var isExistsStartPeriod = false;
        var isExistsEndPeriod = false;
        var VariableHead = ["Name", "Value", "DataType", "IsConstant", "IsKey", "KeyIndex"];
        var VariableData = [[]];
        if (cVariable != "" && cVariable != undefined) {
            var variableXml = $.parseXML(cVariable);
            $(variableXml).find("SessionVariable").each(function (i) {

                if ($(this).find("Name").text() == "StartPeriod") {
                    isExistsStartPeriod = true;
                }

                if ($(this).find("Name").text() == "EndPeriod") {
                    isExistsEndPeriod = true;
                }

                VariableData[i] = new Array();
                VariableData[i][0] = $(this).find("Name").text();
                VariableData[i][1] = $(this).find("Value").text();
                VariableData[i][2] = $(this).find("DataType").text();
                VariableData[i][3] = $(this).find("IsConstant").text();
                VariableData[i][4] = $(this).find("IsKey").text();
                VariableData[i][5] = $(this).find("KeyIndex").text();

            });
        }
        if (!isExistsStartPeriod) {
            VariableData.unshift(["StartPeriod", "0", "nvarchar", 0, 0, 0]);
        }
        if (!isExistsEndPeriod) {
            VariableData.unshift(["EndPeriod", "11", "nvarchar", 0, 0, 0]);
        }

        //minRows = minRows < VariableData.length ? VariableData.length : minRows;
        VariableData.unshift(VariableHead);
        renderVariableTableView(VariableData);
    }

    var showArrays = function (response) {
      
        var cArrays = response;
        var ArrayHead = [];
        var ArrayData = [[]];
      
        if (cArrays != "" && cArrays != undefined) {
            for (var i = 0; i < cArrays.length; i++) {
                ArrayData[i] = new Array();
                var ItemValueObj = cArrays[i].ItemValue;
                ArrayData[i][0] = cArrays[i].ItemName;
                for (var j = 0; j < ItemValueObj.length; j++) {
                    ArrayData[i][j + 1] = ItemValueObj[j]
                }
            }
        }
        renderArrayTable(ArrayData);
    }

    var showResults = function (response) {

        var cArrays = response;
        var ArrayData = new Array();
        if (cArrays != "" && cArrays != undefined) {
            for (var i = 0; i < cArrays.length; i++) {
                if (cArrays[i].ItemName != "DateIndex") {
                    var tempRow = new Array();
                    tempRow.push(cArrays[i].ItemName);
                    var ItemValueObj = cArrays[i].ItemValue;
                    for (var j = 0; j < ItemValueObj.length; j++) {
                        tempRow.push(ItemValueObj[j]);
                    }
                    ArrayData.push(tempRow);
                }
            }
        }
        renderResultTable(ArrayData);
    }

    function exportDataFromGridToExcel(callback) {
        var $container = $("#divResultTable");
        var handsontable = $container.data('handsontable');
        var data = handsontable.getData();
       
        Office.context.document.setSelectedDataAsync(callback(data), { coercionType: Office.CoercionType.Matrix },
        function (asyncResult) {
            var error = asyncResult.error;
            if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                write(error.name + ": " + error.message);
            }
        });
    }

    function exportVarriableFromGridToExcel(callback) {
        var $container = $("#divVariableTable");
        var handsontable = $container.data('handsontable');
        var data = handsontable.getData();

        Office.context.document.setSelectedDataAsync(callback(data), { coercionType: Office.CoercionType.Matrix },
        function (asyncResult) {
            var error = asyncResult.error;
            if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                write(error.name + ": " + error.message);
            }
        });
    }

    function exportRangeFromGridToExcel(callback) {
        var $container = $("#divArrayTable");
        var handsontable = $container.data('handsontable');
        var data = handsontable.getData();

        Office.context.document.setSelectedDataAsync(callback(data), { coercionType: Office.CoercionType.Matrix },
        function (asyncResult) {
            var error = asyncResult.error;
            if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                write(error.name + ": " + error.message);
            }
        });
    }

    var rebuiltVariableData = function (srcData) {
        var result = [[]];
        for (var i = 0; (srcData[i] != null) ; i++) {
            if (srcData[i][0] != null && srcData[i][0] != "") {
                result[i] = new Array();
                result[i][0] = srcData[i][0];
                result[i][1] = srcData[i][1];
            }
        }
        return result;
    }

    var rebuiltArrayData = function (srcData) {
        var result = [[]];
        for (var i = 0; (srcData[i] != null) ; i++) {
            if (srcData[i][0] != null && srcData[i][0] != "") {
                result[i] = new Array();
                for (var j = 0; j < srcData[i].length; j++) {
                    if (srcData[i][j] != "" && srcData[i][j] != undefined) {
                        result[i][j] = srcData[i][j];
                    }
                }
            }
        }
        return result;
    }

    var rebuiltData = function (srcData) {
        var result = [[]];
        for (var i = 1; (srcData[i] != null) ; i++) {
            if (srcData[i][0] != null && srcData[i][0] != "") {
                result[i - 1] = new Array();
                for (var j = 0; j < srcData[i].length; j++) {
                    if (srcData[i][j] != "" && srcData[i][j] != undefined) {
                        result[i - 1][j] = srcData[i][j];
                    }
                    else {
                        result[i - 1][j] = 0;
                    }
                }
            }
        }
        return result;
    }

    var overrideHeaderTest = function (realCols) {
        realCols = realCols < minCols ? minCols : realCols;
        var overrideArrayHead = [];
        overrideArrayHead[0] = "CashFlowName";
        for (var k = 1; k < realCols; k++) {
            overrideArrayHead[k] = k - 1;
        }
        return overrideArrayHead;
    }

    var overrideHeader = function (colLen) {
        var overrideArrayHead = [];
        overrideArrayHead[0] = "CashFlowName";
        for (var k = 1; k < colLen; k++) {
            overrideArrayHead[k] = k - 1;
        }
        return overrideArrayHead;
    }

    var overrideHeaderNew = function (firstName, realCols) {
        var overrideArrayHead = [];
        overrideArrayHead[0] = firstName;
        for (var k = 1; k < realCols; k++) {
            overrideArrayHead[k] = k - 1 + "";
        }
        return overrideArrayHead;
    }

    var renderArrayTable = function (ArrayData) {
        if (ArrayData == null || ArrayData == undefined) { ArrayData = [[]]; }
        var realCols = ArrayData[0].length < minCols ? minCols : ArrayData[0].length;
        var ArrayHead = overrideHeaderNew("CashFlowName", realCols);

        var $container = $("#divArrayTable");
        $container.handsontable({
            data: ArrayData,
            minRows: minRows,
            minCols: realCols,
            rowHeaders: true,
            colHeaders: ArrayHead,
            //minSpareRows: 1,
            //minSpareCols: 1,
            contextMenu: true,
            //columnSorting: false,
            fixedRowsTop: 0,//固定顶部多少行不能垂直滚动
            fixedColumnsLeft: 1,//固定左侧多少列不能水平滚动
            afterCreateCol: function (index, amount) {
                if (this.getColHeader().length > ArrayHead.length) {
                    var headName = parseInt(ArrayHead[ArrayHead.length - 1]) + 1;
                    ArrayHead.push(headName);
                    this.updateSettings({ colHeaders: ArrayHead });
                    this.renderers();
                }
            },
            afterRemoveCol: function (index, amount) {
                this.updateSettings({
                    colHeaders: ArrayHead
                });
                this.renderers();
            }
        });
    }
 
    var renderVariableTable = function (ArrayData) {
        if (ArrayData == null || ArrayData == undefined) { ArrayData = [[]]; }
        var realCols = 10;
        var realRows = minRows < ArrayData.length ? ArrayData.length : minRows;
        var ArrayHead = overrideHeaderNew("VariableName", realCols);
        var $container = $("#divVariableTable");
        $container.handsontable({
            data: ArrayData,
            minRows: realRows,
            minCols: realCols,
            rowHeaders: true,
            colHeaders: ArrayHead,
            //minSpareRows: 1,
            //minSpareCols: 1,
            contextMenu: true,
            //columnSorting: false,
            fixedRowsTop: 0,//固定顶部多少行不能垂直滚动
            fixedColumnsLeft: 1,//固定左侧多少列不能水平滚动
            afterCreateCol: function (index, amount) {
                if (this.getColHeader().length > ArrayHead.length) {
                    var headName = parseInt(ArrayHead[ArrayHead.length - 1]) + 1;
                    ArrayHead.push(headName);
                    this.updateSettings({ colHeaders: ArrayHead });
                    this.renderers();
                }
            },
            afterRemoveCol: function (index, amount) {
                this.updateSettings({
                    colHeaders: ArrayHead
                });
                this.renderers();
            }
        });
    }

    var renderVariableTableView = function (ArrayData) {
        if (ArrayData == null || ArrayData == undefined) { ArrayData = [[]]; }
        var realRows = minRows < ArrayData.length ? ArrayData.length : minRows;
        var $container = $("#divVariableTable");
        $container.handsontable({
            data: ArrayData,
            minRows: realRows,
            minCols: 5,
            rowHeaders: true,
            colHeaders: false,
            minSpareRows: 1,
            //minSpareCols: 1,
            contextMenu: true,
            columnSorting: false,
            fixedRowsTop: 1,//?????????????
            cells: function (row, col, prop) {
                var cellProperties = {};
                if (row === 0 && !this.readOnly) {
                    cellProperties.readOnly = true;
                    cellProperties.renderer = firstRowRenderer;//????????  
                }
                return cellProperties;
            }
        });
    }

    var renderResultTable = function (ReusultData) {
        if (ReusultData == null || ReusultData == undefined) { ReusultData = [[]]; }
        var realCols = ReusultData[0].length == 0 ? 24 : ReusultData[0].length;
        var ArrayHead = overrideHeaderNew("CashFlowName", realCols);
        var $container = $("#divResultTable");
        $container.handsontable({
            data: ReusultData,
            minRows: minRows,
            minCols: realCols,
            rowHeaders: true,
            colHeaders: ArrayHead,
            //minSpareRows: 1,
            //minSpareCols: 1,
            contextMenu: true,
            //columnSorting: false,
            fixedRowsTop: 0,//固定顶部多少行不能垂直滚动
            fixedColumnsLeft: 1,//固定左侧多少列不能水平滚动
            afterCreateCol: function (index, amount) {
                if (this.getColHeader().length > ArrayHead.length) {
                    var headName = parseInt(ArrayHead[ArrayHead.length - 1]) + 1;
                    ArrayHead.push(headName);
                    this.updateSettings({ colHeaders: ArrayHead });
                    this.renderers();
                }
            },
            afterRemoveCol: function (index, amount) {
                this.updateSettings({
                    colHeaders: ArrayHead
                });
                this.renderers();
            }
        });
    }

    var firstRowRenderer = function (instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        $(td).css("text-align", "center");
        $(td).css("color", "#000000");
        $(td).css("background-color", "#eeeeee");
    }

    var retArrays = function (arrayData) {
        var cJson = "";
        for (var i = 0; i < arrayData.length; i++) {
            for (var j = 1; j < arrayData[i].length; j++) {
                if (arrayData[i][j] != "" && arrayData[i][j] != undefined) {
                    if (arrayData[i][0] != "DateIndex") {
                        var pid = j - 1;
                        cJson += "{\"ItemName\":\"" + arrayData[i][0] + "\",\"ItemValue\":\"" + arrayData[i][j] + "\",\"PeriodsId\":\"" + pid + "\"},";
                    }
                }
            }
        }
        //for (var i = 1; i < arrayData.length; i++) {
        //    for (var j = 1; j < arrayData[i].length; j++) {
        //        if (arrayData[i][j] != "" && arrayData[i][j] != undefined) {
        //            cJson += "{\"ItemName\":\"" + arrayData[i][0] + "\",\"ItemValue\":\"" + arrayData[i][j] + "\",\"PeriodsId\":\"" + arrayData[0][j] + "\"},";
        //        }
        //    }
        //}
        cJson = cJson == "" ? "<SessionArrays>Empty</SessionArrays>" : "<SessionArrays>[{0}]</SessionArrays>".format(cJson.substr(0, cJson.length - 1));
        return cJson;
    }

    var retVariables = function (sessionVariable) {
        var variableJson = "";
        var tempVariable = "";
        var Variabletemp = "</Value><DataType>nvarchar</DataType> <IsConstant>0</IsConstant><IsKey>0</IsKey><KeyIndex>0</KeyIndex></SessionVariable>";
        if (sessionVariable != "" && sessionVariable != undefined) {
            for (var i = 1; i < sessionVariable.length; i++) {
                if (sessionVariable[i][0] != "" && sessionVariable[i][1] != undefined)
                    tempVariable += "<SessionVariable><Name>" + sessionVariable[i][0] + "</Name><Value>" + sessionVariable[i][1] + Variabletemp;
            }
        }
        variableJson = "<SessionVariables>" + tempVariable + "</SessionVariables>";
        $("#divMsg").html(variableJson);
        return variableJson;
    }

    var retVariablesFromAddin = function (sessionVariable) {
        var variableJson = "";
        var tempVariable = "";
        var Variabletemp = "</Value><DataType>nvarchar</DataType> <IsConstant>0</IsConstant><IsKey>0</IsKey><KeyIndex>0</KeyIndex></SessionVariable>";
        if (sessionVariable != "" && sessionVariable != undefined) {
            for (var i = 0; i < sessionVariable.length; i++) {
                if (sessionVariable[i][0] != "" && sessionVariable[i][1] != undefined)
                    tempVariable += "<SessionVariable><Name>" + sessionVariable[i][0] + "</Name><Value>" + sessionVariable[i][1] + Variabletemp;
            }
        }
        variableJson = "<SessionVariables>" + tempVariable + "</SessionVariables>";
        $("#divMsg").html(variableJson);
        return variableJson;
    }

    var riboonTool = function () {
        $('[id^=ribbon_]').each(function () {
            $(this).live("mouseover", function () {
                $(this).attr("class", "ribbon activeRibbon");
            });
            $(this).live("mouseleave", function () {
                $(this).attr("class", "ribbon");
            });
        });
    }
   
//};




var vspread = null;
var vsheet = null;
define('viewVariables', {
    component: function ()
    {
        var self = this;
        var variable = Vue.extend({
            template: '#viewvariables',
            data: function ()
            {
                return {
                    message: '',
                    taskCode: '',
                    minrow: 50,
                    mincolumn: 2
                };
            },
            methods: {
                bindVariblesToGrid: function (response)
                {
                    vsheet.reset();
                    var defaultStyle = vsheet.getDefaultStyle();
                    defaultStyle.formatter = "@";
                    vsheet.setDefaultStyle(defaultStyle);
                    if (response != "" && response != undefined)
                    {

                        vspread.isPaintSuspended(true);
                        var variableJson = this.rebuiltGridData(response);
                        this.setVariableSheetValue(variableJson);
                        vspread.isPaintSuspended(false);
                        //vspread.tabStripVisible(false);//隐藏 Add Sheet Tab 
                    } else
                    {
                        vspread.isPaintSuspended(true);
                        this.setRowAndColumn(this.minrow);
                        vspread.isPaintSuspended(false);
                        //vspread.tabStripVisible(false);//隐藏 Add Sheet Tab 
                    }
                },
                //用于判断包不包括“StartPeriod”和“EndPeriod”
                rebuiltGridData: function (rdata)
                {
                    var isExistsStartPeriod = false;
                    var isExistsEndPeriod = false;
                    var retVariable = [];
                    if (rdata != "" && rdata != undefined)
                    {
                        var row = 0;
                        for (var i = 0; i < rdata.length; i++)
                        {
                            var v_name = rdata[i].Name;
                            var v_value = rdata[i].Value;
                            if (v_name == "StartPeriod")
                            {
                                isExistsStartPeriod = true;
                            }

                            if (v_name == "EndPeriod")
                            {
                                isExistsEndPeriod = true;
                            }
                            retVariable[i] = { Name: v_name, Value: v_value };
                        }

                        if (!isExistsStartPeriod)
                        {
                            retVariable.splice(0, 0, { Name: "StartPeriod", Value: 0 });
                        }
                        if (!isExistsEndPeriod)
                        {
                            retVariable.splice(1, 0, { Name: "EndPeriod", Value: 11 });
                        }
                    }
                    return retVariable;
                },
                setVariableSheetValue: function (rdata)
                {
                    vsheet.clear(0, 0, vsheet.getRowCount(), vsheet.getColumnCount(), GcSpread.Sheets.SheetArea.viewport, GcSpread.Sheets.StorageType.Data);
                    vsheet.autoGenerateColumns = true;
                    var sTable = vsheet.addTableByDataSource("Table2", 0, 0, rdata, this.defineTableStyle());
                    sTable.showHeader(false);
                    vsheet.deleteRows(0, 1);
                    this.setRowAndColumn(rdata.length);
                },
                setRowAndColumn: function (row)
                {
                    var self = this;
                    var rowCount = row > self.minrow ? row : this.minrow;
                    vsheet.setValue(0, 0, "Name", $.wijmo.wijspread.SheetArea.colHeader);
                    vsheet.setValue(0, 1, "Value", $.wijmo.wijspread.SheetArea.colHeader);
                    vsheet.setColumnWidth(0, 250, 1, $.wijmo.wijspread.SheetArea.colHeader);
                    vsheet.setColumnWidth(1, 150, 1, $.wijmo.wijspread.SheetArea.colHeader);
                    vsheet.setColumnCount(self.mincolumn, $.wijmo.wijspread.SheetArea.viewport);
                    vsheet.setRowCount(rowCount, $.wijmo.wijspread.SheetArea.viewport);
                    vsheet.defaults.rowHeight = 25;
                    vsheet.defaults.colWidth = 100;
                },
                rebuiltVariableData: function (srcData)
                {
                    var self = this;
                    var result = [[]];
                    for (var i = 0; (srcData[i] != null) ; i++)
                    {
                        if (srcData[i][0] != null && srcData[i][0] != "")
                        {
                            result[i] = new Array();
                            result[i][0] = srcData[i][0];
                            result[i][1] = srcData[i][1];
                        }
                    }
                    self.message = result;
                    return result;
                },
                exportVarriableFromGridToExcel: function (callback)
                {
                    var columnCount = vsheet.getColumnCount($.wijmo.wijspread.SheetArea.viewport);
                    var rowCount = vsheet.getRowCount($.wijmo.wijspread.SheetArea.viewport);
                    var data = vsheet.getArray(0, 0, rowCount, columnCount); 
                    //callback(data)
                    Office.context.document.setSelectedDataAsync(callback(data), { coercionType: Office.CoercionType.Matrix },
                    function (asyncResult)
                    {
                        var error = asyncResult.error;
                        if (asyncResult.status === Office.AsyncResultStatus.Failed)
                        {
                            write(error.name + ": " + error.message);
                        }
                    });
                },
                getVariableFormExcel: function ()
                {
                    var self = this;
                    Office.context.document.getSelectedDataAsync(Office.CoercionType.Matrix,
                      { valueFormat: "unformatted", filterType: "all" },
                      function (asyncResult)
                      {
                          var error = asyncResult.error;
                          if (asyncResult.status === Office.AsyncResultStatus.Failed)
                          {
                              write(error.name + ": " + error.message);
                              return;
                          }
                          else
                          {
                              // Get selected data.
                              var arrayData = asyncResult.value;
                              var cJson = "";
                              var variable = [];
                              if (arrayData.length == 2)
                              {
                                  for (var i = 0; i < arrayData[0].length; i++)
                                  {
                                      variable[i] = { Name: arrayData[0][i], Value: arrayData[1][i] }
                                  }
                              }
                              else if (arrayData[0].length == 2)
                              {
                                  for (var i = 0; i < arrayData.length; i++)
                                  {
                                      variable[i] = { Name: arrayData[i][0], Value: arrayData[i][1] }
                                  }
                              }
                              self.message = variable;
                              self.$parent.variables = variable;
                              self.bindVariblesToGrid(self.$parent.variables);
                          }
                      });
                },

                retVariables: function ()
                {
                    var variableJson = "";
                    var tempVariable = "";
                    var Variabletemp = "</Value><DataType>string</DataType><IsConstant>0</IsConstant><IsKey>0</IsKey><KeyIndex>0</KeyIndex></SessionVariable>";
                    if (vsheet.getRowCount() > 0)
                    {
                        for (var i = 0; i < vsheet.getRowCount() ; i++)
                        {
                            if (vsheet.getValue(i, 0) != "" && vsheet.getValue(i, 1) != undefined)
                                tempVariable += "<SessionVariable><Name>" + vsheet.getValue(i, 0) + "</Name><Value>" + vsheet.getValue(i, 1) + Variabletemp;
                        }
                    }
                    variableJson = "<SessionVariables>" + tempVariable + "</SessionVariables>";
                    return variableJson;
                },

                importvariable: function ()
                {
                    var self = this;
                    self.getVariableFormExcel();
                },
                exportvariable:function(){
                    var self = this;
                    self.exportVarriableFromGridToExcel(self.rebuiltVariableData);
                },
                savevariable:function(){
                    var self=this;
                    self.$nextTick(function ()
                    {
                        var variableXML = self.retVariables();
                        self.message = variableXML;
                        webProxy.saveProcessTaskContext(self.$root.appDomain, $("#txtTaskCode").val(), variableXML, function (response)
                        {
                            if (response)
                            {
                                alert("saved successfuly.");
                            } else
                            {
                                alert("save process task variable error.");
                            }
                        });
                    })
                },
                defineTableStyle: function ()
                {
                    var tableStyle = new $.wijmo.wijspread.TableStyle();
                    var thinBorder = new $.wijmo.wijspread.LineBorder("#b5b4b4", $.wijmo.wijspread.LineStyle.thin);
                    tableStyle.wholeTableStyle(new $.wijmo.wijspread.TableStyleInfo("white", "black", "11pt calibri", thinBorder, thinBorder, thinBorder, thinBorder, thinBorder, thinBorder));
                    //var tStyleInfo = new $.wijmo.wijspread.TableStyleInfo();
                    //tStyleInfo.backColor = "green";
                    //tStyleInfo.foreColor = "red";
                    //tStyleInfo.borderBottom = new $.wijmo.wijspread.LineBorder("green", $.wijmo.wijspread.LineStyle.thin);
                    //tStyleInfo.borderLeft = new $.wijmo.wijspread.LineBorder("yellow", $.wijmo.wijspread.LineStyle.medium);
                    //tStyleInfo.borderTop = new $.wijmo.wijspread.LineBorder("green", $.wijmo.wijspread.LineStyle.thin);
                    //tStyleInfo.borderRight = new $.wijmo.wijspread.LineBorder("green", $.wijmo.wijspread.LineStyle.thin);
                    //tStyleInfo.font = "bold 11pt arial";
                    //tableStyle.firstColumnStripSize(2);
                    //tableStyle.firstColumnStripStyle(tStyleInfo);
                    return tableStyle;
                },
            },
            ready: function ()
            {
                $("#divVariableTable").css({
                    width: $(window).width() - 25,
                    height: $(window).height() - 150
                });
                $(window).resize(function () {
                    $("#divVariableTable").css({
                        width: $(window).width(),
                        height: $(window).height() - 127
                    });
                })
                vspread = new GcSpread.Sheets.Spread($("#divVariableTable")[0]);
                vsheet = vspread.getActiveSheet();
                vspread.tabStripVisible(false);//隐藏 Add Sheet Tab 
            }
        });
        return variable
    }
});
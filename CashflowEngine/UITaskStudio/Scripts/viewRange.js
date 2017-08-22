var vrspread = null;
var vrsheet = null;
define('viewRange', {
    component: function ()
    {
        var self = this;
        var rangetab = Vue.extend({
            template: '#viewrange',
            data: function ()
            {
                return {
                    minrow: 50,
                    isShow: false,
                    mincolumn: 100,
                    message: '',
                    taskCode: ''
                };
            },
            props: ['searchTask'],
            methods: {
                //array relate items
                setArraySheetArea: function (rdata)
                {
                    vrsheet.clear(0, 0, vrsheet.getRowCount(), vrsheet.getColumnCount(), GcSpread.Sheets.SheetArea.viewport, GcSpread.Sheets.StorageType.Data);
                    vrsheet.autoGenerateColumns = true;
                    var sTable = vrsheet.addTableByDataSource("Table1", 0, 0, rdata, this.defineTableStyle());
                    sTable.showHeader(false);
                    vrsheet.deleteRows(0, 1);
                    this.setColumnHeader(rdata[0].length);
                    this.setRowCount(rdata.length);
                },
                //设置array表的列号和列数
                setColumnHeader: function (col)
                {
                    var colCount = col > this.mincolumn ? col : this.mincolumn;
                    vrsheet.setValue(0, 0, "CashFlowName", $.wijmo.wijspread.SheetArea.colHeader);
                    vrsheet.setColumnWidth(0, 250, 1, $.wijmo.wijspread.SheetArea.colHeader);
                    vrsheet.setColumnCount(colCount, $.wijmo.wijspread.SheetArea.viewport);
                    for (var i = 0; i < colCount; i++)
                    {
                        vrsheet.setValue(0, i + 1, i, $.wijmo.wijspread.SheetArea.colHeader);
                        //vrsheet.autoFitColumn(i);
                    }

                },
                //设置array表的行数
                setRowCount: function (row)
                {
                    var rowCount = row > this.minrow ? row : this.minrow;
                    vrsheet.setRowCount(rowCount, $.wijmo.wijspread.SheetArea.viewport);
                    vrsheet.defaults.rowHeight = 25;
                    vrsheet.defaults.colWidth = 100;
                },
                //绑定数据
                bindArraysToGrid: function (response)
                {
                    var defaultStyle = vrsheet.getDefaultStyle();
                    defaultStyle.formatter = "@";
                    vrsheet.setDefaultStyle(defaultStyle);
                    if (response != "" && response != undefined)
                    {
                        //console.log(response);
                        vrspread.isPaintSuspended(true);
                        var arrayData = dataProcess.rangeJsonToArray(response);
                        this.setArraySheetArea(arrayData);
                        vrsheet.setFrozenColumnCount(1);
                        vrsheet.frozenlineColor("#e7e7e7");
                        vrspread.isPaintSuspended(false);
                        vrspread.tabStripVisible(false);//隐藏 Add Sheet Tab 

                    } else
                    {
                        vrspread.isPaintSuspended(true);
                        this.setColumnHeader(this.mincol);
                        this.setRowCount(this.minrow);
                        vrsheet.setFrozenColumnCount(1);
                        vrsheet.frozenlineColor("#e7e7e7");
                        vrspread.isPaintSuspended(false);
                        vrspread.tabStripVisible(false);//隐藏 Add Sheet Tab 
                    }
                },
                rebuiltArrayData: function (srcData)
                {
                    var self = this;
                    var result = [[]];
                    for (var i = 0; i < srcData.length; i++)
                    {
                        if (srcData[i][0] != null && srcData[i][0] != "")
                        {
                            result[i] = new Array();
                            for (var j = 0; j < srcData[i].length; j++)
                            {
                                if (srcData[i][j] != "" && srcData[i][j] != null)
                                {
                                    result[i][j] = srcData[i][j];
                                }
                            }
                        }
                    }
                    self.message = result;
                    return result;
                },
                exportRangeFromGridToExcel: function (callback)
                {
                    var data = new Array();
                    var rowCount = 0;
                    var colCount = 0;
                    for (var i = 0; i < vrsheet.getRowCount() ; i++)
                    {
                        if (vrsheet.getValue(i, 0) != "" && vrsheet.getValue(i, 0) != undefined) {
                            rowCount += 1;
                            for (var j = 0; j < vrsheet.getColumnCount() ; j++) {
                                if (vrsheet.getValue(i, j) != "" && vrsheet.getValue(i, j) != undefined) {
                                    if (j + 1 > colCount) {
                                        colCount = j + 1;
                                    }
                                }
                            }
                        }
                    }
                    for (var i = 0; i < rowCount ; i++) {
                        var rowData = new Array();
                        for (var j = 0; j < colCount; j++) {
                            if (vrsheet.getValue(i, j) != "" && vrsheet.getValue(i, j) != undefined) {
                                rowData.push(vrsheet.getValue(i, j)); 
                            } else {
                                rowData.push(" ");
                            }
                        }
                        data.push(rowData);
                    }

                    Office.context.document.setSelectedDataAsync(data, { coercionType: Office.CoercionType.Matrix },
                    function (asyncResult)
                    {
                        var error = asyncResult.error;
                        if (asyncResult.status === Office.AsyncResultStatus.Failed)
                        {
                            write(error.name + ": " + error.message);
                        }
                    });
                },

                getRangeFormExcel: function ()
                {
                    var self = this;
                    Office.context.document.getSelectedDataAsync(Office.CoercionType.Matrix,
                        { valueFormat: "unformatted", filterType: "all" },
                        function (asyncResult)
                        {
                            var error = asyncResult.error;
                            if (asyncResult.status === Office.AsyncResultStatus.Failed)
                            {
                                //write(error.name + ": " + error.message);
                                return;
                            }
                            else
                            {
                                // Get selected data.
                                var RangeData = asyncResult.value;
                                var strArray = "";
                                var arrReturn = [];
                                if (RangeData.length > 0)
                                {
                                    for (var i = 0; i < RangeData.length; i++)
                                    {
                                        var itemName = RangeData[i][0];
                                        var itemValue = [];
                                        for (var j = 1; j < RangeData[i].length; j++)
                                        {
                                            itemValue.push(RangeData[i][j]);
                                        }
                                        arrReturn.push({ "ItemName": itemName, "ItemValue": itemValue });
                                    }
                                    //callback(arrReturn);
                                    self.message = arrReturn;
                                    self.bindArraysToGrid(arrReturn);
                                }
                            }


                        });
                },
                retArrays: function ()
                {
                    var cJson = "";
                    for (var i = 0; i < vrsheet.getRowCount() ; i++)
                        for (var j = 1; j < vrsheet.getColumnCount() ; j++)
                        {
                            if (vrsheet.getValue(i, j) != "" && vrsheet.getValue(i, j) != undefined)
                            {
                                var period = j - 1;
                                cJson += "{\"ItemName\":\"" + vrsheet.getValue(i, 0) + "\",\"ItemValue\":\"" + vrsheet.getValue(i, j) + "\",\"PeriodsId\":\"" + period + "\"},";
                            }
                        }
                    cJson = cJson == "" ? "<SessionArrays>Empty</SessionArrays>" : "<SessionArrays>[{0}]</SessionArrays>".format(cJson.substr(0, cJson.length - 1));
                    return cJson;
                },
                importrange: function ()
                {
                    var self = this;
                    self.getRangeFormExcel();
                },
                exportrange: function ()
                {
                    var self = this;
                    self.exportRangeFromGridToExcel(self.rebuiltArrayData);
                },
                saverange:function(){
                    var self = this;
                    //var arrayXML = self.retArrays();
                    var columnCount = vrsheet.getColumnCount($.wijmo.wijspread.SheetArea.viewport);
                    var rowCount = vrsheet.getRowCount($.wijmo.wijspread.SheetArea.viewport);
                    var data = vrsheet.getArray(0, 0, rowCount, columnCount);
                    var arrayjson = dataProcess.rangeGridDataToJson(data);
                    var arraySaveXML = dataProcess.taskArrayObjectToXml(arrayjson);
                    webProxy.saveProcessTaskArray(self.$root.appDomain, self.$parent.searchTask, arraySaveXML, function (response)
                    {
                        if (response)
                        {
                            alert("saved successfuly.");
                        } else
                        {
                            alert("save process task variable error.");
                        }
                    });
                },
                defineTableStyle: function ()
                {
                    var tableStyle = new $.wijmo.wijspread.TableStyle();
                    var thinBorder = new $.wijmo.wijspread.LineBorder("#b5b4b4", $.wijmo.wijspread.LineStyle.thin);
                    tableStyle.wholeTableStyle(new $.wijmo.wijspread.TableStyleInfo("white", "black", "11pt calibri", thinBorder, thinBorder, thinBorder, thinBorder, thinBorder, thinBorder));
                    return tableStyle;
                },
            },
            ready: function ()
            {
                $("#divRangeTable").css({
                    width: $(window).width() - 25,
                    height: $(window).height() - 150
                });
                $(window).resize(function () {
                    $("#divRangeTable").css({
                        width: $(window).width(),
                        height: $(window).height() - 127
                    });
                })
                vrspread = new GcSpread.Sheets.Spread($("#divRangeTable")[0]);
                vrsheet = vrspread.getActiveSheet();
            }
        });
        return rangetab
    }
});
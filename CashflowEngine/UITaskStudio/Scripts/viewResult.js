/// <reference path="viewEditECXML.js" />
var rspread = null;
var rsheet = null;
define('viewResult', {
    component: function ()
    {
        var self = this;
        var resulttab = Vue.extend({
            template: '#viewresult',
            data: function ()
            {
                return {
                    minrow: 24,
                    mincolumn: 12,
                };
            },
            methods: {
                getresult: function ()
                {
                    var self = this;
                    if (self.$root.appDomain && self.$root.$refs.mainviews.sessionId) {
                        webProxy.getCaskFlowRunResultBySessionId(self.$root.appDomain, self.$root.$refs.mainviews.sessionId, function (response) {
                            self.bindArraysToGrid(response);
                        })
                    }
                },
                exportResult: function(){
                    var data = new Array();
                    var rowCount = 0;
                    var colCount = 0;
                    for (var i = 0; i < rsheet.getRowCount() ; i++) {
                        if (rsheet.getValue(i, 0) != "" && rsheet.getValue(i, 0) != undefined) {
                            rowCount += 1;
                            for (var j = 0; j < rsheet.getColumnCount() ; j++) {
                                if (rsheet.getValue(i, j) != "" && rsheet.getValue(i, j) != undefined) {
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
                            if (rsheet.getValue(i, j) != "" && rsheet.getValue(i, j) != undefined) {
                                rowData.push(rsheet.getValue(i, j));
                            } else {
                                rowData.push(" ");
                            }
                        }
                        data.push(rowData);
                    }
                    Office.context.document.setSelectedDataAsync(data, { coercionType: Office.CoercionType.Matrix },
                    function (asyncResult) {
                        var error = asyncResult.error;
                        if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                            write(error.name + ": " + error.message);
                        }
                    });
                },
                setArraySheetArea: function (rdata)
                {
                    rsheet.clear(0, 0, rsheet.getRowCount(), rsheet.getColumnCount(), GcSpread.Sheets.SheetArea.viewport, GcSpread.Sheets.StorageType.Data);
                    rsheet.autoGenerateColumns = true;
                    var sTable = rsheet.addTableByDataSource("Table1", 0, 0, rdata, this.defineTableStyle());
                    sTable.showHeader(false);
                    rsheet.deleteRows(0, 1);
                    this.setResultRowAndCol(rdata.length, rdata[0].length);
                },
                //设置array表的列号和列数
                setColumnHeader: function (col)
                {
                    var colCount = col > this.mincolumn ? col : this.mincolumn;
                    console.log(colCount);
                    rsheet.setValue(0, 0, "CashFlowName", $.wijmo.wijspread.SheetArea.colHeader);
                    rsheet.setColumnWidth(0, 250, 1, $.wijmo.wijspread.SheetArea.colHeader);
                    rsheet.setColumnCount(colCount, $.wijmo.wijspread.SheetArea.viewport);
                    for (var i = 0; i < colCount; i++) {
                        rsheet.setValue(0, i + 1, i, $.wijmo.wijspread.SheetArea.colHeader);
                    }

                },
                setResultRowAndCol: function (row, col)
                {
                    var colCount = col > this.mincol ? col : this.mincol;
                    var rowCount = row > this.minrow ? row : this.minrow;
                    //this.setColumnHeader(colCount);
                    //rsheet.setValue(0, 0, "CashFlowName", GcSpread.Sheets.SheetArea.colHeader);
                    //rsheet.setColumnWidth(0, 150, 1, GcSpread.Sheets.SheetArea.colHeader);
                    rsheet.setColumnCount(colCount, GcSpread.Sheets.SheetArea.viewport);
                    //for (var i = 0; i < colCount; i++)
                    //{
                    //    asheet.setValue(0, i + 1, i, GcSpread.Sheets.SheetArea.colHeader);
                    //    //asheet.autoFitColumn(i);
                    //}
                    rsheet.setColumnHeaderAutoText(GcSpread.Sheets.HeaderAutoText.numbers);
                    rsheet.setRowCount(rowCount, GcSpread.Sheets.SheetArea.viewport);
                    rsheet.defaults.rowHeight = 25;
                    rsheet.defaults.colWidth = 100;
                },
                //设置array表的行数
                setRowCount: function (row)
                {
                    var rowCount = row > this.minrow ? row : this.minrow;
                    rsheet.setRowCount(rowCount, $.wijmo.wijspread.SheetArea.viewport);
                    rsheet.defaults.rowHeight = 25;
                    rsheet.defaults.colWidth = 100;
                },
                //绑定数据
                bindArraysToGrid: function (response)
                {
                    var defaultStyle = rsheet.getDefaultStyle();
                    defaultStyle.formatter = "@";
                    rsheet.setDefaultStyle(defaultStyle);
                    if (response != "" && response != undefined) {
                        //console.log(response);
                        rspread.isPaintSuspended(true);
                        var arrayData = dataProcess.rangeJsonToArray(response);
                        this.setArraySheetArea(arrayData);
                        rsheet.setFrozenColumnCount(1);
                        rsheet.frozenlineColor("#e7e7e7");
                        rspread.isPaintSuspended(false);
                        rspread.tabStripVisible(false);//隐藏 Add Sheet Tab 

                    } else {
                        rspread.isPaintSuspended(true);
                        this.setColumnHeader(this.mincol);
                        this.setRowCount(this.minrow);
                        rsheet.setFrozenColumnCount(1);
                        rsheet.frozenlineColor("#e7e7e7");
                        rspread.isPaintSuspended(false);
                        rspread.tabStripVisible(false);//隐藏 Add Sheet Tab 
                    }
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
                $("#divResultTable").css({
                    width: $(window).width() - 25,
                    height: $(window).height() - 150
                });
                $(window).resize(function () {
                    $("#divResultTable").css({
                        width: $(window).width(),
                        height: $(window).height() - 127
                    });
                })
                rspread = new GcSpread.Sheets.Spread($("#divResultTable")[0]);
                rsheet = rspread.getActiveSheet();
            }
        });
        return resulttab
    }
});
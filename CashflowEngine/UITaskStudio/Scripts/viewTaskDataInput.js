define('viewTaskDataInput', {
    vspread: null,
    vsheet: null,
    asheet:null,
    createData: function ()
    {
        return {
            isActive: 0,
            curpan: 'variable',// 用以标记切换tab时，refesh按钮的名字
            id: "pop-variableinput",
            vtabs: [ // 配置导航切换
				{ text: 'variable' },
				{ text: 'range' }
            ],
            mincol: 100,
            minrow: 50,
            isshowdatainput: false,
            variables: [],
            arrayjson: []
        }
    },
    component: function ()
    {
        var self = this;
        var popDataInput = Vue.extend({
            // 载入数据
            data: function ()
            {
                return self.createData();
            },
            // 选择模板
            template: '#dataInputTemplate',
            //定义方法
            methods: {
                //关闭datainpu
                closeVariableInput: function ()
                {
                    this.isshowdatainput = false;
                    this.apply();
                },

                //variable relate items 
                //绑定variable 到grid view
                bindVariblesToGrid: function (response)
                {
                    if (response != "" && response != undefined)
                    {
                        self.vspread.isPaintSuspended(true);
                        var variableJson = this.rebuiltVariable(response);
                        this.setVariableSheetValue(variableJson);
                        //self.vsheet.setDataSource(response);
                        self.vspread.isPaintSuspended(false);
                        self.vspread.tabStripVisible(false);//隐藏 Add Sheet Tab 
                    } else
                    {
                        self.vspread.isPaintSuspended(true);
                        var variableJson = [];
                        variableJson.splice(0, 0, { Name: "StartPeriod", Value: 0, DataType: "nvarchar", IsConstant: 0, IsKey: 0, KeyIndex: 0 });
                        variableJson.splice(1, 0, { Name: "EndPeriod", Value: 11, DataType: "nvarchar", IsConstant: 0, IsKey: 0, KeyIndex: 0 });
                        this.setVariableSheetValue(variableJson);
                        this.setRowAndColumn(this.minrow);
                        self.vspread.isPaintSuspended(false);
                        self.vspread.tabStripVisible(false);//隐藏 Add Sheet Tab 
                    }
                },
                rebuiltVariable: function (rdata)
                {
                    var isExistsStartPeriod = false;
                    var isExistsEndPeriod = false;
                    var retData = rdata;
                    if (rdata != "" && rdata != undefined)
                    {
                        for (var i = 0; i < rdata.length; i++)
                        {
                            var v_name = rdata[i].Name;
                            if (v_name == "StartPeriod") { isExistsStartPeriod = true; }
                            if (v_name == "EndPeriod") { isExistsEndPeriod = true; }
                        }

                        if (!isExistsStartPeriod)
                        {
                            retData.splice(0, 0, { Name: "StartPeriod", Value: 0, DataType: "nvarchar", IsConstant: 0, IsKey: 0, KeyIndex: 0, Field: { FieldName: '', Position: '' } });
                        }
                        if (!isExistsEndPeriod)
                        {
                            retData.splice(1, 0, { Name: "EndPeriod", Value: 11, DataType: "nvarchar", IsConstant: 0, IsKey: 0, KeyIndex: 0, Field: { FieldName: '', Position: '' } });
                        }
                    }
                    return retData;
                },
                setVariableSheetValue: function (rdata)
                {
                    self.vsheet.clear(0, 0, self.vsheet.getRowCount(), self.vsheet.getColumnCount(), GcSpread.Sheets.SheetArea.viewport, GcSpread.Sheets.StorageType.Data);
                    self.vsheet.autoGenerateColumns = true;
                    //, this.defineTableStyle()
                    //var sTable2 = self.vsheet.addTable("Table2", 0, 0, 50, 100, GcSpread.Sheets.TableStyles.medium2());
                    var sTable2 = self.vsheet.addTableByDataSource("Table2", 0, 0, rdata, this.defineTableStyle());
                    sTable2.showHeader(false);
                    self.vsheet.deleteRows(0, 1);

                    this.setRowAndColumn(rdata.length);
                },

                //设置variable表的行和列
                setRowAndColumn: function (row)
                {
                    var rowCount = row > this.minrow ? row : this.minrow;
                    self.vsheet.setValue(0, 0, "Name", $.wijmo.wijspread.SheetArea.colHeader);
                    self.vsheet.setValue(0, 1, "Value", $.wijmo.wijspread.SheetArea.colHeader);
                    self.vsheet.setValue(0, 2, "DataType", $.wijmo.wijspread.SheetArea.colHeader);
                    self.vsheet.setValue(0, 3, "IsConstant", $.wijmo.wijspread.SheetArea.colHeader);
                    self.vsheet.setValue(0, 4, "IsKey", $.wijmo.wijspread.SheetArea.colHeader);
                    self.vsheet.setValue(0, 5, "KeyIndex", $.wijmo.wijspread.SheetArea.colHeader);
                    self.vsheet.setColumnWidth(0, 150, 1, $.wijmo.wijspread.SheetArea.colHeader);
                    self.vsheet.setColumnWidth(1, 150, 1, $.wijmo.wijspread.SheetArea.colHeader);
                    self.vsheet.setColumnWidth(2, 150, 1, $.wijmo.wijspread.SheetArea.colHeader);
                    self.vsheet.setColumnWidth(3, 150, 1, $.wijmo.wijspread.SheetArea.colHeader);
                    self.vsheet.setColumnWidth(4, 150, 1, $.wijmo.wijspread.SheetArea.colHeader);
                    self.vsheet.setColumnWidth(5, 150, 1, $.wijmo.wijspread.SheetArea.colHeader);
                    self.vsheet.setColumnCount(6, $.wijmo.wijspread.SheetArea.viewport);
                    self.vsheet.setRowCount(rowCount, $.wijmo.wijspread.SheetArea.viewport);
                    self.vsheet.defaults.rowHeight = 25;
                    self.vsheet.defaults.colWidth = 150;
                },

                //从grid获取数据，并组装成json用于保存
                retVariables: function ()
                {
                    var variableJson = "";
                    var tempVariable = "";
                    var Variabletemp = "</Value><DataType>nvarchar</DataType> <IsConstant>0</IsConstant><IsKey>0</IsKey><KeyIndex>0</KeyIndex></SessionVariable>";
                    if (self.vsheet.getRowCount() > 0)
                    {
                        for (var i = 0; i < self.vsheet.getRowCount() ; i++)
                        {
                            if (self.vsheet.getValue(i, 0) != "" && self.vsheet.getValue(i, 1) != undefined)
                                tempVariable += "<SessionVariable><Name>" + self.vsheet.getValue(i, 0) + "</Name><Value>" + self.vsheet.getValue(i, 1) + Variabletemp;
                        }
                    }
                    variableJson = "<SessionVariables>" + tempVariable + "</SessionVariables>";
                    return variableJson;
                },

                //更新variable
                refreshVariable: function ()
                {
                    var that = this;
                    self.vsheet.clear(0, 0, self.vsheet.getRowCount(), self.vsheet.getColumnCount(), GcSpread.Sheets.SheetArea.viewport, GcSpread.Sheets.StorageType.Data);
                    webProxy.getTaskSessionContextByTaskCode(this.$root.appDomain, this.$parent.taskCode, function (response)
                    {
                        this.variables = dataProcess.variableXmlToJson(response);
                        that.bindVariblesToGrid(this.variables);
                    });
                    //that.bindVariblesToGrid(this.variables);
                },
                //variable relate items end

                //array relate items
                setArraySheetArea: function (rdata)
                {
                    self.asheet.clear(0, 0, self.asheet.getRowCount(), self.asheet.getColumnCount(), GcSpread.Sheets.SheetArea.viewport, GcSpread.Sheets.StorageType.Data);
                    self.asheet.autoGenerateColumns = true;
                    //self.asheet.setDataSource(rdata);, $.wijmo.wijspread.TableStyles.medium5()
                    var sTable = self.asheet.addTableByDataSource("Table1", 0, 0, rdata, this.defineTableStyle());
                    sTable.showHeader(false);
                    self.asheet.deleteRows(0, 1);
                    //self.asheet.setArray(0, 0, rdata);
                    this.setColumnHeader(rdata[0].length);
                    // this.setColumnHeader(rdata[0].ItemValue.length);
                    this.setRowCount(rdata.length);
                },
                //设置array表的列号和列数
                setColumnHeader: function (col)
                {
                    var colCount = col > this.mincol ? col : this.mincol;
                    console.log(colCount);
                    self.asheet.setValue(0, 0, "CashFlowName", $.wijmo.wijspread.SheetArea.colHeader);
                    self.asheet.setColumnWidth(0, 150, 1, $.wijmo.wijspread.SheetArea.colHeader);
                    self.asheet.setColumnCount(colCount, $.wijmo.wijspread.SheetArea.viewport);
                    for (var i = 0; i < colCount; i++)
                    {
                        self.asheet.setValue(0, i + 1, i, $.wijmo.wijspread.SheetArea.colHeader);
                    }
                    self.asheet.setFrozenColumnCount(1); //固定列
                    self.asheet.frozenlineColor("#e7e7e7");//
                },
                //设置array表的行数
                setRowCount: function (row)
                {
                    var rowCount = row > this.minrow ? row : this.minrow;
                    self.asheet.setRowCount(rowCount, $.wijmo.wijspread.SheetArea.viewport);
                    self.asheet.defaults.rowHeight = 25;
                    self.asheet.defaults.colWidth = 100;
                },
                //绑定数据
                bindArraysToGrid: function (response)
                {
                    if (response != "" && response != undefined)
                    {
                        //console.log(response);
                        self.vspread.isPaintSuspended(true);
                        var arrayData = dataProcess.rangeJsonToArray(response);
                        this.setArraySheetArea(arrayData);
                        self.vspread.isPaintSuspended(false);
                        self.vspread.tabStripVisible(false);//隐藏 Add Sheet Tab 

                    } else
                    {
                        self.vspread.isPaintSuspended(true);
                        this.setColumnHeader(this.mincol);
                        this.setRowCount(this.minrow);
                        self.vspread.isPaintSuspended(false);
                        self.vspread.tabStripVisible(false);//隐藏 Add Sheet Tab 
                    }
                },
                //从gridview获取数据并组织成json
                retArrays: function ()
                {
                    var cJson = "";
                    for (var i = 0; i < self.asheet.getRowCount() ; i++)
                        for (var j = 0; j < self.asheet.getColumnCount() ; j++)
                        {
                            if (self.asheet.getValue(i, j) != "" && self.asheet.getValue(i, j) != undefined)
                            {
                                var period = j - 1;
                                cJson += "{\"ItemName\":\"" + self.asheet.getValue(i, 0) + "\",\"ItemValue\":\"" + self.asheet.getValue(i, j) + "\",\"PeriodsId\":\"" + period + "\"},";
                            }
                        }
                    cJson = cJson == "" ? "<SessionArrays>Empty</SessionArrays>" : "<SessionArrays>[{0}]</SessionArrays>".format(cJson.substr(0, cJson.length - 1));
                    return cJson;
                },
                //刷新Array
                refreshArray: function ()
                {
                    var that = this;
                    self.asheet.clear(0, 0, self.asheet.getRowCount(), self.asheet.getColumnCount(), GcSpread.Sheets.SheetArea.viewport, GcSpread.Sheets.StorageType.Data);
                    webProxy.getProcessTaskArrayByTaskCode(this.$root.appDomain, this.$parent.taskCode, function (response)
                    {
                        this.arrayjson = response;
                        that.bindArraysToGrid(this.arrayjson);
                    });
                    //that.bindArraysToGrid(this.arrayjson);
                },
                //array relate items end
               
                btnClick: function (index)
                {
                    this.curpan = this.vtabs[index].text;
                    this.isActive = index;
                    if (this.isActive == 0)
                    {
                        //self.vsheet.reset();
                        self.vspread.setActiveSheet("Sheet1");
                    }
                    else
                    {
                        //self.vsheet.reset();
                        self.vspread.setActiveSheet("Sheet2");
                        //this.bindArraysToGrid(this.arrayjson);
                    }
                },

                saveData: function (curentPan)
                {
                    if (curentPan == "variable")
                    {
                        webProxy.saveProcessTaskContext(this.$root.appDomain, this.$parent.taskCode, this.retVariables());
                    }
                    else
                    {
                        webProxy.saveProcessTaskArray(this.$root.appDomain, this.$parent.taskCode, this.retArrays());
                    }
                },
                refreshData: function (curentPan)
                {
                    if (curentPan == "variable")
                    {
                        this.refreshVariable();
                    }
                    else
                    {
                        this.refreshArray();
                    }
                },
                apply: function ()
                {
                    //if (curentPan == "range")
                    //{
                        var columnCount = self.asheet.getColumnCount($.wijmo.wijspread.SheetArea.viewport);
                        var rowCount = self.asheet.getRowCount($.wijmo.wijspread.SheetArea.viewport);
                        var data = self.asheet.getArray(0, 0, rowCount, columnCount);
                        this.arrayjson = dataProcess.rangeGridDataToJson(data);
                        console.log(this.arrayjson);
                    //}
                    //else
                    //{
                        var columnCount = self.vsheet.getColumnCount($.wijmo.wijspread.SheetArea.viewport);
                        var rowCount = self.vsheet.getRowCount($.wijmo.wijspread.SheetArea.viewport);
                        var data = self.vsheet.getArray(0, 0, rowCount, columnCount);
                        this.variables = dataProcess.variableGridDataToJson(data);
                        console.log(this.variables);
                    //}
                },

                //context menu item start
                getCellInSelections: function (selections, row, col)
                {
                    var count = selections.length, range;
                    for (var i = 0; i < count; i++)
                    {
                        range = selections[i];
                        if (range.contains(row, col))
                        {
                            return range;
                        }
                    }
                    return null;
                },
                getHitTest: function (pageX, pageY, sheet)
                {
                    var offset = $("#divVariableTable").offset(),
                            x = pageX - offset.left,
                            y = pageY - offset.top;
                    return sheet.hitTest(x, y);
                },
                showMergeContextMenu: function ()
                {
                    // use the result of updateMergeButtonsState
                    if ($("#mergeCells").attr("disabled"))
                    {
                        $(".context-merge").hide();
                    } else
                    {
                        $(".context-cell.divider").show();
                        $(".context-merge").show();
                    }

                    if ($("#unmergeCells").attr("disabled"))
                    {
                        $(".context-unmerge").hide();
                    } else
                    {
                        $(".context-cell.divider").show();
                        $(".context-unmerge").show();
                    }
                },
                processSpreadContextMenu: function (e)
                {
                    var that = this;
                    // move the context menu to the position of the mouse point
                    var sheet = self.vspread.getActiveSheet(),
                        target = that.getHitTest(e.pageX, e.pageY, sheet),
                        hitTestType = target.hitTestType,
                        row = target.row,
                        col = target.col,
                        selections = sheet.getSelections();

                    var isHideContextMenu = false;

                    if (hitTestType === GcSpread.Sheets.SheetArea.colHeader)
                    {
                        if (that.getCellInSelections(selections, row, col) === null)
                        {
                            sheet.setSelection(-1, col, sheet.getRowCount(), 1);
                        }
                        if (row !== undefined && col !== undefined)
                        {
                            $(".context-header").show();
                            $(".context-cell").hide();
                        }
                    } else if (hitTestType === GcSpread.Sheets.SheetArea.rowHeader)
                    {
                        if (that.getCellInSelections(selections, row, col) === null)
                        {
                            sheet.setSelection(row, -1, 1, sheet.getColumnCount());
                        }
                        if (row !== undefined && col !== undefined)
                        {
                            $(".context-header").show();
                            $(".context-cell").hide();
                        }
                    } else if (hitTestType === GcSpread.Sheets.SheetArea.viewport)
                    {
                        if (that.getCellInSelections(selections, row, col) === null)
                        {
                            sheet.clearSelection();
                            sheet.endEdit();
                            sheet.setActiveCell(row, col);
                            that.updateMergeButtonsState();
                        }
                        if (row !== undefined && col !== undefined)
                        {
                            $(".context-header").hide();
                            $(".context-cell").hide();
                            that.showMergeContextMenu();
                        } else
                        {
                            isHideContextMenu = true;
                        }
                    } else if (hitTestType === GcSpread.Sheets.SheetArea.corner)
                    {
                        sheet.setSelection(-1, -1, sheet.getRowCount(), sheet.getColumnCount());
                        if (row !== undefined && col !== undefined)
                        {
                            $(".context-header").hide();
                            $(".context-cell").show();
                        }
                    }

                    var $contextMenu = $("#spreadContextMenu");
                    $contextMenu.data("sheetArea", hitTestType);
                    if (isHideContextMenu)
                    {
                        that.hideSpreadContextMenu();
                    } else
                    {
                        $contextMenu.css({ left: e.pageX, top: e.pageY });
                        $contextMenu.show();

                        $(document).on("mousedown.contextmenu", function ()
                        {
                            if ($(event.target).parents("#spreadContextMenu").length === 0)
                            {
                                that.hideSpreadContextMenu();
                            }
                        });
                    }
                },
                hideSpreadContextMenu: function ()
                {
                    $("#spreadContextMenu").hide();
                    $(document).off("mousedown.contextmenu");
                },
                processContextMenuClicked: function (selectOption)
                {
                    var that = this;
                    var action = $(selectOption).data("action");
                    var sheet = self.vspread.getActiveSheet();
                    var sheetArea = $("#spreadContextMenu").data("sheetArea");

                    that.hideSpreadContextMenu();
                    var realColnm = self.asheet.getColumnCount($.wijmo.wijspread.SheetArea.viewport);
                    console.log(realColnm);
                    switch (action)
                    {
                        case "cut":
                            GcSpread.Sheets.SpreadActions.cut.call(sheet);
                            break;
                        case "copy":
                            GcSpread.Sheets.SpreadActions.copy.call(sheet);
                            break;
                        case "paste":
                            GcSpread.Sheets.SpreadActions.paste.call(sheet);
                            break;
                        case "insert":
                            if (sheetArea === GcSpread.Sheets.SheetArea.colHeader)
                            {
                                
                                sheet.addColumns(sheet.getActiveColumnIndex(), sheet.getSelections()[0].colCount);
                                self.vspread.isPaintSuspended(true);
                                for (i = sheet.getActiveColumnIndex(); i <= realColnm; i++)
                                {
                                    sheet.setValue(0, i, i - 1, $.wijmo.wijspread.SheetArea.colHeader);
                                }
                                self.vspread.isPaintSuspended(false);
                            } else if (sheetArea === GcSpread.Sheets.SheetArea.rowHeader)
                            {
                                sheet.addRows(sheet.getActiveRowIndex(), sheet.getSelections()[0].rowCount);
                            }
                            break;
                        case "delete":
                            if (sheetArea === GcSpread.Sheets.SheetArea.colHeader)
                            {
                                sheet.deleteColumns(sheet.getActiveColumnIndex(), sheet.getSelections()[0].colCount);
                                self.vspread.isPaintSuspended(true);
                                for (i = realColnm; i >= sheet.getActiveColumnIndex() ; i--)
                                {
                                    sheet.setValue(0, i, i - 1, $.wijmo.wijspread.SheetArea.colHeader);
                                }
                                self.vspread.isPaintSuspended(false);
                            } else if (sheetArea === GcSpread.Sheets.SheetArea.rowHeader)
                            {
                                sheet.deleteRows(sheet.getActiveRowIndex(), sheet.getSelections()[0].rowCount);
                            }
                            break;
                        case "merge":
                            var sel = sheet.getSelections();
                            if (sel.length > 0)
                            {
                                sel = sel[sel.length - 1];
                                sheet.addSpan(sel.row, sel.col, sel.rowCount, sel.colCount, GcSpread.Sheets.SheetArea.viewport);
                            }
                            that.updateMergeButtonsState();
                            break;
                        case "unmerge":
                            var sels = sheet.getSelections();
                            for (var i = 0; i < sels.length; i++)
                            {
                                var sel = getActualCellRange(sels[i], sheet.getRowCount(), sheet.getColumnCount());
                                for (var r = 0; r < sel.rowCount; r++)
                                {
                                    for (var c = 0; c < sel.colCount; c++)
                                    {
                                        var span = sheet.getSpan(r + sel.row, c + sel.col, GcSpread.Sheets.SheetArea.viewport);
                                        if (span)
                                        {
                                            sheet.removeSpan(span.row, span.col, GcSpread.Sheets.SheetArea.viewport);
                                        }
                                    }
                                }
                            }
                            that.updateMergeButtonsState();
                            break;
                        default:
                            break;
                    }
                },
                updateMergeButtonsState: function ()
                {
                    var that = this;
                    var sheet = self.vspread.getActiveSheet();
                    var sels = sheet.getSelections(),
                        mergable = false,
                        unmergable = false;

                    sels.forEach(function (range)
                    {
                        var ranges = sheet.getSpans(range),
                            spanCount = ranges.length;

                        if (!mergable)
                        {
                            if (spanCount > 1 || (spanCount === 0 && (range.rowCount > 1 || range.colCount > 1)))
                            {
                                mergable = true;
                            } else if (spanCount === 1)
                            {
                                var range2 = ranges[0];
                                if (range2.row !== range.row || range2.col !== range.col ||
                                    range2.rowCount !== range2.rowCount || range2.colCount !== range.colCount)
                                {
                                    mergable = true;
                                }
                            }
                        }
                        if (!unmergable)
                        {
                            unmergable = spanCount > 0;
                        }
                    });

                    $("#mergeCells").attr("disabled", mergable ? null : "disabled");
                    $("#unmergeCells").attr("disabled", unmergable ? null : "disabled");
                },
                rebindcontextmenu: function ()
                {
                    var that = this;
                    $("#divVariableTable").bind("contextmenu", that.processSpreadContextMenu);
                    $("#divVariableTable").mouseup(function (e)
                    {
                        // hide context menu when the mouse down on SpreadJS
                        if (e.button !== 2)
                        {
                            that.hideSpreadContextMenu();
                        }
                    });
                },
                bindcontextmenu: function ()
                {
                    var that = this;
                    $("#spreadContextMenu a").bind("click", function ()
                    {
                        var curobj = this;
                        that.processContextMenuClicked(curobj);
                    });
                },
                //context menu items end

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
                }
            },
            watch: {
                variables: function (newVariable) {
                    this.$root.$refs.task.$refs.tasktool.items[1].list = newVariable;
                    this.$root.$refs.caculation.$refs.caculationtools.data.items[1].list = dataProcess.variableParameterModelByVariableModel(newVariable);
                }
            },
            ready: function ()
            {
                self.vspread = new GcSpread.Sheets.Spread($("#divVariableTable")[0], {sheetCount: 2 });
                self.vsheet = self.vspread.getSheet(0);
                self.asheet = self.vspread.getSheet(1);
                $(document).on("contextmenu", function ()
                {
                    event.preventDefault();
                    return false;
                });
                this.rebindcontextmenu();
                this.bindcontextmenu();
            }

        });
        return popDataInput;
    }
});
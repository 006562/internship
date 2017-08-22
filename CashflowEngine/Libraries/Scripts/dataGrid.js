var dataGrid = {
    vspread: null,
    vsheet:null,
    asheet: null,
    vminrow: 0,
    vmincol:6,
    amincol:0,
    aminrow:0,
    //绑定variable 
    bindVariblesToGrid:function (response) {
        var that = this;
        that.rebuiltVariable(response);
    },
    rebuiltVariable: function (rdata) {
        var that = this;
        var isExistsStartPeriod = false;
        var isExistsEndPeriod = false;
        var retData = rdata;
  
        if (rdata != "" && rdata != undefined) {
            for (var i = 0; i < rdata.length; i++) {
                var v_name = rdata[i].Name;
                if (v_name == "StartPeriod") { isExistsStartPeriod = true; }
                if (v_name == "EndPeriod") { isExistsEndPeriod = true; }
            }
        }
        if (!isExistsStartPeriod) {
            retData.splice(0, 0, { Name: "StartPeriod", Value: 0, DataType: "nvarchar", IsConstant: 0, IsKey: 0, KeyIndex: 0, Field: { FieldName: '', Position: '' } });
        }
        if (!isExistsEndPeriod) {
            retData.splice(1, 0, { Name: "EndPeriod", Value: 11, DataType: "nvarchar", IsConstant: 0, IsKey: 0, KeyIndex: 0, Field: { FieldName: '', Position: '' } });
        }
       
        that.vspread.isPaintSuspended(true);
        that.setVariableSheetValue(retData);
        that.vspread.isPaintSuspended(false);
    },
    setVariableSheetValue: function (rdata) {
        var that = this;
        that.vsheet.clear(0, 0, that.vsheet.getRowCount(), that.vsheet.getColumnCount(), GcSpread.Sheets.SheetArea.viewport, GcSpread.Sheets.StorageType.Data);
        that.vsheet.autoGenerateColumns = true;
        var sTable2 = that.vsheet.addTableByDataSource("Table2", 0, 0, rdata, that.defineTableStyle());
        sTable2.showHeader(false);
        that.vsheet.deleteRows(0, 1);
        this.setVariableRowAndColumn(rdata.length);
        var defaultStyle = that.vsheet.getDefaultStyle();
        defaultStyle.formatter = "@";
        that.vsheet.setDefaultStyle(defaultStyle);
    },
    setVariableRowAndColumn: function (row) {
        var that = this;
        var rowCount = row > this.vminrow ? row : this.vminrow;
        that.vsheet.setValue(0, 0, "Name", $.wijmo.wijspread.SheetArea.colHeader);
        that.vsheet.setValue(0, 1, "Value", $.wijmo.wijspread.SheetArea.colHeader);
        that.vsheet.setValue(0, 2, "DataType", $.wijmo.wijspread.SheetArea.colHeader);
        that.vsheet.setValue(0, 3, "IsConstant", $.wijmo.wijspread.SheetArea.colHeader);
        that.vsheet.setValue(0, 4, "IsKey", $.wijmo.wijspread.SheetArea.colHeader);
        that.vsheet.setValue(0, 5, "KeyIndex", $.wijmo.wijspread.SheetArea.colHeader);
        that.vsheet.setColumnWidth(0, 150, 1, $.wijmo.wijspread.SheetArea.colHeader);
        that.vsheet.setColumnWidth(1, 150, 1, $.wijmo.wijspread.SheetArea.colHeader);
        that.vsheet.setColumnWidth(2, 150, 1, $.wijmo.wijspread.SheetArea.colHeader);
        that.vsheet.setColumnWidth(3, 150, 1, $.wijmo.wijspread.SheetArea.colHeader);
        that.vsheet.setColumnWidth(4, 150, 1, $.wijmo.wijspread.SheetArea.colHeader);
        that.vsheet.setColumnWidth(5, 150, 1, $.wijmo.wijspread.SheetArea.colHeader);
        that.vsheet.setColumnCount(this.vmincol, $.wijmo.wijspread.SheetArea.viewport);
        that.vsheet.setRowCount(rowCount, $.wijmo.wijspread.SheetArea.viewport);
    },
    refreshVariable: function (vmModel) {
        var that = this;
        var appDomin = vmModel.appDomain;
        var taskCode = vmModel.taskCode;
        webProxy.getTaskSessionContextByTaskCode(appDomin, taskCode, function (response) {
            
        });
    },
    retVariables: function () {
        var variableJson = "";
        var tempVariable = "";
        var Variabletemp = "</Value><DataType>nvarchar</DataType> <IsConstant>0</IsConstant><IsKey>0</IsKey><KeyIndex>0</KeyIndex></SessionVariable>";
        if (this.vsheet.getRowCount() > 0) {
            for (var i = 0; i < this.vsheet.getRowCount() ; i++) {
                if (this.vsheet.getValue(i, 0) != "" && this.vsheet.getValue(i, 1) != undefined)
                    tempVariable += "<SessionVariable><Name>" + this.vsheet.getValue(i, 0) + "</Name><Value>" + this.vsheet.getValue(i, 1) + Variabletemp;
            }
        }
        variableJson = "<SessionVariables>" + tempVariable + "</SessionVariables>";
        return variableJson;
    },
    //绑定数据array
    bindArraysToGrid: function (response) {
        var that = this;
        that.vspread.isPaintSuspended(true);
        that.setArraySheetArea(dataProcess.rangeJsonToArray(response));
        that.vspread.isPaintSuspended(false);
    },
    setArraySheetArea: function (rdata) {
        var that = this;
        that.asheet.clear(0, 0, that.asheet.getRowCount(), that.asheet.getColumnCount(), GcSpread.Sheets.SheetArea.viewport, GcSpread.Sheets.StorageType.Data);
        if (rdata != null) {
            that.asheet.autoGenerateColumns = true;
            var sTable = that.asheet.addTableByDataSource("Table1", 0, 0, rdata, that.defineTableStyle());
            sTable.showHeader(false);
            that.asheet.deleteRows(0, 1);
            that.setArrayRowAndColumn(rdata.length, rdata[0].length);
        } else {
            that.setArrayRowAndColumn(that.aminrow, that.amincol);
        }
        var defaultStyle = that.asheet.getDefaultStyle();
        defaultStyle.formatter = "@";
        that.asheet.setDefaultStyle(defaultStyle);
    },
    setArrayRowAndColumn: function (row, col) {
        var that = this;
        var colCount = col > this.amincol ? col : this.amincol;
        var rowCount = row > this.aminrow ? row : this.aminrow;
        that.asheet.setValue(0, 0, "CashFlowName", $.wijmo.wijspread.SheetArea.colHeader);
        that.asheet.setColumnWidth(0, 150, 1, $.wijmo.wijspread.SheetArea.colHeader);
        that.asheet.setColumnCount(colCount, $.wijmo.wijspread.SheetArea.viewport);
        that.asheet.setRowCount(rowCount, $.wijmo.wijspread.SheetArea.viewport);
        for (var i = 0; i < colCount; i++) {
            that.asheet.setValue(0, i + 1, i, $.wijmo.wijspread.SheetArea.colHeader);
        }
    },
    refreshArray: function (vmModel) {
        var that = this;
        var appDomin = vmModel.appDomain;
        var taskCode = vmModel.taskCode;
        webProxy.getProcessTaskArrayByTaskCode(appDomin, taskCode, function (response) {
            that.bindArraysToGrid(response);
        });
    },
    //从gridview获取数据并组织成json
    retArrays: function () {
        var cJson = "";
        for (var i = 0; i < this.asheet.getRowCount() ; i++)
            for (var j = 0; j < this.asheet.getColumnCount() ; j++) {
                if (this.asheet.getValue(i, j) != "" && this.asheet.getValue(i, j) != undefined) {
                    var period = j - 1;
                    cJson += "{\"ItemName\":\"" + this.asheet.getValue(i, 0) + "\",\"ItemValue\":\"" + this.asheet.getValue(i, j) + "\",\"PeriodsId\":\"" + period + "\"},";
                }
            }
        cJson = cJson == "" ? "<SessionArrays>Empty</SessionArrays>" : "<SessionArrays>[{0}]</SessionArrays>".format(cJson.substr(0, cJson.length - 1));
        return cJson;
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
        var id = this.vspread._vp.id;
        var offset = $("#" + id).offset(),
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
        that = dataGrid;
        // move the context menu to the position of the mouse point
        var sheet = that.vspread.getActiveSheet(),
            target = that.getHitTest(e.pageX, e.pageY, sheet),
            hitTestType = target.hitTestType,
            row = target.row,
            col = target.col,
            selections = sheet.getSelections();
      
   
        var isHideContextMenu = false;

        if (hitTestType === GcSpread.Sheets.SheetArea.colHeader)
        {
            if (sheet._id == 1) {
                isHideContextMenu = true;
            } else {
                isHideContextMenu = false;
                $(".context-header").show();
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
    processContextMenuClicked: function (obj)
    {
        var that = dataGrid;
        var action = $(obj).data("action");
        var sheet = that.vspread.getActiveSheet();
        var sheetArea = $("#spreadContextMenu").data("sheetArea");
        that.hideSpreadContextMenu();
        var realColnm = that.asheet.getColumnCount($.wijmo.wijspread.SheetArea.viewport);

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
                if (sheetArea === GcSpread.Sheets.SheetArea.colHeader) {
                    sheet.addColumns(sheet.getActiveColumnIndex(), 1);
                    var rowCount = parseInt(sheet.getRowCount());
                    var columnCount = parseInt(sheet.getColumnCount());
                    that.vspread.isPaintSuspended(true);
                    that.setArrayRowAndColumn(rowCount, columnCount);
                    that.vspread.isPaintSuspended(false);
                } else if (sheetArea === GcSpread.Sheets.SheetArea.rowHeader) {
                    sheet.addRows(sheet.getActiveRowIndex(), sheet.getSelections()[0].rowCount);
                }
                break;
            case "delete":
                if (sheetArea === GcSpread.Sheets.SheetArea.colHeader) {
                    sheet.deleteColumns(sheet.getActiveColumnIndex(), 1);
                    var rowCount = parseInt(sheet.getRowCount());
                    var columnCount = parseInt(sheet.getColumnCount());
                    that.vspread.isPaintSuspended(true);
                    that.setArrayRowAndColumn(rowCount, columnCount);
                    that.vspread.isPaintSuspended(false);
                } else if (sheetArea === GcSpread.Sheets.SheetArea.rowHeader) {
                    sheet.deleteRows(sheet.getActiveRowIndex(), sheet.getSelections()[0].rowCount);
                }
                break;
            default:
                break;
        }
    },
    updateMergeButtonsState: function ()
    {
        var that = dataGrid;
        var sheet = that.vspread.getActiveSheet();
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
    //context menu items end
    defineTableStyle: function ()
    {
        var tableStyle = new $.wijmo.wijspread.TableStyle();
        var thinBorder = new $.wijmo.wijspread.LineBorder("#b5b4b4", $.wijmo.wijspread.LineStyle.thin);
        tableStyle.wholeTableStyle(new $.wijmo.wijspread.TableStyleInfo("white", "black", "11pt calibri", thinBorder, thinBorder, thinBorder, thinBorder, thinBorder, thinBorder));
        return tableStyle;
    },
    bindcontextmenu: function (vmobj) {
        var that = this;
        var id = that.vspread._vp.id;
        //绑定菜单
        $("#" + id).bind("contextmenu", function (e) {
            that.processSpreadContextMenu(e);
        });

        $("#" + id).bind("click", function (e) {
            that.hideSpreadContextMenu();
        });

        $("#spreadContextMenu a").bind("click", function () {
            that.processContextMenuClicked(this);
        });

        $(document).on("contextmenu", function () {
            event.preventDefault();
            return false;
        });
    }
}

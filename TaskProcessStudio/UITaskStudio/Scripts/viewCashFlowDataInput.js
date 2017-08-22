define('viewCashFlowDataInput', {
    template: '#mainview',
    data: function () {
        return {
            tabActive: 'variable', // 默认TAB显示
            variables: [],
            appDomain: '',
            taskCode: '',
            currentGuid: ''
        };
    },
    methods: {
        loadData: function () {
            var self = this;
            this.appDomain = getUrlParam('appDomain');
            this.taskCode = getUrlParam('taskCode');
            this.currentGuid = getUrlParam('guid');
 
            $("#divDataInputTable").css({width: $(window).width(),height: $(window).height() - 50});
            dataGrid.vspread = new GcSpread.Sheets.Spread($("#divDataInputTable")[0], { sheetCount: 1 });
            dataGrid.vspread.tabStripVisible(false);
            dataGrid.bindcontextmenu();
            self.initVariableTable();            
        },
        initVariableTable:function(){
            dataGrid.vsheet = dataGrid.vspread.getSheet(0);
            dataGrid.vminrow = 50;
            dataGrid.vmincol = 6;
            dataGrid.vsheet.defaults.rowHeight = 25;
            dataGrid.vsheet.defaults.colWidth = 100;
            this.variables = localStorage["variables" + this.currentGuid] == "" ? [] : JSON.parse(localStorage["variables" + this.currentGuid]);
            dataGrid.bindVariblesToGrid(this.variables);
        },
        apply: function () {
            var variabedata = dataGrid.vsheet.getArray(0, 0, dataGrid.vsheet.getRowCount($.wijmo.wijspread.SheetArea.viewport), dataGrid.vsheet.getColumnCount($.wijmo.wijspread.SheetArea.viewport));
            localStorage["variables" + this.currentGuid] = JSON.stringify(dataProcess.variableGridDataToJson(variabedata));
        },
        refreshData: function () {
            this.initVariableTable();
        },
        saveData: function () {
            var that = this;
            var variabedata = dataGrid.vsheet.getArray(0, 0, dataGrid.vsheet.getRowCount($.wijmo.wijspread.SheetArea.viewport), dataGrid.vsheet.getColumnCount($.wijmo.wijspread.SheetArea.viewport));
            var variableJson = dataProcess.variableGridDataToJson(variabedata);
            webProxy.saveProcessTaskContext(this.appDomain, this.taskCode, dataProcess.taskSessionContentXml(variableJson), function (response) {
                if (response) {
                    localStorage["variables" + that.currentGuid] = JSON.stringify(variableJson);
                    that.variables = variableJson;
                    alert("saved successfuly.");
                } else {
                    alert("save process task variable error.");
                }
            });
        }
    },
    ready: function () {
        this.loadData();
    }
});
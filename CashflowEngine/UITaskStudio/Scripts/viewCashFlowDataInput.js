define('viewCashFlowDataInput', {
    template: '#mainview',
    data: function () {
        return {
            tabActive: 'variable', // 默认TAB显示
            variables: [],
            arrayJson: [],
            appDomain: '',
            taskCode: '',
            currentGuid: '',
            showDataInput:false
        };
    },
    methods: {
        loadData: function () {
            var self = this;
            $("#divDataInputTable").css({ width: $(window).width(), height: $(window).height() - 50 });
            dataGrid.vspread = new GcSpread.Sheets.Spread($("#divDataInputTable")[0], { sheetCount: 2 });
            dataGrid.vspread.tabStripVisible(false);
            dataGrid.bindcontextmenu();
            self.initVariableTable();
            self.initArrayTable();        
        },
        initVariableTable: function () {
            dataGrid.vsheet = dataGrid.vspread.getSheet(0);
            dataGrid.vminrow = 50;
            dataGrid.vmincol = 6;
            dataGrid.vsheet.defaults.rowHeight = 25;
            dataGrid.vsheet.defaults.colWidth = 100;
            this.variables = globalVariable.variableObj == undefined ? [] : globalVariable.variableObj;
            dataGrid.bindVariblesToGrid(this.variables);
        },
        initArrayTable: function () {
            dataGrid.asheet = dataGrid.vspread.getSheet(1);
            dataGrid.aminrow = 50;
            dataGrid.amincol = 200;
            dataGrid.asheet.defaults.rowHeight = 25;
            dataGrid.asheet.defaults.colWidth = 150;
            dataGrid.asheet.setFrozenColumnCount(1); //固定列
            dataGrid.asheet.frozenlineColor("#e7e7e7");
            this.arrayJson = globalVariable.arrObj == undefined ? [] : globalVariable.arrObj;
            dataGrid.bindArraysToGrid(this.arrayJson);
        },
        changeTab: function (val) {
            this.tabActive = val;
            if (this.tabActive == "variable") {
                dataGrid.vspread.setActiveSheet("Sheet1");
            }
            else {
                dataGrid.vspread.setActiveSheet("Sheet2");
            }
        },
        apply: function () {
            var viewport = $.wijmo.wijspread.SheetArea.viewport;
            var arraydata = dataGrid.asheet.getArray(0, 0, dataGrid.asheet.getRowCount(viewport), dataGrid.asheet.getColumnCount(viewport));
            var variabedata = dataGrid.vsheet.getArray(0, 0, dataGrid.vsheet.getRowCount(viewport), dataGrid.vsheet.getColumnCount(viewport));

            var variables = dataProcess.variableGridDataToJson(variabedata);
            var range = dataProcess.rangeGridDataToJson(arraydata);

            this.$root.$refs.task.$refs.tasktool.items[1].list = variables;
            this.$root.$refs.caculation.$refs.caculationtools.data.items[1].list = variables;

            globalVariable.variableObj = variables;
            globalVariable.arrObj = range;
            this.showDataInput = false;
        },
        refreshData: function () {
            if (this.tabActive == "variable") {
                this.initVariableTable();
            }
            else {
                this.initArrayTable();
            }
        },
        saveData: function () {
            var that = this;
            var viewport = $.wijmo.wijspread.SheetArea.viewport;

            if (this.tabActive == "variable") {
                var variabedata = dataGrid.vsheet.getArray(0, 0, dataGrid.vsheet.getRowCount(viewport), dataGrid.vsheet.getColumnCount(viewport));
                var variableJson = dataProcess.variableGridDataToJson(variabedata);
                webProxy.saveProcessTaskContext(this.$root.appDomain, this.$parent.taskCode, dataProcess.taskSessionContentXml(variableJson), function (response) {
                    if (response) {
                        globalVariable.variableObj = variableJson;
                        that.variables = variableJson;
                        alert("saved successfuly.");
                    } else {
                        alert("save process task variable error.");
                    }
                });
            }
            else {
                var arraydata = dataGrid.asheet.getArray(0, 0, dataGrid.asheet.getRowCount(viewport), dataGrid.asheet.getColumnCount(viewport));
                var arraysJson = dataProcess.rangeGridDataToJson(arraydata);
                webProxy.saveProcessTaskArray(this.$root.appDomain, this.$parent.taskCode, dataProcess.taskArrayObjectToXml(arraysJson), function (response) {
                    if (response) {
                        globalVariable.arrObj = arraysJson;
                        that.arrayJson = arraysJson;
                        alert("saved successfuly.");
                    } else {
                        alert("save process task variable error.");
                    }
                });
            }
        },
        closeWindow: function () {
            this.apply();
        }
    },
    ready: function () {
        this.loadData();
    }
});
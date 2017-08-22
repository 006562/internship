define('viewTaskDataInput', {
    data:function(){
        return {
            vtabs: [ // 配置导航切换
                { text: 'variable' },
            ],
            isshowdatainput: false,
            variables: [
                {
                    Name: "StartPeriod",
                    Value: 0, DataType: "nvarchar",
                    IsConstant: 0,
                    IsKey: 0,
                    KeyIndex: 0,
                    Field: {
                        FieldName: '',
                        Position: ''
                    }
                },
                {
                    Name: "EndPeriod",
                    Value: 11,
                    DataType: "nvarchar",
                    IsConstant: 0,
                    IsKey: 0,
                    KeyIndex: 0,
                    Field: {
                        FieldName: '',
                        Position: ''
                    }
                }
            ]
        }
    },
    template: '#dataInputTemplate',
    methods: {
        closeVariableInput: function () {
            this.isshowdatainput = false;
            this.apply();
        },
        refreshData: function () {
            var that = this;
            dataGrid.refreshVariable(that);
        },
        apply: function () {
            //取Variables数据，转VariableModel
            var data = dataGrid.vsheet.getArray(0, 0, dataGrid.vsheet.getRowCount($.wijmo.wijspread.SheetArea.viewport), dataGrid.vsheet.getColumnCount($.wijmo.wijspread.SheetArea.viewport));
            this.variables = dataProcess.variableGridDataToJson(data);
        }
    },
    watch:{
        variables: function (newVariables) {
            this.$root.$refs.task.$refs.tasktool.items[0].list = newVariables;
            dataGrid.bindVariblesToGrid(newVariables);
        }
    },
    ready: function () {
        $('#divDataInputTable').css({ 'width': $(window).width() - 30, 'height': $(window).height() - 50 });

        dataGrid.vspread = new GcSpread.Sheets.Spread($("#divDataInputTable")[0], { sheetCount: 1 });
        dataGrid.vspread.tabStripVisible(false);
        dataGrid.vsheet = dataGrid.vspread.getSheet(0);
        dataGrid.vsheet.defaults.rowHeight = 25;
        dataGrid.vsheet.defaults.colWidth = 150;
        dataGrid.vsheet.vminrow = 50;

        this.$root.$refs.task.$refs.tasktool.items[0].list = this.variables;
        dataGrid.bindVariblesToGrid(this.variables);
        dataGrid.bindcontextmenu();
    }
});
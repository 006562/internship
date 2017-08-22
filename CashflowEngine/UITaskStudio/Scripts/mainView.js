define('mainView', {
    component: function ()
    {
        //var self = this;
        var variables = use('viewVariables').component();
        var ranges = use('viewRange').component();
        var results = use('viewResult').component();
        var mainview = Vue.extend({
            template: '#mainview',
            data: function ()
            {
                return {
                    tabActive: 'variable', // 默认TAB显示
                    variables: [],
                    arrayJson: [],
                    searchResult: [],
                    resultJson: [],
                    sessionId: ""
                };
            },
            methods: {
                LoadALLTextList: function ()
                {
                    var self = this;
                    self.$refs.variable.bindVariblesToGrid("");
                    self.$refs.rangeref.bindArraysToGrid("");
                    self.$refs.result.bindArraysToGrid("");
                    webProxy.getTaskCodeListByTaskType(self.$root.appDomain, function (response)
                    {
                        self.searchResult = dataProcess.taskObject(response);
                        self.$nextTick(function ()
                        {
                            $("#txtTaskCode").chosen();
                        })

                    });


                },
                // 加载TASK内容
                loadTaskWork: function ()
                {
                    var self = this;
                    //加载variables并将其转换为Json
                    webProxy.getTaskSessionContextByTaskCode(self.$root.appDomain, $("#txtTaskCode").val(), self.getVariablesToJson);
                    //加载array并将其转化为Json
                    webProxy.getProcessTaskArrayByTaskCode(self.$root.appDomain, $("#txtTaskCode").val(), self.getArraysToJson);
                    webProxy.getLastRunSessionIdByTaskCode(self.$root.appDomain, $("#txtTaskCode").val(), self.getLastSessionId);
                },
                opencashflow:function(){
                    var self = this;
                    var url = location.protocol + "//" + location.host + "/CashFlowEngine/UITaskStudio/index.html?appDomain=" + self.$root.appDomain + "&taskCode=" + $("#txtTaskCode").val() + "&r=" + Math.random() * 150;
                    window.open(url);
                },
                openRun: function () {
                    var self = this;
                    var url = location.protocol + "//" + location.host + "/CashFlowEngine/UITaskStudio/CashFlowAddInExcelRunTask.html?";
                    var obj = new Object();
                    obj.appDomain = self.$root.appDomain;
                    obj.taskCode = $("#txtTaskCode").val();
                    self.searchResult.filter(function (item) {
                        if (item.CodeDictionaryCode == obj.taskCode) {
                            obj.criteriaSetCode = item.CriteriaSetCode;
                        }
                    });
                    url += "appDomain=" + obj.appDomain;
                    url += "&taskCode=" + obj.taskCode;
                    url += "&criteriaSetCode=" + obj.criteriaSetCode;
                    url += "&r=" + Math.random() * 150;

                    if (obj.taskCode && obj.criteriaSetCode) {
                        self.sessionId = window.showModalDialog(url, "", "dialogWidth:610px;dialogHeight:460px;resizable:no;scroll:no;");
                    }
                },
                getVariablesToJson: function (response)
                {
                    var self = this;
                    if (response == "" && response == undefined) { return }
                    else
                    {
                        self.variables = dataProcess.variableXmlToJson(response);
                        self.$refs.variable.bindVariblesToGrid(self.variables);
                    }
                },
                getArraysToJson: function (response)
                {
                    var self = this;
                    if (response == "" && response == undefined)
                    {
                        return
                    } else
                    {
                        self.arrayJson = response;
                        self.$refs.rangeref.bindArraysToGrid(self.arrayJson);
                    }
                },
                getLastSessionId: function (response) {
                    if (response != undefined) {
                        this.sessionId = response[0].SessionId;
                    } else {
                        this.sessionId = "";
                    }
                }
            },
            components: {
                'variables': variables,
                'range': ranges,
                'result': results
            },
            ready: function ()
            {
                this.LoadALLTextList();
            }
        });
        return mainview
    }
});
var globalVariable = { variableObj: null, arrObj: null };
require(['jquery-2.2.3.min', 'lodash.min', 'vue'], function () {

    require(['codemirror', 'Sortable', 'webProxy', 'dataProcess', 'anyContext', 'anyDialog', 'jquery.json', 'jquery.atwho.min', 'vuei18n', 'gcspread', 'dataGrid'], function () {
        var language = getUrlParam("language");

        // 配置项目文件加载路径
        config.path = 'Scripts/';
        // 配置参数
        config.data = {
            appDomain: 'Cashflow',
            tabActive: 'task', // 默认TAB显示
            //language: [],
            //operator: '', task与ec的操作状态不能使用同一个状态，因为task与ec是独自保存。解决方法：暂时在viewTaskMain与viewECMain声明operator,保存以后更新viewTaskMain与viewECMain的operator。 张文文 2017-02-27 
            scriptTemplates: {},
            copyActionModel: [],
            copyTaskModel: [],
            dragType: '',
            sessionId: '',
            currentGuid: '',
            language: language == null || language == '' ? 'en' : language,
        };

        // 载入所有模块
        require(['viewSearch', 'viewCashFlowTools', 'viewTaskActions', 'viewEditActionContent', 'viewEditCombActionName', 'viewEditActionNumber', 'viewEditTaskXML', 'viewTaskRun', 'viewEditECXML', 'viewCashFlowDataInput', 'viewTaskTools', 'viewTaskMain', 'viewECMethods', 'viewEditECContent', 'viewCaculationTools', 'viewECMain'], function () {
            var taskView = use('viewTaskMain').component();
            var caculationView = use('viewECMain').component();
            var search = use('viewSearch').component();

            // 初始化一个Vue的实例
            var app = new Vue({
                el: '#layout',
                data: config.data,
                components: {
                    'task': taskView,
                    'caculation': caculationView,
                    'search': search
                },
                methods: {
                    loadScriptTemplates: function () {
                        var self = this;
                        webProxy.loadScriptTemplates("./TaskScriptTemplate.xml", function (response) {
                            self.scriptTemplates.variableScript = $($(response).find("VariableScript")).text();
                            self.scriptTemplates.ecScript = $($(response).find("EcScript")).text();
                            self.scriptTemplates.taskScript = $($(response).find("TaskScript")).text();
                            self.scriptTemplates.actionSctipt = $($(response).find("ActionSctipt")).text();
                            self.scriptTemplates.processTaskArrayScript = $($(response).find("ProcessTaskArrayScript")).text();
                            self.scriptTemplates.processTaskContextScript = $($(response).find("ProcessTaskContextScript")).text();
                        })
                    },
                    InitCashFlows: function () {
                        var self = this;
                        var appDomain = getUrlParam("appDomain");
                        var taskCode = getUrlParam("taskCode");
                        var sessionId = getUrlParam("sessionId");
                      
                        //self.currentGuid = newguid();
                        //var cashflowEngineLS = localStorage.getItem("CashFlowEngine");
                        //if (cashflowEngineLS == null || cashflowEngineLS == "")
                        //{
                        //    localStorage.setItem("CashFlowEngine", "{}");
                        //}
                        appDomain = appDomain == null ? "" : appDomain;
                        taskCode = taskCode == null ? "" : taskCode;
                        sessionId = sessionId == null ? "" : sessionId;
                     
                        self.appDomain = appDomain == "" ? self.appDomain : appDomain;
                        self.$refs.search.appDomain = appDomain == "" ? self.appDomain : appDomain;

                        var criteriaCode = "";
                        var isCheckOut = false;
                        if (appDomain != "" && taskCode != "") {
                            self.$refs.search.searchKeyword = appDomain;
                            self.appDomain = appDomain;
                            webProxy.getTaskCodeListByTaskType(appDomain, function (response) {
                                self.$refs.search.searchResult = dataProcess.taskObject(response);
                                $(self.$refs.search.searchResult).each(function (i) {
                                    if (self.$refs.search.searchResult[i].CodeDictionaryCode.toLowerCase() == taskCode.toLowerCase()) {
                                        self.$refs.search.searchResult[i].IsCheck = true;
                                        criteriaCode = self.$refs.search.searchResult[i].CriteriaSetCode;
                                        isCheckOut = self.$refs.search.searchResult[i].IsCheckOut;
                                        return false;
                                    }
                                });

                                //self.operator = config.status.e_update;

                                self.$refs.task.operator = config.status.e_update;
                                self.$refs.task.taskCode = taskCode;
                                self.$refs.task.refreshCode = taskCode;
                                self.$refs.task.refreshIndex += 1;

                                self.$refs.caculation.operator = config.status.e_update;
                                self.$refs.caculation.ecCode = criteriaCode;
                                self.$refs.caculation.refreshCode = criteriaCode;
                                self.$refs.caculation.refreshIndex += 1;

                                if (!isCheckOut) {//taskcode 不是模板
                                    $("#ribbon_SaveTask").show();
                                    $("#ribbon_SaveEC").show();
                                } else {//taskcode   是模板
                                    $("#ribbon_SaveTask").hide();
                                    $("#ribbon_SaveEC").hide();
                                }
                            });
                        }
                    }
                },
                watch: {
                    copyTaskModel: function (newCopyTaskModel) {
                        if (newCopyTaskModel.length > 0) {
                            $('#search-menu-paste').removeClass('disable');
                        } else {
                            $('#search-menu-paste').addClass('disable');
                        }
                    }
                    //,
                    //copyActionModel: function (newCopyActionModel) {
                    //    if (newCopyActionModel.length > 0) {
                    //        $('#action-menu-paste').removeClass('disable');
                    //    } else {
                    //        $('#action-menu-paste').addClass('disable');
                    //    }
                    //}
                },
                ready: function () {
                    this.loadScriptTemplates();
                    this.InitCashFlows();
                }
            });
        });
    })
});
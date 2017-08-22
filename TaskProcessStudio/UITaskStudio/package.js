require(['jquery-2.2.3.min','lodash.min', 'vue'], function() {

    require(['codemirror', 'highcharts', 'Sortable', 'webProxy', 'dataProcess', 'anyContext', 'anyDialog', 'gcspread', 'jquery.json', 'dataGrid'], function ()
    {
		// 配置项目文件加载路径
		config.path = 'Scripts/';
		// 配置参数
		config.data = {
			appDomain: 'Task',
			language: [],
			operator: config.status.e_new,
			scriptTemplates: {},
			copyActionModel: [],
			copyTaskModel: [],
			dragType: '',
			sessionId: '',
            currentGuid: ''
		};
		// 载入所有模块
		require(['viewSearch', 'viewCashFlowTools', 'viewTaskActions', 'viewEditActionContent', 'viewEditTaskXML', 'viewTaskRun', 'viewTaskDataInput', 'viewTaskTools', 'viewTaskMain'], function ()
		{
			var taskView = use('viewTaskMain').component();
			var search = use('viewSearch').component();

			// 初始化一个Vue的实例
			var app = new Vue({
				el : '#layout',
				data : config.data,
				components:{
					'task':taskView,
					'search': search
				},
				methods:{
				    loadScriptTemplates: function () {
				        var self = this;
				        webProxy.loadScriptTemplates("./TaskScriptTemplate.xml", function (response) {
				            self.scriptTemplates.variableScript = $($(response).find("VariableScript")).text();
				            self.scriptTemplates.taskScript = $($(response).find("TaskScript")).text();
				            self.scriptTemplates.actionSctipt = $($(response).find("ActionSctipt")).text();
				            self.scriptTemplates.processTaskContextScript = $($(response).find("ProcessTaskContextScript")).text();
				        })
				    },
				    InitCashFlows: function () {
				        var self = this;
				        var appDomain = getUrlParam("appDomain");
				        var taskCode = getUrlParam("taskCode");
				        var sessionId = getUrlParam("sessionId");
				        self.currentGuid = newguid();
				        localStorage["variables" + this.$root.currentGuid] = "";
				        appDomain = appDomain == null ? "" : appDomain;
				        taskCode = taskCode == null ? "" : taskCode;
				        sessionId = sessionId == null ? "" : sessionId;
				        var criteriaCode = "";
				        var isCheckOut = false;
				        if (appDomain != "" && taskCode != "") {
				            self.$refs.search.searchKeyword = appDomain;
				            self.appDomain = appDomain;
				            webProxy.getTaskCodeListByTaskType(appDomain, function (response) {
				                self.$refs.search.searchResult = dataProcess.taskObject(response);
				                $(self.$refs.search.searchResult).each(function (i) {
				                    if (self.$refs.search.searchResult[i].CodeDictionaryCode == taskCode) {
				                        self.$refs.search.searchResult[i].IsCheck = true;
				                        isCheckOut = self.$refs.search.searchResult[i].IsCheckOut;
				                        return false;
				                    }
				                });

				                self.operator = config.status.e_update;

				                self.$refs.task.taskCode = taskCode;
				                self.$refs.task.refreshCode = taskCode;
				                self.$refs.task.refreshIndex += 1;

				               

				                if (!isCheckOut) {//taskcode 不是模板
				                    $("#ribbon_SaveTask").show();
				                } else {//taskcode   是模板
				                    $("#ribbon_SaveTask").hide();
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
				},
				ready: function () {
				    //this.loadScriptTemplates();
				    this.InitCashFlows();
				}
			});
		});
	})
});
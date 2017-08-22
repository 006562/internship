define('viewTaskMain',{
	component : function(){
		var cashFlowTools = use('viewCashFlowTools').component();
		var taskActions = use('viewTaskActions').component();
		var taskTools = use('viewTaskTools').component();

		var taskMain = Vue.extend({
		    data: function () {
			    return {
			        operator: config.status.e_new,
			        refreshCode: '',
                    refreshIndex:0,
					taskCode: ''
				}
			},
			template : '<section class="layout-main">'+
							'<cashflow-tool v-ref:cashflowtool></cashflow-tool>'+
							'<task-action v-ref:taskaction></task-action>'+
							'<task-tool v-ref:tasktool></task-tool>'+
						'</section>',
			components:{ // 注册TaskView页面上的所有子组件
				'cashflow-tool':cashFlowTools,
				'task-action':taskActions,
				'task-tool':taskTools
			},
			watch:{
			    taskCode: function (newCode) {
			        this.$refs.taskaction.taskCode = newCode;
			    },
			    refreshIndex: function () {
			        webProxy.getTaskXmlByTaskCode(this.$parent.appDomain, this.refreshCode, this.getTaskToJson);
			        webProxy.getProcessTaskArrayByTaskCode(this.$parent.appDomain, this.refreshCode, this.getArraysToJson);
			        webProxy.getTaskSessionContextByTaskCode(this.$root.appDomain, this.refreshCode, this.getVariableToJson);
			        webProxy.getLastRunSessionIdByTaskCode(this.$root.appDomain, this.refreshCode, this.getLastSessionId);
			    }
			},
			methods: {
			    getTaskToJson: function (response) {
			        this.$refs.taskaction.activeId = -1;
			        this.$refs.taskaction.activeGroupName = 'DirectInput';
			        var taskModel = dataProcess.taskXmlToJson(response);
			        this.$refs.taskaction.directModel = taskModel.filter(function (item) {
			            if (item.GroupName == "DirectInput") return item;
			        });
			        this.$refs.taskaction.caculateModel = taskModel.filter(function (item) {
			            if (item.GroupName == "Calculated") return item;
			        });
			        this.$refs.taskaction.exportModel = taskModel.filter(function (item) {
			            if (item.GroupName == "Export") return item;
			        });
			        $("#searchTaskCode").css('color', 'black');
			        $('#action-menu-paste').addClass('disable');
			        $('.modal-close').trigger('click');
			    },
			    getArraysToJson: function (response) {
			        //this.$refs.taskaction.$refs.taskdatainput.arrayjson = response;
			        //var array = JSON.parse(localStorage.getItem("CashFlowEngine"));
			        //var key = "arrayJson" + this.$root.currentGuid;
			        //array[key]= response;
			        //localStorage.setItem("CashFlowEngine", JSON.stringify(array));
			        globalVariable.arrObj = response;
			        this.$refs.taskaction.$refs.mainviews.initArrayTable();
			    },
			    getVariableToJson: function (response) {
			        //this.$refs.taskaction.$refs.taskdatainput.variables = dataProcess.variableXmlToJson(response);
			        var variableJson = dataProcess.variableXmlToJson(response);
			        //var array = JSON.parse(localStorage.getItem("CashFlowEngine"));
			        //var key = "variables" + this.$root.currentGuid;
			        //array[key] = variableJson;
			        //localStorage.setItem("CashFlowEngine", JSON.stringify(array));
			        this.$refs.tasktool.items[1].list = variableJson;
			        this.$root.$refs.caculation.$refs.caculationtools.data.items[1].list = variableJson;
			        globalVariable.variableObj = variableJson;
			        this.$refs.taskaction.$refs.mainviews.initVariableTable();
			    },
			    getLastSessionId: function (response) {
			        if (response != undefined) {
			            this.$root.sessionId = response[0].SessionId;
			        } else {
			            this.$root.sessionId = "";
			        }
			    }
			}
		});
		return taskMain;
	}
});
define('viewTaskMain',{
	component : function(){
		var cashFlowTools = use('viewCashFlowTools').component();
		var taskActions = use('viewTaskActions').component();
		var taskTools = use('viewTaskTools').component();

		var taskMain = Vue.extend({
			data:function(){
			    return {
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
			        webProxy.getTaskSessionContextByTaskCode(this.$root.appDomain, this.refreshCode, this.getVariableToJson);
			        webProxy.getLastRunSessionIdByTaskCode(this.$root.appDomain, this.refreshCode, this.getLastSessionId);
			    }
			},
			methods: {
			    getTaskToJson: function (response) {
			        this.$refs.taskaction.activeId = -1;
			        this.$refs.taskaction.taskModel = dataProcess.taskXmlToJson(response);
			        $('.modal-close').trigger('click');
			        $("#searchTaskCode").css('color', 'black');
			        $('#action-menu-paste').addClass('disable');
			    },
			    getVariableToJson: function (response) {
			        if (response != "") {
                        var variableJson = dataProcess.variableXmlToJson(response);
			            localStorage["variables" + this.$root.currentGuid] = JSON.stringify(variableJson);
			            this.$refs.tasktool.items[0].list = variableJson;
			        }
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
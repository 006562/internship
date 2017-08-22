define('viewECMain',{
	component : function(){
		var ecMethods = use('viewECMethods').component();
		var editECContent = use('viewEditECContent').component();
		var caculationTools = use('viewCaculationTools').component();
		var editECXML = use('viewEditECXML').component();

		var ecMain = Vue.extend({
		    data: function () {
			    return {
			        operator: config.status.e_new,
				    ecCode: '',
				    refreshCode: '',
				    refreshIndex: 0,
				}
			},
			template:'<section class="layout-main">'+
						'<ec-methods v-ref:ecmethods></ec-methods>'+
						'<edit-eccontent v-ref:editeccontent></edit-eccontent>'+
						'<caculation-tools v-ref:caculationtools></caculation-tools>' +
                        '<edit-ecxml v-ref:editecxml></edit-ecxml>'+
					'</section>',
			components:{ // 注册CaculationView页面上的所有子组件
				'ec-methods':ecMethods,
				'edit-eccontent':editECContent,
				'caculation-tools': caculationTools,
				'edit-ecxml': editECXML
			},
			watch:{
			    ecCode: function (newCode) {
			        this.$refs.editeccontent.ecCode = newCode;
			    },
			    refreshIndex: function () {
			        webProxy.getCriteriasByECSetCode(this.$root.appDomain, this.refreshCode, this.getCriteriaToJson)
			    }
			},
			methods: {
			    getCriteriaToJson: function (response) {
			        this.$refs.ecmethods.activeId = -1;
			        this.$refs.ecmethods.ecModel = dataProcess.ecXmlToJson(response);
			    }
			}
		});
		return ecMain;
	}
});
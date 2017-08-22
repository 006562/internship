define('viewCashFlowTools',{
    dragsort: function () {
        var that = this;
		// 模板载入之后执行DOM操作
	    $("[dragable='action']").each(function (key, value) {
			Sortable.create(this, {
				group: {
				    name: 'Single Actions',
					pull: 'clone',
					put: false
				},
				sort: false,
				onStart: function (evt) {
				    that.$root.dragType = 'Single Actions';
				},
				onEnd: function (evt) {
				    that.$root.dragType = "";
				    //解决拖动元素回放位置不在原拖动位置放下而造成的oldIndex乱序。
				    if ($(evt.item).next().attr("style")) {
				        $(evt.item).next().remove();
				    }
				    
				}
			});
		});
	},
	component : function(){
		var self = this;
		// 创建一个组件
		var cashFlowTool = Vue.extend({
			init:function(){
				var that = this;
				webProxy.getSingleActionTemplates(function (response) {
					var singleActionModel = dataProcess.singleActionToJson(response);
					that.items[0].list = singleActionModel;
					self.dragsort.call(that);
				});
			},
			data : function(){
				return {
					name:'Process Tools',
					id: "task-action",
					items:[
						{
							name : 'Single Actions',
							isHover: -1,
							list : []
						}
					]
				};
			},
			template : '#viewActionTemplate' // 选择模板
		});
		return cashFlowTool;
	}
});
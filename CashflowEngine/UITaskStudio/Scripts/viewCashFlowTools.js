define('viewCashFlowTools',{
    dragsort: function () {
        var that = this;
		// 模板载入之后执行DOM操作
	    $("[dragable='action']").each(function (key, value) {
			Sortable.create(this, {
				group: {
				    name: that.items[that.isActive].name,
					pull: 'clone',
					put: false
				},
				sort: false,
				onStart: function (evt) {
				    that.$root.dragType = that.items[that.isActive].name;
				    that.$parent.$refs.taskaction.$refs.editactionnumber.actionDisplayName = evt.item.innerText;
				    that.$parent.$refs.taskaction.$refs.editactionnumber.number = 1; //默认数量为1
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
	    var data = {
	        cn: {
	            name: '现金流模板',
	            isActive: 0,
	            id: "task-action",
	            showModal: false,
	            tabs: [ // 配置导航切换
                    { text: '模板' },
                    { text: '组合模板' }
	            ],
	            items: [
                    {
                        name: 'Single Actions',
                        list: [],
                        isHover: -1
                    },
                    {
                        name: 'Combine Templates',
                        list: []
                    }
	            ],
	            language:'cn'
	        },
	        en: {
	            name: 'CashFlow Tools',
	            isActive: 0,
	            id: "task-action",
	            showModal: false,
	            tabs: [ // 配置导航切换
                    { text: 'Single' },
                    { text: 'Combination' }
	            ],
	            items: [
                    {
                        name: 'Single Actions',
                        list: [],
                        isHover: -1
                    },
                    {
                        name: 'Combine Templates',
                        list: []
                    }
	            ],
	            language:'en'
	        }
	    };

		// 创建一个组件
		var cashFlowTool = Vue.extend({
			init:function(){
				var that = this;
				webProxy.getSingleActionTemplates(function (response) {
					//var singleActionModel = dataProcess.singleActionToJson(response);
				    //that.items[0].list = singleActionModel;
				    that.items[0].list = dataProcess.singleActionToJson(response);
				    that.$nextTick(function () {
				        self.dragsort.call(that);
				    });
				});
				webProxy.getBankList(function (response) {
				    that.items[1].list = dataProcess.bankListToJson(response);
				    that.$nextTick(function () {
				        self.dragsort.call(that);
				    });
				});
				
			},
			data : function(){
			    return this.$root.language == 'cn' ? data.cn : data.en;

			},
			methods: {
			    selectBank: function (list) {
			        var that = this;
			        var combination = that.items[1].list;
			        for (var i = 0; i < combination.length; i++) {
			            combination.isOpen = false;
			        }
			        list.isOpen = !list.isOpen;
			    },
			   	addHover: function (index) {
                    this.items[0].isHover = index;
                },
                removeHover:function () {
                    this.items[0].isHover = -1; 
                }
			},
			template : '#viewActionTemplate' // 选择模板
		});
		return cashFlowTool;
	}
});
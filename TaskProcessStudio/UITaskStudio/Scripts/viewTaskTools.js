define('viewTaskTools', {
    dragsort: function () {
        var that = this;
        that.$nextTick(function () {
            // 模板载入之后执行DOM操作
            $("[dragable='taskTools']").each(function (key, value) {

                Sortable.create(this, {
                    group: {
                        name: 'Variable',
                        pull: 'clone',
                        put: false
                    },
                    ghostClass: "sortable-ghost",
                    sort: false,
                    onStart: function (/**Event*/evt) {
                        that.$root.dragType = 'Variable';
                    },
                    onEnd: function (/**Event*/evt) {
                        that.$root.dragType = "";
                        //解决拖动元素回放位置不在原拖动位置放下而造成的oldIndex乱序。
                        if ($(evt.item).next().attr("style")) {
                            $(evt.item).next().remove();
                        }
                    }
                });
            });
        })
    },
    component: function () {
        var self = this;
		// 创建一个组件
		var taskTool = Vue.extend({
			// 配置组件基本信息
			data : function(){
				return {
				    name: 'Variable Model',
					icon:'icon-calculator',
					isHover: -1,
					id: "task-tool",
					items : [
						{
							name　: 'Variable',
							list: [
							    { Name: "StartPeriod", Value: 0, DataType: "nvarchar", IsConstant: 0, IsKey: 0, KeyIndex: 0},
                                { Name: "EndPeriod", Value: 11, DataType: "nvarchar", IsConstant: 0, IsKey: 0, KeyIndex: 0}
							]
						}
					]
				}
			},
			template: '#viewToolTemplate',
			methods:{
				addHover: function (index) {
                    this.isHover = index;
                },
                removeHover:function () {
                    this.isHover = -1; 
                }
			},
			ready:function() {
			    self.dragsort.call(this);
			}
		});

		return taskTool;
	}
});
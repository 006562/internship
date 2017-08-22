define('viewTaskMethods',{
	render:function(){
		// 创建一个组件
		Vue.component('task-tool',{
			// 配置组件基本信息
			data : function(){
				var data = {
					items : [
						{	
							name : 'Methods',
							list : []
						},
						{
							name　: '',
							list : []
						}
					]
				};
				return {
					name:'Task Tools',
					icon:'icon-cog-alt',
					isActive:0,
					id:"task-tool",
					tabs : [ // 配置导航切换
						{text : 'Method'},
						{text : 'Variable'}
					],
					data:data
				}
			},
			props : ['ecmains'],
			template : '#viewToolTemplate',
			watch :{
				ecmains : function(ecmains){
					this.data.items[0].list = ecmains;
				}
			},
			ready:function(){

			}
		});
	}
});
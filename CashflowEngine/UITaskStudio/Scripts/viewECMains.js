define('viewECMains',{
	render:function(){
		// 创建一个组件
		Vue.component('main-list',{
			// 配置组件基本信息
			data : function(){
				return {
					name:'Formula Organizer',
					icon:'icon-move',
					active : -1,
				}
			},
			props : ['ecmains'],
			template : '#formulaTemplate',
			methods:{
				addActive:function(index){
					this.active = index;
				},
				ECAdd:function(){
					this.ecmains.push({
						"IsCheck": false,
						"Query": {
							"Name": "EC_NewName",
						    "DisplayName":"新的函数",
							"Equation": ""
						},
						"Parameters": []
					});
				},
				ECRemove:function(){
					if(-1 == this.active || !this.ecmains[this.active]){
						alert('当前没有选中EC!');
						return false;
					}
					this.ecmains.splice(this.active,1);
				}
			}
		});
	}
});
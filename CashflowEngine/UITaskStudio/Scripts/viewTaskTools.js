define('viewTaskTools', {
    dragsort: function () {
        var that = this;
        // 模板载入之后执行DOM操作
        $("[dragable='taskTools']").each(function (key, value) {

            Sortable.create(this, {
                group: {
                    name: that.items[that.isActive].name,
                    pull: 'clone',
                    put: false
                },
                ghostClass: "sortable-ghost",
                sort: false,
                onStart: function (/**Event*/evt) {
                    that.$root.dragType = that.items[that.isActive].name;
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
    },
    component: function () {
        var self = this;
        var data = {
            cn: {
                name: '现金流工具',
                isActive: 0,
                isHover: -1,
                id: "task-tool",
                tabs: [ // 配置导航切换
                    { text: '公式函数' },
                    { text: '变量' },
                    //{ text: '数组变量' }
                ],
                items: [{
                    name: 'Methods',
                    list: [],
                    filterName: '',
                    filterArr: []
                }, {
                    name: 'Variable',
                    list: []
                }
                //, {
                //    name: 'Range',
                //    list: []
                //}
                ]
            },
            en: {
                name: 'Task Tool',
                isActive: 0,
                isHover: -1,
                id: "task-tool",
                tabs: [ // 配置导航切换
                    { text: 'Method' },
                    { text: 'Variable' },
                    //{ text: 'Range' }
                ],
                items: [{
                    name: 'Methods',
                    list: [],
                    filterName: '',
                    filterArr: []
                }, {
                    name: 'Variable',
                    list: []
                }
                //, {
                //    name: 'Range',
                //    list: []
                //}
                ]
            }
        };
		// 创建一个组件
		var taskTool = Vue.extend({
			// 配置组件基本信息
		    data: function () {
			    return this.$root.language == 'cn' ? data.cn : data.en;
			},
			template: '#viewToolTemplate',
			methods:{
				viewECMethods:function(index){
				    this.$root.tabActive = 'caculation';
				    $('.modal-close').trigger('click');
				    if(this.items[0].filterArr.length){
				    	index = this.items[0].filterArr[index].originIndex; 
				    }
                    this.$root.$refs.caculation.$refs.ecmethods.filterName = "";
					this.$root.$refs.caculation.$refs.ecmethods.scrollTop = index;
				},
				addHover: function (index) {
                    this.isHover = index;
                },
                removeHover:function () {
                    this.isHover = -1; 
                }
			},
			watch: {
			    'items[0].list': function () {
			        this.$nextTick(function () {
			            self.dragsort.call(this);
			        });
			    },
			    'items[1].list': function () {
			        this.$nextTick(function () {
			            self.dragsort.call(this);
			        });
                },
                'items[0].filterName':function () {
                	$(".list-wrap").scrollTop(0);
                }
            },
            computed: {
                searchMethod: function() {
                    return this.items[0].list.length && this.isActive == 0;
			}
            }
		});
		Vue.filter('methfilterBy', function(arr, search, delimiter, field) {
            if (!search) {
                this.items[0].filterArr = [];
                return arr;
            }
            var res = [],
                item,
                searchStr = search.toLowerCase(),
                fieldArr = field.split('.');
            for (var i = 0, len = arr.length; i < len; i++) {
                item = arr[i];
                var fieldObj = item[fieldArr[0]][fieldArr[1]].toLowerCase();
                if (fieldObj.indexOf(searchStr) != -1) {
                    item.originIndex = i;
                    res.push(item);
                }
            }
            this.items[0].filterArr = res;
            return res;
        })
		return taskTool;
	}
});
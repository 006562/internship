define('viewECMethods', {
    component: function() {
        // 创建一个组件
        var ecMethods = Vue.extend({
            // 配置组件基本信息
            data: function() {
                return {
                    name: 'Formula Organizer',
                    activeId: -1,
                    ecModel: [],
                    scrollTop: -1,
                    filterName: '',
                    filterArr: [],
                    language:this.$root.language
                }
            },
            template: '#formulaTemplate',
            methods: {
                scrollHandle: function (e) {
                    var ecTool = document.querySelector('.EC-tool');
                    var scrollTop = ecTool.scrollTop;
                    document.querySelector('.EC-title').style.transform = 'translateY(' + scrollTop + 'px)';
                },
                addActive: function (index) {
                    this.activeId = index;
                    if (this.filterArr.length && index != -1) {
                        index = this.filterArr[index].originIndex;
                    } else {
                        this.$parent.$refs.editeccontent.activeEC = {
                            "IsCheck": false,
                            "Query": {
                                "Name": "",
                                "Equation": ""
                            },
                            "Parameters": []
                        }
                    }
                    //删除最后一个时index将等于-1
                    if (index > -1) {
                        this.$parent.$refs.editeccontent.activeEC = this.ecModel[index];
                    }
                },
                ECAdd: function() {
                    this.filterName = '';
                    this.ecModel.unshift({
                        "IsCheck": false,
                        "Query": {
                            "Name": "EC_NewName",
                            "Equation": "return 0 ;"
                        },
                        "Parameters": []
                    });
                    this.addActive(0);
                    $(".list-wrap").scrollTop(0);
                },
                ECRemove: function() {
                    if (-1 == this.activeId || !this.ecModel[this.activeId]) {
                        $.anyDialog({
                            width: 260,
                            height: 100,
                            title: '提示',
                            html: '<div style="line-height:80px;font-size:14px;text-align:center">请选中一个需要删除的计算项目!</div>',
                            status: 'alert'
                        });
                        return false;
                    }
                    if (this.filterArr.length) {
                        var originIndex = this.filterArr[this.activeId].originIndex;
                        this.ecModel.splice(originIndex, 1);
                        this.$nextTick(function() {
                            if (this.filterArr.length == this.activeId) {
                                this.activeId -= 1;
                            }
                            this.addActive(this.activeId);
                        })
                    } else {
                    	this.ecModel.splice(this.activeId, 1);
                        if (this.ecModel.length == this.activeId) {
                            this.activeId -= 1;
                    	}
                    	this.addActive(this.activeId);
                    }
                }
            },
            watch: {
                ecModel: {
                    handler: function (newModel) {
                        if (this.activeId == -1) {
                            if (newModel == null || newModel.length == 0) {
                                this.$parent.$refs.editeccontent.activeEC = {
                                    "IsCheck": false,
                                    "Query": {
                                        "Name": "",
                                        "Equation": ""
                                    },
                                    "Parameters": []
                                };
                            } else {
                                this.addActive(0);
                            }
                        };
                        this.$root.$refs.task.$refs.tasktool.items[0].list = newModel;
                    },
                    deep:true
                },
                scrollTop: function(index) {
                    this.$nextTick(function() {
                        $("#tool-list").find('li').get(index).scrollIntoView();
                    });
                    this.addActive(index);
                },
                filterName: function(newvalue) {
                    $(".tool-table .list-wrap").scrollTop(0);
                    if (!newvalue && this.ecModel.length) {
                        this.addActive(0);
                    } else {
                        this.$parent.$refs.editeccontent.activeEC = {
                            "IsCheck": false,
                            "Query": {
                                "Name": "",
                                "Equation": ""
                            },
                            "Parameters": []
                        };
                        this.addActive(-1);
                    }
                },
                filterArr:function (newvalue,oldvalue) {
                    //在过滤后的数组中修改ec名导致ec被过滤掉,activeId应该不选中任何一个
                    if (newvalue.length != oldvalue.length && this.filterName) {
                        this.activeId = -1;
                    }
                }
            },
            ready: function () {
                $('.EC-tool').on('scroll', function () {　　　　//Parameters 固定表头,绑定滚动事件，滚动时设置transform的scrollTop。
                    document.querySelector('.EC-title').style.transform = 'translateY(' + this.scrollTop + 'px)';
                });
            }
        });
        Vue.filter('ecfilterBy', function(arr, search, delimiter, field) {
            if (!search) {
                this.filterArr = [];
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
            this.filterArr = res;
            return res;
        })
        return ecMethods;
    }
});

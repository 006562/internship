define('viewSearch', {
    taskCode: 0,
    events: function() {
        // 搜索显示 这里使用jQuery操作DOM比较方便，也可在实例化方法中添加方法绑定事件
        $('#header .search-switch').click(function(event) {
            event.preventDefault();
            event.stopPropagation();
            var $this = $(this);
            $('#searchBox').toggle(200);
        });
        $('#searchBox .search-close').click(function(event){
            $('#header .search-switch').trigger('click');
        });
        $(document).on('click', function (event) {
            var searchBox = $('#searchBox');
            if (!searchBox.is(event.target) && searchBox.has(event.target).length === 0) {
                searchBox.hide();
            }
        });
    },
    // 右键菜单
    contextMenu: function(obj) {
        var that = this;
        var self = obj;

        $.anyContext({
            el: '#search-res',
            menu: [{
                text: 'New TaskCode',
                callback: function (event) {
                    event.stopPropagation();
                    if (!$(this).hasClass('disable')) {
                        var obj = {
                            CodeDictionaryCode: 'NewTaskCode' + that.taskCode,
                            CodeDictionaryId: "",
                            IsCheckOut: "0",
                            IsCheck: true
                        };

                        $(self.searchResult).each(function (i) {
                            self.searchResult[i].IsCheck = false;
                        });
                        self.searchResult.push(obj);
                        that.taskCode++;
                        // 写入新的计算项目
                        self.$root.operator = config.status.e_new;
                        self.$root.$refs.task.taskCode = obj.CodeDictionaryCode;
                        self.$root.$refs.task.refreshCode = "notExistsCode";
                        self.$root.$refs.task.refreshIndex += 1;
 
                        $("#ribbon_SaveTask").show();
                        $(this).parent().hide();
                    }
                }
            }, {
                id: 'search-menu-copy',
                text: 'Copy',
                disable: true,
                callback: function (event) {
                    event.stopPropagation();
                    if (!$(this).hasClass('disable')) {
                        var checkList = $.grep(self.searchResult, function (value, key) {
                            return value.IsCheck;
                        });
                        self.$root.copyTaskModel = [{ taskCode: checkList[0].CodeDictionaryCode }];  //, criteriaCode: checkList[0].CriteriaSetCode
                        $(this).parent().hide();
                    }
                }
            }, {
                id: 'search-menu-paste',
                text: 'Paste',
                disable: false,
                callback: function (event) {
                    event.stopPropagation();
                    if (!$(this).hasClass('disable')) {
                        var obj = {
                            CodeDictionaryCode: self.$root.copyTaskModel[0].taskCode + "_Copy",
                            CodeDictionaryId: "",
                            IsCheckOut: "0",
                            IsCheck: true
                        };

                        $(self.searchResult).each(function (i) {
                            self.searchResult[i].IsCheck = false;
                        });
                        self.searchResult.push(obj);
                        // 写入新的计算项目
                        self.$root.operator = config.status.e_new;
                        self.$root.$refs.task.taskCode = obj.CodeDictionaryCode;
                        self.$root.$refs.task.refreshCode = self.$root.copyTaskModel[0].taskCode;
                        self.$root.$refs.task.refreshIndex += 1;
 
                        $("#ribbon_SaveTask").show();
                        $(this).parent().hide();
                    }
                }
            }, {
                id: 'search-menu-delete',
                text: 'Delete',
                disable: true,
                callback: function (event) {
                    event.stopPropagation();
                    if (!$(this).hasClass('disable')) {
                        var checkList = $.grep(self.searchResult, function (value, key) {
                            return value.IsCheck;
                        });
                        if (confirm("确定删除选中的Task吗？")) {
                            $(checkList).each(function (i) {
                                webProxy.deleteProcessTask(self.$root.appDomain, checkList[i].CodeDictionaryCode, function () {
                                    self.searchResult.$remove(checkList[i]);
                                });
                            });
                            $(this).parent().hide();
                        }
                    }
                }
            }
        //    , {
        //    id: 'search-menu-script',
        //    text: 'script',
        //    disable: true,
        //    callback: function () {
        //        if (!$(this).hasClass('disable')) {
        //            var checkList = $.grep(self.searchResult, function (value, key) {
        //                return value.IsCheck;
        //            });
        //            var scriptTemplates = self.$root.scriptTemplates;
        //            var strTaskScript = "";
        //            var taskCode = checkList[0].CodeDictionaryCode;
                        
        //            var appDomain = self.$root.appDomain;

        //            dataProcess.scriptOfTask(appDomain, strTaskScript, taskCode, null, scriptTemplates, function (strScript) {
        //                $("#txtScript").val(strScript);
        //                $.anyDialog({
        //                    width: 1200,
        //                    height: 500,
        //                    title: 'Script For Task',
        //                    html: $('#scriptForTask')
        //                })
        //            });
        //        }
        //    }
        //}
            ]
        });
    },
    component: function() {
        // 这个指向当前整个对象
        var that = this;

        // 注册一个search组件
        var search = Vue.extend({
            data: function() {
                return {
                    appDomain: this.$parent.appDomain,
                    searchTask: '', // 搜索TASK的关键词
                    searchResult: [],
                    inEdit: false
                }
            },
            template: '#searchTemplate',
            methods: {
                // 搜索TASK
                searchtask: function() {
                    var self = this;
                    if ('' == self.appDomain) {
                        alert('AppDomain is empty!');
                        return false;
                    }
                    self.$parent.appDomain = self.appDomain;
                    webProxy.getTaskCodeListByTaskType(self.appDomain, function (response) {
                        self.searchResult = dataProcess.taskObject(response);
                    });
                },
                // 加载TASK内容
                loadTaskWork: function (taskCode, ecCode, isCheckOut) {
                    this.$root.operator = config.status.e_update;
                    if (this.$root.$refs.task.taskCode == taskCode) {
                        this.$root.$refs.task.$refs.taskaction.taskCode = taskCode;
                    }

                    this.$root.$refs.task.taskCode = taskCode;
                    this.$root.$refs.task.refreshCode = taskCode;
                    this.$root.$refs.task.refreshIndex += 1;                    

                    if (!isCheckOut) {//taskcode 不是模板
                        $("#ribbon_SaveTask").show();
                    } else {//taskcode   是模板
                        $("#ribbon_SaveTask").hide();
                    }

                    $('#header .search-switch').trigger('click');
                },
                // 选中一个TASK
                selectObj: function(obj, event) {
                    var self = this;
                    if (event.ctrlKey) {
                        that.ctrlObj(self, obj);
                    } else {
                        that.singleObj(self, obj);
                    }
                }
            },
            watch: {
                searchResult: {
                    handler: function (newSearchResult) {
                        var btn = $.grep(newSearchResult, function (value, key) {
                            return value.IsCheck;
                        });
                        if (btn.length > 0) {
                            if (btn.length == 1) {
                                $('#search-menu-copy').removeClass('disable');
                                //$('#search-menu-script').removeClass('disable');
                            } else {
                                $('#search-menu-copy').addClass('disable');
                                //$('#search-menu-script').addClass('disable');
                            }
                            $('#search-menu-delete').removeClass('disable');
                        } else {
                            $('#search-menu-copy,#search-menu-delete').addClass('disable');
                            //$('#search-menu-copy,#search-menu-delete,#search-menu-script').addClass('disable');
                        }
                    },
                    deep: true
                }
            },
            ready: function() {
                that.events();
                that.contextMenu(this);
            }
        });
        return search;
    },
    // Ctrl 多选 逻辑代码
    ctrlObj: function (self, obj) {
        if (obj.IsCheck) {
            obj.IsCheck = false;
        } else {
            obj.IsCheck = true;
        };

    },
    singleObj: function(self, obj) {
        // 清空选中
        $(self.searchResult).each(function (i) {
            self.searchResult[i].IsCheck = false;
        });
        obj.IsCheck = true;
    },
    checkTaskEdit: function(self) {
        $.anyDialog({
            width: 260,
            height: 100,
            title: '提示',
            html: '<div style="line-height:80px;font-size:14px;text-align:center">确定要离开当前正在编辑的页面吗?</div>',
            status: 'confirm',
            button: '确定',
            onSuccess: function() {
                self.inEdit = false;
            }
        });
    }
});

define('viewTaskActions', {
    dropsorttasktools: function (self) {
        // 模板载入之后执行DOM操作
        $("[droppable='tasktools']").each(function (key, value) {
            var dropThat = this;
            Sortable.create(dropThat, {
                group: {
                    pull: false,
                    put: ['Methods', 'Variable']
                },
                sort: false,
                //Element is dropped into the list from another list
                onAdd: function (/**Event*/evt) {
                    var dragli = $("[droppable='tasktools'] li");
                    var dragText = evt.clone.innerText;
                    if (dragli.length > 0) {
                        var activeAction = self.activeAction;
                        if (self.$root.dragType == "Methods") {
                            params = activeAction.Parameter;
                            var conditionParam = params.filter(function (item) {
                                if (item.Name == "TypeName" && item.Value == "EquationProvider.CashFlowEquationProvider") return item;
                            });
                            if (conditionParam.length > 0) {
                                params.filter(function (item) {
                                    if (item.Name == "MethodName") item.Value = $.trim(dragText);;
                                });
                            }
                        }

                        if (self.$root.dragType == "Variable") {
                            $(activeAction.Parameter)[key].SessionParameterName = $.trim(dragText);
                        }

                        dragli.replaceAll($(evt.clone));
                    }

                }
            });

        });
    },
    dropsortcashflowtools: function (self) {
        var that = this;
        // 模板载入之后执行DOM操作
        var tbActionsEle = document.querySelectorAll('.tbActions');
        for (var i = 0; i < tbActionsEle.length; i++) {
            var curTBActionsEle = tbActionsEle[i];
            Sortable.create(curTBActionsEle, {
                group: {
                    pull: false,
                    put: ['Single Actions', 'Combine Templates']
                },
                //Element is dropped into the list from another list
                onAdd: function (/**Event*/evt) {

                    var dragAction = $("ul[class='tbActions']").find("li[class='']");
                    if (dragAction.length > 0) {
                        //var targetIndex = $(dragAction).prev().length > 0 ? parseInt($(dragAction).prev()[0].tabIndex) + 1 : 0;
                        var groupName = $(dragAction).parent().attr("id");
                        var groupIndex = $(dragAction[0].innerHTML).attr("groupIndex");
                        dragAction.remove();
                        //var insertIndex = that.getRealIndex(self, evt.newIndex, groupName);
                        if (self.$root.dragType == "Single Actions") {
                            //var newActionModel = $.extend(true, {}, self.$parent.$refs.cashflowtool.items[0].list[evt.oldIndex]);
                            //if (newActionModel.GroupName == groupName) {
                            //var activeModel = that.getActiveMode(self, groupName);
                            //newActionModel.ActionCode += "_Copy";
                            //activeModel.splice(evt.newIndex, 0, newActionModel);
                            //}
                            self.$refs.editactionnumber.groupIndex;
                            var newActionModel = $.extend(true, {}, self.$parent.$refs.cashflowtool.items[0].list[groupIndex].Actions[evt.oldIndex]);

                            if (newActionModel.GroupName == groupName) {
                                $.anyDialog({
                                    width: 400,
                                    height: 200,
                                    title: 'Set Action Number',
                                    status: 'alert',
                                    button: 'OK',
                                    html: $('#SetActionNumber'),
                                    onSuccess: function () {
                                        var activeModel = that.getActiveMode(self, groupName);
                                        self.$refs.editactionnumber.ApplyActionNumber(evt.newIndex,newActionModel, activeModel);
                                    }
                                });
                            }
                        }

                        if (self.$root.dragType == "Combine Templates") {
                            var newCombineModel = $.extend(true, {}, self.$parent.$refs.cashflowtool.items[1].list[0].Models[evt.oldIndex]);
                            that.writeCombinationActionTemplates(self, groupName, evt.newIndex, newCombineModel);
                        }
                    }
                },
                onUpdate: function (/**Event*/evt) {
                    var groupName = $(evt.item).parent().attr("id");
                    var activeModel = that.getActiveMode(self, groupName);
                    var item = activeModel[evt.oldIndex];
                    activeModel.$remove(item);
                    activeModel.splice(evt.newIndex, 0, $.extend(true, {}, item));
                },
            });
        }
    },
    writeCombinationActionTemplates: function (self, groupName, targetIndex, newCombineModel) {
        var that = this;
        var modelPath = newCombineModel.Path;
        webProxy.getBankCombinationActionTemplatesByPath(modelPath, function (combActionXml) {

            var combActionModel = dataProcess.bankCombinationActionToJson(combActionXml);
            var combStr = JSON.stringify(combActionModel);
            //var isExit = _.some(combActionModel.Actions, ['GroupName', groupName]);
            //if (!isExit) return false;
            var isHaveReplaceActionName = false;
            var actionModel = [], regstr = /\#(.+?)\#/g;
            var arraystr = combStr.match(regstr);
            if (arraystr != null) {
                isHaveReplaceActionName = true;
            }

            //存在需要替换的名字
            if (isHaveReplaceActionName) {
                for (var i = 0; i < arraystr.length; i++) {
                    actionModel.push({ ItemName: arraystr[i].slice(2, -2), ItemValue: '' });
                }
                //剔除ItemName相同的名字
                actionModel = _.uniqBy(actionModel, 'ItemName');
                $.anyDialog({
                    width: 500,
                    height: 500,
                    title: 'ItemConfig',
                    status: 'alert',
                    button: 'OK',
                    html: $('#actionNameEdit'),
                    onSuccess: function () {
                        self.$refs.editcombactionname.ApplyActionName();
                    }
                });
                self.$refs.editcombactionname.actionModel = actionModel;
                self.$refs.editcombactionname.combActionModel = combActionModel;
                self.$refs.editcombactionname.targetIndex = targetIndex;
                self.$refs.editcombactionname.groupName = groupName;
            } else {
                $(combActionModel.Actions).each(function (i) {
                    var actionGroupName = combActionModel.Actions[i].GroupName;
                    var targetModel;
                    if (actionGroupName == groupName) {
                        targetModel = that.getActiveMode(self, groupName);
                        targetModel.splice(targetIndex, 0, combActionModel.Actions[i]);
                        targetIndex += 1;
                    } else {
                        targetModel = that.getActiveMode(self, actionGroupName);
                        targetModel.push(combActionModel.Actions[i]);
                    }
                });
                self.$root.$refs.caculation.$refs.ecmethods.ecModel = self.$root.$refs.caculation.$refs.ecmethods.ecModel.concat(combActionModel.Models);
            }

        });
    },
    getTaskModel: function (self) {
        var taskModel = [];
        $(self.directModel).each(function () {
            taskModel.push(this);
        })
        $(self.caculateModel).each(function () {
            taskModel.push(this);
        })
        $(self.exportModel).each(function () {
            taskModel.push(this);
        })
        return taskModel;
    },
    setActiveItem: function (self, index, groupName) {
        if (index == -1) {
            if (self.directModel.length > 0) {
                this.setActiveItem(self, 0, "DirectInput");
            } else if (self.caculateModel.length > 0) {
                this.setActiveItem(self, 0, "Calculated");
            } else if (self.exportModel.length > 0) {
                this.setActiveItem(self, 0, "Export");
            } else {
                self.activeId = -1;
                self.activeGroupName = "";
            }
        } else {
            var activeModel = this.getActiveMode(self, groupName);
            activeModel[index].IsCheck = true;
            self.$refs.editactioncontent.activeAction = activeModel[index];
            self.activeId = index;
            self.activeGroupName = groupName;
        }
    },
    getActiveMode: function (self, groupName) {
        switch (groupName) {
            case ("DirectInput"):
                return self.directModel;
                break;
            case ("Calculated"):
                return self.caculateModel;
                break;
            case ("Export"):
                return self.exportModel;
                break;
            default:
                return self.directModel;
        }
    },
    multiSelectAction: function (self, index, groupName)
    {
        var activeModel = this.getActiveMode(self, groupName);
        if (groupName != "DirectInput") {
            $(self.directModel).each(function (i) {
                self.directModel[i].IsCheck = false;
            });
        }
        if (groupName != "Calculated") {
            $(self.caculateModel).each(function (i) {
                self.caculateModel[i].IsCheck = false;
            });
        }
        if (groupName != "Export") {
            $(self.exportModel).each(function (i) {
                self.exportModel[i].IsCheck = false;
            });
        }
        activeModel[index].IsCheck = !activeModel[index].IsCheck;
    },
    singleSelectAction: function (self, index, groupName)
    {
        $(self.caculateModel).each(function (i) {
            self.caculateModel[i].IsCheck = false;
        });
        $(self.directModel).each(function (i) {
            self.directModel[i].IsCheck = false;
        });
        $(self.exportModel).each(function (i) {
            self.exportModel[i].IsCheck = false;
        });
        this.setActiveItem(self, index, groupName);
        if (self.$root.copyActionModel.length > 0 && self.$root.copyActionModel[0].GroupName == groupName) {
            $('#action-menu-paste').removeClass('disable');
        } else {
            $('#action-menu-paste').addClass('disable');
        }
    },
    contextMenu: function (self)
    {
        var that = this;
        $.anyContext({
            el: '.tbActions',
            menu: [
				{
				    id: 'action-menu-copy',
				    text: 'Copy',
				    disable: true,
				    callback: function ()
				        {
				        if (!$(this).hasClass('disable')) {
				            var taskModel = that.getTaskModel(self);
				            var checkActionModel = taskModel.filter(function (item) {
				                if (item.IsCheck) return item;
				            })
				            var copyActions = [];
				            $(checkActionModel).each(function (i) {
				                copyActions.push($.extend(true, {}, checkActionModel[i]));
				            });
				            self.$root.copyActionModel = copyActions;
				            if (self.$root.copyActionModel.length > 0 && self.$root.copyActionModel[0].GroupName == self.activeGroupName) {
				                $('#action-menu-paste').removeClass('disable');
				            } else {
				                $('#action-menu-paste').addClass('disable');
				            }
				        }
				    }
				},
				{
				    id: 'action-menu-paste',
				    text: 'Paste',
				    disable: true,
				    callback: function ()
				    {
				        if (!$(this).hasClass('disable')) {
				            var targetIndex = parseInt(self.activeId);
				            var methods = self.$root.$refs.caculation.$refs.ecmethods.ecModel;
				            var activeModel = that.getActiveMode(self, self.activeGroupName);
				            for (var i = 0; i < self.$root.copyActionModel.length; i++) {
				                var copyActionObject = $.extend(true, {}, self.$root.copyActionModel[i]);
				                targetIndex += 1;
				                copyActionObject.ActionCode = copyActionObject.ActionCode + '_Copy';
				                copyActionObject.IsCheck = false;
				                var paramItem = copyActionObject.Parameter.filter(function (item) {
				                    if (item.Name == 'TypeName' && item.Value == 'EquationProvider.CashFlowEquationProvider') {
				                        return item;
				                    }
				                });
				                if (paramItem.length > 0) {
				                    paramItem = copyActionObject.Parameter.filter(function (item) {
				                        if (item.Name == 'MethodName') {
				                            return item;
				                        }
				                    });
				                }
				                if (paramItem.length > 0) {
				                    var methodName = paramItem[0].Value;
				                    paramItem[0].Value += "_Copy";
				                    var method = methods.filter(function (item) {
				                        if (item.Query.Name == methodName) {
				                            return item;
				                        }
				                    });
				                    if (method.length > 0) {
				                        var copyMethodObject = $.extend(true, {}, method[0]);
				                        copyMethodObject.Query.Name += "_Copy";
				                        methods.splice(0, 0, copyMethodObject);
				                    }

				                }
				                paramlist = copyActionObject.Parameter;
				                activeModel.splice(targetIndex, 0, copyActionObject);
				            }
				        }
				    }
				},
				{
				    id: 'action-menu-delete',
				    text: 'Delete',
				    disable: true,
				    callback: function ()
				        {
				        if (!$(this).hasClass('disable')) {
				            var checkActionModel = self.directModel.filter(function (item) {
				                if (item.IsCheck) return item;
				            });
				            $.each(checkActionModel, function (i) {
				                self.directModel.$remove(checkActionModel[i]);
				            });
				            checkActionModel = self.caculateModel.filter(function (item) {
				                if (item.IsCheck) return item;
				            });
				            $.each(checkActionModel, function (i) {
				                self.caculateModel.$remove(checkActionModel[i]);
				            });
				            checkActionModel = self.exportModel.filter(function (item) {
				                if (item.IsCheck) return item;
				            });
				            $.each(checkActionModel, function (i) {
				                self.exportModel.$remove(checkActionModel[i]);
				            });
				            var activeModel = that.getActiveMode(self, self.activeGroupName);
				            if (activeModel.length <= self.activeId) {
				                self.activeId = activeModel.length - 1;
				            };
				            that.setActiveItem(self, self.activeId, self.activeGroupName);
				        }
				    }
				}
            ]
        });
    },
    events: function (self) {
        // 伸缩
        $('#TaskContent .panel-head').click(function(){
            var $this = $(this);
            if($this.hasClass('open')){
                $this.removeClass('open');
                $this.find('i').attr('class','icon-down-dir');
                $this.next().slideDown(100);
            }else{
                $this.addClass('open');
                $this.find('i').attr('class','icon-right-dir');
                $this.next().slideUp(100);
            }
        })
        $(".tbActions").keydown(function (e) {
            if (event.ctrlKey && e.keyCode == 67) {
                $('#action-menu-copy').trigger('click');
            }
            if (event.ctrlKey && e.keyCode == 86) {
                $('#action-menu-paste').trigger('click');
            }
            if (e.keyCode == 46) {
                $('#action-menu-delete').trigger('click');
            }
        })

        this.dropsortcashflowtools(self);
        this.contextMenu(self);
    },
    component: function () {
        var self = this;
        var editActionContent = use('viewEditActionContent').component();
        var editCombActionName = use('viewEditCombActionName').component();
        var editActionNumber = use('viewEditActionNumber').component();
        var editTaskXML = use('viewEditTaskXML').component();
        var mainViews = use('viewCashFlowDataInput');  
        var taskRun = use('viewTaskRun').component();

        var taskActions = Vue.extend({
            data:function(){
                return {
                    directModel: [],
                    caculateModel: [],
                    exportModel: [],
                    taskCode:'',
                    activeId: -1,
                    scrollIndex: -1,
                    scrollCode: '',
                    activeGroupName: 'DirectInput',
                    display: true,  // 显示Action内容，true: All Action Content  false:Simple Action Content
                    sizelen: 15,
                    language:this.$root.language
                };
            },
            template : '#taskWorkTemplate',
            components: {
                'edit-actioncontent': editActionContent,
                'edit-combactionname': editCombActionName,
                'edit-actionnumber': editActionNumber,
                'edit-taskxml': editTaskXML,
                'mainview':mainViews,
                'pop-runtask': taskRun
            },
            methods: {
                selectAction: function (event, index, groupName) {
                    var that = this;
                    // 是否是多选
                    if(event.ctrlKey){
                        self.multiSelectAction(that, index, groupName);
                    }else{
                        self.singleSelectAction(that, index, groupName);
                    }
                },
                showContent:function(index){
                    var that = this;
                    if (this.activeId ==  -1) {
                        $.anyDialog({
                            width:260,
                            height:100,
                            title:'提示',
                            html:'<div style="line-height:80px;font-size:14px;text-align:center">您还没有选中需要编辑的内容!</div>',
                            status:'alert',
                            button:'知道了'
                        });
                    }else{
                        $('.modal-close').trigger('click'); //弹出showContent窗口
                        this.$refs.editactioncontent.display = true;
                        $.anyDialog({
                            width:1000,
                            height:500,
                            title:'Action Content',
                            html:$('#editParameter'),
                            mini:true,
                            dragable:true
                        });
                    }
                },
                showSimpleContent:function(index){
                    var that = this;
                    if (that.activeId == -1) {
                        $.anyDialog({
                            width:260,
                            height:100,
                            title:'提示',
                            html:'<div style="line-height:80px;font-size:14px;text-align:center">您还没有选中需要编辑的内容!</div>',
                            status:'alert',
                            button:'知道了'
                        });
                    }else{
                        $('.modal-close').trigger('click'); //弹出showContent窗口
                        that.$refs.editactioncontent.display = false;
                        $.anyDialog({
                            width:600,
                            height:500,
                            title:'Action Simple Content',
                            html:$('#editParameter'),
                            mini:true,
                            dragable:true
                        });
                    }
                    //$('.modal-normal').trigger('click');//弹出showSimpleContent窗口
                },
                applyTask: function () {
                    var that = this;
                    var appDomain = that.$root.appDomain;
                    var taskCode = that.taskCode;
                    var actionCategoryCode = config.categoryCode.e_action;
                    var taskCategoryCode = config.categoryCode.e_task
                    var codeList = [];

                    $(that.directModel).each(function () {
                        codeList.push(this.ActionCode);
                    })
                    $(that.caculateModel).each(function () {
                        codeList.push(this.ActionCode);
                    })
                    $(that.exportModel).each(function () {
                        codeList.push(this.ActionCode);
                    })
                    if (codeList.length > 0) {
                        webProxy.checkCodeDictionaryList(appDomain, codeList, actionCategoryCode, function (response) {
                            $(".tbActions li").each(function (i) {
                                var actionCode = $(this).find("span")[0].innerText;
                                var isExit = _.some(response, ['Code', actionCode]);
                                if (isExit) {
                                    $(".tbActions li").eq(i).css("color", "red");
                                } else {
                                    $(".tbActions li").eq(i).css("color", "black");
                                }
                            })
                        })
                    }
                    webProxy.isNewDictionaryCode(appDomain, taskCode, taskCategoryCode, function (response) {
                        if (response) {
                            $("#searchTaskCode").css('color', 'red');
                        }
                        else {
                            $("#searchTaskCode").css('color', 'black');
                        }
                    })
                },
                refreshTask: function () {
                    var that = this;
                    $("#searchTaskCode").css('color', 'black');
                    $(".tbActions li").css('color', 'black');

                    that.$parent.refreshIndex += 1;
                    that.taskCode = that.$parent.taskCode;
                },
                showTaskXML: function () {
                    var that = this;
                    var taskModel = self.getTaskModel(this);
                    var taskXml = dataProcess.taskModelToXml(taskModel);
                    this.$refs.edittaskxml.taskXml = dataProcess.formatXml(taskXml);
                    //this.$refs.edittaskxml.taskXml = taskXml;
                    this.$refs.edittaskxml.showXml = true;
                },
                popTaskDataInput: function () {
                    this.$refs.mainviews.showDataInput = true;

                    //var appDomain = this.$root.appDomain;
                    //var taskCode = this.$parent.taskCode;
                    //var guid = this.$root.currentGuid;
                    //var address = location.protocol + "//" + location.host + "/CashFlowEngine/UITaskStudio/CashFlowDataInput.html?appDomain=" + appDomain + "&taskCode=" + taskCode + "&guid=" + guid + "&r=" + Math.random() * 150;
                    //var that = this;

                    //$.anyDialog({
                    //    width: $(window).width(),
                    //    height: $(window).height() - 30,
                    //    title: 'CashFlow DataInput',
                    //    url: address,
                    //    onClose: function () {
                    //        $("#iframePage").contents().find("#btnApply").trigger('click');
                    //        console.log(globalVariable.variableObj);
                    //        //var array = JSON.parse(localStorage.getItem("CashFlowEngine"));
                    //        that.$parent.$refs.tasktool.items[1].list = globalVariable.variableObj;
                    //        that.$root.$refs.caculation.$refs.caculationtools.data.items[1].list = globalVariable.variableObj;
                    //    }
                    //});
                },
                popCashFlowRunWindow: function () {
                    if (this.$parent.taskCode != "") {
                        var that = this;
                        //var array = JSON.parse(localStorage.getItem("CashFlowEngine"));
                        var sContext = {
                            appDomain: this.$root.appDomain,
                            sessionVariables: dataProcess.getRunTaskSessionVariables(globalVariable.variableObj, this.$parent.taskCode, this.$root.$refs.caculation.ecCode),
                            taskCode: this.$parent.taskCode
                        };
                        webProxy.createSessionByTaskCode(sContext, function (response) {
                            isSessionCreated = true;
                            sessionID = response;
                            that.$root.sessionId = sessionID;
                            taskCode = that.$parent.taskCode
                            IndicatorAppDomain = that.$root.appDomain;
                            $.anyDialog({
                                width: 455,
                                height: 460,
                                title: 'Task Process',
                                html: $('#taskIndicatorArea')
                            });
                            if (IsSilverlightInitialized) {
                                InitParams();
                            }
                        });
                    }
                },
                showDisplayer: function (event) {
                    var appDomain = this.$root.appDomain;
                    var taskCode = this.$parent.taskCode;
                    var sessionId = this.$root.sessionId;
                    var url = location.protocol + "//" + location.host + "/CashFlowEngine/UITaskStudio/CashFLowDisplayer.html?appDomain=" + appDomain + "&sessionId=" + sessionId + "&taskCode=" + taskCode + "&r=" + Math.random() * 150;
                    if (sessionId != "" && taskCode != "" && appDomain != "") {
                        window.open(url, '_blank');
                    }
                },
                clearLocalStorage: function () {
                    if (confirm("你确定要清除缓存吗，清除成功后，页面会重新加载！")) {
                        localStorage.clear();
                        window.location.reload();
                    }
                },
                //中英文切换 2017-4-27 wenwen
                switchLanguage: function () {
                    var lang = this.language == 'en' ? 'cn' : 'en';
                    var appDomain = this.$root.appDomain;
                    var taskCode = this.$parent.taskCode;
                    var url = webProxy.siteAppUrl + "/UITaskStudio/index.html?";
                    if (appDomain != "") {
                        url += "appDomain=" + appDomain+"&";
                        if (taskCode != "") {
                            url += "taskCode=" + taskCode+"&";
                        } 
                    }   
                    url += "language=" + lang;
                 
                    window.location.href = url;
                },
                saveTask: function () {
                    var that = this;
                    var operator = this.$parent.operator;
                    var appDomain = this.$root.appDomain;
                    var newTaskCode = this.taskCode;
                    var oldTaskCode = this.$parent.taskCode;
                    var ecCode = this.$root.$refs.caculation.ecCode;
                    var taskXml = dataProcess.taskModelToXml(self.getTaskModel(this));
                    //var array = JSON.parse(localStorage.getItem("CashFlowEngine"));
                    var variables = globalVariable.variableObj == null ? [] : globalVariable.variableObj;
                    var arrayJson = globalVariable.arrObj == null ? [] : globalVariable.arrObj;
                    var contextXml = dataProcess.taskSessionContentXml(variables);
                    var arrayXml = dataProcess.taskArrayObjectToXml(arrayJson);
                    //var contextXml = dataProcess.taskSessionContentXml(this.$parent.$refs.taskaction.$refs.taskdatainput.variables);
                    //var arrayXml = dataProcess.taskArrayObjectToXml(this.$parent.$refs.taskaction.$refs.taskdatainput.arrayjson);
                    taskXml = taskXml.replace(/\n/g, "");
                    webProxy.saveTask(appDomain, operator, ecCode, newTaskCode, oldTaskCode, taskXml, contextXml, arrayXml, function (response) {
                        if (response) {
                            that.$parent.taskCode = that.taskCode;
                            that.$parent.refreshCode = that.taskCode;
                            that.$parent.operator = config.status.e_update;
                            $("#searchTaskCode").css('color', 'black');
                            $(".tbActions li").css('color', 'black');
                            alert("saved successfuly.");
                        } else {
                            alert("save process task array error.");
                        }
                    });
                }
            },
            watch: {
                scrollIndex: function (index) {
                    var actionCode = this.scrollCode;
                    var searched = false;
                    var scrollGoupName = "";
                    var scrollIndex = -1;
                    if (!searched) {
                        $(this.directModel).each(function (i) {
                            if (this.ActionCode == actionCode) {
                                scrollGoupName = "#DirectInput";
                                scrollIndex = i + 1;
                                searched = true;
                                return false;
                            }
                        })
                    }
                    if (!searched) {
                        $(this.caculateModel).each(function (i) {
                            if (this.ActionCode == actionCode) {
                                scrollGoupName = "#Calculated";
                                scrollIndex = i + 1;
                                searched = true;
                                return false;
                            }
                        })
                    }
                    if (!searched) {
                        $(this.exportModel).each(function (i) {
                            if (this.ActionCode == actionCode) {
                                scrollGoupName = "#Export";
                                scrollIndex = i;
                                searched = true;
                                return false;
                            }
                        })
                    }
                    if (searched) {
                        var $this = $(scrollGoupName).parent().parent().find('.panel-head');
                        if ($this.hasClass('open')) {
                            $this.removeClass('open');
                            $this.find('i').attr('class', 'icon-down-dir');
                            $this.next().slideDown(100, function () {
                                $("#work-body").scrollTop($(scrollGoupName).find('li').get(scrollIndex).offsetTop - 76);
                            });
                        } else {
                            this.$nextTick(function () {
                                $("#work-body").scrollTop($(scrollGoupName).find('li').get(scrollIndex).offsetTop - 76);
                            });
                        }
                        self.singleSelectAction(this, scrollIndex - 1, scrollGoupName.substring(1, scrollGoupName.length));
                    }
                },
                directModel: {
                    handler: function (val, oldval) {
                        var taskModel = self.getTaskModel(this);
                        this.$root.$refs.caculation.$refs.caculationtools.data.items[0].list = dataProcess.metaDataModelByTaskModel(taskModel);
                        var checkActionModel = taskModel.filter(function (item) {
                            if (item.IsCheck) return item;
                        });
                        if (checkActionModel.length > 0) {
                            $('#action-menu-copy').removeClass('disable');
                            $('#action-menu-delete').removeClass('disable');
                        } else {
                            $('#action-menu-copy').addClass('disable');
                            $('#action-menu-delete').addClass('disable');
                        };
                    },
                    deep:true
                },
                caculateModel: {
                    handler: function (val, oldval) {
                        var taskModel = self.getTaskModel(this);
                        this.$root.$refs.caculation.$refs.caculationtools.data.items[0].list = dataProcess.metaDataModelByTaskModel(taskModel);
                        var checkActionModel = taskModel.filter(function (item) {
                            if (item.IsCheck) return item;
                        });
                        if (checkActionModel.length > 0) {
                            $('#action-menu-copy').removeClass('disable');
                            $('#action-menu-delete').removeClass('disable');
                        } else {
                            $('#action-menu-copy').addClass('disable');
                            $('#action-menu-delete').addClass('disable');
                        };
                    },
                    deep: true
                },
                exportModel: {
                    handler: function (val, oldval) {
                        var taskModel = self.getTaskModel(this);
                        this.$root.$refs.caculation.$refs.caculationtools.data.items[0].list = dataProcess.metaDataModelByTaskModel(taskModel);
                        var checkActionModel = taskModel.filter(function (item) {
                            if (item.IsCheck) return item;
                        });
                        if (checkActionModel.length > 0) {
                            $('#action-menu-copy').removeClass('disable');
                            $('#action-menu-delete').removeClass('disable');
                        } else {
                            $('#action-menu-copy').addClass('disable');
                            $('#action-menu-delete').addClass('disable');
                        };
                    },
                    deep: true
                },
                taskCode:function (newvalue) {
                    if(newvalue){
                        this.sizelen = newvalue.length + 5;
                    }
                    if (newvalue=='') {
                        this.sizelen = 15;
                    }
                }
            },
            ready: function () {
                self.events(this);
            }
        });
        return taskActions;
    },
});
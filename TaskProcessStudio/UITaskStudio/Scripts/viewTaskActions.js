define('viewTaskActions', {
    dropsorttasktools: function (self) {
        // 模板载入之后执行DOM操作
        $("[droppable='tasktools']").each(function (key, value) {
            var dropThat = this;
            Sortable.create(dropThat, {
                group: {
                    pull: false,
                    put: ['Variable']
                },
                sort: false,
                //Element is dropped into the list from another list
                onAdd: function (/**Event*/evt) {
                    var dragli = $("[droppable='tasktools'] li");
                    var dragText = evt.clone.innerText;
                    if (dragli.length > 0) {
                        var activeAction = self.activeAction;
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
                    put: ['Single Actions']
                },
                //Element is dropped into the list from another list
                onAdd: function (/**Event*/evt) {
                    var dragAction = $("ul[class='tbActions']").find("li[class='']");
                    if (dragAction.length > 0) {
                        dragAction.remove();
                        if (self.$root.dragType == "Single Actions") {
                            var newActionModel = $.extend(true, {}, self.$parent.$refs.cashflowtool.items[0].list[evt.oldIndex]);
                            newActionModel.ActionCode += "_Copy";
                            self.taskModel.splice(evt.newIndex, 0, newActionModel);
                        }
                    }
                },
                onUpdate: function (/**Event*/evt) {
                    var item = self.taskModel[evt.oldIndex];
                    self.taskModel.$remove(item);
                    self.taskModel.splice(evt.newIndex, 0, $.extend(true, {}, item));
                },
            });
        }
    },
    multiSelectAction: function (self, index)
    {
        self.taskModel[index].IsCheck = true;
	},
    singleSelectAction: function (self, index)
    {
        $(self.taskModel).each(function (i) {
            self.taskModel[i].IsCheck = false;
        });

        self.taskModel[index].IsCheck = true;
        self.$refs.editactioncontent.activeAction = self.taskModel[index];
        self.activeId = index;
 
	    if (self.$root.copyActionModel.length > 0) {
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
				            var checkActionModel = self.taskModel.filter(function (item) {
				                if (item.IsCheck) return item;
				            })
				            var copyActions = [];
				            $(checkActionModel).each(function (i) {
				                copyActions.push($.extend({}, checkActionModel[i]));
				            });
				            self.$root.copyActionModel = copyActions;
				            if (self.$root.copyActionModel.length > 0) {
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
				            for (var i = 0; i < self.$root.copyActionModel.length; i++) {
				                var copyActionObject = $.extend({}, self.$root.copyActionModel[i]);
				                targetIndex += 1;
				                copyActionObject.ActionCode = copyActionObject.ActionCode + '-Copy';
				                copyActionObject.IsCheck = false;
				                self.taskModel.splice(targetIndex, 0, copyActionObject);
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
				            checkActionModel = self.taskModel.filter(function (item) {
				                if (item.IsCheck) return item;
				            });
				            $.each(checkActionModel, function (i) {
				                self.taskModel.$remove(checkActionModel[i]);
				            });
				        }
				    }
				}
            ]
        });
    },
	events: function (self) {
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
	    var editTaskXML = use('viewEditTaskXML').component();
	    var taskRun = use('viewTaskRun').component();

		var taskActions = Vue.extend({
			data:function(){
			    return {
                    taskModel:[],
					taskCode:'',
					activeId: -1,
					display: true,  // 显示Action内容，true: All Action Content  false:Simple Action Content
					sizelen:15
				};
			},
			template : '#taskWorkTemplate',
			components: {
			    'edit-actioncontent': editActionContent,
			    'edit-taskxml': editTaskXML,
			    'pop-runtask': taskRun
			},
			methods: {
				selectAction: function (event, index) {
				    var that = this;
 				    // 是否是多选
				    if(event.ctrlKey){
				        self.multiSelectAction(that, index);
				    }else{
				        self.singleSelectAction(that, index);
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

				    $(that.taskModel).each(function (i) {
				        codeList.push(that.taskModel[i].ActionCode);
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
				    var taskXml = dataProcess.taskModelToXml(this.taskModel);
				    this.$refs.edittaskxml.taskXml = taskXml;
				    this.$refs.edittaskxml.showXml = true;
				},
				popTaskDataInput: function ()
				{
				    var appDomain = this.$root.appDomain;
				    var taskCode = this.$parent.taskCode;
				    var guid = this.$root.currentGuid;
				    var address = location.protocol + "//" + location.host + "/TaskProcessStudio/UITaskStudio/CashFlowDataInput.html?appDomain=" + appDomain + "&taskCode=" + taskCode + "&guid=" + guid + "&r=" + Math.random() * 150;
				    var that = this;

				    $.anyDialog({
				        width: $(window).width(),
				        height: $(window).height() - 30,
				        title: 'CashFlow DataInput',
				        url: address,
				        onClose: function () {
				            $("#iframePage").contents().find("#btnApply").trigger('click');
				            that.$parent.$refs.tasktool.items[0].list = JSON.parse(localStorage["variables" + that.$root.currentGuid]);
				        }
				    });
				},
				popCashFlowRunWindow: function () {
				    if (this.$parent.taskCode != "") {
				        var that = this;
				        var sContext = {
				            appDomain: this.$root.appDomain,
				            sessionVariables: localStorage["variables" + this.$root.currentGuid] == "" ? "<SessionVariables><SessionVariable><Name>a</Name><Value></Value><DataType>a</DataType><IsConstant>0</IsConstant><IsKey>0</IsKey><KeyIndex>0</KeyIndex></SessionVariable></SessionVariables>" : dataProcess.getRunTaskSessionVariables(JSON.parse(localStorage["variables" + this.$root.currentGuid]), this.$parent.taskCode, null),
				            taskCode: this.$parent.taskCode
				        };
				        webProxy.createSessionByTaskCode(sContext, function (response) {
				            isSessionCreated = true;
				            sessionID = response;
				            that.$root.sessionId = sessionID;
				            taskCode = that.$parent.taskCode
				            IndicatorAppDomain = that.$root.appDomain;
				            //var address = location.protocol + "//" + location.host + "/ProcessEngine/UITaskStudio/TaskAutoRun.html?";
				            //address += "appDomain=" + that.$root.appDomain;
				            //address += "&sessionId=" + sessionID;
				            $.anyDialog({
				                width: 455,
				                height: 460,
				                title: 'Task Process',
				                html: $('#taskIndicatorArea') // url:address
				            });
				            if (IsSilverlightInitialized) {
				                InitParams();
				            }
				        });
				    }  
				},
				saveTask: function () {
				    var that = this;
				    var operator = this.$root.operator;
				    var appDomain = this.$root.appDomain;
				    var newTaskCode = this.taskCode;
				    var oldTaskCode = this.$parent.taskCode;
  				    var variables = localStorage["variables" + this.$root.currentGuid] == "" ? [] : JSON.parse(localStorage["variables" + this.$root.currentGuid]);
				    var contextXml = dataProcess.taskSessionContentXml(variables);
				    var taskXml = dataProcess.taskModelToXml(this.taskModel);
				    var arrayXml = null;
				    var ecCode = null;
				    taskXml = taskXml.replace(/\n/g, "");				 
				    webProxy.saveTask(appDomain, operator, ecCode, newTaskCode, oldTaskCode, taskXml, contextXml, arrayXml, function (response) {
				        if (response) {
				            that.$parent.taskCode = that.taskCode;
				            that.$parent.refreshCode = that.taskCode;
				            that.$root.operator = config.status.e_update;
				            $("#searchTaskCode").css('color', 'black');
				            $(".tbActions li").css('color', 'black');
				            alert("saved successfuly.");
				        } else {
				            alert("save process task array error.");
				        }
				    });
				},
				PopSessionManage: function () {
				    var appDomain = this.$root.appDomain;
				    var url = location.protocol + "//" + location.host + "/TaskProcessStudio/UITaskStudio/SessionManage.html?appDomain=" + appDomain + "&r=" + Math.random() * 150;
				   
				    window.open(url, '_blank');
				    
				    //$.anyDialog({
				    //    width: $(window).width()-300,
				    //    height: $(window).height() - 50,
				    //    title: 'Session Manage',
				    //    url: address,
				    //    onClose: function () {
 
				    //    }
				    //});
				}
			},
			watch: {
			    taskModel: {
			        handler: function (val, oldval) {
			            var checkActionModel = val.filter(function (item) {
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
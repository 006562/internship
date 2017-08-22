var workflowRun = {
    variableTemplate: "<SessionVariable><Name>{0}</Name><Value>{1}</Value><DataType>String</DataType><IsConstant>1</IsConstant><IsKey>1</IsKey><KeyIndex>1</KeyIndex></SessionVariable>",
    variableMtemplate: "<SessionVariable><Name>{0}</Name><Value>{1}</Value><DataType>String</DataType><IsConstant>0</IsConstant><IsKey>0</IsKey><KeyIndex>0</KeyIndex></SessionVariable>",
    taskAutoRunAddress: location.protocol + "//" + location.host + "/TaskProcessEngine/TaskAutoRun.html?",
    workflowApprovalAddress: location.protocol + "//" + location.host + "/WorkflowEngine/Pages/workflowApproval.html",
    objId: getRequest().objId,
    objType: getRequest().objType,
    currentState: '',
    createControlTaskSession: function (callback) {
        var self = this;
        var sContext = {
            appDomain: workflowType[this.objType].controlAppDomain,
            sessionVariables: self.getControlTaskSessionVarible(),
            taskCode: workflowType[this.objType].controlTaskCode
        };
        webProxy.createSessionByTaskCode(sContext, function () {
            callback();
        })
    },
    CreateMonitorTaskSession: function (callback) {
        var self = this;
        var sContext = {
            appDomain: workflowType[this.objType].monitorAppDomain,
            sessionVariables: self.getMonitorTaskSessionVarible(),
            taskCode: workflowType[this.objType].monitorTaskCode
        };
        webProxy.createSessionByTaskCode(sContext, function () {
            callback();
        })
    },
    createSourceTaskSession: function (sourceTaskCode, reason, currentSessionProcessStatusId, callback) {
        var self = this;
        var sContext = {
            appDomain: workflowType[this.objType].sourceTaskAppDomain,
            sessionVariables: self.getSourceTaskSessionVarible(reason, currentSessionProcessStatusId),
            taskCode: sourceTaskCode
        };
        webProxy.createSessionByTaskCode(sContext, function (response) {
            callback(response);
        })
    },
    createWorkFlowSession: function () {
        var self = this;
        self.createControlTaskSession(function () {
            self.CreateMonitorTaskSession(function () {
                alert("发起流程成功！");
                self.initWorkflowRunPage();
                //self.autoRunWorkflowFirstStep(callback);
            });
        });
    },
    getControlTaskSessionVarible: function () {
        var sReturn = "";
        sReturn += this.variableTemplate.format('TrustID', this.objId);
        sReturn += this.variableTemplate.format('reportingDate', "WFTPC" + this.objType);
        sReturn = '<SessionVariables>{0}</SessionVariables>'.format(sReturn);
        return sReturn;
    },
    getMonitorTaskSessionVarible: function () {

        var sReturn = "";
        sReturn += this.variableTemplate.format('TrustID', this.objId);
        sReturn += this.variableTemplate.format('reportingDate', "WFTPM" + this.objType);
        $.each(workflowType[this.objType].sessionVariable, function (n, value) {
            sReturn += this.variableMtemplate.format(value[0], value[1]);
        }.bind(this));
        sReturn = '<SessionVariables>{0}</SessionVariables>'.format(sReturn);
        return sReturn;
    },
    getSourceTaskSessionVarible: function (reason, currentSessionProcessStatusId) {
        var self = this;
        var sReturn = "";
        sReturn += this.variableMtemplate.format('MonitorSessionName', this.objId + "_WFTPM" + this.objType);
        sReturn += this.variableMtemplate.format('ControlSessionName', this.objId + "_WFTPC" + this.objType);
        //todo
        sReturn += self.getOpenerSessionVariables();
        //end
        sReturn += this.variableMtemplate.format('Transition', reason);
        sReturn += this.variableMtemplate.format('CurrentSessionProcessStatusId', currentSessionProcessStatusId);
        sReturn = '<SessionVariables>{0}</SessionVariables>'.format(sReturn);
        return sReturn;
    },
    showTaskAutoRunWindow: function (appDomain, sessionId, callback) {
        webProxy.runTask(appDomain, sessionId, function (response) {
            callback(response);
        })
    },
    showApprovalView: function () {
        var self = this;
        var currentUser = RoleOperate.cookieName();
        if (currentUser) {
            RoleOperate.GetRolesPermissionByUserName(currentUser, function (r) {
                var stateCode = [];
                r.forEach(function (i) {
                    stateCode.push(i.CodeDictionaryCode);
                });
                if ($.inArray(self.currentState, stateCode) >= 0) {
                    var address = self.workflowApprovalAddress + "?objId=" + self.objId + "&objType=" + self.objType;
                    openPopupWindow(address, 400, 280);
                } else { alert("你没有该操作权限!"); }
            });
        } else {
            var address = self.workflowApprovalAddress + "?objId=" + self.objId + "&objType=" + self.objType;
            openPopupWindow(address, 400, 280);
        }
    },
    initWorkflowRunPage: function () {
        debugger;
        var self = this;
        if (this.objId == "undifined" || this.objId == "0") {
            $("#btnCreateSession").hide();
            $("#btnShowWorkflowDisplayer").hide();
            $("#btnWorkflowApproval").hide();
            $("span.status_tip").text("");
            this.currentState = '';
        } else {
            webProxy.getCurrentApprovalState("Monitor", this.objId, this.objType, function (response) {
                if (response[0].CurrentState == "") {
                    $("#btnCreateSession").show();
                    $("#btnShowWorkflowDisplayer").hide();
                    $("#btnWorkflowApproval").hide();
                    $("span.status_tip").text("当前状态：{0}".format("未发起流程"));
                    self.currentState = '';
                } else {
                    if (response[0].CurrentState_En == "") {
                        $("#btnCreateSession").hide();
                        $("#btnShowWorkflowDisplayer").show();
                        $("#btnWorkflowApproval").hide();
                    } else {
                        $("#btnCreateSession").hide();
                        $("#btnShowWorkflowDisplayer").show();
                        $("#btnWorkflowApproval").show();
                    }
                    $("span.status_tip").text("当前状态：{0}".format(response[0].CurrentState));
                    self.currentState = response[0].CurrentState_En;
                }
            })
        }
    },
    createWorkflowActionButtons: function () {
        $("#buttongroup").empty();
        webProxy.GetCurrentWorkflowActions("Monitor", this.objId, this.objType, function (response) {
            if (response != undefined) {
                var buttonTemplate = '<button type="button" class="btn btn-default" onclick="workflowRun.runWorkflowCurrentStep(\'{0}\',\'{1}\',\'{2}\',\'{3}\')">{4}</button>';
                var strButtons = "";
                $.each(response, function (i) {
                    strButtons += buttonTemplate.format(response[i].NextActionCode, response[i].Reason, response[i].CurrentSessionProcessStatusId, response[i].CurrentState, response[i].AliasValue)
                });
                $("#buttongroup").html(strButtons);
            }
        });
    },
    runWorkflowCurrentStep: function (taskCode, reason, currentSessionProcessStatusId, currentState) {
        var self = this;
        $('#loading').show();
        var currentUser = RoleOperate.cookieName();
        webProxy.saveApprovalOpinionLog(workflowType[self.objType].controlAppDomain, this.objId, this.objType, currentState, reason, htmlspecialchars($.trim($("#approval_opinion").val())), currentUser, function (response) {
            self.createSourceTaskSession(taskCode, reason, currentSessionProcessStatusId, function (response) {
                self.showTaskAutoRunWindow(workflowType[self.objType].sourceTaskAppDomain, response, function (response) {
                    $('#operate,#loading').hide();
                    if (response && response == '1') {
                        $('#success').show();
                        var isOver = 0;
                        var WorkFlowCode = getRequest().workFlowCode;
                        if (WorkFlowCode) {
                            auto_redirect(2, function () {
                                window.opener.renderDisplayer();
                                window.opener.closePopupWindow();
                                isOver = 1;
                            });
                        } else {
                            auto_redirect(2, function () {
                                window.opener.closePopupWindow();
                                window.opener.location.reload();
                                isOver = 1;
                            });
                        }

                        var tmpInterval = setInterval(function () {
                            if (isOver == 1) {
                                self.workflowAfterCallback();
                                window.clearInterval(tmpInterval);
                            }
                        }, 10);
                    } else if (response == '0') {
                        $('#error').show();
                        $('#errorMessage').text('error');
                    } else {
                        $('#error').show();
                        $('#errorMessage').text(response);
                    }
                })
            })
        })
    },
    getDisplayerAddress: function () {
        window.open(location.protocol + "//" + location.host + "/WorkflowEngine/Pages/workflowRecord.html?objId=" + this.objId + '&objType=' + this.objType);
    }
    ,
    getOpenerSessionVariables: function () {
        var self = this;
        var sReturn = '';
        try {
            //debugger;
            var thisopener = self.getOpenerInWorkflowApproval();

            var svs = thisopener.WorkFlowSessionVariables;

            svs = typeof svs == 'function' ? svs(self.objId, self.objType) : svs;
            for (var sv in svs || []) {
                sReturn += this.variableMtemplate.format(sv, svs[sv]);
            }
        } catch (e) {

        }
        return sReturn;
    }
,
    workflowAfterCallback: function () {
        var self = this;
        var sReturn = '';
        try {
            var thisopener = self.getOpenerInWorkflowApproval();

            thisopener.WorkFlowCallBack(self.objId, self.objType);
        }
        catch (e) {

        }
    }
,
    getOpenerInWorkflowApproval: function () {
        var thisopener = null;
        try {
            if (window.opener.location.pathname.toLocaleLowerCase() == '/workflowengine/pages/workflowrun.html')
                thisopener = window.opener.parent;
            else if (window.opener.location.pathname.toLocaleLowerCase() == '/workflowengine/pages/workflowrecord.html')
                thisopener = window.opener.opener.parent;
        }
        catch (e) {

        }
        return thisopener;
    }
};
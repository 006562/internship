define('viewSessionManage', {
    template: '#mainview',
    data: function () {
        return {
            appDomain: appDomain ? appDomain : 'Task',
            spName: 'usp_GetSessionListWithPager',
            page: 1,
            pageSize: 15,
            orderby: 'StartTime',
            direction: 'desc',
            filter: " ",   //and (SessionStatusDesc NOT IN ('Expired','Completed','Closed'))
            total: 0,
            xmlProcessTask: '',
            xmlProcessAction: '',
            showTaskXml: false,
            showActionXml: false,
            showActions: false,
            CodeMirror: null,
            sessions: [],
            actions: [],
            variables: [],
            activeSession: '',
            dateFormat: function (date) {
                var regex = /\D/igm;
                var retDate = new Date(parseInt(date.replace(regex, '')));
                return retDate.dateFormat("yyyy-MM-dd hh:mm:ss");
            }
        };
    },
    methods: {
        popSessionRunWindow: function (session) {
            var self = this;
            self.showActions = true;
            self.activeSession = session;

            if (self.activeSession.SessionStatusDesc.toUpperCase() == 'ACTIVE') {
                $("#btnRunTask").attr("disabled", "disabled");
            } else {
                $("#btnRunTask").removeAttr("disabled");
            }

            Loading.Show();
            self.getSessionProcessStatus();
        },
        popVariableWindow: function (sessionId) {
            var self = this;
            var spName = "usp_GetSessionContext";

            webProxy.getSessionContext(self.appDomain, spName, sessionId, function (response) {
                if (response) {
                    self.variables = response;
                }

                $.anyDialog({
                    width: $(window).width() - 600,
                    height: $(window).height() - 200,
                    title: 'Session Variable',
                    html: $('#divVariableList')
                });
            });

        },
        popActionWindow: function () {
            var self = this;
            self.showActions = false;
            self.dataBind();
        },
        popXMLTaskProcess: function (taskCode) {
            var self = this;
            var sContent = "{'SPName':'usp_GetProcessTask'," +
                            "'ProcessTaskCode':'" + taskCode + "'" +
                            "}";
            webProxy.getQueryStoredProcedureProxy(self.appDomain, sContent, function (response) {
                if (response) {
                    self.xmlProcessTask = dataProcess.formatXml(response[0].XMLProcessTask);
                }
                self.showTaskXml = true;
            });

        },
        popXMLProcessAction: function (XMLProcessAction) {
            this.showActionXml = true;
            this.xmlProcessAction = dataProcess.formatXml(XMLProcessAction);
        },
        popMessageBox: function (message) {
            var temp = '<textarea class="messageText">' + message + '</textarea>';

            $.anyDialog({
                width: 300,
                height: 200,
                title: 'Action Message',
                html: temp
            });

        },
        popDeleteSession: function (sessionId) {
            if (confirm("是否删除选中项？")) {
                var self = this;
                var spName = 'usp_DeleteSession';
                webProxy.deleteSession(self.appDomain, spName, sessionId, function (response) {
                    if (response) {
                        alert("删除成功！");
                        self.dataBind();
                    } else {
                        alert("删除失败！");
                    }
                });
            }
        },
        popRefresh: function () {
            Loading.Show();
            this.getSessionProcessStatus();
        },
        getSessionProcessStatus: function () {
            var self = this;
            var spName = 'usp_GetSessionProcessStatus';
            webProxy.getSessionProcessStatus(self.appDomain, spName, self.activeSession.SessionId, true, function (response) {
                if (response && response.length > 0) {
                    var actions = [];
                    $(response).each(function (i, v) {
                        var runTime = "";
                        if (v.StartTime && v.EndTime) {
                            var regex = /\D/igm;
                            var start = new Date(parseInt(v.StartTime.replace(regex, '')));
                            var end = new Date(parseInt(v.EndTime.replace(regex, '')));
                            runTime = end - start;

                            //计算出相差天数
                            var days = Math.floor(runTime / (24 * 3600 * 1000))

                            //计算出小时数
                            var leave1 = runTime % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
                            var hours = Math.floor(leave1 / (3600 * 1000))

                            //计算相差分钟数
                            var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
                            var minutes = Math.floor(leave2 / (60 * 1000))

                            //计算相差秒数
                            var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
                            var seconds = Math.round(leave3 / 1000)

                            runTime = minutes + "分钟" + seconds + "秒";

                        }
                        actions.push({ ProcessActionCode: v.ProcessActionCode, ProcessActionName: v.ProcessActionName, RunTime: runTime, ProcessActionStatus: v.ProcessActionStatus, XMLProcessAction: v.XMLProcessAction, ActionMessage: v.ActionMessage });
                    })
                    self.actions = actions;
                }
                Loading.Close();
            });
        },
        runTask: function () {
            var self = this;
            sessionID = self.activeSession.SessionId;
            taskCode = self.activeSession.TaskCode;

            $.anyDialog({
                width: 455,
                height: 460,
                title: 'Task Process',
                html: $('#taskIndicatorArea'),
                onClose: function () {
                    Loading.Show();
                    self.getSessionProcessStatus();
                }
            });

            if (IsSilverlightInitialized) {
                InitParams(sessionID, IndicatorAppDomain, taskCode, clientName);
            }
        },
        dataBind: function () {
            var self = this;
            var start = (self.page - 1) * self.pageSize + 1;
            var end = self.page * self.pageSize;

            var sContent = '{"SPName":"usp_GetSessionListWithPager",' +
                              '"start":"' + start + '",' +
                              '"end":"' + end + '",' +
                              '"orderby":"' + self.orderby + '",' +
                              '"direction":"' + self.direction + '",' +
                              '"filter":"' + self.filter + '"' +
                              '}';
            webProxy.getSessionListWithPager(self.appDomain, sContent, true, function (response) {
                if (response) {
                    var dataSource = JSON.parse(response);
                    var dataArray = dataSource.data;
                    self.sessions = dataArray;
                    self.total = dataSource.total;
                }
            });

        }
    },
    watch: {
        xmlProcessTask: function (data) {
            var that = this;
            this.$nextTick(function () {
                var code = document.getElementById('txtTaskXml');
                $('#taskXml .CodeMirror').remove();
                this.CodeMirror = CodeMirror.fromTextArea(code, {
                    mode: "xml",
                    lineNumbers: true,
                    styleActiveLine: true,
                    //lineWrapping: true
                });
                this.CodeMirror.on("change", function () {
                    code.innerHTML = that.CodeMirror.getValue();
                });
            });
        },
        xmlProcessAction: function (data) {
            var that = this;
            this.$nextTick(function () {
                var code = document.getElementById('txtActionXml');
                $('#actionXml .CodeMirror').remove();
                this.CodeMirror = CodeMirror.fromTextArea(code, {
                    mode: "xml",
                    lineNumbers: true,
                    styleActiveLine: true,
                    lineWrapping: true
                });
                this.CodeMirror.on("change", function () {
                    code.innerHTML = that.CodeMirror.getValue();
                });
            });
        },
        page: function (newVal, oldVal) {
            this.dataBind();
        }
    },
    ready: function () {
        this.dataBind();
    }
})
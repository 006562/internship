define('viewEditECContent', {
    dragsort: function(that) {
        // ecCode载入之后才可执行拖动
        var sortObj = {
            sortList: "",
            sortArea: ""
        }
        sortObj.sortList = Sortable.create($(".EC-tool")[0], {
            group: {
                name: "Parameters",
                pull: "clone",
                put: ["MetaData", "Variable"]
            },
            sort: false,
            filter: ".disDraggable",
            onStart: function(event) {
                if (event.oldIndex) {
                    $(".areaCopy").show();
                }
            },
            onEnd: function(event) {
                $(".areaCopy").hide();
                $(".EC-row input").mousedown(function(event) {
                    event.stopPropagation();
                })
            },
            onAdd: function(event) {
                //解决拖动插件放置bug，乱序插入
                var $nextLi = $(event.item).next();

                if ($(event.item).length) {
                    var listIndex = $(".dragActive").index(),
                        items = that.$root.$refs.caculation.$refs.caculationtools.data.items;
                    if (items[listIndex].filterName) {
                        itemIndex = items[listIndex].filterArr[event.oldIndex].originIndex;
                    } else {
                        itemIndex = event.oldIndex;
                    }
                    var item = items[listIndex].list[itemIndex];
                    item = _.extend({}, item, { IsEditing: false });
                    if (listIndex == 1) {
                        item.SessionParameterName = item.Name;
                        item.DataType = "double";
                    }
                    that.activeEC.Parameters.push(item);
                    $(event.item).replaceAll($(event.clone));

                    that.$nextTick(function () {
                        var params = $(".EC-tool").find('dl');
                        if (params.length > 5) { //ec 参数大于5个，则滚动到最后一个参数的位置下.
                            params.get(params.length - 1).scrollIntoView();
                        }
                    })
                } else if ($nextLi.attr("style")) {
                    $nextLi.remove();
                }

            }
        });
        sortObj.sortArea = Sortable.create($(".areaCopy")[0], {
            group: {
                pull: false,
                put: ["Parameters", "COMMON", "Operator", "Mathematical Functions", "DateTime", "Financial Functions"]
            },
            sort: false,
            onAdd: function(event) {
                //解决拖动插件放置bug，乱序插入
                var $nextDl = $(event.item).next();

                if ($(".areaCopy dl").length) {
                    var index = that.dragDlIndex,
                        viewIndex = event.oldIndex;
                    var txt = that.activeEC.Parameters[index].Name;
                    that.activeEC.Query.Equation += '  ' + txt;
                    $(".areaCopy dl").replaceAll($(event.clone));
                } else if ($nextDl.attr("style")) {
                    $nextDl.remove();
                }

                if ($(".areaCopy li").length) {
                    var bigListIndex = $(".dragActive").index(),
                        listIndex = $(event.clone).closest(".dragItem").index();
                    itemIndex = event.oldIndex,
                        items = that.$root.$refs.caculation.$refs.caculationtools.data.items;
                    var txt = items[bigListIndex].list[listIndex].list[itemIndex].Expression;

                    that.activeEC.Query.Equation += '  ' + txt;
                    $(event.item).replaceAll($(event.clone));
                }
            }
        });
        return sortObj;
    },
    assembleQueryXml: function (that) {
        var xml = "";
        var cashFlowName = that.activeEC.Query.Name;
        var queryText = that.activeEC.Query.Equation;
        var queryText = queryText.replace(new RegExp("&amp;&amp;", "g"), "&&").replace(new RegExp("&lt;", "g"), "<").replace(new RegExp("&gt;", "g"), ">");
        var paramModel = that.activeEC.Parameters;
        var paramTemp = "<Parameter Name=\"{0}\" SessionParameterName=\"{1}\" Value=\"{2}\" DataType=\"{3}\" Usage=\"{4}\" >";
        var fieldTemp = "<Field Name=\"{0}\"><Position>{{position}}</Position></Field>";
        $(paramModel).each(function (i) {
            xml += paramTemp.format(paramModel[i].Name, paramModel[i].SessionParameterName, paramModel[i].Value, paramModel[i].DataType, paramModel[i].Usage);
            if (paramModel[i].Field && paramModel[i].Field.FieldName != "") {
                xml += fieldTemp.format(paramModel[i].Field.FieldName).replace("{{position}}", paramModel[i].Field.Position);
            }
            xml += "</Parameter>";
        });
        xml = "<Parameters>" + xml + "</Parameters>";
        xml += "<Query name=\"{0}\">{1}</Query><Presentation></Presentation>".format(cashFlowName, queryText);
        xml = "<main>{0}</main>".format(xml);
        return xml;
    },
    component: function() {
        var self = this;
        var editECContent = Vue.extend({
            data: function() {
                return {
                    activeEC: {
                        "IsCheck": "",
                        "Query": {
                            "Name": "",
                            "DisplayName": "",
                            "Equation": ""
                        },
                        "Parameters": [],
                    },
                    ecCode: "",
                    sortObj: "",
                    dragDlIndex: -1,
                    sizelen: 20,
                    language:this.$root.language
                };
            },
            template: '#ecWorkTemplate',
            methods: {
                removeRow: function(index) {
                    this.activeEC.Parameters.splice(index, 1);
                },
                editRow: function(index) {
                    var Parameters = this.activeEC.Parameters[index];
                    Parameters.IsEditing = !Parameters.IsEditing;
                },
                selectDragIndex: function(index) {
                    this.dragDlIndex = index;
                },
                refresh: function() {
                    this.$parent.refreshIndex += 1;
                    this.ecCode = this.$parent.ecCode;
                },
                VerifyCriteria: function () {
                    if (!this.activeEC.Query.Name) {
                        return false;
                    }
                    var verifyXmlTemplate = "<SessionVariables><SessionVariable><Name>ECQueryName</Name><Value>$ECQueryName$</Value><DataType>nvarchar(max)</DataType><IsConstant>1</IsConstant><IsKey>0</IsKey><KeyIndex>2</KeyIndex></SessionVariable>" +
                                "<SessionVariable>" +
                                    "<Name>ECXmlScript</Name>" +
                                    "<Value><![CDATA[<Methods>$SessionVariableValue$</Methods>]]></Value>" +
                                    "<DataType>nvarchar(max)</DataType>" +
                                    "<IsConstant>1</IsConstant>" +
                                    "<IsKey>0</IsKey>" +
                                    "<KeyIndex>2</KeyIndex>" +
                                "</SessionVariable>" +
                                "<SessionVariable><Name>StartPeriod</Name><Value>0</Value><DataType>nvarchar(max)</DataType><IsConstant>1</IsConstant><IsKey>0</IsKey><KeyIndex>2</KeyIndex></SessionVariable>" +
                                "<SessionVariable><Name>EndPeriod</Name><Value>1</Value><DataType>nvarchar(max)</DataType><IsConstant>1</IsConstant><IsKey>0</IsKey><KeyIndex>2</KeyIndex></SessionVariable>" +
                            "</SessionVariables>";
                    var methodName = this.activeEC.Query.Name;
                    var sXml = self.assembleQueryXml(this);

                    var verifyXmlValue = verifyXmlTemplate.replace("$SessionVariableValue$", sXml);
                    verifyXmlValue = verifyXmlValue.replace('$ECQueryName$', methodName).replace(/\n/g, "");

                    var sContext = "{'appDomain':'Cashflow'," +
                     "'sessionVariables':'" + verifyXmlValue + "'," +
                     "'taskCode':'CashFlowECVerify'" +
                     "}";
                    webProxy.createSessionPostByTaskCode(sContext, function (response){
                        isSessionCreated = true;
                        sessionID = response;
                        taskCode = "CashFlowECVerify";
                        IndicatorAppDomain = "Cashflow";
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
                },
                saveCriteria: function() {
                    var that = this;
                    var operator = this.$parent.operator;
                    var appDomain = this.$root.appDomain;
                    var taskcode = this.$root.$refs.task.taskCode;
                    var newCriteriaCode = this.ecCode;
                    var oldCriteriaCode = this.$parent.ecCode;
                    var criteriaXml = dataProcess.ecModelToXml(this.$parent.$refs.ecmethods.ecModel);
                    webProxy.saveCriteria(appDomain, operator, taskcode,newCriteriaCode, oldCriteriaCode, criteriaXml, function (response) {
                        if (response) {
                            that.$parent.ecCode = that.ecCode;
                            that.$parent.refreshCode = that.ecCode;
                            that.$parent.operator = config.status.e_update;
                            alert("saved successfuly.");
                        } else {
                            alert("save CriteriaXml error.");
                        }
                    });
                },
                showECXML: function() {
                    var that = this;
                    var ecModel = this.$parent.$refs.ecmethods.ecModel;
                    var ecXml = dataProcess.ecModelToXml(ecModel);
                    this.$parent.$refs.editecxml.ecXml = dataProcess.formatXml(ecXml);
                    //this.$parent.$refs.editecxml.ecXml = ecXml;
                    this.$parent.$refs.editecxml.showXml = true;
                },
                txtTrim: function(event) {
                    var str = $(event.target).val().trim();
                    this.$nextTick(function() {
                        $(event.target).val(str);
                    });
                }
            },
            watch: {
                activeEC: function(newActiveEC) {
                    var editSortObj = this.sortObj;
                    if (editSortObj.sortList) {
                        editSortObj.sortList.destroy();
                    }
                    var that = this;
                    this.sortObj = self.dragsort(that);
                },
                ecCode: function(newvalue) {
                    if (newvalue) {
                        this.sizelen = newvalue.length + 5;
                    }
                    if (newvalue == '') {
                        this.sizelen = 20;
                    }
                },
                'activeEC.Parameters': {
                    handler: function(newvalue) {
                        var newvalueNames = [];
                        newvalue.forEach(function(value, index) {
                            newvalueNames.push(value.Name);
                        })
                        $(".editArea").atwho("destroy");
                        $(".editArea").atwho({
                            at: "@",
                            displayTpl: "<li>${name}</li>",
                            insertTpl: "${name}",
                            limit: 50,
                            data: newvalueNames
                        });
                    },
                    deep: true
                }
            }
        });
        return editECContent;
    }
});

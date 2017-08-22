/**
 *	WorkFlow Displayer
 *
 *	Based on d3-min.js V3.5.17
 *	Doucment http://www.d3js.org
 */
(function () {
    var objId = getRequest().objId;
    var objType = getRequest().objType;
    var currentWorkFlowCode = null;

    (objId && objType) ? webProxy.getWorkflowCortrolActions("Monitor", objId, objType, controlTask) : alert('缺少参数');

    function controlTask(data) {

        var container = document.getElementById('workflow');

        var createdNode = function (nodeId, nodeName, state) {
            var div = document.createElement('div');
            var innerHtml = '<div class="taskProgress ' + state + '">' +
								'<div class="taskText">' +
									'<div class="taskName">' + nodeName + '</div>' +
								'</div>' +
							'</div>' +
							'<svg class="svg" width="1130"><g/></svg>';
            div.id = nodeId;
            div.className = 'section';
            div.innerHTML = innerHtml;
            var node = document.getElementById(nodeId);
            (node) ? node.firstChild.className = 'taskProgress '+state : container.appendChild(div);
            return div;
        }

        for (i in data) {
            if (data[i].CodeDictionaryCode == 'Pending' || data[i].CodeDictionaryCode == 'Running') {
                currentWorkFlowCode = data[i].WorkflowCode;
                break;
            }
        }

        data.forEach(function (row, index) {

            var node = d3.select(createdNode('control-' + index, row.ProcessActionName, row.CodeDictionaryCode));

            getCurrentWorkflowStates(index, row, renderWorkFlow);

            node.select('.taskProgress').on('click', function () {
                var parentNode = this.parentNode;
                if (parentNode.classList.contains('toggle')) {
                    parentNode.classList.remove('toggle');
                } else {
                    parentNode.classList.add('toggle');
                }
            })
        });
    }

    function renderWorkFlow(workFlowCode, WorkFlowState, index, data) {

        var svg = d3.select('#control-' + index).select('.svg'),
			inner = svg.select("g");

        inner.selectAll("*").remove();

        var g = new dagreD3.graphlib.Graph().setGraph({
            nodesep: 160,
            edgesep: 2 // -5 靠拢
        });

        var nodeStatusColor = function (IsActive) {
            if (currentWorkFlowCode == workFlowCode) {
                return (IsActive) ? 'fill:#f3eb90' : 'fill:#dcdcdc'
            } else if (WorkFlowState == 'Success') {
                return 'fill:#c8e8af';
            }
        }

        data.forEach(function (row) {

            g.setNode(row.States, {
                shape: row.States.match(/_[end|back]/gi) ? "ellipse" : "rect",
                label: row.AliasValue,
                id: row.States,
                style: nodeStatusColor(row.IsActive),
                paddingLeft: 20,
                paddingRight: 20,
                active: row.IsActive
                //labelStyle: "stroke: #fff"
            });
        });

        var setEdges = function (edge) {

            edge.forEach(function (row) {
                g.setEdge(row.SourceState, row.TargetState, { label: row.AliasValue, labelpos: 'c' });
            });

            g.nodes().forEach(function (v) {
                var node = g.node(v);
                node.rx = node.ry = 3;
            });

            new dagreD3.render()(inner, g);

            svg.selectAll("g.node").on("click", function (id) {
                var IsActive = d3.select(this).attr('data-active');
                if (currentWorkFlowCode == workFlowCode && IsActive) {
                    var currentUser = RoleOperate.cookieName();
                    if (currentUser) {
                        RoleOperate.GetRolesPermissionByUserName(currentUser, function (r) {
                            var stateCode = [];
                            r.forEach(function (i) {
                                stateCode.push(i.CodeDictionaryCode);
                            });
                            if ($.inArray(id, stateCode) >= 0) {
                                var url = location.protocol + "//" + location.host + "/WorkflowEngine/Pages/workflowApproval.html";
                                url += "?objId=" + objId + "&objType=" + objType + "&workFlowCode=" + workFlowCode;
                                openPopupWindow(url, 400, 250);
                            } else {
                                alert("你没有该操作权限!");
                                //alertMsg("你没有审核权限!", 1);
                            }
                        });
                    } else {
                        var url = location.protocol + "//" + location.host + "/WorkflowEngine/Pages/workflowApproval.html";
                        url += "?objId=" + objId + "&objType=" + objType + "&workFlowCode=" + workFlowCode;
                        openPopupWindow(url, 400, 250);
                    }
                }
            });

            var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
            inner.attr("transform", "translate(" + xCenterOffset + ", 40)");
            svg.attr("height", g.graph().height + 100);
        }

        webProxy.getWorkFlowTransitonByWorkFlowCode(workFlowCode, setEdges);

    }
    function getCurrentWorkflowStates(index, row, callback) {
        var WorkFlowCode = row.WorkflowCode,
            VariableName = row.WorkflowStatusVariableName,
            WorkFlowState = row.CodeDictionaryCode;
        webProxy.getCurrentWorkflowStates(objId, objType, WorkFlowCode, VariableName, WorkFlowState, function (response) {
            callback(WorkFlowCode, WorkFlowState, index, response);
        })
    }
    function renderDisplayer() {
        webProxy.getWorkflowCortrolActions("Monitor", objId, objType, controlTask);
    }
    window.renderDisplayer = renderDisplayer;
})();
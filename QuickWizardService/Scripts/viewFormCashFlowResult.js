viewFormCashFlowResult = function (appDomain, sessionId, taskCode) {
    var CashFlowStudioServiceBase = location.protocol + "//" + location.host + "/TaskProcessServices/CashFlowStudioService.svc/jsAccessEP/";
    var viewTemplate = "<div id=\"divResultTable\" style='marging:0;padding:0;'></div>" +
                       "<div id='divMsg' style='display:none'></div>";
    var resultResponse;
    var cardOriginData = [[]];
    var cashFlowDataList = [[]];
    var cashFlowDataListForCustomChart = [[]];
    var cashFlowNameList=[];
    var cashFlowPeriodList=[];
    var currentChartType = "column";
    var currentChartTypeName = "柱状图";
    var baseConfig = {
        subtitle: 'cashflow',
        ytitle: '值',
        valueSuffix: ''
    };
    var rollLeft = 0;
    var indexSet = [];
    var splineChecked = [];
    var columnChecked = [];
    var areaChecked = [];
    var scatterChecked = [];
    var stackedChecked = [];
    var cardIndexSet = [];
    var cardRollTop = 0;
    var IsFirstChart = true;
    var IsFirstCard = true;
    var IsFirstGrid = true;

    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
        });
    };

    var setCardGlobalVariable = function (response) {
        cardOriginData = new Array();
        if (response != "" && response != undefined) {
            for (var i = 0; i < response.length; i++) {
                cardOriginData.push([response[i].ItemName, response[i].ItemValue]);
            }
        }
    }

    var setGlobalVariable = function (response) {
        resultResponse = response;
        cashFlowDataList = new Array();
        cashFlowDataListForCustomChart = new Array();
        cashFlowNameList=new Array();
        cashFlowPeriodList=new Array();
        if (response != "" && response != undefined) {
            for (var i = 0; i < response.length; i++) {
                var objItemValue = response[i].ItemValue;
                var sName = response[i].ItemName;
                if (sName != "DateIndex") {
                    var arrData = new Array();
                    for (var j = 0; j < objItemValue.length; j++) {
                        if (objItemValue[j] == "") {
                            arrData.push(0);
                        } else {
                            arrData.push(parseFloat(objItemValue[j].replace(/,/gm, "")));
                        }
                    }
                    cashFlowDataList.push({ name: sName, data: arrData, visible: false });
                    cashFlowDataListForCustomChart.push({ name: sName, data: arrData });
                    cashFlowNameList.push(sName);
                }
                else {
                    for (var j = 0; j < objItemValue.length; j++) {
                        cashFlowPeriodList.push(objItemValue[j]);
                    }
                }
            }
            cashFlowDataList.push({ name: "全选", data: "", visible: false });
            if (cashFlowPeriodList.length == 0) {
                for (var j = 0; j < cashFlowDataList[0].data.length; j++) {
                    cashFlowPeriodList.push(j + "期");
                }
            }
        };
    }

    var printSampleChart = function () {
        var chart2 = {
            chart: {
                ignoreHiddenSeries: false,
                type: currentChartType,
                animation: false
            },
            colors: [
                "#7cb5ec", "#f7a35c", "#90ee7e", "#7798BF", "#aaeeee",
                "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF",
                "#aaeeee", "#0000ff", "#980000", "#ff0000", "#00ff00",
                "#00ffff", "#9900ff", "#ff9900", "#1c4587", "#3c78d8",
                "#a2c4c9", "#9fc5e8", "#ea9999", "#f1c232", "#a64d79",
                "#e69138", "#274e13", "#6aa84f", "#e6b8af"
            ],
            plotOptions: {
                spline: {
                    lineWidth: 2,
                    states: {
                        hover: {
                            lineWidth: 2
                        }
                    },
                    marker: {
                        enabled: false,
                        radius: 1
                    }
                }
            },
            title: {
                text: currentChartTypeName,
                style: {
                    fontWeight: 'bold'
                }
            },
            xAxis: {
                categories: cashFlowPeriodList,
                crosshair: true
            },
            yAxis: [{
                title: {
                    text: baseConfig.ytitle
                }
            }],
            legend: {
                x: 30
            },
            credits: {
                enabled: false
            },
            tooltip: {
                valueSuffix: baseConfig.valueSuffix,
            },
            series: cashFlowDataListForCustomChart
        };
        $('#chinabond_chart2').highcharts(chart2);
    }

    var printChart = function () {
        var chart1 = {
            chart: {
                type: currentChartType,
                animation: false
            },
            colors: [
                "#7cb5ec", "#f7a35c", "#90ee7e", "#7798BF", "#aaeeee",
                "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF",
                "#aaeeee", "#0000ff", "#980000", "#ff0000", "#00ff00",
                "#00ffff", "#9900ff", "#ff9900", "#1c4587", "#3c78d8",
                "#a2c4c9", "#9fc5e8", "#ea9999", "#f1c232", "#a64d79",
                "#e69138", "#274e13", "#6aa84f", "#e6b8af"
            ],
            plotOptions: {
                series: {
                    events: {
                        legendItemClick: function () {
                            var oneSeries = $("#chinabond_chart1").highcharts().series;
                            if (this.index == oneSeries.length - 1) {
                                if (this.visible) {
                                    for (var i = 0; i < oneSeries.length-1; i++) {
                                        oneSeries[i].hide();
                                    }
                                } else {
                                    for (var i = 0; i < oneSeries.length-1; i++) {
                                        oneSeries[i].show();
                                    }
                                }
                            }
                        }
                    }
                },
                spline: {
                    lineWidth: 2,
                    states: {
                        hover: {
                            lineWidth: 2
                        }
                    },
                    marker: {
                        enabled: false,
                        radius: 1
                    }
                }
            },
            title: {
                text: currentChartTypeName,
                style: {
                    fontWeight: 'bold'
                }
            },
            xAxis: {
                categories: cashFlowPeriodList,
                crosshair: true
            },
            yAxis: [{
                title: {
                    text: baseConfig.ytitle
                }
            }],
            legend: {
                x: 30
            },
            credits: {
                enabled: false
            },
            tooltip: {
                valueSuffix: baseConfig.valueSuffix,
            },
            series: cashFlowDataList
        };

        $('#chinabond_chart1').highcharts(chart1);
    }

    function chartObj(needData) {
        var chart = {
            chart: {
                animation: false
            },
            title: {
                text: needData.title,
                style: {
                    fontWeight: 'bold'
                }
            },
            colors: [
                "#7cb5ec", "#f7a35c", "#90ee7e", "#7798BF", "#aaeeee",
                "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF",
                "#aaeeee", "#0000ff", "#980000", "#ff0000", "#00ff00",
                "#00ffff", "#9900ff", "#ff9900", "#1c4587", "#3c78d8",
                "#a2c4c9", "#9fc5e8", "#ea9999", "#f1c232", "#a64d79",
                "#e69138", "#274e13", "#6aa84f", "#e6b8af"
            ],
            plotOptions: {
                spline: {
                    lineWidth: 2,
                    states: {
                        hover: {
                            lineWidth: 2
                        }
                    },
                    marker: {
                        enabled: false,
                        radius: 1
                    }
                },
                column: {
                    stacking: 'normal'
                },
                area: {
                    lineWidth: 2,
                    states: {
                        hover: {
                            lineWidth: 2
                        }
                    },
                    marker: {
                        enabled: true,
                        radius: 2
                    }
                },
                scatter: {
                    marker: {
                        enabled: true,
                        radius: 3
                    }
                }
            },

            legend: {
                x: 30
            },
            xAxis: {
                categories: cashFlowPeriodList
            },
            yAxis: [{
                title: {
                    text: baseConfig.ytitle
                }
            }],
            credits: {
                enabled: false
            },
            tooltip: {
                valueSuffix: needData.valueSuffix,
            },
            series: needData.series
        };
        return chart;
    }
    
    var showRusultsInGridAndChart = function (response) {
        setGlobalVariable(response);
        printChart();
        //showCharSetCheckBox();
        getTaskChartByTaskCode(appDomain, taskCode, "Chart", loadTaskCharts);        
    }

    var showCaculateResult = function (response) {
        setCardGlobalVariable(response);
        showCardSetCheckBox();
    }

    var showCharSetCheckBox = function () {
        var content = "<table><tr>";
        for (var j = 0; j < cashFlowNameList.length; j++) {
            content += '<td><label><input type="checkbox" class="checkbox checkOp" value=' + j + '>&nbsp;' + cashFlowNameList[j] + '</label></td>';
            if (j + 1 == cashFlowNameList.length) {
                if (j % 3 == 0) {
                    content += "<td></td><td></td></tr></table>";
                } else if (j % 3 == 1) {
                    content += "<td></td></tr></table>";
                } else {
                    content += "</tr></table>";
                }
            } else {
                if (j % 3 == 2) {
                    content += "</tr><tr>";
                }
            }
        }
        $(".opBox").append(content);
    }

    var showCardSetCheckBox = function () {
        var content = "<table><tr>";
        for (var j = 0; j < cardOriginData.length; j++) {
            content += '<td><label><input type="checkbox" class="checkbox cardCheckOp" value=' + j + '>&nbsp;' + cardOriginData[j][0] + '</label></td>';
            if (j + 1 == cardOriginData.length) {
                if (j % 2 == 0) {
                    content += "<td></td></tr></table>";
                } else {
                    content += "</tr></table>";
                }
            } else {
                if (j % 2 == 1) {
                    content += "</tr><tr>";
                }
            }
        }
        $(".cardOpBox").append(content);
    }

    var checkedChange = function () {
        var selectType = $(".changeOp span.active").attr("id");
        var tempChecked = [];
        $(".checkOp:checked").each(function () {
            var index = $(this).val();
            tempChecked.push(index);
        });
        switch (selectType) {
            case ("spline"):
                splineChecked = tempChecked;
                break;
            case ("column"):
                columnChecked = tempChecked;
                break;
            case ("area"):
                areaChecked = tempChecked;
                break;
            case ("scatter"):
                scatterChecked = tempChecked;
                break;
            case ("stacked"):
                stackedChecked = tempChecked;
                break;
            default:
                splineChecked = tempChecked;
        }
        showCheckString();
    }

    var showCheckString = function () {
        var content = "";
        if (splineChecked.length > 0) {
            content += "<span style='color:#3987CC'>曲线图：</span>";
            for (var i = 0; i < splineChecked.length; i++) {
                content += cashFlowNameList[parseInt(splineChecked[i])] + ";";
            }
            content += "</br>";
        }
        if (columnChecked.length > 0) {
            content += "<span style='color:#3987CC'>柱状图：</span>";
            for (var i = 0; i < columnChecked.length; i++) {
                content += cashFlowNameList[parseInt(columnChecked[i])] + ";";
            }
            content += "</br>";
        }
        if (areaChecked.length > 0) {
            content += "<span style='color:#3987CC'>区域图：</span>";
            for (var i = 0; i < areaChecked.length; i++) {
                content += cashFlowNameList[parseInt(areaChecked[i])] + ";";
            }
            content += "</br>";
        }
        if (scatterChecked.length > 0) {
            content += "<span style='color:#3987CC'>散列图：</span>";
            for (var i = 0; i < scatterChecked.length; i++) {
                content += cashFlowNameList[parseInt(scatterChecked[i])] + ";";
            }
            content += "</br>";
        }
        if (stackedChecked.length > 0) {
            content += "<span style='color:#3987CC'>堆叠图：</span>";
            for (var i = 0; i < stackedChecked.length; i++) {
                content += cashFlowNameList[parseInt(stackedChecked[i])] + ";";
            }
            content += "</br>";
        }
        $("#divSelected").empty();
        $("#divSelected").append(content);
    }

    var loadTaskCards = function (response) {
        if (response != "") {
            var cardsXml = $.parseXML(response);
            $(cardsXml).find("Card").each(function (key, value) {
                var boxIndex = $(this).text().split(";");
                cardIndexSet.push(boxIndex);
            })
            printCustomCards();
        }
    }

    var printCustomCards = function () {
        if (cardIndexSet.length > 0) {
            $(".cardSetChart").removeClass("show");
            $(".cardWrap").addClass("show");
        }
        for (var i = 0; i < cardIndexSet.length; i++) {
            $("#cardsView").append('<div class="card"><div class="card-list"></div><div class="card-more"><button class="btn prev"><i class="icon-up-open"></i></button><button class="btn back"><i class="icon-down-open"></i></button></div></div>');
            var index = parseInt(cardIndexSet[i][0]);
            for (var j = 1; j < cardIndexSet[i].length; j++) {
                if (cardIndexSet[i][j] < cardOriginData.length) {
                    $(".cardWrap .card .card-list:last").append(
                        '<dl class="card-box col-' + (index + 1) + '"><dt>' +
                        cardOriginData[cardIndexSet[i][j]][1] + '</dt><dd>' + cardOriginData[cardIndexSet[i][j]][0] + '</dd></dl>'
                    )
                }
            }
            $(".card:last").mousedown(function (event) {
                if (event.which == 3) {
                    $(".card").removeClass("active");
                    $(this).addClass("active");
                    //禁止windows系统右键弹出菜单
                    document.oncontextmenu = function () {
                        return false;
                    }
                    var siteX = event.pageX - $(".cardWrap").offset().left + 17 + 'px',
                        siteY = event.pageY - $(".cardWrap").offset().top + $(".cardWrap").scrollTop() + 15 + 'px';
                    $(".cardRightBtn").css({ left: siteX, top: siteY });
                }
            })

            if ($(".card-list:last").height() > $(".card:last").height()) {
                $(".back:last").width("100%").show();
            }
            $(".prev:last").click(function () {
                $(".prev").removeClass("active");
                $(this).addClass("active");
                var cardList = $(this).closest(".card").children(".card-list");
                cardList.animate({ "top": "+=219px" }, function () {
                    $(".prev.active")
                        .width("50%")
                        .siblings('.back')
                        .width("50%")
                        .show();

                    if (cardList.position().top >= 0) {
                        $(".prev.active").hide();
                        $(".prev.active").siblings('.back').width("100%");
                    }
                });
            });

            $(".back:last").click(function () {
                $(".back").removeClass("active");
                $(this).addClass("active");
                var cardList = $(this).closest(".card").children(".card-list");
                cardList.animate({ "top": "-=219px" }, function () {
                    $(".back.active")
                        .width("50%")
                        .siblings('.prev')
                        .width("50%")
                        .show();
                    if (cardList.height() + cardList.position().top <= $(this).closest(".card").height()) {
                        $(".back.active").hide();
                        $(".back.active").siblings('.prev').width("100%");
                    }
                });
            });
        }
    }

    var loadTaskCharts = function (response) {
        if (response != "") {
            var chartsXml = $.parseXML(response);
            $(chartsXml).find("Chart").each(function (key, value) {
                var boxIndex = [[$(this).attr("Title")]];
                var splineStr = ($($(this).find("spline"))).text() == null ? "" : ($($(this).find("spline"))).text();
                var columnStr = ($($(this).find("column"))).text() == null ? "" : ($($(this).find("column"))).text();
                var areaStr = ($($(this).find("area"))).text() == null ? "" : ($($(this).find("area"))).text();
                var scatterStr = ($($(this).find("scatter"))).text() == null ? "" : ($($(this).find("scatter"))).text();
                var stackedStr = ($($(this).find("stacked"))).text() == null ? "" : ($($(this).find("stacked"))).text();
                if (splineStr != "") {
                    boxIndex.push(splineStr.split(";"));
                } else {
                    boxIndex.push([]);
                }
                if (columnStr != "") {
                    boxIndex.push(columnStr.split(";"));
                } else {
                    boxIndex.push([]);
                }
                if (areaStr != "") {
                    boxIndex.push(areaStr.split(";"));
                } else {
                    boxIndex.push([]);
                }
                if (scatterStr != "") {
                    boxIndex.push(scatterStr.split(";"));
                } else {
                    boxIndex.push([]);
                }
                if (stackedStr != "") {
                    boxIndex.push(stackedStr.split(";"));
                } else {
                    boxIndex.push([]);
                }
                indexSet.push(boxIndex);
            });
            printCustomCharts();
        }
    }

    var printCustomCharts = function () {
        if (indexSet.length > 0) {
            $(".setChart").removeClass("show");
            $(".chartWrap").addClass("show");
        }
        for (var i = 0; i < indexSet.length; i++) {
            splineChecked = indexSet[i][1];
            columnChecked = indexSet[i][2];
            areaChecked = indexSet[i][3];
            scatterChecked = indexSet[i][4];
            stackedChecked = indexSet[i][5];
            var needData = {
                title: indexSet[i][0],
                series: function () {
                    var series = [];
                    if (splineChecked.length > 0) {
                        for (var i = 0; i < splineChecked.length; i++) {
                            if (parseInt(splineChecked[i]) < cashFlowDataListForCustomChart.length) {
                                cashFlowDataListForCustomChart[parseInt(splineChecked[i])].type = "spline";
                                series.push(cashFlowDataListForCustomChart[parseInt(splineChecked[i])]);
                            }
                        }
                    }
                    if (columnChecked.length > 0) {
                        for (var i = 0; i < columnChecked.length; i++) {
                            if (parseInt(columnChecked[i]) < cashFlowDataListForCustomChart.length) {
                                cashFlowDataListForCustomChart[parseInt(columnChecked[i])].type = "column";
                                series.push(cashFlowDataListForCustomChart[parseInt(columnChecked[i])]);
                            }
                        }
                    }
                    if (areaChecked.length > 0) {
                        for (var i = 0; i < areaChecked.length; i++) {
                            if (parseInt(areaChecked[i]) < cashFlowDataListForCustomChart.length) {
                                cashFlowDataListForCustomChart[parseInt(areaChecked[i])].type = "area";
                                series.push(cashFlowDataListForCustomChart[parseInt(areaChecked[i])]);
                            }
                        }
                    }
                    if (scatterChecked.length > 0) {
                        for (var i = 0; i < scatterChecked.length; i++) {
                            if (parseInt(scatterChecked[i]) < cashFlowDataListForCustomChart.length) {
                                cashFlowDataListForCustomChart[parseInt(scatterChecked[i])].type = "scatter";
                                series.push(cashFlowDataListForCustomChart[parseInt(scatterChecked[i])]);
                            }
                        }
                    }
                    if (stackedChecked.length > 0) {
                        for (var i = 0; i < stackedChecked.length; i++) {
                            if (parseInt(stackedChecked[i]) < cashFlowDataListForCustomChart.length) {
                                cashFlowDataListForCustomChart[parseInt(stackedChecked[i])].type = "column";
                                cashFlowDataListForCustomChart[parseInt(stackedChecked[i])].stack = 0;
                                series.push(cashFlowDataListForCustomChart[parseInt(stackedChecked[i])]);
                            }
                        }
                    }
                    return series;
                }()
            }
            $("#chartsView")
            .append('<div class="chart"></div>')
            .children()
            .last()
            .highcharts(chartObj(needData));
        }
        splineChecked = [];
        columnChecked = [];
        areaChecked = [];
        scatterChecked = [];
        stackedChecked = [];
    }

    var assemTaskCardXml = function () {
        var cardsXml = "";
        var cardXmlTemplate = "<Card>{0}</Card>";
        for (var i = 0; i < cardIndexSet.length; i++) {
            cardsXml += "<Card>{0}</Card>".format(cardIndexSet[i].join(";"));
        }
        cardsXml = "<Cards>{0}</Cards>".format(cardsXml);
        return cardsXml;
    }

    var assemTaskChartXml = function () {
        var chartsXml = "";
        var chartXmlTemplate = '<Chart Title="{0}"><spline>{1}</spline><column>{2}</column><area>{3}</area><scatter>{4}</scatter><stacked>{5}</stacked></Chart>';
        for (var i = 0; i < indexSet.length; i++) {
            var tempChart = indexSet[i];
            var splineStr = "";
            for (var j = 0; j < tempChart[1].length; j++) {
                splineStr += tempChart[1][j] + ";";
            }
            if (splineStr != "") {
                splineStr = splineStr.substr(0, splineStr.length - 1);
            }
            var columnStr = "";
            for (var j = 0; j < tempChart[2].length; j++) {
                columnStr += tempChart[2][j] + ";";
            }
            if (columnStr != "") {
                columnStr = columnStr.substr(0, columnStr.length - 1);
            }
            var areaStr = "";
            for (var j = 0; j < tempChart[3].length; j++) {
                areaStr += tempChart[3][j] + ";";
            }
            if (areaStr != "") {
                areaStr = areaStr.substr(0, areaStr.length - 1);
            }
            var scatterStr = "";
            for (var j = 0; j < tempChart[4].length; j++) {
                scatterStr += tempChart[4][j] + ";";
            }
            if (scatterStr != "") {
                scatterStr = scatterStr.substr(0, scatterStr.length - 1);
            }
            var stackedStr = "";
            for (var j = 0; j < tempChart[5].length; j++) {
                stackedStr += tempChart[5][j] + ";";
            }
            if (stackedStr != "") {
                stackedStr = stackedStr.substr(0, stackedStr.length - 1);
            }
            chartsXml += chartXmlTemplate.format(tempChart[0], splineStr, columnStr, areaStr, scatterStr, stackedStr);
        }
        chartsXml = "<Charts>{0}</Charts>".format(chartsXml);
        return chartsXml;
    }

    var saveProcessTaskChart = function (appDomain, taskCode, chartType, taskChartXml) {
        var serviceUrl = CashFlowStudioServiceBase + "SaveProcessTaskChart/" + appDomain + "/" + taskCode + "/" + chartType + "?r=" + Math.random() * 150;

        $.ajax({
            type: "POST",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/xml;charset=utf-8",
            data: taskChartXml,
            success: function (response) {
                alert("Successfully saved.");
            },
            error: function (response) {
                alert("save ProcessTaskChart objects error.");
            }
        });
    }

    var getTaskChartByTaskCode = function (appDomain, code, chartType, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "GetTaskChartByTaskCode/" + appDomain + "/" + code + "/" + chartType + "?r=" + Math.random() * 150;
        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) { alert(response.documentElement.outerHTML); }
        });
    };

    var getCashFlowRunCaculateResult = function (appDomain, sessionId, callback) {
        var serviceUrl = CashFlowStudioServiceBase + "GetCashFlowRunCaculateResultBySessionId/" + appDomain + "/" + sessionId + "?r=" + Math.random() * 150;;

        $.ajax({
            type: "GET",
            url: serviceUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                callback(response);
            },
            error: function (response) {
                alert("load CaskFlow run caculate result error.");
            }
        });
    }

    var loadPage = function () {
        if (sessionId != "") {
            //getCashFlowRunCaculateResult(appDomain, sessionId, showCaculateResult);
            getCaskFlowRunResultBySessionId(appDomain, sessionId, showRusultsInGridAndChart);
        }
    }

    var regisUiEvents = function () {
        loadPage();
		if (sessionId != ""){
		
			if (IsFirstChart) {
				printChart();
				IsFirstChart = false;
			}
			
		}
    
        //切换图形
        $(".radioChart").change(function () {
            if ($(this).val() == 1) {
                currentChartType = "column";
                //currentChartTypeName = "柱状图";
            } else {
                currentChartType = "spline";
                //currentChartTypeName = "曲线图";
            }
            printChart();
        });

        $("#add").click(function () {
            $(".setChart").addClass("show");
            if ($(".chart.active.editting").length) {
                $(".chartChangeTip").text("图形编辑");
            } else {
                $(".chartChangeTip").text("图形配置");
            }
            $(".chartWrap").removeClass("show");
            $(".rightBtn").css({ left: -9999 + "px", top: "auto" });
        })

        $("#cardAdd").click(function () {
            $(".cardSetChart").addClass("show");
            if ($(".card.active.editting").length) {
                $(".changeTip").text("卡片编辑");
            } else {
                $(".changeTip").text("卡片配置");
            }
            $(".cardWrap").removeClass("show");
            $(".cardRightBtn").css({ left: -9999 + "px", top: "auto" });
        })

        $("#refresh").click(function () {
            $(".chartWrap .chart").remove();
            indexSet = [];
            getTaskChartByTaskCode(appDomain, taskCode,"Chart", loadTaskCharts);
        })

        $("#cardRefresh").click(function () {
            $(".cardWrap .card").remove();
            cardIndexSet = [];
            getTaskChartByTaskCode(appDomain, taskCode, "Card", loadTaskCards);
        })

        $("#save").click(function () {
            saveProcessTaskChart(appDomain, taskCode, "Chart", assemTaskChartXml());
        })

        $("#cardSave").click(function () {
            saveProcessTaskChart(appDomain, taskCode, "Card", assemTaskCardXml());
        })

        $(".close").click(function () {
            $(".cancel").trigger("click");
        })

        $(".cardClose").click(function () {
            $(".cardCancel").trigger("click");
        })

        $(".cardChangeOp span").click(function () {
            $(".cardChangeOp span").removeClass("active");
            $(this).toggleClass("active");
        })

        $(".changeOp span").click(function () {
            $(".changeOp span").removeClass("active");
            $(this).toggleClass("active");
            $(".opBox .checkOp").prop("checked", false);
            var tempChecked = [];
            switch ($(this).attr("id")) {
                case ("spline"):
                    tempChecked = splineChecked;
                    break;
                case ("column"):
                    tempChecked = columnChecked;
                    break;
                case ("area"):
                    tempChecked = areaChecked;
                    break;
                case ("scatter"):
                    tempChecked = scatterChecked;
                    break;
                case ("stacked"):
                    tempChecked = stackedChecked;
                    break;
                default:
                    tempChecked = splineChecked;
            }
            for (var i = 0; i < tempChecked.length; i++) {
                $(".opBox .checkOp").eq(parseInt(tempChecked[i])).prop("checked", true);
            }
            if ($(".checkOp:checked").length == $(".checkOp").length) {
                $(".checkAll").prop("checked", true);
            } else {
                $(".checkAll").prop("checked", false);
            }
        })
                
        $(".cancel").click(function () {
            $(".chart.active.editting").removeClass('editting');
            $(".changeOp span").removeClass("active");
            $("#spline").addClass("active");
            $(".opBox .checkbox").prop("checked", false);
            $(".setChart .tip").hide();
            $(".setChart").removeClass("show");
            if ($(".chart").length) {
                $(".chartWrap").addClass("show");
            }
            $("#txtTitle").val("");
            splineChecked = [];
            columnChecked = [];
            areaChecked = [];
            scatterChecked = [];
            stackedChecked = [];
            $("#divSelected").empty();
        })

        $(".cardCancel").click(function () {
            $(".card.active.editting").removeClass('editting');
            $(".cardChangeOp span").removeClass("active");
            $("#one").addClass("active");
            $(".cardOpBox .checkbox").prop("checked", false);
            $(".cardCheckAll").prop("checked", false);
            $(".cardSetChart .tip").hide();
            $(".cardSetChart").removeClass("show");
            if ($(".card").length) {
                $(".cardWrap").addClass("show");
            }
        })

        $("#actionGroupArror").live("click", function () {
            if ($(this).attr("class") == "icons triangle-1-e")
                $(this).attr("class", "icons triangle-1-se");
            else
                $(this).attr("class", "icons triangle-1-e");

            $(this).parent().find("ul").each(function (key, value) {
                $(this).toggle();
            })
        });

        $(".checkAll").live("click", function () {
            if ($(this).prop("checked")) {
                $(".checkOp").prop("checked", true);
            } else {
                $(".checkOp").prop("checked", false);
            }
            checkedChange();
        })

        $(".cardCheckAll").click(function () {
            if ($(this).prop("checked")) {
                $(".cardCheckOp").prop("checked", true);
            } else {
                $(".cardCheckOp").prop("checked", false);
            }
        })

        $(".checkOp").live("click", function () {
            if ($(".checkOp:checked").length == $(".checkOp").length) {
                $(".checkAll").prop("checked", true);
            } else {
                $(".checkAll").prop("checked", false);
            }
            checkedChange();
        })

        $(".cardCheckOp").click(function () {
            if ($(".cardCheckOp:checked").length == $(".cardCheckOp").length) {
                $(".cardCheckAll").prop("checked", true);
            } else {
                $(".cardCheckAll").prop("checked", false);
            }
        })

        $(".edit").click(function () {
            $(".chart.active").addClass('editting');
            $("#add").trigger("click");
            //取出某个图所勾选的现金流索引
            //alert($(".chart.active.editting").index());
            var boxIndex = indexSet[$(".chart.active.editting").index()];
            $("#txtTitle").val(boxIndex[0][0]);
            splineChecked = boxIndex[1];
            columnChecked = boxIndex[2];
            areaChecked = boxIndex[3];
            scatterChecked = boxIndex[4];
            stackedChecked = boxIndex[5];
            for (var i = 0; i < splineChecked.length; i++) {
                $(".opBox .checkOp").eq(parseInt(splineChecked[i])).prop("checked", true);
            }
            if ($(".checkOp:checked").length == $(".checkOp").length) {
                $(".checkAll").prop("checked", true);
            } else {
                $(".checkAll").prop("checked", false);
            }
            showCheckString();
        })

        $(".cardEdit").click(function () {
            cardRollTop = $(".cardWrap").scrollTop();

            $(".card.active").addClass('editting');
            $("#cardAdd").trigger("click");
            //取出某个图所勾选的债券索引
            var boxIndex = cardIndexSet[$(".card.active.editting").index()];
            $(".cardChangeOp span").removeClass("active");
            $(".cardChangeOp span").eq(boxIndex[0]).addClass("active");
            for (var n = 1; n < boxIndex.length; n++) {
                $(".cardCheckOp").eq(boxIndex[n]).prop("checked", true);
            }
            if ($(".cardCheckOp:checked").length == $(".cardCheckOp").length) {
                $(".cardCheckAll").prop("checked", true);
            }
        })

        $(".delete").click(function (event) {
            if ($(".chart.active").index() > -1) {
                indexSet.splice($(".chart.active").index(), 1);
            }

            $(".chart.active").remove();
            if (!$(".chart").length) {
                $(".chartWrap").removeClass("show");
            }
        })

        $(".cardDelete").click(function (event) {
            if ($(".card.active").index() > -1) {
                cardIndexSet.splice($(".card.active").index(), 1);
            }
            //console.log(cardIndexSet);

            $(".card.active").remove();
            if (!$(".card").length) {
                $(".cardWrap").removeClass("show");
            }
        })

        $(".chart").live("mousedown", function (event) {
            if (event.which == 3) {
                $(".chart").removeClass("active");
                $(this).addClass("active");
                //禁止windows系统右键弹出菜单
                document.oncontextmenu = function () {
                    return false;
                }
                var siteX = event.pageX - $(".chartWrap").offset().left + 17 + 'px',
                    siteY = event.pageY - $(".chartWrap").offset().top + $(".chartWrap").scrollTop() + 15 + 'px';
                $(".rightBtn").css({ left: siteX, top: siteY });
            }
        })

        $(".chartWrap").click(function (event) {
            $(".rightBtn").css({ left: -9999 + "px", top: "auto" });
        })

        $(".cardWrap").click(function (event) {
            $(".cardRightBtn").css({ left: -9999 + "px", top: "auto" });
        })

        $(".cardOk").click(function () {
            if (!$(".cardCheckOp:checked").length) {
                $(".cardSetChart .tip").show();
            } else {
                var boxIndex = [$(".cardChangeOp span.active").index()];
                //判断是编辑还是添加
                if ($(".card.active.editting").length) {
                    cardIndexSet.splice($(".card.active.editting").index(), 1, boxIndex);
                } else {
                    cardIndexSet.push(boxIndex);
                }

                var initLen = $(".card").length;
                $("#cardsView").append('<div class="card"><div class="card-list"></div><div class="card-more"><button class="btn prev"><i class="icon-up-open"></i></button><button class="btn back"><i class="icon-down-open"></i></button></div></div>');

                $(".cardCheckOp:checked").each(function () {
                    var index = $(this).val();
                    boxIndex.push(index);
                    $(".cardWrap .card .card-list:last").append(
                        '<dl class="card-box col-' + ($(".cardChangeOp span.active").index() + 1) + '"><dt>' +
                        cardOriginData[index][1] + '</dt><dd>' + cardOriginData[index][0] + '</dd></dl>'
                    )
                });

                $(".card:last").mousedown(function (event) {
                    if (event.which == 3) {
                        $(".card").removeClass("active");
                        $(this).addClass("active");
                        //禁止windows系统右键弹出菜单
                        document.oncontextmenu = function () {
                            return false;
                        }
                        var siteX = event.pageX - $(".cardWrap").offset().left + 17 + 'px',
                            siteY = event.pageY - $(".cardWrap").offset().top + $(".cardWrap").scrollTop() + 15 + 'px';
                        $(".cardRightBtn").css({ left: siteX, top: siteY });
                    }
                })

                if ($(".card-list:last").height() > $(".card:last").height()) {
                    $(".back:last").width("100%").show();
                }
                $(".prev:last").click(function () {
                    $(".prev").removeClass("active");
                    $(this).addClass("active");
                    var cardList = $(this).closest(".card").children(".card-list");
                    cardList.animate({ "top": "+=219px" }, function () {
                        $(".prev.active")
                            .width("50%")
                            .siblings('.back')
                            .width("50%")
                            .show();

                        if (cardList.position().top >= 0) {
                            $(".prev.active").hide();
                            $(".prev.active").siblings('.back').width("100%");
                        }
                    });
                });

                $(".back:last").click(function () {
                    $(".back").removeClass("active");
                    $(this).addClass("active");
                    var cardList = $(this).closest(".card").children(".card-list");
                    cardList.animate({ "top": "-=219px" }, function () {
                        $(".back.active")
                            .width("50%")
                            .siblings('.prev')
                            .width("50%")
                            .show();
                        if (cardList.height() + cardList.position().top <= $(this).closest(".card").height()) {
                            $(".back.active").hide();
                            $(".back.active").siblings('.prev').width("100%");
                        }
                    });
                });

                //如果正在编辑的话替换元素    
                $(".card:last").replaceAll(".card.active.editting");
                var finLen = $(".card").length;

                $(".cardChangeOp span").removeClass("active");
                $("#one").addClass("active");
                $(".cardOpBox .checkbox").prop("checked", false);
                $(".cardCheckAll").prop("checked", false);
                $(".cardSetChart .tip").hide();
                $(".cardSetChart").removeClass("show");
                $(".cardWrap").addClass("show");

                if (initLen != finLen && finLen > 3) {
                    $("body").scrollTop($("body")[0].scrollHeight);
                    $(".cardWrap").css({ "text-align": "left" });
                } else {
                    $("body").scrollTop(cardRollTop);
                    $(".cardWrap").css({ "text-align": "center" });
                }
            }
        })

        $(".ok").click(function () {
            if (splineChecked.length == 0 && columnChecked.length == 0 && areaChecked.length == 0 && scatterChecked.length == 0 && stackedChecked.length == 0) {
                $(".setChart .tip").show();
            } else {
                var chartTypeCount = 0;
                var needData = {
                    series: function () {
                        var series = [];
                        if (splineChecked.length > 0) {
                            for (var i = 0; i < splineChecked.length; i++) {
                                cashFlowDataListForCustomChart[parseInt(splineChecked[i])].type = "spline";
                                series.push(cashFlowDataListForCustomChart[parseInt(splineChecked[i])]);
                            }
                            chartTypeCount += 1;
                        }
                        if (columnChecked.length > 0) {
                            for (var i = 0; i < columnChecked.length; i++) {
                                cashFlowDataListForCustomChart[parseInt(columnChecked[i])].type = "column";
                                series.push(cashFlowDataListForCustomChart[parseInt(columnChecked[i])]);
                            }
                            chartTypeCount += 1;
                        }
                        if (areaChecked.length > 0) {
                            for (var i = 0; i < areaChecked.length; i++) {
                                cashFlowDataListForCustomChart[parseInt(areaChecked[i])].type = "area";
                                series.push(cashFlowDataListForCustomChart[parseInt(areaChecked[i])]);
                            }
                            chartTypeCount += 1;
                        }
                        if (scatterChecked.length > 0) {
                            for (var i = 0; i < scatterChecked.length; i++) {
                                cashFlowDataListForCustomChart[parseInt(scatterChecked[i])].type = "scatter";
                                series.push(cashFlowDataListForCustomChart[parseInt(scatterChecked[i])]);
                            }
                            chartTypeCount += 1;
                        }
                        if (stackedChecked.length > 0) {
                            for (var i = 0; i < stackedChecked.length; i++) {
                                cashFlowDataListForCustomChart[parseInt(stackedChecked[i])].type = "column";
                                cashFlowDataListForCustomChart[parseInt(stackedChecked[i])].stack = 0;
                                series.push(cashFlowDataListForCustomChart[parseInt(stackedChecked[i])]);
                            }
                            chartTypeCount += 1;
                        };
                        return series;
                    }(),
                    title: function () {
                        if ($("#txtTitle").val() == "") {
                            if (chartTypeCount > 1) {
                                return "现金流混合图";
                            } else {
                                return "现金流" + $(".changeOp span.active").attr("title");
                            }
                        } else {
                            return $("#txtTitle").val();
                        }
                    }()
                }
                var boxIndex = [[needData.title]];
                boxIndex.push(splineChecked);
                boxIndex.push(columnChecked);
                boxIndex.push(areaChecked);
                boxIndex.push(scatterChecked);
                boxIndex.push(stackedChecked);

                //判断是编辑还是添加
                if ($(".chart.active.editting").length) {
                    indexSet.splice($(".chart.active.editting").index(), 1, boxIndex);
                } else {
                    indexSet.push(boxIndex);
                }

                var initLen = $(".chart").length;
                $("#chartsView")
                    .append('<div class="chart"></div>')
                    .children()
                    .last()
                    .highcharts(chartObj(needData));

                //如果正在编辑的话替换元素    
                $(".chart:last").replaceAll(".chart.active.editting");
                var finLen = $(".chart").length;

                $(".changeOp span").removeClass("active");
                $("#spline").addClass("active");
                $(".opBox .checkbox").prop("checked", false);
                $(".checkAll").prop("checked", false);
                $("setChart .tip").hide();
                $(".setChart").removeClass("show");
                $(".chartWrap").addClass("show");
                $("#txtTitle").val("");
                splineChecked = [];
                columnChecked = [];
                areaChecked = [];
                scatterChecked = [];
                stackedChecked = [];
                $("#divSelected").empty();
                
                if (initLen != finLen) {
                    $(".chartWrap").scrollLeft($(".chartWrap")[0].scrollWidth);
                } else {
                    $(".chartWrap").scrollLeft(rollLeft);
                }
            }
        })
    };

    this.render = function (name) {
		currentChartTypeName=name;
        var content = viewTemplate;
        $("#divArrayPannel").empty();
        $("#divArrayPannel").append(content);
        postRender();
    };

    var postRender = function () {
        regisUiEvents();
    };
};



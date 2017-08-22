        $(function () {
            DateInput = (function ($) {
                function DateInput(el, opts) {
                    if (typeof (opts) != "object") opts = {};
                    $.extend(this, DateInput.DEFAULT_OPTS, opts);
                    this.input = $(el);
                    this.bindMethodsToObj("show", "hide", "hideIfClickOutside", "keydownHandler", "selectDate");
                    this.build();
                    this.selectDate();
                    this.hide()
                };
                DateInput.DEFAULT_OPTS = {
                    month_names: ["一月份", "二月份", "三月份", "四月份", "五月份", "六月份", "七月份", "八月份", "九月份", "十月份", "十一月份", "十二月份"],
                    short_month_names: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
                    short_day_names: ["日", "一", "二", "三", "四", "五", "六"],
                    start_of_week: 1
                };
                DateInput.prototype = {
                    build: function () {
                        var monthNav = $('<p class="month_nav">' + '<span class="button prev" title="[Page-Up]"><i class="icon icon-back"></i></span>' + ' <span class="month_name"></span> ' + '<span class="button next" title="[Page-Down]"><i class="icon icon-right"></i></span>' + '</p>');
                        this.monthNameSpan = $(".month_name", monthNav);
                        $(".prev", monthNav).click(this.bindToObj(function () {
                            this.moveMonthBy(-1)
                        }));
                        $(".next", monthNav).click(this.bindToObj(function () {
                            this.moveMonthBy(1)
                        }));
                        var yearNav = $('<p class="year_nav">' + '<span class="button prev" title="[Ctrl+Page-Up]"><i class="icon icon-back"></i></span>' + ' <span class="year_name"></span> ' + '<span class="button next" title="[Ctrl+Page-Down]"><i class="icon icon-right"></i></span>' + '</p>');
                        this.yearNameSpan = $(".year_name", yearNav);
                        $(".prev", yearNav).click(this.bindToObj(function () {
                            this.moveMonthBy(-12)
                        }));
                        $(".next", yearNav).click(this.bindToObj(function () {
                            this.moveMonthBy(12)
                        }));
                        var nav = $('<div class="nav"></div>').append(monthNav, yearNav);
                        var tableShell = "<table><thead><tr>";
                        $(this.adjustDays(this.short_day_names)).each(function () {
                            tableShell += "<th>" + this + "</th>"
                        });
                        tableShell += "</tr></thead><tbody></tbody></table>";
                        this.dateSelector = this.rootLayers = $('<div class="date_selector"></div>').append(nav, tableShell).insertAfter(this.input);
                        if ($.browser.msie && $.browser.version < 7) {
                            this.ieframe = $('<iframe class="date_selector_ieframe" frameborder="0" src="#"></iframe>').insertBefore(this.dateSelector);
                            this.rootLayers = this.rootLayers.add(this.ieframe);
                            $(".button", nav).mouseover(function () {
                                $(this).addClass("hover")
                            });
                            $(".button", nav).mouseout(function () {
                                $(this).removeClass("hover")
                            })
                        };
                        this.tbody = $("tbody", this.dateSelector);
                        this.input.change(this.bindToObj(function () {
                            this.selectDate()
                        }));
                        this.selectDate()
                    },
                    selectMonth: function (date) {
                        var newMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                        if (!this.currentMonth || !(this.currentMonth.getFullYear() == newMonth.getFullYear() && this.currentMonth.getMonth() == newMonth.getMonth())) {
                            this.currentMonth = newMonth;
                            var rangeStart = this.rangeStart(date),
                            rangeEnd = this.rangeEnd(date);
                            var numDays = this.daysBetween(rangeStart, rangeEnd);
                            var dayCells = "";
                            for (var i = 0; i <= numDays; i++) {
                                var currentDay = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate() + i, 12, 00);
                                if (this.isFirstDayOfWeek(currentDay)) dayCells += "<tr>";
                                if (currentDay.getMonth() == date.getMonth()) {
                                    dayCells += '<td class="selectable_day" date="' + this.dateToString(currentDay) + '">' + currentDay.getDate() + '</td>'
                                } else {
                                    dayCells += '<td class="unselected_month" date="' + this.dateToString(currentDay) + '">' + currentDay.getDate() + '</td>'
                                };
                                if (this.isLastDayOfWeek(currentDay)) dayCells += "</tr>"
                            };
                            this.tbody.empty().append(dayCells);
                            this.monthNameSpan.empty().append(this.monthName(date));
                            this.yearNameSpan.empty().append(this.currentMonth.getFullYear());
                            $(".selectable_day", this.tbody).click(this.bindToObj(function (event) {
                                this.changeInput($(event.target).attr("date"))
                            }));
                            $("td[date=" + this.dateToString(new Date()) + "]", this.tbody).addClass("today");
                            $("td.selectable_day", this.tbody).mouseover(function () {
                                $(this).addClass("hover")
                            });
                            $("td.selectable_day", this.tbody).mouseout(function () {
                                $(this).removeClass("hover")
                            })
                        };
                        $('.selected', this.tbody).removeClass("selected");
                        $('td[date=' + this.selectedDateString + ']', this.tbody).addClass("selected")
                    },
                    selectDate: function (date) {
                        if (typeof (date) == "undefined") {
                            date = this.stringToDate(this.input.val())
                        };
                        if (!date) date = new Date();
                        this.selectedDate = date;
                        this.selectedDateString = this.dateToString(this.selectedDate);
                        this.selectMonth(this.selectedDate)
                    },
                    changeInput: function (dateString) {
                        this.input.val(dateString).change();
                        this.hide()
                    },
                    show: function () {
                        this.rootLayers.css("display", "block");
                        $([window, document.body]).click(this.hideIfClickOutside);
                        this.input.unbind("focus", this.show);
                        $(document.body).keydown(this.keydownHandler);
                        this.setPosition()
                    },
                    hide: function () {
                        this.rootLayers.css("display", "none");
                        $([window, document.body]).unbind("click", this.hideIfClickOutside);
                        this.input.focus(this.show);
                        $(document.body).unbind("keydown", this.keydownHandler)
                    },
                    hideIfClickOutside: function (event) {
                        if (event.target != this.input[0] && !this.insideSelector(event)) {
                            this.hide()
                        }
                    },
                    insideSelector: function (event) {
                        var offset = this.dateSelector.position();
                        offset.right = offset.left + this.dateSelector.outerWidth();
                        offset.bottom = offset.top + this.dateSelector.outerHeight();
                        return event.pageY < offset.bottom && event.pageY > offset.top && event.pageX < offset.right && event.pageX > offset.left
                    },
                    keydownHandler: function (event) {
                        switch (event.keyCode) {
                            case 9:
                            case 27:
                                this.hide();
                                return;
                                break;
                            case 13:
                                this.changeInput(this.selectedDateString);
                                break;
                            case 33:
                                this.moveDateMonthBy(event.ctrlKey ? -12 : -1);
                                break;
                            case 34:
                                this.moveDateMonthBy(event.ctrlKey ? 12 : 1);
                                break;
                            case 38:
                                this.moveDateBy(-7);
                                break;
                            case 40:
                                this.moveDateBy(7);
                                break;
                            case 37:
                                this.moveDateBy(-1);
                                break;
                            case 39:
                                this.moveDateBy(1);
                                break;
                            default:
                                return
                        }
                        event.preventDefault()
                    },
                    stringToDate: function (string) {
                        var matches;
                        if (matches = string.match(/^(\d{4,4})-(\d{1,2})-(\d{2,2})$/)) {
                            return new Date(matches[1], matches[2] - 1, matches[3]);
                        } else {
                            return null;
                        };
                    },
                    dateToString: function (date) {
                        var month = (date.getMonth() + 1).toString();
                        var dom = date.getDate().toString();
                        if (month.length == 1) month = "0" + month;
                        if (dom.length == 1) dom = "0" + dom;
                        return date.getFullYear() + "-" + month + "-" + dom;
                    },
                    setPosition: function () {
                        var offset = this.input.offset();
                        this.rootLayers.css({
                            top: offset.top + this.input.outerHeight(),
                            left: offset.left
                        });
                        if (this.ieframe) {
                            this.ieframe.css({
                                width: this.dateSelector.outerWidth(),
                                height: this.dateSelector.outerHeight()
                            })
                        }
                    },
                    moveDateBy: function (amount) {
                        var newDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() + amount);
                        this.selectDate(newDate)
                    },
                    moveDateMonthBy: function (amount) {
                        var newDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + amount, this.selectedDate.getDate());
                        if (newDate.getMonth() == this.selectedDate.getMonth() + amount + 1) {
                            newDate.setDate(0)
                        };
                        this.selectDate(newDate)
                    },
                    moveMonthBy: function (amount) {
                        var newMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + amount, this.currentMonth.getDate());
                        this.selectMonth(newMonth)
                    },
                    monthName: function (date) {
                        return this.month_names[date.getMonth()]
                    },
                    bindToObj: function (fn) {
                        var self = this;
                        return function () {
                            return fn.apply(self, arguments)
                        }
                    },
                    bindMethodsToObj: function () {
                        for (var i = 0; i < arguments.length; i++) {
                            this[arguments[i]] = this.bindToObj(this[arguments[i]])
                        }
                    },
                    indexFor: function (array, value) {
                        for (var i = 0; i < array.length; i++) {
                            if (value == array[i]) return i
                        }
                    },
                    monthNum: function (month_name) {
                        return this.indexFor(this.month_names, month_name)
                    },
                    shortMonthNum: function (month_name) {
                        return this.indexFor(this.short_month_names, month_name)
                    },
                    shortDayNum: function (day_name) {
                        return this.indexFor(this.short_day_names, day_name)
                    },
                    daysBetween: function (start, end) {
                        start = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
                        end = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
                        return (end - start) / 86400000
                    },
                    changeDayTo: function (dayOfWeek, date, direction) {
                        var difference = direction * (Math.abs(date.getDay() - dayOfWeek - (direction * 7)) % 7);
                        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + difference)
                    },
                    rangeStart: function (date) {
                        return this.changeDayTo(this.start_of_week, new Date(date.getFullYear(), date.getMonth()), -1)
                    },
                    rangeEnd: function (date) {
                        return this.changeDayTo((this.start_of_week - 1) % 7, new Date(date.getFullYear(), date.getMonth() + 1, 0), 1)
                    },
                    isFirstDayOfWeek: function (date) {
                        return date.getDay() == this.start_of_week
                    },
                    isLastDayOfWeek: function (date) {
                        return date.getDay() == (this.start_of_week - 1) % 7
                    },
                    adjustDays: function (days) {
                        var newDays = [];
                        for (var i = 0; i < days.length; i++) {
                            newDays[i] = days[(i + this.start_of_week) % 7]
                        };
                        return newDays
                    }
                };
                $.fn.date_input = function (opts) {
                    return this.each(function () {
                        //$(this).unbind();
                        if ($(this).next(".date_selector").length > 0)
                            $(this).next(".date_selector").remove();
                        new DateInput(this, opts);
                    })
                };
                $.date_input = {
                    initialize: function (opts) {
                        $("input.date_input").date_input(opts)
                    }
                };
                return DateInput
            })(jQuery);
            $('.date-plugins').date_input();
            $('#btnUpload').bind('click',UploadFiles);
        });

function UploadFiles(){
    if($('#reportingDate').val() === ''){
        alert('请选择数据日期！');
        return false;
    }
    if($('#file_BasePool').val()==''||$('#file_AssetPayment').val()==''){
        alert('带星号的选项是必填选项！');
        return false;
    }
    else{
        var $uploadControl = $('.file');
        var isExcels = true;
        $.each($uploadControl,function(index,obj){
            if($(obj).attr('id') !== 'file_TopUpPool'){
                var fileType = $(obj).val().substring($(obj).val().lastIndexOf('.')+1);
                if(fileType !== 'xlsx' && fileType !== 'xls'){
                    isExcels = false;
                }
            }
            else{
                if($(obj).val() !== ''){
                    var fileType = $(obj).val().substring($(obj).val().lastIndexOf('.')+1);
                    if(fileType !== 'xlsx' && fileType !== 'xls'){
                        isExcels = false;
                    }
                }
            }
        });
        if(isExcels === false){
            alert('上传文件必须为Excel表格!');
            return false;
        }
    }
    $('#tips').html('正在上传……');
            
    var TrustId = window.location.href.substring(window.location.href.lastIndexOf('=')+1);
    var ReportingDate = $('#reportingDate').val();
    var fileDatas = [];
    $('.file').each(function(index,obj){
        var file = {};
        file.name = $(obj).val().substring($(obj).val().lastIndexOf('\\')+1);
        file.data = $(obj).get(0).files[0];
        file.url = 'trustId=' + TrustId + '&fileFolder=Asset&fileName=' + encodeURIComponent(file.name);
        if(file.name != ''){
            fileDatas.push(file);
        }
    });
    console.log(fileDatas);
    var Uploaded = true;
    $(fileDatas).each(function (index, obj) {

        $.ajax({
            url: GlobalVariable.DataProcessServiceUrl+'CommonFileUpload' + '?' + fileDatas[index].url,
            type: 'POST',
            data: fileDatas[index].data,
            cache: false,
            dataType: 'json',
            async:false,
            processData: false,
            error:function(){
                Uploaded = true;
            }
        });
    });
    if(Uploaded){
        $('#tips').html('上传成功！');
        RunTask(TrustId, ReportingDate, fileDatas);
    }
}
function RunTask(TrustId, ReportingDate, files) {
    var tpi = new TaskProcessIndicatorHelper();
    var dir = 'E:/TSSWCFServices/TrustManagementService/TrustFiles/'+TrustId+'/Asset/';
    tpi.AddVariableItem("TrustId", TrustId, 'NVarChar');
    tpi.AddVariableItem("ReportingDate", ReportingDate, "NVarChar");
    tpi.AddVariableItem("SourceFilePath_BasePool", dir + files[0].name, "NVarChar");
    if(files.length === 2){
        var TaskCode = 'bbbb';
        tpi.AddVariableItem("SourceFilePath_AssetPayment",dir + files[1].name,"NVarChar");
    }
    else{
        var TaskCode = 'bbbb';
        tpi.AddVariableItem("SourceFilePath_TopUpPool",dir + files[1].name,"NVarChar");
        tpi.AddVariableItem("SourceFilePath_AssetPayment",dir + files[2].name,"NVarChar");
    }
    tpi.ShowIndicator("Task",TaskCode);
}
//重载PopupTaskProcessIndicator函数，调用父窗口的div
function PopupTaskProcessIndicator(fnCallBack) {

    //注意调用的路径
    $("#taskIndicatorArea").dialog({
        modal: true,
        dialogClass: "TaskProcessDialogClass",
        closeText: "",
        //closeOnEscape:false,
        height: 550,
        width: 450,
        close: function (event, ui) {
            if (typeof fnCallBack === 'function') { fnCallBack(1); }
            else { parent.window.location.reload(); }
            close();
            //$mask.trigger('click');
            //self.onClose();
        }, // refresh report repository while close the task process screen.
        //open: function (event, ui) { $(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').hide(); },
        title: "任务处理"
    });
}
String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
};
var TaskProcessIndicatorHelper = function () {
    this.Variables = [];
    this.VariableTemp = '<SessionVariable><Name>{0}</Name><Value>{1}</Value><DataType>{2}</DataType><IsConstant>{3}</IsConstant><IsKey>{4}</IsKey><KeyIndex>{5}</KeyIndex></SessionVariable>';

    this.AddVariableItem = function (name, value, dtatType, isConstant, isKey, keyIndex) {
        this.Variables.push({ Name: name, Value: value, DataType: dtatType, IsConstant: isConstant || 0, IsKey: isKey || 0, KeyIndex: keyIndex || 0 });
    };

    this.BuildVariables = function () {
        var pObj = this;

        var vars = '';
        $.each(this.Variables, function (i, item) {
            vars += pObj.VariableTemp.format(item.Name, item.Value, item.DataType, item.IsConstant, item.IsKey, item.KeyIndex);
        });

        var strReturn = "<SessionVariables>{0}</SessionVariables>".format(vars);
        return strReturn;
    };

    this.ShowIndicator = function (app, code, fnCallBack) {
        console.log(app+","+code)
        sContext = {
            appDomain: app,
            sessionVariables: this.BuildVariables(),
            taskCode: code,
        };

        this.CreateSessionByTaskCode(sContext,function(response) {
            sessionID = response;
            taskCode = code;
            IndicatorAppDomain = app;
            console.log(sContext)

            if (IsSilverlightInitialized) {
                PopupTaskProcessIndicator(fnCallBack);
                InitParams();
            } else {
                console.log(2)
                PopupTaskProcessIndicator(fnCallBack);
                InitParams();
            }
        });
    };


    this.CreateSessionByTaskCode = function (sContext, callback) {
        console.log(sContext.sessionVariables);
        var sessionVariables_p = encodeURIComponent(sContext.sessionVariables);
        var uriHostInfo = location.protocol + "//" + location.host;
        var TaskProcessEngineServiceURL =  uriHostInfo + '/TaskProcessEngine/SessionManagementService.svc/jsAccessEP/';
        var serviceUrl = TaskProcessEngineServiceURL + "CreateSessionByTaskCode?applicationDomain=" + sContext.appDomain + "&sessionVariable=" + sessionVariables_p + "&taskCode=" + sContext.taskCode;
        //var serviceUrl = TaskProcessEngineServiceURL + "CreateSessionPostByTaskCode";
        var obj = {};
        obj.appDomain = sContext.appDomain;
        obj.sessionVariables = sContext.sessionVariables;
        obj.taskCode = sContext.taskCode;
        $.ajax({
            type: "GET",                    //modify to POST method
            url: serviceUrl,
            dataType: "jsonp",
            crossDomain: true,
            contentType: "application/json;charset=utf-8",
            success: function (sessionId) {
                callback(sessionId);
                console.log(sessionId + "sessionId")
            },
            error: function (response) { alert(response); }
        });
    };
};

var sessionID, taskCode, IndicatorAppDomain;
var clientName = 'TaskProcess';

var IsSilverlightInitialized = false;
function InitParams() {
    if (!IsSilverlightInitialized) {
        IsSilverlightInitialized = true;
    }
    document.getElementById("TaskProcessCtl").Content.SL_Agent.InitParams(sessionID, IndicatorAppDomain, taskCode, clientName)

}

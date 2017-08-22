globalCashFlowStudio = function () {
    this.ECXML = "";
    this.workMainXML = "";
    this.ecMainXmls = [];
    this.ecMainIndex = -1;
    this.TaskXML = "";
    this.workActionXML = "";
    this.taskActionXmls = [];
    this.taskActionIndex = -1;
    this.appDomain = "Task";
    this.taskCode = "";
    this.ecCode = "";
    this.copyActions = [];
    this.variableJson = "";
    this.isFirstLoad = true;
    this.dragContext = {};
    this.rangeJson = "";
    this.sessionId = "";
    this.isCheckOut = 0;
    this.isViewEdit = false;
    this.isNewTask = false;
    this.isNewEC = false;
    this.aIsPaste = false;
    this.oldTaskCode = "";
    this.combinationActionXmls = [];

    //鼠标位置
    this.mousePosition = function (ev) {
        if (!ev) ev = window.event;
        if (ev.pageX || ev.pageY) {
            //指针位置相对于文档
            return { x: ev.pageX, y: ev.pageY };
        }
        return {
            //指针位置相对于窗口客户区域的 x 坐标，其中客户区域不包括窗口自身的控件和滚动条 
            x: ev.clientX + document.documentElement.scrollLeft - document.body.clientLeft,
            y: ev.clientY + document.documentElement.scrollTop - document.body.clientTop
        };
    };

    //获取DIV的坐标
    this.getElCoordinate = function (dom) {
        var t = dom.offsetTop;
        var l = dom.offsetLeft;
        dom = dom.offsetParent;
        while (dom) {
            t += dom.offsetTop;
            l += dom.offsetLeft;
            dom = dom.offsetParent;
        };
        return { top: t, left: l };
    };

    //指定位置插入元素
    Array.prototype.insert = function (index, item) {
        this.splice(index, 0, item);
    };
};



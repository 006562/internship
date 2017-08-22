$(function () {
    var objId = getRequest().objId;
    var objType = getRequest().objType;
    var $container = $('#log-result');
    if (objId && objType) {
        var template = $('#approval-opinion-template').html();
        var result ='';
        var formatDate = function (time) {
            var time = time.match(/\d+/g);
            return new Date(+time[0]).dateFormat("yyyy-MM-dd hh:mm:ss");
        }
        var displayWorkFlowLog = function (data) {
            var i = data.length;
            data.forEach(function (row) {
                row.Floor = i--;
                result += template.replace(/~(\w+)~/g, function (k, v) {
                    return ('CreatedDate' == v) ? formatDate(row[v]) : row[v];
                })
            })
            $container.html(result);
        }
        webProxy.getCurrentApprovalOpinion(objId, objType, displayWorkFlowLog);
    }
})
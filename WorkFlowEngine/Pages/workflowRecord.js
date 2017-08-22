$(function () {
    var objId = getRequest().objId;
    var objType = getRequest().objType;
    var $container = $('#container');
    var title = document.title;
    var staticHtmls = [];
    $('#tabs a').on('click', function (event) {
        event.preventDefault();
        var $that = $(this);
        var index = $that.index();
        var href = $that.attr('href');
        var tabTitle = $that.data('balloon');
        var insertHtml = function (html) {
            $that.addClass('active').siblings().removeClass('active');
            $container.html(html);
            document.title = tabTitle + ' - ' + title;
        }
        if (staticHtmls[index]) {
            insertHtml(staticHtmls[index]);
        } else {
            $.ajax({
                url: href + '?objId=' + objId + '&objType=' + objType,
                dataType: 'html',
                success: function (html) {
                    insertHtml(html);
                    staticHtmls.push(html);
                }
            })
        }
    });

    (objId && objType) ? $('#tabs a:first').click() : alert('缺少参数');
    (objType) && $('#workflowDisplayName').text(workflowType[objType].workflowDisplayName)
})
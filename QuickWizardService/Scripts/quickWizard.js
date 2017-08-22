var temp = '<div class="content">'+
              '<div class="col-6 form-group">'+
                '<div class="col-4 control-label">'+
                  '<label>模块名称</label>'+
                '</div>'+
                '<div class="col-8">'+
                  '<input class="form-control" type="text">'+
                '</div>'+
              '</div>'+
              '<div class="col-6 form-group">'+
                '<div class="col-4 control-label">'+
                  '<label>模块标识</label>'+
                '</div>'+
                '<div class="col-8">'+
                  '<input class="form-control" type="text">'+
                '</div>'+
              '</div>'+
              '<div class="col-6 form-group">'+
                '<div class="col-4 control-label">'+
                  '<label>页面</label>'+
                '</div>'+
                '<div class="col-8">'+
                  '<input class="form-control" type="text">'+
                '</div>'+
              '</div>'+
              '<div class="col-6 form-group">'+
                '<div class="col-4 control-label">'+
                  '<label>描述</label>'+
                '</div>'+
                '<div class="col-8">'+
                  '<input class="form-control" type="text">'+
                '</div>'+
              '</div>'+
              '<div class="col-6 form-group">'+
                '<div class="col-4 control-label">'+
                  '<label>排序</label>'+
                '</div>'+
                '<div class="col-8">'+
                  '<input class="form-control" type="text">'+
                '</div>'+
              '</div>'+
              '<div class="plus col-4">'+
                '<div class="form-group">'+
                  '<div class="col-4 control-label">'+
                    '<i class="icon icon-plus"></i>'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</div>'

$(".step").click(function() {
    $("#guide").add("#stepMod").toggle();
})

$(".wrap").on("click", ".plus", function () {
    $(".plus").hide();
    $(".wrap").append(temp);
    $("body").scrollTop(document.body.scrollHeight)
});
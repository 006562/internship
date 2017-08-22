 (function($){
    /*!
    *   Modal 模态框插件
    *   Author : BieJun
    *   Date : 2016.03.11
    */
    var defaults = {};

    $.fn.Modal= function(options){
        var _this = $(this);

        defaults = $.extend({width:500,height:400,title:'',html:'',open:false,callback:function(){}},options);

        function init(){
            var modal = function(){
                var mask = '#modal-mask';
                add_mask();
                $(mask).fadeIn('fast',function(){
                    add_modal();
                    $(mask).on('click',function(){
                        var _this = $(this);
                        $('#modal-layout').fadeOut('fast',function(){
                            _this.remove();
                            $(this).remove();
                        });
                    });
                })
            }

            if(defaults.open==true){
                modal();
            }else{
                _this.off('click').on('click',function(){
                    modal();
                });
            }
        }
        init();
    }
    function add_mask(){
        var $mask = $('<div/>');
        $mask.attr('id','modal-mask');
        $mask.css({
            top:0,
            left:0,
            width:'100%',
            height:'100%',
            'z-index':'99998',
            position:'fixed',
            'background-color':'#000',
            'opacity':'0.3',
            'display':'none',
            'filter':'alpha(opacity=15)'
        });
        $(document.body).append($mask);
    }
    function add_modal(){
        var $modal = $('<div />');
        $modal.attr('id','modal-layout');
        $modal.css({
            top:(($(window).height()-defaults.height)/2+$(document).scrollTop())+'px',
            left:($(document).width()-defaults.width)/2+'px',
            width:defaults.width,
            height:defaults.height,
            position:'absolute',
            'margin': '0',
            'padding':'0',
            'z-index':'999999'
        });
        $(document.body).append($modal);
        add_content();
        defaults.callback();
    }
    function add_content() {
        var html = '<div style="height:' + defaults.height + 'px;background:#fff;border-radius:5px">' +
                '<div style="background:#f7f7f7;height:30px;line-height:30px;padding:0 10px;border-radius:5px 5px 0 0;">'+
                    '<span id="CloseModal" style="float:right;cursor:pointer">X</span>'+
                    '<h3 style="color:#555;font-size:14px;font-weight:bold">'+defaults.title+'</h3>'+
                '</div>'+
                '<div style="padding:10px;">' +
                    defaults.html +
                '</div>'+
            '</div>';
        $('#modal-layout').html(html);
        $('#CloseModal').on('click',function(){
            $('#modal-mask').trigger('click');
        });
    }
 })(jQuery);

$('#button').Modal({
    width:500, // 弹出框宽度
    height:400, // 弹出框高度
    title:'运行', // 弹出框标题
    html:'dddddd', //弹出框内容
    open:false, //是否自动打开弹窗
    callback:function(){} //弹出框回调函数 (用于弹出后执行某些代码)
});
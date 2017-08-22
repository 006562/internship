$(function () {
    var bid = getQueryString("bid");
    var set = getQueryString("set");
    
    if (bid == null) {
        DataOperate.getGuid(function (bid) {
            var currentURL = window.location + "?bid=" + bid + "&set=zh-CN";
            window.location.href = currentURL;
        });
    }
    else {
        var dUrl = $("li").eq(0).data('url') + "&bid=" + bid + "&set=" + set;
        var $iframe = $('.work iframe');
        $iframe.attr('src', dUrl);
        $iframe.load(function () {
            $(this).fadeIn();
        });
        $("li").click(function () {
            if (!$(this).hasClass("active")) {
                var url = $(this).data('url');
                url = url + "&bid=" + bid + "&set=" + set;
                $iframe.hide();
                $iframe.attr('src', url);
                $iframe.load(function () {
                    $(this).fadeIn();
                });
                $("li").each(function () {
                    $(this).removeClass("active");
                    $(this).css("cursor", "pointer");
                })
                $(this).addClass("active");
                $(this).css("cursor", "default");
            }
        });
    }


    function changeMenu() {
        var IsOpen = false;
        var $menu = $('.step-menu'),
            $aside = $('.page>.aside');

        $menu.unbind().click(function () {
            var $this = $(this), _left;

            if (IsOpen) {
                IsOpen = false;
                $aside.removeClass('menu');
                _left = 280;
            } else {
                IsOpen = true;
                $aside.addClass('menu');
                _left = 60;
            }
            $('.page').stop().animate({
                'padding-left': _left + 'px'
            }, 100);
        });
    }
    changeMenu();

    var btnList = $("#BtnList>li");
    var Durationaside = $(".Duration-content-aside");
    
    for (i = 0; i < btnList.length; i++) {
        (function (i) {
                for (j = 0; j < Durationaside.length; j++) {
                    (function (j) {
                        if(j==i){
                            btnList[i].onclick = function (i) {
                                $(this).addClass("btnActive").siblings().removeClass("btnActive");
                                $(Durationaside[j]).fadeIn().siblings().fadeOut();
                            }
                        }
                    })(j)
                }
            
        })(i)
    }
});


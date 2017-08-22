var global_tid = 0;
var belonTo = "Trust";

var IsDataChanged = false;
$(function () {
  

    global_tid = getQueryString("tid");
    if (global_tid == null) {
        global_tid = 0;
    }

  
    var targetdiv = $("li").eq(0).attr('targetdiv');

    loadModuleData(targetdiv);

    $("li").click(function () {
        if (!$(this).hasClass("active")) {
            var targetdiv1 = $(this).attr('targetdiv');
            if (global_tid <= 0) {
                alertMsg("请先完成第一步产品信息页", 0);
                return;

            }
            $("li").each(function () {
                $(this).removeClass("active");
                $(this).css("cursor", "pointer");
            })
            $(this).addClass("active");
            $(this).css("cursor", "default");

            //设置所有Div隐藏
            $(".work").find(".main").each(function () {
                $(this).css("display", "none");
            })

            $("#" + targetdiv1).css("display", "block");

            loadModuleData(targetdiv1);
        }
    });

    changeMenu();
});

function changeMenu() {
    var IsOpen = false;
    var $menu = $('.step-menu'),
        $aside = $('.page>.aside');

    $menu.unbind().click(function () {
        var $this = $(this), _left;

        if (IsOpen) {
            IsOpen = false;
            $aside.removeClass('menu');
            _left = 200;
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

function loadModuleData(targetdiv) {
    var target = Pages[targetdiv];

    if (!target.Loaded) {
        //删除knock绑定
        var koDiv = document.getElementById(targetdiv); //不使用jQuery  
 
        if (koDiv) {
            ko.removeNode(koDiv);
            ko.cleanNode(koDiv);
        }
        //删除已存在JS
        $("script[src='" + target.JS + "']").remove();
        //删除已经存在DIV
        $(".work div." + targetdiv).remove();

        //添加
        var oHead = document.getElementsByTagName('HEAD').item(0);
        var oScript = document.createElement("script");
        oScript.type = "text/javascript";
        oScript.src = target.JS;
        oHead.appendChild(oScript);
        oScript.onload = function () {
            $.ajax({
                url: target.URL, //这里是静态页的地址
                type: "GET", //静态页用get方法，否则服务器会抛出405错误

                success: function (data) {
                    var el = document.createElement("div");
                    el.innerHTML = data;
                    var a = $(el).find("#" + targetdiv);
                    $(".work").append(a);
                    tabCloums();
                    target.LoadData(global_tid);
                }
            });
            target.Loaded = true;
        }
    }
}

var Pages = {
    EvnetDesignerDiv: {
        URL: "maintain/maintainDesigner.html?ver=" + Math.random(),
        JS: "maintain/maintainDesigner.js?ver=" + Math.random(),
        LoadData: function (_tid) {
            //注意一下参数顺序
            maintainDesigner.LoadData(_tid);
        },
        Loaded: false,
    },
    TrustEventDiv: {
        URL: "TrustEvents/TrustEvents.html?ver=" + Math.random(),
        JS: "TrustEvents/TrustEventView.js?ver=" + Math.random(),
        LoadData: function (_tid) {
            TrustBondModule.LoadData(_tid);
        },
        Loaded: false,
    },
    PaymentSequenceSettingDiv: {
        URL: "FeeSettings/PaymentSequenceSetting.html?ver=" + Math.random(),
        JS: "FeeSettings/PaymentSequenceSetting.js?ver=" + Math.random(),
        LoadData: function (_tid) {
            //注意一下参数顺序
            TrustInterestModule.LoadData(_tid);
        },
        Loaded: false,
    },
    PaySequenceDisplayerDiv:{
        URL: "PaySequenceDisplayer/test.html?ver=" + Math.random(),
        JS: "PaySequenceDisplayer/test.js?ver=" + Math.random(),
        LoadData: function (_tid) {
            //注意一下参数顺序
            TrustInterestModule.LoadData(_tid);
        },
        Loaded: false,
    },
};

//通知某页面我变化了
function NoticePage(targetdiv) {
    var target = Pages[targetdiv];
    target.Loaded = false;
}
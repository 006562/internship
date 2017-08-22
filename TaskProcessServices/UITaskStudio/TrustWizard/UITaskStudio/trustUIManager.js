trustUIManager = function () {
    var renderCurrentUI = function () {
        var uiId = getUIIdFromURL("uiid");
        var uiObject;
        switch (uiId) {
            case "1":
                $.getScript("./viewProviderContent.js")
                    .done(function () {
                        uiObject = new viewProviderContent();
                        uiObject.render();
                    })
                    .fail(function () {
                        alert("load viewProviderContent.js error!");
                    });
                break;
            case "2":
                $.getScript("./viewBondContent.js")
                    .done(function () {
                        uiObject = new viewBondContent();
                        uiObject.render();
                    })
                    .fail(function () {
                        alert("load viewBondContent.js error!");
                    });
                break;
            case "3":
                $.getScript("./viewBondSequence2.js")
                    .done(function () {
                        uiObject = new viewBondSequence();
                        uiObject.render();
                    })
                    .fail(function () {
                        alert("load viewBondSequence.js error!");
                    });
                break;
        }
    };

    var getUIIdFromURL = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }

    return {
        renderCurrentUI: renderCurrentUI
    };
}
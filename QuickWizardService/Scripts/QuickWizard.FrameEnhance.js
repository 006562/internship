/// <reference path="jquery.min.js" />
/// <reference path="jquery.hash.js" />
/// <reference path="common.js" />
/// <reference path="knockout-3.4.0.js" />

var qwFrame = {
    LangSet: getLanguageSet(),
    TotalSteps: 0,
    BusinessIdentifier: '',
    PageData: {
        'zh-CN': {
            PageTitle: '', ModuleTitle: '', Switcher: 'Switch to English', Steps: []
            , Next: '下一步', Back: '上一步', Post: '完成', ShowRibbon: true
        },
        'en-US': {
            PageTitle: '', ModuleTitle: '', Switcher: '切换至中文', Steps: []
             , Next: 'Next', Back: 'Back', Post: 'Save', ShowRibbon: true
        }
    },
    DataModel: {},


    SetModuleBusiness: function (id) {
        this.BusinessIdentifier = id;
    },
    SetPageTitle: function (set, title) {
        this.PageData[set].PageTitle = title;
    },
    SetModuleTitle: function (set, title) {
        this.PageData[set].ModuleTitle = title;
    },
    RegisterStep: function (set, code, title, description, linkUrl) {
        if (this.BusinessIdentifier) {
            if (linkUrl.indexOf('?') > -1)
                linkUrl += '&id={0}';
            else
                linkUrl += '?id={0}';

            linkUrl = linkUrl.format(this.BusinessIdentifier);
        }

        var step = { Code: code, Title: title, Description: description, LinkUrl: linkUrl };

        if (typeof this.PageData[set].Steps != 'object')
            this.PageData[set].Steps = [];

        this.PageData[set].Steps.push(step);
    },
    PageDataBind: function (showRibbon) {
        this.DataModel = this.PageData[this.LangSet];
        this.TotalSteps = this.DataModel.Steps.length;
        if (showRibbon !== undefined) this.DataModel.ShowRibbon = showRibbon;
        ko.applyBindings(this.DataModel, $('html')[0]);

        var step = $.hash('step');
        if (step) {
            var $step = $('.step>a[pageCode="' + step + '"]');
            if ($step && $step.length) {
                $step.click();
            }
        }
    }



    ///////frame enhancement
    , StepEvents: []
    , Buttons: { btnNext: '#btnNext', btnBack: '#btnBack' }
    , CurrentStep: 0
    , ChangeSetp: function (obj) {//obj arg maybe an "<a>" element or a number(Step Index) or a 'PageCode'
        var targetStep;
        if (typeof obj === 'object') {
            targetStep = $(obj).attr('itemIndex');
        } else if (isNaN(obj)) {
            targetStep = $('.step>a[pageCode="' + obj + '"]').attr('itemIndex');
        } else {
            targetStep = obj;
        }

        $('#mainContentDisplayer_' + targetStep).removeClass('hidden').siblings().addClass('hidden');

        var $step = $('.step a:nth(' + (targetStep) + ')');
        $step.addClass('active').siblings().removeClass('active');
        $.hash('step', $step.attr('pageCode'));

        this.CurrentStep = parseInt(targetStep);

        $(this.Buttons.btnBack).attr('disabled', targetStep == 0);
        var btnNextText = (targetStep == this.TotalSteps - 1) ? this.DataModel.Post : this.DataModel.Next;
        $(this.Buttons.btnNext).find('span').text(btnNextText);
    }
    , ChangeLayoutsColumns: function (obj, num) {
        var $obj = $(obj);
        $obj.addClass('btn-active').siblings().removeClass('btn-active');

        for (var i = 0; i < this.TotalSteps; i++) {
            var ifr = document.getElementById('mainContentDisplayer_' + i);
            var win = ifr.window || ifr.contentWindow;
            if (win && win['AutoLayoutFromFrame'] && typeof win['AutoLayoutFromFrame'] === 'function') {
                win['AutoLayoutFromFrame'](num);
            }
        }
    }
    , StepNext: function (iStep) {
        var lastStep = this.TotalSteps - 1;
        if (this.CurrentStep == lastStep && iStep > 0) {
            this.DoStepsSave();
        } else {
            this.ChangeSetp(this.CurrentStep + iStep);
        }
    }
    , GetStepElementById: function (pageCode, elementId) {
        var iframeIndex = $('.step>a[pageCode="' + pageCode + '"]').attr('itemIndex');
        var ifr = document.getElementById('mainContentDisplayer_' + iframeIndex);
        if (!ifr) return null;
        var win = ifr.window || ifr.contentWindow;
        var element = null;
        if (win) element = win.document.getElementById(elementId);
        return element;
    }
    , RegisterStepEvents: function (obj) {
        this.StepEvents.push(obj);
    }
    , DoStepsSave: function () {
        var self = this;
        var hasErrorStep = false;

        $.each(self.StepEvents, function (i, v) {
            var pageCode = v.PageCode;
            if (v.Validation && typeof v.Validation === 'function') {
                if (!v.Validation()) {
                    hasErrorStep = true;
                    $('.step>a[pageCode="' + pageCode + '"]').addClass('red');
                }
            }
        });

        if (hasErrorStep) { return; }

        $.each(self.StepEvents, function (i, v) {
            if (v.Save && typeof v.Save === 'function') {
                if (!v.Save()) {
                    var obj = $('.step>a[pageCode="' + v.PageCode + '"]').attr('itemIndex');
                    self.ChangeSetp(obj);
                    alert('当前步骤保存失败！');
                    return false;
                }
            }
        });
    }
    , ReloadStep: function (pageCode) {
        var iframeIndex = $('.step>a[pageCode="' + pageCode + '"]').attr('itemIndex');
        var ifr = document.getElementById('mainContentDisplayer_' + iframeIndex);
        if (!ifr) return null;
        var win = ifr.window || ifr.contentWindow;
        win.document.location.reload();
    }
};
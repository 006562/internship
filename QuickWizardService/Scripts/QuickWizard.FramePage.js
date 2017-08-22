/// <reference path="jquery.min.js" />
/// <reference path="common.js" />
/// <reference path="knockout-3.4.0.js" />

var qwFrame = {
    BusinessIdentifier: '',
    SetModuleBusiness: function (id) {
        this.BusinessIdentifier = id;
    },

    PageData: {
        'zh-CN': {
            PageTitle: '',
            ModuleTitle: '',
            Switcher: 'Switch to English',
            Steps: []
        },
        'en-US': {
            PageTitle: '',
            ModuleTitle: '',
            Switcher: '切换至中文',
            Steps: []
        }
    },
    SetPageTitle: function (set, title) {
        this.PageData[set].PageTitle = title;
    },
    SetModuleTitle: function (set, title) {
        this.PageData[set].ModuleTitle = title;
    },
    RegisterStep: function (set, title, description, linkUrl) {
        if (this.BusinessIdentifier) {
            if (linkUrl.indexOf('?') > -1)
                linkUrl += '&id={0}';
            else
                linkUrl += '?id={0}';

            linkUrl = linkUrl.format(this.BusinessIdentifier);
        }

        var step = { Title: title, Description: description, LinkUrl: linkUrl };

        if (typeof this.PageData[set].Steps != 'object')
            this.PageData[set].Steps = [];

        this.PageData[set].Steps.push(step);
    },
    PageDataBind: function () {
        var currentSet = getLanguageSet();
        var dataModel = this.PageData[currentSet];
        ko.applyBindings(dataModel, $('html')[0]);

        $('#mainContentDisplayer').attr('src', dataModel.Steps[0].LinkUrl);
    }
};
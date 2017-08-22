define('viewEditActionNumber', {
    component: function () {
        var self = this;
        
        var editActionNumber = Vue.extend({
            data: function () {
                return {
                    number: 1,
                    actionDisplayName: '',
                    language: this.$root.language
                };
            },
            template: '#actionNumberEditTemplate',
            methods: {
                ApplyActionNumber: function (targetIndex, newActionModel, activeModel) {
                    var action;
                    var len = 0;
                    switch (newActionModel.GroupName) {
                        case 'DirectInput':
                            len = this.$parent.directModel.length;
                            break;
                        case 'Calculated':
                            len = this.$parent.caculateModel.length;
                            break;
                        case 'Export':
                            len = this.$parent.exportModel.length;
                            break;
                        default:
                            break;
                    }
                    len = parseInt(len) + parseInt(this.number);
                    for (i = 0; i < this.number; i++) {
                        action = $.extend({}, newActionModel);
                        action.ActionCode += "_Copy" + parseInt(--len);
                        activeModel.splice(targetIndex, 0, action);
                    } 
                }
            },
            ready: function () {
            }
        });

        return editActionNumber;
    }
});
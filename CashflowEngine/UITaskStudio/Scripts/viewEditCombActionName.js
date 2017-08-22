define('viewEditCombActionName', {
    getActiveMode: function (self, groupName) {
        switch (groupName) {
            case ("DirectInput"):
                return self.directModel;
                break;
            case ("Calculated"):
                return self.caculateModel;
                break;
            case ("Export"):
                return self.exportModel;
                break;
            default:
                return self.directModel;
        }
    },
    component: function () {
        var self = this;
        var editActionName = Vue.extend({
            data: function () {
                return {
                    actionModel: [],
                    combActionModel: [],
                    targetIndex: -1,
                    groupName: ''
                };
            },
            template: '#actionNameEditTemplate',
            methods: {
                ApplyActionName: function () {
                    var that = this;
                    var actionModel = that.actionModel;
                    var combActionModel = that.combActionModel;
                    var targetIndex = that.targetIndex;
                    var groupName = that.groupName;
                    var repstr = /\#(.+?)\#/g;
                    var combStr = JSON.stringify(combActionModel);
                    $(actionModel).each(function (i, value) {
                        var nameModel = this;
                        $(combActionModel.Actions).each(function (j, value) {
                            var srcReplace = "#{" + nameModel.ItemName + "}#";
                            var rep = new RegExp("" + srcReplace + "", "g")
                            combStr = combStr.replace(rep, nameModel.ItemValue);

                            //var actionDisplayName = combActionModel.Actions[j].ActionDisplayName.match(repstr);
                            //if (actionDisplayName != null) {
                            //    var itemName = actionDisplayName.toString().slice(2, -2);
                            //    if (nameModel.ItemName == itemName) {
                            //        combActionModel.Actions[j].ActionDisplayName = combActionModel.Actions[j].ActionDisplayName.replace(repstr, nameModel.ItemValue);
                            //    }
                            //}
                        })
                    })
                    combActionModel = JSON.parse(combStr);
                    $(combActionModel.Actions).each(function (i) {
                        var actionGroupName = combActionModel.Actions[i].GroupName;
                        var targetModel;
                        if (actionGroupName == groupName) {
                            targetModel = self.getActiveMode(that.$parent, groupName);
                            targetModel.splice(targetIndex, 0, combActionModel.Actions[i]);
                            targetIndex += 1;
                        } else {
                            targetModel = self.getActiveMode(that.$parent, actionGroupName);
                            targetModel.push(combActionModel.Actions[i]);
                        }
                    });
                    that.$root.$refs.caculation.$refs.ecmethods.ecModel = that.$root.$refs.caculation.$refs.ecmethods.ecModel.concat(combActionModel.Models);
                },
                txtTrim: function (event) {
                    var str = $(event.target).val().trim();
                    this.$nextTick(function () {
                        $(event.target).val(str);
                    });
                }
            }
        });

        return editActionName;
    }
});
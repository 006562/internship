define('viewEditActionContent', {
    component: function () {
        var taskActions = use("viewTaskActions");

        var editActionContent = Vue.extend({
            data:function(){
                return {
                    activeAction: [],
                    display: false,
                    language:this.$root.language
                };
            },
            template: '#taskEditTemplate',
            methods: {
                AddActionParam: function () {
                    var that = this;
                    var parameter = { "Name": "", "SessionParameterName": "", "Value": "", "DataType": "", "Usage": "", "IsConfigurable": false };
                    this.activeAction.Parameter.push(parameter);
                    this.$nextTick(function () {
                        taskActions.dropsorttasktools(that);
                    })
                },
                DelActionParam: function (index) {
                    var that = this;
                    this.activeAction.Parameter.$remove(this.activeAction.Parameter[index]);
                    this.$nextTick(function () {
                        taskActions.dropsorttasktools(that);
                    });
                },
                redirectCaculaction: function (item) {
                    if (item.Name == "MethodName") {
                        var methods = this.$root.$refs.caculation.$refs.ecmethods.ecModel;
                        var index = -1;
                        $(methods).each(function (i) {
                            if (methods[i].Query.Name == item.Value) {
                                index = i;
                                return false;
                            }
                        })
                        if (index > -1) {
                            this.$root.tabActive = 'caculation';
                            this.$root.$refs.caculation.$refs.ecmethods.scrollTop = index;
                        }
                    }
                },
                txtTrim: function (event) {
                    var str = $(event.target).val().trim();
                    this.$nextTick(function () {
                        $(event.target).val(str);
                    });
                }
            },
            watch: {
                'display': function () {
                    var that = this;
                    this.$nextTick(function () {
                        taskActions.dropsorttasktools(that);
                    });
                },
                activeAction: function () {
                    var that = this;
                    this.$nextTick(function () {
                        taskActions.dropsorttasktools(that);
                    });
                },
                'activeAction.ActionCode': function (val) {
                    this.activeAction.Parameter.filter(function (param) {
                        if (param.Name == 'CashFlowName') param.Value = val;
                    })
                }
            }
        });
        return editActionContent;
    }
});
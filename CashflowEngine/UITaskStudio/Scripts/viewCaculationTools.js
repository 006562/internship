define('viewCaculationTools', {
    dragsortCaculation: function() {
        var that = this;
        // 模板载入之后执行DOM操作
        $("[dragable='caculation']").each(function(index, value) {
            Sortable.create(this, {
                group: {
                    name: that.data.items[index].name,
                    pull: 'clone',
                    put: false
                },
                ghostClass: "sortable-ghost",
                sort: false
            });
        });
    },
    dragsortFun: function () {
        var that = this;
        
        $("[dragable='caculationFun']").each(function (index, value) {
            Sortable.create(this, {
                group: {
                    name: that.data.items[2].list[index].Name,
                    pull: 'clone',
                    put: false
                },
                sort: false,
                onStart: function () {
                    $(".areaCopy").show();
                },
                onEnd: function (evt) {
                    $(".areaCopy").hide();
                }
            });
        });
    },
    component: function() {
        var self = this;
        var tabs = {
            cn: [
                { text: '现金流函数' },
                { text: '变量' },
                { text: '公用函数' }
            ],
            en: [
                { text: 'MetaData' },
                { text: 'Variable' },
                { text: 'Function' },
            ]
        };
        var caculationTools = Vue.extend({
            data: function() {
                var data = {
                    items: [{
                        name: 'MetaData',
                        list: [],
                        filterName: '',
                        filterArr: []
                    }, {
                        name　: 'Variable',
                        list: []
                    },  {
                        name　: 'Function',
                        list: []
                    }]
                };
                data.items[2].list = dataProcess.writeFunctions();

                return {
                    name: 'Caculation Tools',
                    isActive: 0,
                    isHover: -1,
                    tabs: this.$root.language == 'cn' ? tabs.cn : tabs.en,
                    data: data,
                    language:this.$root.language
                }
            },
            template: '#caculationTemplate',
            methods: {
                viewTaskAction: function (item) {
                    this.$root.tabActive = 'task';
                    $('.modal-close').trigger('click');
                    this.$root.$refs.task.$refs.taskaction.scrollCode = item.Name;
                    this.$root.$refs.task.$refs.taskaction.scrollIndex += 1;
                },
                addHover: function (index) {
                    this.isHover = index;
                },
                addFunHover:function (event) {
                    $(event.target).addClass('active').siblings().removeClass('active');
                },
                removeHover:function () {
                    this.isHover = -1; 
                },
                removeFunHover:function (event) {
                    $(event.target).removeClass('active');
                }
            },
            watch: {
                'data.items[2].list': function() {
                    this.$nextTick(function() {
                        self.dragsortFun.call(this);
                    })
                },
                'data.items[0].filterName':function () {
                    $(".list-wrap.search-item").scrollTop(0);
                }
            },
            computed: {
                searchMeta: function() {
                    return this.data.items[0].list.length && this.isActive == 0;
                }
            },
            ready: function () {
                self.dragsortCaculation.call(this);
            }
        });
        Vue.filter('metafilterBy', function(arr, search, delimiter, field) {
            if (!search) {
                this.filterArr = [];
                return arr;
            }
            var res = [];
            var item;
            var searchStr = search.toLowerCase();
            for (var i = 0, l = arr.length; i < l; i++) {
                item = arr[i];
                var fieldObj = item[field].toLowerCase();
                if (fieldObj.indexOf(searchStr) != -1) {
                    item.originIndex = i;
                    res.push(item);
                }
            }
            this.data.items[0].filterArr = res;
            return res;
        })
        return caculationTools;
    }
});

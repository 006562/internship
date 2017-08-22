//资产交易管理
function transationManagerJson(json) {
    vm.addData = json;
};

var vm = new Vue({
    el: "#app",
    data: {
        addData: [],
        viewtransationManagerDataCB: [],
        getDateTimes: [],
        GetTransferPropertyDisplayForUpdateCB:[]
    },
    methods: {
        test: function () {
        }
    }

})
new Vue({
    el: "#queryTool",
    data: {
        connectionStrings: "Server=dal_sec;Database=DAL_SEC_PoolConfig;Trusted_Connection=True;",
        queryString: "",
        count: "",
        ecData: [],
        ecDataTitle: [],
        showTextarea: false
    },
    computed: {
        ecDataTitle: function() {
            if (this.ecData.length) {
                return Object.keys(this.ecData[0]);
            }
        }
    },
    methods: {
        closePreview: function() {
            window.close();
        },
        toggleTextarea: function() {
            this.showTextarea = !this.showTextarea;
            this.$nextTick(function() {
                $(".dropdown-textarea").focus();
            })
        },
        submit: function() {
            if (this.queryString) {
                var strArray = this.queryString.toLowerCase().split("from");
                var strcount = "select count(1) as count from" + strArray[1];

                webProxy.getECResult(this.connectionStrings, this.queryString, function(response) {
                    this.ecData = response;
                }.bind(this));

                webProxy.getECResult(this.connectionStrings, strcount, function(response) {
                    this.count = response[0].count;
                }.bind(this));
            }
        },
        clearSql: function() {
            this.queryString = "";
        }
    },
    ready: function() {
        var sql = decodeURIComponent(this.$route.query.sql);
        if (sql !== 'undefined') {
            this.queryString = sql;
            this.submit();
        }
    }
})

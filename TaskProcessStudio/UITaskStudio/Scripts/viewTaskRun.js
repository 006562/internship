define('viewTaskRun', {
    component: function () {
        var taskRun = Vue.extend({
            data: function () {
                return {
                    sessionId:""
                }
            },
            template: '#taskRunTemplate'
        });

        return taskRun;
    }
});
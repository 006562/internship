define('viewEditTaskXML', {
    component: function () {
        var editTaskXML = Vue.extend({
            data: function () {
                return {
                    taskXml: '',
                    showXml: false,
                    CodeMirror: null
                }
            },
            template: '#editTaskXMLTemplate',
            methods: {
                apply: function () {
                    var taskXml = this.CodeMirror.getValue();
                    this.$parent.taskModel = dataProcess.taskXmlToJson($.parseXML(taskXml.replace(/\n/g, "")));
                    this.showXml = false;
                    this.CodeMirror = null;
                }
            },
            watch: {
                taskXml: function (data) {
                    var that = this;
                    this.$nextTick(function () {
                        var code = document.getElementById('txtTaskXml');
                        $('#taskXml .CodeMirror').remove();
                        this.CodeMirror = CodeMirror.fromTextArea(code, {
                            mode: "xml",
                            lineNumbers: true,
                            styleActiveLine: true,
                            lineWrapping: true
                        });
                        this.CodeMirror.on("change", function () {
                            code.innerHTML = that.CodeMirror.getValue();
                        });
                    });

                }
            }
        });

        return editTaskXML;
    }
});
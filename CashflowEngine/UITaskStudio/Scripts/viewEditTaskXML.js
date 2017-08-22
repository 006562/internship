define('viewEditTaskXML', {
    component: function () {
        var editTaskXML = Vue.extend({
            data: function () {
                return {
                    taskXml: '',
                    showXml:false,
                    CodeMirror : null
                }
            },
            template: '#editTaskXMLTemplate',
            methods:{
                apply:function(){
                    var taskXml = this.CodeMirror.getValue();
                    var taskModel = dataProcess.taskXmlToJson($.parseXML(taskXml.replace(/\n/g, "")));
                    this.$parent.directModel = taskModel.filter(function (item) {
                        if (item.GroupName == "DirectInput") return item;
                    });
                    this.$parent.caculateModel = taskModel.filter(function (item) {
                        if (item.GroupName == "Calculated") return item;
                    });
                    this.$parent.exportModel = taskModel.filter(function (item) {
                        if (item.GroupName == "Export") return item;
                    });
                    use('viewTaskActions').setActiveItem(this.$parent, -1, "DirectInput");
                    this.showXml = false;
                    this.CodeMirror = null;
                }
            },
            watch:{
                taskXml : function(data){
                    var that = this;
                    this.$nextTick(function(){
                        var code = document.getElementById('txtTaskXml');
                        $('#taskXml .CodeMirror').remove();
                        this.CodeMirror = CodeMirror.fromTextArea(code, {
                            mode: "xml",
                            lineNumbers: true,
                            styleActiveLine: true,
                            //lineWrapping: true
                        });
                        this.CodeMirror.on("change",function(){
                            code.innerHTML = that.CodeMirror.getValue();
                        });
                    });

                }
            }
        });

        return editTaskXML;
    }
});
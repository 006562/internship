define('viewEditECXML', {
    component: function () {
        var editECXML = Vue.extend({
            data: function () {
                return {
                    ecXml: '',
                    showXml:false,
                    CodeMirror:null
                }
            },
            template: '#editECXMLTemplate',
            methods:{
                apply:function(){
                    var ecXml = this.CodeMirror.getValue();
                    var ecModel = dataProcess.ecXmlToJson($.parseXML(ecXml));
                    this.$parent.$refs.ecmethods.ecModel = ecModel;
                    this.$parent.$refs.ecmethods.activeId = -1;
                    this.showXml = false;
                }
            },
            watch:{
                ecXml:function(){
                    var that = this;
                    this.$nextTick(function(){
                        var code = document.getElementById('txtECXml');
                        $('#ECXml .CodeMirror').remove();
                        this.CodeMirror = CodeMirror.fromTextArea(code, {
                            mode: "xml",
                            lineNumbers: true,
                            styleActiveLine: true,
                            //lineWrapping: true
                        });
                        this.CodeMirror.on("change",function(){
                            code.innerHTML = that.CodeMirror.getValue();
                        });
                    })
                }
            }
        });

        return editECXML;
    }
});
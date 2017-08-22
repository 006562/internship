define("viewEditActionName", {
    events: function () {
        
    },
    render: function () {
        var that = this;

        var editActionName = Vue.extend({
            data: function () {
                return {
                    data: [
                    ]
                }
            },
            props:['showmodel'],
            template: '#eidtActionName-template',
            watch: {
                showmodel: function (val) {
                    if (val) {
                        //$(dragContext.dragData.Actions).each(function (key, vlaue) {
                        //    var repstr = /\#(.+?)\#/g;
                        //    var itemName = dragContext.dragData.Actions[key].ActionDisplayName;
                        //    var arraystr = itemName.match(repstr);
                        //    if (arraystr != null) {
                        //        console.log(arraystr);
                        //        var next = arraystr.substr(1,-1);
                              

                        //        //self.data.push(dragContext.dragData.Actions[key]);

                        //        //data.push({ItemName:itemName,ItemValue:''})
                        //    }
                        //})  
                    }
                }
            },
            ready: function () {
                that.events();
            }
            
        });
        Vue.component('edit-actioname',editActionName);
    }
});
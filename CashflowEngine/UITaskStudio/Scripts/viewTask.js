define('viewTask',{
    events: function (self) {
		// 伸缩
		$('#TaskContent .panel-head').click(function(){
			var $this = $(this);
			if($this.hasClass('open')){
				$this.removeClass('open');
				$this.find('i').attr('class','icon-down-dir');
				$this.next().slideDown(100);
			}else{
				$this.addClass('open');
				$this.find('i').attr('class','icon-right-dir');
				$this.next().slideUp(100);
			}
		})

		$("#dragbar").on("mousedown", function() {

			var maxHeight = $("#TaskMain").height() - parseInt($("#TaskContent").css("min-height"), 10);

			$("#aside").css("max-height", maxHeight);
			$("#TaskContent").css("max-height", $("#TaskMain").height() - $(".asideContent .panel-head").outerHeight());

			$("body").addClass("wdragging");

			var offTop = $("#aside").offset().top;

			var originHei = $("#aside").height();
			var originMainH = $("#TaskContent").height();

			document.onselectstart = function() {
				return false;
			}

			$(document).on("mousemove", function(event) {
				var addHei = offTop - event.pageY;
				var finHei = originHei + addHei;
				$("#aside").height(finHei);
				$("#TaskContent").height(originMainH - addHei);
				return false;
			})

			$(document).on("mouseup", function() {

				$("#aside")
					.height($("#aside").height())
					.css("max-height", "none");

				$("#TaskContent")
					.height($("#TaskContent").height())
					.css("max-height", "none");

				$(document).off("mousemove selectstart");
				$("body").removeClass("wdragging");
			})

		})

		$("#closeContent").click(function() {
			$('#ribbon_showContent.active').trigger("click");
			$('#ribbon_showSimpleContent.active').trigger("click");
		})

		$(window).resize(function() {
			if ($("#aside").is(":visible")) {
				$("#TaskContent").height($("#TaskMain").height() - $("#aside").height());
				$("#TaskContent").height($("#TaskContent").height());
			}
		});

		// 中间排序
		var tbActionsEle = document.querySelectorAll('.tbActions');
		for (var i = 0; i < tbActionsEle.length; i++) {
		    var curTBActionsEle = tbActionsEle[i];
		    Sortable.create(tbActionsEle[i], {
			    group: {
					pull:false,
					put: ['Single Actions', 'Combine Templates']
			    },
			     //Element is dropped into the list from another list
			    onAdd: function (/**Event*/evt) {
			        var dragAction = $("ul[class='tbActions']").find("li[draggable='false']");
 
			        if (dragAction.length > 0) {
			            var targetIndex = $(dragAction).prev().length > 0? parseInt($(dragAction).prev()[0].tabIndex)+1:0;
			            var groupName = $(dragAction).parent().attr("id");
			            dragAction.remove();
		
			            if (dragContext.dragType == "Single Actions" && dragContext.dragData.GroupName == groupName) {
                            self.data.splice(targetIndex,0,dragContext.dragData);
			            }
			            if (dragContext.dragType == "Combine Templates" && "Calculated" == groupName) {
			                var actions = JSON.parse(JSON.stringify(dragContext.dragData.Actions));
			                var actionModel = [];
			                var repstr = /\#(.+?)\#/g;
			                var isHaveReplaceActionName = false;
			                $(dragContext.dragData.Actions).each(function (key, vlaue) {
			                    var actionDisplayName = dragContext.dragData.Actions[key].ActionDisplayName;
			                    var arraystr = actionDisplayName.match(repstr);
			             
			                    if (arraystr != null) {
			                        var itemName = arraystr.toString().slice(2, -2);
                                    if (actionModel != '') {
                                        actionModel.filter(function (items) {
                                            if (items.ItemName != itemName) {
                                                actionModel.push({ ItemName: itemName, ItemValue: '', ItemIndex: key });
                                            }  
                                        });
                                    }
                                    else {
                                        actionModel.push({ ItemName: itemName, ItemValue: '', ItemIndex: key });
                                    }
			                        isHaveReplaceActionName = true;  
			                    }
			                });
			                
			                self.ismodel = isHaveReplaceActionName;
			                self.$children[1].actionnamemodel = actionModel;
			                self.$children[1].actionsmodel = actions;
			            }
			        }
				} 
			});
		}

	},
	render:function(){
		var self = this;
		var editParam = Vue.extend({
			props:['data','display'],
			template:'#taskEditTemplate'
		});
		var editActionName = Vue.extend({
		    data:function(){
		        return {
		            actionnamemodel: [],
                    actionsmodel:[]
		        };
		    },  
		    props: ['ismodel'],
		    template: '#actionNameEditTemplate',
		    methods: {
		        submitActionName: function () {
		            var _this = this;
		            var obj = this.actionnamemodel;
		            var repstr = /\#(.+?)\#/g;
		            
		            $(_this.actionnamemodel).each(function (i,value) {
		                var nameModel = this;
		                $(_this.actionsmodel).each(function(j,value){
		                    var actionDisplayName = _this.actionsmodel[j].ActionDisplayName.match(repstr);
		                    if (actionDisplayName != null) {
		                        var itemName = actionDisplayName.toString().slice(2, -2);
		                        if (nameModel.ItemName == itemName) {
		                            _this.actionsmodel[j].ActionDisplayName = _this.actionsmodel[j].ActionDisplayName.replace(repstr, nameModel.ItemValue);
		                        }
		                    }
		                })
		            })
		            //this.$dispatch('push-action', _this.actionsmodel); //与父类通信，传值更改父类modeld
		            this.$parent.data = this.$parent.data.concat(_this.actionsmodel);//直接更改父类modeld
		            this.ismodel = false;
		          

		        }
		    }		    
		});
		var taskWork = Vue.extend({
			props:['data','taskcode'],
			data:function(){
			    return {
			        ismodel : false,
					index : -1,
					selected : -1,
					display:true,
					param: []
				};
			},
			template : '#taskWorkTemplate',
			components: {
			    'edit-param': editParam,
			    'edit-actioname': editActionName
			},
			methods : {
				editWork : function(param,index){
					this.param = param;
					this.index = index;
				},
				showContent:function(index){
					var $aside = $('#aside'),
						$taskCon = $('#TaskContent');
					this.display = true;
					if(this.selected != index ){
						this.selected = index;
						$("#closeContent")
							.siblings()
							.text("Action Content");
						$aside.height("70%");
						$taskCon.height("30%");
						$aside.add($taskCon).show();
					}else{
						this.selected = -1;
						$aside.hide();
						$taskCon.height("100%");
					}
				},
				showSimpleContent:function(index){
					var $aside = $('#aside'),
						$taskCon = $('#TaskContent');
					if(this.selected != index ){
						this.selected = index;
						this.display = false;
						$("#closeContent")
							.siblings()
							.text("Action Simple Content");
						$aside.height("70%");
						$taskCon.height("30%");
						$aside.add($taskCon).show();
					}else{
						this.display = true;
						this.selected = -1;
						$aside.hide();
						$taskCon.height("100%");
					}
				}
			},
			events:{
			    //'push-action': function (data) {
			    //    this.data =this.data.concat(data) ;
			    //}
			},
			watch:{
			    data: function () {
					this.index = -1;
			    }
			},
			ready: function () {
				self.events(this);
			}
		});
		Vue.component('task-work',taskWork);
	}
});
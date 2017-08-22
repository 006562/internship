!(function($){
	/*!
	*   弹出框组件 V 1.10
	*   Author : BieJun
	*	Date : 2016.03.11
	*   Update : 2016.06.16
	*/

	function dialog(){
		this.width		= 500;
		this.height 	= 400;
		this.title 		= '';
		this.url 		= '';
		this.html 		= '';
		this.button 	= '确定';
		this.dragable 	= false;
		this.mini 		= false;
		this.status 	= null;
		this.onCallback = function(){},
		this.onClose	= function(){},
		this.onSuccess	= function(){}
	}

	dialog.create = function(options){
		var $mask = $('<div/>');
		var $modal = $('<div/>');

		var obj = $.extend(new dialog(),options);
		var init = function(){
			dialog.build.call(obj,$modal);
			dialog.events.call(obj,$mask,$modal);
			if(obj.dragable)
				dialog.dragable($modal);
		}

		$mask.attr('id','modal-mask');
		$modal.attr('id','modal-layout');

		$mask.css({
			'position':'fixed',
			'top':0,
			'left':0,
			'width':'100%',
			'height':'100%',
			'background-color':'#000',
			'opacity':'.25',
			'filter':'alpha(25)',
			'display':'none',
			'z-index':'888'
		});

		if($('#modal-layout')[0] && typeof obj.html === 'object'){
			if($('#modal-layout').hasClass('mini'))
				$('.modal-close').trigger('click');
		}

		$(document.body).append($mask);

		(obj.mini) ? init() : $mask.fadeIn(200,init);
	}
	dialog.build = function($modal){
		var self = this;
		var $title = $('<div />');
		var $content = $('<div/>');
		var closeBtn = '<a class="modal-close modal-top-btn" href="javascript:;">'+
						'<i class="icon-cancel"></i>'+
					'</a>';
		var miniBtn = '<a class="modal-normal modal-top-btn" href="javascript:;">'+
						'<i class="icon-popup"></i>'+
					'</a>';

		$title.attr('class','modal-title');
		if(self.mini){
			$(closeBtn+miniBtn+'<span>'+self.title+'</span>').appendTo($title);
		}else{
			$(closeBtn+'<span>'+self.title+'</span>').appendTo($title);
		}
		$title.appendTo($modal);

		$content.attr('class','modal-content');
		$content.css({
			'background-color':'#fff',
			'height':self.height+'px'
		});

		if(typeof self.html === 'object')
			self.html.show().appendTo($content);
		else
		    if (self.url != '') {
		        var selfheight = self.height - 20;
		        var selfwidth = self.width - 20;
		        $('<iframe id="iframePage" src="' + self.url + '" frameborder="0"' +
					'width="' + selfwidth + '"' +
					'height="' + selfheight + '"></iframe>')
				.appendTo($content);
		    } else {
		        $('<div style="padding:10px;">' +
					self.html +
					'</div>')
				.appendTo($content);
		    }
		$content.appendTo($modal);

		if(self.status!=null){
			var $btns = $('<div class="modal-btns"/>');
			switch(self.status){
				case 'alert':
					$(dialog.btn('modal-success',self.button,'')).appendTo($btns);
					$btns.css('text-align','right');
				break;
				case 'confirm':
					$(dialog.btn('modal-cancel','取消','width:40%;float:right;')+dialog.btn('modal-success',self.button,'width:40%;')).appendTo($btns);
				break;
			}
			$btns.appendTo($modal);
		}
		$(document.body).append($modal);

		$modal.css({
			'top':($(window).height()-$modal.outerHeight())/2+'px',
			'left':($(document).width()-self.width)/2+'px',
			'right':($(document).width()-self.width)/2+'px',
			'width':self.width+'px',
			'position':'fixed',
			'_position':'absolute',
			'_top':(($(window).height()-$modal.outerHeight())/2+$(document).scrollTop())+'px',
			'z-index':'999'
		});
		self.onCallback();
	}
	dialog.btn = function(dom,text,style){
		var btn = '<button type="button" id="'+dom+'" style="margin:10px;cursor:pointer;border:1px solid #ccc;background:#fff;padding:3px 10px;'+style+'">'+
						text+
					'</button>';
		return btn;
	}
	dialog.events = function($mask,$modal){
		var self = this;
		
		$('.modal-close').on('click',function(event){
			event.preventDefault();
			if(typeof self.html == 'object')
				self.html.hide().appendTo(document.body);
			self.onClose();
			$mask.add($modal).remove();
			if($modal.hasClass('mini'))
				$('#DialogHook .work-body').removeAttr('style');
		});
		$('#modal-cancel').on('click',function(event){
			event.preventDefault();
			$(this).closest('#modal-layout').find('.modal-close').trigger('click');
		});
		if(this.mini){
			var css = null;
			var work  = $('#DialogHook .work-body');
			var workHeight = parseInt(work.height());
			$('.modal-normal').on('click',function(event){
				var $this = $(this);
				if($modal.hasClass('mini')){
					$modal.removeClass('mini').attr('style',css).find('.modal-content').css('height',self.height+'px');
					work.height(workHeight);
				}else{
					css = $modal.attr('style');
					$modal.addClass('mini').removeAttr('style').find('.modal-content').css('height',workHeight / 2);
					work.height(workHeight / 2 - 30);
					document.getElementById('DialogHook').appendChild($modal[0]);
				}
			});

			$('.modal-normal').trigger('click');
		}
		$('#modal-success').on('click',function(event){
			event.preventDefault();
			$('.modal-close').trigger('click');
			self.onSuccess();
		});
	}
	dialog.dragable = function($modal){
		var draging = false ,iX,iY,oX,oY,drag = {};
		var oW = $(window).width() - $modal.width();
		var oH = $(window).height() - $modal.outerHeight();
		drag.start = function(e){
			var e = e || window.event;
			var offset = $modal.offset();
			if(!$modal.hasClass('mini')){
				draging = true;
				iX = e.pageX - offset.left;
				iY = e.pageY - offset.top;
				$modal.css("cursor","move");
				return false;
			}
		};
		drag.move = function(e){
			var e = e || window.event;
			if(draging){
				var top = $(document).scrollTop();

				oX = e.pageX - iX;
				oY = e.pageY - iY - top;
				oX = oX < 0 ? 0 : oX > oW ? oW : oX;
				oY = oY < 0 ? 0 : oY > oH ? oH : oY;

				$modal.css({"left":oX + "px", "top":oY + "px","cursor":"move"});
				return false;
			}
		};
		drag.stop = function(e){
			draging = false;
			$modal.css({"cursor":"default"});
		}
		$modal.find('.modal-title').on('mousedown',drag.start);
		$(document).on("mousemove",drag.move);
		$(document).on("mouseup",drag.stop);
	}

	$.fn.anyDialog = function(options){
		var $this = $(this);
		$this.off('click').on('click',function(event){
			var e = e || window.event;
			e.preventDefault();
			dialog.create(options);
		});
	}
	$.anyDialog = function(options){
		dialog.create(options);
	}
})(jQuery);
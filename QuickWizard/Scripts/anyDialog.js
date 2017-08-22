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
		this.button 	= '';
		this.dragable 	= false;
		this.status 	= null;
		this.onCallback = function(){},
		this.onClose	= function(){},
		this.onSuccess	= function(){}
	}

	dialog.create = function(options){
		var $mask = $('<div/>');
		var $modal = $('<div/>');

		$mask.attr('id','modal-mask');
		$modal.attr('id','modal-layout');

		$mask.css({
			'position':'fixed',
			'top':0,
			'left':0,
			'width':'100%',
			'height':'100%',
			'z-index':'9999',
			'background-color':'#000',
			'opacity':'.15',
			'filter':'alpha(15)',
			'display':'none'
		});

		$(document.body).append($mask);

		$mask.fadeIn('fast',function(){
			var obj = $.extend(this,options);
			dialog.build.call(obj,$modal);
			dialog.events.call(obj,$mask,$modal);
			if(obj.dragable)
				dialog.dragable($modal);
		}.call(new dialog()));
	}
	dialog.build = function($modal){
		var self = this;
		var $title = $('<div />');
		var $content = $('<div/>');

		$title.attr('id','modal-title');
		$title.css({
			'height':'30px',
			'line-height':'30px',
			'font-size':'15px',
			'padding':'0 10px',
			'color':'#fff',
			'background-color': '#545D93'
		});
		$('<a id="modal-close" href="#" style="float:right;font-weight:bold;co">'+
			'x</a>'+
			'<span>'+self.title+'</span>')
		.appendTo($title);
		$title.appendTo($modal);

		$content.css({
			'border':'1px solid #ddd',
			'background-color':'#fff',
			'height':self.height+'px'
		});

		if(typeof self.html === 'object')
			self.html.show().appendTo($content);
		else
			if(self.url!='')
				$('<iframe id="dialogIframe" src="'+self.url+'" frameborder="0"'+
					'width="'+self.width+'"'+
					'height="'+self.height+'"></iframe>')
				.appendTo($content);
			else
				$('<div style="padding:10px;">'+
					self.html+
					'</div>')
				.appendTo($content);
		$content.appendTo($modal);

		if(self.status!=null){
			var $btns = $('<div id="modal-btn" style="background:#fff;border:1px solid #ddd;border-top:none;"/>');
			switch(self.status){
				case 'alert':
					$(dialog.btn('modal-success',self.button,'width:100%')).appendTo($btns);
				break;
				case 'confirm':
					$(dialog.btn('modal-success',self.button,'width:50%;background:#388FDA;color:#fff')+dialog.btn('modal-cancel','取消','width:50%;')).appendTo($btns);
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
			'z-index':'99999'
		});
		self.onCallback();
	}
	dialog.btn = function(dom,text,style){
		var btn = '<button type="button" id="'+dom+'" style="cursor:pointer;border:none;background:#fff;color:#007AFF;padding:6px 10px;'+style+'">'+
						text+
					'</button>';
		return btn;
	}
	dialog.events = function($mask,$modal){
		var self = this;
		$mask.on('click',function(){
			$modal.fadeOut('fast',function(){
				if(typeof self.html == 'object')
					self.html.hide().appendTo(document.body);

				$mask.remove();
				$modal.remove();
			});
		});
		$('#modal-close').on('click',function(event){
			event.preventDefault();
			$mask.trigger('click');
			self.onClose();
		});
		$('#modal-cancel').on('click',function(event){
			event.preventDefault();
			$mask.trigger('click');
			self.onClose();
		});
		$('#modal-success').on('click',function(event){
			event.preventDefault();
			$mask.trigger('click');
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
			draging = true;
			iX = e.pageX - offset.left;
			iY = e.pageY - offset.top;
			$modal.css("cursor","move");
			return false;
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
		$modal.on('mousedown',drag.start);
		$(document).on("mousemove",drag.move);
		$(document).on("mouseup",drag.stop);
	}

	$.fn.anyDialog = function(options){
		var $this = $(this);
		$this.off('click').on('click',function(event){
			var e = e || window.event;
			e.preventDefault();
			return dialog.create(options);
		});
	}
	$.anyDialog = function(options){
		dialog.create(options);
	}
})(jQuery);
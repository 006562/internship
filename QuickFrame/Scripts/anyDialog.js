/*
*	弹出框组件 V 2.0
*
*	Author : BieJun
*	Date : 2016.03.11
*	Update : 2017.03.20
*/

~function($,doc,win){

	var defaults = {
		width		: 500,
		height 		: 400,
		title 		: '',
		url			: '',
		html 		: '',
		status 		: 'default',
		draggable	: false,
		mask 		: true,
		buttonText 	: { submit:'确定',cancel:'取消' },
		onCallback 	: function(){},
		onClose		: function(){},
		onSuccess	: function(){}
	}

	var anyDialog = function(options){

		var self = this , containerId = 'container-'+ (Date.now());

		self.options = $.extend({},defaults,options);

		self.container = $('<div id="'+containerId+'"/>');

		self.title = $('<div/>');

		self.mask = null;

		self.iframe = null;

		self.targetElement = null;

		self.closePopup = self.close;

		self.container.css({
			'background':'#fff',
			'width':self.options.width+'px',
			'height':self.options.height+'px',
			'border-radius':'2px',
			'box-shadow':'0 2px 15px rgba(0,0,0,.1)'
		});

		if (self.options.mask) {

			var $mask = $('<div id="modal-mask"/>'),
				$wrap = $('<div id="modal-wrap"/>');

			// 判断笼罩层是否已经存在，减少不必要的dom操作导致的性能消耗
			if ($('#modal-mask')[0]) {
			    self.mask = $('#modal-mask');

			}else{
				$mask.css({
					'position':'fixed',
					'top':0,
					'left':0,
					'right':0,
					'bottom':0,
					'width': '100%',
					'height': '100%',
					'background':'rgba(0,0,0,.3)',
					'z-index':'999',
					'display':'none'
				});
				
				$(doc.body).append($mask);

				self.mask = $mask;
			}

			self.mask.css('display','table');

			$wrap.css({
				'display': 'table-cell',
				'vertical-align': 'middle'
			});

			$wrap.appendTo(self.mask);

			self.container.css({
				'position':'relative',
				'margin':'0 auto'
			});

			self.container.appendTo($wrap);

		}else{

			self.container.css({
				'position':'fixed',
				'border':'1px solid #ddd',
				'top':($(win).height() - self.options.height)/2+'px',
				'left':($(win).width() - self.options.width)/2+'px'
			});

			self.container.appendTo(document.body);

			$(win).on('resize',function(){
				self.container.css({
					'top':($(win).height() - self.options.height)/2+'px',
					'left':($(win).width() - self.options.width)/2+'px'
				});
			});
		}

		self.title.css({
			'padding':'10px 20px 0 20px',
			'height':'40px'
		});

		self.title.appendTo(self.container);

		if(self.options.title!=''){

			self.title.append('<div style="font-size:16px;">'+self.options.title+'</div>');
		}

		var closeBtn = $('<button>&times;</button>');

		closeBtn.css({
			'position':'absolute',
			'top':'10px',
			'right':'18px',
			'background':'transparent',
			'border':'none',
			'font-size': '21px',
			'font-weight': '700',
			'line-height': '1',
			'color': '#000',
			'text-shadow':'0 1px 0 #fff',
			'outline':'0',
			'opacity':'.3'
		})

		self.title.append(closeBtn);

		closeBtn.on('click',self.close.bind(self));

		self.contents();

		(self.options.draggable && !self.options.mask) &&　self.draggable();
	}
	anyDialog.prototype = {
		constructor : anyDialog,
		contents : function(){
			var self = this , $div = $('<div/>') , $button = $('<button type="button"/>') , status = self.options.status;

			if( 'alert' == status || 'confirm' == status || 'prompt' == status ){
				var $buttonGroup = $('<div/>');
				$buttonGroup.css({
					'text-align':'right',
					'padding':'13px 20px',
					'background':'#f9fafb',
					'height':'58px',
					'border-top':'1px solid rgba(34, 36, 38, 0.15)'
				});
				$div.css('height',self.options.height - 100 + 'px');
				$button.css({
					'background-image':'none',
					'display':'inline-block',
					'padding':'6px 15px',
					'text-align':'center',
					'font-size':'14px',
					'border':'none',
					'border-radius':'2px'
				});
				self.container.append($div);
				$div.after($buttonGroup);
			}

			switch(status){
				case 'default':
						$div.css('height', self.options.height - 40 + 'px');
						if(self.options.url!=''){
							self.iframe = $('<iframe id="dialogIframe" frameborder="0"/>');
							self.iframe.css({
								width:'100%',
								height:'100%'
							});
							self.iframe.attr('src',self.options.url);
							self.iframe.appendTo($div);
						}else{
							if(typeof self.options.html == 'object'){

								self.targetElement = self.options.html;
								self.targetElement.show().appendTo($div);
							}else{
								$div.css({'padding':'0 20px','font-size':'14px'});
								$div.html(self.options.html)
							}
						}
						self.container.append($div);
					break;
				case 'alert':
					var button = $button.clone();
					$div.css('text-align','center').html(self.options.html);
					button.css({
						'background':'#21BA45',
						'color':'#fff',
						'box-shadow':'0 0 0 0 rgba(34,36,38,.15) inset'
					}).text(self.options.buttonText.submit);
					$buttonGroup.append(button);
					button.click(self.options.onSuccess.bind(self));
					break;
				case 'confirm':
					var button1 = $button.clone() , button2 = $button.clone();

					$div.css('text-align','center').html(self.options.html);

					button1.css({
						'background':'#E0E1E2',
						'color':'rgba(0,0,0,.6)',
						'box-shadow':'0 0 0 1px transparent inset, 0 0 0 0 rgba(34,36,38,.15) inset'
					}).text((self.options.buttonText.cancel)?self.options.buttonText.cancel:'取消');

					button2.css({
						'background':'#21BA45',
						'color':'#fff',
						'box-shadow':'0 0 0 0 rgba(34,36,38,.15) inset',
						'margin-left':'10px'
					}).text((self.options.buttonText.submit)?self.options.buttonText.submit:'确定');

					$buttonGroup.append(button1);
					$buttonGroup.append(button2);
					button1.click(self.options.onClose.bind(self));
					button2.click(self.options.onSuccess.bind(self));
					break;
				case 'prompt':
					var button1 = $button.clone() , button2 = $button.clone();
					var inputId = 'modal-input-'+ Math.round(Math.random()*66666);
					var inputForm = '<div style="padding:0 20px">'+
										'<input type="text" id="'+inputId+'" style="width:100%;padding:6px 5px;border:1px solid #ddd;font-size:12px;"/>'+
									'</div>';

					$div.css('padding','20px 0').html(inputForm);

					button1.css({
						'background':'#E0E1E2',
						'color':'rgba(0,0,0,.6)',
						'box-shadow':'0 0 0 1px transparent inset, 0 0 0 0 rgba(34,36,38,.15) inset'
					}).text((self.options.buttonText.cancel)?self.options.buttonText.cancel:'取消');

					button2.css({
						'background':'#21BA45',
						'color':'#fff',
						'box-shadow':'0 0 0 0 rgba(34,36,38,.15) inset',
						'margin-left':'10px'
					}).text((self.options.buttonText.submit)?self.options.buttonText.submit:'确定');

					$buttonGroup.append(button1);
					$buttonGroup.append(button2);

					var $input = $('#'+inputId);
					// 给弹出的表单一个焦点
					$input.focus();
					
					button1.click(self.options.onClose.bind(self));
					button2.click(self.options.onSuccess.bind(self,$input));
					break;
			}
			(self.iframe)?self.iframe.load(self.options.onCallback.call(self)):self.options.onCallback.call(self);
		},
		close : function(){
			var self = this;
			// IE下iframe会缓存，关闭弹出层同时干掉它
			if(self.iframe){
				self.iframe.attr('src','').remove();
				self.iframe = null;
			}
			if(self.targetElement){
				self.targetElement.hide().appendTo(doc.body);
				self.targetElement = null;
			}
			if(self.options.mask){
				// 隐藏笼罩层以便下次使用
				self.mask.hide();
				// 找到下一层元素并移除掉，防止jqyery内部缓存机制导致的内容泄露
				self.mask.find('#modal-wrap').remove();
			}else{
				self.container.remove();
			}
			self.options.onClose.bind(self);
		},
		draggable : function(){
			var self = this;

			var timer , moving = false, iX , iY , oX , oY , X , Y;
			var oW = $(win).width() - self.options.width,
				oH = $(win).height() - self.options.height;

			var drag={
				start : function(e){
					var e = e || win.event;
					var offset = self.container.offset();
					iX = e.clientX - offset.left;
					iY = e.clientY - offset.top;
					// 加入计时器，防止每次移动时重新计算位置消耗性能
					timer = setInterval(function() {
						if (timer && moving) {
							oX = X - iX;
							oY = Y - iY;
							oX = oX < 0 ? 0 : oX > oW ? oW : oX;
							oY = oY < 0 ? 0 : oY > oH ? oH : oY;
							self.container.css({"left":oX + "px","top":oY + "px"});
						}
					},5);
					return false;
				},
				move : function(e){
					var e = e || win.event;
					X = e.clientX;
					Y = e.clientY;
					if (timer !== undefined) {
						moving = true;
					}
					return false;
				},
				stop : function(e){
					clearInterval(timer);
					timer = undefined;
					moving = false;
					// 释放内存
					iX = iY = oX = oY = X = Y = null;
				}
			}
			self.title.css('cursor','move').on('mousedown',drag.start);
			$(doc).on("mousemove",drag.move);
			$(doc).on("mouseup",drag.stop);
		}
	}

	$.fn.anyDialog = function(options){
		var $this = $(this);
		$this.on('click',function(e){
			var e = e || win.event;
			e.preventDefault();
			new anyDialog(options)
		});
		return $this;
	}
	$.anyDialog = function(options){
		return new anyDialog(options);
	}
}(jQuery,document,window);
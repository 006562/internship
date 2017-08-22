(function($){
	/*!
	 *  右键菜单组件 V 1.0
	 *
	 *	Author : BieJun
	 *	Date : 2016.06.30
	*/
	function context(){
		this.el = 'html,body'; // 设置右键点击范围
		this.fade = 100; // 菜单渐入延迟毫秒
		this.menu = []; // 配置菜单列表
	}
	// 创建菜单事件
	context.create = function(options){
		var opts = $.extend(this,options);
		var $menu = context.bulid(opts.menu);
		$(document.body).append($menu);
		$(document).on('click',function () {
			$('.context-menu').fadeOut(opts.fade);
		});
		$(document).on('contextmenu',opts.el,function (e) {
			e.preventDefault();
			e.stopPropagation();
			var menuHeight = $menu.height() + 5;
			var menuWidth = $menu.width();
			var positionTop = ((e.pageY + menuHeight) > $(window).height()) ?
									 e.pageY - menuHeight :
									 e.pageY + 5;
			var positionLeft = ((e.pageX + menuWidth) > $(document).width()) ?
									 e.pageX - menuWidth :
									 e.pageX;
			$menu.css({
				top:positionTop,
				left:positionLeft
			}).fadeIn(opts.fade);
		});
	}
	// 构建菜单
	context.bulid = function(menu){

		var $menu = $('<ul class="context-menu"></ul>');
		var context_li = function(obj){
			return '<li id="'+obj.id+'" class="context-menu-item'+obj.disable+'">'+
						'<a href="'+obj.href+'">'+obj.text+
					'</li>';
		}

		if(''==menu) return false;
		for(var i in menu){
			var obj = {
				id : (undefined != menu[i].id) ? menu[i].id : 'event-'+Math.floor(Math.random() * 0x10000),
				disable : (menu[i].disable != undefined || menu[i].disable) ? ' disable' : '',
				text : (menu[i].text != undefined) ? menu[i].text : '',
				href : (menu[i].href != undefined) ? menu[i].href : 'javascript:void(0);'
			}
			if(menu[i].callback != undefined &&
				typeof menu[i].callback == 'function' ){
				$(document).on('click', '#'+obj.id, menu[i].callback);
			}
			$menu.append(context_li(obj));
		}
		return $menu;
	}
	$.fn.anyContext = function(options){
		var obj = new context();
		obj.el = $(this).selector;
		context.create.call(obj,options);
	}
	$.anyContext = function(options){
		context.create.call(new context(),options);
	};
})(jQuery)
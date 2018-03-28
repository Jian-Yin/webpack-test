require('./dropdown.scss');

var $ = require('jquery'),
	iScroll = require('iscroll');

var defaultOpt = {
	dropElem: '.btn',
	dropElemDefaultText: '',
	addClass: 'is-open',
	showElem: '.sub-menu',
	showElemData: [],
	showElemClickCallBack: null,
	showCallBack: null,
	hideCallBack: null
};

function Dropdown(elem, opt){
	if ( !(this instanceof arguments.callee) ) return new arguments.callee(elem, opt);

	this.opt = $.extend({}, defaultOpt, opt);
	this.elem = elem;
	this.init();
}

Dropdown.prototype = {
	constructor: Dropdown,
	init: function() {
		var that = this,
			opt = that.opt,
			$elem = $(that.elem),
			$showElem = $(opt.showElem, $elem);

		$(opt.dropElem).find('span:eq(0)').text(opt.dropElemDefaultText);
		$('ul', $showElem).html(that.getListHtml());

		$elem.off('click.dropdownDrop').on('click.dropdownDrop', opt.dropElem, function() {
			if($showElem.is(':visible')){
				$showElem.hide();
				$elem.removeClass(opt.addClass);
				opt.hideCallBack && $.isFunction(opt.hideCallBack) && opt.hideCallBack(that);
			}else{
				$showElem.show();
				$elem.addClass(opt.addClass);
				opt.showCallBack && $.isFunction(opt.showCallBack) && opt.showCallBack(that);

				if(!that.iScroll){
					that.iScroll = new iScroll($('.scroll-wrap', $showElem)[0], {
						scrollbars: true,
						mouseWheel: true,
						bounce: false,
						preventDefaultException: {
							tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A|DIV|SPAN|P|I)$/
						}
					});	 
				}
			}
		});

		$elem.off('click.dropdownSub').on('click.dropdownSub', 'li', function() {
			if( $(this).hasClass(opt.disabledClass) ) return false;

			that.setValue($(this).data('value'));
			opt.showElemClickCallBack && $.isFunction(opt.showElemClickCallBack) && opt.showElemClickCallBack($(this), that);
			$(opt.dropElem, $elem).trigger('click.dropdownDrop');
		});
	},
	getListHtml: function() {
		var listHtml = [];
		$.each(this.opt.showElemData, function(i, v) {
			listHtml.push('<li data-value='+ v.value +'><a>'+ v.text +'</a></li>');
		});
		return listHtml.join('');
	},
	setValue: function(value) {
		var li = $('li[data-value='+ value +']',$(this.elem));
		if(!li.length){ return;}

		this.selectValue = value;
		$(this.opt.dropElem, this.elem).find('span:eq(0)').html( li.text() );
		li.addClass('is-active').siblings('.is-active').removeClass('is-active');
	},
	destroy: function() {
		$(this.elem).off('click.dropdownDrop').off('click.dropdownSub');
		this.iScroll && this.iScroll.destroy();
	}

};

module.exports = Dropdown;
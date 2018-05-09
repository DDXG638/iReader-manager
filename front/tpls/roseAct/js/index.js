(function () {
    'use strict';

    scrollBind();

    function scrollBind() {

    	window.onscroll = function() {
    		var st = document.documentElement.scrollTop || document.body.scrollTop;
    		var $header = document.getElementsByTagName('header')[0];
    		if(st > 0) {
			    addClass($header, 'scroll');
		    } else {
    			removeClass($header, 'scroll');
		    }
	    }
    }

	function addClass(obj, cls){
		var obj_class = obj.className;
		var reg = new RegExp('\\b'+cls+'\\b');
		if(!reg.test(obj_class)) {
			var blank = (obj_class !== '') ? ' ' : '';
			var	added = obj_class + blank + cls;
			obj.className = added;
		}
	}

	function removeClass(obj, cls){
		var obj_class = ' '+obj.className+' ';
		obj_class = obj_class.replace(/(\s+)/gi, ' ');
		var removed = obj_class.replace(' '+cls+' ', ' ');
		removed = removed.replace(/(^\s+)|(\s+$)/g, '');
		obj.className = removed;
	}

})();
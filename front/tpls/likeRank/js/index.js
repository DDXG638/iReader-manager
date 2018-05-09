(function () {
	'use strict';

	var mySwiper;

	initPlayer();
	//scrollBind();

	var $tabItem = $('.tab a');
	$tabItem.on('click', function() {
		var $this = $(this);
		var $moodlist = $('.mood-list.js-type-' + $this.data('sex'));

		$moodlist.show().siblings('.mood-list').hide();
		$this.addClass('sel').siblings().removeClass('sel');
	});

	$('.thumbnail .imgs').on('click', function() {
		var $imgs = $(this).parent().find('.imgs'),
			$swiperWraper = $('.swiper-wrapper');

		$imgs.each(function() {
			var $this = $(this);
			var url = $this.attr('data-url');
			$swiperWraper.append('<div class="swiper-slide"><img src="'+url+'" width="100%" class="swiper-lazy" alt=""></div>');
		});

		$('.swiper-mask').show();
		initSwiper();
	});

	$('.swiper-mask').on('click', function() {
		var $swiperWraper = $('.swiper-wrapper');
		$('.swiper-mask').hide();
		$swiperWraper.empty().removeAttr('style');
		mySwiper.destroy();
	});

	function initSwiper() {
		mySwiper = new Swiper('.swiper-container');
	}

	function initPlayer() {
		var audio = new Audio();
		audio.controls = true;
		document.body.appendChild(audio);
		audio.onpause = function() {
			$('.playing').removeClass('playing');
		};
		var $jplayer = $('.jplayer');

		$jplayer.bind('click', function (e) {
			e.preventDefault();
			if (audio.paused) {
				var src = $(this).attr('media-src');
				audio.src !== src && (function() {
					audio.src = src;
				})();
				audio.play();
				$(this).addClass('playing');
			} else {
				audio.currentTime = 0;
				audio.pause();
			}
		})
	}

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
(function () {
	$(function () {
        $('body').on('touchstart', '.js-clickable', function () {
            $(this).addClass('hover');
        });

        $('body').on('touchend touchcancel', '.js-clickable', function () {
            $(this).removeClass('hover');
        });
    });
})();
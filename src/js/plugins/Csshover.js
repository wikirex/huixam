/*
 * Mobile hover plugin
 */
;(function($){

	var doc = jQuery(document);
	// detect device type
	var isTouchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
		isWinPhoneDevice = /Windows Phone/.test(navigator.userAgent);

	// define events
	var eventOn = (isTouchDevice && 'touchstart') || (isWinPhoneDevice && navigator.pointerEnabled && 'pointerdown') || (isWinPhoneDevice && navigator.msPointerEnabled && 'MSPointerDown') || 'mouseenter',
		eventOff = (isTouchDevice && 'touchend') || (isWinPhoneDevice && navigator.pointerEnabled && 'pointerup') || (isWinPhoneDevice && navigator.msPointerEnabled && 'MSPointerUp') || 'mouseleave';

	isTouchDevice = /Windows Phone/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

	function toggleClass(opt, e) {
		var el = jQuery(e.currentTarget);
		
		if (!isTouchDevice) {
			el.one(eventOff, function(){
				jQuery(this).removeClass(opt.hoverClass);
			})
		} else {
			if (!el.hasClass(opt.hoverClass)) {
				jQuery(this).off('click.hover', function(e){e.preventDefault()});
				setTimeout(function() {
					doc.on(eventOn + '.hover', function(e){
						var target = jQuery(e.target);
						if (!target.is(el) && !target.closest(el).length) {
							el.removeClass(opt.hoverClass);
							jQuery(this).off('click.hover');
							doc.off(eventOn + '.hover')
						}
					})
				})
			}
		}
		
		if (!el.hasClass(opt.hoverClass)){
			if (e) e.preventDefault();
			el.addClass(opt.hoverClass);
		}
	}

	// jQuery plugin
	$.fn.touchHover = function(opt) {
		var options = $.extend({
			hoverClass: 'hover'
		}, opt);

		this.on(eventOn, toggleClass.bind(this, options));
		return this;
	};
}(jQuery));
jQuery(function() {
	initMobileNav();
	initCustomHover();
	initSlickCarousel();
});


// mobile menu init
function initMobileNav() {
	jQuery('body').mobileNav({
		menuActiveClass: 'nav-active',
		menuOpener: '.nav-opener',
		hideOnClickOutside: true,
		menuDrop: '.nav-drop'
	});
}

// add classes on hover/touch
function initCustomHover() {
	jQuery('.user-holder').touchHover({});
}


// slick init
function initSlickCarousel() {
	jQuery('.slider').slick({
		slidesToScroll: 1,
		rows: 0,
		arrows: false,
		dots: true,
		dotsClass: 'slick-dots',
		responsive: [{
			breakpoint: 1024,
			settings: {
				slidesToScroll: 1
			}
		}]
	});
}
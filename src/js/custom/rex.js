$(document).ready(function(){
	resize_boxes();
	$(window).on('resize', function(){
		resize_boxes();
	});
});

function resize_boxes(){
	$('.block').each(function(index){
		var $this = $(this);
		var w = $this.width();
		$this.css({
			'height': w + 'px', 
			'min-height': 'auto'
		});
	});
}
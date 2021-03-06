
module.exports = function() {

	function init() {
		console.log('scrollSsection');

		$s('.cv-section')
		.each(function(i, len){
			var $this = $s(this);
			$this
				.force(true)
				.transform()
					.start(function(){
						return 124 + (i * $this.height());
					})
					.end(function(){
						return 124 + ((i + 1) * $this.height());
					})
					.opacity({
						opacity : [0,1]
					})
					.translateX({
						tx : [
							function() {
								return (i % 2 === 0) ? $s.windowWidth() * 2 : -($s.windowWidth() * 2);
							},
							0
						]
					}, $s.easing.easeInOutCirc)
		});

    }

    return {
        init: init
    };

}

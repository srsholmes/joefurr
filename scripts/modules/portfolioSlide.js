
module.exports = function() {

	function init() {
		console.log('Portoflio Slide');

		ƒ('.slides').each(function(el, i) {
			var ƒthis = ƒ(this);
			var firstSlide = ƒ(el).find('li:first-child').clone();
			var lastSlidePosition = ƒ(el).find('li').length;
			//last slide position is length -1 as array notation starts from 0 and length starts from 1.
			//last child selector doesnt seem to work.
			var lastSlide = ƒ(el).find('li')[lastSlidePosition - 1];
			console.log('first child' , firstSlide);
			console.log('last child ' , lastSlide);

			//Bug in hDOM with append/prepend. It doesn't work quite as intended if used liek this. 
			// ƒthis.append(firstSlide);
			// ƒthis.prepend(lastSlide);






		});

    }

    return {
        init: init
    };

}

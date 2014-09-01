
module.exports = function() {

	function init() {
		console.log('Portoflio Slide');

		ƒ('.slides').each(function(el, i) {
			var ƒthis = ƒ(this);
			// console.log(el);
			var firstSlide = ƒ(el).find('li:first-child').clone();
			var lastSlide = ƒ(el).find('li:last-child');
			// console.log(lastSlide);
			// ƒthis.append(firstSlide);

			var newList = ƒ(this).find('li:first-child');
			console.log(newList);
			newList.prepend(lastSlide);

			//Bug in hDom where if you append and then prepend you need to re select otherwise is replaces the appended/prepended item
			// ƒthis.prepend(firstSlide);


			// var lastSlide = ƒ(el).find(':last-child');
		});

    }

    return {
        init: init
    };

}

var ƒ = require('hdom');
var $s = require('scran');
var Slider = require('./modules/slider')(ƒ);
var scrollSection = require('./modules/scrollSection')(ƒ);
var utils = require('./modules/utils')(ƒ);


ƒ(function() {
   

	utils.init();

	if(ƒ('body').hasClass('index')){
		//Check if mobile
		if(utils.mobilecheck()){

		}else {
			scrollSection.init();
		}

    }

   	if(ƒ('body').hasClass('portfolio')){
       // scrollSection.init();
       	Slider.init();

    }

});
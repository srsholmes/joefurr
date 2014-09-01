var ƒ = require('hdom');
var $s = require('scran');
var scrollSection = require('./modules/scrollSection')(ƒ);
var portfolioSlide = require('./modules/portfolioSlide')(ƒ);


ƒ(function() {
   
	console.log('hello my joe');

	if(ƒ('body').hasClass('index')){
       scrollSection.init();
    }

   	if(ƒ('body').hasClass('portfolio')){
       // scrollSection.init();
       portfolioSlide.init();
    }

});
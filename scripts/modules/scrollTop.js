var Interpol = require('interpol');

module.exports = function() {
    function init() {
        console.log('scroll top');
        ƒ('.go-to-top').bind('click', function(event) {
            var top = (window.pageYOffset || document.scrollTop)  - (document.clientTop || 0);
            console.log(top);
            Interpol.tween()
                .from(top)
                .to(0)
                .ease(Interpol.easing.easeInOutCirc)
                .step(function(val) {
                    window.scrollTo(0, val)
                })                
                .start();
        });
    }

    return {
        init: init
    };

}

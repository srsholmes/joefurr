var Interpol = require('interpol'),
    Matrix2D = require('matrix2d');

module.exports = function(ƒ,w,d) {


    function init(){

      ƒ('[slider]').each(function(el, i) {
            /*
             * Hoist variables.
             */
            var ƒWrapper = ƒ(el),
                ƒUl = ƒWrapper.find('ul.slider'),

                ƒLis = ƒUl.find('li'),
                ƒfirstClone = ƒLis.get(0).clone(true),
                ƒlastClone = ƒLis.get(-1).clone(true),
                liLength = ƒUl.find('li').length,
                position = ƒWrapper.hasClass('catchup') ? 2 : 1,
                canTransition = true,
                timeoutVal = ƒWrapper.attr('autoplay'),
                timeout;

            var next = ƒWrapper.find('.nav-left');
            var prev = ƒWrapper.find('.nav-right');
            var currentCounter = ƒWrapper.find('span.current');
            var totalCounter = ƒWrapper.find('span.total');
            totalCounter[0].innerText = liLength;

            ƒfirstClone.addClass('first-clone');
            ƒlastClone.addClass('last-clone');

            /*
             * Function to determine an elements width
             */

            function elementWidth(el) {
                var rect = el.getBoundingClientRect();
                return rect.right - rect.left;
            }

            function _getFirstSupported(arr) {
               var div = document.createElement('div');
               var ven = null;
               arr.forEach(function(vendor) {
                    if (typeof div.style[vendor] !== 'undefined') ven = vendor;
               });

               return ven;
            }

            var CSS_TRANSFORM = (function() {
               var arr = ' ms Moz Webkit O'.split(' ').map(function(prefix) {
                   return prefix === '' ? 'transform' : prefix + 'Transform';
               });
               return _getFirstSupported(arr);
            })();

            /*
             * Render function
             */
            function render() {
                ƒUl[0].style[CSS_TRANSFORM] = "translateX(" + -(position * elementWidth(ƒWrapper[0])) + "px)";
            }

            function move(direction) {
                var dir = direction,
                    dLi = ƒUl.find('li');

                return function() {
                    if (timeout) clearTimeout(timeout);
                    if (!canTransition) return;
                    canTransition = false;
                    var to,
                        currentValue = parseInt(/\((.+)\)/g.exec(ƒUl[0].style[CSS_TRANSFORM])[1], 10); // ? NaN

                    if (isNaN(dir)) {
                        /*
                         * dir is `next` or `prev` from a swipe
                         */
                        var oldPos = position;
                        to = dir === 'next' ? currentValue - elementWidth(ƒWrapper[0]) : currentValue + elementWidth(ƒWrapper[0]);
                        position = dir === 'next' ? position + 1 : position - 1;


                    } else {
                        /*
                         * dir is a Number from tapping a nubbin
                         */
                        position = dir;
                        to = -(position * elementWidth(ƒWrapper[0]));
                    }
                    /*
                     *  Reset the position properly for infinite looping
                     */
                    var actualPos = position < 1 ? liLength : position > liLength  ? 1 : position;

                    Interpol.tween()
                        .from(currentValue)
                        .to(to)
                        .ease(Interpol.easing.easeInOutCirc)
                        .step(function(val) {
                            // ƒUl[0].style.marginLeft = val + 'px';
                            ƒUl[0].style[CSS_TRANSFORM] = "translateX(" + val + "px)";
                        })
                        .complete(function() {
                            canTransition = true;
                            position = actualPos;
                            render();                        
                        })
                        .start();


                        currentCounter[0].innerText = actualPos;
                };
            }

            /*
             * Add listeners for our custom events.
             */

            ƒWrapper.bind('swipeleft', move('next'));
            ƒWrapper.bind('swiperight', move('right'));

            //Buttons for left and right arrows on second slider.

            if (next && prev) {
                next.bind('click', move('prev'));
                prev.bind('click', move('next'));
            }

            ƒLis[0].parentNode.insertBefore(ƒlastClone[0], ƒLis[0]);
            ƒUl[0].appendChild(ƒfirstClone[0]);


            render();

            window.addEventListener('resize', render);
        });

    }

     return {
        init: init
    };

};
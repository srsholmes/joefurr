var Interpol = require('interpol'),
    Matrix2D = require('matrix2d');

module.exports = function(ƒ) {


    function init() {
        console.log('slider sinit');

        ƒ('[slider]').each(function(el, i) {
            /*
             * Hoist variables.
             */
            var ƒWrapper = ƒ(el),
                ƒUl = ƒWrapper.find('ul.slider'),
                ƒNubbins = ƒWrapper.find('.nubbins'),
                ƒNubbinsUl = ƒNubbins.find('ul'),
                ƒNubbinsLi = ƒNubbinsUl.find('li'),
                ƒfirstClone = ƒUl.find('li:first-child').clone(),
                ƒlastClone = ƒUl.find('li:last-child').clone(),
                liLength = ƒUl.find('li').length,
                position = ƒWrapper.hasClass('catchup') ? 2 : 1,
                canTransition = true,
                timeoutVal = ƒWrapper.attr('autoplay'),
                timeout;

            var next = ƒWrapper[0].parentNode.querySelector('[next]');
            var prev = ƒWrapper[0].parentNode.querySelector('[prev]');

            ƒfirstClone.addClass('first-clone');
            ƒlastClone.addClass('last-clone');
            /*
             * Function to determine an elements width
             */
            function elementWidth(el) {
                var rect = el.getBoundingClientRect();
                return rect.right - rect.left;
            }

            /*
             * Render function
             */
            function render() {
                ƒUl[0].style.marginLeft = -(position * elementWidth(ƒWrapper[0])) + 'px';
                if (timeoutVal) timeout = setTimeout(move('next'), parseInt(timeoutVal, 10));
            }

            function move(direction) {
                var dir = direction,
                    dLi = ƒUl.find('li');

                return function() {
                    if (timeout) clearTimeout(timeout);
                    if (!canTransition) return;
                    canTransition = false;
                    var to,
                        currentValue = parseInt(ƒUl[0].style.marginLeft, 10);

                    if (isNaN(dir)) {
                        /*
                         * dir is `next` or `prev` from a swipe
                         */
                        var oldPos = position;
                        to = dir === 'next' ? currentValue - elementWidth(ƒWrapper[0]) : currentValue + elementWidth(ƒWrapper[0]);
                        position = dir === 'next' ? position + 1 : position - 1;

                        // if (position < 0 || position > liLength - 1) {
                        //     canTransition = true;
                        //     position = oldPos;
                        //     return;
                        // }
                    } else {
                        /*
                         * dir is a Number from tapping a nubbin
                         */
                        position = dir;
                        to = -(position * elementWidth(ƒWrapper[0]));
                    }

                    // if (next && prev) {
                    //     if (position === (liLength - 1)) {
                    //         ƒ(next).addClass('hide');
                    //         ƒ(prev).removeClass('hide');
                    //     } else if (position === 0){
                    //         ƒ(prev).addClass('hide');
                    //         ƒ(next).removeClass('hide');
                    //     }
                    // }

                    /*
                     *  Reset the position properly for infinite looping
                     */
                    var actualPos = position < 1 ? liLength : position > liLength  ? 1 : position;

                    /*
                     * Reset and select the corrent nubbin
                     */
                    for (var j = 0; j < ƒNubbinsLi.length; j++) {
                        var dNub = ƒNubbinsLi[j];
                        dNub.className = actualPos === (j + 1) ? 'active' : '';
                    }

                    /*
                     * Interpol leverages requestAnimationFrame to create smooth
                     * interpolation of values. Essentially each step we take the
                     * value of the interpolation and set the margin left of the list
                     * to the value.
                     */
                    Interpol.tween()
                        .from(currentValue)
                        .to(to)
                        .ease(Interpol.easing.easeInOutCirc)
                        .step(function(val) {
                            ƒUl[0].style.marginLeft = val + 'px';
                        })
                        .complete(function() {
                            //Needs some logic to detect when it is the end of the slide

                            canTransition = true;
                            position = actualPos;
                            render();

                        
                        })
                        .start();
                };
            }

            for (var j = 1; j < liLength; j++) {
                ƒNubbinsUl[0].appendChild(ƒNubbinsLi[0].cloneNode(true));
            }
            ƒNubbinsLi = ƒNubbinsUl.find('li');
            ƒNubbinsLi[position - 1].className = 'active';
            for (var k = 0; k < ƒNubbinsLi.length; k++) {
                var dNub = ƒNubbinsLi[k];
                dNub.addEventListener('tap', move(k + 1));
                dNub.addEventListener('click', move(k + 1));
            }



            /*
             * Add listeners for our custom events.
             */


            ƒWrapper.bind('swipeleft', move('next'));
            ƒWrapper.bind('swiperight', move('right'));

            //Buttons for left and right arrows on second slider.

            if (next && prev) {
                ƒ(next).bind('click', move('next'));
                ƒ(prev).bind('click', move('prev'));
            }

            ƒUl.prepend(ƒlastClone);
            ƒUl.append(ƒfirstClone);

            // ƒ('.arrow-nav-selfie a.icon-arrow-right').bind('click', move('next'));
            // ƒ('.arrow-nav-selfie a.icon-arrow-left').bind('click', move('right'));

            render();


            /*
             * Listen to the window resize event to determine if the
             * width of the wrapper has changed.
             */
            window.addEventListener('resize', render);
        });

    }


    return {
        init: init
    };

};
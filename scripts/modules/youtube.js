var d = document,
    w = window;

module.exports = function(ƒ) {

    var ƒhVideo = ƒ('.home-video'),
        ƒplayBtn = ƒhVideo.find('.play'),
        videoId = ƒhVideo.attr('video-id'),
        readyFn = [], ytReady = false,
        isPlaying = false;


    w.onYouTubePlayerAPIReady = function() {
        ytReady = true;
        while (readyFn.length) {
            readyFn.shift()();
        }
    };

    (function(){
        var s = d.createElement('script');
        s.src ='//www.youtube.com/player_api';
        d.head.appendChild(s);
    })();

    function init() {
        ƒplayBtn.bind('click', function(e) {
            e.preventDefault();
            if (isPlaying) return;
            isPlaying = true;

            var iframe = _buildIframe();
            
            ƒhVideo.append(iframe);
            
            _ready(_definePlayer(iframe));
        });
    }

    function _buildIframe() {
        var iframe = d.createElement('iframe');
        iframe.id = 'yt_' + videoId;
        iframe.src = 'http://www.youtube.com/embed/' + videoId + '?autoplay=1&enablejsapi=1&controls=0&modestbranding=1&showinfo=0';
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.pointerEvents = 'auto';
        return iframe;
    }

    function _definePlayer(iframe) {
        return function() {
            var player = new YT.Player('yt_' + videoId, {
                events: {
                    'onStateChange': function(e) {
                        if (e.data === 0) {
                            iframe.parentNode.removeChild(iframe);
                            iframe = undefined;
                            isPlaying = false;
                        }
                    }
                }
            });
        }
    }

    function _ready(fn) {
        if (ytReady) {
            fn();
            return;
        }
        readyFn.push(fn);
    }
    
    return {
        init: init
    };

}


(function ($) {

    $.fn.smoothScroll = function (options) {

        return this.each(function () {

            var opts = $.extend({}, $.fn.smoothScroll.defaults, options);

            this.onmousewheel = function (e) {
                var control = opts.target ? opts.target : this;

                scroll(e, opts, control);
            }
        });

        var animandoScroll = false;
        function scroll(e, opts, control) {
            e = e || window.event;
            if (e.preventDefault)
                e.preventDefault();
            e.returnValue = false;

            if (!animandoScroll) {
                var t = opts.delta ? opts.delta : (e.wheelDeltaY < 0 ? e.wheelDeltaY * (-1) : e.wheelDeltaY);
                var snap = opts.snap;
                var speed = opts.speed;

                var scrollPos = $(control).scrollTop();
                var delta = e.wheelDeltaY < 0 ? t : t * (-1);
                var resto = scrollPos % t;

                if (snap) {
                    if (resto == 0)
                        scrollPos += delta;
                    else if (delta < 0)
                        scrollPos -= resto;
                    else if (delta > 0)
                        scrollPos += t - resto;
                } else {
                    scrollPos += delta;
                }

                animandoScroll = true;
                $(control).stop().animate({ scrollTop: scrollPos }, speed, function () { animandoScroll = false; });
            }
        }
    }


    $.fn.smoothScroll.defaults = {
        delta: null,
        snap: false,
        speed: 400,
        target: null
    }

})(jQuery);
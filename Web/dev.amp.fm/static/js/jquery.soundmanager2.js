(function ($) {
    $.playable = function (url, settings) {
        var sm = soundManager,
        playable = arguments.callee;
        sm.url = url;
        sm.consoleOnly = window.location.hash.match(/console$/i);
        sm.debugMode = window.location.hash.match(/^#debug/i);
        $.extend(sm.defaultOptions, {
            autoStart: false,
            autoNext: true,
            pauseSkip: true,
            playAlone: true,
            doUnload: false,
            css: {
                playable: 'playable',
                playing: 'playing',
                paused: 'paused'
            },
            onload: function () {
                if (this.readyState == 2)
                playable.next.call(this);
            },
            onplay: function () {
                var options = this.options,
                current = options.element.removeClass(options.css.paused).addClass(options.css.playing).focus();
                if (playable.current && playable.current != current)
                playable.current.data('playable')[options.pauseSkip? 'pause': 'stop']();
                if (options.playAlone)
                playable.current = current;
            },
            onstop: function () {
                var options = this.options;
                options.element.removeClass(options.css.playing + ' ' + options.css.paused);
                if (options.doUnload)
                this.unload();
            },
            onpause: function () {
                var options = this.options;
                options.element.removeClass(options.css.playing).addClass(options.css.paused);
            },
            onresume: function () {
                this.options.onplay.call(this);
            },
            onfinish: function () {
                var options = this.options;
                if (options.autoNext)
                playable.next.call(this);
                options.onstop.call(this);
            }
        },
        settings);
        $.extend(playable, {
            count: 0,
            current: null,
            init: function (options) {
                var self = this, options = $.extend(true, {
                },
                sm.defaultOptions, options);
                this.addClass(options.css.playable).click(function (event) {
                    event.preventDefault();
                    $(this).data('playable').togglePause();
                }).each(function () {
                    $(this).data('playable', sm.createSound($.extend({
                        id: 'playable' + playable.count++,
                        url: this.href,
                        element: $(this),
                        selector: self.selector
                    },
                    options)));
                });
                if (options.autoStart)
                self.filter(':first').click();
            },
            next: function () {
                var options = this.options,
                next = $(options.element).next(options.selector).data('playable');
                if (next && ! next.playState)
                next.play();
            }
        });
    };
    $.fn.playable = function (options) {
        var self = this.is('a[href]')? this: this.find('a[href]');
        soundManager.onload = function () {
            if (soundManager.canPlayURL(self.attr('href')))
            $.playable.init.call(self, options);
        };
    };
})(jQuery);
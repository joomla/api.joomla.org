if (typeof jQuery === 'undefined') {
    throw new Error('JoomlaApi JavaScript requires jQuery')
}

!function (jQuery, window, document, navigator) {
    'use strict';

    jQuery.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());
    jQuery.browser.ipad = /ipad/.test(navigator.userAgent.toLowerCase());

    var JoomlaApi = window.JoomlaApi = {
        navTop: null,
        isFixed: false,

        /**
         * Initializes page contents for progressive enhancement.
         */
        initializeContents: function () {
            // hide all more buttons because they are not needed with JS
            jQuery('.element a.more').hide();

            // make the entire element linkable
            jQuery('.clickable.class,.clickable.interface,.clickable.trait').click(function () {
                document.location = jQuery('a.more', this).attr('href');
            });

            // change the cursor to a pointer to make it more explicit that this it clickable
            // do a background color change on hover to emphasize the clickability eveb more
            // we do not use CSS for this because when JS is disabled this behaviour does not
            // apply and we do not want the hover
            // @TODO - Add .element.function and .element.constant back into this when they have proper pages
            jQuery('.element.method, .element.class.clickable, .element.interface.clickable, .element.trait.clickable, .element.property.clickable, .element.function.clickable, .element.constant.clickable')
                .css('cursor', 'pointer')
                .hover(function () {
                    jQuery(this).css('backgroundColor', '#F8FDF6')
                }, function () {
                    jQuery(this).css('backgroundColor', 'white')
                });

            jQuery('ul.side-nav.nav.nav-list li.nav-header').contents()
                .filter(function () {
                    return this.nodeType === 3
                })
                .wrap('<span class="side-nav-header" />');

            // do not show tooltips on iPad; it will cause the user having to click twice
            if (!jQuery.browser.ipad) {
                jQuery('.btn-group.visibility, .btn-group.type-filter').tooltip({'placement': 'bottom'});
                jQuery('.element').tooltip({'placement': 'left'});
            }

            jQuery('.btn-group.visibility, .btn-group.type-filter').show().find('button').find('i').click(function () {
                jQuery(this).parent().click();
            });

            // set the events for the visibility buttons and enable by default.
            jQuery('.visibility').on('click', 'button.public', function () {
                jQuery('.element.public, .side-nav li.public').toggle(jQuery(this).hasClass('active'));
            }).on('click', 'button.protected', function () {
                jQuery('.element.protected, .side-nav li.protected').toggle(jQuery(this).hasClass('active'));
            }).on('click', 'button.private', function () {
                jQuery('.element.private, .side-nav li.private').toggle(jQuery(this).hasClass('active'));
            }).on('click', 'button.inherited', function () {
                jQuery('.element.inherited, .side-nav li.inherited').toggle(jQuery(this).hasClass('active'));
            });

            jQuery('.visibility button.public').click();
            jQuery('.visibility button.protected').click();
            jQuery('.visibility button.private').click();
            jQuery('.visibility button.inherited').click();

            jQuery('.type-filter').on('click', 'button.critical', function () {
                jQuery('tr.critical').toggle(jQuery(this).hasClass('active'));
            }).on('click', 'button.error', function () {
                jQuery('tr.error').toggle(jQuery(this).hasClass('active'));
            }).on('click', 'button.notice', function () {
                jQuery('tr.notice').toggle(jQuery(this).hasClass('active'));
            });

            jQuery('ul.side-nav.nav.nav-list li.nav-header span.side-nav-header').css('cursor', 'pointer').click(function () {
                jQuery(this).siblings('ul').collapse('toggle');
            });
        },

        /**
         * Filter a path
         *
         * @param {String} string
         * @returns {String}
         */
        filterPath: function (string) {
            return string
                .replace(/^\//, '')
                .replace(/(index|default).[a-zA-Z]{3,4}$/, '')
                .replace(/\/$/, '');
        },

        /**
         * Initialize the scroll listeners
         */
        processScrollInit: function () {
            var subnavWrapper = jQuery('.subnav-wrapper');

            if (subnavWrapper.length) {
                JoomlaApi.navTop = subnavWrapper.length && subnavWrapper.offset().top - 30;

                // Fix the container top
                jQuery('.body .container-main').css('top', subnavWrapper.height() + jQuery('#mega-menu').height());

                // Only apply the scrollspy when the toolbar is not collapsed
                if (document.body.clientWidth > 480) {
                    var subnav = jQuery('.subnav');

                    subnavWrapper.height(subnav.outerHeight());
                    subnav.affix({
                        offset: {top: subnav.offset().top - jQuery('nav.navbar').height()}
                    });
                }
            }
        },

        /**
         * Event for when the page is scrolled
         */
        processScroll: function () {
            var subnav = jQuery('.subnav-wrapper');

            if (subnav.length) {
                var scrollTop = jQuery(window).scrollTop();

                if (scrollTop >= JoomlaApi.navTop && !JoomlaApi.isFixed) {
                    JoomlaApi.isFixed = true;
                    subnav.addClass('subhead-fixed');

                    // Fix the container top
                    jQuery('.body .container-main').css('top', subnav.height() + jQuery('#mega-menu').height());
                } else if (scrollTop <= JoomlaApi.navTop && JoomlaApi.isFixed) {
                    JoomlaApi.isFixed = false;
                    subnav.removeClass('subhead-fixed');
                }
            }
        },

        /**
         * Find the first scrollable element
         *
         * @param {*} els
         * @returns {*}
         */
        scrollableElement: function (els) {
            for (var i = 0, argLength = arguments.length; i < argLength; i++) {
                var el = arguments[i],
                    $scrollElement = jQuery(el);

                if ($scrollElement.scrollTop() > 0) {
                    return el;
                }

                $scrollElement.scrollTop(1);

                var isScrollable = $scrollElement.scrollTop() > 0;

                $scrollElement.scrollTop(0);

                if (isScrollable) {
                    return el;
                }
            }

            return [];
        }
    };

    jQuery(document).ready(function () {
        prettyPrint();
        JoomlaApi.initializeContents();
        JoomlaApi.processScrollInit();
        JoomlaApi.processScroll();

        // do not show tooltips on iPad; it will cause the user having to click twice
        if (!jQuery.browser.ipad) {
            jQuery('.side-nav a').tooltip({'placement': 'top'});
        }

        // chrome cannot deal with certain situations; warn the user about reduced features
        if (jQuery.browser.chrome && (window.location.protocol == 'file:')) {
            jQuery('body > .container').prepend(
                '<div class="alert alert-error"><a class="close" data-dismiss="alert">×</a>' +
                'You are using Google Chrome in a local environment; AJAX interaction has been ' +
                'disabled because Chrome cannot <a href="http://code.google.com/p/chromium/issues/detail?id=40787">' +
                'retrieve files using Ajax</a>.</div>'
            );
        }

        var locationPath = JoomlaApi.filterPath(location.pathname);

        // the ipad already smoothly scrolls and does not detect the scrollable
        // element if top=0; as such we disable this behaviour for the iPad
        if (!jQuery.browser.ipad) {
            jQuery('a[href*=#]').each(function () {
                var thisPath = JoomlaApi.filterPath(this.pathname) || locationPath;
                if (locationPath == thisPath && (location.hostname == this.hostname || !this.hostname) && this.hash.replace(/#/, '')) {
                    var target = decodeURIComponent(this.hash.replace(/#/, ''));
                    // note: I'm using attribute selector, because id selector can't match elements with '$'
                    var $target = jQuery('[id="' + target + '"]');

                    if ($target.length > 0) {
                        jQuery(this).click(function (event) {
                            var scrollElem = JoomlaApi.scrollableElement('html', 'body'),
                                targetOffset = $target.offset().top;

                            event.preventDefault();
                            jQuery(scrollElem).animate({scrollTop: targetOffset}, 400, function () {
                                location.hash = target;
                            });
                        });
                    }
                }
            });
        }

        // Hide API Documentation menu if it's empty
        jQuery('.subnav .dropdown a[id=api]').next().filter(function (el) {
            if (jQuery(el).children().length == 0) {
                return true;
            }
        }).parent().hide();
    });
}(jQuery, window, document, navigator);

if (typeof jQuery === 'undefined') {
    throw new Error('JoomlaApi JavaScript requires jQuery')
}

window.Joomla=window.Joomla||{}

!function (jQuery, window, document) {
    'use strict';

    var JoomlaApi = window.JoomlaApi = {
        navTop: null,
        isFixed: false,

        /**
         * Initializes page contents for progressive enhancement.
         */
        initializeContents: function () {
            // hide all more buttons because they are not needed with JS
            jQuery('.element__details').hide();

            // make the entire element linkable
            jQuery('.element--clickable.element--class, .element--clickable.element--interface, .element--clickable.element--trait').click(function () {
                document.location = jQuery('.element__details', this).attr('href');
            });

            // change the cursor to a pointer to make it more explicit that this it clickable
            // do a background color change on hover to emphasize the clickability eveb more
            // we do not use CSS for this because when JS is disabled this behaviour does not
            // apply and we do not want the hover
            jQuery('.node--clickable.node--method, .element--clickable.element--class, .element--clickable.element--interface, .element--clickable.element--trait, .element--clickable.element--function, .element--clickable.element--constant, .node--clickable.node--property, .node--clickable.node--function, .node--clickable.node--constant')
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

            jQuery('.btn-group.visibility, .btn-group.type-filter').show().find('button').find('i').click(function () {
                jQuery(this).parent().click();
            });

            // set the events for the visibility buttons and enable by default.
            jQuery('.visibility').on('click', 'button.public', function () {
                jQuery('.node--visibility-public, .side-nav li.public').toggle(jQuery(this).hasClass('active'));
            }).on('click', 'button.protected', function () {
                jQuery('.node--visibility-protected, .side-nav li.protected').toggle(jQuery(this).hasClass('active'));
            }).on('click', 'button.private', function () {
                jQuery('.node--visibility-private, .side-nav li.private').toggle(jQuery(this).hasClass('active'));
            }).on('click', 'button.inherited', function () {
                jQuery('.node--inherited, .side-nav li.inherited').toggle(jQuery(this).hasClass('active'));
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
    };

    jQuery(document).ready(function () {
        JoomlaApi.initializeContents();
        JoomlaApi.processScroll();
    });
}(jQuery, window, document, navigator);

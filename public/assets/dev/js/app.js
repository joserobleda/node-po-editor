define(function () {
	'use strict';
	
    // if some lib require jquery, make sure is from the same source we had in our html
    require.config({
        paths: {
            jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min'
        }
    });

    var strings = $('#strings');
    var toolbar = $('#toolbar');
    var editor  = toolbar.find('#editor');

    var App = {
        active: null
    };

    var wysiHtml5ParserRules = {
        tags: {
            strong: {},
            b:      {},
            i:      {},
            em:     {},
            br:     {},
            p:      {},
            div:    {},
            span:   {},
            ul:     {},
            ol:     {},
            li:     {},
            a:      {
                set_attributes: {
                    target: "_blank",
                    rel:    "nofollow"
                },
                check_attributes: {
                    href:   "url" // important to avoid XSS
                }
            }
        }
    };

    function bindEvents (ctx) {
        ctx = ctx || document.body;

        $(ctx).find('form.save').submit(function (e) {
            e.preventDefault();

            var form = $(this);
            var data = form.serializeArray();

            // update row
            $(App.active).find('div:last').html(data[0].value);

            $.post(this.action, data, function (res) {
                form.replaceWith(res);

                // re-bind events
                bindEvents(editor);

                setTimeout(function () {
                    var next = $(App.active).next('li');
                    if (next.length) {
                        location.hash = $(App.active).next('li').attr('id');
                    }
                }, 300);
            });
        });

        $(ctx).find('textarea').each(function () {
            var editor = new wysihtml5.Editor(this, {
                toolbar:      "editor-tools",
                parserRules:  wysiHtml5ParserRules
            });
        })

        // async autofocus
        $(ctx).find('[autofocus]').focus();
    };


    /***
       * Selects a string
       *
       *
       */
    function setAsActive (dom) {
        $('.active').removeClass('active')
        dom.addClass('active');

        App.active = dom;
    }


    /***
       *
       *
       *
       */
    function pick (dom) {
        var slug    = dom.attr('id');
        var a       = document.createElement('a');
        a.href      = location.href;
        var URL     = a.pathname + '/' + location.hash.replace('#', '');

        // change layout
        setAsActive(dom);
        toolbar.show();

        // query server for edit form
        $.get(URL, function (res) {
            toolbar.removeClass('loading');

            editor.html(res);

            bindEvents(editor);
        });
    }


    /***
       *
       *
       *
       */
    function pickFromHash () {
        var hash, id, dom;

        id      = location.hash;
        hash    = location.hash.replace('#', '')

        if (location.hash.length == 1) {
            return false;
        }

        dom = $(id);
        if (dom.length) {
            pick(dom);
        }
    };

    // detect hash changes
    window.onhashchange = pickFromHash;

    // first loading
    pickFromHash();

    if (location.hash == '') {
        var first = $("ul#strings li:first");

        if (first.length) {
            location.hash = first.attr('id');
        }
    }

    // strings click
    strings.on('click', 'li', function (e) {
        e.preventDefault();
        location.hash = $(this).attr('id');
    })

    // keys based on this selector
    require(['keys'], function (Keys) {
        Keys.init('ul#strings li');
    });
   
    return App;
});
define(function () {
	'use strict';
	
    var strings = $('#strings');
    var toolbar = $('#toolbar');
    var editor  = toolbar.find('#editor');

    var App = {
        active: null
    };

    function bindEvents (ctx) {
        ctx = ctx || document.body;

        $(ctx).find('form').submit(function (e) {
            e.preventDefault();

            var form = $(this);

            $.post(this.action, form.serialize(), function (res) {
                form.replaceWith(res);

                // re-bind events
                bindEvents(editor);
            });
        });

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
        var URL     = location.href.replace('#', '/');

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
(function (w, undefined) {
	'use strict';
	
    var strings = $('#strings');
    var toolbar = $('#toolbar');
    var editor  = toolbar.find('#editor');
    var active  = null;


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

        active = dom;
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


    // ---- keys shortcuts
    function keyUp (e) {
        var prev, slug;

        e.preventDefault();

        if (!active) {
            slug = $('ul#strings li:last');
        } else {
            if (prev = active.prev('li')) {
                slug = prev.attr('id');
            } else {
                // restart the list
                slug = $('ul#strings li:last');
            }
        }

        location.hash = slug;
    };

    function keyDown (e) {
        var next, slug;

        e.preventDefault();

        if (!active) {
            slug = $('ul#strings li:first');
        } else {
            if (next = active.next('li')) {
                slug = next.attr('id');
            } else {
                // restart the list
                slug = $('ul#strings li:first');
            }
        }

        location.hash = slug;
    };


    function keyHandler (e) {
        if (e.keyCode == 40) {
            keyDown(e);
        }

        if (e.keyCode == 38) {
            keyUp(e);
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

    $(document).on('keydown', keyHandler);

}(window))
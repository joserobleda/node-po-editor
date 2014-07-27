define(['app'], function (App) {

    function Keys (selector) {

        function keyUp (e) {
            var prev, slug;

            e.preventDefault();

            if (!App.active) {
                slug = $(selector + ':last').attr('id');
            } else {
                prev = App.active.prev('li');
                if (prev.length) {
                    slug = prev.attr('id');
                } else {
                    // restart the list
                    slug = $(selector + ':last').attr('id');
                }
            }

            location.hash = slug;
        };


        function keyDown (e) {
            var next, slug;

            e.preventDefault();

            if (!App.active) {
                slug = $(selector + ':first').attr('id');
            } else {
                next = App.active.next('li')
                if (next.length) {
                    slug = next.attr('id');
                } else {
                    // restart the list
                    slug = $(selector + ':first').attr('id');
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


        $(document).on('keydown', keyHandler);
    }

    Keys.init = function (selector) {
        return new Keys(selector);
    };

    return Keys;
});
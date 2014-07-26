
	var app		= require('neasy');
	var Model 	= require('neasy/model');
    var PO      = require('pofile');
    var slugs   = require("slugs")

	var Trans = Model.extend({

        po: null,

        initialize: function () {
            lang = this.get('lang') + '.utf8';
            file = this.get('file') + '.po';

            this.set('path', [this.constructor.root, lang, this.constructor.category, file].join('/'));
        },

        getPath: function () {
            return '/' + [this.get('lang'), this.get('file')].join('/');
        },

        findSlug: function (slug) {
            if (this.po == null) {
                return false;
            }

            for (var i in this.po.items) {
                if (slug === this.po.items[i].slug) {
                    return this.po.items[i];
                }
            }

            return false;
        },


        load: function (cb) {
            var self, path, slug;

            self    = this;
            path    = this.getPath();
            cb      = cb || function () {};

            PO.load(this.get('path'), function (err, po) {
                if (err) {
                    return cb.call(self, err);
                }

                self.po = po;

                for (var i in self.po.items) {
                    slug = slugs(self.po.items[i].msgid);

                    // not saved (updated) by default
                    self.po.items[i].saved = false;

                    // web-ready id
                    self.po.items[i].slug = slug;

                    // absolute path to web root
                    self.po.items[i].path = path + '/' + slug;
                }

                return cb.call(self);
            });
        },


        save: function (cb) {
            var self;

            self    = this;
            cb      = cb || function () {};

            this.po.save(this.get('path'), function (err) {
                if (err) {
                    return cb.call(self, err);
                }

                return cb.call(self);
            });
        },


        updateString: function (item, strings) {
            item.msgstr = strings;
        },

        toArray: function () {
            if (this.po == null) {
                return [];
            }

            var model = {
                'updated':      this.po.headers['PO-Revision-Date'],
                'last_editor':  this.po.headers['Last-Translator'],
                'language':     this.po.headers['Language'],
                'project':      this.po.headers['Project-Id-Version'],
                'strings':      this.po.items
            };

            return model;
        }

	});


    /**
      * category es una constante con nombre que especifica la categoría de las funciones afectadas por la configuración regional:
      *
      * http://php.net/manual/es/function.setlocale.php
      *
      */
    Trans.category = 'LC_MESSAGES';


    /**
      * path in our project
      *
      */
    Trans.root  = '/Users/joseignacio/Sites/dokify/src/locale'


    /**
      * not used in this project, but required for neasy
      * 
      *
      */
    Trans.class = 'trans';


	module.exports = Trans;
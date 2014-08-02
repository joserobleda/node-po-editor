
	var app		= require('neasy');
	var Model 	= require('neasy/model');
    var PO      = require('pofile');
    var slugs   = require("slugs");
    var fs      = require("fs");
    var exec    = require('child_process').exec;


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

        parse: function (cb) {
            var paths, find, xgettext, params, command;

            paths   = this.constructor.xgettext.sources.join(' ');
            find    = 'find ' + paths + ' -iname "*.php"';

            params  = [];
            params.push('--sort-output');
            params.push('--omit-header');
            params.push('--add-comments=notes');
            params.push('--no-location');
            params.push('--language=PHP');
            params.push('--force-po');
            params.push('--from-code=UTF-8');
            params.push('-j ' + this.get('path'));
            params.push('-o ' + this.get('path'));
            xgettext = 'xgettext ' + params.join(' ');

            command = find + ' | xargs ' + xgettext;

            exec(command, function (err, stdout, stderr) {
                console.log(command, err);
                cb(err);
            });
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

        toArray: function (opts) {
            if (this.po == null) {
                return [];
            }

            var model = {
                'updated':      this.po.headers['PO-Revision-Date'],
                'last_editor':  this.po.headers['Last-Translator'],
                'language':     this.po.headers['Language'],
                'project':      this.po.headers['Project-Id-Version'],
                'file':         this.get('file'),
                'strings':      this.po.items
            };

            if (opts && opts.filter) {
                var strings = [];
                for (var i in model.strings) {
                    if (opts.filter(model.strings[i])) {

                        strings.push(model.strings[i]);
                    }
                }

                model.strings = strings;
            }

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
    Trans.root  = app.config.locales.path;


    /**
      * String sources
      *
      */
    Trans.xgettext  = app.config.xgettext;


    /**
      * not used in this project, but required for neasy
      *
      *
      */
    Trans.class = 'trans';


    /**
      * read all the languages
      *
      */
    Trans.getLanguages = function () {
        var folders, languages;

        folders     = fs.readdirSync(Trans.root).sort();
        languages   = [];

        folders.forEach(function (folder) {
            var language = folder.substring(0, folder.indexOf('.'));

            languages.push(language);
        })

        return languages;
    }


    /**
      * read all the languages
      *
      */
    Trans.getFiles = function (lang) {
        var diskFiles, files = [];

        diskFiles = fs.readdirSync(Trans.root + '/' + lang + '.utf8').sort();

        diskFiles.forEach(function (file, i) {
            if (file[0] === '.') {
                return;
            }

            file = file.replace('LC_', '').toLowerCase();
            files.push(file);
        });

        return files;
    }


	module.exports = Trans;
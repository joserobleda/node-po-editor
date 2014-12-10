
var app     = require('neasy');
var Model   = require('neasy/model');
var PO      = require('pofile');
var fs      = require("fs");
var exec    = require('child_process').exec;
var git     = require('gift');
var q       = require('q');
var cli     = require('cli');
var pullRequest = require('../lib/pullrequest');

var Trans = Model.extend({

    po: null,

    initialize: function () {
        var lang = this.get('lang') + '.utf8';
        var file = this.get('file') + '.po';

        this.set('path', [this.constructor.root, lang, this.constructor.category, file].join('/'));
    },

    getPath: function () {
        return '/' + [this.get('lang'), this.get('file')].join('/');
    },

    findSlug: function (slug) {
        var i;

        if (this.po === null) {
            return false;
        }

        for (i in this.po.items) {
            if (slug === this.po.items[i].slug) {
                return this.po.items[i];
            }
        }

        return false;
    },

    parse: function (cb) {
        var self = this;

        function getFileList()
        {
            var defer, fileList, paths, find;

            defer    = q.defer();
            fileList = '/tmp/po-editor-file-list.txt';
            paths    = self.constructor.xgettext.sources.join(' ');
            find     = 'find ' + paths + ' -iname "*.php"';
            command  = find + ' > ' + fileList;

            cli.info('Reading file list of ' + paths);
            exec(command, function (err, stdout, stderr) {
                if (err) {
                    return defer.reject(err);
                }

                return defer.resolve(fileList);
            });

            return defer.promise;
        }

        function getTexts(fileList)
        {
            var defer, command, params, definitions;

            definitions = self.get('path') + '.def.po';
            defer       = q.defer();

            params  = [];
            params.push('--files-from=' + fileList);
            params.push('--sort-output');
            params.push('--add-comments=notes');
            params.push('--no-location');
            params.push('--language=PHP');
            params.push('--force-po');
            params.push('--no-wrap');
            params.push('--from-code=utf-8');
            params.push('-o ' + definitions);

            command = 'xgettext ' + params.join(' ');

            cli.info('Extract texts from ' + fileList);
            exec(command, {maxBuffer: 1000*1024}, function (err, stdout, stderr) {
                if (err) {
                    return defer.reject(err);
                }

                return defer.resolve(definitions);
            });

            return defer.promise;
        }

        function mergeMessages(definitions)
        {
            var defer, tmp, command;

            defer       = q.defer();
            temporary   = self.get('path') + '.temporary';

            command = 'msgmerge --no-wrap --no-fuzzy-matching ' + self.get('path') + ' ' + definitions + ' > ' + temporary;
            cli.info('Merge messages ' + definitions);
            exec(command, function (err, stdout, stderr) {
                if (err) {
                    return defer.reject(err);
                }

                exec('rm ' + definitions, function (err, stdout, stderr) {
                    if (err) {
                        return defer.reject(err);
                    }

                    return defer.resolve(temporary);
                });
            });

            return defer.promise;
        }

        function removeObsoletes(temporary)
        {
            var defer, command;

            defer   = q.defer();
            command = 'msgattrib --no-wrap --output-file=' + self.get('path') + ' --no-obsolete ' + temporary;
            cli.info('Removing obsoletes...');
            exec(command, function (err, stdout, stderr) {
                if (err) {
                    return defer.reject(err);
                }

                exec('rm ' + temporary, function (err, stdout, stderr) {
                    if (err) {
                        return defer.reject(err);
                    }

                    return defer.resolve();
                });
            });

            return defer.promise;
        }


        function parse () {
            var xgettext, params, command, def;

            getFileList().then(function (fileList) {
                return getTexts(fileList);
            }).then(function (definitions) {
                return mergeMessages(definitions);
            }).then(function (temporary) {
                return removeObsoletes(temporary);
            }).then(function () {

                cli.ok('Reparse ok!');
                self.load(function() {
                    self.save();
                });

                cb();
            // if something fails...
            }).catch(function (err) {
                cb(err || new Error());
            });
        }

        if (self.constructor.xgettext.pre) {
            cli.info('Procesing pre "' + self.constructor.xgettext.pre + '"');
            exec(self.constructor.xgettext.pre, function (err, stdout, stderr) {
                if (err || stderr) {
                    return cb(err || stderr);
                }

                parse();
            });
        } else {
            parse();
        }
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
                slug = i;

                // not saved (updated) by default
                self.po.items[i].saved = false;

                // web-ready id
                self.po.items[i].slug = slug;

                // absolute path to web root
                self.po.items[i].path = path + '/' + slug;
            }

            // assuming this means the file is empty, fill with a basic .po headers
            if (self.isEmpty()) {
                var headers = self.constructor.getTemplate(self.get('lang'));

                fs.writeFileSync(self.get('path'), headers);

                // retry load
                return self.load(cb);
            }

            return cb.call(self);
        });
    },


    isEmpty: function () {
        return this.po.headers.Language == '' && this.po.headers['Content-Type'] == '';
    },


    save: function (cb) {
        var self;

        self    = this;
        cb      = cb || function () {};

        if (this.po && this.po.headers && this.po.headers['POT-Creation-Date']) {
            this.po.headers['POT-Creation-Date'] = '';
        }

        this.po.save(this.get('path'), function (err) {
            if (err) {
                return cb.call(self, err);
            }

            self.compile(function () {
                if (err) {
                    return cb.call(self, err);
                }

                return cb.call(self);
            })
        });
    },

    compile: function (cb) {
        var input, output, command;

        input   = this.get('path');
        output  = input.replace('.po', '.mo');
        command = 'msgfmt -v -o '+ output +' ' + input;

        exec(command, function (err, stdout, stderr) {
            cb(err);
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
            'language':     this.get('lang'),
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
Trans.root  = app.config.xgettext.path;


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

/**
  * sync repo with origin
  *
  */
Trans.getStatus = function (cb) {
    if (app.config.github === undefined) {
        return cb(null, {
            clean: true
        });
    }

    var repo = git(app.config.github.path);
    repo.status(function (err, status) {
        cb(err, status);
    });
}


/**
  * sync repo with origin
  *
  */
Trans.sync = function (cb) {
    if (app.config.github === undefined) {
        return cb();
    }

    var repo = git(app.config.github.path);
    repo.sync(function (err) {
        cb(err);
    });
}


/**
  * submit current changes
  *
  */
Trans.createPullRequest = function (username, cb) {
    var branch, message, date, pull;

    // must be enabled
    if (app.config.github == undefined) {
        cb();
        return false;
    }

    date    = (new Date()).toISOString().substring(0, 19).replace(/\:/g, '-');
    branch  = (app.config.github.branch || 'trans') + '-' + date;
    message = (app.config.github.commit || 'updating translations');
    title   = "translations";

    if (username) {
        message = username + " " + message;
        title += " by " + username;
    }

    pull = new pullRequest({
        title: title,
        token: app.config.github.token,
        path: app.config.github.path,
        owner: app.config.github.owner,
        repo: app.config.github.repo,
        branch: branch,
        commit: app.config.github.commit || 'Updating translations',
        author: app.config.github.user
    }, cb);

    return pull;
};


/**
  * a base template for new .po files
  *
  */
Trans.getTemplate = function (lang) {
    var template = '';
    template += 'msgid ""\n';
    template += 'msgstr ""\n';
    template += '"Language: ' + lang + '\\n"\n';
    template += '"MIME-Version: 1.0\\n"\n';
    template += '"Content-Type: text/plain; charset=UTF-8\\n"\n';
    template += '"Plural-Forms: nplurals=2; plural=n == 1 ? 0 : 1;\\n"\n';

    return template;
};

module.exports = Trans;
var git         = require('gift');
var GitHubApi   = require('github');

function pullRequest (opts, cb) {
    var self    = this;
    cb          = cb || function () {};
    this.repo   = git(opts.path);

    github = new GitHubApi({
        version: "3.0.0",
        debug: false
    });

    github.authenticate({
        type: "oauth",
        token: opts.token
    });

    function createPullRequest () {
        var title = opts.title || 'Translations';
        title += " (" + (new Date()).toGMTString() + ")";

        github.pullRequests.create({
            user: opts.owner,
            repo: opts.repo,
            title: title,
            base: 'master',
            head: opts.branch
        }, function (err, res) {
            console.log('pullrequest: ', err);

            // remove branch and get back to master
            self.repo.checkout('master', function () {
                self.repo.delete_branch(opts.branch, function () {
                    console.info('local branch ' + opts.branch + ' deleted');
                });
            });

            return cb(err, res);
        });
    };

    self.branch(opts.branch, function (err) {
        if (err) {
            console.error('checkout: ', err);
            return cb(err);
        }

        self.commit(opts.commit, opts.author, function (err) {
            if (err) {
                console.error('commit: ', err);
                return cb(err);
            }

            self.push(opts.branch, function (err) {
                if (err) {
                    console.error('push: ', err);
                    return cb(err);
                }

                createPullRequest();
            })
        });
    });
}

pullRequest.prototype.branch = function (name, cb) {
    var self = this;

    self.repo.create_branch(name, function (err) {
        self.repo.checkout(name, cb)
    });
};

pullRequest.prototype.commit = function (message, author, cb) {
    this.repo.commit(message, { all: true, author: author }, cb);
}

pullRequest.prototype.push = function (branch, cb) {
    this.repo.remote_push('origin', branch, cb);
}

module.exports = pullRequest;
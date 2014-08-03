var git         = require('gift');
var GitHubApi   = require('github');

function pullRequest (opts) {
    var self    = this;
    this.repo   = git(opts.path);

    // function perform (err) {

    // };

    self.branch(opts.branch, function (err) {
        console.error('checkout: ', err)
        self.commit(opts.commit, opts.author, function (err) {
            console.error('commit: ', err)
            self.push(opts.branch, function () {
                console.error('push: ', err);
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
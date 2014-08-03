var git         = require('gift');
var GitHubApi   = require('github');

function pullRequest (opts, cb) {
    var self    = this;
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
        github.pullRequests.create({
            user: opts.author,
            repo: opts.repo,
            title: opts.pullRequest || 'Translation issues',
            body: "Updating the traslation files",
            base: 'master',
            head: opts.branch
        }, function (err, res) {
            console.log('pullrequest: ', err);
            return cb(err, res);
        });
    };

    self.branch(opts.branch, function (err) {
        console.error('checkout: ', err)
        self.commit(opts.commit, opts.author, function (err) {
            console.error('commit: ', err)
            self.push(opts.branch, function () {
                console.error('push: ', err);

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
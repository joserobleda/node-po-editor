node-po-editor
==============

A web app for edit .po files with github integration, writed in node

### How to install:
1. Make sure you are running node `v0.10.29`
2. Clone the repo
3. npm install
4. node app.js /path/to/config.json

Config file, see `neasy-sample.json`

````
{
    "cookie": {
        "secret": "a-cookie-secret"
    },
    "server": {
        "domain": "localhost",
        "port": 5000
    },
    "locales": {
        "path": "path/to/locale/root/locale"
    },
    "mysql": {
        "host": "localhost",
        "user": "root",
        "password": "secret"
    },
    "httpAuth": {
        "type": "mysql",
        "mysql": {
            "table": "users.table",
            "username": "username.field",
            "password": "password.field",
            "encoding": "mysql.function.like.md5"
        }
    },
    "xgettext": {
        "sources": [
            "/tmp/cache",
            "/src",
            "/public/class"
        ]
    },
    "github": {
        "path": "/path/to/repo",
        "token": "your-github-token",
        "user": "the-github-username",
        "repo": "the-github-repo-name",
        "branch": "trans",
        "commit": "Updating translations"
    }
}
````

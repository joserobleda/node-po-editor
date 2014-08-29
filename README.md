node-po-editor
==============

A web app for edit .po files with github integration, writed in node

### How to install:
1. Make sure you are running node `v0.10.29`
2. Run `npm install -g node-po-editor`
4. Config your parameters in `/secure/path/to/config.json`
5. Run `po-editor /secure/path/to/config.json`


Config file example (or see [`sample.json`](https://github.com/joserobleda/node-po-editor/blob/master/neasy-sample.json))

````
{
    // session handling
    "cookie": {},
    
    // server info
    "server": {},
    
    // xgettext locales config
    "xgettext": {},
    
    // --- optional config
    
    // enable http basic auth
    "httpAuth": {},
    
    // enable mysql based http auth
    "mysql": {},

    // if you want to enable the github integration
    "github": {}
}
````



#### cookie
````
{
    "cookie": {
        // put here a secret random number, it is for session handling
        "secret": "super secret key"
    }
}
````


#### server
````
{
    "server": {
        // the domain where your app will be running
        "domain": "localhost",
        
        // the port to access your app
        "port": 5000
    }
}
````

#### xgettext
````
{
    "xgettext": {
        // the path where you have your locale files (see locale estructure)
        "path": "path/to/locale/root/locale",
        
        // optional. a command to execute before parse the files
        "pre": "php compile/twig/templates.php",
        
        // array of paths to look for xgettext strings
        "sources": [
            "/tmp/cache",
            "/src",
            "/class"
        ]
    }
}
````


#### httpAuth
````
{
    "httpAuth": {
        // mysql auth type (only mysql for now)
        "type": "mysql",
        
        // mysql config (needs you to configure "mysql", see below)
        "mysql": {
            // the table of users your going to use, db.tablename
            "table": "users.table",
            
            // the username field in the mysql table
            "username": "username.field",
            
            // the password field in the mysql table
            "password": "password.field",
            
            // method to compare the password
            "encoding": "mysql.function.like.md5"
        }
    }
}
````

#### mysql
````
{
    "mysql": {
        // your mysql host
        "host": "localhost",
        
        // mysql user 
        "user": "root",
        
        // mysql password
        "password": "secret"
    }
}
````

#### github

Use this to enable github integration

````
{
    "github": {
        // a local path to your repo
        "path": "/path/to/repo",
        
        // your github token
        "token": "your-github-token",
        
        // the author of the commits
        "user": "the-github-username",
        
        // the owner of the repo
        "owner": "user-or-org",
        
        // the repo name
        "repo": "the-github-repo-name",
        
        // temporary branches prefix
        "branch": "trans",
        
        // commit message
        "commit": "Updating translations"
    }
}
````

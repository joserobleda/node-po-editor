node-po-editor
==============

A web app for edit .po files with github integration, writed in node

### How to install:
1. Make sure you are running node `v0.10.29`
2. Clone the repo
3. npm install
4. copy `neasy-sample.json` to a secure local path `/secure/path/to/config.json`

Config file, see `neasy-sample.json`


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
        
        // mysql config
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

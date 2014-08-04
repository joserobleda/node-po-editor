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

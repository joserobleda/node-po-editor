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
    // session handling
    "cookie": {},
    
    // server info
    "server": {},
    
    // locales config
    "locales": {},
    
    // xgettext config
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

var fs 	= require('fs');
var app = require('neasy');
var cli = app.require('cli');


if (app.config.locales == undefined || app.config.locales.path == undefined || fs.existsSync(app.config.locales.path) == false) {
	return cli.error("Configure the locales:path in your neasy.json file!");
}

app.start();

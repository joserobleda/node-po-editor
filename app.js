var fs 	= require('fs');
var app = require('neasy');
var cli = app.require('cli');


if (app.config.xgettext == undefined || app.config.xgettext.path == undefined || fs.existsSync(app.config.xgettext.path) == false) {
	return cli.error("Configure the xgettext:path in your config.json file!");
}

app.start();

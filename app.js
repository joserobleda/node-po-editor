#!/usr/bin/env node
var path = require('path');

// arg as absolute route
if (process.argv[2] !== undefined) {
	process.argv[2] = path.resolve(process.argv[2]);
}

// make sure we are in this folder to exec the app
process.chdir(__dirname);

// test config file
var fs 		= require('fs');
var app 	= require('neasy');
var cli 	= app.require('cli');
var home 	= process.env.HOME;



if (app.config.xgettext === undefined || app.config.xgettext.path === undefined) {
	return cli.error("Configure the xgettext:path in your config.json file!");
}

// replace ~ in case user wants relative path
app.config.xgettext.path = app.config.xgettext.path.replace('~', home);
if (fs.existsSync(app.config.xgettext.path) === false) {
	return cli.error("The xgettext:path in your config.json file doesn't exists");
}

if (app.config.xgettext.sources === undefined) {
	return cli.error("You should define a sources list");
}

for (var i in app.config.xgettext.sources) {
	app.config.xgettext.sources[i] = app.config.xgettext.sources[i].replace('~', home);
}

app.start();

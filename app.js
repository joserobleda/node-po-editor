#!/usr/bin/env node

// arg as absolute route
if (process.argv[2] !== undefined) {
	process.argv[2] = require('path').resolve(process.argv[2]);
}

// make sure we are in this folder to exec the app
process.chdir(__dirname);

// test config file
var fs 	= require('fs');
var app = require('neasy');
var cli = app.require('cli');

if (app.config.xgettext == undefined || app.config.xgettext.path == undefined || fs.existsSync(app.config.xgettext.path) == false) {
	return cli.error("Configure the xgettext:path in your config.json file!");
}

app.start();

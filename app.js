#!/usr/bin/env node

// make sure we are in this folder to exec the app
process.chdir(__dirname);

var path 		= require('path');
var home 		= process.env.HOME;
var fs 			= require('fs');
var env 		= path.resolve(home + '/.poeditor.json');

if (fs.existsSync(env)) {
	process.argv[2] = env;
}

var pkg 		= require(__dirname + '/package.json');
var app 		= require('neasy');
var cli			= app.require('cli');

// use the pkg info
app.pkg = pkg;

// arg as absolute route
if (process.argv[2] === undefined) {
	return cli.error('Set config.json path as first parameter');
}

// full path
process.argv[2] = path.resolve(process.argv[2]);

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

if (app.config.xgettext.pre !== undefined) {
	app.config.xgettext.pre = app.config.xgettext.pre.replace('~', home);
}

app.start();

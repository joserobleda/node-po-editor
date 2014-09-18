#!/usr/bin/env node

// make sure we are in this folder to exec the app
process.chdir(__dirname);

var path 		= require('path');
var notifier 	= require('update-notifier');
var pkg 		= require(__dirname + '/package.json');
var fs 			= require('fs');
var app 		= require('neasy');
var cli			= app.require('cli');
var Service 	= require('service-manager').Service;
var home 		= process.env.HOME;

notifier({packageName: pkg.name, packageVersion: pkg.version}).notify();

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

cli.parse({
	install: ['install', 'Install service'],
	uninstall: ['uninstall', 'Uninstall service']
});

var service = new Service({
	name: "poeditor",
	displayname: "Node Po Editor",
	description: pkg.description,
	run: "node",
	args: [__dirname + "/app.js", process.argv[2]], // sets file arguments
	output: true, // sets wheter log to console
	log: false // sets wheter linux services should log stdout and stderr
});

switch (cli.command) {
	case 'install':
		service.install(function(isInstalled) {
			console.log(isInstalled);
		});

		return;
	break
	case 'uninstall':
		service.uninstall(function(isUninstalled) {
			console.log(isInstalled);
		});

		return;
	break
}

app.start();

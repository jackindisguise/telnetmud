import * as fs from "fs";
import * as vm from "vm";
import * as yaml from "yaml";
import * as database from "./database";
import * as command from "./command";
import * as help from "./help";

function loadGameFile(done: Function){
	fs.readFile(database.gameFilePath, "utf8", function(err: NodeJS.ErrnoException | null, data: string){
		let yml = yaml.parse(data);
		if(yml.name) database.config.game.name = yml.name;
		if(yml.version) database.config.game.version = yml.version;
		done();
	});
};

function loadServerFile(done: Function){
	fs.readFile(database.serverFilePath, "utf8", function(err: NodeJS.ErrnoException | null, data: string){
		let yml = yaml.parse(data);
		if(yml.port) database.config.server.port = yml.port;
		done();
	});
};

function loadHelpFiles(done: Function){
	fs.readdir(database.helpFilePath, function(err: NodeJS.ErrnoException | null, files: string[]){
		let c = files.length;
		for(let file of files){
			let path = database.helpFilePath + file;
			fs.readFile(path, "utf8", function(err: NodeJS.ErrnoException | null, data: string){
				let yml = yaml.parse(data);
				if(yml && yml.keywords && yml.body) {
					let helpFile = new help.HelpFile({keywords:yml.keywords, body:yml.body});
					database.addHelpFile(helpFile);
				}

				c--;
				if(c===0) done();
			});
		}
	});
}

function loadCommands(done: Function){
	fs.readdir(database.commandFilePath, function(err: NodeJS.ErrnoException | null, files: string[]){
		let c = files.length;
		for(let file of files){
			let path = database.commandFilePath + file;
			fs.readFile(path, "utf8", function(err: NodeJS.ErrnoException | null, data: string){
				let yml = yaml.parse(data);
				if(yml && yml.regex && yml.fun) {
					let script: vm.Script = new vm.Script(yml.fun);
					let nCommand = new command.Command(new RegExp(yml.regex), script);
					command.Handler.add(nCommand);
				}

				c--;
				if(c===0) done();
			});
		}
	});
}

const loaders: Function[] = [loadGameFile, loadServerFile, loadHelpFiles, loadCommands];
export function load(done: Function){
	function next(){
		let loader: Function|undefined = loaders.shift();
		if(loader) loader(next);
		else done();
	}

	next();
};
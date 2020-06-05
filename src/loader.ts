import * as fs from "fs";
import * as yaml from "yaml";
import * as database from "./database";
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
			let path = database.helpFilePath + "/" + file;
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

const loaders: Function[] = [loadGameFile, loadServerFile, loadHelpFiles];
export function load(done: Function){
	function next(){
		let loader: Function|undefined = loaders.shift();
		if(loader) loader(next);
		else done();
	}

	next();
};
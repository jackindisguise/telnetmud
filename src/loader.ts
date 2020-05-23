import * as fs from "fs";
import * as yaml from "yaml";
import * as database from "./database";

function loadGameFile(done: Function){
	fs.readFile(database.gameFile, "utf8", function(err: NodeJS.ErrnoException | null, data: string){
		let yml = yaml.parse(data);
		if(yml.name) database.config.game.name = yml.name;
		if(yml.version) database.config.game.version = yml.version;
		done();
	});
};

function loadServerFile(done: Function){
	fs.readFile(database.serverFile, "utf8", function(err: NodeJS.ErrnoException | null, data: string){
		let yml = yaml.parse(data);
		if(yml.port) database.config.server.port = yml.port;
		done();
	});
};

const loaders: Function[] = [loadGameFile, loadServerFile];
export function load(done: Function){
	function next(){
		let loader: Function|undefined = loaders.shift();
		if(loader) loader(next);
		else done();
	}

	next();
};
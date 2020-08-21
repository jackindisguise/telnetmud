import * as fs from "fs";
import * as vm from "vm";
import * as yaml from "yaml";
import * as database from "./database";
import * as command from "./command";
import * as help from "./help";
import * as mud from "./mud";
import { Dungeon, DungeonPrototype, Room, SaveFile } from "./dungeon";
import { logger } from "./util/logger";

function loadGameFile(done: Function){
	fs.readFile(database.gameFilePath, "utf8", function(err: NodeJS.ErrnoException | null, data: string){
		logger.debug("Loading game config file.");
		let yml = yaml.parse(data);
		if(yml.name) database.config.game.name = yml.name;
		if(yml.version) database.config.game.version = yml.version;
		done();
	});
};

function loadServerFile(done: Function){
	fs.readFile(database.serverFilePath, "utf8", function(err: NodeJS.ErrnoException | null, data: string){
		logger.debug("Loading server config file.");
		let yml = yaml.parse(data);
		if(yml.port) database.config.server.port = yml.port;
		done();
	});
};

function loadHelpFiles(done: Function){
	fs.readdir(database.helpFilePath, function(err: NodeJS.ErrnoException | null, files: string[]){
		let c = files.length;
		logger.debug("Loading helpfiles...")
		for(let file of files){
			let path = database.helpFilePath + file;
			fs.readFile(path, "utf8", function(err: NodeJS.ErrnoException | null, data: string){
				let yml = yaml.parse(data);
				if(yml && yml.keywords && yml.body) {
					logger.debug(`Loading helpfile '${path}'`);
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
		logger.debug("Loading commands...")
		for(let file of files){
			let path = database.commandFilePath + file;
			fs.readFile(path, "utf8", function(err: NodeJS.ErrnoException | null, data: string){
				let yml = yaml.parse(data);
				if(yml && yml.regex && yml.fun) {
					logger.debug(`Loading command '${path}'`);
					let script: vm.Script = new vm.Script(`(function(){${yml.fun}})();`);
					let nCommand = new command.Command(new RegExp(yml.regex, "i"), script, yml.params);
					database.addCommand(nCommand);
				}

				c--;
				if(c===0) done();
			});
		}
	});
}

function loadCharacters(done: Function){
	fs.readdir(database.characterFilePath, function(err: NodeJS.ErrnoException | null, files: string[]){
		let c = files.length;
		logger.debug("Loading characters...")
		for(let file of files){
			let path = database.characterFilePath + file;
			fs.readFile(path, "utf8", function(err: NodeJS.ErrnoException | null, data: string){
				let yml: SaveFile = yaml.parse(data);
				if(yml && yml.name && yml.password) {
					logger.debug(`Loading character savefile '${path}'`);
					database.addSavefile(yml);
				}

				c--;
				if(c===0) done();
			});
		}
	});
}

function loadWorldDungeon(done: Function){
	fs.readFile(database.worldDungeonFilePath, "utf8", function(err: NodeJS.ErrnoException | null, data: string){
		let yml: DungeonPrototype = yaml.parse(data);
		if(yml.proportions){
			let dungeon: Dungeon = new Dungeon({proportions:yml.proportions, fill:false});
			for(let z=0;z<yml.grid.length;z++){
				let layer = yml.grid[z];
				for(let y=0;y<layer.length;y++){
					let row = layer[y];
					for(let x=0;x<row.length;x++){
						let key = row[x];
						if(!yml.keys.hasOwnProperty(key)) continue;
						let keyData = yml.keys[key];
						let room: Room = dungeon.createRoom({x:x,y:y,z:z})
						if(keyData.name) room.name = keyData.name;
						if(keyData.description) room.description = keyData.description;
						if(keyData.mapText) room.mapText = keyData.mapText;
					}
				}
			}

			mud.MUD.world = dungeon;
			logger.debug("Loaded world dungeon.");
		}
		done();
	});
}

const loaders: Function[] = [loadGameFile, loadServerFile, loadHelpFiles, loadCommands, loadCharacters, loadWorldDungeon];
export function load(done: Function){
	function next(){
		let loader: Function|undefined = loaders.shift();
		if(loader) loader(next);
		else done();
	}

	next();
};
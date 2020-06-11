import * as fs from "fs";
import * as stringx from "./lib/string";
import * as help from "./help";
import * as command from "./command";
import * as dungeon from "./dungeon";

// file names
export const commandFilePath: string = "./data/command/";
export const helpFilePath: string = "./data/help/";
export const gameFilePath: string = "./data/game.yml";
export const serverFilePath: string = "./data/server.yml";
export const worldDungeonFilePath: string = "./data/dungeon/world.yml";

// data structures
export const helpfiles: help.HelpFile[] = [];
export const commands: command.Command[] = [];

// config files
export namespace config {
	export const game = {
		name: "telnetmud",
		version: "1.0.0"
	};

	export const server = {
		port: 23
	};
}

export function getHelpFileByKeyword(keywords: string): help.HelpFile|undefined{
	for(let file of helpfiles){
		if(stringx.compareKeywords(keywords, file.keywords)) return file;
	}
}

export function addHelpFile(...files: help.HelpFile[]){
	for(let file of files){
		helpfiles.push(file);
	}
}

export function addCommand(..._commands: command.Command[]){
	for(let command of _commands){
		commands.push(command);
	}
}
import * as stringx from "./lib/string";
import { HelpFile } from "./help";
import { Command } from "./command";
import { CharacterData } from "./character";

// file names
export const commandFilePath: string = "./data/command/";
export const helpFilePath: string = "./data/help/";
export const characterFilePath: string = "./data/character/";
export const gameFilePath: string = "./data/game.yml";
export const serverFilePath: string = "./data/server.yml";
export const worldDungeonFilePath: string = "./data/dungeon/world.yml";

// data structures
export const helpfiles: HelpFile[] = [];
export const commands: Command[] = [];
export const characters: CharacterData[] = [];

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

// helpfile interface
export function getHelpFileByKeyword(keywords: string): HelpFile|undefined{
	for(let file of helpfiles){
		if(stringx.compareKeywords(keywords, file.keywords)) return file;
	}
}

export function addHelpFile(...files: HelpFile[]){
	for(let file of files){
		helpfiles.push(file);
	}
}

// command interface
export function addCommand(..._commands: Command[]){
	for(let command of _commands){
		commands.push(command);
	}
}

// character data interface
export function addCharacterData(...chars: CharacterData[]){
	for(let data of chars){
		characters.push(data);
	}
}

export function getCharacterByName(name: string): CharacterData|undefined{
	for(let data of characters){
		if(data.name.toLowerCase() === name.toLowerCase()) return data;
	}
}

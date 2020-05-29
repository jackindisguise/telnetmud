import * as fs from "fs";
import * as help from "./help";
import * as libstring from "./ext/string";

// file names
export const helpFiles: string = "./data/help";
export const gameFile: string = "./data/game.yml";
export const serverFile: string = "./data/server.yml";

// text files
export const helpfiles: help.HelpFile[] = [];

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
		if(libstring.compareKeywords(keywords, file.keywords)) return file;
	}
}

export function addHelpFile(...files: help.HelpFile[]){
	for(let file of files){
		helpfiles.push(file);
	}
}
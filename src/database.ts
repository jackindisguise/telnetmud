import * as fs from "fs";

// file names
export const greetingFile: string = "./data/greeting.txt";
export const gameFile: string = "./data/game.yml";
export const serverFile: string = "./data/server.yml";

// greeting file
export let greeting: string;

// config files
export namespace config {
	export const game = {
		name: "telnetmud",
		version: "0.0.0"
	};

	export const server = {
		port: 23
	};
}
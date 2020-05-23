import * as fs from "fs";

// file names
export const greetingFile: string = "./data/greeting.txt";
export const gameFile: string = "./data/game.yml";
export const serverFile: string = "./data/server.yml";

// text files
export namespace text {
	export const greeting: string = ">                   {D----------------------------------------{x                   <\n\r\
>                                   {ctelnetMUD{x                                  <\n\r\
>                   {D----------------------------------------{x                   <\n\r\
>                       {CCreated with Node and Typescript{x                       <\n\r\
>                   {D----------------------------------------{x                   <";
}

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
import * as mud from "./mud";
import * as vm from "vm";
import { _ } from "../i18n";
import * as dungeon from "./dungeon";
import * as direction from "./direction";
import * as database from "./database";

export const safeEnvironment = {
	// standard Node globals
	console: {
		log:console.log
	},

	// shorthand accessors
	MUD: mud.MUD,

	// modules
	dungeon: dungeon,
	direction: direction,
	_: _,

	// data structures
	MessageCategory: mud.MessageCategory,

	// classes
	Room: dungeon.Room,
	DObject: dungeon.DObject
};

export class Handler{
	static parse(player: mud.Player, input: string): boolean{
		for(let command of database.commands){
			let result = input.match(command.regex);
			if(!result) continue;
			let args = result.slice(); // only take array elements of results
			args.shift(); // drop the first element (the entire string)
			command.script.runInContext(vm.createContext({...safeEnvironment, player: player, arguments:args}));
			return true;
		}

		return false;
	}
}

export class Command{
	regex: RegExp;
	script: vm.Script;
	params: string|undefined;
	constructor(regex: RegExp, script: vm.Script, params?: string){
		this.regex = regex;
		this.script = script;
		if(params) this.params = params;
	}

	run(player: mud.Player, ...args: any[]){
		if(this.script) this.script.runInContext({MUD:mud.MUD, arguments:args});
		console.log("Bad command.");
	};
}
import * as mud from "./mud";
import * as vm from "vm";
import { _ } from "../i18n";
import * as dungeon from "./dungeon";
import * as direction from "./direction";

export const safeEnvironment = {
	// standard Node globals
	console: {
		log:console.log
	},

	// shorthand accessors
	players: mud.MUD.players,

	// modules
	dungeon: dungeon,
	direction: direction,
	_: _,

	// data structures
	MessageCategory: mud.MessageCategory
};

export class Handler{
	static commands: Command[] = [];
	static add(...commands: Command[]){
		for(let command of commands){
			if(Handler.commands.indexOf(command) !== -1) continue;
			Handler.commands.push(command);
		}
	}

	static remove(...commands: Command[]){
		for(let command of commands){
			let pos: number = Handler.commands.indexOf(command);
			if(pos === -1) continue;
			Handler.commands.splice(pos,1);
		}
	}

	static parse(player: mud.Player, input: string): boolean{
		for(let command of Handler.commands){
			let result = input.match(command.regex);
			if(!result) continue;
			let args = result.slice();
			args.shift();
			command.script.runInContext(vm.createContext({...safeEnvironment, player: player, arguments:args}));
			return true;
		}

		return false;
	}
}

export class Command{
	regex: RegExp;
	script: vm.Script;
	constructor(regex: RegExp, script: vm.Script){
		this.regex = regex;
		this.script = script;
	}

	run(player: mud.Player, ...args: any[]){
		if(this.script) this.script.runInContext({MUD:mud.MUD, arguments:args});
		console.log("Bad command.");
	};
}
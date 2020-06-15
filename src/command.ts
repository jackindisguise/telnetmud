import * as mud from "./mud";
import * as vm from "vm";
import { _ } from "../i18n";
import * as dungeon from "./dungeon";
import * as direction from "./direction";
import * as database from "./database";
import { MessageCategory, Player } from "./player";
import * as stringx from "./lib/string";

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
	MessageCategory: MessageCategory,

	// classes
	Room: dungeon.Room,
	DObject: dungeon.DObject
};

export class Handler{
	static parse(player: Player, input: string): boolean{
		for(let command of database.commands){
			let result = input.match(command.regex);
			if(!result) continue;
			let args = result.slice(); // only take array elements of results
			args.shift(); // drop the first element (the entire string)
			command.run(player, args);
			return true;
		}

		return false;
	}
}

// victim:mob in room
// Param{ name: "victim", type: "mob", location: "room" }
// victim:string
// Param{ name: "victim", type: "string", location: undefined }
export type Param = {
	name: string|undefined,
	type: string|undefined,
	location: string|undefined
}

// this is the object that's sent to the command's execution environment
export type CommandParams = {
	input: string[],
	etc: any[],
	[key:string]: any
}


export class Command{
	regex: RegExp;
	script: vm.Script;
	private _params: Param[]|undefined;
	constructor(regex: RegExp, script: vm.Script, params?: string){
		this.regex = regex;
		this.script = script;
		if(params) this.generateParams(params);
	}

	static getTypeByWord(word:string){
		switch(word){
			case "obj": return dungeon.DObject;
			case "mob": return dungeon.Mob;
			case "item": return dungeon.Item;
			default: return dungeon.DObject;
		}
	}

	static getListByWord(player: Player, word: string): any[]{
		switch(word){
			case "room": return player.mob?.location?.contents || [];
			case "inventory": return player.mob?.contents || [];
			case "players": // list of player mobs
				let mobs: dungeon.Mob[] = [];
				for(let player of mud.MUD.players) if(player.mob) mobs.push(player.mob);
				return mobs;
			default: return [];
		}
	}

	generateParams(params: string){
		let generated: Param[] = [];
		let split = params.split("\W*;\W*");
		for(let param of split){
			let generate: Param = {name: undefined, type:undefined, location:undefined};
			let rule: RegExp = /^(?:(.*?):)?(.*?)(?: in (.+))?$/i // parse entire param options string
			let result = param.match(rule);
			if(result) {
				if(result[1]) generate.name = result[1];
				if(result[2]) generate.type = result[2];
				if(result[3]) generate.location = result[3];
				generated.push(generate);
			}
		}

		this._params = generated;
	}

	get params(): Param[]|undefined{
		return this._params;
	}

	process(player: Player, input: string[]): CommandParams{
		let results = [];
		let params: CommandParams = {input: input, etc: results};
		if(this._params){
			for(let i=0;i<this._params.length && i<input.length;i++){
				let param: Param = this._params[i];
				let text = input[i];
				let value = undefined;
				if(param.type && param.location){
					let _type = Command.getTypeByWord(param.type);
					let location = Command.getListByWord(player, param.location);
					let result = stringx.searchList(text, location, function(needle: string, target:dungeon.DObject){
						if(!(target instanceof _type)) return false;
						if(stringx.compareKeywords(needle, target.keywords)) return true;
						return false
					});

					value = result;
				} else if(param.type) {
					if(param.type === "string") value = paramInput; // use the string
					else if(param.type === "number") value = Number(paramInput); // make it a number
				}

				results.push(value);
			}
		}

		return params;
	}

	run(player: Player, args: string[]){
		let processed: CommandParams = this.process(player, args);
		this.script.runInContext(vm.createContext({...safeEnvironment, player: player, ...processed}));
	}
}
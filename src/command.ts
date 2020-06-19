import * as mud from "./mud";
import * as vm from "vm";
import { _ } from "../i18n";
import * as dungeon from "./dungeon";
import * as direction from "./direction";
import * as database from "./database";
import { MessageCategory, Player } from "./player";
import * as stringx from "./lib/string";

/**
 * I hate all this shit.
 * Completely refactor some day.
 */

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

export type Param = {
	name: string,
	type: string|undefined,
	location: string|undefined
}

export type CommandParams = {
	text: string[],
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
			case "player": return Player;
			case "mob": return dungeon.Mob;
			case "item": return dungeon.Item;
			case "obj":
			default:
				return dungeon.DObject;
		}
	}

	static getListByWord(player: Player, word: string): any[]{
		switch(word){
			case "room": return player.mob?.location?.contents || [];
			case "inventory": return player.mob?.contents || [];
			case "players": return mud.MUD.players;
			default: return [];
		}
	}

	generateParams(params: string){
		let generated: Param[] = [];
		let split = params.split(/\W*;\W*/);
		for(let param of split){
			let generate: Param = {name: "unknown", type:undefined, location:undefined};
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
		let results: CommandParams = {text: input, etc: []};
		if(!this._params) return results;
		// grab text for params
		let words: {[key: string]: string} = {}
		for(let i=0;i<this._params.length && i<input.length;i++){
			let param = this._params[i];
			let word = input[i];
			words[param.name] = word;
		}

		// list of param names
		let names: {[key: string]: Param} = {};
		for(let param of this._params) names[param.name] = param;

		// completed lookups
		let incomplete = this._params.concat();
		console.log(incomplete);
		while(incomplete.length > 0){
			for(let i=0;i<incomplete.length;i++){
				let param: Param = incomplete[i];
				let word = words[param.name];

				// lookup param
				if(param.location && param.type) {
					let location: any[];
					let _type = Command.getTypeByWord(param.type);
					// dependent on other param
					if(param.location in names) {
						let target: Param = names[param.location];
						if(incomplete.indexOf(target) !== -1) continue; // location incomplete still
						location = results[param.location];
						if(location instanceof dungeon.DObject) location = location.contents; // use its contents list instead
					} else {
						location = Command.getListByWord(player, param.location);
					}

					// search for result
					let result;
					if(_type === Player) {
						result = stringx.searchList(word, location, function(needle: string, target:Player){
							if(!(target instanceof Player)) return false;
							let player: Player = target;
							if(!player.mob) return false;
							if(stringx.compareKeywords(needle, player.mob.keywords)) return true;
							return false;
						});
	
					// DObject type
					} else {
						result = stringx.searchList(word, location, function(needle: string, target:dungeon.DObject){
							if(!(target instanceof _type)) return false;
							if(stringx.compareKeywords(needle, target.keywords)) return true;
							return false
						});
					}

					results[param.name] = result;
				} else if(param.type) {
					if(param.type === "string") results[param.name] = word; // use the string
					else if(param.type === "number") results[param.name] = Number(word); // make it a number
					else results[param.name] = word; // same as string...
				}

				incomplete.splice(i, 1);
				i--;
			}
		}

		return results;
	}

	run(player: Player, args: string[]){
		let processed: CommandParams = this.process(player, args);
		this.script.runInContext(vm.createContext({...safeEnvironment, player: player, ...processed}));
	}
}
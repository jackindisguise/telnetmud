import { logger } from "./util/logger";
import * as io from "./net/io";
import * as dungeon from "./dungeon";
import * as direction from "./direction";
import { _ } from "../i18n";
import { Handler } from "./command";
import { MUD } from "./mud";

export enum MessageCategory {
	MSG_DEFAULT,
	MSG_CHAT,
	MSG_INFO,
	MSG_PROMPT
}

export class Player{
	client: io.Client;
	mob: dungeon.Mob|undefined;
	msgCategory: MessageCategory|undefined = MessageCategory.MSG_DEFAULT;
	inputCallback: ((...args:string[]) => void) | undefined;
	constructor(client: io.Client){
		let player: Player = this;
		this.client = client;
		client.on("command", function(line: string){
			player.command(line.trim());
		});
	}

	toString(){
		if(this.mob) return _("Player@%s", this.mob.toString());
		return _("Player@%s", this.client.toString());
	}

	command(line: string){
		this.msgCategory = undefined;
		if(this.inputCallback) {
			let callback: (...args:string[]) => void = this.inputCallback;
			this.inputCallback = undefined;
			callback(line);
			return;
		}

		if(!this.mob) return;
		logger.silly(`${this}: '${line}'`);
		if(!Handler.parse(this, line)) this.message(_("Do what, now?"));
		this.sendPrompt();

		if(line === _("close")){
			MUD.shutdown();
			return;
		}
	}

	ask(question: string, callback: (...args:string[]) => void){
		if(this.inputCallback) return;
		this.inputCallback = callback;
		this.send(question+" ");
	}

	yesno(question: string, callback: (yes: boolean|undefined) => void){
		this.ask(`${question} ${_("(Y/n)")} `, function(response: string){
			if(!response) return callback(undefined);
			if(_("yes").startsWith(response.toLowerCase())) return callback(true);
			if(_("no").startsWith(response.toLowerCase())) return callback(false);
			return callback(undefined);
		});
	}

	send(data: string, colorize?:boolean){
		if(!this.client) return;
		this.client.send(data, colorize);
	}

	sendLine(data: string, colorize?:boolean){
		if(!this.client) return;
		this.client.sendLine(data, colorize);
	}

	sendMessage(data: string, msgCategory: MessageCategory, linebreak?:boolean){
		if(this.msgCategory !== undefined && this.msgCategory !== msgCategory) this.sendLine("");
		if(linebreak === undefined || linebreak) this.sendLine(data);
		else this.send(data);
		this.msgCategory = msgCategory; // assign new category
	}

	message(data: string){
		this.sendMessage(data, MessageCategory.MSG_DEFAULT);
	}

	chat(data: string){
		this.sendMessage(data, MessageCategory.MSG_CHAT);
	}

	info(data: string){
		this.sendMessage(data, MessageCategory.MSG_INFO);
	}

	sendPrompt(){
		this.sendMessage("{R>{x ", MessageCategory.MSG_PROMPT, false);
	}

	showRoom(){
		if(!this.mob) return;
		if(this.mob.location instanceof dungeon.DObject) {
			this.message(_("Why are you in another object?"));
			return;
		}

		if(!(this.mob.location instanceof dungeon.Room)){
			this.info(_("Where the fuck are you?"));
			return;
		}

		let room: dungeon.Room = this.mob.location;
		let display = `${room.name}\r\n ${room.description}\r\n\r\n`;
		let exits = room.exits();
		let text = [];
		for(let dir of exits) text.push(direction.Direction2Word.get(dir));
		display += _("[Exits: %s]", text.join(" "));
		this.info(display);
	
		// make a map
		let size = 3;
		let lines = ["-".repeat(size*2+3)];
		let area = room.dungeon.getArea(room.coordinates, size);
		for(let y=0;y<size*2+1;y++){
			let line = ["|"];
			for(let x=0;x<size*2+1;x++){
				let room = area[y][x];
				if(x===size && y===size) line.push("@");
				else if(room) {
					let mob: dungeon.Mob|undefined;
					for(let dobject of room.contents){
						if(dobject instanceof dungeon.Mob) {
							mob = dobject;
							break;
						}
					}

					line.push(mob ? mob.mapText : room.mapText);
				}
				else line.push(" ");
			}

			line.push("|");
			lines.push(line.join(""));
		}
	
		lines.push("-".repeat(size*2+3));
		this.info(lines.join("\r\n"));
	}

	save(){
		if(!this.mob) return;
		// use keywords, lowercase, remove whitespace
		let safe = this.mob.keywords.toLowerCase().replace(/\s/g, "");
	}

	load(yml: string){
	}
}
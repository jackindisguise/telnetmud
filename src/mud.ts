import { logger } from "./util/logger";
import * as io from "./io";
import * as database from "./database";
import * as dungeon from "./dungeon";
import { HelpFile } from "./help";
import { _ } from "../i18n";

export enum MessageCategory {
	MSG_DEFAULT,
	MSG_CHAT,
	MSG_INFO,
	MSG_PROMPT
}

export class Player{
	client: io.Client;
	mob: dungeon.Mob|undefined;
	msgCategory: MessageCategory = MessageCategory.MSG_DEFAULT;
	inputCallback: ((...args:string[]) => void) | undefined;
	constructor(client: io.Client){
		let player: Player = this;
		this.client = client;
		client.on("command", function(line: string){
			player.command(line);
		});
	}

	toString(){
		if(this.mob) return _("Player@%s", this.mob.toString());
		return _("Player@%s", this.client.toString());
	}

	command(line: string){
		if(this.inputCallback) {
			let callback: (...args:string[]) => void = this.inputCallback;
			this.inputCallback = undefined;
			callback(line);
			return;
		}

		if(!this.mob) return;
		logger.silly(`${this}: '${line}'`);
		this.sendMessage(_("You: %s", line), MessageCategory.MSG_CHAT);
		for(let player of MUD.players){
			if(player === this) continue;
			player.sendMessage(_("%s: %s", this.mob.name, line), MessageCategory.MSG_CHAT);
		}

		this.sendPrompt();

		if(line === _("close")){
			MUD.shutdown();
		}
	}

	ask(question: string, callback: (...args:string[]) => void){
		if(this.inputCallback) return;
		this.inputCallback = callback;
		this.send(question+" ");
	}

	yesno(question: string, callback: (yes: boolean|undefined) => void){
		this.ask(question + _(" (Y/n) "), function(response: string){
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

	sendMessage(data: string, msgCategory: MessageCategory){
		if(this.msgCategory !== MessageCategory.MSG_PROMPT) // don't send if the last message was a prompt
			if(this.msgCategory !== msgCategory) this.sendLine("!!"); // message is different category from last
		this.sendLine(data); // send message
		this.msgCategory = msgCategory; // assign new category
	}

	sendPrompt(){
		this.send("\r\n{R>{x ");
		this.msgCategory = MessageCategory.MSG_PROMPT;
	}
}

export class MUD{
	static server: io.Server = new io.TelnetServer();
	static players: Player[] = [];
	static start(){
		if(MUD.server.isOpen()) throw new Error(_("MUD & server already started."));
		MUD.server.on("connection", function(client: io.Client){
			// process new client
			let player = new Player(client);
			MUD.addPlayer(player);

			// send greeting
			let greeting: HelpFile|undefined = database.getHelpFileByKeyword(_("greeting")); 
			player.sendLine(greeting ? greeting.body : _("This is telnetmud!"));

			// start login process
			MUD.nanny(player);
		});

		MUD.server.open(23, function(){
			logger.info(_("started on port %s", "23"));
		});
	}

	static shutdown(){
		if(!MUD.server.isOpen()) throw new Error(_("MUD not running."));
		MUD.server.close(function(){
			console.log("success");
		});
	}

	private static addPlayer(player: Player){
		if(MUD.players.indexOf(player) !== -1) return;
		MUD.players.push(player);
	}

	private static removePlayer(player: Player){
		let pos: number = this.players.indexOf(player);
		if(pos === -1) return;
		MUD.players.splice(pos, 1);
	}

	private static nanny(player: Player){
		let name: string, password: string;
		let mob: dungeon.Mob|undefined;
		function getName(){
			player.ask(_("What's your name?"), function(response: string){
				name = response;
				confirmName();
			});
		};

		function confirmName(){
			player.yesno(_("You sure your name is %s?", name), function(yes: boolean|undefined){
				if(yes === undefined) return confirmName();
				if(!yes) return getName();
				return createNewCharacter();
			});
		};

		function createNewCharacter(){
			mob = new dungeon.Mob();
			mob.name = name;
			motd();
		}

		function motd(){
			let motd: HelpFile|undefined = database.getHelpFileByKeyword(_("motd"));
			player.sendLine(motd ? motd.body : _("There is no MOTD."));
			player.ask(_("Press enter to continue..."), finish);
		}

		function finish(){
			if(!mob) throw new Error(_("Somehow finished nanny with no mob."));
			player.mob = mob;
			player.sendMessage(_("Welcome to the world, %s!", mob.toString()), MessageCategory.MSG_INFO);
			player.sendPrompt();
		};

		getName();
	}
}
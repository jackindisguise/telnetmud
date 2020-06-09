import { logger } from "./util/logger";
import * as io from "./net/io";
import * as database from "./database";
import * as dungeon from "./dungeon";
import { HelpFile } from "./help";
import { _ } from "../i18n";
import { Handler } from "./command";

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
			player.command(line);
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
}

export class MUD{
	static server: io.Server = new io.TelnetServer();
	static players: Player[] = [];
	static world: dungeon.Dungeon;
	static start(port: number){
		if(MUD.server.isOpen()) throw new Error(_("MUD & server already started."));
		MUD.server.on("connection", function(client: io.Client){
			// process new client
			let player = new Player(client);
			MUD.addPlayer(player);

			// listen for disconnection
			client.once("disconnect", function(reason: string){
				MUD.removePlayer(player);
				if(!player.mob) return;
				for(let oplayer of MUD.players){
					oplayer.sendMessage(_("%s has turned into a line noise.", player.mob.name), MessageCategory.MSG_INFO);
				}
			});

			// send greeting
			let greeting: HelpFile|undefined = database.getHelpFileByKeyword(_("greeting")); 
			player.sendLine(greeting ? greeting.body : _("This is telnetmud!"));

			// start login process
			MUD.nanny(player);
		});

		MUD.server.open(port, function(){
			logger.info(_("started on port %s", port.toString()));
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
			mob.move(MUD.world.getRoom(0,0,0));
			player.sendMessage(_("Welcome to the world, %s!", mob.toString()), MessageCategory.MSG_INFO);
			player.sendPrompt();
		};

		getName();
	}
}
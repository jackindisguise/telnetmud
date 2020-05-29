import { logger } from "./util/logger";
import * as io from "./io";
import * as database from "./database";
import * as dungeon from "./dungeon";
import { HelpFile } from "./help";

export class Player{
	client: io.Client;
	mob: dungeon.Mob|undefined;
	inputCallback: ((...args:string[]) => void) | undefined;
	constructor(client: io.Client){
		let player: Player = this;
		this.client = client;
		client.on("command", function(line: string){
			player.command(line);
		});
	}

	command(line: string){
		if(this.inputCallback) {
			let callback: (...args:string[]) => void = this.inputCallback;
			this.inputCallback = undefined;
			callback(line);
			return;
		}

		logger.silly(`${this}: '${line}'`);
		this.sendLine(`You: '${line}'`);
	}

	ask(question: string, callback: (...args:string[]) => void){
		if(this.inputCallback) return;
		this.inputCallback = callback;
		this.send(question+" ");
	}

	yesno(question: string, callback: (yes: boolean|undefined) => void){
		this.ask(question + " (Y/n) ", function(response: string){
			if(!response) return callback(undefined);
			if("yes".startsWith(response.toLowerCase())) return callback(true);
			if("no".startsWith(response.toLowerCase())) return callback(false);
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
}

export class MUD{
	static server: io.Server = new io.TelnetServer();
	static players: Player[] = [];
	static start(){
		if(MUD.server.isOpen()) throw new Error("MUD & server already started.");
		MUD.server.on("connection", function(client: io.Client){
			// process new client
			let player = new Player(client);
			MUD.addPlayer(player);

			// send greeting
			let greeting: HelpFile|undefined = database.getHelpFileByKeyword("greeting"); 
			player.sendLine(greeting ? greeting.body : "This is telnetmud!");

			// start login process
			MUD.nanny(player);
		});

		MUD.server.open(23, function(){
			logger.info("started on port 23");
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
		function getName(){
			player.ask("What's your name?", function(response: string){
				name = response;
				confirmName();
			});
		};

		function confirmName(){
			player.yesno(`You sure your name is ${name}?`, function(yes: boolean|undefined){
				if(yes === undefined) return confirmName();
				if(!yes) return getName();
				return motd();
			});
		};

		function motd(){
			let motd: HelpFile|undefined = database.getHelpFileByKeyword("motd");
			player.sendLine(motd ? motd.body : "There is no MOTD.");
			player.ask("Press enter to continue...", finish);
		}

		function finish(){
			player.sendLine(`Your name is fuckin' ${name}, bitch.`);
		};

		getName();
	}
}
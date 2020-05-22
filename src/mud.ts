import { logger } from "./logger";
import * as io from "./io";
import * as fs from "fs";

const greeting = fs.readFileSync("./data/greeting.txt", "utf8");

export class Player{
	client: io.Client;
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
		if(MUD.server.isOpen()) throw new Error("Server already started.");
		MUD.server.on("connection", function(client: io.Client){
			let player = new Player(client);
			MUD.nanny(player);
		});

		MUD.server.open(23, function(){
			logger.info("started on port 23");
		});
	}

	static nanny(player: Player){
		MUD.addPlayer(player);
		player.sendLine(greeting);
		player.ask("What's your name?", function(name: string){
			player.sendLine(`You chose the name {R${name}{x.`);
			logger.info(`New player: ${name}`);
		});
	}

	static addPlayer(player: Player){
		if(MUD.players.indexOf(player) !== -1) return;
		MUD.players.push(player);
	}

	static removePlayer(player: Player){
		let pos: number = this.players.indexOf(player);
		if(pos === -1) return;
		MUD.players.splice(pos, 1);
	}
}
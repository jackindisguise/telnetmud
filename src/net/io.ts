import { EventEmitter } from "events";
import * as net from "net";
import * as color from "../color";
import * as stringx from "../lib/string";
import { _ } from "../../i18n";

export interface Server{
	clients: Client[];
	open(port: number, callback?: ()=>void): void;
	isOpen(): boolean;
	close(callback?: ()=>void): void;
	on(event: "connection", listener: (client: Client) => void): EventEmitter;
	on(event: "disconnection", listener: (client: Client) => void): EventEmitter;
	once(event: "connection", listener: (client: Client) => void): EventEmitter;
	once(event: "disconnection", listener: (client: Client) => void): EventEmitter;
	emit(event: "connection", client: Client): boolean;
	emit(event: "disconnection", client: Client): boolean;
}

export interface Client{
	send(data: string, colorize?: boolean): void;
	sendLine(data: string, colorize?: boolean): void;
	colorize(data: string, blind?: boolean): string;
	close(): void;
	on(event: "command", listener: (data: string) => void): EventEmitter;
	on(event: "disconnect", listener: (reason: string) => void): EventEmitter;
	once(event: "command", listener: (data: string) => void): EventEmitter;
	once(event: "disconnect", listener: (reason: string) => void): EventEmitter;
	emit(event: "command", data: string): boolean;
	emit(event: "disconnect", reason: string): boolean;
}

export class TelnetServer implements Server{
	clients: TelnetClient[] = [];
	private emitter: EventEmitter = new EventEmitter();
	private netserver: net.Server = new net.Server();
	open(port: number, callback?: ()=>void){
		let netserver = this.netserver;
		let server = this;
		netserver.listen(port, function(){
			netserver.on("connection", function(socket: net.Socket){
				let client: TelnetClient = new TelnetClient(socket);
				server.add(client);
				server.emit("connection", client);
				client.on("disconnect", function(){
					server.emit("disconnection", client);
					server.remove(client);
				});
			});

			if(callback) callback();
		});
	}

	close(callback?: ()=>void){
		if(this.netserver.listening === false) return;
		for(let client of this.clients){ // kill all clients
			client.sendLine("\r\n"+stringx.box({
				content:[{text:_("We're shutting down, so beat it."),orientation:stringx.PadSide.CENTER}],
				style:stringx.BoxStyle.STARRY,
				size:80
			}));
			client.close();
		}

		this.netserver.close(callback); // close server
	}

	isOpen(): boolean{
		return this.netserver.listening;
	}

	private add(client: TelnetClient){
		if(this.clients.indexOf(client) !== -1) return;
		this.clients.push(client);
	}

	private remove(client: TelnetClient){
		let pos = this.clients.indexOf(client);
		if(pos === -1) return;
		this.clients.splice(pos, 1);
	}

	once(event: "connection", listener: (client: TelnetClient) => void): EventEmitter;
	once(event: "disconnection", listener: (client: TelnetClient) => void): EventEmitter;
	once(event: string|symbol, listener: (...args: any[]) => void): EventEmitter{
		return this.emitter.once(event, listener);
	};

	on(event: "connection", listener: (client: TelnetClient) => void): EventEmitter;
	on(event: "disconnection", listener: (client: TelnetClient) => void): EventEmitter;
	on(event: string|symbol, listener: (...args: any[]) => void): EventEmitter{
		return this.emitter.on(event, listener);
	};

	emit(event: "connection", client: TelnetClient): boolean;
	emit(event: "disconnection", client: TelnetClient): boolean;
	emit(event: string|symbol, ...args: any[]): boolean{
		return this.emitter.emit(event, ...args);
	}
}

export class TelnetClient implements Client{
	private socket: net.Socket;
	private emitter: EventEmitter = new EventEmitter();
	private incomplete: string = "";
	constructor(socket: net.Socket){
		let client: TelnetClient = this;
		this.socket = socket;
		socket.setEncoding("binary");
		socket.on("data", function(data: string){
			// consume incomplete input
			if(client.incomplete) {
				data = `${client.incomplete}${data}`;
				client.incomplete = "";
			}

			// split input by lines. telnet input requires a \r\n delimiter
			let lines = data.split(/[\r\n]+/);
			let last = lines.pop(); // pop 
			if(last !== "") client.incomplete += last;
			for(let command of lines){
				client.emit("command", command);
			}
		});

		socket.on("close", function(){
			client.emit("disconnect", "close");
		});

		socket.on("end", function(){
			client.emit("disconnect", "end");
		});
	}

	close(){
		this.sendLine(_("You turn into a line noise."));
		this.socket.destroy();
	}

	send(data: string, colorize?:boolean){
		if(colorize === undefined || colorize === true) data = this.colorize(data);
		this.socket.write(data);
	}

	sendLine(data: string, colorize?:boolean){
		this.send(data+"\r\n", colorize);
	}

	colorize(data: string, blind?: boolean): string{
		if(blind) return color.strip(data);
		return color.color(data, color.ColorReplace.Telnet);
	}

	once(event: "command", listener: (data: string) => void): EventEmitter;
	once(event: "disconnect", listener: (reason: string) => void): EventEmitter;
	once(event: string|symbol, listener: (...args: any[]) => void): EventEmitter {
	  return this.emitter.once(event, listener);
	}

	on(event: "command", listener: (data: string) => void): EventEmitter;
	on(event: "disconnect", listener: (reason: string) => void): EventEmitter;
	on(event: string|symbol, listener: (...args: any[]) => void): EventEmitter {
	  return this.emitter.on(event, listener);
	}

	emit(event: "command", data: string): boolean;
	emit(event: "disconnect", reason: string): boolean;
	emit(event: string|symbol, ...args: any[]): boolean {
		return this.emitter.emit(event, ...args);
	}
}
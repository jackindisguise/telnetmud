// mocha and chai
import "mocha";
import { expect } from "chai";
import * as net from "net";

// local includes
import * as io from "./io";

let server: io.Server;
let client: io.Client;
let clientSocket: net.Socket;
describe("io", function(){
	it("Start a Telnet server.", function(done){
		server = new io.TelnetServer();
		server.open(9999, function(){
			expect(server.isOpen()).is.true;
			done();
		});
	});

	it("Connect a Telnet client.", function(done){
		server.once("connection", function(nclient: io.Client){
			client = nclient;
			done();
		});

		clientSocket = net.connect({port:9999}, function(){
			clientSocket.setEncoding("binary");
		});
	});

	it("Process command from client.", function(done){
		client.once("command", function(data: string){
			expect(data).is.equal("hello");
			done();
		});

		clientSocket.write("hello\r\n");
	});

	it("Send incomplete command from client.", function(done){
		clientSocket.write("first");
		done();
	});

	it("Send rest of command from client.", function(done){
		client.once("command", function(data: string){
			expect(data).is.equal("first second");
			done();
		});

		clientSocket.write(" second\r\n");
	});

	it("Send message to client.", function(done){
		clientSocket.once("data", function(data: string){
			if(data === "Hello.\r\n") done();
		});

		client.sendLine("Hello.");
	});

	it("Disconnect client manually on server's side.", function(done){
		client.once("disconnect", function(reason: string){
			expect(reason).is.equal("close");
			done();
		});

		client.close();
	});

	it("Connect a 2nd Telnet client.", function(done){
		server.once("connection", function(nclient: io.Client){
			client = nclient;
			done();
		});

		clientSocket = net.connect({port:9999}, function(){
			clientSocket.setEncoding("binary");
		});
	});

	it("Disconnect client manually on client's side.", function(done){
		client.once("disconnect", function(reason: string){
			expect(reason).is.equal("end");
			done();
		});

		clientSocket.end();
	});

	it("Close server and socket.", function(done){
		expect(server.isOpen()).is.true;
		server.close(function(){
			expect(server.isOpen()).is.false;
			done();
		});
	})
});

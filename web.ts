import * as web from "./src/web";
import * as socketio from "socket.io";

web.io.on("connection", function(socket:socketio.Socket){
	console.log("a user connected!");
	console.log(socket.request.sessionID);
	socket.on("command", function(command: string){
		socket.emit("message", `You sent: ${command}`);
	});
});

web.server.listen(80, function(){
	console.log(`webserver running on ${web}.`);
});

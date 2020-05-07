import * as express from 'express';
import * as http from 'http';
import * as clientIO from "socket.io";

const app: express.Express = express();
const server: http.Server = http.createServer(app);
const io = clientIO.listen(server);
const port: number = 80;

app.set("views", "./www/pug");
app.set("view engine", "pug");
app.use(express.static('www/public'))

app.use((req, res, next) => {
	console.log(`URL: ${req.url}`);
	next();
});

app.get('/', function(req, res) {
	res.render("index");
});

app.get('*', (req, res, next) => {
	res.status(200).send('Sorry, requested page not found.');
	next();
});

io.on("connection", function(socket:clientIO.Socket){
	console.log("a user connected!");
	socket.on("command", function(command: string){
		socket.emit("message", `You sent: ${command}`);
	});
});

server.listen(80, function(){
	console.log(`webserver running on ${port}.`);
});
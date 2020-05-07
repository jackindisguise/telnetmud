import * as express from 'express';
import * as http from 'http';
import * as socketio from "socket.io";
import * as session from "express-session";
import * as cookieParser from "cookie-parser";

const app: express.Express = express();
const server: http.Server = http.createServer(app);
const io = socketio.listen(server);
const port: number = 80;
const sessionMiddleware = session({
	secret: 'kickEEwinTI'
});

app.set("views", "./www/pug");
app.set("view engine", "pug");
app.use(express.static('www/public'))
app.use(cookieParser());

// session passthrough
io.use(function(socket, next){
	sessionMiddleware(socket.request, socket.request.res || {}, next);
})

app.use(sessionMiddleware);

app.use(function(req, res, next){
	if(req.session && !req.session.value) req.session.value = 0;
	console.log(`URL: ${req.url}`);
	next();
});

app.get('/', function(req, res) {
	res.render("index");
});

app.get("/add", function(req, res){
	if(req.session) req.session.value++;
	res.render("show", req.session);
});

app.get("/remove", function(req, res){
	if(req.session) req.session.value--;
	res.render("show", req.session);
});

app.get("/show", function(req, res){
	res.render("show", req.session);
});

app.get('*', (req, res, next) => {
	res.status(200).send('Sorry, requested page not found.');
	next();
});

io.on("connection", function(socket:socketio.Socket){
	console.log("a user connected!");
	console.log(socket.request.sessionID);
	socket.on("command", function(command: string){
		socket.emit("message", `You sent: ${command}`);
	});
});

server.listen(80, function(){
	console.log(`webserver running on ${port}.`);
});
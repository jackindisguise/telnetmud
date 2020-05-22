import * as express from 'express';
import * as http from 'http';
import * as socketio from "socket.io";
import * as session from "express-session";
import * as cookieParser from "cookie-parser";

export const app: express.Express = express();
export const server: http.Server = http.createServer(app);
export const io = socketio.listen(server);
export const port: number = 80;

// define sesssion middleware
const sessionMiddleware = session({
	secret: 'kickEEwinTI'
});

// setup express shit
app.set("views", "./www/pug");
app.set("view engine", "pug");
app.use(express.static('www/public'))
app.use(cookieParser());

// session passthrough
io.use(function(socket, next){
	sessionMiddleware(socket.request, socket.request.res || {}, next);
})

app.use(sessionMiddleware);

// define web stuff
app.use(function(req, res, next){
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

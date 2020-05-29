import * as database from "./src/database";
import * as loader from "./src/loader";
import {MUD} from "./src/mud";
loader.load(function(){
	MUD.start();
});
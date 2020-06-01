import * as i18n from "i18n";
import * as loader from "./src/loader";
import {MUD} from "./src/mud";
import * as database from "./src/database";

loader.load(function(){
	MUD.start(database.config.server.port);
});
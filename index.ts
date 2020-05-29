import * as i18n from "i18n";
import * as loader from "./src/loader";
import {MUD} from "./src/mud";

// configure i18n
i18n.configure({
    locales:['en', "de"],
	directory: __dirname + '/../locales'
});

loader.load(function(){
	MUD.start();
});
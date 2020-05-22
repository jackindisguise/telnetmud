import * as YAML from "yaml";
import * as fs from "fs";

let file = "./data/game.yaml";
export let name: string = "webmud2";
export let version: string = "1.0.0";

export default function(callback: Function){
	fs.exists(file, function(exists: boolean){
		if(!exists) return;
		fs.readFile(file, "utf8", function(err, data){
			if(err) return;
			let yaml = YAML.parse(data);
			if(yaml.name) name = yaml.name;
			if(yaml.version) version = yaml.version;
			callback();
		});
	})
};
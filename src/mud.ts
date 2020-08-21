import * as crypto from "crypto";
import * as io from "./net/io";
import * as database from "./database";
import * as dungeon from "./dungeon";
import * as __PACKAGE__ from "../package.json";
import { logger } from "./util/logger";
import { Player, MessageCategory } from "./player";
import { HelpFile } from "./help";
import { _ } from "../i18n";
import { Psion } from "./classification";

const passwordSecret = "kickEEwinTI";

export function passwordHash(password: string): string{
	return crypto.createHmac('sha256', passwordSecret).update(password).digest('hex');
}

export class MUD{
	static server: io.Server = new io.TelnetServer();
	static players: Player[] = [];
	static world: dungeon.Dungeon;
	static start(port: number){
		if(MUD.server.isOpen()) throw new Error(_("MUD & server already started."));
		MUD.server.on("connection", function(client: io.Client){
			// process new client
			let player = new Player(client);
			MUD.addPlayer(player);

			// listen for disconnection
			client.once("disconnect", function(reason: string){
				MUD.removePlayer(player);
				if(!player.mob) return;
				for(let oplayer of MUD.players){
					oplayer.sendMessage(_("%s has turned into a line noise.", player.mob.name), MessageCategory.MSG_INFO);
				}
			});

			// send greeting
			let greeting: HelpFile|undefined = database.getHelpFileByKeyword(_("greeting"));
			player.sendLine(_("telnetMUD v%s", __PACKAGE__.version));
			if(greeting) player.sendLine(greeting.body);

			// start login process
			MUD.nanny(player);
		});

		MUD.server.open(port, function(){
			logger.info(_("started on port %s", port.toString()));
		});
	}

	static shutdown(){
		if(!MUD.server.isOpen()) throw new Error(_("MUD not running."));
		MUD.server.close(function(){
			console.log("success");
		});
	}

	private static addPlayer(player: Player){
		if(MUD.players.indexOf(player) !== -1) return;
		MUD.players.push(player);
	}

	private static removePlayer(player: Player){
		let pos: number = this.players.indexOf(player);
		if(pos === -1) return;
		MUD.players.splice(pos, 1);
	}

	private static nanny(player: Player){
		let name: string, password: string;
		let character: dungeon.PC|undefined;
		let location: dungeon.Room|undefined = MUD.world.getRoom(0,0,0);
		let data: dungeon.SaveFile|undefined;
		function getName(){
			player.ask(_("What's your name?"), function(response: string){
				name = response;
				data = database.getSavefileByName(name);
				if(data) getExistingCharacterPassword();
				else confirmNewName();
			});
		};

		function getExistingCharacterPassword(){
			player.ask(_("Password:"), function(response: string){
				if(!data) return getName();
				let hashed = passwordHash(response);
				if(data.password !== hashed){
					player.sendLine("That password is incorrect.");
					return getName();
				}

				loadCharacter();
			});
		}

		function loadCharacter(){
			if(!data) return getName();
			// replace this with a generic loading function from database
			character = new dungeon.PC({password:data.password});
			character.name = data.name;
			location = MUD.world.getRoom(data.location);
			motd();
		}

		function confirmNewName(){
			player.yesno(_("You sure your name is %s?", name), function(yes: boolean|undefined){
				if(yes === undefined) return confirmNewName();
				if(!yes) return getName();
				return createPassword();
			});
		};

		function createPassword(){
			player.ask(_("Please enter a password:", name), function(response: string){
				confirmPassword(response);
			});
		};

		function confirmPassword(original: string){
			player.ask(_("Please confirm your password:", name), function(response: string){
				if(original === response){
					password = response;
					createNewCharacter();
				} else {
					player.sendLine("Those don't match!");
					createPassword();
				}
			});
		}

		function createNewCharacter(){
			character = new dungeon.PC({password:passwordHash(password)});
			character.race = new Psion;
			character.name = name;
			motd();
		}

		function motd(){
			let motd: HelpFile|undefined = database.getHelpFileByKeyword(_("motd"));
			player.sendLine(motd ? motd.body : _("There is no MOTD."));
			player.ask(_("Press enter to continue..."), finish);
		}

		function finish(){
			if(!character) throw new Error(_("Somehow finished nanny with no character."));
			player.mob = character;
			character.move(location);
			player.info(_("Welcome to the world, %s!", character.toString()));
			player.sendPrompt();
		};

		getName();
	}
}
import { logger } from "./util/logger";
import * as io from "./net/io";
import * as database from "./database";
import * as dungeon from "./dungeon";
import * as stringx from "./lib/string";
import { Player, MessageCategory } from "./player";
import { HelpFile } from "./help";
import { _ } from "../i18n";

// load package
const __VERSION__ = require("../../package.json").version;

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
			player.sendLine(_("telnetMUD v%s", __VERSION__));
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
		let mob: dungeon.Mob|undefined;
		function getName(){
			player.ask(_("What's your name?"), function(response: string){
				name = response;
				confirmName();
			});
		};

		function confirmName(){
			player.yesno(_("You sure your name is %s?", name), function(yes: boolean|undefined){
				if(yes === undefined) return confirmName();
				if(!yes) return getName();
				return createNewCharacter();
			});
		};

		function createNewCharacter(){
			mob = new dungeon.Mob();
			mob.name = name;
			motd();
		}

		function motd(){
			let motd: HelpFile|undefined = database.getHelpFileByKeyword(_("motd"));
			player.sendLine(motd ? motd.body : _("There is no MOTD."));
			player.ask(_("Press enter to continue..."), finish);
		}

		function finish(){
			if(!mob) throw new Error(_("Somehow finished nanny with no mob."));
			player.mob = mob;
			mob.move(MUD.world.getRoom(0,0,0));
			player.sendMessage(_("Welcome to the world, %s!", mob.toString()), MessageCategory.MSG_INFO);
			player.sendPrompt();
		};

		getName();
	}
}
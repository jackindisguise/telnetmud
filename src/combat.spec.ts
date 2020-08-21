// mocha and chai
import "mocha";
import { expect, assert } from "chai";

// local includes
import { CombatManager } from "./combat";
import * as dungeon from "./dungeon";

// local definitions
let d: dungeon.Dungeon = new dungeon.Dungeon({
	proportions:{width:1,height:1,layers:2},
	fill: true
})

let room1 = d.getRoom({x:0,y:0,z:0});
let room2 = d.getRoom({x:0,y:0,z:0});
let attacker: dungeon.Mob = new dungeon.Mob({location:room1});
attacker.level = 10;
attacker.name = "Carl";

let defender: dungeon.Mob = new dungeon.Mob({location:room1});
defender.name = "Mikey";

let attackerDied = false;
let defenderDied = false;

describe("combat", function(){
	it("Attacker engages defender.", function(done){
		attacker.hit(defender);
		expect(attacker.target).is.equal(defender);
		expect(defender.target).is.equal(attacker);
		done();
	});

	it("Defender dies and combat finishes.", function(done){
		let odie = defender.die;
		defender.die = function(killer: dungeon.Mob){
			defenderDied = true;
			odie.call(defender, killer);
		};

		let ostop = CombatManager.stop;
		CombatManager.stop = function(){
			ostop();
			expect(attackerDied).is.false;
			expect(defenderDied).is.true;
			done();
		}
	}).timeout(30000);
});
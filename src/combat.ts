import { Mob, PC, NPC } from "./dungeon";
import * as cron from "node-cron";

export class CombatManager{
	private static cycles: number = 0;
	private static mobs: Mob[] = [];
	private static job: cron.ScheduledTask|undefined;
	static add(...mobs: Mob[]){
		for(let mob of mobs){
			if(CombatManager.mobs.indexOf(mob) === -1)
			CombatManager.mobs.push(mob);
		}

		if(CombatManager.mobs.length > 0) CombatManager.start();
	}

	static remove(...mobs: Mob[]){
		for(let mob of mobs){
			let pos: number = CombatManager.mobs.indexOf(mob);
			if(pos !== -1) CombatManager.mobs.splice(pos, 1);
		}
	}

	static start(){
		if(CombatManager.job) return;
		CombatManager.job = cron.schedule("*/3 * * * * *", function(){
			CombatManager.cycle();
		});
	}

	static cycle(){
		// re-sort on every cycle
		CombatManager.mobs.sort(function(a:Mob, b:Mob): number{
			return b.agility - a.agility;
		});

		// produce safe copy
		let safe: Mob[] = CombatManager.mobs.slice()

		for(let mob of safe){
			// mob has a target
			if(mob.target) {
				// target is invalid for some reason
				if(!mob.canTarget(mob.target)) {
					if(mob instanceof NPC) mob.selectMostHatedTarget();
					else mob.disengage();
				} else {
					mob.round();
				}
			}

			// don't make this an else
			// this way it processes after hits too
			if(!mob.target) {
				CombatManager.remove(mob);
				continue;
			}
		}

		for(let mob of CombatManager.mobs){
			if(!mob.target) continue;
			mob.sendPrompt();
		}

		if(!CombatManager.mobs.length) this.stop();
	}

	static die(deceased: Mob){
		for(let mob of CombatManager.mobs){
			if(mob instanceof NPC) mob.removeHateTarget(deceased);
			else if(mob.target === deceased) mob.disengage();
		}
	}

	static stop(){
		if(!CombatManager.job) return;
		CombatManager.job.stop();
		CombatManager.job = undefined;
	}
}
import { Mob } from "./dungeon";
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
			if(mob.target) mob.hit(mob.target);

			// don't make this an else
			// this way it processes after hits too
			if(!mob.target) {
				CombatManager.remove(mob);
				continue;
			}
		}

		for(let mob of CombatManager.mobs){
			if(!mob.target) continue;
			mob.info(`<You: ${Math.ceil(mob.currentHealth / mob.maxHealth * 100)}%> <${mob.target.name}: ${Math.ceil(mob.target.currentHealth / mob.target.maxHealth * 100)}%>`);
			mob.sendPrompt();
		}

		if(!CombatManager.mobs.length) this.stop();
	}

	static die(deceased: Mob){
		for(let mob of CombatManager.mobs){
			mob.removeHateTarget(deceased);
		}
	}

	static stop(){
		if(!CombatManager.job) return;
		CombatManager.job.stop();
		CombatManager.job = undefined;
	}
}
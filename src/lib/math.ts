export function lerp(min:number, max:number, mod:number): number{
	return min+((max-min)*mod);
}

export function rangeInt(min:number, max:number): number{
	return Math.ceil(lerp(min, max, Math.random()));
}

export function probability(p:number): boolean{
	if(p===0) return false;
	if(p===1) return true;
	return Math.random() < p;
};

export function roll(die:string): number;
export function roll(die:number, sides:number): number;
export function roll(die:number, sides:number, mod:number): number;
export function roll(die:number|string, sides?:number, mod?:number): number{
	if(typeof die === "string") { // string rolls
		let result = die.match(/(\d+)d(\d+)(?:([-+])(\d+))?/);
		if(!result) return 0;
		die = Number(result[1]);
		sides = Number(result[2]);
		mod = Number(result[4]);
		if(result[3]==="-") mod = 0-mod;
		return roll(die,sides,mod);
	}

	if(sides) { // regular number rolls
		if(mod) return rangeInt(die,sides*die)+mod;
		else return rangeInt(die,sides*die);
	}

	return 0; // should never happen
}

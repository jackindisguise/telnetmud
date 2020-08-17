export enum AttributeID{
	STRENGTH,
	AGILITY,
	INTELLIGENCE,
	MAX_HEALTH,
	MAX_STAMINA,
	MAX_MANA
}

export const AttributeNames = new Map<AttributeID, string>([
	[AttributeID.STRENGTH, "strength"],
	[AttributeID.AGILITY, "agility"],
	[AttributeID.INTELLIGENCE, "intelligence"],
	[AttributeID.MAX_HEALTH, "max health"],
	[AttributeID.MAX_STAMINA, "max stamina"],
	[AttributeID.MAX_MANA, "max mana"]
])

export enum ModifierType{
	BASE,
	BONUS
}

export class Attribute{
	modifiers: AttributeModifier[] = [];
	get base(): number{
		let val = 0;
		for(let modifier of this.modifiers){
			if(!(modifier instanceof FlatAttributeModifier)) continue;
			if(modifier.type !== ModifierType.BASE) continue;
			val += modifier.value;
		}
	
		return val;
	}

	get bonus(): number{
		let val = 0;
		for(let modifier of this.modifiers){
			if(!(modifier instanceof FlatAttributeModifier)) continue;
			if(modifier.type !== ModifierType.BONUS) continue;
			val += modifier.value;
		}
	
		return val;
	}

	get value(): number{
		return Math.floor(this.base + this.bonus);
	}

	addModifier(...modifiers: AttributeModifier[]){
		for(let modifier of modifiers){
			if(this.modifiers.indexOf(modifier) !== -1) continue;
			this.modifiers.push(modifier);
		}
	}

	removeModifier(...modifiers: AttributeModifier[]){
		for(let modifier of modifiers.concat()){
			let pos = this.modifiers.indexOf(modifier);
			if(pos === -1) continue;
			this.modifiers.splice(pos, 1);
		}
	}
}

export type AttributeModifierOptions={
	attributeID: AttributeID,
	type?: ModifierType,
	value: number|(()=>number);
}

export class AttributeModifier{
	attributeID: AttributeID;
	type: ModifierType;
	private _value: number|(()=>number);
	constructor(options: AttributeModifierOptions){
		this.attributeID = options.attributeID;
		this.type = options.type || ModifierType.BONUS;
		this._value = options.value;
	}

	get value(): number{
		return typeof this._value === "function" ? this._value() : this._value;
	}
}

export class FlatAttributeModifier extends AttributeModifier{
	
}

export class MultiplierAttributeModifier extends AttributeModifier{

}
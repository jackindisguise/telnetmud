import { AttributeID } from "./attribute";

export class Classification{
	display: string = "???";
	attributeBase?: Map<AttributeID, number>;
	attributePerLevel?: Map<AttributeID, number>;
	getAttributeBaseValue(attribute:AttributeID): number{
		return this.attributeBase?.get(attribute) || 0;
	}

	getAttributePerLevel(attribute:AttributeID, level: number): number{
		return this.attributePerLevel?.get(attribute) || 0;
	}

	getAttributeTotalForLevel(attribute:AttributeID, level: number): number{
		let base = this.attributeBase?.get(attribute) || 0;
		let bonus = this.attributePerLevel?.get(attribute) || 0;
		return base + (bonus*(level-1));
	}
}

export class Race extends Classification{
	attributeBase = new Map<AttributeID, number>([
		[AttributeID.STRENGTH, 10],
		[AttributeID.AGILITY, 10],
		[AttributeID.INTELLIGENCE, 10],
		[AttributeID.TO_NEXT_LEVEL, 100]
	])
}

export class Human extends Race{
	display = "human";
}

export class Class extends Classification{
	attributePerLevel = new Map<AttributeID, number>([
		[AttributeID.STRENGTH, 1],
		[AttributeID.AGILITY, 1],
		[AttributeID.INTELLIGENCE, 1],
	])
}

export class Adventurer extends Class{
	display = "adventurer";
}

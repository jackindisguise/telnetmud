import { AttributeID } from "./attribute";

export class Classification{
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
}

export class Human extends Race{
	attributeBase = new Map<AttributeID, number>([
		[AttributeID.STRENGTH, 10],
		[AttributeID.AGILITY, 10],
		[AttributeID.INTELLIGENCE, 10],
	])
}

export class Class extends Classification{
}

export class Warrior extends Class{
	attributePerLevel = new Map<AttributeID, number>([
		[AttributeID.STRENGTH, 1.50],
		[AttributeID.AGILITY, 1.25],
		[AttributeID.INTELLIGENCE, 1.25],
	])
}
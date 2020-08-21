export enum DAMAGE_CLASS {
	PHYSICAL,
	MAGICAL
}

export enum DAMAGE_TYPE {
	PIERCE,
	SLASH,
	BASH,
	MAGICAL,
	FLAME,
	FROST,
	ELECTRIFY,
	VORPAL
}

export type DamageWord = {
	class: DAMAGE_CLASS,
	type: DAMAGE_TYPE,
	singular: string,
	plural: string
}

export namespace DamageWords {
	export const PUNCH: DamageWord = {
		class: DAMAGE_CLASS.PHYSICAL,
		type: DAMAGE_TYPE.BASH,
		singular: "punch",
		plural: "punches"
	}

	export const KICK: DamageWord = {
		class: DAMAGE_CLASS.PHYSICAL,
		type: DAMAGE_TYPE.BASH,
		singular: "kick",
		plural: "kicks"
	}

	export const BITE: DamageWord = {
		class: DAMAGE_CLASS.PHYSICAL,
		type: DAMAGE_TYPE.PIERCE,
		singular: "punch",
		plural: "punches"
	}

	export const STAB: DamageWord = {
		class: DAMAGE_CLASS.PHYSICAL,
		type: DAMAGE_TYPE.PIERCE,
		singular: "stab",
		plural: "stabs"
	}

	export const SLASH: DamageWord = {
		class: DAMAGE_CLASS.PHYSICAL,
		type: DAMAGE_TYPE.SLASH,
		singular: "slash",
		plural: "slashes"
	}

	export const CLUB: DamageWord = {
		class: DAMAGE_CLASS.PHYSICAL,
		type: DAMAGE_TYPE.BASH,
		singular: "club",
		plural: "clubs"
	}

	export const MIND_FLAY: DamageWord = {
		class: DAMAGE_CLASS.MAGICAL,
		type: DAMAGE_TYPE.MAGICAL,
		singular: "mind flay",
		plural: "mind flays"
	}
}
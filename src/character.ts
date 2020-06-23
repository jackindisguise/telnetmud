import { Mob, DObject, Room } from "./dungeon";

export type CharacterData = {
	name: string,
	password: string
}

type CharacterOptions = {
	password: string,
	location?: DObject|Room
}

export class Character extends Mob{
	password: string;
	constructor(options:CharacterOptions){
		super(options);
		this.password = options.password;
	}

	createCharacterData(): CharacterData{
		return {
			name: this.keywords,
			password: this.password
		};
	}
}

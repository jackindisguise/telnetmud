import { Mob, DObject, Room, CartesianCoordinates } from "./dungeon";

export type CharacterData = {
	name: string,
	password: string,
	location: CartesianCoordinates
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
			password: this.password,
			location: {x:this.x||0, y:this.y||0, z:this.z||0}
		};
	}
}

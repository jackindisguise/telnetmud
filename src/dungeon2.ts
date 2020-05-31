// gonna refactor the entire dungeon setup
// think i'll stop trying to replicate BYOND's ATOM setup.
// no real reason to do it.
import { Direction } from "./direction";
import * as color from "./color";

export type Dimensions = {
	width: number,
	height: number,
	layers: number
}

export type CartesianCoordinates = {
	x:number,
	y:number,
	z:number
}

export class Dungeon{
	contents: (DObj|Room)[] = [];
	dimensions: Dimensions|undefined;
	grid: (Room|null)[][][]|undefined;
	constructor(){
	}

	add(...objs:DObj[]){

	}

	remove(...objs:DObj[]){

	}
}

export type RoomOptions = {
	dungeon?: Dungeon,
	coordinates?: CartesianCoordinates
}


export class Room{
	title: string = "a room";
	description: string = "a description";
	dungeon: Dungeon|undefined;
	coordinates: CartesianCoordinates|undefined;
	contents: DObj[] = [];
	constructor(options?: RoomOptions){
		if(options) {
			if(options.dungeon) this.dungeon = options.dungeon;
			if(options.coordinates) this.coordinates = options.coordinates;
		}
	}
}

export class DObj{
	contents: DObj[] = [];
}

export class Mob extends DObj{

}

export class Item extends DObj{

}
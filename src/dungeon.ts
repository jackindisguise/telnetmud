import { Direction } from "./direction";

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

export interface Occupier{
	location: Occupiable|null;
}

export interface Occupiable{
	add(occupier:Occupier): void;
	remove(occupier:Occupier): void;
	contains(occupier:Occupier): boolean;
	allowEnter(location:Occupier): boolean;
	allowExit(location:Occupier): boolean;
	contents: Occupier[];
}

export interface Movable{
	canMove(location:Occupiable): boolean;
	move(location:Occupiable): boolean;
}

export class CoordinateOutOfBoundsError extends Error{
	coordinate: string;
	value: number;
	constructor(coordinate: string, value: number){
		super();
		this.coordinate = coordinate;
		this.value = value;
		this.message = `Invalid coordinate '${coordinate}': ${value}`;
	}
}

export class CoordinatesOccupiedError extends Error{
	dungeon: Dungeon;
	coordinates: CartesianCoordinates;
	constructor(dungeon: Dungeon, coordinates: CartesianCoordinates){
		super();
		this.dungeon = dungeon;
		this.coordinates = coordinates;
		this.message = `Dungeon ${dungeon} already has a room located @${coordinates}.`
	}
}

export class NoRoomError extends Error{
	dungeon: Dungeon;
	coordinates: CartesianCoordinates;
	constructor(dungeon:Dungeon, coordinates:CartesianCoordinates){
		super();
		this.dungeon = dungeon;
		this.coordinates = coordinates;
		this.message = `Dungeon ${dungeon} has no room located @${coordinates}.`
	}
}

type DungeonOptions = {
	proportions: Dimensions,
	fill: boolean
}

export class Dungeon{
	contents: (Occupier|Occupiable)[] = [];
	grid!: (Room|null)[][][];
	proportions: Dimensions;
	constructor(options: DungeonOptions){
		this.proportions = options.proportions;
		this.buildGrid(options.fill);
	}

	add(occupier:Occupier|Occupiable): void{
		if(this.contents.indexOf(occupier) != -1) return;
		this.contents.push(occupier);
	}

	remove(occupier:Occupier|Occupiable): void{
		let i:number = this.contents.indexOf(occupier);
		if(i == -1) return;
		this.contents.splice(i, 1);
	}

	contains(occupier:Occupier): boolean{
		return (this.contents.indexOf(occupier) != -1);
	}

	buildGrid(fill:boolean): void{
		if(this.grid) throw new Error("Grid already built.");
		this.grid = new Array(this.proportions.layers);
		for(let z=0;z<this.proportions.layers;z++){
			this.grid[z] = new Array(this.proportions.height);
			for(let y=0;y<this.proportions.height;y++){
				this.grid[z][y] = new Array(this.proportions.width);
				if(fill) for(let x=0;x<this.proportions.width;x++) this.createRoom({x:x,y:y,z:z});
			}
		}
	}

	createRoom(coordinates:CartesianCoordinates): Room{
		if(coordinates.x < 0 || coordinates.x >= this.proportions.width) throw new CoordinateOutOfBoundsError("x", coordinates.x);
		if(coordinates.y < 0 || coordinates.y >= this.proportions.height) throw new CoordinateOutOfBoundsError("y", coordinates.y);
		if(coordinates.z < 0 || coordinates.z >= this.proportions.layers) throw new CoordinateOutOfBoundsError("z", coordinates.z);
		if(this.grid[coordinates.z][coordinates.y][coordinates.x]) throw new CoordinatesOccupiedError(this, coordinates);
		let room:Room = new Room({coordinates:coordinates, dungeon:this});
		this.add(room);
		this.grid[coordinates.z][coordinates.y][coordinates.x] = room;
		return room;
	}

	getRoom(coordinates:CartesianCoordinates): Room{
		if(coordinates.x < 0 || coordinates.x >= this.proportions.width) throw new CoordinateOutOfBoundsError("x", coordinates.x);
		if(coordinates.y < 0 || coordinates.y >= this.proportions.height) throw new CoordinateOutOfBoundsError("y", coordinates.y);
		if(coordinates.z < 0 || coordinates.z >= this.proportions.layers) throw new CoordinateOutOfBoundsError("z", coordinates.z);
		let room:Room|null = this.grid[coordinates.z][coordinates.y][coordinates.x];
		if(!room) throw new NoRoomError(this, coordinates);
		return room;
	}

	getStep(coordinates:CartesianCoordinates, direction:Direction): Room{
		if(direction&Direction.NORTH) coordinates.y--;
		else if(direction&Direction.SOUTH) coordinates.y++;
		if(direction&Direction.EAST) coordinates.x++;
		else if(direction&Direction.WEST) coordinates.x--;
		if(direction&Direction.UP) coordinates.z++;
		else if(direction&Direction.DOWN) coordinates.z--;
		return this.getRoom(coordinates);
	}
}

type RoomOptions = {
	dungeon: Dungeon,
	coordinates: CartesianCoordinates
}

export class Room implements Occupiable{
	private _dungeon: Dungeon;
	private _coordinates: CartesianCoordinates;
	private _contents: Occupier[] = [];
	constructor(options: RoomOptions){
		this._dungeon = options.dungeon;
		this._coordinates = options.coordinates;
	}

	get dungeon(): Dungeon{
		return this._dungeon;
	}

	get coordinates(): CartesianCoordinates{
		return this._coordinates;
	}

	get contents(): Occupier[]{
		return this._contents;
	}

	get x(): number{
		return this._coordinates.x;
	}

	get y(): number{
		return this._coordinates.y;
	}

	get z(): number{
		return this._coordinates.z;
	}

	add(occupier:Occupier): void{
		if(this.contents.indexOf(occupier) != -1) return;
		this.contents.push(occupier);
		if(occupier.location != this) occupier.location = this;
		this.dungeon.add(occupier);
	}

	remove(occupier:Occupier): void{
		let i:number = this.contents.indexOf(occupier);
		if(i == -1) return;
		this.contents.splice(i, 1);
		this.dungeon.remove(occupier);
		if(occupier.location == this) occupier.location = null;
	}

	contains(occupier:Occupier): boolean{
		return (this.contents.indexOf(occupier) != -1);
	}

	allowEnter(occupier:Occupier): boolean{
		return true;
	}

	allowExit(occupier:Occupier): boolean{
		return true;
	}

	getStep(direction:Direction): Room{
		return this.dungeon.getStep(this.coordinates, direction);
	}
}

type DObjectOptions = {
	location?: Occupiable
};

export class DObject implements Occupiable, Occupier{
	private _location: Occupiable|null = null;
	private _contents: Occupier[] = [];
	constructor(options?:DObjectOptions){
		if(!options) return;
		if(options.location) this.location = options.location;
	}

	get location(): Occupiable|null{
		return this._location;
	}

	set location(location:Occupiable|null){
		if(this.location) {
			let olocation: Occupiable = this.location;
			this._location = null;
			olocation.remove(this);
		}

		if(!location) return;
		this._location = location;
		location.add(this);
	}

	get contents(): Occupier[]{
		return this._contents;
	}

	get x(): number|null{
		if(this.location && this.location instanceof Room) return this.location.x;
		return null;
	}

	get y(): number|null{
		if(this.location && this.location instanceof Room) return this.location.y;
		return null;
	}

	get z(): number|null{
		if(this.location && this.location instanceof Room) return this.location.z;
		return null;
	}

	add(occupier:Occupier): void{
		if(this.contents.indexOf(occupier) != -1) return;
		this.contents.push(occupier);
		if(occupier.location != this) occupier.location = this;
	}

	remove(occupier:Occupier): void{
		let i:number = this.contents.indexOf(occupier);
		if(i == -1) return;
		this.contents.splice(i, 1);
		if(occupier.location == this) occupier.location = null;
	}

	contains(occupier:Occupier): boolean{
		return (this.contents.indexOf(occupier) != -1);
	}

	allowEnter(location:Occupier): boolean{
		return true;
	}

	allowExit(location:Occupier): boolean{
		return true;
	}
}

export class Mob extends DObject implements Movable{
	canMove(location:Occupiable): boolean{
		if(this.location && !this.location.allowExit(this)) return false;
		if(!location.allowEnter(this)) return false;
		return true;
	}

	move(location:Occupiable|null): boolean{
		if(location && !this.canMove(location)) return false;
		this.location = location;
		return true;
	}

	getStep(direction:Direction): Room{
		if(!this.location) throw new Error("Not located on a room.");
		if(!(this.location instanceof Room)) throw new Error("Not located on a room."); 
		return this.location.getStep(direction);
	}

	canStep(direction:Direction): boolean{
		let room:Room = this.getStep(direction);
		return this.canMove(room);
	}

	step(direction:Direction): boolean{
		let room:Room = this.getStep(direction);
		return this.move(room);
	}
}

export class Item extends DObject implements Movable{
	canMove(location:Occupiable): boolean{
		if(this.location && !this.location.allowExit(this)) return false;
		if(location.allowEnter(this)) return false;
		return true;
	}

	move(location:Occupiable|null): boolean{
		if(location && !this.canMove(location)) return false;
		this.location = location;
		return true;
	}
}

export class Equipment extends Item{

}

export class Weapon extends Equipment{

}

export class Armor extends Equipment{

}

import { Direction, Directions } from "./direction";
import * as color from "./color";
import * as player from "./player";
import { CombatManager } from "./combat";
import { Attribute, AttributeID, AttributeModifier, ModifierType } from "./attribute";
import { Race, Class } from "./classification";

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

type RoomPrototypeKeys = {
	[key: string]: RoomPrototypeKey
}

type RoomPrototypeKey = {
	name: string,
	description: string,
	mapText: string
}

export type DungeonPrototype = {
	proportions: Dimensions,
	keys: RoomPrototypeKeys,
	grid: any[][][]
}

export class Dungeon{
	contents: (Room|DObject)[] = [];
	grid!: (Room|undefined)[][][];
	proportions: Dimensions;
	constructor(options: DungeonOptions){
		this.proportions = options.proportions;
		this.buildGrid(options.fill);
	}

	add(occupier:Room|DObject): void{
		if(this.contents.indexOf(occupier) != -1) return;
		this.contents.push(occupier);
	}

	remove(occupier:Room|DObject): void{
		let i:number = this.contents.indexOf(occupier);
		if(i == -1) return;
		this.contents.splice(i, 1);
	}

	contains(occupier:Room|DObject): boolean{
		return (this.contents.indexOf(occupier) != -1);
	}

	private buildGrid(fill:boolean): void{
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

	getRoom(coordinates:CartesianCoordinates): Room|undefined;
	getRoom(x:number, y:number, z:number): Room|undefined;
	getRoom(coordinates:CartesianCoordinates|number, y?:number, z?:number): Room|undefined{
		if(typeof coordinates === "number" && y !== undefined && z !== undefined) coordinates = {x:coordinates, y:y, z:z};
		if(coordinates && coordinates instanceof Object){
			if(coordinates.x < 0 || coordinates.x >= this.proportions.width) return undefined;
			if(coordinates.y < 0 || coordinates.y >= this.proportions.height) return undefined;
			if(coordinates.z < 0 || coordinates.z >= this.proportions.layers) return undefined;
			let room:Room|undefined = this.grid[coordinates.z][coordinates.y][coordinates.x];
			if(!room) return undefined;
			return room;
		}
	}

	getArea(coordinates:CartesianCoordinates, size:number){
		let area: (Room|undefined)[][] = [];
		for(let y=coordinates.y-size;y<=coordinates.y+size;y++){
			let row: (Room|undefined)[] = [];
			for(let x=coordinates.x-size;x<=coordinates.x+size;x++){
				let room: Room|undefined = this.getRoom({x:x,y:y,z:coordinates.z});
				row.push(room);
			}

			area.push(row);
		}

		return area;
	}

	getStep(coordinates:CartesianCoordinates, direction:Direction): Room|undefined{
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

export class Room{
	name: string = "a room";
	description: string = "It's a room.";
	mapText = ".";
	private _dungeon: Dungeon;
	private _coordinates: CartesianCoordinates;
	private _contents: DObject[] = [];
	constructor(options: RoomOptions){
		this._dungeon = options.dungeon;
		this._coordinates = options.coordinates;
	}

	get dungeon(): Dungeon{
		return this._dungeon;
	}

	get coordinates(): CartesianCoordinates{
		return {x:this.x, y:this.y, z:this.z};
	}

	get contents(): DObject[]{
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

	exits(): Direction[]{
		let exits: Direction[] = [];
		for(let exit of Directions){
			if(this.getStep(exit)){
				exits.push(exit);
			}
		}

		return exits;
	}

	add(occupier:DObject): void{
		if(this.contents.indexOf(occupier) != -1) return;
		this.contents.push(occupier);
		if(occupier.location !== this) occupier.location = this;
		this.dungeon.add(occupier);
	}

	remove(occupier:DObject): void{
		let i:number = this.contents.indexOf(occupier);
		if(i == -1) return;
		this.contents.splice(i, 1);
		this.dungeon.remove(occupier);
		if(occupier.location === this) occupier.location = undefined;
	}

	contains(occupier:DObject): boolean{
		return (this.contents.indexOf(occupier) != -1);
	}

	allowEnter(occupier:DObject): boolean{
		return true;
	}

	allowExit(occupier:DObject): boolean{
		return true;
	}

	getStep(direction:Direction): Room|undefined{
		return this.dungeon.getStep(this.coordinates, direction);
	}
}

type DObjectOptions = {
	location?: DObject|Room
};

export class DObject{
	keywords: string = "dobject";
	display: string = "DObject";
	mapText: string = "O";
	private _location: Room|DObject|undefined;
	private _contents: DObject[] = [];
	constructor(options?:DObjectOptions){
		if(!options) return;
		if(options.location) this.location = options.location;
	}

	toString(): string{
		return this.display;
	}

	get name(): string{
		return this.display;
	}

	set name(name: string){
		this.keywords = color.strip(name.trim().toLowerCase());
		this.display = name;
	}

	get location(): Room|DObject|undefined{
		return this._location;
	}

	set location(location:Room|DObject|undefined){
		if(this.location) {
			let olocation: Room|DObject|undefined = this.location;
			this._location = undefined;
			olocation.remove(this);
		}

		if(!location) return;
		this._location = location;
		location.add(this);
	}

	get contents(): DObject[]{
		return this._contents;
	}

	get coordinates(): CartesianCoordinates|undefined{
		if(this.location && this.location instanceof Room) return this.location.coordinates;
	}

	get x(): number|undefined{
		if(this.location && this.location instanceof Room) return this.location.x;
	}

	get y(): number|undefined{
		if(this.location && this.location instanceof Room) return this.location.y;
	}

	get z(): number|undefined{
		if(this.location && this.location instanceof Room) return this.location.z;
	}

	add(occupier:DObject): void{
		if(this.contents.indexOf(occupier) != -1) return;
		this.contents.push(occupier);
		if(occupier.location != this) occupier.location = this;
	}

	remove(occupier:DObject): void{
		let i:number = this.contents.indexOf(occupier);
		if(i == -1) return;
		this.contents.splice(i, 1);
		if(occupier.location == this) occupier.location = undefined;
	}

	contains(occupier:DObject): boolean{
		return (this.contents.indexOf(occupier) != -1);
	}

	allowEnter(location:DObject): boolean{
		return true;
	}

	allowExit(location:DObject): boolean{
		return true;
	}
}

export class Movable extends DObject{
	canMove(location:DObject|Room): boolean{
		if(this.location && !this.location.allowExit(this)) return false;
		if(!location.allowEnter(this)) return false;
		return true;
	}

	move(location:DObject|Room|undefined): boolean{
		if(location && !this.canMove(location)) return false;
		this.location = location;
		return true;
	}

	getStep(direction:Direction): Room|undefined{
		if(!this.location) throw new Error("Trying to step with no location.");
		if(!(this.location instanceof Room)) throw new Error("Trying to step while not in a room.");
		return this.location.getStep(direction);
	}

	canStep(direction:Direction): boolean{
		let room:Room|undefined = this.getStep(direction);
		if(!room) return false;
		return this.canMove(room);
	}

	step(direction:Direction): boolean{
		if(!this.canStep(direction)) return false;
		let room:Room|undefined = this.getStep(direction);
		if(!room) return false;
		return this.move(room);
	}
}

export class Mob extends Movable{
	race?: Race;
	class?: Class;
	level: number = 1;
	player?: player.Player;
	mapText: string = "!";
	currentHealth: number = 100;
	currentStamina: number = 100;
	currentMana: number = 100;
	attributes: Map<AttributeID, Attribute> = new Map<AttributeID, Attribute>([
		[AttributeID.STRENGTH, new Attribute()],
		[AttributeID.AGILITY, new Attribute()],
		[AttributeID.INTELLIGENCE, new Attribute()],
		[AttributeID.MAX_HEALTH, new Attribute()],
		[AttributeID.MAX_STAMINA, new Attribute()],
		[AttributeID.MAX_MANA, new Attribute()]
	]);
	hated: Map<Mob, number> = new Map<Mob, number>(); // hate tracker for AI
	target?: Mob; // mob we're currently in combat with

	constructor(options?:DObjectOptions){
		super(options);
		this.generateClassificationModifiers();
	}

	private generateClassificationModifiers(){
		let mob = this;
		for(let attr of this.attributes.entries()){
			attr[1].addModifier(new AttributeModifier({
				attributeID: attr[0],
				type: ModifierType.BASE,
				value: function() { return mob.race?.getAttributeTotalForLevel(attr[0], mob.level) || 0; }
			}));
		}
	}

	ask(question: string, callback: (...args:string[]) => void){
		if(this.player) this.player.ask(question, callback);
	}

	yesno(question: string, callback: (yes: boolean|undefined) => void){
		if(this.player) this.player.yesno(question, callback);
	}

	send(data: string, colorize?:boolean){
		if(this.player) this.player.send(data, colorize);
	}

	sendLine(data: string, colorize?:boolean){
		if(this.player) this.player.sendLine(data, colorize);
	}

	sendMessage(data: string, msgCategory: player.MessageCategory, linebreak?:boolean){
		if(this.player) this.player.sendMessage(data, msgCategory, linebreak);
	}

	message(data: string){
		if(this.player) this.player.message(data);
	}

	chat(data: string){
		if(this.player) this.player.chat(data);
	}

	info(data: string){
		if(this.player) this.player.info(data);
	}

	sendPrompt(){
		if(this.player) this.player.sendPrompt();
	}

	showRoom(){
		if(this.player) this.player.showRoom();
	}

	getAttribute(id:AttributeID){
		return this.attributes.get(id)?.value || 0;
	}

	get strength(): number{
		return this.getAttribute(AttributeID.STRENGTH);
	}

	get agility(): number{
		return this.getAttribute(AttributeID.AGILITY);
	}

	get intelligence(): number{
		return this.getAttribute(AttributeID.INTELLIGENCE);
	}

	get maxHealth(): number{
		return this.getAttribute(AttributeID.MAX_HEALTH);
	}

	get maxStamina(): number{
		return this.getAttribute(AttributeID.MAX_STAMINA);
	}

	get maxMana(): number{
		return this.getAttribute(AttributeID.MAX_MANA);
	}

	hit(target: Mob){
		if(!this.target) this.engage(target);
		let damage = this.strength * 0.66;
		let defense = target.strength * 0.33;
		let final = Math.max(Math.floor(damage-defense),0);
		target.damage(final, this);
	}

	damage(amount: number, source?: Mob){
		this.currentHealth -= amount;
		if(source) this.addHate(source, amount);
		if(this.currentHealth < 1) this.die(source);
	}

	addHate(target: Mob, amount: number){
		let value: number|undefined = this.hated.get(target);
		this.hated.set(target, (value?value:0)+amount);
		this.selectMostHatedTarget();
	}

	removeHateTarget(mob: Mob){
		if(!this.hated.has(mob)) return;
		this.hated.delete(mob);
		this.selectMostHatedTarget();
	}

	selectMostHatedTarget(){
		let mostHated: Mob|undefined;
		let hateValue: number = 0;
		for(let mob of this.hated.keys()){
			let value: number|undefined = this.hated.get(mob);
			if(value === undefined) continue;
			if(!mostHated || hateValue < value){
				mostHated = mob;
				hateValue = value;
			}
		}

		if(this.target === mostHated) return;
		if(!mostHated) {
			console.log(`${this.name} doesn't hate anyone anymore.`)
			this.disengage();
			return;
		}

		console.log(`${this.name} hates ${mostHated.name} the most now.`)
		this.engage(mostHated);
	}

	engage(target: Mob){
		console.log(`${this.name} engaging ${target.name}.`)
		this.target = target;
		this.addHate(target, 0);
		CombatManager.add(this);
		CombatManager.add(target);
	}

	disengage(){
		console.log(`${this.name} disengaging from ${this.target?.name}.`);
		this.target = undefined;
		this.hated = new Map<Mob, number>();
	}

	die(killer?: Mob){
		console.log(`${this.name} dies!`);
		this.disengage();
		CombatManager.die(this);
	}
}

export class Item extends DObject{

}

export class Equipment extends Item{

}

export class Weapon extends Equipment{

}

export class Armor extends Equipment{

}

export enum Direction {
	NORTH = 0x01,
	SOUTH = 0x02,
	EAST = 0x04,
	WEST = 0x08,
	NORTHEAST = NORTH|EAST,
	NORTHWEST = NORTH|WEST,
	SOUTHEAST = SOUTH|EAST,
	SOUTHWEST = SOUTH|WEST,
	UP = 0x10,
	DOWN = 0x20
}

export enum DirectionWord {
	NORTH = "north",
	SOUTH = "south",
	EAST = "east",
	WEST = "west",
	NORTHEAST = "northeast",
	NORTHWEST = "northwest",
	SOUTHEAST = "southeast",
	SOUTHWEST = "southwest",
	UP = "up",
	DOWN = "down"
}

export enum DirectionShortWord {
	NORTH = "n",
	SOUTH = "s",
	EAST = "e",
	WEST = "w",
	NORTHEAST = "ne",
	NORTHWEST = "nW",
	SOUTHEAST = "se",
	SOUTHWEST = "sw",
	UP = "u",
	DOWN = "d"
}

export const Directions: Direction[] = [
	Direction.NORTH,
	Direction.SOUTH,
	Direction.EAST,
	Direction.WEST,
	Direction.NORTHEAST,
	Direction.NORTHWEST,
	Direction.SOUTHEAST,
	Direction.SOUTHWEST,
	Direction.UP,
	Direction.DOWN
];

export const DirectionWords: DirectionWord[] = [
	DirectionWord.NORTH,
	DirectionWord.SOUTH,
	DirectionWord.EAST,
	DirectionWord.WEST,
	DirectionWord.NORTHEAST,
	DirectionWord.NORTHWEST,
	DirectionWord.SOUTHEAST,
	DirectionWord.SOUTHWEST,
	DirectionWord.UP,
	DirectionWord.DOWN
];

export const DirectionShortWords: DirectionShortWord[] = [
	DirectionShortWord.NORTH,
	DirectionShortWord.SOUTH,
	DirectionShortWord.EAST,
	DirectionShortWord.WEST,
	DirectionShortWord.NORTHEAST,
	DirectionShortWord.NORTHWEST,
	DirectionShortWord.SOUTHEAST,
	DirectionShortWord.SOUTHWEST,
	DirectionShortWord.UP,
	DirectionShortWord.DOWN
];

export function direction2words(direction:Direction, short?: boolean): DirectionWord|DirectionShortWord{
	switch(direction){
		case Direction.NORTH: return (short ? DirectionShortWord.NORTH : DirectionWord.NORTH);
		case Direction.SOUTH: return (short ? DirectionShortWord.SOUTH : DirectionWord.SOUTH);
		case Direction.EAST: return (short ? DirectionShortWord.EAST : DirectionWord.EAST);
		case Direction.WEST: return (short ? DirectionShortWord.WEST : DirectionWord.WEST);
		case Direction.NORTHEAST: return (short ? DirectionShortWord.NORTHEAST : DirectionWord.NORTHEAST);
		case Direction.NORTHWEST: return (short ? DirectionShortWord.NORTHWEST : DirectionWord.NORTHWEST);
		case Direction.SOUTHEAST: return (short ? DirectionShortWord.SOUTHEAST : DirectionWord.SOUTHEAST);
		case Direction.SOUTHWEST: return (short ? DirectionShortWord.SOUTHWEST : DirectionWord.SOUTHWEST);
		case Direction.UP: return (short ? DirectionShortWord.UP : DirectionWord.UP);
		case Direction.DOWN: return (short ? DirectionShortWord.DOWN : DirectionWord.DOWN);
		default: throw new Error(`Invalid direction: ${direction}`);
	}
}

export function words2direction(direction:DirectionWord): Direction{
	switch(direction){
		case DirectionWord.NORTH: return Direction.NORTH;
		case DirectionWord.SOUTH: return Direction.SOUTH;
		case DirectionWord.EAST: return Direction.EAST;
		case DirectionWord.WEST: return Direction.WEST;
		case DirectionWord.NORTHEAST: return Direction.NORTHEAST;
		case DirectionWord.NORTHWEST: return Direction.NORTHWEST;
		case DirectionWord.SOUTHEAST: return Direction.SOUTHEAST;
		case DirectionWord.SOUTHWEST: return Direction.SOUTHWEST;
		case DirectionWord.UP: return Direction.UP;
		case DirectionWord.DOWN: return Direction.DOWN;
		default: throw new Error(`Invalid direction word: '%{direction}'`);
	}
}
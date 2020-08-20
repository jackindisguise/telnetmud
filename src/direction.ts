export enum Direction {
	NORTH = 0x1,
	SOUTH = 0x2,
	EAST = 0x4,
	WEST = 0x8,
	NORTHEAST = 0x1|0x4,
	NORTHWEST = 0x1|0x8,
	SOUTHEAST = 0x2|0x4,
	SOUTHWEST = 0x2|0x8,
	UP = 0x20,
	DOWN = 0x40
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

export enum DirectionWordShort {
	NORTH = "n",
	SOUTH = "s",
	EAST = "e",
	WEST = "w",
	NORTHEAST = "ne",
	NORTHWEST = "nw",
	SOUTHEAST = "se",
	SOUTHWEST = "sw",
	UP = "u",
	DOWN = "d"
}

export function reverseDirection(dir:Direction){
	let reversed = 0;
	if(dir&Direction.NORTH) reversed |= Direction.SOUTH;
	else if(dir&Direction.SOUTH) reversed |= Direction.NORTH;
	if(dir&Direction.EAST) reversed |= Direction.WEST;
	else if(dir&Direction.WEST) reversed |= Direction.EAST;
	if(dir&Direction.UP) reversed |= Direction.DOWN;
	else if(dir&Direction.DOWN) reversed |= Direction.UP;
	return reversed;
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

export const DirectionWordShorts: DirectionWordShort[] = [
	DirectionWordShort.NORTH,
	DirectionWordShort.SOUTH,
	DirectionWordShort.EAST,
	DirectionWordShort.WEST,
	DirectionWordShort.NORTHEAST,
	DirectionWordShort.NORTHWEST,
	DirectionWordShort.SOUTHEAST,
	DirectionWordShort.SOUTHWEST,
	DirectionWordShort.UP,
	DirectionWordShort.DOWN
];

export const Direction2Word: Map<Direction, DirectionWord> = new Map<Direction, DirectionWord>([
	[Direction.NORTH, DirectionWord.NORTH],
	[Direction.SOUTH, DirectionWord.SOUTH],
	[Direction.EAST, DirectionWord.EAST],
	[Direction.WEST, DirectionWord.WEST],
	[Direction.NORTHEAST, DirectionWord.NORTHEAST],
	[Direction.NORTHWEST, DirectionWord.NORTHWEST],
	[Direction.SOUTHEAST, DirectionWord.SOUTHEAST],
	[Direction.SOUTHWEST, DirectionWord.SOUTHWEST],
	[Direction.UP, DirectionWord.UP],
	[Direction.DOWN, DirectionWord.DOWN]
]);


export const Direction2WordShort: Map<Direction, DirectionWordShort> = new Map<Direction, DirectionWordShort>([
	[Direction.NORTH, DirectionWordShort.NORTH],
	[Direction.SOUTH, DirectionWordShort.SOUTH],
	[Direction.EAST, DirectionWordShort.EAST],
	[Direction.WEST, DirectionWordShort.WEST],
	[Direction.NORTHEAST, DirectionWordShort.NORTHEAST],
	[Direction.NORTHWEST, DirectionWordShort.NORTHWEST],
	[Direction.SOUTHEAST, DirectionWordShort.SOUTHEAST],
	[Direction.SOUTHWEST, DirectionWordShort.SOUTHWEST],
	[Direction.UP, DirectionWordShort.UP],
	[Direction.DOWN, DirectionWordShort.DOWN]
]);

export const Word2Direction: Map<DirectionWord, Direction> = new Map<DirectionWord, Direction>([
	[DirectionWord.NORTH, Direction.NORTH],
	[DirectionWord.SOUTH, Direction.SOUTH],
	[DirectionWord.EAST, Direction.EAST],
	[DirectionWord.WEST, Direction.WEST],
	[DirectionWord.NORTHEAST, Direction.NORTHEAST],
	[DirectionWord.NORTHWEST, Direction.NORTHWEST],
	[DirectionWord.SOUTHEAST, Direction.SOUTHEAST],
	[DirectionWord.SOUTHWEST, Direction.SOUTHWEST],
	[DirectionWord.UP, Direction.UP],
	[DirectionWord.DOWN, Direction.DOWN]
]);

export const WordShort2Direction: Map<DirectionWordShort, Direction> = new Map<DirectionWordShort, Direction>([
	[DirectionWordShort.NORTH, Direction.NORTH],
	[DirectionWordShort.SOUTH, Direction.SOUTH],
	[DirectionWordShort.EAST, Direction.EAST],
	[DirectionWordShort.WEST, Direction.WEST],
	[DirectionWordShort.NORTHEAST, Direction.NORTHEAST],
	[DirectionWordShort.NORTHWEST, Direction.NORTHWEST],
	[DirectionWordShort.SOUTHEAST, Direction.SOUTHEAST],
	[DirectionWordShort.SOUTHWEST, Direction.SOUTHWEST],
	[DirectionWordShort.UP, Direction.UP],
	[DirectionWordShort.DOWN, Direction.DOWN]
]);

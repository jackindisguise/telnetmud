import * as color from "../color";

// side parameter for pad function
export enum PadSide { LEFT, RIGHT, CENTER };

// padder functions
export function pad(str: string, side: PadSide.LEFT, size:number, padder?: string): string;
export function pad(str: string, side: PadSide.RIGHT, size:number, padder?: string): string;
export function pad(str: string, side: PadSide.CENTER, size:number, padder?: string): string;
export function pad(str: string, side: PadSide, size: number, padder?: string): string {
	let uncolored = color.strip(str);
	if(!padder) padder = " "; // default to a space
	let padding = size-uncolored.length; // total space required
	let padderCount = padding/padder.length; // total number of padders needed
	let left: number = 0;
	let right: number = 0;
	switch(side){
		case PadSide.LEFT: break;
			left = padderCount;
			break;
		case PadSide.RIGHT: break;
			right = padderCount;
			break;
		case PadSide.CENTER:
			let split = padderCount/2;
			left = split + padderCount%2;
			right = split;
			break;
	}

	return `${padder.repeat(left)}${str}${padder.repeat(right)}`
}

// alias for pad(str, PadSide.CENTER, size);
export function center(str: string, size: number, padder?: string): string{
	return pad(str, PadSide.CENTER, size);
}

// keyword functions
export function compareKeywords(needle: string, haystack: string){
	let haystacks: string[] = haystack.trim().split(/\W+/);
	let needles: string[] = needle.trim().split(/\W+/);
	for(let fNeedle of needles){
		if(fNeedle === "") return false;
		let found = false;
		for(let fHaystack of haystacks){
			if(fHaystack.startsWith(fNeedle)){
				found = true;
				break;
			}
		}

		if(!found) return false; // every needle must find 1 match in the haystack
	}

	return true;
}
export enum PadSide { LEFT, RIGHT, CENTER };

export function center(str: string, size: number, padder?: string): string {
	if(!padder) padder = " ";
	let padding = size-str.length;
	let padderRep = padding/padder.length;
	let split = padderRep/2;
	return `${padder.repeat(split + (padderRep%2))}${str}${padder.repeat(split)}`
}
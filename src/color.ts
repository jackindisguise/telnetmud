export const ColorEscapeCharacter: string = "{";
export const ColorEscapeRegExp: RegExp = new RegExp(`${ColorEscapeCharacter}(.?)`, "g");

export enum ColorCharacter {
	BLINK			= "!",
	CLEAR			= "x",
	MAROON			= "r",
	DARK_GREEN		= "g",
	OLIVE			= "y",
	NAVY			= "b",
	PURPLE			= "p",
	TEAL			= "c",
	SILVER			= "w",
	GREY			= "D",
	CRIMSON			= "R",
	LIME			= "G",
	YELLOW			= "Y",
	BLUE			= "B",
	PINK			= "P",
	CYAN			= "C",
	WHITE			= "W",
}

export namespace ColorGroup {
	export enum Telnet {
		BLINK		= "\u001b[5m",
		CLEAR		= "\u001b[0m",
		MAROON		= "\u001b[0;31m",
		DARK_GREEN	= "\u001b[0;32m",
		OLIVE		= "\u001b[0;33m",
		NAVY		= "\u001b[0;34m",
		PURPLE		= "\u001b[0;35m",
		TEAL		= "\u001b[0;36m",
		SILVER		= "\u001b[0;37m",
		GREY		= "\u001b[1;30m",
		CRIMSON		= "\u001b[1;31m",
		LIME		= "\u001b[1;32m",
		YELLOW		= "\u001b[1;33m",
		BLUE		= "\u001b[1;34m",
		PINK		= "\u001b[1;35m",
		CYAN		= "\u001b[1;36m",
		WHITE		= "\u001b[1;37m"
	}
}

export namespace ColorReplace {
	export function Telnet(substr: string, char: string): string{
		switch(char){
			case ColorEscapeCharacter: return ColorEscapeCharacter;
			case ColorCharacter.CLEAR: return ColorGroup.Telnet.CLEAR;
			case ColorCharacter.MAROON: return ColorGroup.Telnet.MAROON;
			case ColorCharacter.CRIMSON: return ColorGroup.Telnet.CRIMSON;
			case ColorCharacter.DARK_GREEN: return ColorGroup.Telnet.DARK_GREEN;
			case ColorCharacter.LIME: return ColorGroup.Telnet.LIME;
			case ColorCharacter.NAVY: return ColorGroup.Telnet.NAVY;
			case ColorCharacter.BLUE: return ColorGroup.Telnet.BLUE;
			case ColorCharacter.OLIVE: return ColorGroup.Telnet.OLIVE;
			case ColorCharacter.YELLOW: return ColorGroup.Telnet.YELLOW;
			case ColorCharacter.PURPLE: return ColorGroup.Telnet.PURPLE;
			case ColorCharacter.PINK: return ColorGroup.Telnet.PINK;
			case ColorCharacter.TEAL: return ColorGroup.Telnet.TEAL;
			case ColorCharacter.CYAN: return ColorGroup.Telnet.CYAN;
			case ColorCharacter.SILVER: return ColorGroup.Telnet.SILVER;
			case ColorCharacter.WHITE: return ColorGroup.Telnet.WHITE;
			case ColorCharacter.GREY: return ColorGroup.Telnet.GREY;
			default: return "";
		}
	}
}

export function strip(str: string){
	return str.replace(ColorEscapeRegExp, function(sub){
		return "";
	});
}

export function color(str: string, replacer: (substr: string, char: string) => string){
	return str.replace(ColorEscapeRegExp, replacer);
}
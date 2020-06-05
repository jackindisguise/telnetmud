export const ColorEscapeCharacter: string = "{";
export const ColorEscapeRegExp: RegExp = new RegExp(`${ColorEscapeCharacter}(.?)`, "g");

export enum Color {
	BLINK,
	CLEAR,
	MAROON,
	DARK_GREEN,
	OLIVE,
	NAVY,
	PURPLE,
	TEAL,
	SILVER,
	GREY,
	CRIMSON,
	LIME,
	YELLOW,
	BLUE,
	PINK,
	CYAN,
	WHITE,
}

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

export const Color2Character: Map<Color, string> = new Map<Color, string>([
	[Color.BLINK, ColorCharacter.BLINK],
	[Color.CLEAR, ColorCharacter.CLEAR],
	[Color.MAROON, ColorCharacter.MAROON],
	[Color.DARK_GREEN, ColorCharacter.DARK_GREEN],
	[Color.OLIVE, ColorCharacter.OLIVE],
	[Color.NAVY, ColorCharacter.NAVY],
	[Color.PURPLE, ColorCharacter.PURPLE],
	[Color.TEAL, ColorCharacter.TEAL],
	[Color.SILVER, ColorCharacter.SILVER],
	[Color.GREY, ColorCharacter.GREY],
	[Color.CRIMSON, ColorCharacter.CRIMSON],
	[Color.LIME, ColorCharacter.LIME],
	[Color.YELLOW, ColorCharacter.YELLOW],
	[Color.BLUE, ColorCharacter.BLUE],
	[Color.PINK, ColorCharacter.PINK],
	[Color.CYAN, ColorCharacter.CYAN],
	[Color.WHITE, ColorCharacter.WHITE]
]);

export const Character2Color: Map<string, Color> = new Map<string, Color>([
	[ColorCharacter.BLINK, Color.BLINK],
	[ColorCharacter.CLEAR, Color.CLEAR],
	[ColorCharacter.MAROON, Color.MAROON],
	[ColorCharacter.DARK_GREEN, Color.DARK_GREEN],
	[ColorCharacter.OLIVE, Color.OLIVE],
	[ColorCharacter.NAVY, Color.NAVY],
	[ColorCharacter.PURPLE, Color.PURPLE],
	[ColorCharacter.TEAL, Color.TEAL],
	[ColorCharacter.SILVER, Color.SILVER],
	[ColorCharacter.GREY, Color.GREY],
	[ColorCharacter.CRIMSON, Color.CRIMSON],
	[ColorCharacter.LIME, Color.LIME],
	[ColorCharacter.YELLOW, Color.YELLOW],
	[ColorCharacter.BLUE, Color.BLUE],
	[ColorCharacter.PINK, Color.PINK],
	[ColorCharacter.CYAN, Color.CYAN],
	[ColorCharacter.WHITE, Color.WHITE]
]);

export namespace ColorMap {
	export const Telnet: Map<Color, string> = new Map<Color, string>([
		[Color.BLINK, "\u001b[5m"],
		[Color.CLEAR, "\u001b[0m"],
		[Color.MAROON, "\u001b[0;31m"],
		[Color.DARK_GREEN, "\u001b[0;32m"],
		[Color.OLIVE, "\u001b[0;33m"],
		[Color.NAVY, "\u001b[0;34m"],
		[Color.PURPLE, "\u001b[0;35m"],
		[Color.TEAL, "\u001b[0;36m"],
		[Color.SILVER, "\u001b[0;37m"],
		[Color.GREY, "\u001b[1;30m"],
		[Color.CRIMSON, "\u001b[1;31m"],
		[Color.LIME, "\u001b[1;32m"],
		[Color.YELLOW, "\u001b[1;33m"],
		[Color.BLUE, "\u001b[1;34m"],
		[Color.PINK, "\u001b[1;35m"],
		[Color.CYAN, "\u001b[1;36m"],
		[Color.WHITE, "\u001b[1;37m"]
	]);
}

export namespace ColorReplace {
	export function Telnet(substr: string, char: string): string{
		if(char === ColorEscapeCharacter) return ColorEscapeCharacter;
		let color = Character2Color.get(char); // convert character to color code
		if(color===undefined) return ""; // if not valid, return nothing
		let code = ColorMap.Telnet.get(color); // map color to telnet color code
		if(!code) return ""; // if not valid, return nothing
		return code;
	}
}

export function strip(str: string){
	return str.replace(ColorEscapeRegExp, function(sub, char){
		if(char === ColorEscapeCharacter) return char;
		return "";
	});
}

export function color(str: string, replacer: (substr: string, char: string) => string){
	return str.replace(ColorEscapeRegExp, replacer);
}
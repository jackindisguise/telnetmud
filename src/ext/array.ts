export function pick(...options: any[]): any{
	if(options[0] instanceof Array) options = options[0]
	let split = 1/options.length;
	let roll = Math.random();
	let option = Math.floor(roll / split);
	return options[option];
}

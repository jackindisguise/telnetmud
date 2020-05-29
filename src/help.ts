export type HelpFileOptions = {
	keywords: string;
	body: string;
}

export class HelpFile{
	keywords: string;
	body: string;
	constructor(options: HelpFileOptions){
		this.keywords = options.keywords;
		this.body = options.body;
	}
}
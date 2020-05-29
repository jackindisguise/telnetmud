import * as i18n from "i18n";
export function _(phrase: string, ...args: string[]): string{
	return i18n.__(phrase, ...args);
}

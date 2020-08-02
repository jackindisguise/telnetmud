class Attribute{
	base: number = 0;
	modifiers: AttributeModifier[] = [];
	private _value: number = 0;

	get value():number{
		return this._value;
	}

	addModifier(...modifiers: AttributeModifier[]){
		let changed: boolean = false;
		for(let modifier of modifiers){
			if(this.modifiers.indexOf(modifier) !== -1) continue;
			this.modifiers.push(modifier);
			changed = true;
		}

		if(changed) this.update();
	}

	removeModifier(...modifiers: AttributeModifier[]){
		let changed: boolean = false;
		for(let modifier of modifiers){
			let pos = this.modifiers.indexOf(modifier);
			if(pos === -1) continue;
			this.modifiers.splice(pos, 1);
			changed = true;
		}

		if(changed) this.update();
	}

	update(){
		// process flat bonuses fist
		let bonus = 0;
		for(let modifier of this.modifiers){
			if(modifier instanceof AttributeModifier)
				bonus += modifier.value;
		}

		let multiplier = 1;
		for(let modifier of this.modifiers){
			if(modifier instanceof MultiplicativeAttributeModifier)
				multiplier += modifier.value;
		}

		let value = this.base;
		value *= multiplier; // multiplicate modifiers only modify the base stat
		value += bonus;
		this._value = value;
	}
}

class AttributeModifier{
	value: number = 0;
}

class MultiplicativeAttributeModifier extends AttributeModifier{
}
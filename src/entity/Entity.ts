import { ComponentI, EntityI } from "../types";

export class Entity implements EntityI {
	id: string;
	components: Map<string, ComponentI>;
	
	constructor(id: string) {
		this.id = id;
		this.components = new Map();
	}
	
	addComponent(component: ComponentI) {
		this.components.set(component.name, component);
		return this;
	};

	removeComponent(component: ComponentI | string)  {
		this.components.delete(typeof component === 'string' ? component : component.name);
		return this;
	};

	getData() {
		let data = {};

		[...this.components.values()].forEach(value => {
			data = {...data, ...value.value};
		})

		return data;
	}

	print() {
		return this;
	}
}
import {ComponentI, Values} from "../types";
import {Component} from "../component/Component";

export class Entity<C extends Record<keyof C, Values<C>>> {
	id: string;
	components: Map<string, ComponentI>;
	
	constructor(id: string) {
		this.id = id;
		this.components = new Map();
	}
	
	addComponent<T extends Record<keyof T, Values<T>>>(component: Component<T>) {
		this.components.set(component.name, component);
		return this;
	};

	removeComponent(component: ComponentI | string)  {
		this.components.delete(typeof component === 'string' ? component : component.name);
		return this;
	};

	getData(): C {
		let data = {} as C;

		[...this.components.values()].forEach(value => {
			data = {...data, ...value.value};
		})

		return data;
	}

	print() {
		return this;
	}
}
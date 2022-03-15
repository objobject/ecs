import { ComponentManagerI } from "../types";

export class ComponentManager implements ComponentManagerI {
	components: string[];

	constructor() {
		this.components = [];
	}

	isComponentRegistered(componentName: string) {
		return !!(this.components.find(name => name === componentName));
	}

	registerComponent(componentName: string) {
		this.components.push(componentName);
	}

	unregisterComponent(componentName: string) {
		const idx = this.components.findIndex(comp => comp === componentName);
	
		if (idx > -1) {
			delete this.components[idx];
		}
	}
}
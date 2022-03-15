export interface EntityI {
	id: string;
	components: Map<string, ComponentI>;
	getData: () => Record<string, unknown>;
	addComponent: (component: ComponentI) => EntityI;
	removeComponent: (component: ComponentI) => EntityI;
	print: () => EntityI;
}

export interface EntityManagerI {
	entities: Map<string, EntityI>;
	addEntity: (id: string) => EntityI;
	removeEntity: (entity: EntityI) => void;
}

export interface ComponentI<T extends Record<string, unknown> = {}> {
	name: string;
	value: T;
}

export interface ComponentManagerI {
	components: string[];
	registerComponent: (componentName: string) => void;
	unregisterComponent: (componentName: string) => void;
}

export interface WorldI {
	entityManager: EntityManagerI;
	componentManager: ComponentManagerI;

	addEntity: () => EntityI;
	removeEntity: (id: string) => void;

	registerComponent: (componentName: string) => void;
	unregisterComponent: (componentName: string) => void;
}
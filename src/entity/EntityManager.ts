import { Entity } from "./Entity";
import {Values} from "../types";

export class EntityManager<C extends Record<keyof C, Values<C>>> {
	entities: Map<string, Entity<C>>;

	constructor() {
		this.entities = new Map();
	}

	getEntity(id: string) {
		return this.entities.get(id);
	}

	addEntity(id: string) {
		const entity = new Entity<C>(id);
		this.entities.set(entity.id, entity);

		return entity;
	}

	removeEntity(entity: Entity<C> | string) {
		this.entities.delete(typeof entity === 'string' ? entity: entity.id)
	}
}
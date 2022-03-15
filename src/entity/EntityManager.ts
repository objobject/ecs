import { EntityManagerI } from "../types";
import { Entity } from "./Entity";

export class EntityManager implements EntityManagerI {
	entities: Map<string, Entity>;

	constructor() {
		this.entities = new Map();
	}

	getEntity(id: string) {
		return this.entities.get(id);
	}

	addEntity(id: string) {
		const entity = new Entity(id);
		this.entities.set(entity.id, entity);

		return entity;
	}

	removeEntity(entity: Entity | string) {
		this.entities.delete(typeof entity === 'string' ? entity: entity.id)
	}
}
import { Entity } from "../entity/Entity";
import { CONFIG } from "./config";

export class EntityManager {
	private availableEntities: number[];
	
	constructor() {
		this.availableEntities = this.initAvailableEntities();
	}

	public createEntity(): Entity {
		return this.getEntityOnFront();
	}

	public destroyEntity(entity: Entity): void {
		this.availableEntities.unshift(entity);
	}

	public getLivingEntitiesCount() {
		return CONFIG.MAX_ENTITIES - this.availableEntities.length;
	}

	private getEntityOnFront() {
		const id = this.availableEntities[0];
		this.availableEntities.shift();

		return id;
	}

	private initAvailableEntities() {
		return new Array(CONFIG.MAX_ENTITIES).fill(0).map((_, i) => i);
	}
}
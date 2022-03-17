import {Entity} from "../entity/Entity";
import {Values} from "../types";

export class System<C extends Record<keyof C, Values<C>>> {
    systemEntities: Map<string, Entity<C>>;
    sysCallback: (sysEntity: Entity<C>) => void;
    components: string[];

    constructor(sysCallback: (sysEntity: Entity<C>) => void, components: string[]) {
        this.systemEntities = new Map();
        this.sysCallback = sysCallback;
        this.components = components;
    }

    run() {
        for (let [_, entity] of this.systemEntities) {
            // do shit
            this.sysCallback(entity);
        }
    }

    addSystemEntities(entities: Entity<C>[]) {
        entities.forEach(ent => {
            this.systemEntities.set(ent.id, ent);
        });
    }
}
import {Entity} from "../entity/Entity";
import {Values} from "../types";

export class System<C extends Record<keyof C, Values<C>>, K extends Record<keyof K, Values<K>>> {
    systemEntities: Map<string, Entity<C>>;
    sysCallback: (sysEntity: Entity<C>, context: K) => void;
    components: string[];
    context: K | null;

    constructor(sysCallback: (sysEntity: Entity<C>, context: K) => void, components: string[]) {
        this.systemEntities = new Map();
        this.sysCallback = sysCallback;
        this.components = components;
        this.context = null;
    }

    run() {
        for (let [_, entity] of this.systemEntities) {
            if (this.context === null) {
                throw new Error('Context has not been initialised in one of the systems! ' + this);
            }
            // do shit
            this.sysCallback(entity, this.context);
        }
    }

    setContext(context: K) {
        this.context = context;
    }

    addSystemEntities(entities: Entity<C>[]) {
        entities.forEach(ent => {
            this.systemEntities.set(ent.id, ent);
        });
    }
}
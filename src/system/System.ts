import {Entity} from "../entity/Entity";

export class System {
    systemEntities: Map<string, Entity>;
    sysCallback: (sysEntity: Entity) => void;
    components: string[];

    constructor(sysCallback: (sysEntity: Entity) => void, components: string[]) {
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

    addSystemEntities(entities: Entity[]) {
        entities.forEach(ent => {
            this.systemEntities.set(ent.id, ent);
        });
    }
}
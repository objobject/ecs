import {EntityManager} from "../entity/EntityManager";
import {ComponentManager} from "../component/ComponentManager";
import {Entity} from "../entity/Entity";
import {Component} from "../component/Component";
import {System} from "../system/System";
import {Values} from "../types";

const FPS = 60;

export class World<C extends Record<keyof C, Values<C>>> {
    private entityManager: EntityManager<C>;
    private componentManager: ComponentManager;
    private systems: System<C>[];
    private paused: boolean;

    constructor() {
        this.entityManager = new EntityManager();
        this.componentManager = new ComponentManager();
        this.systems = [];
        this.paused = false;
    }

    loop() {
        const loopOnce = () => {
            if (!this.paused) {
                const frameStart = performance.now();
                this.systems.forEach(sys => sys.run());
                const frameEnd = performance.now();

                if (Math.random() > 0.99) {
                    console.log(frameEnd - frameStart);
                }
            }

            setTimeout(() => loopOnce(), 1000 / FPS)
        };

        loopOnce();
    }

    getEntity(id: string) {
        return this.entityManager.getEntity(id);
    }

    addEntity(id: string = this.randomId()) {
        return this.entityManager.addEntity(id);
    }

    removeEntity(entity: Entity<C> | string) {
        this.entityManager.removeEntity(entity)
    }

    entityAddComponent(entity: Entity<C> | string, component: Component<C>) {
        if (!this.componentManager.isComponentRegistered(component.name)) {
            return;
        }

        const _entity = this.getEntity(typeof entity === 'string' ? entity : entity.id);

        if (!_entity) {
            return;
        }

        _entity.addComponent(component);

        // systems

        this.updateSystemsWithEntities();
    }

    entityRemoveComponent(entity: Entity<C> | string, componentName: string) {
        const _entity = this.getEntity(typeof entity === 'string' ? entity : entity.id);

        if (!_entity) {
            return;
        }

        _entity.removeComponent(componentName);
    }

    isComponentRegistered(componentName: string) {
        return this.componentManager.components.find(name => name === componentName) !== null;
    }

    registerComponent(componentName: string) {
        this.componentManager.components.push(componentName);
    }

    unregisterComponent(componentName: string) {
        const idx = this.componentManager.components.findIndex(comp => comp === componentName);

        if (idx > -1) {
            delete this.componentManager.components[idx];
        }
    }

    registerSystem(system: System<C>) {
        this.systems.push(system);

        this.updateSystemsWithEntities();
    }

    private updateSystemsWithEntities() {
        const entities = this.entityManager.entities;
        const systems = this.systems;

        [...entities.values()].forEach(entity => {
            systems.forEach(system => {
                if (system.components.every(comp => !!(entity.components.get(comp)))) {
                    system.addSystemEntities([entity]);
                }
            })
        })
    }

    private randomId() {
        return '' + Math.random();
    }
}
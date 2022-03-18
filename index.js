/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/component/Component.ts":
/*!************************************!*\
  !*** ./src/component/Component.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Component = void 0;
class Component {
    constructor(name, data) {
        this.name = name;
        this.value = data;
    }
}
exports.Component = Component;


/***/ }),

/***/ "./src/component/ComponentManager.ts":
/*!*******************************************!*\
  !*** ./src/component/ComponentManager.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentManager = void 0;
class ComponentManager {
    constructor() {
        this.components = [];
    }
    isComponentRegistered(componentName) {
        return !!(this.components.find(name => name === componentName));
    }
    registerComponent(componentName) {
        this.components.push(componentName);
    }
    unregisterComponent(componentName) {
        const idx = this.components.findIndex(comp => comp === componentName);
        if (idx > -1) {
            delete this.components[idx];
        }
    }
}
exports.ComponentManager = ComponentManager;


/***/ }),

/***/ "./src/entity/Entity.ts":
/*!******************************!*\
  !*** ./src/entity/Entity.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Entity = void 0;
class Entity {
    constructor(id) {
        this.id = id;
        this.components = new Map();
    }
    addComponent(component) {
        this.components.set(component.name, component);
        return this;
    }
    ;
    removeComponent(component) {
        this.components.delete(typeof component === 'string' ? component : component.name);
        return this;
    }
    ;
    getData() {
        let data = {};
        [...this.components.values()].forEach(value => {
            data = Object.assign(Object.assign({}, data), value.value);
        });
        return data;
    }
    print() {
        return this;
    }
}
exports.Entity = Entity;


/***/ }),

/***/ "./src/entity/EntityManager.ts":
/*!*************************************!*\
  !*** ./src/entity/EntityManager.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityManager = void 0;
const Entity_1 = __webpack_require__(/*! ./Entity */ "./src/entity/Entity.ts");
class EntityManager {
    constructor() {
        this.entities = new Map();
    }
    getEntity(id) {
        return this.entities.get(id);
    }
    addEntity(id) {
        const entity = new Entity_1.Entity(id);
        this.entities.set(entity.id, entity);
        return entity;
    }
    removeEntity(entity) {
        this.entities.delete(typeof entity === 'string' ? entity : entity.id);
    }
}
exports.EntityManager = EntityManager;


/***/ }),

/***/ "./src/system/System.ts":
/*!******************************!*\
  !*** ./src/system/System.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.System = void 0;
class System {
    constructor(sysCallback, components) {
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
    setContext(context) {
        this.context = context;
    }
    addSystemEntities(entities) {
        entities.forEach(ent => {
            this.systemEntities.set(ent.id, ent);
        });
    }
}
exports.System = System;


/***/ }),

/***/ "./src/world/World.ts":
/*!****************************!*\
  !*** ./src/world/World.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.World = void 0;
const EntityManager_1 = __webpack_require__(/*! ../entity/EntityManager */ "./src/entity/EntityManager.ts");
const ComponentManager_1 = __webpack_require__(/*! ../component/ComponentManager */ "./src/component/ComponentManager.ts");
const FPS = 60;
class World {
    constructor(context) {
        this.entityManager = new EntityManager_1.EntityManager();
        this.componentManager = new ComponentManager_1.ComponentManager();
        this.systems = [];
        this.paused = false;
        this.context = context;
    }
    loop() {
        const loopOnce = () => {
            if (!this.paused) {
                this.systems.forEach(sys => sys.run());
            }
            setTimeout(() => loopOnce(), 1000 / FPS);
        };
        loopOnce();
    }
    getEntity(id) {
        return this.entityManager.getEntity(id);
    }
    addEntity(id = this.randomId()) {
        return this.entityManager.addEntity(id);
    }
    removeEntity(entity) {
        this.entityManager.removeEntity(entity);
    }
    entityAddComponent(entity, component) {
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
    entityRemoveComponent(entity, componentName) {
        const _entity = this.getEntity(typeof entity === 'string' ? entity : entity.id);
        if (!_entity) {
            return;
        }
        _entity.removeComponent(componentName);
    }
    isComponentRegistered(componentName) {
        return this.componentManager.components.find(name => name === componentName) !== null;
    }
    registerComponent(componentName) {
        this.componentManager.components.push(componentName);
    }
    unregisterComponent(componentName) {
        const idx = this.componentManager.components.findIndex(comp => comp === componentName);
        if (idx > -1) {
            delete this.componentManager.components[idx];
        }
    }
    registerSystem(system) {
        system.setContext(this.context);
        this.systems.push(system);
        this.updateSystemsWithEntities();
    }
    updateSystemsWithEntities() {
        const entities = this.entityManager.entities;
        const systems = this.systems;
        [...entities.values()].forEach(entity => {
            systems.forEach(system => {
                if (system.components.every(comp => !!(entity.components.get(comp)))) {
                    system.addSystemEntities([entity]);
                }
            });
        });
    }
    randomId() {
        return '' + Math.random();
    }
}
exports.World = World;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.World = exports.System = exports.EntityManager = exports.Entity = exports.ComponentManager = exports.Component = void 0;
const World_1 = __webpack_require__(/*! ./world/World */ "./src/world/World.ts");
Object.defineProperty(exports, "World", ({ enumerable: true, get: function () { return World_1.World; } }));
const Component_1 = __webpack_require__(/*! ./component/Component */ "./src/component/Component.ts");
Object.defineProperty(exports, "Component", ({ enumerable: true, get: function () { return Component_1.Component; } }));
const System_1 = __webpack_require__(/*! ./system/System */ "./src/system/System.ts");
Object.defineProperty(exports, "System", ({ enumerable: true, get: function () { return System_1.System; } }));
const ComponentManager_1 = __webpack_require__(/*! ./component/ComponentManager */ "./src/component/ComponentManager.ts");
Object.defineProperty(exports, "ComponentManager", ({ enumerable: true, get: function () { return ComponentManager_1.ComponentManager; } }));
const Entity_1 = __webpack_require__(/*! ./entity/Entity */ "./src/entity/Entity.ts");
Object.defineProperty(exports, "Entity", ({ enumerable: true, get: function () { return Entity_1.Entity; } }));
const EntityManager_1 = __webpack_require__(/*! ./entity/EntityManager */ "./src/entity/EntityManager.ts");
Object.defineProperty(exports, "EntityManager", ({ enumerable: true, get: function () { return EntityManager_1.EntityManager; } }));

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUUscUNBQXFDLDJCQUEyQixFQUFDO0FBQzVHLDJCQUEyQixtQkFBTyxDQUFDLHlFQUE4QjtBQUNqRSxvREFBbUQsRUFBRSxxQ0FBcUMsK0NBQStDLEVBQUM7QUFDMUksaUJBQWlCLG1CQUFPLENBQUMsK0NBQWlCO0FBQzFDLDBDQUF5QyxFQUFFLHFDQUFxQywyQkFBMkIsRUFBQztBQUM1Ryx3QkFBd0IsbUJBQU8sQ0FBQyw2REFBd0I7QUFDeEQsaURBQWdELEVBQUUscUNBQXFDLHlDQUF5QyxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZWNzLy4vc3JjL2NvbXBvbmVudC9Db21wb25lbnQudHMiLCJ3ZWJwYWNrOi8vZWNzLy4vc3JjL2NvbXBvbmVudC9Db21wb25lbnRNYW5hZ2VyLnRzIiwid2VicGFjazovL2Vjcy8uL3NyYy9lbnRpdHkvRW50aXR5LnRzIiwid2VicGFjazovL2Vjcy8uL3NyYy9lbnRpdHkvRW50aXR5TWFuYWdlci50cyIsIndlYnBhY2s6Ly9lY3MvLi9zcmMvc3lzdGVtL1N5c3RlbS50cyIsIndlYnBhY2s6Ly9lY3MvLi9zcmMvd29ybGQvV29ybGQudHMiLCJ3ZWJwYWNrOi8vZWNzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Vjcy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQ29tcG9uZW50ID0gdm9pZCAwO1xuY2xhc3MgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBkYXRhKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSBkYXRhO1xuICAgIH1cbn1cbmV4cG9ydHMuQ29tcG9uZW50ID0gQ29tcG9uZW50O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkNvbXBvbmVudE1hbmFnZXIgPSB2b2lkIDA7XG5jbGFzcyBDb21wb25lbnRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0gW107XG4gICAgfVxuICAgIGlzQ29tcG9uZW50UmVnaXN0ZXJlZChjb21wb25lbnROYW1lKSB7XG4gICAgICAgIHJldHVybiAhISh0aGlzLmNvbXBvbmVudHMuZmluZChuYW1lID0+IG5hbWUgPT09IGNvbXBvbmVudE5hbWUpKTtcbiAgICB9XG4gICAgcmVnaXN0ZXJDb21wb25lbnQoY29tcG9uZW50TmFtZSkge1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMucHVzaChjb21wb25lbnROYW1lKTtcbiAgICB9XG4gICAgdW5yZWdpc3RlckNvbXBvbmVudChjb21wb25lbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGlkeCA9IHRoaXMuY29tcG9uZW50cy5maW5kSW5kZXgoY29tcCA9PiBjb21wID09PSBjb21wb25lbnROYW1lKTtcbiAgICAgICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5jb21wb25lbnRzW2lkeF07XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLkNvbXBvbmVudE1hbmFnZXIgPSBDb21wb25lbnRNYW5hZ2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkVudGl0eSA9IHZvaWQgMDtcbmNsYXNzIEVudGl0eSB7XG4gICAgY29uc3RydWN0b3IoaWQpIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBuZXcgTWFwKCk7XG4gICAgfVxuICAgIGFkZENvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnRzLnNldChjb21wb25lbnQubmFtZSwgY29tcG9uZW50KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIDtcbiAgICByZW1vdmVDb21wb25lbnQoY29tcG9uZW50KSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50cy5kZWxldGUodHlwZW9mIGNvbXBvbmVudCA9PT0gJ3N0cmluZycgPyBjb21wb25lbnQgOiBjb21wb25lbnQubmFtZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICA7XG4gICAgZ2V0RGF0YSgpIHtcbiAgICAgICAgbGV0IGRhdGEgPSB7fTtcbiAgICAgICAgWy4uLnRoaXMuY29tcG9uZW50cy52YWx1ZXMoKV0uZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgICAgICBkYXRhID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBkYXRhKSwgdmFsdWUudmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIHByaW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5leHBvcnRzLkVudGl0eSA9IEVudGl0eTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5FbnRpdHlNYW5hZ2VyID0gdm9pZCAwO1xuY29uc3QgRW50aXR5XzEgPSByZXF1aXJlKFwiLi9FbnRpdHlcIik7XG5jbGFzcyBFbnRpdHlNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5lbnRpdGllcyA9IG5ldyBNYXAoKTtcbiAgICB9XG4gICAgZ2V0RW50aXR5KGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVudGl0aWVzLmdldChpZCk7XG4gICAgfVxuICAgIGFkZEVudGl0eShpZCkge1xuICAgICAgICBjb25zdCBlbnRpdHkgPSBuZXcgRW50aXR5XzEuRW50aXR5KGlkKTtcbiAgICAgICAgdGhpcy5lbnRpdGllcy5zZXQoZW50aXR5LmlkLCBlbnRpdHkpO1xuICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgIH1cbiAgICByZW1vdmVFbnRpdHkoZW50aXR5KSB7XG4gICAgICAgIHRoaXMuZW50aXRpZXMuZGVsZXRlKHR5cGVvZiBlbnRpdHkgPT09ICdzdHJpbmcnID8gZW50aXR5IDogZW50aXR5LmlkKTtcbiAgICB9XG59XG5leHBvcnRzLkVudGl0eU1hbmFnZXIgPSBFbnRpdHlNYW5hZ2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlN5c3RlbSA9IHZvaWQgMDtcbmNsYXNzIFN5c3RlbSB7XG4gICAgY29uc3RydWN0b3Ioc3lzQ2FsbGJhY2ssIGNvbXBvbmVudHMpIHtcbiAgICAgICAgdGhpcy5zeXN0ZW1FbnRpdGllcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5zeXNDYWxsYmFjayA9IHN5c0NhbGxiYWNrO1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBjb21wb25lbnRzO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBudWxsO1xuICAgIH1cbiAgICBydW4oKSB7XG4gICAgICAgIGZvciAobGV0IFtfLCBlbnRpdHldIG9mIHRoaXMuc3lzdGVtRW50aXRpZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRleHQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbnRleHQgaGFzIG5vdCBiZWVuIGluaXRpYWxpc2VkIGluIG9uZSBvZiB0aGUgc3lzdGVtcyEgJyArIHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZG8gc2hpdFxuICAgICAgICAgICAgdGhpcy5zeXNDYWxsYmFjayhlbnRpdHksIHRoaXMuY29udGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2V0Q29udGV4dChjb250ZXh0KSB7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgfVxuICAgIGFkZFN5c3RlbUVudGl0aWVzKGVudGl0aWVzKSB7XG4gICAgICAgIGVudGl0aWVzLmZvckVhY2goZW50ID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3lzdGVtRW50aXRpZXMuc2V0KGVudC5pZCwgZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5TeXN0ZW0gPSBTeXN0ZW07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuV29ybGQgPSB2b2lkIDA7XG5jb25zdCBFbnRpdHlNYW5hZ2VyXzEgPSByZXF1aXJlKFwiLi4vZW50aXR5L0VudGl0eU1hbmFnZXJcIik7XG5jb25zdCBDb21wb25lbnRNYW5hZ2VyXzEgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50L0NvbXBvbmVudE1hbmFnZXJcIik7XG5jb25zdCBGUFMgPSA2MDtcbmNsYXNzIFdvcmxkIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0KSB7XG4gICAgICAgIHRoaXMuZW50aXR5TWFuYWdlciA9IG5ldyBFbnRpdHlNYW5hZ2VyXzEuRW50aXR5TWFuYWdlcigpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudE1hbmFnZXIgPSBuZXcgQ29tcG9uZW50TWFuYWdlcl8xLkNvbXBvbmVudE1hbmFnZXIoKTtcbiAgICAgICAgdGhpcy5zeXN0ZW1zID0gW107XG4gICAgICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgfVxuICAgIGxvb3AoKSB7XG4gICAgICAgIGNvbnN0IGxvb3BPbmNlID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnBhdXNlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3lzdGVtcy5mb3JFYWNoKHN5cyA9PiBzeXMucnVuKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBsb29wT25jZSgpLCAxMDAwIC8gRlBTKTtcbiAgICAgICAgfTtcbiAgICAgICAgbG9vcE9uY2UoKTtcbiAgICB9XG4gICAgZ2V0RW50aXR5KGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVudGl0eU1hbmFnZXIuZ2V0RW50aXR5KGlkKTtcbiAgICB9XG4gICAgYWRkRW50aXR5KGlkID0gdGhpcy5yYW5kb21JZCgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVudGl0eU1hbmFnZXIuYWRkRW50aXR5KGlkKTtcbiAgICB9XG4gICAgcmVtb3ZlRW50aXR5KGVudGl0eSkge1xuICAgICAgICB0aGlzLmVudGl0eU1hbmFnZXIucmVtb3ZlRW50aXR5KGVudGl0eSk7XG4gICAgfVxuICAgIGVudGl0eUFkZENvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuY29tcG9uZW50TWFuYWdlci5pc0NvbXBvbmVudFJlZ2lzdGVyZWQoY29tcG9uZW50Lm5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgX2VudGl0eSA9IHRoaXMuZ2V0RW50aXR5KHR5cGVvZiBlbnRpdHkgPT09ICdzdHJpbmcnID8gZW50aXR5IDogZW50aXR5LmlkKTtcbiAgICAgICAgaWYgKCFfZW50aXR5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgX2VudGl0eS5hZGRDb21wb25lbnQoY29tcG9uZW50KTtcbiAgICAgICAgLy8gc3lzdGVtc1xuICAgICAgICB0aGlzLnVwZGF0ZVN5c3RlbXNXaXRoRW50aXRpZXMoKTtcbiAgICB9XG4gICAgZW50aXR5UmVtb3ZlQ29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50TmFtZSkge1xuICAgICAgICBjb25zdCBfZW50aXR5ID0gdGhpcy5nZXRFbnRpdHkodHlwZW9mIGVudGl0eSA9PT0gJ3N0cmluZycgPyBlbnRpdHkgOiBlbnRpdHkuaWQpO1xuICAgICAgICBpZiAoIV9lbnRpdHkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBfZW50aXR5LnJlbW92ZUNvbXBvbmVudChjb21wb25lbnROYW1lKTtcbiAgICB9XG4gICAgaXNDb21wb25lbnRSZWdpc3RlcmVkKGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50TWFuYWdlci5jb21wb25lbnRzLmZpbmQobmFtZSA9PiBuYW1lID09PSBjb21wb25lbnROYW1lKSAhPT0gbnVsbDtcbiAgICB9XG4gICAgcmVnaXN0ZXJDb21wb25lbnQoY29tcG9uZW50TmFtZSkge1xuICAgICAgICB0aGlzLmNvbXBvbmVudE1hbmFnZXIuY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudE5hbWUpO1xuICAgIH1cbiAgICB1bnJlZ2lzdGVyQ29tcG9uZW50KGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5jb21wb25lbnRNYW5hZ2VyLmNvbXBvbmVudHMuZmluZEluZGV4KGNvbXAgPT4gY29tcCA9PT0gY29tcG9uZW50TmFtZSk7XG4gICAgICAgIGlmIChpZHggPiAtMSkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuY29tcG9uZW50TWFuYWdlci5jb21wb25lbnRzW2lkeF07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVnaXN0ZXJTeXN0ZW0oc3lzdGVtKSB7XG4gICAgICAgIHN5c3RlbS5zZXRDb250ZXh0KHRoaXMuY29udGV4dCk7XG4gICAgICAgIHRoaXMuc3lzdGVtcy5wdXNoKHN5c3RlbSk7XG4gICAgICAgIHRoaXMudXBkYXRlU3lzdGVtc1dpdGhFbnRpdGllcygpO1xuICAgIH1cbiAgICB1cGRhdGVTeXN0ZW1zV2l0aEVudGl0aWVzKCkge1xuICAgICAgICBjb25zdCBlbnRpdGllcyA9IHRoaXMuZW50aXR5TWFuYWdlci5lbnRpdGllcztcbiAgICAgICAgY29uc3Qgc3lzdGVtcyA9IHRoaXMuc3lzdGVtcztcbiAgICAgICAgWy4uLmVudGl0aWVzLnZhbHVlcygpXS5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAgICAgICBzeXN0ZW1zLmZvckVhY2goc3lzdGVtID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc3lzdGVtLmNvbXBvbmVudHMuZXZlcnkoY29tcCA9PiAhIShlbnRpdHkuY29tcG9uZW50cy5nZXQoY29tcCkpKSkge1xuICAgICAgICAgICAgICAgICAgICBzeXN0ZW0uYWRkU3lzdGVtRW50aXRpZXMoW2VudGl0eV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmFuZG9tSWQoKSB7XG4gICAgICAgIHJldHVybiAnJyArIE1hdGgucmFuZG9tKCk7XG4gICAgfVxufVxuZXhwb3J0cy5Xb3JsZCA9IFdvcmxkO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Xb3JsZCA9IGV4cG9ydHMuU3lzdGVtID0gZXhwb3J0cy5FbnRpdHlNYW5hZ2VyID0gZXhwb3J0cy5FbnRpdHkgPSBleHBvcnRzLkNvbXBvbmVudE1hbmFnZXIgPSBleHBvcnRzLkNvbXBvbmVudCA9IHZvaWQgMDtcbmNvbnN0IFdvcmxkXzEgPSByZXF1aXJlKFwiLi93b3JsZC9Xb3JsZFwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIldvcmxkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBXb3JsZF8xLldvcmxkOyB9IH0pO1xuY29uc3QgQ29tcG9uZW50XzEgPSByZXF1aXJlKFwiLi9jb21wb25lbnQvQ29tcG9uZW50XCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiQ29tcG9uZW50XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBDb21wb25lbnRfMS5Db21wb25lbnQ7IH0gfSk7XG5jb25zdCBTeXN0ZW1fMSA9IHJlcXVpcmUoXCIuL3N5c3RlbS9TeXN0ZW1cIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJTeXN0ZW1cIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFN5c3RlbV8xLlN5c3RlbTsgfSB9KTtcbmNvbnN0IENvbXBvbmVudE1hbmFnZXJfMSA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudC9Db21wb25lbnRNYW5hZ2VyXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiQ29tcG9uZW50TWFuYWdlclwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gQ29tcG9uZW50TWFuYWdlcl8xLkNvbXBvbmVudE1hbmFnZXI7IH0gfSk7XG5jb25zdCBFbnRpdHlfMSA9IHJlcXVpcmUoXCIuL2VudGl0eS9FbnRpdHlcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJFbnRpdHlcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIEVudGl0eV8xLkVudGl0eTsgfSB9KTtcbmNvbnN0IEVudGl0eU1hbmFnZXJfMSA9IHJlcXVpcmUoXCIuL2VudGl0eS9FbnRpdHlNYW5hZ2VyXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiRW50aXR5TWFuYWdlclwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gRW50aXR5TWFuYWdlcl8xLkVudGl0eU1hbmFnZXI7IH0gfSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
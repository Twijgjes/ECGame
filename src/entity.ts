import { Scene, Light } from "three";
import { Body } from "./components/Body";
import { ClickBoost } from "./components/ClickBoost";
import {
  Boundary2DCollider,
  CircleCollider,
  isCollider2D,
  RectangleCollider,
} from "./components/Collision";
import { CollisionBehavior } from "./components/CollisionBehavior";
import { DebugBox, DebugSphere } from "./components/Debug";
import { CMesh } from "./components/Mesh";
import { CPlane } from "./components/Plane";
import { CSprite } from "./components/Sprite";
import { Transform } from "./components/Transform";
import { Game } from "./game";

/**
 * The goal is to create an entity-component system that allows me to
 * access an entity's components like entity.transform.position.add(x,y,z)
 * even when that entity does not have the component yet, because we'll instantiate
 * the component on the fly with default values
 */

// function foo<T extends {}, K extends keyof T>(t: T, k: K, v: T[K]) {
//   t[k] = v;
// }
// const some = { a: "string", b: 2 };
// foo(some, "a", "string");
// const optionalSome: Partial<typeof some> = { a: "" };

// TODO:
// try making operator overloading with valueOf or toString
// and then saving context to a singleton on the first call
// using the context on the second call and emptying it again

export type IComponent =
  | Transform
  | Body
  | CMesh
  | Light
  | CSprite
  | CPlane
  | ClickBoost
  | CircleCollider
  | Boundary2DCollider
  | RectangleCollider
  | CollisionBehavior
  | DebugBox
  | DebugSphere;
const ComponentMap = {
  transform: Transform,
  body: Body,
  mesh: CMesh,
  light: Light,
  sprite: CSprite,
  plane: CPlane,
  clickBoost: ClickBoost,
  circleCollider: CircleCollider,
  boundary2DCollider: Boundary2DCollider,
  rectangleCollider: RectangleCollider,
  collisionBehavior: CollisionBehavior,
  debugBox: DebugBox,
  debugSphere: DebugSphere,
};

export class Entity {
  transform: Transform;
  body: Body;
  mesh: CMesh;
  light: Light;
  sprite: CSprite;
  plane: CPlane;
  clickBoost: ClickBoost;
  circleCollider: CircleCollider;
  boundary2DCollider: Boundary2DCollider;
  rectangleCollider: RectangleCollider;
  collisionBehavior: CollisionBehavior;
  debugBox: DebugBox;
  debugSphere: DebugSphere;

  private proxy: Entity;
  private unwrapped: Entity;

  constructor(private game: Game, public debug: boolean = false) {
    // this.entity = this;
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
    this.proxy = new Proxy(this, {
      // https://www.typescriptlang.org/docs/handbook/2/keyof-types.html
      get(target: Entity, name: keyof Entity) {
        const nname = name as keyof typeof ComponentMap;
        if (ComponentMap[nname] && !target[name]) {
          const newComponent = new ComponentMap[nname]();
          (target[name] as IComponent) = newComponent;
          if (isInitedComponent(newComponent)) {
            newComponent.init(target.proxy);
          }
          if (isSceneProp(newComponent)) {
            newComponent.addToScene(game.engine.scene);
          }
          if (isCollider2D(newComponent)) {
            game.collidables2D.push(target.proxy);
          }
        }
        return target[name];
      },
      set(target: Entity, name: keyof Entity, value: IComponent) {
        // console.info("set", name);
        const nname = name as keyof typeof ComponentMap;
        if (ComponentMap[nname]) {
          const oldComponent = target[name];
          // Clean up old component
          if (oldComponent && isSceneProp(oldComponent)) {
            oldComponent.removeFromScene(game.engine.scene);
          }

          // Set up new component
          (target[name] as IComponent) = value;
          if (isInitedComponent(value)) {
            value.init(target.proxy);
          }
          if (isSceneProp(value)) {
            value.addToScene(game.engine.scene);
          }
          if (isCollider2D(value)) {
            game.collidables2D.push(target.proxy);
          }

          return true;
        }
        return false;
      },
    });

    this.game.updateables.push(this);
    this.unwrapped = this;
    return this.proxy;
  }

  hasComponent(componentName: keyof typeof ComponentMap): IComponent {
    if (!!this.unwrapped[componentName]) {
      return this[componentName];
    }
  }

  update(deltaSeconds: number) {
    for (const [key, updateable] of Object.entries(this.proxy)) {
      // Haha fuck this is dirty
      // TODO: maybe refactor this so that all components get added to a separate array or obj?
      // But then I have to keep track of removals and additions and I'm lazy lol
      if (key === "game" || key === "proxy" || key === "unwrapped") {
        continue;
      }

      if (isUpdateableComponent(updateable)) {
        updateable.update(deltaSeconds, this.proxy);
      }
    }
  }

  log(message: string, data: any) {
    if (this.debug) {
      console.log(message, data);
    }
  }
}

export interface IUpdateable {
  update: (deltaSeconds: number) => void;
}
export interface IUpdateableComponent {
  update: (deltaSeconds: number, entity: Entity) => void;
}
function isUpdateableComponent(obj: any): obj is IUpdateableComponent {
  return !!obj && !!obj.update;
}
export interface IInitializedComponent {
  init: (entity: Entity) => void;
}
function isInitedComponent(obj: any): obj is IInitializedComponent {
  return !!obj.init;
}

export interface ISceneProp {
  addToScene: (scene: Scene) => void;
  removeFromScene: (scene: Scene) => void;
}
function isSceneProp(obj: any): obj is ISceneProp {
  return !!obj.addToScene && !!obj.removeFromScene;
}

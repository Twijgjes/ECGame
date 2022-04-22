import {
  AmbientLight,
  BoxGeometry,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  PointLight,
  Quaternion,
  SpotLight,
  Vector3,
  Scene,
  Light,
} from "three";
import { Body } from "./components/Body";
import { CMesh } from "./components/Mesh";
import { CSprite } from "./components/Sprite";
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
export type IComponent = Transform | Body | CMesh | Light | CSprite;

export class Entity {
  transform: Transform;
  body: Body;
  mesh: CMesh;
  light: Light;
  sprite: CSprite;
  private proxy: Entity;

  constructor(private game: Game) {
    // this.c = new Components();
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
    this.proxy = new Proxy(this, {
      // https://www.typescriptlang.org/docs/handbook/2/keyof-types.html
      get(target: Entity, name: keyof Entity) {
        if (!target[name]) {
          switch (name) {
            case "transform":
              target.transform = new Transform();
              break;
            case "body":
              target.body = new Body();
              break;
            case "mesh":
              target.mesh = new CMesh();
              break;
            case "light":
              target.light = new Light();
              break;
            case "sprite":
              target.sprite = new CSprite();
              break;
            default:
              console.warn("Entity does not have a", name);
              break;
          }
          // Jesus fuck, fix this shit please
          if ((target[name] as ISceneProp).addToScene) {
            (target[name] as ISceneProp).addToScene(game.engine.scene);
          }
        }

        return target[name];
      },
      set(target: Entity, _: keyof Entity, value: IComponent) {
        if (value instanceof Transform) {
          target.transform = value;
          return true;
        }
        if (value instanceof Body) {
          target.body = value;
          return true;
        }
        if (value instanceof CMesh) {
          target.mesh.removeFromScene(game.engine.scene);
          target.mesh = value;
          return true;
        }
        if (value instanceof Light) {
          target.light = value;
          return true;
        }
        if (value instanceof CSprite) {
          target.sprite.removeFromScene(game.engine.scene);
          target.sprite = value;
          return true;
        }
        return false;
      },
    });

    this.game.updateables.push(this);
    return this.proxy;
  }

  update(deltaSeconds: number) {
    for (const [key, updateable] of Object.entries(this.proxy)) {
      // Haha fuck this is dirty
      // TODO: maybe refactor this so that all components get added to a separate array or obj?
      // But then I have to keep track of removals and additions and I'm lazy lol
      if (key === "game" || key === "proxy") {
        continue;
      }

      if (updateable && updateable.update) {
        updateable.update(deltaSeconds, this.proxy);
      }
    }
  }
}

export interface IUpdateable {
  update: (deltaSeconds: number) => void;
}
export interface IUpdateableComponent {
  update: (deltaSeconds: number, components: Entity) => void;
}

export interface ISceneProp {
  addToScene: (scene: Scene) => void;
  removeFromScene: (scene: Scene) => void;
}

export class Transform {
  position: Vector3;
  rotation: Quaternion;
  scale: Vector3;

  constructor(position?: Vector3, rotation?: Quaternion, scale?: Vector3) {
    this.position = position ? position : new Vector3();
    this.rotation = rotation ? rotation : new Quaternion();
    this.scale = scale ? scale : new Vector3(1, 1, 1);
  }
}

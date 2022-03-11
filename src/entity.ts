import {
  BufferGeometry,
  Material,
  Mesh,
  MeshBasicMaterial,
  Quaternion,
  Vector3,
} from "three";

/**
 * The goal is to create an entity-component system that allows me to
 * access an entity's components like entity.transform.position.add(x,y,z)
 * even when that entity does not have the component yet, because we'll instantiate
 * the component on the fly with default values
 */
export class IEntity {
  // updateables: IUpdateable[];
  // components: IComponent[];
  transform: Transform;
  body: Body;

  // I want something like:
  // [key: string]: IComponent;
}

export class Entity extends IEntity {
  constructor() {
    super();
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
    return new Proxy(this, {
      // https://www.typescriptlang.org/docs/handbook/2/keyof-types.html
      get(target: Entity, name: keyof Entity): IComponent {
        if (!target[name]) {
          switch (name) {
            case "transform":
              target.transform = new Transform();
              break;
            case "body":
              target.body = new Body();
              break;
            default:
              console.warn("Entity does not have a", name);
              break;
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
        return false;
      },
    });
  }
}

export interface IUpdateable {
  update: (deltaSeconds: number) => void;
}

export type IComponent = Transform | Body;

export interface ITransform {
  position: Vector3;
  rotation: Quaternion;
  scale: Vector3;
}
export class Transform implements ITransform {
  position: Vector3;
  rotation: Quaternion;
  scale: Vector3;

  constructor(position?: Vector3, rotation?: Quaternion, scale?: Quaternion) {
    this.position = position ? position : new Vector3();
    this.rotation = rotation ? rotation : new Quaternion();
    this.scale = position ? position : new Vector3(1, 1, 1);
  }
}

// export class Prop {
//   // material: Material;
//   // geometry: BufferGeometry;
//   mesh: Mesh;

//   constructor(mesh: Mesh) {
//     this.mesh = mesh;
//   }

//   constructor(geometry?: BufferGeometry, material?: Material) {
//     const material =
//   }
// }

export class Body {
  velocity: Vector3;
  // rotationVelocity: Quaternion;
  // gravity: Vector3;

  constructor(velocity?: Vector3) {
    this.velocity = velocity ? velocity : new Vector3();
  }
}

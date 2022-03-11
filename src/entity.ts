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

function foo<T extends {}, K extends keyof T>(t: T, k: K, v: T[K]) {
  t[k] = v;
}
const some = { a: "string", b: 2 };
foo(some, "a", "string");
const optionalSome: Partial<typeof some> = { a: "" };

export type IComponent = {
  transform: Transform;
  body: Body;
};
// interface IComponents<T> {
//   [Key in keyof T]: T[Key];
// }

// declare const foo2: Components<IComponent>;
// // foo2.obj.

// declare type ComponentsHerman<T> =  {
//   [Key in keyof T]: T[Key];
//   new()
// };
// function ComponentsHerman<T>() {
//   return new Proxy(this, {});
// }

// const foo3 = new ComponentsHerman<IComponents>();

export class Components {
  // I want something like:
  // But then entity.transform should be just Transform, not also Body
  // public obj: { [Key in keyof T]: T[Key] };
  // components: IComponent[];
  transform: Transform;
  body: Body;

  constructor() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
    return new Proxy(this, {
      // https://www.typescriptlang.org/docs/handbook/2/keyof-types.html
      get(target: Components, name: keyof Components) {
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
      set(target: Components, _: keyof Components, value: IComponent) {
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

export class Entity {
  c: Components;

  constructor() {
    this.c = new Components();
  }

  update(deltaSeconds: number) {
    for (const [key, updateable] of Object.entries(this.c)) {
      if (updateable.update) {
        updateable.update(deltaSeconds, this.c);
      }
    }
  }
}

export interface IUpdateable {
  update: (deltaSeconds: number) => void;
}
export interface IUpdateableComponent {
  update: (deltaSeconds: number, components: Components) => void;
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

export class Body implements IUpdateableComponent {
  velocity: Vector3;
  // rotationVelocity: Quaternion;
  // gravity: Vector3;

  constructor(velocity?: Vector3) {
    // entity.updateables.push(this);
    this.velocity = velocity ? velocity : new Vector3();
  }

  update(deltaSeconds: number, components: Components) {
    components.transform.position.add(
      this.velocity.clone().multiplyScalar(deltaSeconds)
    );
  }
}

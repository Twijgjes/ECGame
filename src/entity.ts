import {
  BufferGeometry,
  Material,
  Mesh,
  MeshBasicMaterial,
  Quaternion,
  Vector3,
} from "three";

export interface Entity {
  updateables: IUpdateable[];
  components: IComponent[];
}

export function entity(): Entity {
  return {
    updateables: [],
    components: [],
  };
}

export interface IUpdateable {
  update: (delta: number) => void;
}

export type IComponent = Transform | Body;

export class Transform {
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

// export interface Body {
//   velocity: Vector3;
//   rotationVelocity: Quaternion;
//   gravity: Vector3;
// }

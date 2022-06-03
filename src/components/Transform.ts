import { Vector3, Quaternion } from "three";

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

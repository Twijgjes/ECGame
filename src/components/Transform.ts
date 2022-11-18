import { Vector3, Quaternion } from "three";
import { BaseComponent, Entity, IUpdateableComponent } from "../entity";

interface OffsetEntity {
  entity: Entity;
  offsetPosition: Vector3;
  offsetRotation: Quaternion;
  // TODO: implement offsetScale
}
export class ParentTransform implements BaseComponent, IUpdateableComponent {
  public entity: Entity;

  constructor(private children: OffsetEntity[]) {}

  update(deltaSeconds: number, entity: Entity) {
    for (const child of this.children) {
      child.entity.transform.position.copy(
        this.entity.transform.position.clone().add(child.offsetPosition)
      );
      child.entity.transform.rotation.copy(
        this.entity.transform.rotation.clone().multiply(child.offsetRotation)
      );
    }
  }
}

export class Transform implements BaseComponent {
  public entity: Entity;

  constructor(
    private _position = new Vector3(0, 0, 0),
    private _rotation = new Quaternion(),
    private _scale = new Vector3(1, 1, 1) // public children?: Array<Transform>
  ) {}

  // Prepwork for adding children
  get position() {
    return this._position;
  }

  set position(vector: Vector3) {
    this._position.copy(vector);
  }

  get rotation() {
    return this._rotation;
  }

  set rotation(quaternion: Quaternion) {
    this._rotation.copy(quaternion);
  }

  get scale() {
    return this._scale;
  }

  set scale(vector: Vector3) {
    this._scale.copy(vector);
  }

  clone() {
    return new Transform(
      this._position.clone(),
      this._rotation.clone(),
      this._scale.clone()
    );
  }
}

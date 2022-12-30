import { Vector3, Quaternion } from "three";
import { IUpdateableComponent, Entity, BaseComponent } from "../entity";

export class Body implements IUpdateableComponent, BaseComponent {
  public entity: Entity;
  constructor(
    public velocity = new Vector3(),
    public acceleration?: Vector3,
    public rotationVelocity = new Quaternion()
  ) {}

  update(deltaSeconds: number) {
    if (this.acceleration) {
      this.velocity.add(this.acceleration.clone().multiplyScalar(deltaSeconds));
    }
    this.entity.transform.position.add(
      this.velocity.clone().multiplyScalar(deltaSeconds)
    );
    this.entity.transform.rotation.multiply(this.rotationVelocity);
  }
}

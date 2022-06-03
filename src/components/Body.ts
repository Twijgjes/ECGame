import { Vector3, Quaternion } from "three";
import { IUpdateableComponent, Entity } from "../entity";

export class Body implements IUpdateableComponent {
  constructor(
    public velocity = new Vector3(),
    public acceleration?: Vector3,
    public rotationVelocity = new Quaternion()
  ) {}

  update(deltaSeconds: number, entity: Entity) {
    if (this.acceleration) {
      this.velocity.add(this.acceleration.clone().multiplyScalar(deltaSeconds));
    }
    entity.transform.position.add(
      this.velocity.clone().multiplyScalar(deltaSeconds)
    );
    entity.transform.rotation.multiply(this.rotationVelocity);
  }
}

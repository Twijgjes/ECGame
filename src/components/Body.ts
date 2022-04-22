import { Vector3, Quaternion } from "three";
import { IUpdateableComponent, Entity } from "../entity";

export class Body implements IUpdateableComponent {
  velocity: Vector3;
  rotationVelocity: Quaternion;
  gravity?: Vector3;

  constructor(
    velocity?: Vector3,
    rotationVelocity?: Quaternion,
    gravity?: Vector3
  ) {
    this.velocity = velocity ? velocity : new Vector3();
    this.rotationVelocity = rotationVelocity
      ? rotationVelocity
      : new Quaternion();
    this.gravity = gravity;
  }

  update(deltaSeconds: number, components: Entity) {
    if (this.gravity) {
      this.velocity.add(this.gravity.clone().multiplyScalar(deltaSeconds));
    }
    components.transform.position.add(
      this.velocity.clone().multiplyScalar(deltaSeconds)
    );
    components.transform.rotation.multiply(this.rotationVelocity);
  }
}

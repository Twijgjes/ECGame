import { Vector3, Quaternion } from "three";
import { BaseComponent, Entity } from "../entity";

export class InfiniteScroll implements BaseComponent {
  public entity: Entity;

  constructor(public removeBelowX: -5) {}

  update(deltaSeconds: number) {
    const position = this.entity.transform.position;
    if (this.entity.transform.position.x < this.removeBelowX) {
      // TODO: destroyFunc on entity?
    }
  }
}

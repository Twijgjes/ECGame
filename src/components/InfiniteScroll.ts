import { Vector3, Quaternion } from "three";
import { BaseComponent, Entity } from "../entity";

export class InfiniteScroll implements BaseComponent {
  public entity: Entity;

  constructor(public resetPastX = -5, public startPos = new Vector3()) {}

  update(deltaSeconds: number) {
    const position = this.entity.transform.position;
    if (this.entity.transform.position.x < this.resetPastX) {
      // TODO: destroyFunc on entity?
      this.entity.transform.position.copy(this.startPos);
    }
  }
}

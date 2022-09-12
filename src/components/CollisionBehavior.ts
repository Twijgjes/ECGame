import { BaseComponent, Entity } from "../entity";
import { Collision2D, Collision2DPerspective } from "./Collision";

export class CollisionBehavior implements BaseComponent {
  public entity: Entity;
  constructor(
    private _action: (
      collision: Collision2D,
      fromMyPerspective: Collision2DPerspective
    ) => void = () => {}
  ) {}

  public action(
    collision: Collision2D,
    fromMyPerspective: Collision2DPerspective
  ) {
    this._action(collision, fromMyPerspective);
  }
}

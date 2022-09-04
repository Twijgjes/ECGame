import { Vector2 } from "three";
import { Entity } from "../entity";
import { Collision2D } from "./Collision";

export interface CollisionFromMyPerspective extends Collision2D {
  me: Entity;
  them: Entity;
  meAvoidanceVector: Vector2;
  themAvoidanceVector: Vector2;
}

export class CollisionBehavior {
  constructor(
    private _action: (collision: Collision2D, me: string) => void = () => {}
  ) {}

  public action(collision: Collision2D, me: string) {
    // let me, them, meAvoidanceVector, themAvoidanceVector;
    // if (collision.entityA.hasComponent("collisionBehavior") === this) {
    //   me = collision.entityA;
    //   meAvoidanceVector = collision.aAvoidanceVector;
    //   them = collision.entityB;
    //   themAvoidanceVector = collision.bAvoidanceVector;
    // } else {
    //   me = collision.entityB;
    //   meAvoidanceVector = collision.bAvoidanceVector;
    //   them = collision.entityA;
    //   themAvoidanceVector = collision.aAvoidanceVector;
    // }
    this._action(collision, me);
  }
}

import { Vector2, Vector3 } from "three";
import { Entity } from "../entity";

export type SHAPE2D = "CIRCLE" | "RECTANGLE" | "BOUNDARY";
export type SHAPE3D = "SPHERE" | "CUBOID";

export function isCollider2D(obj: any): obj is Boundary2DCollider {
  return !!obj && !!obj.type2D;
}
export abstract class Collider2D {
  public readonly type2D: SHAPE2D;
}

export interface Collision {
  collision: boolean; // Wether the two have collided or not
  aAvoidanceVector: Vector2; // The direction directly away from the center of b
  bAvoidanceVector: Vector2; // The direction directly away from the center of a
  overlap: number; // Negative when not overlapping
}

export interface Boundary2D {
  maxX?: number; // Max x value allowed
  maxY?: number; // Max y value allowed
  minX?: number; // Min x value allowed
  minY?: number; // Min y value allowed
}

export function isBoundary2DCollider(obj: any): obj is Boundary2DCollider {
  return !!obj && !!obj.type2D && obj.type2D === "BOUNDARY";
}
export class Boundary2DCollider implements Collider2D {
  public readonly type2D = "BOUNDARY";
  constructor(
    public maxX?: number,
    public maxY?: number,
    public minX?: number,
    public minY?: number
  ) {}
}

export function isCircleCollider(obj: any): obj is CircleCollider {
  return !!obj && !!obj.type2D && obj.type2D === "CIRCLE";
}
export class CircleCollider implements Collider2D {
  public readonly type2D = "CIRCLE";
  constructor(public radius: number = 1) {}
}

export class CollisionSolver {
  static solveCollisions(colliders: Entity[]) {
    const c = [...colliders];
    for (let i = c.length; i > 0; i--) {
      const collidableA = c.pop();
      for (const collidableB of c) {
        CollisionSolver.solveCollision(collidableA, collidableB);
      }
    }
  }
  static solveCollision(a: Entity, b: Entity) {
    const circleA = a.hasComponent("circleCollider");
    const circleB = b.hasComponent("circleCollider");
    const boundaryA = a.hasComponent("boundary2DCollider");
    const boundaryB = b.hasComponent("boundary2DCollider");
    if (isCircleCollider(circleA) && isBoundary2DCollider(boundaryB)) {
      const collision = this.circleBoundary(a, b.boundary2DCollider);
      if (collision.collision) {
        const avoidanceVector3D = new Vector3(
          collision.aAvoidanceVector.x,
          collision.aAvoidanceVector.y,
          0
        );
        if (a.hasComponent("body")) {
          a.transform.position.add(avoidanceVector3D);
          a.body.velocity.negate();
        }
      }
    }
    if (isBoundary2DCollider(boundaryA) && isCircleCollider(circleB)) {
      const collision = this.circleBoundary(b, a.boundary2DCollider);
      if (collision.collision) {
        const avoidanceVector3D = new Vector3(
          collision.aAvoidanceVector.x,
          collision.aAvoidanceVector.y,
          0
        );
        if (b.hasComponent("body")) {
          b.transform.position.add(avoidanceVector3D);
          b.body.velocity.negate();
        }
      }
    }
    if (!!isCircleCollider(circleA) && !!isCircleCollider(circleB)) {
      const collision = this.circleCircle(a, b);
      if (collision.collision) {
        const avoidanceVector3D = new Vector3(
          collision.aAvoidanceVector.x,
          collision.aAvoidanceVector.y,
          0
        );
        // TODO: move both in proportion of their relative masses?
        a.transform.position.add(avoidanceVector3D);
        a.body.velocity.negate();
        b.body.velocity.negate();
      }
    }
  }

  static circleCircle(a: Entity, b: Entity): Collision {
    const minimumDistance = b.circleCollider.radius + a.circleCollider.radius;
    const v2a = new Vector2(a.transform.position.x, a.transform.position.y);
    const v2b = new Vector2(b.transform.position.x, b.transform.position.y);
    const aSubB = new Vector2().subVectors(v2a, v2b);
    const bSubA = new Vector2().subVectors(v2a, v2b);
    const distance = aSubB.length();
    const collision = distance < minimumDistance;
    // if (collision) {
    //   console.info("collision!");
    // }
    return {
      collision,
      aAvoidanceVector: aSubB, // a - b
      bAvoidanceVector: bSubA,
      overlap: minimumDistance - distance,
    };
  }

  static circleBoundary(a: Entity, boundary: Boundary2D) {
    let collision = false;
    let aAvoidanceVector = new Vector2();
    // Refactor for just 1 if statement
    if (
      boundary.minX &&
      a.transform.position.x - a.circleCollider.radius < boundary.minX
    ) {
      // Bonk
      collision = true;
      const overlap =
        boundary.minX - (a.transform.position.x - a.circleCollider.radius);
      aAvoidanceVector.add(new Vector2(overlap, 0));
    }

    if (
      boundary.minY &&
      a.transform.position.y - a.circleCollider.radius < boundary.minY
    ) {
      // Klonk
      collision = true;
      const overlap =
        boundary.minY - (a.transform.position.y - a.circleCollider.radius);
      aAvoidanceVector.add(new Vector2(0, overlap));
    }

    if (
      boundary.maxX &&
      a.transform.position.x + a.circleCollider.radius > boundary.maxX
    ) {
      // Toink
      collision = true;
      const overlap =
        boundary.maxX - (a.transform.position.x + a.circleCollider.radius);
      aAvoidanceVector.add(new Vector2(overlap, 0));
    }

    if (
      boundary.maxY &&
      a.transform.position.y + a.circleCollider.radius > boundary.maxY
    ) {
      // BLAM
      collision = true;
      const overlap =
        boundary.maxY - (a.transform.position.y + a.circleCollider.radius);
      aAvoidanceVector.add(new Vector2(0, overlap));
    }
    return {
      collision,
      aAvoidanceVector,
    };
  }
}

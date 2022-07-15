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

export function isRectangleCollider(obj: any): obj is RectangleCollider {
  return !!obj && !!obj.type2D && obj.type2D === "RECTANGLE";
}
export class RectangleCollider implements Collider2D {
  public readonly type2D = "RECTANGLE";
  constructor(public width: number = 1, public height: number = 1) {}
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
    // TODO: use function solve<TColl extends Collision>()...
    // So we don't lose collision fidelity but maintain genericity
    const circleA = a.hasComponent("circleCollider");
    const circleB = b.hasComponent("circleCollider");
    const boundaryA = a.hasComponent("boundary2DCollider");
    const boundaryB = b.hasComponent("boundary2DCollider");
    const rectangleA = a.hasComponent("rectangleCollider");
    const rectangleB = b.hasComponent("rectangleCollider");
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
    if (isCircleCollider(circleA) && isCircleCollider(circleB)) {
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
    // Rect vs rect
    if (isRectangleCollider(rectangleA) && isRectangleCollider(rectangleB)) {
      const collision = this.rectangleRectangle(a, b);
      if (collision.collision) {
        const avoidanceVector3D = new Vector3(
          collision.aAvoidanceVector.x,
          collision.aAvoidanceVector.y,
          0
        );
        a.transform.position.add(avoidanceVector3D);
        a.body.velocity.negate();
        b.body.velocity.negate();
      }
    }
    // Rect vs Circ
    if (isRectangleCollider(rectangleA) && isCircleCollider(circleB)) {
      const collision = this.rectangleCircle(a, b);
      if (collision.collision) {
        const avoidanceVector3D = new Vector3(
          collision.aAvoidanceVector.x,
          collision.aAvoidanceVector.y,
          0
        );
        a.transform.position.add(avoidanceVector3D);
        a.body.velocity.negate();
        b.body.velocity.negate();
      }
    }
    // Circ vs rect
    if (isCircleCollider(circleA) && isRectangleCollider(rectangleB)) {
      const collision = this.rectangleCircle(b, a);
      if (collision.collision) {
        const avoidanceVector3D = new Vector3(
          collision.aAvoidanceVector.x,
          collision.aAvoidanceVector.y,
          0
        );
        a.transform.position.add(avoidanceVector3D);
        a.body.velocity.negate();
        b.body.velocity.negate();
      }
    }
    // Rect vs boundary
    if (isRectangleCollider(rectangleA) && isBoundary2DCollider(boundaryB)) {
      // console.info("Rectangle-boundary collision not implemented yet");
    }
    // Boundary vs rect
    if (isBoundary2DCollider(boundaryA) && isRectangleCollider(rectangleB)) {
      // console.info("Rectangle-boundary collision not implemented yet");
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
    return {
      collision,
      aAvoidanceVector: aSubB, // a - b
      bAvoidanceVector: bSubA,
      overlap: minimumDistance - distance,
    };
  }

  // TODO: USE THIS https://learnopengl.com/In-Practice/2D-Game/Collisions/Collision-Detection
  static rectangleRectangle(a: Entity, b: Entity): Collision {
    const pA = new Vector2(a.transform.position.x, a.transform.position.y);
    const pB = new Vector2(b.transform.position.x, b.transform.position.y);
    const aTop = pA.y + a.rectangleCollider.height / 2;
    const aBottom = pA.y - a.rectangleCollider.height / 2;
    const bTop = pB.y + b.rectangleCollider.height / 2;
    const bBottom = pB.y - b.rectangleCollider.height / 2;
    let collisionY = aTop > bBottom || aBottom < bTop;
    const aLeft = pA.x - a.rectangleCollider.width / 2;
    const aRight = pA.x + a.rectangleCollider.width / 2;
    const bLeft = pB.x - b.rectangleCollider.width / 2;
    const bRight = pB.x + b.rectangleCollider.width / 2;
    let collisionX = aLeft < bRight || aRight > bLeft;
    return {
      collision: collisionY && collisionX,
      // TODO: USE THIS https://learnopengl.com/In-Practice/2D-Game/Collisions/Collision-Detection

      aAvoidanceVector: new Vector2().subVectors(pA, pB), //aSubB, // a - b
      bAvoidanceVector: new Vector2().subVectors(pB, pA), // bSubA,
      overlap: 0,
    };
  }

  static rectangleCircle(rect: Entity, circ: Entity): Collision {
    // Using methods from: https://learnopengl.com/In-Practice/2D-Game/Collisions/Collision-Detection
    // Get vector from rectangle center to circle center
    const pRect = new Vector2(
      rect.transform.position.x,
      rect.transform.position.y
    );
    const pCircle = new Vector2(
      circ.transform.position.x,
      circ.transform.position.y
    );
    const rectToCirc = new Vector2().subVectors(pCircle, pRect);

    // Clamp resulting vector (vecRtoC) to rectangle half-extents
    const halfExt = new Vector2(
      rect.rectangleCollider.width / 2,
      rect.rectangleCollider.height / 2
    );
    rectToCirc.clamp(halfExt.clone().negate(), halfExt);

    // This results in point P, check if P is within the circle radius
    const P = new Vector2().addVectors(rectToCirc, pRect);
    // Add P to rectangle pos, subtract result from circle to get difference.
    const PToCircle = new Vector2().subVectors(pCircle, P);
    // If so, we have collision
    const collision = PToCircle.length() < circ.circleCollider.radius;

    return {
      collision,

      aAvoidanceVector: new Vector2().subVectors(pRect, pCircle), //aSubB, // a - b
      bAvoidanceVector: new Vector2().subVectors(pCircle, pRect), // bSubA,
      overlap: 0,
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

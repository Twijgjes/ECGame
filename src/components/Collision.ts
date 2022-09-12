import { Vector2 } from "three";
import { BaseComponent, Entity } from "../entity";

// Implement for 2D: https://www.npmjs.com/package/detect-collisions
// For 3D https://github.com/kripken/ammo.js
// maybe use https://www.npmjs.com/package/ammojs-typed

export type SHAPE2D = "CIRCLE" | "RECTANGLE" | "BOUNDARY";
export type SHAPE3D = "SPHERE" | "CUBOID";

export function isCollider2D(obj: any): obj is Boundary2DCollider {
  return !!obj && !!obj.type2D;
}
export abstract class Collider2D {
  public readonly type2D: SHAPE2D;
}

export interface Collision2DPerspective {
  self: Entity;
  other: Entity;
  selfCollider: CircleCollider | RectangleCollider | Boundary2DCollider;
  otherCollider: CircleCollider | RectangleCollider | Boundary2DCollider;
}

export interface Collision2D {
  collision: boolean;
  overlap: number;
  a: Collision2DPerspective;
  b: Collision2DPerspective;
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
export class Boundary2DCollider implements Collider2D, BaseComponent {
  public entity: Entity;
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
export class CircleCollider implements Collider2D, BaseComponent {
  public entity: Entity;
  public readonly type2D = "CIRCLE";
  constructor(public radius: number = 1) {}
}

export function isRectangleCollider(obj: any): obj is RectangleCollider {
  return !!obj && !!obj.type2D && obj.type2D === "RECTANGLE";
}
export class RectangleCollider implements Collider2D, BaseComponent {
  public entity: Entity;
  public readonly type2D = "RECTANGLE";
  constructor(
    entity: Entity,
    public width: number = 1,
    public height: number = 1
  ) {}
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
    let collision;
    if (isCircleCollider(circleA) && isBoundary2DCollider(boundaryB)) {
      collision = this.circleBoundary(a, b);
    }
    if (isBoundary2DCollider(boundaryA) && isCircleCollider(circleB)) {
      collision = this.circleBoundary(b, a);
    }
    if (isCircleCollider(circleA) && isCircleCollider(circleB)) {
      collision = this.circleCircle(a, b);
    }
    // Rect vs rect
    if (isRectangleCollider(rectangleA) && isRectangleCollider(rectangleB)) {
      collision = this.rectangleRectangle(a, b);
    }
    // Rect vs Circ
    if (isRectangleCollider(rectangleA) && isCircleCollider(circleB)) {
      collision = this.rectangleCircle(a, b);
    }
    // Circ vs rect
    if (isCircleCollider(circleA) && isRectangleCollider(rectangleB)) {
      collision = this.rectangleCircle(b, a);
    }
    // Rect vs boundary
    if (isRectangleCollider(rectangleA) && isBoundary2DCollider(boundaryB)) {
      // console.info("Rectangle-boundary collision not implemented yet");
    }
    // Boundary vs rect
    if (isBoundary2DCollider(boundaryA) && isRectangleCollider(rectangleB)) {
      // console.info("Rectangle-boundary collision not implemented yet");
    }

    // TODO: Clean me I'm dirty
    if (collision && collision.collision) {
      if (a.hasComponent("collisionBehavior")) {
        a.collisionBehavior.action(collision, collision.a);
      }
      // Make sure the collisionbehavior action has logic to determine which entity they are (a or b)
      if (b.hasComponent("collisionBehavior")) {
        b.collisionBehavior.action(collision, collision.b);
      }
    }
  }

  static circleCircle(a: Entity, b: Entity): Collision2D {
    const minimumDistance = b.circleCollider.radius + a.circleCollider.radius;
    const v2a = new Vector2(a.transform.position.x, a.transform.position.y);
    const v2b = new Vector2(b.transform.position.x, b.transform.position.y);
    const aSubB = new Vector2().subVectors(v2a, v2b);
    // const bSubA = new Vector2().subVectors(v2a, v2b);
    const distance = aSubB.length();
    const collision = distance < minimumDistance;
    return {
      collision,
      overlap: minimumDistance - distance,
      a: {
        self: a,
        other: b,
        selfCollider: a.circleCollider,
        otherCollider: b.circleCollider,
      },
      b: {
        self: b,
        other: a,
        selfCollider: b.circleCollider,
        otherCollider: a.circleCollider,
      },
    };
  }

  // TODO: USE THIS https://learnopengl.com/In-Practice/2D-Game/Collisions/Collision-Detection
  static rectangleRectangle(a: Entity, b: Entity): Collision2D {
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
    const collision = collisionY && collisionX;
    // return {

    //   // TODO: USE THIS https://learnopengl.com/In-Practice/2D-Game/Collisions/Collision-Detection

    //   // aAvoidanceVector: new Vector2().subVectors(pA, pB), //aSubB, // a - b
    //   // bAvoidanceVector: new Vector2().subVectors(pB, pA), // bSubA,
    //   overlap: 0,
    //   entityA: a,
    //   entityB: b,
    // };
    return {
      collision,
      overlap: 0, // TODO: actually calc this
      a: {
        self: a,
        other: b,
        selfCollider: a.rectangleCollider,
        otherCollider: b.rectangleCollider,
      },
      b: {
        self: b,
        other: a,
        selfCollider: b.rectangleCollider,
        otherCollider: a.rectangleCollider,
      },
    };
  }

  static rectangleCircle(rectA: Entity, circB: Entity): Collision2D {
    // Using methods from: https://learnopengl.com/In-Practice/2D-Game/Collisions/Collision-Detection
    // Get vector from rectangle center to circle center
    const pRect = new Vector2(
      rectA.transform.position.x,
      rectA.transform.position.y
    );
    const pCircle = new Vector2(
      circB.transform.position.x,
      circB.transform.position.y
    );
    const rectToCirc = new Vector2().subVectors(pCircle, pRect);

    // Clamp resulting vector (vecRtoC) to rectangle half-extents
    const halfExt = new Vector2(
      rectA.rectangleCollider.width / 2,
      rectA.rectangleCollider.height / 2
    );
    rectToCirc.clamp(halfExt.clone().negate(), halfExt);

    // This results in point P, check if P is within the circle radius
    const P = new Vector2().addVectors(rectToCirc, pRect);
    // Add P to rectangle pos, subtract result from circle to get difference.
    const PToCircle = new Vector2().subVectors(pCircle, P);
    // If so, we have collision
    const collision = PToCircle.length() < circB.circleCollider.radius;
    const overlap = circB.circleCollider.radius - PToCircle.length(); // TODO: still not right maybe, doublecheck me

    return {
      collision,
      overlap, // TODO: actually calc this
      a: {
        self: rectA,
        other: circB,
        selfCollider: rectA.rectangleCollider,
        otherCollider: circB.circleCollider,
      },
      b: {
        self: circB,
        other: rectA,
        selfCollider: circB.circleCollider,
        otherCollider: rectA.rectangleCollider,
      },
    };
  }

  static circleBoundary(a: Entity, b: Entity): Collision2D {
    const boundary = b.boundary2DCollider;
    let collision = false;
    let overlap = 0;
    // let aAvoidanceVector = new Vector2();
    // Refactor for just 1 if statement
    if (
      boundary.minX &&
      a.transform.position.x - a.circleCollider.radius < boundary.minX
    ) {
      // Bonk
      collision = true;
      overlap =
        boundary.minX - (a.transform.position.x - a.circleCollider.radius);
      // aAvoidanceVector.add(new Vector2(overlap, 0));
    }

    if (
      boundary.minY &&
      a.transform.position.y - a.circleCollider.radius < boundary.minY
    ) {
      // Klonk
      collision = true;
      overlap =
        boundary.minY - (a.transform.position.y - a.circleCollider.radius);
      // aAvoidanceVector.add(new Vector2(0, overlap));
    }

    if (
      boundary.maxX &&
      a.transform.position.x + a.circleCollider.radius > boundary.maxX
    ) {
      // Toink
      collision = true;
      overlap =
        boundary.maxX - (a.transform.position.x + a.circleCollider.radius);
      // aAvoidanceVector.add(new Vector2(overlap, 0));
    }

    if (
      boundary.maxY &&
      a.transform.position.y + a.circleCollider.radius > boundary.maxY
    ) {
      // BLAM
      collision = true;
      overlap =
        boundary.maxY - (a.transform.position.y + a.circleCollider.radius);
      // aAvoidanceVector.add(new Vector2(0, overlap));
    }

    return {
      collision,
      overlap,
      a: {
        self: a,
        other: b,
        selfCollider: a.circleCollider,
        otherCollider: b.boundary2DCollider,
      },
      b: {
        self: b,
        other: b,
        selfCollider: b.boundary2DCollider,
        otherCollider: a.circleCollider,
      },
    };
  }
}

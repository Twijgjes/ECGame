import { Vector3 } from "three";
import { ClickBoost } from "../behaviors/ClickBoost";
import { DebugSphere } from "../components/Debug";
import { Entity } from "../entity";
import { Game, gameOver } from "../game";

import berdArmBentImg from "../assets/images/punchbird_arm_bent.png";

export function createPunchbird(game: Game): Entity {
  const punchbird = new Entity(game);
  // punchbird.sprite.setTexture(berdArmBentImg);
  punchbird.plane;
  punchbird.plane.setTexture(berdArmBentImg);
  // punchbird.transform.rotation.setFromEuler(new Euler(0, 0, 180), true);
  // punchbird.transform.scale.multiplyScalar(1.4);
  // (punchbird.plane.mesh.material as MeshBasicMaterial).wireframe = true;
  // punchbird.body.rotationVelocity.setFromEuler(new Euler(0, 0, 0.01));
  punchbird.body.velocity = new Vector3(0, 0, 0);
  punchbird.body.acceleration = new Vector3(0, -10, 0);
  // punchbird.body.rotationVelocity(1, 1, 1);
  // punchbird.clickBoost;
  new ClickBoost(punchbird);
  const radius = 0.3;
  punchbird.circleCollider.radius = radius;
  punchbird.debugSphere = new DebugSphere(radius);
  punchbird.collisionBehavior.action = (collision, fromMyPerspective) => {
    // console.info("overlap:", collision.overlap);
    // Move entity out of collision range
    const vel = fromMyPerspective.self.body.velocity;
    const direction = vel.clone().negate().setLength(collision.overlap);
    fromMyPerspective.self.transform.position.add(direction);
    // Hacky way of reflection
    vel.multiply(
      Math.abs(vel.y) > Math.abs(vel.x)
        ? new Vector3(0, -1, 0)
        : new Vector3(-1, 0, 0)
    );
    gameOver(game);
  };
  return punchbird;
}

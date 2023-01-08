import { Vector3 } from "three";
import { ClickBoost } from "../behaviors/ClickBoost";
import { DebugSphere } from "../components/Debug";
import { Entity } from "../entity";
import { Game } from "../game";

import berdArmBentImg from "../assets/images/punchbird_arm_bent.png";

export function createPunchbird(game: Game): Entity {
  const punchbird = new Entity(game, "punchbird");

  punchbird.plane.setTexture(berdArmBentImg);
  punchbird.body.velocity = new Vector3(0, 0, 0);
  punchbird.body.acceleration = new Vector3(0, -10, 0);
  new ClickBoost(punchbird);

  const radius = 0.3;
  punchbird.circleCollider.radius = radius;
  // punchbird.debugSphere = new DebugSphere(radius);
  punchbird.collisionBehavior.action = (collision, fromMyPerspective) => {
    console.info(
      fromMyPerspective.self.name,
      "collided with",
      fromMyPerspective.other.name
    );
    if (
      fromMyPerspective.other.name === "pipe" ||
      fromMyPerspective.other.name === "ground"
    ) {
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
      game.gameOver();
    } else if (fromMyPerspective.other.name === "fist") {
      console.info("✊");
      fromMyPerspective.other.destroy();
    }
  };
  return punchbird;
}

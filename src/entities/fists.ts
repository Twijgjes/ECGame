import { Vector3 } from "three";
import fistImg from "../assets/images/FIST.png";
import { Spawner } from "../components/Spawner";
import { Entity } from "../entity";
import { Game } from "../game";

export function createFists(game: Game, moveSpeed: number) {
  const fistFactory = (debug = false) => {
    const fist = new Entity(game, "fist");
    fist.plane.setTexture(fistImg);
    fist.body.velocity.setX(moveSpeed);
    fist.circleCollider.radius = 0.4;
    fist.debugSphere.radius = 0.4;
    return fist;
  };
  const fist = fistFactory();
  fist.transform.position.x = -2;
  fist.transform.position.y = 3;

  const fistSpawner = new Entity(game, "fistSpawner");
  fistSpawner.transform.position = new Vector3(6, 1, 0);
  fistSpawner.transform.scale.setScalar(0.8);
  fistSpawner.spawner = new Spawner(
    10,
    2000,
    fistFactory,
    new Vector3(0, 2, 0)
  );
}

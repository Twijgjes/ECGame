import { Vector3, Quaternion, Euler } from "three";
import { RectangleCollider } from "../components/Collision";
import { DebugBox } from "../components/Debug";
import { Spawner } from "../components/Spawner";
import { ParentTransform } from "../components/Transform";
import { Entity } from "../entity";
import { Game } from "../game";

import longpipeImg from "../assets/images/longpipe.png";

export function createPipes(game: Game, moveSpeed: number) {
  const pipePairFactory = () => {
    // Make top pipe
    const topPipe = simplePipeFactory();
    // Make bottom pipe
    const bottomPipe = simplePipeFactory();

    // Make pipe parent
    const parent = new Entity(game, "pipeParent");
    parent.body.velocity.setX(moveSpeed);
    parent.parentTransform = new ParentTransform([
      {
        entity: topPipe,
        offsetPosition: new Vector3(0, 4, 0),
        offsetRotation: new Quaternion().setFromEuler(
          new Euler(0, 0, Math.PI),
          true
        ),
      },
      {
        entity: bottomPipe,
        offsetPosition: new Vector3(0, -4, 0),
        offsetRotation: new Quaternion(),
      },
    ]);
    return parent;
    // attatch both pipes as children
  };

  const simplePipeFactory = (debug = false) => {
    const pipe = new Entity(game, "pipe");
    pipe.plane.setTexture(longpipeImg);
    pipe.transform.scale.y = 5.9;
    if (debug) {
      pipe.debugBox = new DebugBox(new Vector3(0.8, 6, 1));
    }
    pipe.rectangleCollider = new RectangleCollider(pipe, 0.8, 6);
    return pipe;
  };

  const pipeSpawner = new Entity(game, "pipeSpawner");
  pipeSpawner.transform.position = new Vector3(4, 1, 0);
  pipeSpawner.spawner = new Spawner(
    10,
    2000,
    pipePairFactory,
    new Vector3(0, 3, 0)
  );

  return pipeSpawner;
}

import { Color, Euler, Quaternion, Sprite, Vector3 } from "three";
import { Entity, IUpdateable } from "./entity";
import { Engine, threeSetup } from "./threeSetup";
import groundImg from "./assets/images/ground.png";
import bushesImg from "./assets/images/bushes.png";
import cloudsImg from "./assets/images/clouds.png";
import longpipeImg from "./assets/images/longpipe.png";
import titleImg from "./assets/images/title.png";
import fistImg from "./assets/images/FIST.png";
import { CollisionSolver, RectangleCollider } from "./components/Collision";
import { DebugBox } from "./components/Debug";
import { InfiniteScroll } from "./components/InfiniteScroll";
import { ParentTransform } from "./components/Transform";
import { Spawner } from "./components/Spawner";
import { Pause } from "./behaviors/Pause";
import { createPunchbird } from "./entities/punchbird";
import { createRestartButton } from "./entities/restartButton";

export interface Game {
  engine: Engine;
  updateables: IUpdateable[];
  collidables2D: Entity[];
  lastTick: number;
  paused: boolean;
}

export function initialize(): Game {
  const engine = threeSetup(document.body);
  const game = {
    engine,
    updateables: [] as IUpdateable[],
    collidables2D: [] as Entity[],
    lastTick: Date.now(),
    paused: false,
  };
  game.engine.camera.position.z = 5;
  game.engine.scene.background = new Color("rgb(81,189,205)");
  new Pause(game);

  // Basic way of making pixels
  // const geometry = new BoxGeometry();
  // const material = new MeshBasicMaterial({ color: 0xff0 });
  // const cube = new Mesh(geometry, material);
  // cube.position.x = -2;
  // game.engine.scene.add(cube);
  // game.updateables.push({
  //   update: (deltaSeconds) => {
  //     cube.rotation.x += 1 * deltaSeconds;
  //     cube.rotation.y += 1 * deltaSeconds;
  //   },
  // });

  // Pure polygonale porno
  // const polygon = new Entity(game);
  // polygon.mesh; // If you touch, it exist

  // polygon.body.rotationVelocity.setFromEuler(new Euler(0.01, 0.01, 0));
  // polygon.mesh.material = new MeshPhongMaterial({ color: 0xff0 });
  // polygon.transform.scale.setScalar(0.5);
  // polygon.body.gravity = new Vector3(0, -9.81, 0);
  const moveSpeed = -2;

  const parallaxEntity = (
    width: number,
    spawnPos: Vector3,
    textureUrl: string,
    moveSpeedMultiplier = 1,
    hasBoundary = false
  ) => {
    const entity = new Entity(game);
    entity.sprite.setTexture(textureUrl);
    entity.transform.position.copy(spawnPos);
    if (hasBoundary) {
      entity.boundary2DCollider.minY = -2.4;
    }
    entity.body.velocity = new Vector3(moveSpeed * moveSpeedMultiplier, 0, 0);
    entity.infiniteScroll = new InfiniteScroll(
      -(width * 2),
      new Vector3(width * 2, spawnPos.y, spawnPos.z)
    );
  };

  const gw = 5.95;
  let groundStart = -gw * 2;
  const gxp = () => (groundStart += gw);
  const groundEntities = [
    parallaxEntity(gw, new Vector3(gxp(), -3.1, 0), groundImg, 1, true),
    parallaxEntity(gw, new Vector3(gxp(), -3.1, 0), groundImg, 1, true),
    parallaxEntity(gw, new Vector3(gxp(), -3.1, 0), groundImg, 1, true),
    parallaxEntity(gw, new Vector3(gxp(), -3.1, 0), groundImg, 1, true),
  ];

  const bushWidth = 5.95;
  let bushStartX = -bushWidth * 2;
  const xPos = () => (bushStartX += bushWidth);
  const bushEntities = [
    parallaxEntity(bushWidth, new Vector3(xPos(), -1.7, -0.1), bushesImg, 0.5),
    parallaxEntity(bushWidth, new Vector3(xPos(), -1.7, -0.1), bushesImg, 0.5),
    parallaxEntity(bushWidth, new Vector3(xPos(), -1.7, -0.1), bushesImg, 0.5),
    parallaxEntity(bushWidth, new Vector3(xPos(), -1.7, -0.1), bushesImg, 0.5),
  ];

  const cloudWidth = 5.95;
  let cloudStartX = -cloudWidth * 2;
  const cxp = () => (cloudStartX += cloudWidth);
  const cloudEntities = [
    parallaxEntity(cloudWidth, new Vector3(cxp(), -0.7, -0.2), cloudsImg, 0.2),
    parallaxEntity(cloudWidth, new Vector3(cxp(), -0.7, -0.2), cloudsImg, 0.2),
    parallaxEntity(cloudWidth, new Vector3(cxp(), -0.7, -0.2), cloudsImg, 0.2),
    parallaxEntity(cloudWidth, new Vector3(cxp(), -0.7, -0.2), cloudsImg, 0.2),
  ];

  const punchbird = createPunchbird(game);

  const title = new Entity(game);
  title.transform.position.set(0, 2.6, 0);
  // title.sprite.sprite.rotation.set(90, 90, 90);
  // title.body.rotationVelocity.setFromEuler(new Euler(1, 1, 0.1));
  title.sprite.setTexture(titleImg);

  const pipePairFactory = () => {
    // Make top pipe
    const topPipe = simplePipeFactory();
    // Make bottom pipe
    const bottomPipe = simplePipeFactory();

    // Make pipe parent
    const parent = new Entity(game);
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
    const pipe = new Entity(game);
    pipe.plane.setTexture(longpipeImg);
    pipe.transform.scale.y = 5.9;
    if (debug) {
      pipe.debugBox = new DebugBox(new Vector3(0.8, 6, 1));
    }
    pipe.rectangleCollider = new RectangleCollider(pipe, 0.8, 6);
    return pipe;
  };

  const pipeSpawner = new Entity(game);
  pipeSpawner.transform.position = new Vector3(4, 1, 0);
  pipeSpawner.spawner = new Spawner(
    10,
    2000,
    pipePairFactory,
    new Vector3(0, 3, 0)
  );

  const fistFactory = (debug = false) => {
    const fist = new Entity(game);
    fist.plane.setTexture(fistImg);
    return fist;
  };
  const fist = fistFactory();
  fist.transform.position.x = -2;
  fist.transform.position.y = 3;

  return game;
}

export function start(game: Game) {
  update(game);
}

export function gameOver(game: Game) {
  // Spawn restart button
  game.paused = true;
  const restartbutton = createRestartButton(game);
}

function update(game: Game) {
  requestAnimationFrame(() => update(game));
  // Determine the delta between the last tick and this one
  if (!game.paused) {
    const now = Date.now();
    const deltaSeconds = (now - game.lastTick) / 1000;
    game.lastTick = now;

    // Loop through entities
    // If entity can be updated, do so
    for (const updateable of game.updateables) {
      updateable.update(deltaSeconds);
    }
    CollisionSolver.solveCollisions(game.collidables2D);
  }

  game.engine.renderer.render(game.engine.scene, game.engine.camera);
}

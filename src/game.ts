import { Color, Euler, Vector3 } from "three";
import { Entity, IUpdateable } from "./entity";
import { Engine, threeSetup } from "./threeSetup";
import groundImg from "./assets/images/ground.png";
import bushesImg from "./assets/images/bushes.png";
import cloudsImg from "./assets/images/clouds.png";
import longpipeImg from "./assets/images/longpipe.png";
import titleImg from "./assets/images/title.png";
import berdArmBentImg from "./assets/images/punchbird_arm_bent.png";
import { CollisionSolver, RectangleCollider } from "./components/Collision";
import { DebugBox, DebugSphere } from "./components/Debug";

export interface Game {
  engine: Engine;
  updateables: IUpdateable[];
  collidables2D: Entity[];
  lastTick: number;
}

export function initialize(): Game {
  const engine = threeSetup(document.body);
  const game = {
    engine,
    updateables: [] as IUpdateable[],
    collidables2D: [] as Entity[],
    lastTick: Date.now(),
  };
  game.engine.camera.position.z = 5;
  game.engine.scene.background = new Color("rgb(81,189,205)");

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

  const ground = new Entity(game);
  ground.sprite.setTexture(groundImg);
  ground.transform.position.set(0, -3.1, 0);
  ground.boundary2DCollider.minY = -3.1;
  // ground.hasComponent("body");

  const bushes = new Entity(game);
  bushes.sprite.setTexture(bushesImg);
  bushes.transform.position.set(0, -1.7, -0.1);

  const clouds = new Entity(game);
  clouds.sprite.setTexture(cloudsImg);
  clouds.transform.position.set(0, -0.7, -0.2);

  const punchbird = new Entity(game);
  // punchbird.sprite.setTexture(berdArmBentImg);
  punchbird.plane;
  punchbird.plane.setTexture(berdArmBentImg);
  // punchbird.transform.scale.multiplyScalar(1.4);
  // (punchbird.plane.mesh.material as MeshBasicMaterial).wireframe = true;
  punchbird.body.rotationVelocity.setFromEuler(new Euler(0, 0, 0.01));
  punchbird.body.velocity = new Vector3(5, 0, 0);
  punchbird.body.acceleration = new Vector3(0, -10, 0);
  punchbird.clickBoost;
  punchbird.circleCollider.radius = 1;
  punchbird.debugSphere = new DebugSphere(0.4);
  // punchbird.

  const title = new Entity(game);
  title.transform.position.set(0, 2.6, 0);
  // title.sprite.sprite.rotation.set(90, 90, 90);
  // title.body.rotationVelocity.setFromEuler(new Euler(1, 1, 0.1));
  title.sprite.setTexture(titleImg);

  const pipe = new Entity(game);
  pipe.transform.position.set(2, -3.5, -0.05);
  pipe.sprite.setTexture(longpipeImg);
  pipe.debugBox = new DebugBox(new Vector3(0.8, 6, 1));
  pipe.rectangleCollider = new RectangleCollider(0.8, 6);

  // const ambientLight = new Entity(game);
  // ambientLight.c.light = new Light(new AmbientLight(0x404040, 1));
  // console.info(ambientLight.c.light);
  // game.engine.scene.add(ambientLight.c.light.light);

  // const lamp = new Entity(game);
  // lamp.c.light.light.position.y = 5;
  // lamp.c.light.light.position.z = 5;
  // game.engine.scene.add(lamp.c.light.light);

  return game;
}

export function start(game: Game) {
  update(game);
}

function update(game: Game) {
  requestAnimationFrame(() => update(game));
  // Determine the delta between the last tick and this one
  const now = Date.now();
  const deltaSeconds = (now - game.lastTick) / 1000;
  game.lastTick = now;
  for (const updateable of game.updateables) {
    updateable.update(deltaSeconds);
  }
  CollisionSolver.solveCollisions(game.collidables2D);

  game.engine.renderer.render(game.engine.scene, game.engine.camera);
  // Loop through entities
  // If entity can be updated, do so
}

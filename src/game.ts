import { BoxGeometry, Euler, Mesh, MeshBasicMaterial } from "three";
import { Entity, IUpdateable } from "./entity";
import { Engine, threeSetup } from "./threeSetup";

export interface Game {
  engine: Engine;
  updateables: IUpdateable[];
  lastTick: number;
}

export function initialize(): Game {
  const engine = threeSetup(document.body);
  const game = {
    engine,
    updateables: [] as IUpdateable[],
    lastTick: Date.now(),
  };
  game.engine.camera.position.z = 5;

  // Basic way of making pixels
  const geometry = new BoxGeometry();
  const material = new MeshBasicMaterial({ color: 0xff0 });
  const cube = new Mesh(geometry, material);
  cube.position.x = -2;
  game.engine.scene.add(cube);
  game.updateables.push({
    update: (deltaSeconds) => {
      cube.rotation.x += 1 * deltaSeconds;
      cube.rotation.y += 1 * deltaSeconds;
    },
  });

  // Pure polygonale porno
  const polygon = new Entity(game);
  game.engine.scene.add(polygon.c.prop.mesh);
  // polygon.c.transform.position.y = 1;
  polygon.c.body.rotationVelocity.setFromEuler(new Euler(0.01, 0.01, 0));
  // polygon.c.prop.mesh.material = new MeshPhongMaterial({ color: 0xff0 });
  // polygon.c.transform.scale.setScalar(0.5);
  // polygon.c.body.gravity = new Vector3(0, -9.81, 0);s

  const punchbird = new Entity(game);
  punchbird.c.transform.position.set(2, 0, 0);
  game.engine.scene.add(punchbird.c.sprite.sprite); // Just touch it

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
  game.engine.renderer.render(game.engine.scene, game.engine.camera);
  // Loop through entities
  // If entity can be updated, do so
}

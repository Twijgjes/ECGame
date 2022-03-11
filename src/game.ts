import { Entity, IUpdateable } from "./entity";
import { Engine, threeSetup } from "./threeSetup";
import { threeTestSetup } from "./utils/threeTestSetup";

interface Game {
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
  const cube = threeTestSetup(game.engine);
  game.updateables.push({
    update: (deltaSeconds) => {
      cube.rotation.x += 1 * deltaSeconds;
      cube.rotation.y += 1 * deltaSeconds;
    },
  });

  // Vies goor experiment:
  const entityA = new Entity();
  entityA.c.transform.position.x = 2;
  console.info(entityA.c.transform.position.x);

  const entityB = new Entity();
  console.info(entityB.c.transform.position.x);

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

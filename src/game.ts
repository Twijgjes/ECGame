import { Engine, threeSetup } from "./threeSetup";

interface Game {
  engine: Engine;
}

export function initialize(): Game {
  const engine = threeSetup(document.body);
  const game = {
    engine,
  };
  return game;
}

export function start(game: Game) {
  update(game);
}

function update(game: Game) {
  requestAnimationFrame(() => update(game));
  // Loop through entities
  // If entity can be updated, do so
}

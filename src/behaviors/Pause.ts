import { Game } from "../game";

export class Pause {
  constructor(game: Game) {
    document.addEventListener("keypress", (event) => {
      if (event.code === "KeyP") {
        game.paused = !game.paused;
        if (!game.paused) {
          game.lastTick = Date.now();
        }
      }
    });
  }
}

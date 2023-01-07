// import { initialize, start } from "./game";
import { Game } from "./game";
import "./style.css";

function init() {
  const game = new Game();
  game.start();
  // const game = initialize();
  // start(game);
}
init();

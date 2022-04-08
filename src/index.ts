import { initialize, start } from "./game";
import "./style.css";

function init() {
  const game = initialize();
  start(game);
}
init();
